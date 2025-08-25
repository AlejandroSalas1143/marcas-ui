"use client";

export function SummaryInfo({
  label,
  value,
  icon,
}: {
  label: string;
  value?: string | null;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 text-sm">
      {icon && <span className="shrink-0 mt-0.5">{icon}</span>}
      <span className="text-zinc-500 min-w-[120px]">{label}</span>
      <span className="font-medium text-zinc-900 flex-1">{value || <span className="text-zinc-400">—</span>}</span>
    </div>
  );
}
