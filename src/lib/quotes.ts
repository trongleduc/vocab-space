/** Motivational lines shown with celebrations and quiz results. Safe to import on the client. */

export type Quote = {
  /** Original-language text (Chinese/Japanese/Korean proverb, English quote). Omitted for Vietnamese-only lines. */
  original?: string;
  reading?: string;
  /** Vietnamese text shown to the user. */
  text: string;
  by?: string;
};

export type QuoteCategory = "streak" | "milestone" | "goal" | "rank" | "perfect" | "good" | "tryAgain";

export const QUOTES: Record<QuoteCategory, Quote[]> = {
  streak: [
    { original: "継続は力なり", reading: "keizoku wa chikara nari", text: "Kiên trì chính là sức mạnh." },
    { original: "티끌 모아 태산", reading: "tikkeul moa taesan", text: "Góp bụi thành núi." },
    { original: "滴水穿石", reading: "dī shuǐ chuān shí", text: "Nước chảy đá mòn." },
    { original: "锲而不舍，金石可镂", reading: "qiè ér bù shě, jīn shí kě lòu", text: "Khắc mãi không thôi thì vàng đá cũng thủng.", by: "Tuân Tử" },
    { original: "Success is the sum of small efforts, repeated day in and day out.", text: "Thành công là tổng của những nỗ lực nhỏ, lặp lại ngày qua ngày.", by: "Robert Collier" },
    { text: "Kiên trì không phải là không mệt, mà là mệt vẫn quay lại học." },
    { original: "We are what we repeatedly do.", text: "Ta là những gì ta làm lặp đi lặp lại mỗi ngày.", by: "Will Durant" },
  ],
  milestone: [
    { original: "천 리 길도 한 걸음부터", reading: "cheon ri gildo han georeumbuteo", text: "Đường nghìn dặm cũng bắt đầu từ một bước chân." },
    { original: "千里之行，始于足下", reading: "qiān lǐ zhī xíng, shǐ yú zú xià", text: "Hành trình nghìn dặm bắt đầu từ một bước chân.", by: "Lão Tử" },
    { original: "积少成多", reading: "jī shǎo chéng duō", text: "Tích tiểu thành đại." },
    { original: "The limits of my language mean the limits of my world.", text: "Giới hạn ngôn ngữ của tôi là giới hạn thế giới của tôi.", by: "Ludwig Wittgenstein" },
    { text: "Mỗi từ mới là thêm một cánh cửa mở ra. Bạn vừa mở thêm rất nhiều cánh cửa." },
  ],
  goal: [
    { original: "今日事，今日毕", reading: "jīnrì shì, jīnrì bì", text: "Việc hôm nay chớ để ngày mai." },
    { original: "Well done is better than well said.", text: "Làm tốt còn hơn nói hay.", by: "Benjamin Franklin" },
    { text: "Xong mục tiêu hôm nay. Ngày mai bạn sẽ nhớ nhiều hơn hôm qua." },
    { original: "业精于勤", reading: "yè jīng yú qín", text: "Nghề tinh nhờ chăm chỉ.", by: "Hàn Dũ" },
  ],
  rank: [
    { original: "学无止境", reading: "xué wú zhǐ jìng", text: "Biển học không bờ." },
    { original: "百尺竿头，更进一步", reading: "bǎi chǐ gān tóu, gèng jìn yí bù", text: "Đã ở đỉnh sào trăm thước, vẫn tiến thêm một bước." },
    { original: "A different language is a different vision of life.", text: "Một ngôn ngữ khác là một cách nhìn khác về cuộc sống.", by: "Federico Fellini" },
  ],
  perfect: [
    { original: "熟能生巧", reading: "shú néng shēng qiǎo", text: "Quen tay hay việc." },
    { original: "Practice makes perfect.", text: "Có công mài sắt, có ngày nên kim." },
    { text: "Không sai câu nào. Trí nhớ của bạn đang làm việc rất tốt." },
  ],
  good: [
    { original: "温故而知新", reading: "wēn gù ér zhī xīn", text: "Ôn cũ để biết mới.", by: "Khổng Tử" },
    { original: "Progress, not perfection.", text: "Tiến bộ quan trọng hơn hoàn hảo." },
    { text: "Kết quả tốt. Vài từ còn sai sẽ quay lại sớm để bạn chốt hẳn." },
  ],
  tryAgain: [
    { original: "七転び八起き", reading: "nana korobi ya oki", text: "Ngã bảy lần, đứng dậy tám lần." },
    { original: "失败是成功之母", reading: "shībài shì chénggōng zhī mǔ", text: "Thất bại là mẹ thành công." },
    { original: "Mistakes are proof that you are trying.", text: "Sai là bằng chứng bạn đang cố gắng." },
    { text: "Từ nào sai hôm nay sẽ quay lại sớm hơn. Lần sau bạn sẽ nhớ." },
  ],
};

/** Deterministic pick so it can run during render; pass any varying number as the seed. */
export function pickQuote(category: QuoteCategory, seed: number): Quote {
  const list = QUOTES[category];
  return list[Math.abs(Math.floor(seed)) % list.length];
}
