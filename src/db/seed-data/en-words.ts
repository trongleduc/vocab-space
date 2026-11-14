/** [term, IPA, meaning, CEFR, topic, part of speech, prepositions ("; "-separated), examples: [sentence, translation][]] */
export type EnRow = [string, string, string, string, string, string, string, [string, string][]];

export const EN_WORDS: EnRow[] = [
  // ---------- B1 ----------
  ["depend", "/dɪˈpend/", "phụ thuộc, dựa vào", "B1", "Quan hệ", "verb", "depend on sb/sth", [
    ["Whether we go out [depends on] the weather.", "Có đi chơi hay không phụ thuộc vào thời tiết."],
    ["Many students still [depend on] their parents for money.", "Nhiều sinh viên vẫn dựa vào bố mẹ về tiền bạc."],
  ]],
  ["interested", "/ˈɪntrəstɪd/", "quan tâm, hứng thú", "B1", "Cảm xúc", "adjective", "interested in sth/doing sth", [
    ["She has always been [interested in] photography.", "Cô ấy luôn hứng thú với nhiếp ảnh."],
  ]],
  ["afraid", "/əˈfreɪd/", "sợ, e rằng", "B1", "Cảm xúc", "adjective", "afraid of sth; afraid that…", [
    ["My little brother is [afraid of] the dark.", "Em trai tôi sợ bóng tối."],
  ]],
  ["proud", "/praʊd/", "tự hào", "B1", "Cảm xúc", "adjective", "proud of sb/sth", [
    ["Her parents are very [proud of] her.", "Bố mẹ cô ấy rất tự hào về cô."],
  ]],
  ["responsible", "/rɪˈspɒnsəbl/", "chịu trách nhiệm", "B1", "Công việc", "adjective", "responsible for sth/doing sth; responsible to sb", [
    ["Who is [responsible for] this project?", "Ai chịu trách nhiệm dự án này?"],
  ]],
  ["apply", "/əˈplaɪ/", "nộp đơn; áp dụng", "B1", "Công việc", "verb", "apply for a job/visa; apply to sb/sth", [
    ["I'm going to [apply for] a job at that bank.", "Tôi sẽ nộp đơn xin việc ở ngân hàng đó."],
    ["These rules [apply to] everyone.", "Những quy định này áp dụng cho tất cả mọi người."],
  ]],
  ["complain", "/kəmˈpleɪn/", "phàn nàn", "B1", "Giao tiếp", "verb", "complain about sth; complain to sb", [
    ["Customers [complained about] the slow service.", "Khách hàng phàn nàn về dịch vụ chậm."],
  ]],
  ["agree", "/əˈɡriː/", "đồng ý", "B1", "Giao tiếp", "verb", "agree with sb; agree on/about sth; agree to sth", [
    ["I completely [agree with] you.", "Tôi hoàn toàn đồng ý với bạn."],
    ["We couldn't [agree on] a date for the meeting.", "Chúng tôi không thống nhất được ngày họp."],
  ]],
  ["borrow", "/ˈbɒrəʊ/", "mượn", "B1", "Tiền bạc", "verb", "borrow sth from sb", [
    ["Can I [borrow] your charger for a minute?", "Mình mượn sạc của bạn một lát được không?"],
  ]],
  ["recommend", "/ˌrekəˈmend/", "giới thiệu, khuyên dùng", "B1", "Giao tiếp", "verb", "recommend sth to sb", [
    ["Can you [recommend] a good restaurant nearby?", "Bạn có thể giới thiệu một nhà hàng ngon gần đây không?"],
  ]],
  ["arrive", "/əˈraɪv/", "đến nơi", "B1", "Du lịch", "verb", "arrive at (a place: station, airport); arrive in (a city/country)", [
    ["We [arrived in] Paris late at night.", "Chúng tôi đến Paris vào đêm muộn."],
    ["The train [arrived at] the station on time.", "Tàu đến ga đúng giờ."],
  ]],
  ["belong", "/bɪˈlɒŋ/", "thuộc về", "B1", "Quan hệ", "verb", "belong to sb/sth", [
    ["Does this bag [belong to] you?", "Cái túi này có phải của bạn không?"],
  ]],
  ["similar", "/ˈsɪmələ(r)/", "tương tự", "B1", "Học tập", "adjective", "similar to sth", [
    ["Your idea is [similar to] mine.", "Ý tưởng của bạn giống với của tôi."],
  ]],
  ["worry", "/ˈwʌri/", "lo lắng", "B1", "Cảm xúc", "verb", "worry about sb/sth", [
    ["Don't [worry about] the exam. You'll be fine.", "Đừng lo về kỳ thi. Bạn sẽ ổn thôi."],
  ]],
  ["prefer", "/prɪˈfɜː(r)/", "thích hơn", "B1", "Cảm xúc", "verb", "prefer A to B; prefer doing/to do", [
    ["I [prefer] tea to coffee.", "Tôi thích trà hơn cà phê."],
  ]],
  ["improve", "/ɪmˈpruːv/", "cải thiện", "B1", "Học tập", "verb", "improve on sth", [
    ["Reading every day will [improve] your vocabulary.", "Đọc mỗi ngày sẽ cải thiện vốn từ của bạn."],
  ]],
  ["experience", "/ɪkˈspɪəriəns/", "kinh nghiệm, trải nghiệm", "B1", "Công việc", "noun", "experience in/of sth", [
    ["She has five years of [experience in] marketing.", "Cô ấy có năm năm kinh nghiệm về marketing."],
  ]],
  ["opportunity", "/ˌɒpəˈtjuːnəti/", "cơ hội", "B1", "Công việc", "noun", "opportunity for sth; opportunity to do sth", [
    ["This job is a great [opportunity] to learn.", "Công việc này là cơ hội tuyệt vời để học hỏi."],
  ]],
  ["suggest", "/səˈdʒest/", "đề xuất, gợi ý", "B1", "Giao tiếp", "verb", "suggest sth to sb; suggest doing", [
    ["He [suggested] going to the beach.", "Anh ấy gợi ý đi biển."],
  ]],
  ["succeed", "/səkˈsiːd/", "thành công", "B1", "Công việc", "verb", "succeed in sth/doing sth", [
    ["She finally [succeeded in] passing the exam.", "Cuối cùng cô ấy đã thi đỗ."],
  ]],
  ["focus", "/ˈfəʊkəs/", "tập trung", "B1", "Học tập", "verb", "focus on sth", [
    ["Turn off your phone and [focus on] your work.", "Tắt điện thoại và tập trung vào công việc."],
  ]],
  ["afford", "/əˈfɔːd/", "đủ khả năng chi trả", "B1", "Tiền bạc", "verb", "can/can't afford sth/to do sth", [
    ["We can't [afford] a new car this year.", "Năm nay chúng tôi không đủ tiền mua xe mới."],
  ]],
  ["environment", "/ɪnˈvaɪrənmənt/", "môi trường", "B1", "Môi trường", "noun", "", [
    ["Plastic bags are bad for the [environment].", "Túi ni-lông có hại cho môi trường."],
  ]],
  ["reduce", "/rɪˈdjuːs/", "giảm bớt", "B1", "Môi trường", "verb", "reduce sth by/to (an amount)", [
    ["We need to [reduce] the amount of waste we produce.", "Chúng ta cần giảm lượng rác thải tạo ra."],
  ]],
  ["polite", "/pəˈlaɪt/", "lịch sự", "B1", "Giao tiếp", "adjective", "polite to sb", [
    ["It's important to be [polite to] customers.", "Lịch sự với khách hàng là điều quan trọng."],
  ]],

  // ---------- B2 ----------
  ["consist", "/kənˈsɪst/", "bao gồm", "B2", "Học tập", "verb", "consist of sth", [
    ["The team [consists of] five engineers.", "Nhóm gồm năm kỹ sư."],
  ]],
  ["contribute", "/kənˈtrɪbjuːt/", "đóng góp", "B2", "Công việc", "verb", "contribute to sth", [
    ["Everyone [contributed to] the success of the event.", "Mọi người đều góp phần vào thành công của sự kiện."],
  ]],
  ["insist", "/ɪnˈsɪst/", "khăng khăng, nhất quyết", "B2", "Giao tiếp", "verb", "insist on sth/doing sth", [
    ["He [insisted on] paying for dinner.", "Anh ấy nhất quyết trả tiền bữa tối."],
  ]],
  ["object", "/əbˈdʒekt/", "phản đối", "B2", "Giao tiếp", "verb", "object to sth/doing sth", [
    ["Many residents [objected to] the new building.", "Nhiều cư dân phản đối tòa nhà mới."],
  ]],
  ["cope", "/kəʊp/", "đối phó, xoay xở", "B2", "Cảm xúc", "verb", "cope with sth", [
    ["How do you [cope with] stress at work?", "Bạn đối phó với căng thẳng trong công việc thế nào?"],
  ]],
  ["approve", "/əˈpruːv/", "tán thành; phê duyệt", "B2", "Công việc", "verb", "approve of sb/sth", [
    ["Her parents don't [approve of] her boyfriend.", "Bố mẹ cô ấy không ưng bạn trai cô."],
  ]],
  ["participate", "/pɑːˈtɪsɪpeɪt/", "tham gia", "B2", "Xã hội", "verb", "participate in sth", [
    ["All staff are encouraged to [participate in] the training.", "Mọi nhân viên được khuyến khích tham gia khóa đào tạo."],
  ]],
  ["concentrate", "/ˈkɒnsntreɪt/", "tập trung", "B2", "Học tập", "verb", "concentrate on sth", [
    ["I can't [concentrate on] my work with all this noise.", "Tôi không thể tập trung làm việc với tiếng ồn này."],
  ]],
  ["benefit", "/ˈbenɪfɪt/", "lợi ích; có lợi", "B2", "Xã hội", "noun / verb", "benefit from sth; of benefit to sb", [
    ["Small businesses will [benefit from] the new policy.", "Doanh nghiệp nhỏ sẽ hưởng lợi từ chính sách mới."],
  ]],
  ["aware", "/əˈweə(r)/", "nhận thức được", "B2", "Xã hội", "adjective", "aware of sth; aware that…", [
    ["Are you [aware of] the risks?", "Bạn có nhận thức được rủi ro không?"],
  ]],
  ["capable", "/ˈkeɪpəbl/", "có năng lực", "B2", "Công việc", "adjective", "capable of sth/doing sth", [
    ["She is [capable of] running the company on her own.", "Cô ấy đủ khả năng tự điều hành công ty."],
  ]],
  ["familiar", "/fəˈmɪliə(r)/", "quen thuộc", "B2", "Học tập", "adjective", "familiar with sth (người biết); familiar to sb (thứ được biết)", [
    ["Are you [familiar with] this software?", "Bạn có quen dùng phần mềm này không?"],
  ]],
  ["eager", "/ˈiːɡə(r)/", "háo hức", "B2", "Cảm xúc", "adjective", "eager for sth; eager to do sth", [
    ["The children were [eager to] open their presents.", "Lũ trẻ háo hức mở quà."],
  ]],
  ["reluctant", "/rɪˈlʌktənt/", "miễn cưỡng", "B2", "Cảm xúc", "adjective", "reluctant to do sth", [
    ["He was [reluctant to] admit his mistake.", "Anh ấy miễn cưỡng thừa nhận lỗi của mình."],
  ]],
  ["deal", "/diːl/", "giải quyết, xử lý", "B2", "Công việc", "verb", "deal with sb/sth", [
    ["I'll [deal with] this problem tomorrow.", "Ngày mai tôi sẽ xử lý vấn đề này."],
  ]],
  ["access", "/ˈækses/", "quyền truy cập, tiếp cận", "B2", "Công nghệ", "noun", "access to sth", [
    ["Everyone should have [access to] clean water.", "Ai cũng nên được tiếp cận nước sạch."],
  ]],
  ["attitude", "/ˈætɪtjuːd/", "thái độ", "B2", "Quan hệ", "noun", "attitude to/towards sb/sth", [
    ["She has a positive [attitude towards] change.", "Cô ấy có thái độ tích cực với sự thay đổi."],
  ]],
  ["impact", "/ˈɪmpækt/", "tác động", "B2", "Xã hội", "noun", "impact on sb/sth", [
    ["Social media has a huge [impact on] young people.", "Mạng xã hội có tác động lớn đến giới trẻ."],
  ]],
  ["demand", "/dɪˈmɑːnd/", "nhu cầu; yêu cầu", "B2", "Tiền bạc", "noun", "demand for sth", [
    ["There is a growing [demand for] electric cars.", "Nhu cầu về xe điện ngày càng tăng."],
  ]],
  ["solution", "/səˈluːʃn/", "giải pháp", "B2", "Công việc", "noun", "solution to sth", [
    ["We need to find a [solution to] this problem.", "Chúng ta cần tìm giải pháp cho vấn đề này."],
  ]],
  ["argue", "/ˈɑːɡjuː/", "tranh cãi; lập luận", "B2", "Giao tiếp", "verb", "argue with sb about/over sth; argue for/against sth", [
    ["They often [argue about] money.", "Họ hay cãi nhau về tiền bạc."],
  ]],
  ["account", "/əˈkaʊnt/", "giải thích; chiếm (tỉ lệ)", "B2", "Tiền bạc", "verb", "account for sth", [
    ["Young people [account for] 40% of our customers.", "Người trẻ chiếm 40% khách hàng của chúng tôi."],
  ]],
  ["result", "/rɪˈzʌlt/", "dẫn đến; do bởi", "B2", "Xã hội", "verb", "result in sth (dẫn đến); result from sth (do bởi)", [
    ["The storm [resulted in] heavy flooding.", "Cơn bão gây ra lũ lụt nghiêm trọng."],
  ]],
  ["sustainable", "/səˈsteɪnəbl/", "bền vững", "B2", "Môi trường", "adjective", "", [
    ["The city is investing in [sustainable] transport.", "Thành phố đang đầu tư vào giao thông bền vững."],
  ]],
  ["reliable", "/rɪˈlaɪəbl/", "đáng tin cậy", "B2", "Quan hệ", "adjective", "", [
    ["We need a [reliable] internet connection.", "Chúng ta cần một kết nối internet ổn định."],
  ]],
  ["confident", "/ˈkɒnfɪdənt/", "tự tin", "B2", "Cảm xúc", "adjective", "confident of/about sth; confident in sb/sth", [
    ["I'm [confident about] tomorrow's interview.", "Tôi tự tin về buổi phỏng vấn ngày mai."],
  ]],
  ["comply", "/kəmˈplaɪ/", "tuân thủ", "B2", "Công việc", "verb", "comply with sth", [
    ["All products must [comply with] safety standards.", "Mọi sản phẩm phải tuân thủ tiêu chuẩn an toàn."],
  ]],

  // ---------- C1 ----------
  ["refrain", "/rɪˈfreɪn/", "kiềm chế, tránh", "C1", "Giao tiếp", "verb", "refrain from sth/doing sth", [
    ["Please [refrain from] smoking in this area.", "Vui lòng không hút thuốc ở khu vực này."],
  ]],
  ["adhere", "/ədˈhɪə(r)/", "tuân thủ; bám chặt", "C1", "Công việc", "verb", "adhere to sth", [
    ["Staff must [adhere to] the company's code of conduct.", "Nhân viên phải tuân thủ quy tắc ứng xử của công ty."],
  ]],
  ["dwell", "/dwel/", "day dứt, nghĩ mãi", "C1", "Cảm xúc", "verb", "dwell on/upon sth", [
    ["Don't [dwell on] your past mistakes.", "Đừng day dứt mãi về những sai lầm cũ."],
  ]],
  ["indulge", "/ɪnˈdʌldʒ/", "nuông chiều, tận hưởng", "C1", "Cảm xúc", "verb", "indulge in sth", [
    ["On holiday, I like to [indulge in] good food.", "Khi đi nghỉ, tôi thích tận hưởng đồ ăn ngon."],
  ]],
  ["susceptible", "/səˈseptəbl/", "dễ bị ảnh hưởng", "C1", "Sức khỏe", "adjective", "susceptible to sth", [
    ["Children are more [susceptible to] infections.", "Trẻ em dễ bị nhiễm trùng hơn."],
  ]],
  ["oblivious", "/əˈblɪviəs/", "không hay biết", "C1", "Cảm xúc", "adjective", "oblivious to/of sth", [
    ["He seemed [oblivious to] the danger.", "Anh ta dường như không hề hay biết về nguy hiểm."],
  ]],
  ["conducive", "/kənˈdjuːsɪv/", "có lợi cho, thuận lợi", "C1", "Học tập", "adjective", "conducive to sth", [
    ["A quiet room is [conducive to] studying.", "Một căn phòng yên tĩnh thuận lợi cho việc học."],
  ]],
  ["inclined", "/ɪnˈklaɪnd/", "có khuynh hướng", "C1", "Cảm xúc", "adjective", "inclined to do sth; inclined towards sth", [
    ["I'm [inclined to] agree with you.", "Tôi có phần đồng ý với bạn."],
  ]],
  ["resilient", "/rɪˈzɪliənt/", "kiên cường, phục hồi nhanh", "C1", "Cảm xúc", "adjective", "", [
    ["Children are often more [resilient] than adults think.", "Trẻ em thường kiên cường hơn người lớn nghĩ."],
  ]],
  ["compensate", "/ˈkɒmpenseɪt/", "bồi thường, bù đắp", "C1", "Tiền bạc", "verb", "compensate (sb) for sth", [
    ["The airline [compensated] passengers [for] the delay.", "Hãng bay bồi thường cho hành khách vì sự chậm trễ."],
  ]],
  ["deprive", "/dɪˈpraɪv/", "tước đoạt", "C1", "Xã hội", "verb", "deprive sb of sth", [
    ["Long working hours [deprive] people [of] sleep.", "Làm việc nhiều giờ khiến người ta thiếu ngủ."],
  ]],
  ["immune", "/ɪˈmjuːn/", "miễn dịch; miễn nhiễm", "C1", "Sức khỏe", "adjective", "immune to sth; immune from sth (miễn trừ)", [
    ["Nobody is [immune to] criticism.", "Không ai miễn nhiễm với lời chỉ trích."],
  ]],
  ["ambiguous", "/æmˈbɪɡjuəs/", "mơ hồ, nước đôi", "C1", "Giao tiếp", "adjective", "", [
    ["The instructions were [ambiguous].", "Hướng dẫn rất mơ hồ."],
  ]],
  ["meticulous", "/məˈtɪkjələs/", "tỉ mỉ, kỹ lưỡng", "C1", "Công việc", "adjective", "meticulous about/in sth", [
    ["She is [meticulous about] details.", "Cô ấy rất tỉ mỉ về chi tiết."],
  ]],

  // ---------- C2 ----------
  ["acquiesce", "/ˌækwiˈes/", "bằng lòng, ưng thuận (miễn cưỡng)", "C2", "Giao tiếp", "verb", "acquiesce in/to sth", [
    ["The board finally [acquiesced to] their demands.", "Hội đồng cuối cùng cũng ưng thuận yêu cầu của họ."],
  ]],
  ["ubiquitous", "/juːˈbɪkwɪtəs/", "có mặt khắp nơi", "C2", "Công nghệ", "adjective", "", [
    ["Smartphones have become [ubiquitous].", "Điện thoại thông minh đã có mặt ở khắp nơi."],
  ]],
  ["predisposed", "/ˌpriːdɪˈspəʊzd/", "có sẵn khuynh hướng", "C2", "Sức khỏe", "adjective", "predisposed to/towards sth", [
    ["Some people are genetically [predisposed to] heart disease.", "Một số người có sẵn yếu tố di truyền dễ mắc bệnh tim."],
  ]],
  ["tantamount", "/ˈtæntəmaʊnt/", "tương đương với (điều xấu)", "C2", "Xã hội", "adjective", "tantamount to sth", [
    ["His silence was [tantamount to] an admission of guilt.", "Sự im lặng của anh ta chẳng khác gì thừa nhận tội lỗi."],
  ]],
];
