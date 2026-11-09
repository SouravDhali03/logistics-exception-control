import type { ReactNode } from "react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

type InlineEmptyStateProps = {
  icon: ReactNode;
  title: ReactNode;
  description: ReactNode;
};

export function InlineEmptyState({
  icon,
  title,
  description,
}: InlineEmptyStateProps) {
  return (
    <Empty className="items-start gap-4 rounded-xl border-dashed bg-muted/30 p-4 text-left">
      <EmptyHeader className="max-w-none flex-row items-start gap-4 text-left">
        <EmptyMedia className="size-8 rounded-full border bg-background text-muted-foreground shadow-sm [&>svg:not([class*='size-'])]:size-4">
          {icon}
        </EmptyMedia>
        <div className="space-y-1">
          <EmptyTitle className="text-base leading-5">{title}</EmptyTitle>
          <EmptyDescription className="text-sm leading-5">
            {description}
          </EmptyDescription>
        </div>
      </EmptyHeader>
    </Empty>
  );
}
