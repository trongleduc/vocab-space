"use client";

import { CheckCheck } from "lucide-react";
import { useTransition } from "react";
import { markLearned } from "@/app/actions/learn";
import { useCelebrate } from "./celebrate";

export function LearnAllButton({ ids, label = "Đánh dấu tất cả" }: { ids: number[]; label?: string }) {
  const [pending, start] = useTransition();
  const { celebrate, burst } = useCelebrate();
  if (!ids.length) return null;
  return (
    <button
      className="btn btn-sm"
      disabled={pending}
      onClick={() =>
        start(async () => {
          const res = await markLearned(ids);
          burst(null, { big: true });
          celebrate(res.celebrations);
        })
      }
    >
      <CheckCheck size={16} /> {pending ? "Đang lưu..." : label}
    </button>
  );
}
