import type { ReactNode } from "react";
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";
import { Tabs } from "@/components/ui/tabs";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeTab: string;
  onTabChange: (value: string) => void;
  children: ReactNode;
};

export function ExceptionDetailsSheet({
  open,
  onOpenChange,
  activeTab,
  onTabChange,
  children,
}: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full! max-w-[100vw] min-w-0 flex-col gap-0 p-0 sm:max-w-2xl">
        <Tabs
          value={activeTab}
          onValueChange={onTabChange}
          className="flex min-h-0 flex-1 flex-col"
        >
          {children}
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
