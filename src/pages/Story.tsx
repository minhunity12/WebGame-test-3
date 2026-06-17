import { motion } from 'framer-motion';
import { BookOpen, Map, Castle, Swords, Sparkles, TreePine, Mountain, Waves, Flame, Star } from 'lucide-react';

const chapters = [
  {
    id: 1,
    title: 'Khởi Đầu Huyền Thoại',
    description: 'Trong một vương quốc hòa bình, sự xuất hiện của một cổ vật cổ xưa đã đánh thức những thế lực bóng tối. Bạn - một chiến binh trẻ tuổi, buộc phải bước vào hành trình tìm lại sự sáng suốt cho vương quốc.',
    image: 'https://images.pexels.com/photos/12948893/pexels-photo-12948893.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: Star,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 2,
    title: 'Rừng Sâu Bí Ẩn',
    description: 'Khu rừng cổ thụ nơi quái vật đầu tiên xuất hiện. Những sinh vật biến dạng lang thang giữa những tán cây xám xịt. Bạn phải tìm ra nguồn gốc của chúng.',
    image: 'https://images.pexels.com/photos/16713263/pexels-photo-16713263.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: TreePine,
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 3,
    title: 'Đỉnh Núi Sương Mù',
    description: 'Trên đỉnh núi cao ngất, một lâu đài cổ kính ẩn trong sương mù. Người ta tin rằng nơi đây chứa chiếc chìa khóa mở ra cánh cổng bóng tối.',
    image: 'https://images.pexels.com/photos/136719/pexels-photo-136719.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: Mountain,
    color: 'from-slate-500 to-gray-500',
  },
  {
    id: 4,
    title: 'Vùng Đất Chết',
    description: 'Cựu thủ đô của vương quốc giờ đây trở thành vùng đất chết. Xác sống và linh hồn lạc lối lang thang tìm kiếm sự cứu rỗi. Sự thật được chôn sâu dưới lòng đất nơi đây.',
    image: 'https://images.pexels.com/photos/992434/pexels-photo-992434.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: Flame,
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 5,
    title: 'Biển Không Đáy',
    description: 'Một đại dương bao quanh vương quốc, nơi sinh vật huyền bí cai quản những bí mật cổ xưa nhất. Bạn cần thỏa thuận với thủy quái để vượt qua.',
    image: 'https://images.pexels.com/photos/22624253/pexels-photo-22624253.jpeg?auto=compile&cs=tinysrgb&w=800',
    icon: Waves,
    color: 'from-blue-600 to-indigo-500',
  },
  {
    id: 6,
    title: 'Thành Phố Kết Tinh',
    description: 'Thành trì cuối cùng của lòng người. Tại đây, trận chiến cuối cùng sẽ diễn ra để quyết định vận mệnh của cả vương quốc.',
    image: 'https://images.pexels.com/photos/16709311/pexels-photo-16709311.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: Castle,
    color: 'from-yellow-500 to-orange-500',
  },
];

const characters = [
  {
    name: 'Nova - Chiến Binh Ánh Sáng',
    description: 'Nhân vật chính với khả năng điều khiển ánh sáng. Mất cha mẹ lúc nhỏ, được sư phụ nuôi dạy thành một chiến binh tài ba.',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    name: 'Zara - Nữ Pháp Sư Bóng Tối',
    description: 'Một phù thủy bí ẩn giúp đỡ Nova trong hành trình. Mục đích thật sự của cô vẫn còn là bí ẩn.',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    name: 'Rex - Vệ Sĩ Thú',
    description: 'Một sinh vật giống chó sói mạnh mẽ, trung thành bảo vệ Nova. Có khả năng biến hình và cảm nhận nguy hiểm.',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
];

export default function Story() {
  return (
    <div className="pt-24 pb-16">
      <section className="py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-sm font-medium mb-6">
              <BookOpen className="w-4 h-4" />
              Cốt Truyện
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Hành Trình <span className="gradient-text">Huyền Thoại</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Khám phá câu chuyện đầy cảm xúc về lòng can đảm, tình bạn và sự hy sinh trong hành trình cứu vãn vương quốc.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-3xl overflow-hidden mb-20"
          >
            <div className="absolute inset-0">
              <img
                src="https://images.pexels.com/photos/16709311/pexels-photo-16709311.jpeg?auto=compress&cs=tinysrgb&w=1920"
                alt="Story"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/70 to-transparent" />
            </div>

            <div className="relative p-8 lg:p-16 max-w-2xl">
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-white mb-4">
                Năm 2089, Vương Quốc Aurora
              </h2>
              <p className="text-gray-300 leading-relaxed">
                Aurora từng là vương quốc thịnh vượng và hòa bình nhất thế giới. Cho đến ngày sinh nhật lần thứ 500
                của vương quốc, một cổ tích cổ xưa được khai quật - Viên Ngọc Vĩnh Cửu. Ai cũng tin đó là món quà
                may mắn, không ai ngờ nó lại là chìa khóa đánh thức Chúa Tể Bóng Tối ngủ quên suốt 1000 năm.
              </p>
            </div>
          </motion.div>

          <div className="mb-20">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-2xl lg:text-3xl font-bold text-white mb-10 text-center"
            >
              Chương <span className="gradient-text">Truyện</span>
            </motion.h2>

            <div className="space-y-8">
              {chapters.map((chapter, index) => {
                const Icon = chapter.icon;
                const isEven = index % 2 === 0;

                return (
                  <motion.div
                    key={chapter.id}
                    initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className={`flex flex-col lg:flex-row items-center gap-8 ${
                      isEven ? '' : 'lg:flex-row-reverse'
                    }`}
                  >
                    <div className="w-full lg:w-1/2">
                      <div className="relative rounded-2xl overflow-hidden aspect-video">
                        <img
                          src={chapter.image}
                          alt={chapter.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${chapter.color} text-white text-sm font-bold mb-2`}>
                            <span>Chương {chapter.id}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="w-full lg:w-1/2">
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${chapter.color} flex items-center justify-center`}>
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="font-display text-xl lg:text-2xl font-bold text-white">
                          {chapter.title}
                        </h3>
                      </div>
                      <p className="text-gray-400 leading-relaxed">
                        {chapter.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-2xl lg:text-3xl font-bold text-white mb-10 text-center">
              Nhân Vật <span className="gradient-text">Chính</span>
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {characters.map((char, index) => (
                <motion.div
                  key={char.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="game-card rounded-2xl p-6 text-center"
                >
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 mx-auto mb-4 overflow-hidden">
                    <img
                      src={char.avatar}
                      alt={char.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-display text-lg font-bold text-white mb-2">
                    {char.name}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {char.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
