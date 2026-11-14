import { AdminTabs } from "./tabs";
import { requireAdmin } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div>
      <div className="mb-6">
        <p className="mb-1 text-sm font-semibold text-muted">Quản trị</p>
        <AdminTabs />
      </div>
      {children}
    </div>
  );
}
