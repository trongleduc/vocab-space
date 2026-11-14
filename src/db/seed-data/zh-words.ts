/** [term, pinyin, meaning, level, topic, part of speech, examples: [sentence, pinyin, translation][]] */
export type ZhRow = [string, string, string, string, string, string, [string, string, string][]];

export const ZH_WORDS: ZhRow[] = [
  // ---------- HSK1 · Chào hỏi ----------
  ["你好", "nǐ hǎo", "xin chào", "HSK1", "Chào hỏi", "cụm từ", [
    ["[你好]，我叫小明。", "Nǐ hǎo, wǒ jiào Xiǎomíng.", "Xin chào, tôi tên là Tiểu Minh."],
    ["老师，[你好]！", "Lǎoshī, nǐ hǎo!", "Em chào thầy/cô!"],
  ]],
  ["谢谢", "xièxie", "cảm ơn", "HSK1", "Chào hỏi", "động từ", [
    ["[谢谢]你的帮助。", "Xièxie nǐ de bāngzhù.", "Cảm ơn sự giúp đỡ của bạn."],
  ]],
  ["对不起", "duìbuqǐ", "xin lỗi", "HSK1", "Chào hỏi", "động từ", [
    ["[对不起]，我来晚了。", "Duìbuqǐ, wǒ lái wǎn le.", "Xin lỗi, tôi đến muộn."],
  ]],
  ["没关系", "méi guānxi", "không sao, không có gì", "HSK1", "Chào hỏi", "cụm từ", [
    ["A: 对不起！B: [没关系]。", "A: Duìbuqǐ! B: Méi guānxi.", "A: Xin lỗi! B: Không sao đâu."],
  ]],
  ["再见", "zàijiàn", "tạm biệt", "HSK1", "Chào hỏi", "động từ", [
    ["明天见，[再见]！", "Míngtiān jiàn, zàijiàn!", "Mai gặp nhé, tạm biệt!"],
  ]],
  ["名字", "míngzi", "tên", "HSK1", "Chào hỏi", "danh từ", [
    ["你叫什么[名字]？", "Nǐ jiào shénme míngzi?", "Bạn tên là gì?"],
  ]],
  ["认识", "rènshi", "quen biết, nhận ra", "HSK1", "Chào hỏi", "động từ", [
    ["很高兴[认识]你。", "Hěn gāoxìng rènshi nǐ.", "Rất vui được làm quen với bạn."],
    ["你[认识]这个字吗？", "Nǐ rènshi zhège zì ma?", "Bạn có biết chữ này không?"],
  ]],

  // ---------- HSK1 · Gia đình & con người ----------
  ["爸爸", "bàba", "bố", "HSK1", "Gia đình", "danh từ", [
    ["我[爸爸]是医生。", "Wǒ bàba shì yīshēng.", "Bố tôi là bác sĩ."],
  ]],
  ["妈妈", "māma", "mẹ", "HSK1", "Gia đình", "danh từ", [
    ["[妈妈]在做饭。", "Māma zài zuò fàn.", "Mẹ đang nấu cơm."],
  ]],
  ["哥哥", "gēge", "anh trai", "HSK1", "Gia đình", "danh từ", [
    ["我[哥哥]比我大三岁。", "Wǒ gēge bǐ wǒ dà sān suì.", "Anh trai tôi lớn hơn tôi ba tuổi."],
  ]],
  ["姐姐", "jiějie", "chị gái", "HSK1", "Gia đình", "danh từ", [
    ["我[姐姐]在北京工作。", "Wǒ jiějie zài Běijīng gōngzuò.", "Chị gái tôi làm việc ở Bắc Kinh."],
  ]],
  ["弟弟", "dìdi", "em trai", "HSK1", "Gia đình", "danh từ", [
    ["[弟弟]喜欢踢足球。", "Dìdi xǐhuan tī zúqiú.", "Em trai thích đá bóng."],
  ]],
  ["妹妹", "mèimei", "em gái", "HSK1", "Gia đình", "danh từ", [
    ["我[妹妹]今年八岁。", "Wǒ mèimei jīnnián bā suì.", "Em gái tôi năm nay tám tuổi."],
  ]],
  ["家", "jiā", "nhà, gia đình", "HSK1", "Gia đình", "danh từ", [
    ["我[家]有四口人。", "Wǒ jiā yǒu sì kǒu rén.", "Nhà tôi có bốn người."],
    ["我们回[家]吧。", "Wǒmen huí jiā ba.", "Chúng ta về nhà thôi."],
  ]],
  ["朋友", "péngyou", "bạn bè", "HSK1", "Con người", "danh từ", [
    ["他是我的好[朋友]。", "Tā shì wǒ de hǎo péngyou.", "Anh ấy là bạn thân của tôi."],
  ]],
  ["老师", "lǎoshī", "giáo viên", "HSK1", "Trường học", "danh từ", [
    ["王[老师]教我们汉语。", "Wáng lǎoshī jiāo wǒmen Hànyǔ.", "Thầy Vương dạy chúng tôi tiếng Hán."],
  ]],
  ["学生", "xuésheng", "học sinh, sinh viên", "HSK1", "Trường học", "danh từ", [
    ["我是大[学生]。", "Wǒ shì dàxuéshēng.", "Tôi là sinh viên đại học."],
  ]],
  ["医生", "yīshēng", "bác sĩ", "HSK1", "Sức khỏe", "danh từ", [
    ["你应该去看[医生]。", "Nǐ yīnggāi qù kàn yīshēng.", "Bạn nên đi khám bác sĩ."],
  ]],

  // ---------- HSK1 · Động từ cơ bản ----------
  ["爱", "ài", "yêu", "HSK1", "Cảm xúc", "động từ", [
    ["我[爱]我的家人。", "Wǒ ài wǒ de jiārén.", "Tôi yêu gia đình mình."],
  ]],
  ["喜欢", "xǐhuan", "thích", "HSK1", "Cảm xúc", "động từ", [
    ["我[喜欢]喝茶。", "Wǒ xǐhuan hē chá.", "Tôi thích uống trà."],
    ["你[喜欢]什么颜色？", "Nǐ xǐhuan shénme yánsè?", "Bạn thích màu gì?"],
  ]],
  ["吃", "chī", "ăn", "HSK1", "Ăn uống", "động từ", [
    ["你[吃]饭了吗？", "Nǐ chī fàn le ma?", "Bạn ăn cơm chưa?"],
  ]],
  ["喝", "hē", "uống", "HSK1", "Ăn uống", "động từ", [
    ["我想[喝]一杯咖啡。", "Wǒ xiǎng hē yì bēi kāfēi.", "Tôi muốn uống một cốc cà phê."],
  ]],
  ["看", "kàn", "nhìn, xem, đọc", "HSK1", "Hoạt động", "động từ", [
    ["晚上我们去[看]电影吧。", "Wǎnshang wǒmen qù kàn diànyǐng ba.", "Tối nay chúng ta đi xem phim nhé."],
  ]],
  ["听", "tīng", "nghe", "HSK1", "Hoạt động", "động từ", [
    ["他每天[听]音乐。", "Tā měitiān tīng yīnyuè.", "Anh ấy nghe nhạc mỗi ngày."],
  ]],
  ["说", "shuō", "nói", "HSK1", "Giao tiếp", "động từ", [
    ["你会[说]汉语吗？", "Nǐ huì shuō Hànyǔ ma?", "Bạn có biết nói tiếng Hán không?"],
  ]],
  ["写", "xiě", "viết", "HSK1", "Trường học", "động từ", [
    ["请把名字[写]在这儿。", "Qǐng bǎ míngzi xiě zài zhèr.", "Hãy viết tên vào đây."],
  ]],
  ["读", "dú", "đọc", "HSK1", "Trường học", "động từ", [
    ["请大家[读]课文。", "Qǐng dàjiā dú kèwén.", "Mời cả lớp đọc bài khóa."],
  ]],
  ["买", "mǎi", "mua", "HSK1", "Mua sắm", "động từ", [
    ["我去超市[买]东西。", "Wǒ qù chāoshì mǎi dōngxi.", "Tôi đi siêu thị mua đồ."],
  ]],
  ["去", "qù", "đi", "HSK1", "Đi lại", "động từ", [
    ["你明天[去]哪儿？", "Nǐ míngtiān qù nǎr?", "Ngày mai bạn đi đâu?"],
  ]],
  ["来", "lái", "đến", "HSK1", "Đi lại", "động từ", [
    ["欢迎你[来]我家。", "Huānyíng nǐ lái wǒ jiā.", "Chào mừng bạn đến nhà tôi."],
  ]],
  ["回", "huí", "về, trở lại", "HSK1", "Đi lại", "động từ", [
    ["我六点[回]家。", "Wǒ liù diǎn huí jiā.", "Tôi về nhà lúc sáu giờ."],
  ]],
  ["坐", "zuò", "ngồi; đi (xe)", "HSK1", "Đi lại", "động từ", [
    ["请[坐]。", "Qǐng zuò.", "Mời ngồi."],
    ["我[坐]地铁上班。", "Wǒ zuò dìtiě shàngbān.", "Tôi đi tàu điện ngầm đi làm."],
  ]],
  ["想", "xiǎng", "muốn; nhớ; nghĩ", "HSK1", "Cảm xúc", "động từ", [
    ["我[想]去中国旅游。", "Wǒ xiǎng qù Zhōngguó lǚyóu.", "Tôi muốn đi du lịch Trung Quốc."],
    ["我很[想]你。", "Wǒ hěn xiǎng nǐ.", "Anh rất nhớ em."],
  ]],
  ["会", "huì", "biết (làm gì), sẽ", "HSK1", "Hoạt động", "động từ năng nguyện", [
    ["她[会]弹钢琴。", "Tā huì tán gāngqín.", "Cô ấy biết chơi piano."],
    ["明天[会]下雨。", "Míngtiān huì xià yǔ.", "Ngày mai sẽ mưa."],
  ]],
  ["能", "néng", "có thể", "HSK1", "Hoạt động", "động từ năng nguyện", [
    ["你[能]帮我一下吗？", "Nǐ néng bāng wǒ yíxià ma?", "Bạn có thể giúp tôi một chút không?"],
  ]],
  ["知道", "zhīdào", "biết", "HSK1", "Giao tiếp", "động từ", [
    ["我不[知道]他住在哪儿。", "Wǒ bù zhīdào tā zhù zài nǎr.", "Tôi không biết anh ấy sống ở đâu."],
  ]],
  ["学习", "xuéxí", "học tập", "HSK1", "Trường học", "động từ", [
    ["我在[学习]中文。", "Wǒ zài xuéxí Zhōngwén.", "Tôi đang học tiếng Trung."],
  ]],
  ["工作", "gōngzuò", "làm việc; công việc", "HSK1", "Công việc", "động từ / danh từ", [
    ["你在哪儿[工作]？", "Nǐ zài nǎr gōngzuò?", "Bạn làm việc ở đâu?"],
    ["这个[工作]很有意思。", "Zhège gōngzuò hěn yǒu yìsi.", "Công việc này rất thú vị."],
  ]],
  ["睡觉", "shuìjiào", "đi ngủ", "HSK1", "Hoạt động", "động từ", [
    ["我每天十一点[睡觉]。", "Wǒ měitiān shíyī diǎn shuìjiào.", "Mỗi ngày tôi đi ngủ lúc mười một giờ."],
  ]],
  ["起床", "qǐchuáng", "thức dậy", "HSK1", "Hoạt động", "động từ", [
    ["你几点[起床]？", "Nǐ jǐ diǎn qǐchuáng?", "Bạn dậy lúc mấy giờ?"],
  ]],

  // ---------- HSK1 · Thời gian ----------
  ["今天", "jīntiān", "hôm nay", "HSK1", "Thời gian", "danh từ", [
    ["[今天]星期几？", "Jīntiān xīngqī jǐ?", "Hôm nay là thứ mấy?"],
  ]],
  ["明天", "míngtiān", "ngày mai", "HSK1", "Thời gian", "danh từ", [
    ["我们[明天]见。", "Wǒmen míngtiān jiàn.", "Ngày mai gặp nhé."],
  ]],
  ["昨天", "zuótiān", "hôm qua", "HSK1", "Thời gian", "danh từ", [
    ["[昨天]我去了书店。", "Zuótiān wǒ qù le shūdiàn.", "Hôm qua tôi đã đi hiệu sách."],
  ]],
  ["现在", "xiànzài", "bây giờ", "HSK1", "Thời gian", "danh từ", [
    ["[现在]几点了？", "Xiànzài jǐ diǎn le?", "Bây giờ là mấy giờ rồi?"],
  ]],
  ["晚上", "wǎnshang", "buổi tối", "HSK1", "Thời gian", "danh từ", [
    ["[晚上]你有空吗？", "Wǎnshang nǐ yǒu kòng ma?", "Tối nay bạn có rảnh không?"],
  ]],
  ["星期", "xīngqī", "tuần; thứ", "HSK1", "Thời gian", "danh từ", [
    ["一个[星期]有七天。", "Yí gè xīngqī yǒu qī tiān.", "Một tuần có bảy ngày."],
  ]],
  ["时候", "shíhou", "lúc, khi", "HSK1", "Thời gian", "danh từ", [
    ["你什么[时候]有时间？", "Nǐ shénme shíhou yǒu shíjiān?", "Khi nào bạn có thời gian?"],
  ]],

  // ---------- HSK1 · Ăn uống, mua sắm, nơi chốn ----------
  ["水", "shuǐ", "nước", "HSK1", "Ăn uống", "danh từ", [
    ["请给我一杯[水]。", "Qǐng gěi wǒ yì bēi shuǐ.", "Làm ơn cho tôi một cốc nước."],
  ]],
  ["茶", "chá", "trà", "HSK1", "Ăn uống", "danh từ", [
    ["中国人很喜欢喝[茶]。", "Zhōngguórén hěn xǐhuan hē chá.", "Người Trung Quốc rất thích uống trà."],
  ]],
  ["米饭", "mǐfàn", "cơm", "HSK1", "Ăn uống", "danh từ", [
    ["我要一碗[米饭]。", "Wǒ yào yì wǎn mǐfàn.", "Tôi muốn một bát cơm."],
  ]],
  ["水果", "shuǐguǒ", "hoa quả", "HSK1", "Ăn uống", "danh từ", [
    ["多吃[水果]对身体好。", "Duō chī shuǐguǒ duì shēntǐ hǎo.", "Ăn nhiều hoa quả tốt cho sức khỏe."],
  ]],
  ["钱", "qián", "tiền", "HSK1", "Mua sắm", "danh từ", [
    ["这个多少[钱]？", "Zhège duōshao qián?", "Cái này bao nhiêu tiền?"],
  ]],
  ["东西", "dōngxi", "đồ vật, đồ đạc", "HSK1", "Mua sắm", "danh từ", [
    ["你买了什么[东西]？", "Nǐ mǎi le shénme dōngxi?", "Bạn đã mua đồ gì vậy?"],
  ]],
  ["贵", "guì", "đắt", "HSK1", "Mua sắm", "tính từ", [
    ["这件衣服太[贵]了。", "Zhè jiàn yīfu tài guì le.", "Bộ quần áo này đắt quá."],
  ]],
  ["商店", "shāngdiàn", "cửa hàng", "HSK1", "Nơi chốn", "danh từ", [
    ["[商店]九点开门。", "Shāngdiàn jiǔ diǎn kāimén.", "Cửa hàng mở cửa lúc chín giờ."],
  ]],
  ["医院", "yīyuàn", "bệnh viện", "HSK1", "Nơi chốn", "danh từ", [
    ["他生病了，在[医院]。", "Tā shēngbìng le, zài yīyuàn.", "Anh ấy bị ốm, đang ở bệnh viện."],
  ]],
  ["学校", "xuéxiào", "trường học", "HSK1", "Trường học", "danh từ", [
    ["我们[学校]很大。", "Wǒmen xuéxiào hěn dà.", "Trường chúng tôi rất rộng."],
  ]],
  ["飞机", "fēijī", "máy bay", "HSK1", "Đi lại", "danh từ", [
    ["我坐[飞机]去上海。", "Wǒ zuò fēijī qù Shànghǎi.", "Tôi đi máy bay tới Thượng Hải."],
  ]],
  ["出租车", "chūzūchē", "taxi", "HSK1", "Đi lại", "danh từ", [
    ["我们打[出租车]去吧。", "Wǒmen dǎ chūzūchē qù ba.", "Chúng ta bắt taxi đi nhé."],
  ]],

  // ---------- HSK1 · Tính từ, thời tiết ----------
  ["高兴", "gāoxìng", "vui vẻ", "HSK1", "Cảm xúc", "tính từ", [
    ["今天我很[高兴]。", "Jīntiān wǒ hěn gāoxìng.", "Hôm nay tôi rất vui."],
  ]],
  ["漂亮", "piàoliang", "đẹp", "HSK1", "Con người", "tính từ", [
    ["这个地方真[漂亮]！", "Zhège dìfang zhēn piàoliang!", "Nơi này đẹp thật!"],
  ]],
  ["天气", "tiānqì", "thời tiết", "HSK1", "Thời tiết", "danh từ", [
    ["今天[天气]怎么样？", "Jīntiān tiānqì zěnmeyàng?", "Thời tiết hôm nay thế nào?"],
  ]],
  ["冷", "lěng", "lạnh", "HSK1", "Thời tiết", "tính từ", [
    ["北京的冬天很[冷]。", "Běijīng de dōngtiān hěn lěng.", "Mùa đông ở Bắc Kinh rất lạnh."],
  ]],
  ["热", "rè", "nóng", "HSK1", "Thời tiết", "tính từ", [
    ["今天太[热]了。", "Jīntiān tài rè le.", "Hôm nay nóng quá."],
  ]],
  ["下雨", "xià yǔ", "mưa", "HSK1", "Thời tiết", "động từ", [
    ["外面在[下雨]，带伞吧。", "Wàimiàn zài xià yǔ, dài sǎn ba.", "Ngoài trời đang mưa, mang ô đi."],
  ]],

  // ---------- HSK2 ----------
  ["旅游", "lǚyóu", "du lịch", "HSK2", "Đi lại", "động từ", [
    ["暑假我们去云南[旅游]。", "Shǔjià wǒmen qù Yúnnán lǚyóu.", "Kỳ nghỉ hè chúng tôi đi du lịch Vân Nam."],
  ]],
  ["运动", "yùndòng", "vận động, thể thao", "HSK2", "Sức khỏe", "động từ / danh từ", [
    ["每天[运动]半个小时。", "Měitiān yùndòng bàn gè xiǎoshí.", "Mỗi ngày vận động nửa tiếng."],
  ]],
  ["游泳", "yóuyǒng", "bơi", "HSK2", "Hoạt động", "động từ", [
    ["夏天我常常去[游泳]。", "Xiàtiān wǒ chángcháng qù yóuyǒng.", "Mùa hè tôi thường đi bơi."],
  ]],
  ["唱歌", "chànggē", "hát", "HSK2", "Hoạt động", "động từ", [
    ["她[唱歌]唱得很好听。", "Tā chànggē chàng de hěn hǎotīng.", "Cô ấy hát rất hay."],
  ]],
  ["准备", "zhǔnbèi", "chuẩn bị", "HSK2", "Hoạt động", "động từ", [
    ["我在[准备]明天的考试。", "Wǒ zài zhǔnbèi míngtiān de kǎoshì.", "Tôi đang chuẩn bị cho bài thi ngày mai."],
  ]],
  ["帮助", "bāngzhù", "giúp đỡ", "HSK2", "Giao tiếp", "động từ / danh từ", [
    ["谢谢你的[帮助]。", "Xièxie nǐ de bāngzhù.", "Cảm ơn sự giúp đỡ của bạn."],
    ["朋友之间应该互相[帮助]。", "Péngyou zhījiān yīnggāi hùxiāng bāngzhù.", "Bạn bè nên giúp đỡ lẫn nhau."],
  ]],
  ["介绍", "jièshào", "giới thiệu", "HSK2", "Giao tiếp", "động từ", [
    ["我来[介绍]一下，这是我同事。", "Wǒ lái jièshào yíxià, zhè shì wǒ tóngshì.", "Để tôi giới thiệu, đây là đồng nghiệp của tôi."],
  ]],
  ["希望", "xīwàng", "hy vọng", "HSK2", "Cảm xúc", "động từ / danh từ", [
    ["[希望]你早日康复。", "Xīwàng nǐ zǎorì kāngfù.", "Mong bạn sớm bình phục."],
  ]],
  ["觉得", "juéde", "cảm thấy, cho rằng", "HSK2", "Cảm xúc", "động từ", [
    ["我[觉得]这本书很有意思。", "Wǒ juéde zhè běn shū hěn yǒu yìsi.", "Tôi thấy cuốn sách này rất hay."],
  ]],
  ["已经", "yǐjīng", "đã", "HSK2", "Từ nối", "phó từ", [
    ["他[已经]走了。", "Tā yǐjīng zǒu le.", "Anh ấy đi rồi."],
  ]],
  ["一起", "yìqǐ", "cùng nhau", "HSK2", "Từ nối", "phó từ", [
    ["我们[一起]吃午饭吧。", "Wǒmen yìqǐ chī wǔfàn ba.", "Chúng ta cùng ăn trưa nhé."],
  ]],
  ["因为", "yīnwèi", "bởi vì", "HSK2", "Từ nối", "liên từ", [
    ["[因为]下雨，所以比赛取消了。", "Yīnwèi xià yǔ, suǒyǐ bǐsài qǔxiāo le.", "Vì trời mưa nên trận đấu bị hủy."],
  ]],
  ["所以", "suǒyǐ", "cho nên", "HSK2", "Từ nối", "liên từ", [
    ["他病了，[所以]没来上课。", "Tā bìng le, suǒyǐ méi lái shàngkè.", "Cậu ấy bị ốm nên không đến lớp."],
  ]],
  ["但是", "dànshì", "nhưng", "HSK2", "Từ nối", "liên từ", [
    ["这个很好，[但是]太贵了。", "Zhège hěn hǎo, dànshì tài guì le.", "Cái này rất tốt nhưng đắt quá."],
  ]],
  ["告诉", "gàosu", "nói cho biết", "HSK2", "Giao tiếp", "động từ", [
    ["请[告诉]我你的电话号码。", "Qǐng gàosu wǒ nǐ de diànhuà hàomǎ.", "Hãy cho tôi biết số điện thoại của bạn."],
  ]],
  ["找", "zhǎo", "tìm", "HSK2", "Hoạt động", "động từ", [
    ["我在[找]我的钥匙。", "Wǒ zài zhǎo wǒ de yàoshi.", "Tôi đang tìm chìa khóa."],
  ]],
  ["送", "sòng", "tặng; tiễn, đưa", "HSK2", "Hoạt động", "động từ", [
    ["生日的时候，他[送]了我一本书。", "Shēngrì de shíhou, tā sòng le wǒ yì běn shū.", "Vào sinh nhật, anh ấy tặng tôi một cuốn sách."],
    ["我[送]你去机场。", "Wǒ sòng nǐ qù jīchǎng.", "Tôi đưa bạn ra sân bay."],
  ]],
  ["穿", "chuān", "mặc, đi (giày)", "HSK2", "Mua sắm", "động từ", [
    ["今天很冷，多[穿]点儿衣服。", "Jīntiān hěn lěng, duō chuān diǎnr yīfu.", "Hôm nay lạnh, mặc thêm áo vào."],
  ]],
  ["远", "yuǎn", "xa", "HSK2", "Nơi chốn", "tính từ", [
    ["你家离公司[远]吗？", "Nǐ jiā lí gōngsī yuǎn ma?", "Nhà bạn có xa công ty không?"],
  ]],
  ["快", "kuài", "nhanh", "HSK2", "Hoạt động", "tính từ", [
    ["他跑得很[快]。", "Tā pǎo de hěn kuài.", "Anh ấy chạy rất nhanh."],
  ]],
  ["开始", "kāishǐ", "bắt đầu", "HSK2", "Thời gian", "động từ", [
    ["电影七点[开始]。", "Diànyǐng qī diǎn kāishǐ.", "Phim bắt đầu lúc bảy giờ."],
  ]],
  ["考试", "kǎoshì", "thi, kỳ thi", "HSK2", "Trường học", "động từ / danh từ", [
    ["下个星期有[考试]。", "Xià gè xīngqī yǒu kǎoshì.", "Tuần sau có kỳ thi."],
  ]],
  ["公司", "gōngsī", "công ty", "HSK2", "Công việc", "danh từ", [
    ["她在一家外国[公司]上班。", "Tā zài yì jiā wàiguó gōngsī shàngbān.", "Cô ấy làm ở một công ty nước ngoài."],
  ]],
  ["生日", "shēngrì", "sinh nhật", "HSK2", "Gia đình", "danh từ", [
    ["祝你[生日]快乐！", "Zhù nǐ shēngrì kuàilè!", "Chúc bạn sinh nhật vui vẻ!"],
  ]],
  ["房间", "fángjiān", "phòng", "HSK2", "Nơi chốn", "danh từ", [
    ["我的[房间]不大，但很干净。", "Wǒ de fángjiān bú dà, dàn hěn gānjìng.", "Phòng tôi không lớn nhưng rất sạch."],
  ]],
  ["颜色", "yánsè", "màu sắc", "HSK2", "Mua sắm", "danh từ", [
    ["这件衣服有别的[颜色]吗？", "Zhè jiàn yīfu yǒu bié de yánsè ma?", "Bộ quần áo này có màu khác không?"],
  ]],
  ["咖啡", "kāfēi", "cà phê", "HSK2", "Ăn uống", "danh từ", [
    ["越南[咖啡]很有名。", "Yuènán kāfēi hěn yǒumíng.", "Cà phê Việt Nam rất nổi tiếng."],
  ]],
  ["身体", "shēntǐ", "cơ thể, sức khỏe", "HSK2", "Sức khỏe", "danh từ", [
    ["祝您[身体]健康！", "Zhù nín shēntǐ jiànkāng!", "Chúc ông/bà mạnh khỏe!"],
  ]],
  ["休息", "xiūxi", "nghỉ ngơi", "HSK2", "Sức khỏe", "động từ", [
    ["你累了，[休息]一下吧。", "Nǐ lèi le, xiūxi yíxià ba.", "Bạn mệt rồi, nghỉ một chút đi."],
  ]],

  // ---------- HSK3 ----------
  ["环境", "huánjìng", "môi trường", "HSK3", "Xã hội", "danh từ", [
    ["我们要保护[环境]。", "Wǒmen yào bǎohù huánjìng.", "Chúng ta phải bảo vệ môi trường."],
    ["这里的学习[环境]很好。", "Zhèlǐ de xuéxí huánjìng hěn hǎo.", "Môi trường học tập ở đây rất tốt."],
  ]],
  ["关系", "guānxi", "quan hệ", "HSK3", "Con người", "danh từ", [
    ["他们俩的[关系]很好。", "Tāmen liǎ de guānxi hěn hǎo.", "Quan hệ giữa hai người họ rất tốt."],
  ]],
  ["文化", "wénhuà", "văn hóa", "HSK3", "Xã hội", "danh từ", [
    ["我对中国[文化]很感兴趣。", "Wǒ duì Zhōngguó wénhuà hěn gǎn xìngqù.", "Tôi rất hứng thú với văn hóa Trung Quốc."],
  ]],
  ["机会", "jīhuì", "cơ hội", "HSK3", "Công việc", "danh từ", [
    ["这是一个很好的[机会]。", "Zhè shì yí gè hěn hǎo de jīhuì.", "Đây là một cơ hội rất tốt."],
  ]],
  ["解决", "jiějué", "giải quyết", "HSK3", "Công việc", "động từ", [
    ["这个问题很难[解决]。", "Zhège wèntí hěn nán jiějué.", "Vấn đề này rất khó giải quyết."],
  ]],
  ["决定", "juédìng", "quyết định", "HSK3", "Công việc", "động từ / danh từ", [
    ["我[决定]明年去留学。", "Wǒ juédìng míngnián qù liúxué.", "Tôi quyết định năm sau đi du học."],
  ]],
  ["发现", "fāxiàn", "phát hiện", "HSK3", "Hoạt động", "động từ", [
    ["我[发现]钱包不见了。", "Wǒ fāxiàn qiánbāo bú jiàn le.", "Tôi phát hiện ví tiền biến mất rồi."],
  ]],
  ["参加", "cānjiā", "tham gia", "HSK3", "Hoạt động", "động từ", [
    ["你会[参加]明天的会议吗？", "Nǐ huì cānjiā míngtiān de huìyì ma?", "Bạn có tham gia cuộc họp ngày mai không?"],
  ]],
  ["提高", "tígāo", "nâng cao", "HSK3", "Trường học", "động từ", [
    ["多听多说能[提高]口语水平。", "Duō tīng duō shuō néng tígāo kǒuyǔ shuǐpíng.", "Nghe nhiều nói nhiều có thể nâng cao trình độ khẩu ngữ."],
  ]],
  ["练习", "liànxí", "luyện tập; bài tập", "HSK3", "Trường học", "động từ / danh từ", [
    ["每天[练习]写汉字。", "Měitiān liànxí xiě Hànzì.", "Mỗi ngày luyện viết chữ Hán."],
  ]],
  ["了解", "liǎojiě", "hiểu rõ, tìm hiểu", "HSK3", "Giao tiếp", "động từ", [
    ["我想多[了解]一下这家公司。", "Wǒ xiǎng duō liǎojiě yíxià zhè jiā gōngsī.", "Tôi muốn tìm hiểu thêm về công ty này."],
  ]],
  ["习惯", "xíguàn", "thói quen; quen với", "HSK3", "Hoạt động", "danh từ / động từ", [
    ["早睡早起是好[习惯]。", "Zǎo shuì zǎo qǐ shì hǎo xíguàn.", "Ngủ sớm dậy sớm là thói quen tốt."],
    ["你[习惯]这里的生活了吗？", "Nǐ xíguàn zhèlǐ de shēnghuó le ma?", "Bạn đã quen với cuộc sống ở đây chưa?"],
  ]],
  ["担心", "dānxīn", "lo lắng", "HSK3", "Cảm xúc", "động từ", [
    ["别[担心]，一切都会好的。", "Bié dānxīn, yíqiè dōu huì hǎo de.", "Đừng lo, mọi chuyện sẽ ổn thôi."],
  ]],
  ["满意", "mǎnyì", "hài lòng", "HSK3", "Cảm xúc", "tính từ", [
    ["你对这个结果[满意]吗？", "Nǐ duì zhège jiéguǒ mǎnyì ma?", "Bạn có hài lòng với kết quả này không?"],
  ]],
  ["健康", "jiànkāng", "khỏe mạnh, sức khỏe", "HSK3", "Sức khỏe", "tính từ / danh từ", [
    ["[健康]比钱更重要。", "Jiànkāng bǐ qián gèng zhòngyào.", "Sức khỏe quan trọng hơn tiền bạc."],
  ]],
  ["简单", "jiǎndān", "đơn giản", "HSK3", "Trường học", "tính từ", [
    ["这道题很[简单]。", "Zhè dào tí hěn jiǎndān.", "Câu hỏi này rất đơn giản."],
  ]],
  ["重要", "zhòngyào", "quan trọng", "HSK3", "Công việc", "tính từ", [
    ["明天的会议非常[重要]。", "Míngtiān de huìyì fēicháng zhòngyào.", "Cuộc họp ngày mai cực kỳ quan trọng."],
  ]],
  ["认真", "rènzhēn", "chăm chỉ, nghiêm túc", "HSK3", "Con người", "tính từ", [
    ["她工作很[认真]。", "Tā gōngzuò hěn rènzhēn.", "Cô ấy làm việc rất nghiêm túc."],
  ]],
  ["努力", "nǔlì", "nỗ lực, cố gắng", "HSK3", "Con người", "tính từ / động từ", [
    ["只要[努力]，就会成功。", "Zhǐyào nǔlì, jiù huì chénggōng.", "Chỉ cần nỗ lực thì sẽ thành công."],
  ]],
  ["办法", "bànfǎ", "cách, biện pháp", "HSK3", "Công việc", "danh từ", [
    ["我们一起想[办法]吧。", "Wǒmen yìqǐ xiǎng bànfǎ ba.", "Chúng ta cùng nghĩ cách nhé."],
  ]],
  ["选择", "xuǎnzé", "lựa chọn", "HSK3", "Hoạt động", "động từ / danh từ", [
    ["这是我自己的[选择]。", "Zhè shì wǒ zìjǐ de xuǎnzé.", "Đây là lựa chọn của chính tôi."],
  ]],
  ["安排", "ānpái", "sắp xếp", "HSK3", "Công việc", "động từ / danh từ", [
    ["周末你有什么[安排]？", "Zhōumò nǐ yǒu shénme ānpái?", "Cuối tuần bạn có kế hoạch gì?"],
  ]],
  ["比赛", "bǐsài", "trận đấu, cuộc thi", "HSK3", "Hoạt động", "danh từ", [
    ["昨天的足球[比赛]很精彩。", "Zuótiān de zúqiú bǐsài hěn jīngcǎi.", "Trận bóng đá hôm qua rất hay."],
  ]],
  ["经常", "jīngcháng", "thường xuyên", "HSK3", "Từ nối", "phó từ", [
    ["他[经常]加班。", "Tā jīngcháng jiābān.", "Anh ấy thường xuyên tăng ca."],
  ]],
  ["终于", "zhōngyú", "cuối cùng thì", "HSK3", "Từ nối", "phó từ", [
    ["我[终于]找到工作了！", "Wǒ zhōngyú zhǎodào gōngzuò le!", "Cuối cùng tôi cũng tìm được việc rồi!"],
  ]],
  ["虽然", "suīrán", "mặc dù", "HSK3", "Từ nối", "liên từ", [
    ["[虽然]很累，但是很开心。", "Suīrán hěn lèi, dànshì hěn kāixīn.", "Tuy rất mệt nhưng rất vui."],
  ]],
  ["如果", "rúguǒ", "nếu", "HSK3", "Từ nối", "liên từ", [
    ["[如果]明天下雨，我们就不去了。", "Rúguǒ míngtiān xià yǔ, wǒmen jiù bú qù le.", "Nếu mai mưa thì chúng ta không đi nữa."],
  ]],
  ["城市", "chéngshì", "thành phố", "HSK3", "Nơi chốn", "danh từ", [
    ["胡志明市是一个热闹的[城市]。", "Húzhìmíng Shì shì yí gè rènao de chéngshì.", "Thành phố Hồ Chí Minh là một thành phố náo nhiệt."],
  ]],
  ["经理", "jīnglǐ", "giám đốc, quản lý", "HSK3", "Công việc", "danh từ", [
    ["[经理]今天不在办公室。", "Jīnglǐ jīntiān bú zài bàngōngshì.", "Hôm nay quản lý không có ở văn phòng."],
  ]],
  ["会议", "huìyì", "cuộc họp", "HSK3", "Công việc", "danh từ", [
    ["[会议]下午两点开始。", "Huìyì xiàwǔ liǎng diǎn kāishǐ.", "Cuộc họp bắt đầu lúc hai giờ chiều."],
  ]],
];
