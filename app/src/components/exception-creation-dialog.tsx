import { HugeiconsIcon } from "@hugeicons/react";
import { UnfoldMoreIcon } from "@hugeicons/core-free-icons";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { LocationField } from "@/components/location-field";
import { Textarea } from "@/components/ui/textarea";
import { routeModeLabel, type RouteMode } from "@/components/route-map-data";
import type { Priority } from "@/app-model";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  onTitleChange: (value: string) => void;
  from: string;
  onFromChange: (value: string) => void;
  to: string;
  onToChange: (value: string) => void;
  routeMode: RouteMode;
  onRouteModeChange: (value: RouteMode) => void;
  impact: string;
  onImpactChange: (value: string) => void;
  priority: Priority;
  onPriorityChange: (value: Priority) => void;
  suggestions: string[];
  locationField: "from" | "to" | null;
  onLocationFieldChange: (value: "from" | "to" | null) => void;
  onCreate: () => void;
};

export function ExceptionCreationDialog({
  open,
  onOpenChange,
  title,
  onTitleChange,
  from,
  onFromChange,
  to,
  onToChange,
  routeMode,
  onRouteModeChange,
  impact,
  onImpactChange,
  priority,
  onPriorityChange,
  suggestions,
  locationField,
  onLocationFieldChange,
  onCreate,
}: Props) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>New exception</AlertDialogTitle>
          <AlertDialogDescription>
            Create a new logistics exception for the operations queue.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <label htmlFor="exception-title" className="text-sm font-medium">
              Exception title
            </label>
            <Input
              id="exception-title"
              placeholder="Describe the exception"
              value={title}
              onChange={(event) => onTitleChange(event.target.value)}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <LocationField
              id="exception-from"
              label="From"
              placeholder="Origin location"
              value={from}
              suggestions={suggestions}
              open={locationField === "from"}
              onFocus={() => onLocationFieldChange("from")}
              onChange={onFromChange}
              onSelect={(value) => {
                onFromChange(value);
                onLocationFieldChange(null);
              }}
            />
            <LocationField
              id="exception-to"
              label="To"
              placeholder="Destination location"
              value={to}
              suggestions={suggestions}
              open={locationField === "to"}
              onFocus={() => onLocationFieldChange("to")}
              onChange={onToChange}
              onSelect={(value) => {
                onToChange(value);
                onLocationFieldChange(null);
              }}
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Route type</label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="justify-between" aria-label="Select route type">
                  <span>{routeModeLabel[routeMode]}</span>
                  <HugeiconsIcon icon={UnfoldMoreIcon} className="size-4 text-muted-foreground" strokeWidth={2} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-(--radix-dropdown-menu-trigger-width)">
                <DropdownMenuLabel>Transport mode</DropdownMenuLabel>
                <DropdownMenuRadioGroup value={routeMode} onValueChange={(value) => onRouteModeChange(value as RouteMode)}>
                  <DropdownMenuRadioItem value="road">Road freight</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="air">Air freight</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="ocean">Ocean vessel</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="grid gap-2">
            <label htmlFor="exception-impact" className="text-sm font-medium">Impact summary</label>
            <Textarea id="exception-impact" placeholder="Describe the operational impact" value={impact} onChange={(event) => onImpactChange(event.target.value)} />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Priority</label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="justify-between" aria-label="Select priority">
                  <span>{priority === "P1" ? "Critical" : priority === "P2" ? "High" : "Medium"}</span>
                  <HugeiconsIcon icon={UnfoldMoreIcon} className="size-4 text-muted-foreground" strokeWidth={2} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-(--radix-dropdown-menu-trigger-width)">
                <DropdownMenuLabel>Exception priority</DropdownMenuLabel>
                <DropdownMenuRadioGroup value={priority} onValueChange={(value) => onPriorityChange(value as Priority)}>
                  <DropdownMenuRadioItem value="P1">Critical</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="P2">High</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="P3">Medium</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onCreate}>Create exception</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
