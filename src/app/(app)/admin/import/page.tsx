import { PageHeader } from "@/components/ui";
import { requireAdmin } from "@/lib/auth";
import { ImportForm } from "./import-form";

export default async function ImportPage() {
  await requireAdmin();
  return (
    <div>
      <PageHeader
        title="Nhập hàng loạt"
        description="Dán danh sách từ (ví dụ toàn bộ từ HSK 3.0 cấp 1 hoặc danh sách B2). Mục trùng từ với dữ liệu sẵn có sẽ được bỏ qua."
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
              Nhiều ví dụ ngăn bằng <code className="font-mono">;;</code>, mỗi ví dụ dạng{" "}
              <code className="font-mono">câu :: phiên âm :: nghĩa</code>.
            </p>
            <pre className="mt-2 overflow-x-auto whitespace-pre-wrap rounded-xl bg-surface-2 p-3 font-mono text-xs leading-relaxed">
              {`学习 | xuéxí | học tập | HSK1 | Trường học | động từ | | 我在[学习]中文。 :: Wǒ zài xuéxí Zhōngwén. :: Tôi đang học tiếng Trung.
rely | /rɪˈlaɪ/ | dựa vào | B1 | Quan hệ | verb | rely on sb/sth | You can [rely on] me. :: :: Bạn có thể tin cậy ở tôi.`}
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
