import { PageHeader } from "@/components/ui";
import { requireAdmin } from "@/lib/auth";
import { getSettings } from "@/lib/settings";
import { SettingsForm } from "./settings-form";

export default async function SettingsPage() {
  await requireAdmin();
  const settings = await getSettings();
  return (
    <div>
      <PageHeader title="Cài đặt chung" description="Áp dụng cho tất cả thành viên." />
      <SettingsForm settings={settings} />
    </div>
  );
}
