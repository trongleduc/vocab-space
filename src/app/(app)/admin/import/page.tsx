import { PageHeader } from "@/components/ui";
import { requireAdmin } from "@/lib/auth";
import { ImportForm } from "./import-form";

export default async function ImportPage() {
  await requireAdmin();
  return (
    <div>
      <PageHeader
        title="Nhập hàng loạt"
        description="Dán danh sách từ (ví dụ toàn bộ từ HSK 3.0 cấp 1, danh sách B2, TOPIK 2 hay JLPT N4). Mục trùng từ với dữ liệu sẵn có sẽ được bỏ qua."
      />
      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <div className="card p-5">
          <ImportForm />
        </div>
        <aside className="card h-fit space-y-4 p-5 text-sm">
          <div>
            <h2 className="font-bold">Định dạng theo dòng</h2>
            <p className="mt-1 text-muted">Mỗi dòng một mục, các cột ngăn bằng dấu |</p>
            <pre className="mt-2 overflow-x-auto rounded-xl bg-surface-2 p-3 font-mono text-xs leading-relaxed">
              {`từ | phiên âm | nghĩa | cấp | chủ đề | từ loại | giới từ | ví dụ`}
            </pre>
            <p className="mt-2 text-muted">
              Cấp độ: HSK1…HSK7-9, B1…C2, TOPIK1…TOPIK6, N5…N1. Tiếng Nhật ghi phiên âm dạng{" "}
              <code className="font-mono">kana · romaji</code> để lọc theo hàng あ か さ.
            </p>
            <p className="mt-2 text-muted">
              Nhiều ví dụ ngăn bằng <code className="font-mono">;;</code>, mỗi ví dụ dạng{" "}
              <code className="font-mono">câu :: phiên âm :: nghĩa</code>.
            </p>
            <pre className="mt-2 overflow-x-auto whitespace-pre-wrap rounded-xl bg-surface-2 p-3 font-mono text-xs leading-relaxed">
              {`学习 | xuéxí | học tập | HSK1 | Trường học | động từ | | 我在[学习]中文。 :: Wǒ zài xuéxí Zhōngwén. :: Tôi đang học tiếng Trung.
rely | /rɪˈlaɪ/ | dựa vào | B1 | Quan hệ | verb | rely on sb/sth | You can [rely on] me. :: :: Bạn có thể tin cậy ở tôi.
학교 | hakgyo | trường học | TOPIK1 | Trường học | danh từ | | 저는 [학교]에 가요. :: Jeoneun hakgyoe gayo. :: Tôi đi đến trường.
食べる | たべる · taberu | ăn | N5 | Ăn uống | động từ | | パンを[食べます]。 :: Pan o tabemasu. :: Tôi ăn bánh mì.`}
            </pre>
          </div>
          <div>
            <h2 className="font-bold">Hoặc JSON</h2>
            <pre className="mt-2 overflow-x-auto rounded-xl bg-surface-2 p-3 font-mono text-xs leading-relaxed">
              {`[{
  "term": "学习",
  "reading": "xuéxí",
  "meaning": "học tập",
  "level": "HSK1",
  "topic": "Trường học",
  "examples": [{
    "text": "我在[学习]中文。",
    "reading": "Wǒ zài xuéxí Zhōngwén.",
    "translation": "Tôi đang học tiếng Trung."
  }]
}]`}
            </pre>
          </div>
        </aside>
      </div>
    </div>
  );
}
