/**
 * [term, reading ("kana · romaji", or romaji alone for kana-only words), meaning, JLPT level, topic,
 *  part of speech, usage note ("" if none), examples: [sentence, romaji, translation][]]
 * Verbs are listed in dictionary form; examples bracket the conjugated form.
 * Notes give the Sino-Vietnamese (âm Hán Việt) reading of the kanji, the usual way Vietnamese learners remember them.
 */
export type JaRow = [string, string, string, string, string, string, string, [string, string, string][]];

export const JA_WORDS: JaRow[] = [
  // ---------- N5 · Chào hỏi & con người ----------
  ["こんにちは", "konnichiwa", "xin chào (ban ngày)", "N5", "Chào hỏi", "cụm từ", "Chữ cuối viết là は nhưng đọc là \"wa\".", [
    ["先生、[こんにちは]。", "Sensei, konnichiwa.", "Em chào thầy/cô ạ."],
  ]],
  ["ありがとう", "arigatō", "cảm ơn", "N5", "Chào hỏi", "cụm từ", "Lịch sự hơn: ありがとうございます.", [
    ["手伝ってくれて[ありがとう]。", "Tetsudatte kurete arigatō.", "Cảm ơn vì đã giúp mình."],
  ]],
  ["すみません", "sumimasen", "xin lỗi; xin phép (khi gọi ai đó)", "N5", "Chào hỏi", "cụm từ", "Dùng cả để xin lỗi, cảm ơn và gọi người khác.", [
    ["[すみません]、駅はどこですか。", "Sumimasen, eki wa doko desu ka.", "Xin lỗi, nhà ga ở đâu ạ?"],
  ]],
  ["名前", "なまえ · namae", "tên", "N5", "Chào hỏi", "danh từ", "Hán Việt: DANH TIỀN.", [
    ["お[名前]は何ですか。", "O-namae wa nan desu ka.", "Tên bạn là gì?"],
  ]],
  ["人", "ひと · hito", "người", "N5", "Con người", "danh từ", "Hán Việt: NHÂN.", [
    ["あの[人]は誰ですか。", "Ano hito wa dare desu ka.", "Người kia là ai vậy?"],
  ]],
  ["友達", "ともだち · tomodachi", "bạn bè", "N5", "Con người", "danh từ", "Hán Việt: HỮU ĐẠT.", [
    ["週末[友達]に会います。", "Shūmatsu tomodachi ni aimasu.", "Cuối tuần tôi gặp bạn."],
  ]],

  // ---------- N5 · Gia đình ----------
  ["家族", "かぞく · kazoku", "gia đình", "N5", "Gia đình", "danh từ", "Hán Việt: GIA TỘC.", [
    ["[家族]は四人です。", "Kazoku wa yonin desu.", "Gia đình tôi có bốn người."],
  ]],
  ["母", "はは · haha", "mẹ (của mình)", "N5", "Gia đình", "danh từ", "Hán Việt: MẪU. Nói về mẹ người khác: お母さん (okāsan).", [
    ["[母]は料理が上手です。", "Haha wa ryōri ga jōzu desu.", "Mẹ tôi nấu ăn giỏi."],
  ]],
  ["父", "ちち · chichi", "bố (của mình)", "N5", "Gia đình", "danh từ", "Hán Việt: PHỤ. Nói về bố người khác: お父さん (otōsan).", [
    ["[父]は会社員です。", "Chichi wa kaishain desu.", "Bố tôi là nhân viên công ty."],
  ]],

  // ---------- N5 · Trường học ----------
  ["学生", "がくせい · gakusei", "học sinh, sinh viên", "N5", "Trường học", "danh từ", "Hán Việt: HỌC SINH.", [
    ["私は[学生]です。", "Watashi wa gakusei desu.", "Tôi là sinh viên."],
  ]],
  ["先生", "せんせい · sensei", "thầy giáo, cô giáo", "N5", "Trường học", "danh từ", "Hán Việt: TIÊN SINH. Cũng dùng để gọi bác sĩ, luật sư.", [
    ["[先生]、質問があります。", "Sensei, shitsumon ga arimasu.", "Thưa thầy/cô, em có câu hỏi."],
  ]],
  ["学校", "がっこう · gakkō", "trường học", "N5", "Trường học", "danh từ", "Hán Việt: HỌC HIỆU.", [
    ["毎日[学校]に行きます。", "Mainichi gakkō ni ikimasu.", "Ngày nào tôi cũng đến trường."],
  ]],
  ["勉強する", "べんきょうする · benkyō suru", "học, học bài", "N5", "Trường học", "động từ", "Hán Việt: MIỄN CƯỠNG (nghĩa gốc là \"gắng sức\").", [
    ["図書館で日本語を[勉強します]。", "Toshokan de nihongo o benkyō shimasu.", "Tôi học tiếng Nhật ở thư viện."],
  ]],

  // ---------- N5 · Ăn uống ----------
  ["食べる", "たべる · taberu", "ăn", "N5", "Ăn uống", "động từ", "Hán Việt: THỰC.", [
    ["毎朝パンを[食べます]。", "Maiasa pan o tabemasu.", "Sáng nào tôi cũng ăn bánh mì."],
  ]],
  ["飲む", "のむ · nomu", "uống", "N5", "Ăn uống", "động từ", "Hán Việt: ẨM. Uống thuốc cũng dùng 飲む.", [
    ["コーヒーを[飲みます]。", "Kōhī o nomimasu.", "Tôi uống cà phê."],
  ]],
  ["水", "みず · mizu", "nước", "N5", "Ăn uống", "danh từ", "Hán Việt: THỦY.", [
    ["[水]をください。", "Mizu o kudasai.", "Cho tôi xin nước."],
  ]],
  ["ご飯", "ごはん · gohan", "cơm; bữa ăn", "N5", "Ăn uống", "danh từ", "Hán Việt: PHẠN.", [
    ["もう[ご飯]を食べましたか。", "Mō gohan o tabemashita ka.", "Bạn ăn cơm chưa?"],
  ]],
  ["おいしい", "oishii", "ngon", "N5", "Ăn uống", "tính từ", "Tính từ đuôi い.", [
    ["このラーメンはとても[おいしい]です。", "Kono rāmen wa totemo oishii desu.", "Mì ramen này rất ngon."],
  ]],

  // ---------- N5 · Hoạt động ----------
  ["行く", "いく · iku", "đi", "N5", "Hoạt động", "động từ", "Hán Việt: HÀNH.", [
    ["明日、東京へ[行きます]。", "Ashita, Tōkyō e ikimasu.", "Ngày mai tôi đi Tokyo."],
  ]],
  ["来る", "くる · kuru", "đến", "N5", "Hoạt động", "động từ", "Hán Việt: LAI. Động từ bất quy tắc: 来ます (kimasu).", [
    ["友達が家に[来ます]。", "Tomodachi ga ie ni kimasu.", "Bạn đến nhà tôi."],
  ]],
  ["見る", "みる · miru", "xem, nhìn", "N5", "Hoạt động", "động từ", "Hán Việt: KIẾN.", [
    ["夜、映画を[見ます]。", "Yoru, eiga o mimasu.", "Buổi tối tôi xem phim."],
  ]],
  ["寝る", "ねる · neru", "ngủ", "N5", "Hoạt động", "động từ", "Hán Việt: TẨM.", [
    ["いつも11時に[寝ます]。", "Itsumo jūichi-ji ni nemasu.", "Tôi thường ngủ lúc 11 giờ."],
  ]],
  ["好き", "すき · suki", "thích", "N5", "Cảm xúc", "tính từ", "Hán Việt: HẢO. Tính từ đuôi な, dùng với trợ từ が: 猫が好き.", [
    ["私は猫が[好き]です。", "Watashi wa neko ga suki desu.", "Tôi thích mèo."],
  ]],

  // ---------- N5 · Mua sắm ----------
  ["いくら", "ikura", "bao nhiêu (tiền)", "N5", "Mua sắm", "đại từ", "", [
    ["これは[いくら]ですか。", "Kore wa ikura desu ka.", "Cái này bao nhiêu tiền?"],
  ]],
  ["買う", "かう · kau", "mua", "N5", "Mua sắm", "động từ", "Hán Việt: MÃI.", [
    ["スーパーで野菜を[買います]。", "Sūpā de yasai o kaimasu.", "Tôi mua rau ở siêu thị."],
  ]],
  ["高い", "たかい · takai", "đắt; cao", "N5", "Mua sắm", "tính từ", "Hán Việt: CAO.", [
    ["このかばんは[高い]です。", "Kono kaban wa takai desu.", "Cái túi này đắt."],
  ]],
  ["安い", "やすい · yasui", "rẻ", "N5", "Mua sắm", "tính từ", "Hán Việt: AN.", [
    ["この店は[安い]です。", "Kono mise wa yasui desu.", "Cửa hàng này rẻ."],
  ]],

  // ---------- N5 · Thời gian ----------
  ["今日", "きょう · kyō", "hôm nay", "N5", "Thời gian", "danh từ", "Hán Việt: KIM NHẬT. Cách đọc đặc biệt.", [
    ["[今日]はいい天気ですね。", "Kyō wa ii tenki desu ne.", "Hôm nay trời đẹp nhỉ."],
  ]],
  ["明日", "あした · ashita", "ngày mai", "N5", "Thời gian", "danh từ", "Hán Việt: MINH NHẬT.", [
    ["[明日]また会いましょう。", "Ashita mata aimashō.", "Mai gặp lại nhé."],
  ]],
  ["昨日", "きのう · kinō", "hôm qua", "N5", "Thời gian", "danh từ", "Hán Việt: TẠC NHẬT.", [
    ["[昨日]は何をしましたか。", "Kinō wa nani o shimashita ka.", "Hôm qua bạn đã làm gì?"],
  ]],
  ["時間", "じかん · jikan", "thời gian; tiếng đồng hồ", "N5", "Thời gian", "danh từ", "Hán Việt: THỜI GIAN.", [
    ["[時間]がありません。", "Jikan ga arimasen.", "Tôi không có thời gian."],
  ]],
  ["朝", "あさ · asa", "buổi sáng", "N5", "Thời gian", "danh từ", "Hán Việt: TRIÊU.", [
    ["[朝]、ジョギングをします。", "Asa, jogingu o shimasu.", "Buổi sáng tôi chạy bộ."],
  ]],

  // ---------- N5 · Nơi chốn & đi lại ----------
  ["家", "いえ · ie", "nhà", "N5", "Nơi chốn", "danh từ", "Hán Việt: GIA.", [
    ["早く[家]に帰りたいです。", "Hayaku ie ni kaeritai desu.", "Tôi muốn về nhà sớm."],
  ]],
  ["トイレ", "toire", "nhà vệ sinh", "N5", "Nơi chốn", "danh từ", "Từ mượn tiếng Anh (toilet).", [
    ["[トイレ]はどこですか。", "Toire wa doko desu ka.", "Nhà vệ sinh ở đâu?"],
  ]],
  ["どこ", "doko", "ở đâu", "N5", "Nơi chốn", "đại từ", "", [
    ["今[どこ]にいますか。", "Ima doko ni imasu ka.", "Bây giờ bạn đang ở đâu?"],
  ]],
  ["駅", "えき · eki", "nhà ga", "N5", "Đi lại", "danh từ", "Hán Việt: DỊCH.", [
    ["[駅]まで歩いて10分です。", "Eki made aruite juppun desu.", "Đi bộ đến ga mất 10 phút."],
  ]],
  ["電車", "でんしゃ · densha", "tàu điện", "N5", "Đi lại", "danh từ", "Hán Việt: ĐIỆN XA.", [
    ["[電車]で会社に行きます。", "Densha de kaisha ni ikimasu.", "Tôi đi làm bằng tàu điện."],
  ]],

  // ---------- N5 · Thời tiết & sức khỏe ----------
  ["暑い", "あつい · atsui", "nóng (thời tiết)", "N5", "Thời tiết", "tính từ", "Hán Việt: THỬ. Đồ vật nóng thì dùng 熱い.", [
    ["夏はとても[暑い]です。", "Natsu wa totemo atsui desu.", "Mùa hè rất nóng."],
  ]],
  ["寒い", "さむい · samui", "lạnh (thời tiết)", "N5", "Thời tiết", "tính từ", "Hán Việt: HÀN.", [
    ["今日は[寒い]ですね。", "Kyō wa samui desu ne.", "Hôm nay lạnh nhỉ."],
  ]],
  ["天気", "てんき · tenki", "thời tiết", "N5", "Thời tiết", "danh từ", "Hán Việt: THIÊN KHÍ.", [
    ["明日の[天気]はどうですか。", "Ashita no tenki wa dō desu ka.", "Thời tiết ngày mai thế nào?"],
  ]],
  ["痛い", "いたい · itai", "đau", "N5", "Sức khỏe", "tính từ", "Hán Việt: THỐNG.", [
    ["頭が[痛い]です。", "Atama ga itai desu.", "Tôi đau đầu."],
  ]],

  // ---------- N4 ----------
  ["約束", "やくそく · yakusoku", "lời hứa; cuộc hẹn", "N4", "Giao tiếp", "danh từ", "Hán Việt: ƯỚC THÚC.", [
    ["友達と[約束]があります。", "Tomodachi to yakusoku ga arimasu.", "Tôi có hẹn với bạn."],
  ]],
  ["旅行", "りょこう · ryokō", "du lịch", "N4", "Hoạt động", "danh từ", "Hán Việt: LỮ HÀNH.", [
    ["夏休みに北海道へ[旅行]します。", "Natsuyasumi ni Hokkaidō e ryokō shimasu.", "Kỳ nghỉ hè tôi đi du lịch Hokkaido."],
  ]],
  ["会社", "かいしゃ · kaisha", "công ty", "N4", "Công việc", "danh từ", "Hán Việt: HỘI XÃ.", [
    ["[会社]は駅の近くにあります。", "Kaisha wa eki no chikaku ni arimasu.", "Công ty ở gần nhà ga."],
  ]],
  ["働く", "はたらく · hataraku", "làm việc", "N4", "Công việc", "động từ", "Hán Việt: ĐỘNG.", [
    ["銀行で[働いて]います。", "Ginkō de hataraite imasu.", "Tôi đang làm việc ở ngân hàng."],
  ]],
  ["病院", "びょういん · byōin", "bệnh viện", "N4", "Sức khỏe", "danh từ", "Hán Việt: BỆNH VIỆN. Đừng nhầm với 美容院 (biyōin, tiệm làm tóc).", [
    ["風邪で[病院]に行きました。", "Kaze de byōin ni ikimashita.", "Tôi bị cảm nên đã đi bệnh viện."],
  ]],
  ["薬", "くすり · kusuri", "thuốc", "N4", "Sức khỏe", "danh từ", "Hán Việt: DƯỢC.", [
    ["一日三回[薬]を飲んでください。", "Ichinichi sankai kusuri o nonde kudasai.", "Hãy uống thuốc ngày ba lần."],
  ]],
  ["風邪", "かぜ · kaze", "cảm cúm", "N4", "Sức khỏe", "danh từ", "Hán Việt: PHONG TÀ. Bị cảm: 風邪をひく.", [
    ["[風邪]をひきました。", "Kaze o hikimashita.", "Tôi bị cảm rồi."],
  ]],
  ["趣味", "しゅみ · shumi", "sở thích", "N4", "Hoạt động", "danh từ", "Hán Việt: THÚ VỊ.", [
    ["私の[趣味]は写真です。", "Watashi no shumi wa shashin desu.", "Sở thích của tôi là chụp ảnh."],
  ]],
  ["練習する", "れんしゅうする · renshū suru", "luyện tập", "N4", "Học tập", "động từ", "Hán Việt: LUYỆN TẬP.", [
    ["毎日ピアノを[練習します]。", "Mainichi piano o renshū shimasu.", "Ngày nào tôi cũng luyện piano."],
  ]],
  ["準備", "じゅんび · junbi", "sự chuẩn bị", "N4", "Học tập", "danh từ", "Hán Việt: CHUẨN BỊ. Chuẩn bị: 準備する.", [
    ["試験の[準備]をしています。", "Shiken no junbi o shite imasu.", "Tôi đang chuẩn bị cho kỳ thi."],
  ]],
  ["試験", "しけん · shiken", "kỳ thi", "N4", "Học tập", "danh từ", "Hán Việt: THÍ NGHIỆM.", [
    ["来週[試験]があります。", "Raishū shiken ga arimasu.", "Tuần sau có kỳ thi."],
  ]],
  ["簡単", "かんたん · kantan", "đơn giản, dễ", "N4", "Học tập", "tính từ", "Hán Việt: GIẢN ĐƠN. Tính từ đuôi な.", [
    ["この問題は[簡単]です。", "Kono mondai wa kantan desu.", "Bài này dễ."],
  ]],
  ["難しい", "むずかしい · muzukashii", "khó", "N4", "Học tập", "tính từ", "Hán Việt: NAN.", [
    ["漢字は[難しい]ですが、面白いです。", "Kanji wa muzukashii desu ga, omoshiroi desu.", "Kanji khó nhưng thú vị."],
  ]],
  ["忙しい", "いそがしい · isogashii", "bận", "N4", "Công việc", "tính từ", "Hán Việt: MANG.", [
    ["最近、仕事が[忙しい]です。", "Saikin, shigoto ga isogashii desu.", "Dạo này công việc bận rộn."],
  ]],
  ["疲れる", "つかれる · tsukareru", "mệt", "N4", "Sức khỏe", "động từ", "Hán Việt: BÌ. Là động từ: 疲れました = tôi mệt rồi.", [
    ["昨日は遅く寝たので[疲れました]。", "Kinō wa osoku neta node tsukaremashita.", "Hôm qua ngủ muộn nên tôi mệt."],
  ]],
  ["覚える", "おぼえる · oboeru", "nhớ, ghi nhớ", "N4", "Học tập", "động từ", "Hán Việt: GIÁC.", [
    ["毎日新しい単語を[覚えます]。", "Mainichi atarashii tango o oboemasu.", "Mỗi ngày tôi ghi nhớ từ mới."],
  ]],
  ["忘れる", "わすれる · wasureru", "quên", "N4", "Học tập", "động từ", "Hán Việt: VONG.", [
    ["傘を[忘れました]。", "Kasa o wasuremashita.", "Tôi để quên ô rồi."],
  ]],
  ["借りる", "かりる · kariru", "mượn", "N4", "Hoạt động", "động từ", "Hán Việt: TÁ. Cho mượn: 貸す (kasu).", [
    ["図書館で本を[借りました]。", "Toshokan de hon o karimashita.", "Tôi đã mượn sách ở thư viện."],
  ]],
  ["乗り換える", "のりかえる · norikaeru", "chuyển (tàu, xe)", "N4", "Đi lại", "động từ", "Hán Việt: THỪA HOÁN.", [
    ["新宿で[乗り換えて]ください。", "Shinjuku de norikaete kudasai.", "Hãy chuyển tàu ở Shinjuku."],
  ]],
  ["だから", "dakara", "vì vậy, cho nên", "N4", "Từ nối", "từ nối", "Lịch sự hơn: ですから.", [
    ["雨が降りました。[だから]家にいました。", "Ame ga furimashita. Dakara ie ni imashita.", "Trời mưa. Vì vậy tôi ở nhà."],
  ]],
  ["でも", "demo", "nhưng", "N4", "Từ nối", "từ nối", "Đứng đầu câu, văn nói.", [
    ["おいしいです。[でも]ちょっと高いです。", "Oishii desu. Demo chotto takai desu.", "Ngon. Nhưng hơi đắt."],
  ]],
  ["よく", "yoku", "thường, hay; kỹ, giỏi", "N4", "Từ nối", "phó từ", "", [
    ["この店に[よく]来ます。", "Kono mise ni yoku kimasu.", "Tôi hay đến quán này."],
  ]],
  ["まだ", "mada", "vẫn, vẫn chưa", "N4", "Từ nối", "phó từ", "", [
    ["[まだ]宿題をしていません。", "Mada shukudai o shite imasen.", "Tôi vẫn chưa làm bài tập."],
  ]],
  ["心配する", "しんぱいする · shinpai suru", "lo lắng", "N4", "Cảm xúc", "động từ", "Hán Việt: TÂM PHỐI.", [
    ["あまり[心配しないで]ください。", "Amari shinpai shinaide kudasai.", "Đừng lo lắng quá."],
  ]],
  ["意味", "いみ · imi", "ý nghĩa", "N4", "Học tập", "danh từ", "Hán Việt: Ý VỊ.", [
    ["この言葉の[意味]は何ですか。", "Kono kotoba no imi wa nan desu ka.", "Từ này nghĩa là gì?"],
  ]],

  // ---------- N3 ----------
  ["経験", "けいけん · keiken", "kinh nghiệm, trải nghiệm", "N3", "Xã hội", "danh từ", "Hán Việt: KINH NGHIỆM.", [
    ["外国で働いた[経験]があります。", "Gaikoku de hataraita keiken ga arimasu.", "Tôi có kinh nghiệm làm việc ở nước ngoài."],
  ]],
  ["文化", "ぶんか · bunka", "văn hóa", "N3", "Xã hội", "danh từ", "Hán Việt: VĂN HÓA.", [
    ["日本の[文化]に興味があります。", "Nihon no bunka ni kyōmi ga arimasu.", "Tôi có hứng thú với văn hóa Nhật Bản."],
  ]],
  ["興味", "きょうみ · kyōmi", "sự hứng thú", "N3", "Cảm xúc", "danh từ", "Hán Việt: HỨNG VỊ. Có hứng thú với…: 〜に興味がある.", [
    ["最近、料理に[興味]を持ちました。", "Saikin, ryōri ni kyōmi o mochimashita.", "Gần đây tôi bắt đầu thấy hứng thú với nấu ăn."],
  ]],
  ["会議", "かいぎ · kaigi", "cuộc họp", "N3", "Công việc", "danh từ", "Hán Việt: HỘI NGHỊ.", [
    ["午後3時から[会議]があります。", "Gogo sanji kara kaigi ga arimasu.", "Từ 3 giờ chiều có cuộc họp."],
  ]],
  ["計画", "けいかく · keikaku", "kế hoạch", "N3", "Công việc", "danh từ", "Hán Việt: KẾ HOẠCH.", [
    ["今年の[計画]は何ですか。", "Kotoshi no keikaku wa nan desu ka.", "Kế hoạch năm nay của bạn là gì?"],
  ]],
  ["決める", "きめる · kimeru", "quyết định", "N3", "Công việc", "động từ", "Hán Việt: QUYẾT.", [
    ["まだ[決めて]いません。", "Mada kimete imasen.", "Tôi vẫn chưa quyết định."],
  ]],
  ["努力", "どりょく · doryoku", "sự nỗ lực", "N3", "Học tập", "danh từ", "Hán Việt: NỖ LỰC.", [
    ["毎日の[努力]が大切です。", "Mainichi no doryoku ga taisetsu desu.", "Nỗ lực mỗi ngày là điều quan trọng."],
  ]],
  ["環境", "かんきょう · kankyō", "môi trường", "N3", "Môi trường", "danh từ", "Hán Việt: HOÀN CẢNH.", [
    ["[環境]を守りましょう。", "Kankyō o mamorimashō.", "Hãy cùng bảo vệ môi trường."],
  ]],
  ["利用する", "りようする · riyō suru", "sử dụng", "N3", "Xã hội", "động từ", "Hán Việt: LỢI DỤNG, nhưng nghĩa trung tính là \"sử dụng\".", [
    ["公共交通機関を[利用して]ください。", "Kōkyō kōtsū kikan o riyō shite kudasai.", "Hãy sử dụng phương tiện giao thông công cộng."],
  ]],
  ["紹介する", "しょうかいする · shōkai suru", "giới thiệu", "N3", "Giao tiếp", "động từ", "Hán Việt: THIỆU GIỚI.", [
    ["友達を[紹介します]。", "Tomodachi o shōkai shimasu.", "Tôi xin giới thiệu bạn tôi."],
  ]],
  ["慣れる", "なれる · nareru", "quen", "N3", "Cảm xúc", "động từ", "Hán Việt: QUÁN. Quen với…: 〜に慣れる.", [
    ["日本の生活に[慣れました]。", "Nihon no seikatsu ni naremashita.", "Tôi đã quen với cuộc sống ở Nhật."],
  ]],
  ["失敗", "しっぱい · shippai", "thất bại, sai sót", "N3", "Công việc", "danh từ", "Hán Việt: THẤT BẠI.", [
    ["[失敗]を恐れないでください。", "Shippai o osorenaide kudasai.", "Đừng sợ thất bại."],
  ]],
  ["性格", "せいかく · seikaku", "tính cách", "N3", "Con người", "danh từ", "Hán Việt: TÍNH CÁCH.", [
    ["彼は明るい[性格]です。", "Kare wa akarui seikaku desu.", "Anh ấy có tính cách vui vẻ."],
  ]],
  ["雰囲気", "ふんいき · fun'iki", "bầu không khí", "N3", "Xã hội", "danh từ", "Hán Việt: PHÂN VI KHÍ.", [
    ["このカフェは[雰囲気]がいいです。", "Kono kafe wa fun'iki ga ii desu.", "Quán cà phê này không khí dễ chịu."],
  ]],
  ["悩む", "なやむ · nayamu", "băn khoăn, phiền não", "N3", "Cảm xúc", "động từ", "Hán Việt: NÃO.", [
    ["進路について[悩んで]います。", "Shinro ni tsuite nayande imasu.", "Tôi đang băn khoăn về con đường tương lai."],
  ]],
  ["急に", "きゅうに · kyū ni", "đột nhiên", "N3", "Từ nối", "phó từ", "Hán Việt: CẤP.", [
    ["[急に]雨が降り出しました。", "Kyū ni ame ga furidashimashita.", "Đột nhiên trời đổ mưa."],
  ]],
  ["必ず", "かならず · kanarazu", "nhất định, chắc chắn", "N3", "Từ nối", "phó từ", "Hán Việt: TẤT.", [
    ["明日[必ず]連絡します。", "Ashita kanarazu renraku shimasu.", "Ngày mai nhất định tôi sẽ liên lạc."],
  ]],
  ["確認する", "かくにんする · kakunin suru", "xác nhận, kiểm tra lại", "N3", "Công việc", "động từ", "Hán Việt: XÁC NHẬN.", [
    ["予約を[確認します]。", "Yoyaku o kakunin shimasu.", "Tôi xin xác nhận lại đặt chỗ."],
  ]],
  ["説明する", "せつめいする · setsumei suru", "giải thích", "N3", "Giao tiếp", "động từ", "Hán Việt: THUYẾT MINH.", [
    ["もう一度[説明して]いただけますか。", "Mō ichido setsumei shite itadakemasu ka.", "Anh/chị có thể giải thích lại một lần nữa được không?"],
  ]],
  ["相談する", "そうだんする · sōdan suru", "bàn bạc, xin ý kiến", "N3", "Giao tiếp", "động từ", "Hán Việt: TƯƠNG ĐÀM.", [
    ["先生に[相談しました]。", "Sensei ni sōdan shimashita.", "Tôi đã xin ý kiến thầy giáo."],
  ]],
  ["遅刻する", "ちこくする · chikoku suru", "đến muộn", "N3", "Công việc", "động từ", "Hán Việt: TRÌ KHẮC.", [
    ["寝坊して[遅刻しました]。", "Nebō shite chikoku shimashita.", "Tôi ngủ quên nên đã đến muộn."],
  ]],
  ["将来", "しょうらい · shōrai", "tương lai", "N3", "Xã hội", "danh từ", "Hán Việt: TƯƠNG LAI.", [
    ["[将来]、医者になりたいです。", "Shōrai, isha ni naritai desu.", "Sau này tôi muốn trở thành bác sĩ."],
  ]],

  // ---------- N2 ----------
  ["経済", "けいざい · keizai", "kinh tế", "N2", "Xã hội", "danh từ", "Hán Việt: KINH TẾ.", [
    ["[経済]が少しずつ回復しています。", "Keizai ga sukoshi zutsu kaifuku shite imasu.", "Kinh tế đang dần phục hồi."],
  ]],
  ["社会", "しゃかい · shakai", "xã hội", "N2", "Xã hội", "danh từ", "Hán Việt: XÃ HỘI.", [
    ["現代[社会]はストレスが多い。", "Gendai shakai wa sutoresu ga ōi.", "Xã hội hiện đại có nhiều căng thẳng."],
  ]],
  ["影響", "えいきょう · eikyō", "ảnh hưởng", "N2", "Xã hội", "danh từ", "Hán Việt: ẢNH HƯỞNG. Chịu ảnh hưởng: 影響を受ける.", [
    ["両親から大きな[影響]を受けました。", "Ryōshin kara ōkina eikyō o ukemashita.", "Tôi chịu ảnh hưởng lớn từ bố mẹ."],
  ]],
  ["発展", "はってん · hatten", "sự phát triển", "N2", "Xã hội", "danh từ", "Hán Việt: PHÁT TRIỂN.", [
    ["技術は急速に[発展]している。", "Gijutsu wa kyūsoku ni hatten shite iru.", "Công nghệ đang phát triển nhanh chóng."],
  ]],
  ["解決", "かいけつ · kaiketsu", "sự giải quyết", "N2", "Công việc", "danh từ", "Hán Việt: GIẢI QUYẾT.", [
    ["この問題をどう[解決]しますか。", "Kono mondai o dō kaiketsu shimasu ka.", "Giải quyết vấn đề này thế nào?"],
  ]],
  ["増える", "ふえる · fueru", "tăng lên", "N2", "Xã hội", "động từ", "Hán Việt: TĂNG. Trái nghĩa: 減る.", [
    ["一人暮らしの人が[増えて]いる。", "Hitorigurashi no hito ga fuete iru.", "Số người sống một mình đang tăng lên."],
  ]],
  ["減る", "へる · heru", "giảm", "N2", "Xã hội", "động từ", "Hán Việt: GIẢM.", [
    ["出生率が[減り]続けている。", "Shusshōritsu ga heri tsuzukete iru.", "Tỉ lệ sinh tiếp tục giảm."],
  ]],
  ["意見", "いけん · iken", "ý kiến", "N2", "Giao tiếp", "danh từ", "Hán Việt: Ý KIẾN.", [
    ["私の[意見]は少し違います。", "Watashi no iken wa sukoshi chigaimasu.", "Ý kiến của tôi hơi khác."],
  ]],
  ["主張", "しゅちょう · shuchō", "quan điểm, sự khẳng định", "N2", "Giao tiếp", "danh từ", "Hán Việt: CHỦ TRƯƠNG.", [
    ["彼は自分が正しいと[主張]した。", "Kare wa jibun ga tadashii to shuchō shita.", "Anh ấy khẳng định mình đúng."],
  ]],
  ["克服", "こくふく · kokufuku", "sự khắc phục, vượt qua", "N2", "Cảm xúc", "danh từ", "Hán Việt: KHẮC PHỤC.", [
    ["困難を[克服]して成功した。", "Konnan o kokufuku shite seikō shita.", "Anh ấy đã vượt qua khó khăn và thành công."],
  ]],
  ["効果", "こうか · kōka", "hiệu quả, tác dụng", "N2", "Sức khỏe", "danh từ", "Hán Việt: HIỆU QUẢ.", [
    ["この薬はすぐに[効果]が出る。", "Kono kusuri wa sugu ni kōka ga deru.", "Thuốc này có tác dụng ngay."],
  ]],
  ["責任", "せきにん · sekinin", "trách nhiệm", "N2", "Công việc", "danh từ", "Hán Việt: TRÁCH NHIỆM.", [
    ["これは私の[責任]です。", "Kore wa watashi no sekinin desu.", "Đây là trách nhiệm của tôi."],
  ]],
  ["機会", "きかい · kikai", "cơ hội", "N2", "Công việc", "danh từ", "Hán Việt: CƠ HỘI. Đừng nhầm với 機械 (máy móc), cũng đọc là kikai.", [
    ["いい[機会]を逃さないでください。", "Ii kikai o nogasanaide kudasai.", "Đừng bỏ lỡ cơ hội tốt."],
  ]],
  ["適応", "てきおう · tekiō", "sự thích nghi", "N2", "Xã hội", "danh từ", "Hán Việt: THÍCH ỨNG.", [
    ["新しい環境に[適応]するのは大変だ。", "Atarashii kankyō ni tekiō suru no wa taihen da.", "Thích nghi với môi trường mới thật vất vả."],
  ]],
  ["地道", "じみち · jimichi", "bền bỉ, chắc chắn từng bước", "N2", "Học tập", "tính từ", "Hán Việt: ĐỊA ĐẠO. Tính từ đuôi な.", [
    ["[地道]な努力が実を結んだ。", "Jimichi na doryoku ga mi o musunda.", "Nỗ lực bền bỉ đã đơm hoa kết trái."],
  ]],
  ["傾向", "けいこう · keikō", "khuynh hướng", "N2", "Xã hội", "danh từ", "Hán Việt: KHUYNH HƯỚNG.", [
    ["若者は車を買わない[傾向]がある。", "Wakamono wa kuruma o kawanai keikō ga aru.", "Giới trẻ có xu hướng không mua ô tô."],
  ]],
  ["改善", "かいぜん · kaizen", "sự cải thiện", "N2", "Công việc", "danh từ", "Hán Việt: CẢI THIỆN.", [
    ["職場の環境を[改善]する必要がある。", "Shokuba no kankyō o kaizen suru hitsuyō ga aru.", "Cần cải thiện môi trường làm việc."],
  ]],
  ["指摘", "してき · shiteki", "sự chỉ ra", "N2", "Giao tiếp", "danh từ", "Hán Việt: CHỈ TRÍCH, nhưng nghĩa là \"chỉ ra\", không nặng như \"chỉ trích\" trong tiếng Việt.", [
    ["専門家は問題点を[指摘]した。", "Senmonka wa mondaiten o shiteki shita.", "Các chuyên gia đã chỉ ra những điểm có vấn đề."],
  ]],

  // ---------- N1 ----------
  ["現象", "げんしょう · genshō", "hiện tượng", "N1", "Học thuật", "danh từ", "Hán Việt: HIỆN TƯỢNG.", [
    ["これは自然な[現象]だ。", "Kore wa shizen na genshō da.", "Đây là một hiện tượng tự nhiên."],
  ]],
  ["認識", "にんしき · ninshiki", "nhận thức", "N1", "Xã hội", "danh từ", "Hán Việt: NHẬN THỨC.", [
    ["環境問題への[認識]が高まっている。", "Kankyō mondai e no ninshiki ga takamatte iru.", "Nhận thức về vấn đề môi trường đang được nâng cao."],
  ]],
  ["葛藤", "かっとう · kattō", "giằng xé, mâu thuẫn nội tâm", "N1", "Cảm xúc", "danh từ", "Hán Việt: CÁT ĐẰNG.", [
    ["心の中で[葛藤]が続いた。", "Kokoro no naka de kattō ga tsuzuita.", "Trong lòng giằng xé mãi không thôi."],
  ]],
  ["対策", "たいさく · taisaku", "biện pháp đối phó", "N1", "Xã hội", "danh từ", "Hán Việt: ĐỐI SÁCH.", [
    ["政府は新たな[対策]を発表した。", "Seifu wa arata na taisaku o happyō shita.", "Chính phủ đã công bố biện pháp mới."],
  ]],
  ["不可欠", "ふかけつ · fukaketsu", "không thể thiếu", "N1", "Học thuật", "tính từ", "Hán Việt: BẤT KHẢ KHUYẾT. Tính từ đuôi な.", [
    ["水は生活に[不可欠]だ。", "Mizu wa seikatsu ni fukaketsu da.", "Nước không thể thiếu trong cuộc sống."],
  ]],
  ["懸念", "けねん · kenen", "mối lo ngại", "N1", "Xã hội", "danh từ", "Hán Việt: HUYỀN NIỆM.", [
    ["経済の先行きに[懸念]が広がっている。", "Keizai no sakiyuki ni kenen ga hirogatte iru.", "Mối lo ngại về triển vọng kinh tế đang lan rộng."],
  ]],
  ["模索", "もさく · mosaku", "sự tìm tòi, mò mẫm", "N1", "Học thuật", "danh từ", "Hán Việt: MÔ SÁCH.", [
    ["新しい解決策を[模索]している。", "Atarashii kaiketsusaku o mosaku shite iru.", "Chúng tôi đang tìm tòi giải pháp mới."],
  ]],
  ["看過", "かんか · kanka", "sự làm ngơ, bỏ qua", "N1", "Học thuật", "danh từ", "Hán Việt: KHÁN QUÁ. Hay dùng: 看過できない (không thể làm ngơ).", [
    ["この問題は[看過]できない。", "Kono mondai wa kanka dekinai.", "Không thể làm ngơ trước vấn đề này."],
  ]],
  ["招く", "まねく · maneku", "gây ra, dẫn đến; mời", "N1", "Học thuật", "động từ", "Hán Việt: CHIÊU.", [
    ["無計画な開発は環境破壊を[招く]。", "Mukeikaku na kaihatsu wa kankyō hakai o maneku.", "Phát triển thiếu kế hoạch dẫn đến tàn phá môi trường."],
  ]],
  ["伴う", "ともなう · tomonau", "kèm theo", "N1", "Học thuật", "động từ", "Hán Việt: BẠN.", [
    ["変化には常にリスクが[伴う]。", "Henka ni wa tsune ni risuku ga tomonau.", "Thay đổi luôn kèm theo rủi ro."],
  ]],
  ["持続可能", "じぞくかのう · jizoku kanō", "bền vững", "N1", "Môi trường", "tính từ", "Hán Việt: TRÌ TỤC KHẢ NĂNG. Tính từ đuôi な.", [
    ["[持続可能]な社会を目指す。", "Jizoku kanō na shakai o mezasu.", "Hướng tới một xã hội bền vững."],
  ]],
  ["示唆", "しさ · shisa", "sự gợi ý, ám chỉ", "N1", "Học thuật", "danh từ", "Hán Việt: THỊ TOA.", [
    ["この結果は重要な点を[示唆]している。", "Kono kekka wa jūyō na ten o shisa shite iru.", "Kết quả này gợi ra một điểm quan trọng."],
  ]],
  ["一概に", "いちがいに · ichigai ni", "(không thể) nói chung chung, vơ đũa cả nắm", "N1", "Học thuật", "phó từ", "Hán Việt: NHẤT KHÁI. Thường đi với phủ định: 一概に〜とは言えない.", [
    ["[一概に]悪いとは言えない。", "Ichigai ni warui to wa ienai.", "Không thể nói chung chung là xấu."],
  ]],
  ["強調", "きょうちょう · kyōchō", "sự nhấn mạnh", "N1", "Giao tiếp", "danh từ", "Hán Việt: CƯỜNG ĐIỆU, nhưng nghĩa là \"nhấn mạnh\", không phải \"phóng đại\".", [
    ["彼は教育の重要性を[強調]した。", "Kare wa kyōiku no jūyōsei o kyōchō shita.", "Ông ấy nhấn mạnh tầm quan trọng của giáo dục."],
  ]],
  ["曖昧", "あいまい · aimai", "mơ hồ, không rõ ràng", "N1", "Giao tiếp", "tính từ", "Hán Việt: ÁI MUỘI. Tính từ đuôi な.", [
    ["彼の返事は[曖昧]だった。", "Kare no henji wa aimai datta.", "Câu trả lời của anh ấy rất mơ hồ."],
  ]],
];
