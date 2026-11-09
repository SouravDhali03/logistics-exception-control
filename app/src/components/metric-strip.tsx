import { HugeiconsIcon } from "@hugeicons/react";
import {
  AlertCircleIcon,
  Clock01Icon,
  PackageSearchIcon,
  ShieldCheckIcon,
} from "@hugeicons/core-free-icons";

type MetricCase = { status?: string };

export function MetricStrip({ cases }: { cases: MetricCase[] }) {
  const activeCases = cases.filter((item) => item.status !== "closed");
  const metrics = [
    {
      label: "Open exceptions",
      value: activeCases.length.toString(),
      detail: "Across active shipments",
      icon: <HugeiconsIcon icon={PackageSearchIcon} className="size-4" strokeWidth={2} />,
    },
    {
      label: "Critical",
      value: "1",
      detail: "Needs attention",
      icon: <HugeiconsIcon icon={AlertCircleIcon} className="size-4" strokeWidth={2} />,
      tone: "text-destructive",
    },
    {
      label: "At-risk value",
      value: "$184k",
      detail: "Across 4 shipments",
      icon: <HugeiconsIcon icon={ShieldCheckIcon} className="size-4" strokeWidth={2} />,
    },
    {
      label: "Median response",
      value: "8m",
      detail: "18% faster this week",
      icon: <HugeiconsIcon icon={Clock01Icon} className="size-4" strokeWidth={2} />,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <div key={metric.label} className="rounded-xl border bg-background p-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              {metric.icon}
            </div>
            <div className="min-w-0">
              <div className="flex items-baseline gap-2">
                <p className={`text-2xl font-semibold tracking-tight ${metric.tone ?? ""}`}>
                  {metric.value}
                </p>
                <p className="truncate text-xs text-muted-foreground">{metric.label}</p>
              </div>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">{metric.detail}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
