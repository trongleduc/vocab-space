import { Suspense } from "react";
import { AppFrame } from "@/components/app-frame";
import { FrameSkeleton } from "@/components/skeleton";
import { requireUser } from "@/lib/auth";
import { getStats } from "@/lib/queries";
import { getSettings } from "@/lib/settings";
import { ttsConfigured } from "@/lib/tts";

// Every page here is per-user, so navigations are allowed to wait on the session.
export const instant = false;

async function Frame({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const [settings, stats] = await Promise.all([getSettings(), getStats(user)]);
  return (
    <AppFrame
      user={{ name: user.name, role: user.role }}
      appName={settings.appName}
      tts={ttsConfigured()}
      stats={{
        streak: stats.streak,
        activeToday: stats.activeToday,
        tier: stats.tier.index,
        tierName: stats.tier.name,
        dueTotal: stats.dueTotal,
        total: stats.total,
        langs: user.langs,
        ranks: stats.ranks,
      }}
    >
      {children}
    </AppFrame>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<FrameSkeleton />}>
      <Frame>{children}</Frame>
    </Suspense>
  );
}
