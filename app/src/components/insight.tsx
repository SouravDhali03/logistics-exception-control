import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";

export function Insight({
  icon,
  label,
  type,
  text,
}: {
  icon: ReactNode;
  label: string;
  type: string;
  text: string;
}) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex min-w-0 flex-wrap items-center gap-2 text-sm font-medium [&>svg]:size-5 [&>svg]:shrink-0 [&>svg]:stroke-[1.75]">
        {icon}
        <span>{label}</span>
        <Badge variant="outline" className="ml-auto text-xs">{type}</Badge>
      </div>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p>
    </div>
  );
}
