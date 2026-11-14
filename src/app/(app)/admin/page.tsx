import { asc, count, max } from "drizzle-orm";
import { PageHeader } from "@/components/ui";
import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/auth";
import { formatDay } from "@/lib/dates";
import { CreateUserForm, UserRow } from "./users-client";

export default async function AdminUsersPage() {
  const me = await requireAdmin();
  const [users, learned, last] = await Promise.all([
    db
      .select({ id: schema.users.id, name: schema.users.name, role: schema.users.role, active: schema.users.active })
      .from(schema.users)
      .orderBy(asc(schema.users.name)),
    db.select({ userId: schema.progress.userId, n: count() }).from(schema.progress).groupBy(schema.progress.userId),
    db
      .select({ userId: schema.activity.userId, day: max(schema.activity.day) })
      .from(schema.activity)
      .groupBy(schema.activity.userId),
  ]);
  const learnedBy = new Map(learned.map((l) => [l.userId, l.n]));
  const lastBy = new Map(last.map((l) => [l.userId, l.day]));

  return (
    <div>
      <PageHeader title="Thành viên" description="Cấp tài khoản cho từng người. Khi đăng nhập, thành viên chọn tên và nhập mật khẩu được cấp." />
      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="card divide-y-[1.5px] divide-line">
          {users.map((u) => (
            <UserRow
              key={u.id}
              user={u}
              isMe={u.id === me.id}
              learned={learnedBy.get(u.id) ?? 0}
              lastActive={lastBy.get(u.id) ? formatDay(lastBy.get(u.id)!) : null}
            />
          ))}
        </div>
        <div className="card h-fit p-5">
          <h2 className="mb-4 font-bold">Thêm thành viên</h2>
          <CreateUserForm />
        </div>
      </div>
    </div>
  );
}
