import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
}));
app.use(morgan('combined'));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'Pixel Adventure API is running',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/packages', async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from('topup_packages')
      .select('*')
      .eq('is_active', true)
      .order('display_order');

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching packages:', error);
    res.status(500).json({ error: 'Failed to fetch packages' });
  }
});

app.post('/api/purchase', async (req, res) => {
  try {
    const { userId, packageId, paymentMethod } = req.body;

    const { data: pkg, error: pkgError } = await supabase
      .from('topup_packages')
      .select('*')
      .eq('id', packageId)
      .single();

    if (pkgError || !pkg) {
      return res.status(404).json({ error: 'Package not found' });
    }

    const transactionId = `TXN${Date.now()}${Math.random().toString(36).substring(2, 8)}`;
    const totalCoins = (pkg as { coins: number; bonus_coins: number }).coins + (pkg as { coins: number; bonus_coins: number }).bonus_coins;

    const { error: purchaseError } = await supabase.from('purchases').insert({
      user_id: userId,
      package_id: packageId,
      amount: (pkg as { price: number }).price,
      currency: (pkg as { currency: string }).currency,
      payment_method: paymentMethod,
      transaction_id: transactionId,
      status: 'completed',
      completed_at: new Date().toISOString(),
    });

    if (purchaseError) throw purchaseError;

    const { error: updateError } = await supabase.rpc('increment_user_coins', {
      user_id: userId,
      coins_to_add: totalCoins,
    });

    if (updateError) {
      await supabase
        .from('user_profiles')
        .select('coins')
        .eq('id', userId)
        .single()
        .then(async ({ data }) => {
          await supabase
            .from('user_profiles')
            .update({ coins: ((data as { coins: number }).coins || 0) + totalCoins })
            .eq('id', userId);
        });
    }

    res.json({
      success: true,
      transactionId,
      coins: totalCoins,
    });
  } catch (error) {
    console.error('Purchase error:', error);
    res.status(500).json({ error: 'Purchase failed' });
  }
});

app.get('/api/leaderboard', async (req, res) => {
  try {
    const { type = 'score', limit = '100' } = req.query;

    let query = supabase
      .from('game_scores')
      .select('*, user_profiles!user_id(username, display_name, avatar_url)')
      .limit(parseInt(limit as string));

    if (type === 'score') {
      query = query.order('score', { ascending: false });
    } else if (type === 'level') {
      query = query.order('level', { ascending: false });
    } else if (type === 'speed') {
      query = query.order('time_played', { ascending: true });
    }

    const { data, error } = await query;

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

app.post('/api/score', async (req, res) => {
  try {
    const { userId, score, level, timePlayed, world } = req.body;

    const { error } = await supabase.from('game_scores').insert({
      user_id: userId,
      score,
      level,
      time_played: timePlayed,
      world,
    });

    if (error) throw error;

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('highest_level')
      .eq('id', userId)
      .single();

    if (profile && level > (profile as { highest_level: number }).highest_level) {
      await supabase
        .from('user_profiles')
        .update({ highest_level: level })
        .eq('id', userId);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error submitting score:', error);
    res.status(500).json({ error: 'Failed to submit score' });
  }
});

app.get('/api/versions', async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from('game_versions')
      .select('*')
      .order('release_date', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching versions:', error);
    res.status(500).json({ error: 'Failed to fetch versions' });
  }
});

app.get('/api/achievements', async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from('achievements')
      .select('*');

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching achievements:', error);
    res.status(500).json({ error: 'Failed to fetch achievements' });
  }
});

app.post('/api/achievement/unlock', async (req, res) => {
  try {
    const { userId, achievementId } = req.body;

    const { error } = await supabase.from('user_achievements').insert({
      user_id: userId,
      achievement_id: achievementId,
    });

    if (error) {
      if (error.code === '23505') {
        return res.status(409).json({ error: 'Achievement already unlocked' });
      }
      throw error;
    }

    const { data: achievement } = await supabase
      .from('achievements')
      .select('*')
      .eq('id', achievementId)
      .single();

    if (achievement) {
      const ach = achievement as { reward_coins: number; reward_gems: number };
      if (ach.reward_coins > 0 || ach.reward_gems > 0) {
        await supabase.rpc('add_rewards', {
          user_id: userId,
          coins: ach.reward_coins,
          gems: ach.reward_gems,
        });
      }
    }

    res.json({ success: true, achievement });
  } catch (error) {
    console.error('Error unlocking achievement:', error);
    res.status(500).json({ error: 'Failed to unlock achievement' });
  }
});

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    const { error } = await supabase.from('contact_messages').insert({
      name,
      email,
      subject,
      message,
    });

    if (error) throw error;

    res.json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`🎮 Pixel Adventure API running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
});

export default app;
