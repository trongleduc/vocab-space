/**
 * [term, romanization (Revised Romanization, as pronounced), meaning, TOPIK level, topic, part of speech,
 *  usage note ("" if none), examples: [sentence, romanization, translation][]]
 * Verbs and adjectives are listed in dictionary form (-다); examples bracket the conjugated form.
 * Notes give the Sino-Vietnamese reading for Sino-Korean words, which helps Vietnamese learners.
 */
export type KoRow = [string, string, string, string, string, string, string, [string, string, string][]];

export const KO_WORDS: KoRow[] = [
  // ---------- TOPIK1 · Chào hỏi & con người ----------
  ["안녕하세요", "annyeonghaseyo", "xin chào", "TOPIK1", "Chào hỏi", "cụm từ", "Lời chào lịch sự, dùng được mọi lúc trong ngày.", [
    ["선생님, [안녕하세요]!", "Seonsaengnim, annyeonghaseyo!", "Em chào thầy/cô ạ!"],
  ]],
  ["감사합니다", "gamsahamnida", "cảm ơn", "TOPIK1", "Chào hỏi", "cụm từ", "Hán Việt: cảm tạ (感謝). Thân mật hơn: 고마워요.", [
    ["도와주셔서 [감사합니다].", "Dowajusyeoseo gamsahamnida.", "Cảm ơn vì đã giúp đỡ tôi."],
  ]],
  ["죄송합니다", "joesonghamnida", "xin lỗi (trang trọng)", "TOPIK1", "Chào hỏi", "cụm từ", "Nhẹ nhàng hơn: 미안해요.", [
    ["늦어서 [죄송합니다].", "Neujeoseo joesonghamnida.", "Xin lỗi vì tôi đến muộn."],
  ]],
  ["이름", "ireum", "tên", "TOPIK1", "Chào hỏi", "danh từ", "", [
    ["[이름]이 뭐예요?", "Ireumi mwoyeyo?", "Bạn tên là gì?"],
  ]],
  ["사람", "saram", "người", "TOPIK1", "Con người", "danh từ", "", [
    ["저는 베트남 [사람]이에요.", "Jeoneun beteunam saramieyo.", "Tôi là người Việt Nam."],
  ]],

  // ---------- TOPIK1 · Gia đình ----------
  ["가족", "gajok", "gia đình", "TOPIK1", "Gia đình", "danh từ", "Hán Việt: gia tộc (家族).", [
    ["우리 [가족]은 네 명이에요.", "Uri gajogeun ne myeongieyo.", "Gia đình tôi có bốn người."],
  ]],
  ["어머니", "eomeoni", "mẹ", "TOPIK1", "Gia đình", "danh từ", "Cách gọi thân mật: 엄마.", [
    ["[어머니]는 요리를 잘하세요.", "Eomeonineun yorireul jalhaseyo.", "Mẹ tôi nấu ăn giỏi."],
  ]],
  ["아버지", "abeoji", "bố", "TOPIK1", "Gia đình", "danh từ", "Cách gọi thân mật: 아빠.", [
    ["[아버지]는 회사원이세요.", "Abeojineun hoesawoniseyo.", "Bố tôi là nhân viên công ty."],
  ]],
  ["친구", "chingu", "bạn bè", "TOPIK1", "Con người", "danh từ", "Hán Việt: thân cựu (親舊).", [
    ["주말에 [친구]를 만나요.", "Jumare chingureul mannayo.", "Cuối tuần tôi gặp bạn."],
  ]],
  ["동생", "dongsaeng", "em (em trai, em gái)", "TOPIK1", "Gia đình", "danh từ", "Hán Việt: đồng sinh (同生). Em trai: 남동생, em gái: 여동생.", [
    ["제 [동생]은 대학생이에요.", "Je dongsaengeun daehaksaengieyo.", "Em tôi là sinh viên đại học."],
  ]],

  // ---------- TOPIK1 · Trường học ----------
  ["학교", "hakgyo", "trường học", "TOPIK1", "Trường học", "danh từ", "Hán Việt: học hiệu (學校).", [
    ["저는 [학교]에 가요.", "Jeoneun hakgyoe gayo.", "Tôi đi đến trường."],
  ]],
  ["학생", "haksaeng", "học sinh", "TOPIK1", "Trường học", "danh từ", "Hán Việt: học sinh (學生).", [
    ["저는 [학생]이에요.", "Jeoneun haksaengieyo.", "Tôi là học sinh."],
  ]],
  ["선생님", "seonsaengnim", "thầy giáo, cô giáo", "TOPIK1", "Trường học", "danh từ", "Hán Việt: tiên sinh (先生) + 님 (kính ngữ).", [
    ["[선생님], 질문이 있어요.", "Seonsaengnim, jilmuni isseoyo.", "Thưa thầy/cô, em có câu hỏi."],
  ]],
  ["공부하다", "gongbuhada", "học, học bài", "TOPIK1", "Trường học", "động từ", "Hán Việt: công phu (工夫).", [
    ["도서관에서 한국어를 [공부해요].", "Doseogwaneseo hangugeoreul gongbuhaeyo.", "Tôi học tiếng Hàn ở thư viện."],
  ]],
  ["책", "chaek", "sách", "TOPIK1", "Trường học", "danh từ", "Hán Việt: sách (冊).", [
    ["이 [책]은 재미있어요.", "I chaegeun jaemiisseoyo.", "Cuốn sách này hay."],
  ]],

  // ---------- TOPIK1 · Ăn uống ----------
  ["먹다", "meokda", "ăn", "TOPIK1", "Ăn uống", "động từ", "Kính ngữ: 드시다.", [
    ["아침에 빵을 [먹어요].", "Achime ppangeul meogeoyo.", "Buổi sáng tôi ăn bánh mì."],
  ]],
  ["마시다", "masida", "uống", "TOPIK1", "Ăn uống", "động từ", "", [
    ["커피를 [마셔요].", "Keopireul masyeoyo.", "Tôi uống cà phê."],
  ]],
  ["물", "mul", "nước", "TOPIK1", "Ăn uống", "danh từ", "", [
    ["[물] 좀 주세요.", "Mul jom juseyo.", "Cho tôi xin chút nước."],
  ]],
  ["밥", "bap", "cơm, bữa ăn", "TOPIK1", "Ăn uống", "danh từ", "\"밥 먹었어요?\" cũng là một câu chào hỏi thân mật.", [
    ["[밥] 먹었어요?", "Bap meogeosseoyo?", "Bạn ăn cơm chưa?"],
  ]],
  ["맛있다", "masitda", "ngon", "TOPIK1", "Ăn uống", "tính từ", "Trái nghĩa: 맛없다 (dở).", [
    ["이 김치는 정말 [맛있어요].", "I gimchineun jeongmal masisseoyo.", "Kim chi này ngon thật."],
  ]],
  ["식당", "sikdang", "nhà hàng, quán ăn", "TOPIK1", "Ăn uống", "danh từ", "Hán Việt: thực đường (食堂).", [
    ["학교 앞에 [식당]이 많아요.", "Hakgyo ape sikdangi manayo.", "Trước trường có nhiều quán ăn."],
  ]],

  // ---------- TOPIK1 · Hoạt động ----------
  ["가다", "gada", "đi", "TOPIK1", "Hoạt động", "động từ", "", [
    ["내일 서울에 [가요].", "Naeil seoure gayo.", "Ngày mai tôi đi Seoul."],
  ]],
  ["오다", "oda", "đến", "TOPIK1", "Hoạt động", "động từ", "", [
    ["친구가 집에 [와요].", "Chinguga jibe wayo.", "Bạn đến nhà tôi."],
  ]],
  ["보다", "boda", "xem, nhìn", "TOPIK1", "Hoạt động", "động từ", "", [
    ["저녁에 영화를 [봐요].", "Jeonyeoge yeonghwareul bwayo.", "Buổi tối tôi xem phim."],
  ]],
  ["하다", "hada", "làm", "TOPIK1", "Hoạt động", "động từ", "Ghép sau danh từ để tạo động từ: 공부하다, 운동하다…", [
    ["주말에 뭐 [해요]?", "Jumare mwo haeyo?", "Cuối tuần bạn làm gì?"],
  ]],
  ["자다", "jada", "ngủ", "TOPIK1", "Hoạt động", "động từ", "Kính ngữ: 주무시다.", [
    ["보통 11시에 [자요].", "Botong yeolhansie jayo.", "Tôi thường ngủ lúc 11 giờ."],
  ]],
  ["좋아하다", "joahada", "thích", "TOPIK1", "Cảm xúc", "động từ", "Dùng với tân ngữ 을/를: 커피를 좋아해요.", [
    ["저는 커피를 [좋아해요].", "Jeoneun keopireul joahaeyo.", "Tôi thích cà phê."],
  ]],

  // ---------- TOPIK1 · Mua sắm ----------
  ["얼마", "eolma", "bao nhiêu (tiền)", "TOPIK1", "Mua sắm", "đại từ", "", [
    ["이거 [얼마]예요?", "Igeo eolmayeyo?", "Cái này bao nhiêu tiền?"],
  ]],
  ["사다", "sada", "mua", "TOPIK1", "Mua sắm", "động từ", "", [
    ["시장에서 과일을 [사요].", "Sijangeseo gwaireul sayo.", "Tôi mua trái cây ở chợ."],
  ]],
  ["비싸다", "bissada", "đắt", "TOPIK1", "Mua sắm", "tính từ", "", [
    ["이 가방은 너무 [비싸요].", "I gabangeun neomu bissayo.", "Cái túi này đắt quá."],
  ]],
  ["싸다", "ssada", "rẻ", "TOPIK1", "Mua sắm", "tính từ", "", [
    ["여기는 옷이 [싸요].", "Yeogineun osi ssayo.", "Ở đây quần áo rẻ."],
  ]],

  // ---------- TOPIK1 · Thời gian ----------
  ["오늘", "oneul", "hôm nay", "TOPIK1", "Thời gian", "danh từ", "", [
    ["[오늘] 날씨가 좋아요.", "Oneul nalssiga joayo.", "Hôm nay trời đẹp."],
  ]],
  ["내일", "naeil", "ngày mai", "TOPIK1", "Thời gian", "danh từ", "Hán Việt: lai nhật (來日).", [
    ["[내일] 만나요.", "Naeil mannayo.", "Mai gặp nhé."],
  ]],
  ["어제", "eoje", "hôm qua", "TOPIK1", "Thời gian", "danh từ", "", [
    ["[어제] 뭐 했어요?", "Eoje mwo haesseoyo?", "Hôm qua bạn làm gì?"],
  ]],
  ["시간", "sigan", "thời gian; giờ (tiếng đồng hồ)", "TOPIK1", "Thời gian", "danh từ", "Hán Việt: thời gian (時間).", [
    ["[시간]이 없어요.", "Sigani eopseoyo.", "Tôi không có thời gian."],
  ]],
  ["아침", "achim", "buổi sáng; bữa sáng", "TOPIK1", "Thời gian", "danh từ", "", [
    ["[아침]에 운동해요.", "Achime undonghaeyo.", "Buổi sáng tôi tập thể dục."],
  ]],

  // ---------- TOPIK1 · Nơi chốn & đi lại ----------
  ["집", "jip", "nhà", "TOPIK1", "Nơi chốn", "danh từ", "", [
    ["[집]에 가고 싶어요.", "Jibe gago sipeoyo.", "Tôi muốn về nhà."],
  ]],
  ["화장실", "hwajangsil", "nhà vệ sinh", "TOPIK1", "Nơi chốn", "danh từ", "Hán Việt: hóa trang thất (化粧室).", [
    ["[화장실]이 어디예요?", "Hwajangsiri eodiyeyo?", "Nhà vệ sinh ở đâu?"],
  ]],
  ["어디", "eodi", "ở đâu", "TOPIK1", "Nơi chốn", "đại từ", "", [
    ["지금 [어디]에 있어요?", "Jigeum eodie isseoyo?", "Bây giờ bạn đang ở đâu?"],
  ]],
  ["지하철", "jihacheol", "tàu điện ngầm", "TOPIK1", "Đi lại", "danh từ", "Hán Việt: địa hạ thiết (地下鐵).", [
    ["[지하철]로 회사에 가요.", "Jihacheollo hoesae gayo.", "Tôi đi làm bằng tàu điện ngầm."],
  ]],
  ["버스", "beoseu", "xe buýt", "TOPIK1", "Đi lại", "danh từ", "Đi xe: 버스를 타다.", [
    ["[버스]를 타요.", "Beoseureul tayo.", "Tôi đi xe buýt."],
  ]],

  // ---------- TOPIK1 · Thời tiết, cảm xúc, sức khỏe ----------
  ["덥다", "deopda", "nóng (thời tiết)", "TOPIK1", "Thời tiết", "tính từ", "Bất quy tắc ㅂ: 덥다 → 더워요.", [
    ["여름에는 너무 [더워요].", "Yeoreumeneun neomu deowoyo.", "Mùa hè nóng quá."],
  ]],
  ["춥다", "chupda", "lạnh (thời tiết)", "TOPIK1", "Thời tiết", "tính từ", "Bất quy tắc ㅂ: 춥다 → 추워요.", [
    ["오늘 정말 [추워요].", "Oneul jeongmal chuwoyo.", "Hôm nay lạnh thật."],
  ]],
  ["좋다", "jota", "tốt, hay, đẹp", "TOPIK1", "Cảm xúc", "tính từ", "", [
    ["날씨가 [좋아요].", "Nalssiga joayo.", "Trời đẹp."],
  ]],
  ["행복하다", "haengbokada", "hạnh phúc", "TOPIK1", "Cảm xúc", "tính từ", "Hán Việt: hạnh phúc (幸福).", [
    ["가족과 함께 있어서 [행복해요].", "Gajokgwa hamkke isseoseo haengbokaeyo.", "Tôi hạnh phúc vì được ở bên gia đình."],
  ]],
  ["아프다", "apeuda", "đau, ốm", "TOPIK1", "Sức khỏe", "tính từ", "", [
    ["머리가 [아파요].", "Meoriga apayo.", "Tôi đau đầu."],
  ]],

  // ---------- TOPIK2 ----------
  ["약속", "yaksok", "cuộc hẹn; lời hứa", "TOPIK2", "Giao tiếp", "danh từ", "Hán Việt: ước thúc (約束).", [
    ["오늘 친구하고 [약속]이 있어요.", "Oneul chinguhago yaksogi isseoyo.", "Hôm nay tôi có hẹn với bạn."],
  ]],
  ["여행", "yeohaeng", "du lịch", "TOPIK2", "Hoạt động", "danh từ", "Hán Việt: lữ hành (旅行).", [
    ["방학에 제주도로 [여행]을 가요.", "Banghage jejudoro yeohaengeul gayo.", "Kỳ nghỉ tôi đi du lịch đảo Jeju."],
  ]],
  ["회사", "hoesa", "công ty", "TOPIK2", "Công việc", "danh từ", "Hán Việt: hội xã (會社).", [
    ["[회사]가 집에서 멀어요.", "Hoesaga jibeseo meoreoyo.", "Công ty xa nhà tôi."],
  ]],
  ["일하다", "ilhada", "làm việc", "TOPIK2", "Công việc", "động từ", "", [
    ["은행에서 [일해요].", "Eunhaengeseo ilhaeyo.", "Tôi làm việc ở ngân hàng."],
  ]],
  ["병원", "byeongwon", "bệnh viện", "TOPIK2", "Sức khỏe", "danh từ", "Hán Việt: bệnh viện (病院).", [
    ["감기 때문에 [병원]에 갔어요.", "Gamgi ttaemune byeongwone gasseoyo.", "Vì bị cảm nên tôi đã đi bệnh viện."],
  ]],
  ["약", "yak", "thuốc", "TOPIK2", "Sức khỏe", "danh từ", "Hán Việt: dược (藥). Uống thuốc: 약을 먹다.", [
    ["하루에 세 번 [약]을 드세요.", "Harue se beon yageul deuseyo.", "Hãy uống thuốc ngày ba lần."],
  ]],
  ["감기", "gamgi", "cảm cúm", "TOPIK2", "Sức khỏe", "danh từ", "Hán Việt: cảm khí (感氣). Bị cảm: 감기에 걸리다.", [
    ["[감기]에 걸렸어요.", "Gamgie geollyeosseoyo.", "Tôi bị cảm rồi."],
  ]],
  ["날씨", "nalssi", "thời tiết", "TOPIK2", "Thời tiết", "danh từ", "", [
    ["주말 [날씨]가 어때요?", "Jumal nalssiga eottaeyo?", "Thời tiết cuối tuần thế nào?"],
  ]],
  ["취미", "chwimi", "sở thích", "TOPIK2", "Hoạt động", "danh từ", "Hán Việt: thú vị (趣味).", [
    ["제 [취미]는 사진 찍기예요.", "Je chwimineun sajin jjikgiyeyo.", "Sở thích của tôi là chụp ảnh."],
  ]],
  ["연습하다", "yeonseupada", "luyện tập", "TOPIK2", "Học tập", "động từ", "Hán Việt: luyện tập (練習).", [
    ["매일 피아노를 [연습해요].", "Maeil pianoreul yeonseupaeyo.", "Ngày nào tôi cũng luyện piano."],
  ]],
  ["준비하다", "junbihada", "chuẩn bị", "TOPIK2", "Học tập", "động từ", "Hán Việt: chuẩn bị (準備).", [
    ["시험을 [준비하고] 있어요.", "Siheomeul junbihago isseoyo.", "Tôi đang chuẩn bị cho kỳ thi."],
  ]],
  ["시험", "siheom", "kỳ thi, bài kiểm tra", "TOPIK2", "Học tập", "danh từ", "Hán Việt: thí nghiệm (試驗).", [
    ["다음 주에 [시험]이 있어요.", "Daeum jue siheomi isseoyo.", "Tuần sau có kỳ thi."],
  ]],
  ["쉽다", "swipda", "dễ", "TOPIK2", "Học tập", "tính từ", "Bất quy tắc ㅂ: 쉽다 → 쉬워요.", [
    ["이 문제는 [쉬워요].", "I munjeneun swiwoyo.", "Bài này dễ."],
  ]],
  ["어렵다", "eoryeopda", "khó", "TOPIK2", "Học tập", "tính từ", "Bất quy tắc ㅂ: 어렵다 → 어려워요.", [
    ["한국어 발음이 조금 [어려워요].", "Hangugeo bareumi jogeum eoryeowoyo.", "Phát âm tiếng Hàn hơi khó."],
  ]],
  ["바쁘다", "bappeuda", "bận", "TOPIK2", "Công việc", "tính từ", "", [
    ["요즘 일이 많아서 [바빠요].", "Yojeum iri manaseo bappayo.", "Dạo này nhiều việc nên tôi bận."],
  ]],
  ["피곤하다", "pigonhada", "mệt mỏi", "TOPIK2", "Sức khỏe", "tính từ", "Hán Việt: bì khốn (疲困).", [
    ["어제 늦게 자서 [피곤해요].", "Eoje neutge jaseo pigonhaeyo.", "Hôm qua ngủ muộn nên tôi mệt."],
  ]],
  ["기억하다", "gieokada", "nhớ, ghi nhớ", "TOPIK2", "Học tập", "động từ", "Hán Việt: ký ức (記憶).", [
    ["그 사람 이름을 [기억해요]?", "Geu saram ireumeul gieokaeyo?", "Bạn có nhớ tên người đó không?"],
  ]],
  ["잊다", "itda", "quên", "TOPIK2", "Học tập", "động từ", "Hay dùng dạng 잊어버리다 (quên mất).", [
    ["우산을 [잊어버렸어요].", "Usaneul ijeobeoryeosseoyo.", "Tôi quên mất cái ô rồi."],
  ]],
  ["빌리다", "billida", "mượn", "TOPIK2", "Hoạt động", "động từ", "Cho mượn: 빌려주다.", [
    ["도서관에서 책을 [빌렸어요].", "Doseogwaneseo chaegeul billyeosseoyo.", "Tôi đã mượn sách ở thư viện."],
  ]],
  ["갈아타다", "garatada", "chuyển (tàu, xe)", "TOPIK2", "Đi lại", "động từ", "", [
    ["시청역에서 2호선으로 [갈아타세요].", "Sicheongyeogeseo ihoseoneuro garataseyo.", "Hãy chuyển sang tuyến số 2 ở ga Tòa thị chính."],
  ]],
  ["그래서", "geuraeseo", "vì vậy, cho nên", "TOPIK2", "Từ nối", "phó từ", "Đứng đầu câu, nối nguyên nhân với kết quả.", [
    ["비가 왔어요. [그래서] 집에 있었어요.", "Biga wasseoyo. Geuraeseo jibe isseosseoyo.", "Trời mưa. Vì vậy tôi ở nhà."],
  ]],
  ["그런데", "geureonde", "nhưng mà; mà này", "TOPIK2", "Từ nối", "phó từ", "Dùng để đối lập hoặc chuyển chủ đề.", [
    ["맛있어요. [그런데] 좀 비싸요.", "Masisseoyo. Geureonde jom bissayo.", "Ngon. Nhưng mà hơi đắt."],
  ]],
  ["자주", "jaju", "thường xuyên", "TOPIK2", "Từ nối", "phó từ", "", [
    ["이 카페에 [자주] 와요.", "I kapee jaju wayo.", "Tôi hay đến quán cà phê này."],
  ]],
  ["아직", "ajik", "vẫn, vẫn chưa", "TOPIK2", "Từ nối", "phó từ", "", [
    ["[아직] 숙제를 안 했어요.", "Ajik sukjereul an haesseoyo.", "Tôi vẫn chưa làm bài tập."],
  ]],
  ["걱정하다", "geokjeonghada", "lo lắng", "TOPIK2", "Cảm xúc", "động từ", "", [
    ["너무 [걱정하지] 마세요.", "Neomu geokjeonghaji maseyo.", "Đừng lo lắng quá."],
  ]],

  // ---------- TOPIK3 ----------
  ["경험", "gyeongheom", "kinh nghiệm, trải nghiệm", "TOPIK3", "Xã hội", "danh từ", "Hán Việt: kinh nghiệm (經驗).", [
    ["외국에서 살아 본 [경험]이 있어요?", "Oegugeseo sara bon gyeongheomi isseoyo?", "Bạn đã từng sống ở nước ngoài chưa?"],
  ]],
  ["문화", "munhwa", "văn hóa", "TOPIK3", "Xã hội", "danh từ", "Hán Việt: văn hóa (文化).", [
    ["한국 [문화]에 관심이 많아요.", "Hanguk munhwae gwansimi manayo.", "Tôi rất quan tâm đến văn hóa Hàn Quốc."],
  ]],
  ["관심", "gwansim", "sự quan tâm, hứng thú", "TOPIK3", "Cảm xúc", "danh từ", "Hán Việt: quan tâm (關心).", [
    ["요즘 요리에 [관심]이 생겼어요.", "Yojeum yorie gwansimi saenggyeosseoyo.", "Dạo này tôi bắt đầu thấy hứng thú với nấu ăn."],
  ]],
  ["직장", "jikjang", "nơi làm việc, chỗ làm", "TOPIK3", "Công việc", "danh từ", "Hán Việt: chức trường (職場).", [
    ["[직장] 동료들과 사이가 좋아요.", "Jikjang dongnyodeulgwa saiga joayo.", "Tôi hòa hợp với đồng nghiệp ở chỗ làm."],
  ]],
  ["회의", "hoeui", "cuộc họp", "TOPIK3", "Công việc", "danh từ", "Hán Việt: hội nghị (會議).", [
    ["오후 3시에 [회의]가 있어요.", "Ohu sesie hoeuiga isseoyo.", "3 giờ chiều có cuộc họp."],
  ]],
  ["계획", "gyehoek", "kế hoạch", "TOPIK3", "Công việc", "danh từ", "Hán Việt: kế hoạch (計劃).", [
    ["올해 [계획]이 뭐예요?", "Olhae gyehoegi mwoyeyo?", "Kế hoạch năm nay của bạn là gì?"],
  ]],
  ["결정하다", "gyeoljeonghada", "quyết định", "TOPIK3", "Công việc", "động từ", "Hán Việt: quyết định (決定).", [
    ["아직 [결정하지] 못했어요.", "Ajik gyeoljeonghaji motaesseoyo.", "Tôi vẫn chưa quyết định được."],
  ]],
  ["노력하다", "noryeokada", "nỗ lực, cố gắng", "TOPIK3", "Học tập", "động từ", "Hán Việt: nỗ lực (努力).", [
    ["더 열심히 [노력하겠습니다].", "Deo yeolsimhi noryeokagetseumnida.", "Tôi sẽ cố gắng chăm chỉ hơn."],
  ]],
  ["환경", "hwangyeong", "môi trường", "TOPIK3", "Môi trường", "danh từ", "Hán Việt: hoàn cảnh (環境).", [
    ["[환경]을 보호해야 해요.", "Hwangyeongeul bohohaeya haeyo.", "Chúng ta phải bảo vệ môi trường."],
  ]],
  ["이용하다", "iyonghada", "sử dụng", "TOPIK3", "Xã hội", "động từ", "Hán Việt: lợi dụng (利用), nhưng nghĩa trung tính là \"sử dụng\".", [
    ["대중교통을 [이용하세요].", "Daejunggyotongeul iyonghaseyo.", "Hãy sử dụng phương tiện công cộng."],
  ]],
  ["소개하다", "sogaehada", "giới thiệu", "TOPIK3", "Giao tiếp", "động từ", "Hán Việt: thiệu giới (紹介).", [
    ["제 친구를 [소개할게요].", "Je chingureul sogaehalgeyo.", "Để tôi giới thiệu bạn tôi."],
  ]],
  ["익숙하다", "iksukada", "quen, quen thuộc", "TOPIK3", "Cảm xúc", "tính từ", "Trở nên quen: 익숙해지다.", [
    ["이제 한국 생활에 [익숙해졌어요].", "Ije hanguk saenghware iksukaejyeosseoyo.", "Giờ tôi đã quen với cuộc sống ở Hàn."],
  ]],
  ["실수", "silsu", "sai sót, lỗi", "TOPIK3", "Công việc", "danh từ", "Hán Việt: thất thủ (失手).", [
    ["누구나 [실수]할 수 있어요.", "Nuguna silsuhal su isseoyo.", "Ai cũng có thể mắc lỗi."],
  ]],
  ["성격", "seonggyeok", "tính cách", "TOPIK3", "Con người", "danh từ", "Hán Việt: tính cách (性格).", [
    ["그 사람은 [성격]이 밝아요.", "Geu sarameun seonggyeogi balgayo.", "Người đó tính cách vui vẻ."],
  ]],
  ["분위기", "bunwigi", "bầu không khí", "TOPIK3", "Xã hội", "danh từ", "Hán Việt: phân vi khí (雰圍氣).", [
    ["이 카페는 [분위기]가 좋아요.", "I kapeneun bunwigiga joayo.", "Quán cà phê này không khí dễ chịu."],
  ]],
  ["고민", "gomin", "nỗi băn khoăn, trăn trở", "TOPIK3", "Cảm xúc", "danh từ", "Hán Việt: khổ muộn (苦悶).", [
    ["요즘 진로 때문에 [고민]이 많아요.", "Yojeum jillo ttaemune gomini manayo.", "Dạo này tôi trăn trở nhiều về con đường tương lai."],
  ]],
  ["갑자기", "gapjagi", "đột nhiên", "TOPIK3", "Từ nối", "phó từ", "", [
    ["[갑자기] 비가 내리기 시작했어요.", "Gapjagi biga naerigi sijakaesseoyo.", "Đột nhiên trời bắt đầu mưa."],
  ]],
  ["오히려", "ohiryeo", "ngược lại, trái lại", "TOPIK3", "Từ nối", "phó từ", "", [
    ["약을 먹었는데 [오히려] 더 아파요.", "Yageul meogeonneunde ohiryeo deo apayo.", "Uống thuốc rồi mà ngược lại còn đau hơn."],
  ]],

  // ---------- TOPIK4 ----------
  ["경제", "gyeongje", "kinh tế", "TOPIK4", "Xã hội", "danh từ", "Hán Việt: kinh tế (經濟).", [
    ["[경제]가 점점 좋아지고 있어요.", "Gyeongjega jeomjeom joajigo isseoyo.", "Kinh tế đang dần tốt lên."],
  ]],
  ["사회", "sahoe", "xã hội", "TOPIK4", "Xã hội", "danh từ", "Hán Việt: xã hội (社會).", [
    ["현대 [사회]에서는 스트레스가 많아요.", "Hyeondae sahoeeseoneun seuteureseuga manayo.", "Trong xã hội hiện đại có nhiều căng thẳng."],
  ]],
  ["영향", "yeonghyang", "ảnh hưởng", "TOPIK4", "Xã hội", "danh từ", "Hán Việt: ảnh hưởng (影響). Gây ảnh hưởng: 영향을 주다/미치다.", [
    ["부모님은 저에게 큰 [영향]을 주셨어요.", "Bumonimeun jeoege keun yeonghyangeul jusyeosseoyo.", "Bố mẹ đã ảnh hưởng lớn đến tôi."],
  ]],
  ["발전하다", "baljeonhada", "phát triển", "TOPIK4", "Xã hội", "động từ", "Hán Việt: phát triển (發展).", [
    ["기술이 빠르게 [발전하고] 있어요.", "Gisuri ppareuge baljeonhago isseoyo.", "Công nghệ đang phát triển nhanh chóng."],
  ]],
  ["해결하다", "haegyeolhada", "giải quyết", "TOPIK4", "Công việc", "động từ", "Hán Việt: giải quyết (解決).", [
    ["이 문제를 어떻게 [해결할까요]?", "I munjereul eotteoke haegyeolhalkkayo?", "Giải quyết vấn đề này thế nào đây?"],
  ]],
  ["증가하다", "jeunggahada", "tăng lên", "TOPIK4", "Xã hội", "động từ", "Hán Việt: tăng gia (增加). Trái nghĩa: 감소하다.", [
    ["1인 가구가 [증가하고] 있어요.", "Irin gaguga jeunggahago isseoyo.", "Số hộ gia đình một người đang tăng lên."],
  ]],
  ["감소하다", "gamsohada", "giảm", "TOPIK4", "Xã hội", "động từ", "Hán Việt: giảm thiểu (減少).", [
    ["출산율이 계속 [감소하고] 있어요.", "Chulsanyuri gyesok gamsohago isseoyo.", "Tỉ lệ sinh tiếp tục giảm."],
  ]],
  ["의견", "uigyeon", "ý kiến", "TOPIK4", "Giao tiếp", "danh từ", "Hán Việt: ý kiến (意見).", [
    ["제 [의견]은 조금 달라요.", "Je uigyeoneun jogeum dallayo.", "Ý kiến của tôi hơi khác."],
  ]],
  ["주장하다", "jujanghada", "khẳng định, chủ trương", "TOPIK4", "Giao tiếp", "động từ", "Hán Việt: chủ trương (主張).", [
    ["그는 자기가 옳다고 [주장했어요].", "Geuneun jagiga oltago jujanghaesseoyo.", "Anh ấy khẳng định mình đúng."],
  ]],
  ["극복하다", "geukbokada", "vượt qua, khắc phục", "TOPIK4", "Cảm xúc", "động từ", "Hán Việt: khắc phục (克服).", [
    ["어려움을 [극복하고] 성공했어요.", "Eoryeoumeul geukbokago seonggonghaesseoyo.", "Anh ấy đã vượt qua khó khăn và thành công."],
  ]],
  ["적응하다", "jeogeunghada", "thích nghi", "TOPIK4", "Xã hội", "động từ", "Hán Việt: thích ứng (適應).", [
    ["새 학교에 [적응하는] 데 시간이 걸렸어요.", "Sae hakgyoe jeogeunghaneun de sigani geollyeosseoyo.", "Tôi mất một thời gian để thích nghi với trường mới."],
  ]],
  ["효과", "hyogwa", "hiệu quả, tác dụng", "TOPIK4", "Sức khỏe", "danh từ", "Hán Việt: hiệu quả (效果).", [
    ["이 약은 [효과]가 빨라요.", "I yageun hyogwaga ppallayo.", "Thuốc này có tác dụng nhanh."],
  ]],
  ["책임", "chaegim", "trách nhiệm", "TOPIK4", "Công việc", "danh từ", "Hán Việt: trách nhiệm (責任).", [
    ["이 일은 제 [책임]이에요.", "I ireun je chaegimieyo.", "Việc này là trách nhiệm của tôi."],
  ]],
  ["기회", "gihoe", "cơ hội", "TOPIK4", "Công việc", "danh từ", "Hán Việt: cơ hội (機會).", [
    ["좋은 [기회]를 놓치지 마세요.", "Joeun gihoereul nochiji maseyo.", "Đừng bỏ lỡ cơ hội tốt."],
  ]],
  ["꾸준히", "kkujunhi", "đều đặn, bền bỉ", "TOPIK4", "Học tập", "phó từ", "", [
    ["[꾸준히] 공부하면 실력이 늘어요.", "Kkujunhi gongbuhamyeon sillyeogi neureoyo.", "Học đều đặn thì trình độ sẽ tiến bộ."],
  ]],

  // ---------- TOPIK5 (văn viết, đuôi -다) ----------
  ["현상", "hyeonsang", "hiện tượng", "TOPIK5", "Học thuật", "danh từ", "Hán Việt: hiện tượng (現象).", [
    ["이것은 자연스러운 [현상]입니다.", "Igeoseun jayeonseureoun hyeonsangimnida.", "Đây là một hiện tượng tự nhiên."],
  ]],
  ["인식", "insik", "nhận thức", "TOPIK5", "Xã hội", "danh từ", "Hán Việt: nhận thức (認識).", [
    ["환경 문제에 대한 [인식]이 높아졌다.", "Hwangyeong munjee daehan insigi nopajyeotda.", "Nhận thức về vấn đề môi trường đã được nâng cao."],
  ]],
  ["갈등", "galdeung", "mâu thuẫn, xung đột", "TOPIK5", "Xã hội", "danh từ", "Hán Việt: cát đằng (葛藤).", [
    ["세대 간 [갈등]이 심해지고 있다.", "Sedae gan galdeungi simhaejigo itda.", "Mâu thuẫn giữa các thế hệ ngày càng gay gắt."],
  ]],
  ["대책", "daechaek", "biện pháp đối phó", "TOPIK5", "Xã hội", "danh từ", "Hán Việt: đối sách (對策).", [
    ["정부는 새로운 [대책]을 발표했다.", "Jeongbuneun saeroun daechaegeul balpyohaetda.", "Chính phủ đã công bố biện pháp mới."],
  ]],
  ["추세", "chuse", "xu thế, xu hướng", "TOPIK5", "Xã hội", "danh từ", "Hán Việt: xu thế (趨勢).", [
    ["온라인 쇼핑이 늘어나는 [추세]이다.", "Ollain syopingi neureonaneun chuseida.", "Mua sắm trực tuyến đang có xu hướng tăng."],
  ]],
  ["개선하다", "gaeseonhada", "cải thiện", "TOPIK5", "Công việc", "động từ", "Hán Việt: cải thiện (改善).", [
    ["근무 환경을 [개선해야] 한다.", "Geunmu hwangyeongeul gaeseonhaeya handa.", "Cần phải cải thiện môi trường làm việc."],
  ]],
  ["확보하다", "hwakbohada", "đảm bảo có được, giành được", "TOPIK5", "Công việc", "động từ", "Hán Việt: xác bảo (確保).", [
    ["충분한 예산을 [확보했다].", "Chungbunhan yesaneul hwakbohaetda.", "Đã đảm bảo đủ ngân sách."],
  ]],
  ["지적하다", "jijeokada", "chỉ ra", "TOPIK5", "Giao tiếp", "động từ", "Hán Việt: chỉ trích (指摘), nhưng nghĩa là \"chỉ ra\", không nặng như \"chỉ trích\" trong tiếng Việt.", [
    ["전문가들은 문제점을 [지적했다].", "Jeonmungadeureun munjejeomeul jijeokaetda.", "Các chuyên gia đã chỉ ra những điểm có vấn đề."],
  ]],
  ["바람직하다", "baramjikada", "đáng mong muốn, đúng đắn", "TOPIK5", "Giao tiếp", "tính từ", "", [
    ["대화로 해결하는 것이 [바람직하다].", "Daehwaro haegyeolhaneun geosi baramjikada.", "Giải quyết bằng đối thoại là cách đúng đắn."],
  ]],
  ["불가피하다", "bulgapihada", "không thể tránh khỏi", "TOPIK5", "Học thuật", "tính từ", "Hán Việt: bất khả tị (不可避).", [
    ["어느 정도의 손실은 [불가피하다].", "Eoneu jeongdoui sonsireun bulgapihada.", "Một mức tổn thất nhất định là không thể tránh khỏi."],
  ]],
  ["뚜렷하다", "ttureotada", "rõ rệt", "TOPIK5", "Học thuật", "tính từ", "", [
    ["두 의견의 차이가 [뚜렷하다].", "Du uigyeonui chaiga ttureotada.", "Sự khác biệt giữa hai ý kiến rất rõ rệt."],
  ]],
  ["비판하다", "bipanhada", "phê phán", "TOPIK5", "Xã hội", "động từ", "Hán Việt: phê phán (批判).", [
    ["언론은 정부 정책을 [비판했다].", "Eolloneun jeongbu jeongchaegeul bipanhaetda.", "Báo chí đã phê phán chính sách của chính phủ."],
  ]],

  // ---------- TOPIK6 ----------
  ["패러다임", "paereodaim", "mô hình tư duy (paradigm)", "TOPIK6", "Học thuật", "danh từ", "", [
    ["기술이 산업의 [패러다임]을 바꾸고 있다.", "Gisuri saneobui paereodaimeul bakkugo itda.", "Công nghệ đang thay đổi mô hình tư duy của ngành công nghiệp."],
  ]],
  ["양극화", "yanggeukhwa", "sự phân cực", "TOPIK6", "Xã hội", "danh từ", "Hán Việt: lưỡng cực hóa (兩極化).", [
    ["소득 [양극화]가 심각하다.", "Sodeuk yanggeukhwaga simgakada.", "Sự phân cực thu nhập rất nghiêm trọng."],
  ]],
  ["모색하다", "mosaekada", "tìm tòi, tìm kiếm (giải pháp)", "TOPIK6", "Học thuật", "động từ", "Hán Việt: mô sách (摸索).", [
    ["새로운 해결책을 [모색해야] 한다.", "Saeroun haegyeolchaegeul mosaekaeya handa.", "Cần tìm kiếm giải pháp mới."],
  ]],
  ["간과하다", "gangwahada", "xem nhẹ, bỏ qua", "TOPIK6", "Học thuật", "động từ", "Hán Việt: khán quá (看過).", [
    ["작은 문제라도 [간과해서는] 안 된다.", "Jageun munjerado gangwahaeseoneun an doenda.", "Dù là vấn đề nhỏ cũng không được xem nhẹ."],
  ]],
  ["초래하다", "choraehada", "gây ra, dẫn đến (kết quả xấu)", "TOPIK6", "Học thuật", "động từ", "Hán Việt: chiêu lai (招來).", [
    ["무분별한 개발은 환경 파괴를 [초래한다].", "Mubunbyeolhan gaebareun hwangyeong pagoereul choraehanda.", "Phát triển bừa bãi gây ra sự tàn phá môi trường."],
  ]],
  ["수반하다", "subanhada", "kèm theo", "TOPIK6", "Học thuật", "động từ", "Hán Việt: tùy bạn (隨伴). Hay dùng bị động 수반되다.", [
    ["변화에는 늘 위험이 [수반된다].", "Byeonhwaeneun neul wiheomi subandoenda.", "Thay đổi luôn kèm theo rủi ro."],
  ]],
  ["지속 가능하다", "jisok ganeunghada", "bền vững", "TOPIK6", "Môi trường", "tính từ", "Hán Việt: trì tục khả năng (持續可能).", [
    ["[지속 가능한] 발전이 필요하다.", "Jisok ganeunghan baljeoni piryohada.", "Cần sự phát triển bền vững."],
  ]],
  ["함축하다", "hamchukada", "hàm chứa, hàm ý", "TOPIK6", "Học thuật", "động từ", "Hán Việt: hàm súc (含蓄).", [
    ["이 시는 깊은 의미를 [함축하고] 있다.", "I sineun gipeun uimireul hamchukago itda.", "Bài thơ này hàm chứa ý nghĩa sâu sắc."],
  ]],
  ["막론하다", "mangnonhada", "bất kể, không kể", "TOPIK6", "Học thuật", "động từ", "Hán Việt: mạc luận (莫論). Thường dùng dạng ~을/를 막론하고.", [
    ["나이를 [막론하고] 누구나 참여할 수 있다.", "Naireul mangnonhago nuguna chamyeohal su itda.", "Bất kể tuổi tác, ai cũng có thể tham gia."],
  ]],
  ["역설하다", "yeokseolhada", "nhấn mạnh, ra sức khẳng định", "TOPIK6", "Giao tiếp", "động từ", "Hán Việt: lực thuyết (力說). Đừng nhầm với 역설 (逆說) là \"nghịch lý\".", [
    ["그는 교육의 중요성을 [역설했다].", "Geuneun gyoyugui jungyoseongeul yeokseolhaetda.", "Ông ấy nhấn mạnh tầm quan trọng của giáo dục."],
  ]],
];
