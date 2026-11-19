import { and, asc, count, eq, ilike, or, type SQL } from "drizzle-orm";
import { Plus } from "lucide-react";
import Link from "next/link";
import { SearchField } from "@/components/search-field";
import { PageHeader } from "@/components/ui";
import { db, schema } from "@/db";
import { ITEM_KINDS, type ItemKind } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { fontOfKind, KIND_LABEL } from "@/lib/langs";
import { LEVEL_ORDER } from "@/lib/queries";
import { DeleteItemButton, ItemForm } from "./item-form";

const PER_PAGE = 30;

type SP = { kind?: string; q?: string; page?: string; edit?: string; new?: string };

export default async function AdminItemsPage({ searchParams }: PageProps<"/admin/items">) {
  await requireAdmin();
  const sp = (await searchParams) as SP;
  const kind = (ITEM_KINDS.includes(sp.kind as ItemKind) ? sp.kind : "zh_word") as ItemKind;
  const page = Math.max(1, Number(sp.page) || 1);
  const where: SQL[] = [eq(schema.items.kind, kind)];
  if (sp.q) {
    const like = `%${sp.q}%`;
    where.push(or(ilike(schema.items.term, like), ilike(schema.items.meaning, like), ilike(schema.items.reading, like))!);
  }
  const editId = Number(sp.edit) || 0;
  const [rows, [{ n }], editing] = await Promise.all([
    db
      .select()
      .from(schema.items)
      .where(and(...where))
      .orderBy(LEVEL_ORDER, asc(schema.items.sortOrder), asc(schema.items.id))
      .limit(PER_PAGE)
      .offset((page - 1) * PER_PAGE),
    db.select({ n: count() }).from(schema.items).where(and(...where)),
    editId ? db.select().from(schema.items).where(eq(schema.items.id, editId)).limit(1) : Promise.resolve([]),
  ]);
  const pages = Math.max(1, Math.ceil(n / PER_PAGE));
  const qs = (patch: Partial<SP>) => {
    const next: SP = { kind, q: sp.q, page: String(page), ...patch };
    return `/admin/items?${new URLSearchParams(Object.entries(next).filter(([, v]) => v) as [string, string][])}`;
  };
  const showForm = Boolean(editing[0]) || sp.new === "1";

  return (
    <div>
      <PageHeader
        title="Từ vựng"
        description="Thêm, sửa, xóa từ vựng, câu thông dụng và idioms của cả bốn ngôn ngữ. Bao chữ cần làm nổi bật trong câu ví dụ bằng [ngoặc vuông]."
        actions={
          <Link href={qs({ new: "1", edit: undefined })} className="btn btn-primary btn-sm">
            <Plus size={15} /> Thêm mục
          </Link>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {ITEM_KINDS.map((k) => (
          <Link key={k} href={`/admin/items?kind=${k}`} data-active={k === kind} className="chip">
            {KIND_LABEL[k]}
          </Link>
        ))}
        <SearchField
          action="/admin/items"
          defaultValue={sp.q}
          placeholder="Tìm kiếm"
          hidden={{ kind }}
          className="basis-full sm:basis-48 sm:flex-1"
        />
      </div>

      {showForm && (
        <div className="card mb-5 p-5 animate-rise">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold">{editing[0] ? `Sửa "${editing[0].term}"` : `Thêm ${KIND_LABEL[kind].toLowerCase()}`}</h2>
            <Link href={qs({ edit: undefined, new: undefined })} className="btn btn-sm btn-ghost">
              Đóng
            </Link>
          </div>
          <ItemForm key={editing[0]?.id ?? "new"} item={editing[0] ?? null} kind={kind} />
        </div>
      )}

      <p className="mb-2 text-sm text-muted">{n} mục</p>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b-[1.5px] border-line text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">Từ</th>
                <th className="px-4 py-3 font-semibold">Nghĩa</th>
                <th className="px-4 py-3 font-semibold">Cấp</th>
                <th className="px-4 py-3 font-semibold">Chủ đề</th>
                <th className="px-4 py-3 font-semibold">Ví dụ</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y-[1.5px] divide-line">
              {rows.map((r) => (
                <tr key={r.id} className={r.id === editId ? "bg-accent-soft" : ""}>
                  <td className="px-4 py-2.5">
                    <div className={`font-semibold ${fontOfKind(r.kind) ? `${fontOfKind(r.kind)} text-base` : ""}`}>{r.term}</div>
                    {r.reading && <div className="text-xs text-muted">{r.reading}</div>}
                  </td>
                  <td className="max-w-64 px-4 py-2.5">{r.meaning}</td>
                  <td className="px-4 py-2.5 font-mono text-xs">{r.level}</td>
                  <td className="px-4 py-2.5 text-muted">{r.topic}</td>
                  <td className="px-4 py-2.5 font-mono text-xs text-muted">{r.examples.length}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex justify-end gap-1.5">
                      <Link href={qs({ edit: String(r.id), new: undefined })} className="btn btn-sm">
                        Sửa
                      </Link>
                      <DeleteItemButton id={r.id} term={r.term} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {pages > 1 && (
        <div className="mt-5 flex items-center justify-center gap-3">
          {page > 1 && (
            <Link href={qs({ page: String(page - 1) })} className="btn btn-sm">
              Trang trước
            </Link>
          )}
          <span className="font-mono text-sm text-muted">
            {page}/{pages}
          </span>
          {page < pages && (
            <Link href={qs({ page: String(page + 1) })} className="btn btn-sm">
              Trang sau
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
