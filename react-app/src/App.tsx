import { useEffect, useMemo, useState } from "react";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  Activity01Icon,
  Airplane01Icon,
  AlertCircleIcon,
  ArrowRight01Icon,
  BellIcon,
  Cancel01Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckmarkCircle04Icon,
  Clock01Icon,
  CopyIcon,
  FileTextIcon,
  FilterIcon,
  HeartPulseIcon,
  InformationCircleIcon,
  InboxIcon,
  Navigation03Icon,
  MoreHorizontalIcon,
  PackageSearchIcon,
  Search01Icon,
  ShieldCheckIcon,
  ShipIcon,
  SparklesIcon,
  Analytics01Icon,
  Settings05Icon,
  Tick02Icon,
  TruckIcon,
  UnfoldMoreIcon,
} from "@hugeicons/core-free-icons";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const worldMapUrl = `${import.meta.env.BASE_URL}world-map.svg`;

type Priority = "P1" | "P2" | "P3";
type RouteMode = "air" | "ocean" | "road";
type ExceptionCase = {
  id: string;
  priority: Priority;
  title: string;
  route: string;
  detail: string;
  impact: string;
  time: string;
  owner: string;
  uncertainty: string;
  status?: ResolutionStage;
  approvedActionId?: string;
  activityAt?: number;
  snoozedUntil?: number;
};
type ResolutionStage =
  | "awaiting"
  | "awaiting-signoff"
  | "in-progress"
  | "ready"
  | "closed";

type WorkspaceSection =
  | "inbox"
  | "live-monitoring"
  | "decision-history"
  | "learning-review"
  | "reports"
  | "settings";

const workspaceSectionMeta: Record<
  WorkspaceSection,
  { title: string; description: string; icon: IconSvgElement }
> = {
  inbox: {
    title: "Exception inbox",
    description: "Prioritized exception control",
    icon: InboxIcon,
  },
  "live-monitoring": {
    title: "Live monitoring",
    description: "Shipment and signal visibility",
    icon: Activity01Icon,
  },
  "decision-history": {
    title: "Decision history",
    description: "Auditable operational decisions",
    icon: Clock01Icon,
  },
  "learning-review": {
    title: "Learning review",
    description: "Review outcomes and improve response quality",
    icon: SparklesIcon,
  },
  reports: {
    title: "Reports",
    description: "Operational performance and exception trends",
    icon: Analytics01Icon,
  },
  settings: {
    title: "Settings",
    description: "Workspace and control preferences",
    icon: Settings05Icon,
  },
};

type ScenarioAction = {
  id: string;
  name: string;
  description: string;
  recovery: string;
  cost: number;
  sla: string;
  risk: string;
  dependencies: Array<["verified" | "gap" | "inference", string]>;
  note: string;
};

type ScenarioDetail = {
  what: string;
  cause: string;
  impact: string;
  gap: string;
  confidence: string;
  sources: string;
  actions: ScenarioAction[];
  audit: Array<[string, string, string]>;
};

const initialCases: ExceptionCase[] = [
  {
    id: "EXC-2457",
    priority: "P2",
    title: "Reefer power interruption detected",
    route: "Kobe → Rotterdam",
    detail: "Cold-chain telemetry dropped for 18 min",
    impact: "Product integrity at risk · $28k load",
    time: "18m",
    owner: "You",
    uncertainty: "Possible · 72%",
  },
  {
    id: "EXC-2481",
    priority: "P1",
    title: "Port congestion threatens delivery",
    route: "Rotterdam → Chicago",
    detail: "31h predicted delay · $42k at risk",
    impact: "Late by 25–37h · $42k at risk",
    time: "2m",
    owner: "You",
    uncertainty: "Likely · 82%",
  },
  {
    id: "EXC-2479",
    priority: "P2",
    title: "Temperature excursion detected",
    route: "Singapore → Frankfurt",
    detail: "8.4°C for 22 min · Pharma",
    impact: "Quality release at risk · Pharma load",
    time: "11m",
    owner: "Mina",
    uncertainty: "Confirmed",
  },
  {
    id: "EXC-2476",
    priority: "P2",
    title: "Customs documents incomplete",
    route: "Dhaka → Toronto",
    detail: "Commercial invoice mismatch",
    impact: "Late by 5–6 days",
    time: "26m",
    owner: "You",
    uncertainty: "Possible · 64%",
  },
  {
    id: "EXC-2471",
    priority: "P3",
    title: "Tracking signal stale",
    route: "Shenzhen → Long Beach",
    detail: "No carrier event for 9h",
    impact: "Up to 15h late",
    time: "1h",
    owner: "Unassigned",
    uncertainty: "Unknown",
  },
  {
    id: "EXC-2468",
    priority: "P3",
    title: "Warehouse handoff delayed",
    route: "Hamburg → Prague",
    detail: "Pickup missed by 46 min",
    impact: "Up to 8h late · $4k penalty",
    time: "2h",
    owner: "Nadia",
    uncertainty: "Likely · 71%",
  },
  {
    id: "EXC-2464",
    priority: "P3",
    title: "Delivery appointment at risk",
    route: "Antwerp → Lyon",
    detail: "Driver hours limit approaching",
    impact: "At risk · 2h of slack left",
    time: "3h",
    owner: "You",
    uncertainty: "Possible · 58%",
  },
  {
    id: "EXC-2461",
    priority: "P2",
    title: "Container release delayed",
    route: "Busan → Seattle",
    detail: "Customs release pending for 6h",
    impact: "Up to 8h late",
    time: "4h",
    owner: "Mina",
    uncertainty: "Possible · 61%",
  },
  {
    id: "EXC-2459",
    priority: "P3",
    title: "Proof of delivery missing",
    route: "Paris → Madrid",
    detail: "Signed receipt not uploaded",
    impact: "Proof required before release",
    time: "5h",
    owner: "Unassigned",
    uncertainty: "Unknown",
  },
  {
    id: "EXC-2458",
    priority: "P2",
    title: "Carrier capacity reduced",
    route: "Los Angeles → Dallas",
    detail: "Two booked trailers cancelled",
    impact: "Up to 8h late · $4k penalty",
    time: "6h",
    owner: "You",
    uncertainty: "Likely · 74%",
  },
  {
    id: "EXC-2456",
    priority: "P3",
    title: "Temperature logger offline",
    route: "Osaka → Vancouver",
    detail: "No telemetry received for 3h",
    impact: "No reliable ETA",
    time: "7h",
    owner: "Nadia",
    uncertainty: "Possible · 55%",
  },
];

const assignmentOptions = ["You", "Mina", "Nadia", "Unassigned"] as const;

const scenarioDetails: Record<string, ScenarioDetail> = {
  "EXC-2457": {
    what: "Cold-chain telemetry dropped for 18 minutes during the Kobe transfer.",
    cause:
      "Reefer power was interrupted while the container waited for vessel connection.",
    impact: "Product integrity at risk · $28k load.",
    gap: "Terminal power confirmation and QA disposition.",
    confidence: "72%",
    sources: "4",
    actions: [
      {
        id: "reefer-plug",
        name: "Transfer to powered reefer plug",
        description:
          "Move the container to a monitored powered slot and preserve the cold chain.",
        recovery: "10h",
        cost: 520,
        sla: "68%",
        risk: "Low risk",
        dependencies: [
          ["verified", "Powered reefer slot"],
          ["gap", "Terminal power confirmation"],
        ],
        note: "Maintains temperature control while the terminal confirms the interruption.",
      },
      {
        id: "inspect-arrival",
        name: "Inspect at destination",
        description:
          "Continue the voyage and complete a QA inspection before release at Rotterdam.",
        recovery: "0h",
        cost: 0,
        sla: "31%",
        risk: "Higher risk",
        dependencies: [["gap", "QA disposition"]],
        note: "Lowest immediate cost, but product release remains uncertain.",
      },
    ],
    audit: [
      [
        "08:05 PM",
        "Exception created from cold-chain telemetry alert",
        "system/correlation",
      ],
      ["08:07 PM", "Assigned to Sourav for coordinator review", "user/sourav"],
      [
        "08:12 PM",
        "Cold-chain signal correlated across carrier and terminal feeds",
        "model/cold-chain-v2",
      ],
      [
        "08:16 PM",
        "AI assessment updated: powered reefer slot recommended",
        "model/cold-chain-v2",
      ],
    ],
  },
  "EXC-2481": {
    what: "Vessel discharge moved by 19 hours. The connecting rail slot is no longer available.",
    cause: "Terminal congestion followed an unplanned crane outage.",
    impact: "31h predicted delay · SLA breach likely · $42k order at risk.",
    gap: "Confirmed terminal gate appointment.",
    confidence: "82%",
    sources: "7",
    actions: [
      {
        id: "expedite",
        name: "Expedite by dedicated truck",
        description:
          "Move the container to Duisburg by road and connect to an earlier rail service.",
        recovery: "22h",
        cost: 4850,
        sla: "76%",
        risk: "Higher risk",
        dependencies: [
          ["gap", "Gate appointment"],
          ["verified", "Truck quote QX-1187"],
        ],
        note: "A free truck cancellation is possible until Fri 11:00.",
      },
      {
        id: "rebook",
        name: "Rebook next rail departure",
        description:
          "Accept the next confirmed rail slot and proactively update the customer.",
        recovery: "8h",
        cost: 620,
        sla: "42%",
        risk: "Low risk",
        dependencies: [["verified", "Priority rail slot"]],
        note: "Arrives after the deadline in the slower recovery scenario.",
      },
      {
        id: "hold",
        name: "Hold and continue monitoring",
        description:
          "Wait for the terminal gate appointment and reassess in 45 minutes.",
        recovery: "0h",
        cost: 0,
        sla: "18%",
        risk: "Low risk",
        dependencies: [["gap", "Gate appointment"]],
        note: "Lowest cost, but exposure remains while the terminal confirms.",
      },
    ],
    audit: [
      ["14:22", "AI assessment refreshed", "model/eta-v4.2"],
      ["14:14", "Coordinator acknowledged exception", "user/sourav"],
      ["14:12", "Exception record created", "system/correlation"],
      ["14:11", "Signal validation completed", "policy/validation-v3"],
    ],
  },
  "EXC-2479": {
    what: "The logger recorded 8.4°C for 22 minutes during the Singapore transfer.",
    cause: "Likely cold-chain interruption during apron handling.",
    impact: "Pharma consignment at risk · quality disposition required.",
    gap: "Customer QA disposition and product-release decision.",
    confidence: "78%",
    sources: "6",
    actions: [
      {
        id: "quarantine",
        name: "Quarantine at Frankfurt",
        description:
          "Hold the shipment in qualified cold storage until customer QA releases it.",
        recovery: "12h",
        cost: 380,
        sla: "64%",
        risk: "Low risk",
        dependencies: [
          ["verified", "Cold-store slot"],
          ["gap", "QA disposition"],
        ],
        note: "Protects product integrity while QA reviews the excursion.",
      },
      {
        id: "release",
        name: "Continue with documented excursion",
        description:
          "Attach the logger record and deliver under the existing release procedure.",
        recovery: "0h",
        cost: 0,
        sla: "100%",
        risk: "Higher risk",
        dependencies: [
          ["inference", "Excursion within tolerance"],
          ["gap", "QA release"],
        ],
        note: "Cannot proceed as a verified recommendation until QA accepts.",
      },
    ],
    audit: [],
  },
  "EXC-2476": {
    what: "The commercial invoice and packing list report different declared values.",
    cause: "A revised invoice was not transmitted to the broker.",
    impact: "Customs filing is blocked · retail launch may be delayed.",
    gap: "Signed corrected commercial invoice.",
    confidence: "64%",
    sources: "4",
    actions: [
      {
        id: "correct",
        name: "Obtain corrected invoice",
        description:
          "Ask the shipper to issue and sign a corrected invoice before filing.",
        recovery: "18h",
        cost: 0,
        sla: "68%",
        risk: "Low risk",
        dependencies: [["gap", "Signed corrected invoice"]],
        note: "Best compliance path; depends on the shipper responding today.",
      },
      {
        id: "file",
        name: "File with current declaration",
        description:
          "Submit the available documents and accept possible customs review.",
        recovery: "8h",
        cost: 1500,
        sla: "43%",
        risk: "Higher risk",
        dependencies: [["inference", "Review not selected"]],
        note: "Faster initially, with an elevated chance of a one-to-two day review.",
      },
    ],
    audit: [],
  },
  "EXC-2458": {
    what: "The contracted carrier cancelled two trailers booked for Friday pickup.",
    cause:
      "Carrier capacity shortfall; a Saturday pickup is the earliest contract option.",
    impact: "Store reset at risk · $4k late-delivery penalty likely.",
    gap: "Replacement carrier insurance certificate.",
    confidence: "74%",
    sources: "5",
    actions: [
      {
        id: "spot",
        name: "Book a Friday spot carrier",
        description:
          "Tender two replacement trailers to a vetted spot carrier.",
        recovery: "26h",
        cost: 1380,
        sla: "81%",
        risk: "Moderate risk",
        dependencies: [
          ["verified", "Carrier on-time history"],
          ["gap", "Insurance certificate"],
        ],
        note: "Cost remains below the likely penalty if the contracted pickup moves to Saturday.",
      },
      {
        id: "saturday",
        name: "Accept Saturday pickup",
        description:
          "Retain the contracted carrier at its next offered collection time.",
        recovery: "0h",
        cost: 0,
        sla: "22%",
        risk: "Higher risk",
        dependencies: [["verified", "Saturday capacity"]],
        note: "Can arrive from four hours early to eight hours late.",
      },
    ],
    audit: [],
  },
  "EXC-2464": {
    what: "Remaining route distance exceeds the driver’s legal daily driving time.",
    cause: "Earlier congestion consumed the available driving margin.",
    impact: "Today’s delivery appointment is at risk · $600 redelivery cost.",
    gap: "Relay-driver handover confirmation.",
    confidence: "86%",
    sources: "6",
    actions: [
      {
        id: "relay",
        name: "Assign a relay driver",
        description:
          "Meet the truck at Mâcon services and complete the final route legally.",
        recovery: "7h",
        cost: 340,
        sla: "89%",
        risk: "Low risk",
        dependencies: [
          ["verified", "Relay driver roster"],
          ["gap", "Handover confirmation"],
        ],
        note: "Preserves the delivery appointment while maintaining compliance.",
      },
      {
        id: "rest",
        name: "Stop and deliver tomorrow",
        description:
          "Schedule the earliest available appointment after mandatory rest.",
        recovery: "0h",
        cost: 0,
        sla: "0%",
        risk: "Low risk",
        dependencies: [["verified", "Morning slot"]],
        note: "Certain cost of a missed appointment, but no additional execution risk.",
      },
    ],
    audit: [],
  },
  "EXC-2461": {
    what: "Customs selected the container for examination and blocked its release.",
    cause: "Mandatory customs examination at the Seattle terminal.",
    impact: "Release delay threatens the downstream delivery commitment.",
    gap: "Expedited-exam slot confirmation.",
    confidence: "71%",
    sources: "5",
    actions: [
      {
        id: "exam",
        name: "Request expedited examination",
        description:
          "Move the container into the expedited customs examination queue.",
        recovery: "19h",
        cost: 650,
        sla: "71%",
        risk: "Low risk",
        dependencies: [["gap", "Expedited exam slot"]],
        note: "The inspection outcome is unchanged; only queue time is reduced.",
      },
      {
        id: "standard",
        name: "Remain in standard queue",
        description:
          "Wait for the standard examination sequence at no added cost.",
        recovery: "0h",
        cost: 0,
        sla: "29%",
        risk: "Moderate risk",
        dependencies: [["verified", "Standard queue position"]],
        note: "Worst case arrives 15 hours after the delivery deadline.",
      },
    ],
    audit: [],
  },
};

const fallbackScenario = (item: ExceptionCase): ScenarioDetail => ({
  what: item.detail || "A shipment signal requires coordinator review.",
  cause: "The cause has not been assessed yet.",
  impact: item.detail || "Operational impact is not yet estimated.",
  gap: "Supporting evidence and partner confirmation.",
  confidence: item.uncertainty.includes("%")
    ? (item.uncertainty.match(/\d+%/)?.[0] ?? "Unverified")
    : "Unverified",
  sources: "0",
  actions: [],
  audit: [],
});

const priorityVariant: Record<Priority, "destructive" | "warning" | "outline"> =
  { P1: "destructive", P2: "warning", P3: "outline" };
const priorityLabel: Record<Priority, string> = {
  P1: "Critical",
  P2: "High",
  P3: "Medium",
};
type QueueStatusFilter = "active" | "all" | "resolved";
const statusLabel: Record<ResolutionStage, string> = {
  awaiting: "Needs decision",
  "awaiting-signoff": "Awaiting sign-off",
  "in-progress": "Monitoring",
  ready: "Ready for closure",
  closed: "Resolved",
};
const routeModeById: Record<string, RouteMode> = {
  "EXC-2481": "ocean",
  "EXC-2457": "ocean",
  "EXC-2479": "air",
  "EXC-2476": "air",
  "EXC-2471": "ocean",
  "EXC-2468": "road",
  "EXC-2464": "road",
  "EXC-2461": "ocean",
  "EXC-2459": "road",
  "EXC-2458": "road",
  "EXC-2456": "air",
};
const routeModeIcon: Record<RouteMode, IconSvgElement> = {
  air: Airplane01Icon,
  ocean: ShipIcon,
  road: TruckIcon,
};
type HugeIconProps = Omit<React.ComponentProps<typeof HugeiconsIcon>, "icon">;
const Activity = (props: HugeIconProps) => (
  <HugeiconsIcon icon={Activity01Icon} strokeWidth={2} {...props} />
);
const AlertCircle = (props: HugeIconProps) => (
  <HugeiconsIcon icon={AlertCircleIcon} strokeWidth={2} {...props} />
);
const CheckCircle2 = (props: HugeIconProps) => (
  <HugeiconsIcon icon={CheckmarkCircle04Icon} strokeWidth={2} {...props} />
);
const FileText = (props: HugeIconProps) => (
  <HugeiconsIcon icon={FileTextIcon} strokeWidth={2} {...props} />
);
const MoreHorizontal = (props: HugeIconProps) => (
  <HugeiconsIcon icon={MoreHorizontalIcon} strokeWidth={2} {...props} />
);
const Search = (props: HugeIconProps) => (
  <HugeiconsIcon icon={Search01Icon} strokeWidth={2} {...props} />
);
const ShieldCheck = (props: HugeIconProps) => (
  <HugeiconsIcon icon={ShieldCheckIcon} strokeWidth={2} {...props} />
);
const Sparkles = (props: HugeIconProps) => (
  <HugeiconsIcon icon={SparklesIcon} strokeWidth={2} {...props} />
);

const routeModeLabel: Record<RouteMode, string> = {
  air: "Air freight",
  ocean: "Ocean vessel",
  road: "Road freight",
};

const routePointByCity: Record<string, { left: string; top: string }> = {
  Vancouver: { left: "10.5%", top: "32%" },
  Seattle: { left: "11.5%", top: "37%" },
  "Long Beach": { left: "10.5%", top: "47%" },
  "Los Angeles": { left: "11%", top: "48%" },
  Dallas: { left: "15%", top: "55%" },
  Chicago: { left: "17.5%", top: "39%" },
  Toronto: { left: "20.5%", top: "37%" },
  Rotterdam: { left: "54%", top: "31%" },
  Hamburg: { left: "55%", top: "34%" },
  Antwerp: { left: "53.5%", top: "35%" },
  Paris: { left: "52%", top: "40%" },
  Madrid: { left: "50%", top: "49%" },
  Lyon: { left: "53%", top: "44%" },
  Frankfurt: { left: "55%", top: "38%" },
  Prague: { left: "57%", top: "39%" },
  Kobe: { left: "83%", top: "41%" },
  Osaka: { left: "82%", top: "38%" },
  Busan: { left: "80%", top: "43%" },
  Shenzhen: { left: "76%", top: "52%" },
  Singapore: { left: "72%", top: "68%" },
  Dhaka: { left: "70%", top: "50%" },
};

const portPointByCity: Record<string, { left: string; top: string }> = {
  Vancouver: { left: "8.5%", top: "35%" },
  Seattle: { left: "10%", top: "40%" },
  "Long Beach": { left: "8.5%", top: "50%" },
  "Los Angeles": { left: "9%", top: "51%" },
  Chicago: { left: "20%", top: "37%" },
  Toronto: { left: "22%", top: "35%" },
  Rotterdam: { left: "52.5%", top: "33%" },
  Hamburg: { left: "54.5%", top: "32%" },
  Antwerp: { left: "52%", top: "35%" },
  Kobe: { left: "84%", top: "42%" },
  Osaka: { left: "83%", top: "40%" },
  Busan: { left: "81%", top: "44%" },
  Shenzhen: { left: "77%", top: "54%" },
  Singapore: { left: "72%", top: "70%" },
  Dhaka: { left: "72%", top: "52%" },
};

function RouteMapDialog({
  selected,
  selectedFrom,
  selectedTo,
}: {
  selected: ExceptionCase;
  selectedFrom: string;
  selectedTo: string;
}) {
  const mode = routeModeById[selected.id] ?? "road";
  const pointMap = mode === "ocean" ? portPointByCity : routePointByCity;
  const fromPoint = pointMap[selectedFrom] ?? { left: "50%", top: "50%" };
  const toPoint = pointMap[selectedTo] ?? { left: "50%", top: "50%" };
  const fromPercentPoint = {
    left: Number.parseFloat(fromPoint.left),
    top: Number.parseFloat(fromPoint.top),
  };
  const toPercentPoint = {
    left: Number.parseFloat(toPoint.left),
    top: Number.parseFloat(toPoint.top),
  };
  const mapScale = mode === "road" ? 3.2 : 1;
  const mapFocus = mode === "road"
    ? {
        left: (fromPercentPoint.left + toPercentPoint.left) / 2,
        top: (fromPercentPoint.top + toPercentPoint.top) / 2,
      }
    : { left: 50, top: 50 };
  const projectMapPoint = (point: { left: string; top: string }) => ({
    left: `${mapFocus.left + (Number.parseFloat(point.left) - mapFocus.left) * mapScale}%`,
    top: `${mapFocus.top + (Number.parseFloat(point.top) - mapFocus.top) * mapScale}%`,
  });
  const projectedFromPoint = projectMapPoint(fromPoint);
  const projectedToPoint = projectMapPoint(toPoint);
  const fromCoordinates = {
    x: Number.parseFloat(fromPoint.left) * 7.2,
    y: Number.parseFloat(fromPoint.top) * 3.6,
  };
  const toCoordinates = {
    x: Number.parseFloat(toPoint.left) * 7.2,
    y: Number.parseFloat(toPoint.top) * 3.6,
  };
  const currentProgress = 0.52;
  const currentPoint = {
    x: fromCoordinates.x + (toCoordinates.x - fromCoordinates.x) * currentProgress,
    y: fromCoordinates.y + (toCoordinates.y - fromCoordinates.y) * currentProgress,
  };
  const trackerScale = mode === "road" ? 0.7 : 1;
  const trackerRadius = (6 * trackerScale) / mapScale;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="group inline-flex h-6 cursor-pointer items-center gap-1 leading-6 outline-none focus-visible:rounded-md focus-visible:ring-3 focus-visible:ring-ring/30"
          aria-label={`Open live route map from ${selectedFrom} to ${selectedTo}`}
        >
          <span className="inline-flex size-5 shrink-0 items-center justify-center">
            <HugeiconsIcon
              icon={Navigation03Icon}
              className="size-4 text-primary transition-colors group-hover:text-primary/80"
              strokeWidth={2.5}
              aria-hidden="true"
            />
          </span>
          <span className="text-base font-semibold text-primary transition-colors group-hover:text-primary/80">Route</span>
          <span className="ml-1 text-foreground">{selectedFrom}</span>
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            className="size-4 shrink-0 text-muted-foreground"
            strokeWidth={2}
            aria-hidden="true"
          />
          <span className="text-foreground">{selectedTo}</span>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl">
        <div className="flex items-start justify-between gap-4 border-b px-6 py-5">
          <div className="space-y-1">
            <DialogTitle>Live route tracking</DialogTitle>
            <DialogDescription>
              {selected.id} · {selectedFrom} to {selectedTo}
            </DialogDescription>
          </div>
          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="-mr-2 -mt-1 rounded-full"
              aria-label="Close route map"
            >
              <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
            </Button>
          </DialogClose>
        </div>
        <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="relative min-h-[22rem] overflow-hidden bg-background p-4 sm:p-6">
            <svg
              viewBox="0 0 720 360"
              className="relative h-full min-h-[19rem] w-full transition-transform duration-300"
              style={{ transform: `scale(${mapScale})`, transformOrigin: `${mapFocus.left}% ${mapFocus.top}%` }}
              role="img"
              aria-label={`Live route from ${selectedFrom} to ${selectedTo}`}
            >
              <rect width="720" height="360" className="fill-background" />
              <image
                href={worldMapUrl}
                x="0"
                y="0"
                width="720"
                height="360"
                preserveAspectRatio="none"
                opacity="0.96"
              />
              <circle cx={currentPoint.x} cy={currentPoint.y} r={(18 * trackerScale) / mapScale} className="fill-primary/20 stroke-primary" strokeWidth={(2 * trackerScale) / mapScale} />
              <circle cx={currentPoint.x} cy={currentPoint.y} r={trackerRadius} className="fill-primary">
                <animate attributeName="r" values={`${trackerRadius};${trackerRadius * 1.75};${trackerRadius}`} dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="1;0.35;1" dur="2s" repeatCount="indefinite" />
              </circle>
            </svg>
            <Tooltip open>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  aria-label={`Show origin location ${selectedFrom}`}
                  className="absolute size-5 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full border-[3px] border-primary bg-background shadow-[0_0_0_5px_color-mix(in_oklab,var(--primary)_18%,transparent)] outline-none transition-transform hover:scale-110 focus-visible:ring-3 focus-visible:ring-ring/40"
                  style={{ left: projectedFromPoint.left, top: projectedFromPoint.top }}
                />
              </TooltipTrigger>
              <TooltipContent side={mode === "road" ? "left" : "top"} className="space-y-0.5">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">From</p>
                <p className="font-medium">{selectedFrom}</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip open>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  aria-label={`Show destination location ${selectedTo}`}
                  className="absolute size-5 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full border-[3px] border-fuchsia-300 bg-background shadow-[0_0_0_5px_color-mix(in_oklab,var(--primary)_14%,transparent)] outline-none transition-transform hover:scale-110 focus-visible:ring-3 focus-visible:ring-ring/40"
                  style={{ left: projectedToPoint.left, top: projectedToPoint.top }}
                />
              </TooltipTrigger>
              <TooltipContent side={mode === "road" ? "right" : "top"} className="space-y-0.5">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">To</p>
                <p className="font-medium">{selectedTo}</p>
              </TooltipContent>
            </Tooltip>
            <div className="absolute left-7 top-7 flex items-center gap-2 rounded-full border bg-background/90 px-3 py-1.5 text-xs font-medium shadow-sm backdrop-blur">
              <span className="size-2 animate-pulse rounded-full bg-emerald-500" />
              Live · updated 2m ago
            </div>
          </div>
          <div className="space-y-5 border-t p-6 lg:border-t-0 lg:border-l">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Shipment status</p>
              <div className="mt-2 flex items-center gap-2"><span className="size-2 rounded-full bg-emerald-500" /><span className="font-medium">In transit</span></div>
            </div>
            <Separator />
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-muted"><HugeiconsIcon icon={routeModeIcon[mode]} className="size-5" strokeWidth={2} /></div>
              <div><p className="text-sm font-medium">{routeModeLabel[mode]}</p><p className="text-xs text-muted-foreground">{selected.id} shipment</p></div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-muted-foreground">Current location</p><p className="mt-1 font-medium">Mid-route</p></div>
              <div><p className="text-muted-foreground">ETA</p><p className="mt-1 whitespace-nowrap font-medium">Tomorrow · 08:40</p></div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Route progress</p>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full w-[52%] rounded-full bg-primary" /></div>
              <div className="mt-1 flex justify-between text-xs text-muted-foreground"><span>{selectedFrom}</span><span>52%</span><span>{selectedTo}</span></div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ComingSoonPage({
  section,
}: {
  section: Exclude<WorkspaceSection, "inbox">;
}) {
  const meta = workspaceSectionMeta[section];

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
      <div className="w-full max-w-lg text-center">
        <div className="flex flex-col items-center px-6 py-16">
          <Badge variant="outline" className="mt-6">
            Coming soon
          </Badge>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight">
            {meta.title}
          </h1>
          <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
            {meta.description} will be available here as this workspace grows.
          </p>
          <Button asChild variant="outline" className="mt-6">
            <a href="#inbox">Back to Exception inbox</a>
          </Button>
        </div>
      </div>
    </div>
  );
}

function App() {
  const getSectionFromHash = (): WorkspaceSection => {
    const section = window.location.hash.replace("#", "") as WorkspaceSection;
    return section in workspaceSectionMeta ? section : "inbox";
  };
  const [activeSection, setActiveSection] = useState<WorkspaceSection>(
    getSectionFromHash,
  );
  const [cases, setCases] = useState<ExceptionCase[]>(initialCases);
  const [selectedId, setSelectedId] = useState("EXC-2481");
  const [priorityFilter, setPriorityFilter] = useState<Priority | "all">("all");
  const [statusFilter, setStatusFilter] =
    useState<QueueStatusFilter>("active");
  const [statusFilterOpen, setStatusFilterOpen] = useState(true);
  const [priorityFilterOpen, setPriorityFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [newExceptionOpen, setNewExceptionOpen] = useState(false);
  const [newPriority, setNewPriority] = useState<Priority>("P2");
  const [newTitle, setNewTitle] = useState("");
  const [newFrom, setNewFrom] = useState("");
  const [newTo, setNewTo] = useState("");
  const [newImpact, setNewImpact] = useState("");
  const [locationField, setLocationField] = useState<"from" | "to" | null>(
    null,
  );
  const [resolutionStage, setResolutionStage] =
    useState<ResolutionStage>("awaiting");
  const [activeTab, setActiveTab] = useState("decision");
  const [approvedActionId, setApprovedActionId] = useState<string | null>(
    null,
  );
  const [isResolving, setIsResolving] = useState(false);
  const [closureOpen, setClosureOpen] = useState(false);
  const [closureCriteria, setClosureCriteria] = useState({
    milestone: false,
    action: false,
    risk: false,
    alerts: false,
  });
  const [overrideReason, setOverrideReason] = useState(
    "Customer relationship or operational context changes the preferred response.",
  );
  const [signoffAcknowledged, setSignoffAcknowledged] = useState(false);
  const [copiedExceptionId, setCopiedExceptionId] = useState<string | null>(
    null,
  );
  useEffect(() => {
    const handleHashChange = () => {
      setActiveSection(getSectionFromHash());
      setDrawerOpen(false);
      setNewExceptionOpen(false);
      setLocationField(null);
      setClosureOpen(false);
    };
    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);
  const selected = cases.find((item) => item.id === selectedId) ?? cases[1];
  const [selectedFrom, selectedTo] = selected.route.split(" → ");
  const detail = scenarioDetails[selected.id] ?? fallbackScenario(selected);
  const verifiedSourceCount = Number.parseInt(detail.sources, 10) || 0;
  const approvedAction = detail.actions.find(
    (action) => action.id === approvedActionId,
  );
  const resetResolution = (
    nextStage: ResolutionStage = "awaiting",
    nextActionId: string | null = null,
  ) => {
    setIsResolving(false);
    setResolutionStage(nextStage);
    setApprovedActionId(nextActionId);
    setActiveTab("decision");
    setClosureOpen(false);
    setClosureCriteria({
      milestone: false,
      action: false,
      risk: false,
      alerts: false,
    });
  };
  const startResolution = (actionId: string, requiresSignoff = false) => {
    setIsResolving(true);
    window.setTimeout(() => {
      setApprovedActionId(actionId);
      const nextStage = requiresSignoff ? "awaiting-signoff" : "in-progress";
      setResolutionStage(nextStage);
      setCases((currentCases) =>
        currentCases.map((item) =>
          item.id === selected.id
            ? { ...item, status: nextStage, approvedActionId: actionId, activityAt: Date.now() }
            : item,
        ),
      );
      setIsResolving(false);
    }, 650);
  };
  const simulateManagerSignoff = () => {
    if (resolutionStage === "awaiting-signoff") {
      setResolutionStage("in-progress");
      setCases((currentCases) =>
        currentCases.map((item) =>
          item.id === selected.id
            ? { ...item, status: "in-progress", activityAt: Date.now() }
            : item,
        ),
      );
    }
  };
  const receiveVerifiedUpdate = () => {
    if (
      resolutionStage === "awaiting" ||
      resolutionStage === "awaiting-signoff"
    )
      return;
    if (resolutionStage === "closed") {
      setResolutionStage("in-progress");
      setCases((currentCases) =>
        currentCases.map((item) =>
          item.id === selected.id
            ? { ...item, status: "in-progress", activityAt: Date.now() }
            : item,
        ),
      );
      setClosureCriteria({
        milestone: false,
        action: false,
        risk: false,
        alerts: false,
      });
      return;
    }
    setResolutionStage("ready");
    setCases((currentCases) =>
      currentCases.map((item) =>
        item.id === selected.id
          ? { ...item, status: "ready", activityAt: Date.now() }
          : item,
      ),
    );
  };
  const reopenResolution = () => {
    setResolutionStage("in-progress");
    setCases((currentCases) =>
      currentCases.map((item) =>
        item.id === selected.id
          ? { ...item, status: "in-progress", activityAt: Date.now() }
          : item,
      ),
    );
    setClosureCriteria({
      milestone: false,
      action: false,
      risk: false,
      alerts: false,
    });
  };
  const confirmClosure = () => {
    if (Object.values(closureCriteria).every(Boolean)) {
      setResolutionStage("closed");
      setCases((currentCases) =>
        currentCases.map((item) =>
          item.id === selected.id
            ? { ...item, status: "closed", activityAt: Date.now() }
            : item,
        ),
      );
      setClosureOpen(false);
    }
  };
  const copySelectedId = async () => {
    try {
      await navigator.clipboard.writeText(selected.id);
      setCopiedExceptionId(selected.id);
      window.setTimeout(() => setCopiedExceptionId(null), 1600);
    } catch {
      // Clipboard access can be unavailable in some browser contexts.
    }
  };
  const assignSelectedCase = (owner: string) => {
    setCases((currentCases) =>
      currentCases.map((item) =>
        item.id === selected.id ? { ...item, owner } : item,
      ),
    );
  };
  const visibleCases = useMemo(
    () =>
      cases
        .filter((item) => {
          const query = searchQuery.trim().toLowerCase();
          const matchesSearch =
            !query ||
            [
              item.id,
              item.title,
              item.detail,
              item.route,
              item.impact,
              item.owner,
            ].some((value) => value.toLowerCase().includes(query));
          return (
            matchesSearch &&
            (statusFilter === "all" ||
              (statusFilter === "active" &&
                item.status !== "closed" &&
                (!item.snoozedUntil || item.snoozedUntil <= Date.now())) ||
              (statusFilter === "resolved" && item.status === "closed")) &&
            (priorityFilter === "all" || item.priority === priorityFilter)
          );
        })
        .sort((a, b) => {
          const aClosed = a.status === "closed";
          const bClosed = b.status === "closed";
          if (aClosed !== bClosed) return aClosed ? 1 : -1;
          if (aClosed && bClosed)
            return (b.activityAt ?? 0) - (a.activityAt ?? 0);
          return a.priority.localeCompare(b.priority);
        }),
    [cases, priorityFilter, searchQuery, statusFilter],
  );
  const pageSize = 10;
  const pageCount = Math.max(1, Math.ceil(visibleCases.length / pageSize));
  const activePage = Math.min(page, pageCount);
  const paginatedCases = visibleCases.slice(
    (activePage - 1) * pageSize,
    activePage * pageSize,
  );
  const locations = Array.from(
    new Set([
      "Delhi",
      "Mumbai",
      "Bengaluru",
      "Singapore",
      "Dubai",
      "London",
      "New York",
      ...cases.flatMap((item) => item.route.split(" → ")),
    ]),
  );
  const locationQuery = locationField === "from" ? newFrom : newTo;
  const locationSuggestions = locations
    .filter((location) =>
      location.toLowerCase().includes(locationQuery.trim().toLowerCase()),
    )
    .slice(0, 6);
  useEffect(() => {
    if (!locationField) return;
    const closeSuggestions = (event: PointerEvent) => {
      if (
        !(event.target as HTMLElement).closest("[data-location-autocomplete]")
      )
        setLocationField(null);
    };
    document.addEventListener("pointerdown", closeSuggestions);
    return () => document.removeEventListener("pointerdown", closeSuggestions);
  }, [locationField]);
  const openNewException = () => {
    setNewTitle("");
    setNewFrom("");
    setNewTo("");
    setNewImpact("");
    setNewPriority("P2");
    setLocationField(null);
    setNewExceptionOpen(true);
  };
  const createException = () => {
    const title = newTitle.trim() || "New logistics exception";
    const from = newFrom.trim() || "Origin pending";
    const to = newTo.trim() || "Destination pending";
    const id = `EXC-${String(2500 + cases.length).padStart(4, "0")}`;
    const newCase: ExceptionCase = {
      id,
      priority: newPriority,
      title,
      route: `${from} → ${to}`,
      detail: newImpact.trim() || "Impact assessment pending",
      impact: newImpact.trim() || "Impact assessment pending",
      time: "now",
      owner: "Unassigned",
      uncertainty: "Unknown",
      status: "awaiting",
      activityAt: Date.now(),
    };
    setCases((current) => [newCase, ...current]);
    setSelectedId(id);
    resetResolution();
    setPage(1);
    setDrawerOpen(true);
    setNewExceptionOpen(false);
  };
  const rangeStart =
    visibleCases.length === 0 ? 0 : (activePage - 1) * pageSize + 1;
  const rangeEnd = Math.min(activePage * pageSize, visibleCases.length);

  return (
    <TooltipProvider>
      <SidebarProvider className="overflow-x-hidden">
        <AppSidebar />
        <SidebarInset className="min-w-0">
          <div className="min-h-screen bg-muted/30 text-foreground">
            <header className="sticky top-0 z-20 border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
              <div className="flex min-h-16 items-center gap-3 px-4 sm:px-6">
                <SidebarTrigger className="shrink-0" />
                <Separator
                  orientation="vertical"
                  className="hidden h-6 sm:block"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="hidden text-muted-foreground sm:inline">
                      Operations
                    </span>
                    <span className="hidden text-muted-foreground sm:inline">
                      /
                    </span>
                    <span className="truncate font-medium">
                      {workspaceSectionMeta[activeSection].title}
                    </span>
                  </div>
                  <p className="hidden text-xs text-muted-foreground sm:block">
                    Exceptra control tower
                  </p>
                </div>
                <div className="ml-auto flex items-center gap-1.5">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="relative size-8 rounded-full"
                        aria-label="Notifications"
                      >
                        <HugeiconsIcon
                          icon={BellIcon}
                          className="size-4"
                          strokeWidth={2}
                        />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-72">
                      <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                      <div className="px-2 py-6 text-center">
                        <p className="text-sm font-medium">
                          No new notifications
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          You’re all caught up.
                        </p>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </header>
            <main className="mx-auto max-w-[1600px] space-y-6 p-6">
              {activeSection === "inbox" ? (
                <>
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                  Exception inbox
                </h1>
                <Button onClick={openNewException}>New exception</Button>
              </div>
              <MetricStrip cases={cases} />
              <div className="space-y-4">
                <div className="flex flex-col gap-4 border-b pb-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold tracking-tight">
                      Prioritized queue
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Updated just now · sorted by operational consequence
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <HugeiconsIcon
                        icon={Search01Icon}
                        className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                        strokeWidth={2}
                      />
                      <Input
                        className="w-full pl-9 sm:w-64"
                        placeholder="Search exceptions"
                        value={searchQuery}
                        onChange={(event) => {
                          setSearchQuery(event.target.value);
                          setPage(1);
                        }}
                      />
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          aria-label="Filter queue"
                        >
                          <HugeiconsIcon
                            icon={FilterIcon}
                            className="size-4"
                            strokeWidth={2}
                          />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-56 max-h-96 overflow-y-auto"
                      >
                        <Collapsible
                          open={statusFilterOpen}
                          onOpenChange={setStatusFilterOpen}
                        >
                          <CollapsibleTrigger asChild>
                            <button
                              type="button"
                              className="flex w-full items-center justify-between rounded-2xl px-3 py-3 text-sm font-semibold tracking-tight outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring"
                            >
                              <span>Status</span>
                              <HugeiconsIcon
                                icon={ChevronRightIcon}
                                className={`size-4 text-muted-foreground transition-transform ${statusFilterOpen ? "rotate-90" : ""}`}
                                strokeWidth={2}
                              />
                            </button>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="pt-1">
                            <DropdownMenuRadioGroup
                              value={statusFilter}
                              onValueChange={(value) => {
                                setStatusFilter(value as QueueStatusFilter);
                                setPage(1);
                              }}
                            >
                              <DropdownMenuRadioItem className="px-3 py-2.5 text-sm font-normal" value="active">
                                Active exceptions
                              </DropdownMenuRadioItem>
                              <DropdownMenuRadioItem className="px-3 py-2.5 text-sm font-normal" value="all">
                                All exceptions
                              </DropdownMenuRadioItem>
                              <DropdownMenuRadioItem className="px-3 py-2.5 text-sm font-normal" value="resolved">
                                Resolved
                              </DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                          </CollapsibleContent>
                        </Collapsible>
                        <DropdownMenuSeparator />
                        <Collapsible
                          open={priorityFilterOpen}
                          onOpenChange={setPriorityFilterOpen}
                        >
                          <CollapsibleTrigger asChild>
                            <button
                              type="button"
                              className="flex w-full items-center justify-between rounded-2xl px-3 py-3 text-sm font-semibold tracking-tight outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring"
                            >
                              <span>Priority</span>
                              <HugeiconsIcon
                                icon={ChevronRightIcon}
                                className={`size-4 text-muted-foreground transition-transform ${priorityFilterOpen ? "rotate-90" : ""}`}
                                strokeWidth={2}
                              />
                            </button>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="pt-1">
                            <DropdownMenuRadioGroup
                              value={priorityFilter}
                              onValueChange={(value) => {
                                setPriorityFilter(value as Priority | "all");
                                setPage(1);
                              }}
                            >
                              <DropdownMenuRadioItem className="px-3 py-2.5 text-sm font-normal" value="all">
                                All priorities
                              </DropdownMenuRadioItem>
                              <DropdownMenuRadioItem className="px-3 py-2.5 text-sm font-normal" value="P1">
                                Critical
                              </DropdownMenuRadioItem>
                              <DropdownMenuRadioItem className="px-3 py-2.5 text-sm font-normal" value="P2">
                                High
                              </DropdownMenuRadioItem>
                              <DropdownMenuRadioItem className="px-3 py-2.5 text-sm font-normal" value="P3">
                                Medium
                              </DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                          </CollapsibleContent>
                        </Collapsible>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <div className="overflow-hidden rounded-xl border bg-background">
                  <div className="w-full overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-muted/40">
                        <TableRow className="hover:bg-transparent">
                          <TableHead>ID</TableHead>
                          <TableHead>Priority</TableHead>
                          <TableHead>Exception</TableHead>
                          <TableHead>Route</TableHead>
                          <TableHead>Impact</TableHead>
                          <TableHead>Confidence</TableHead>
                          <TableHead>Owner</TableHead>
                          <TableHead className="w-12" />
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedCases.map((item) => {
                          const [from, to] = item.route.split(" → ");
                          return (
                            <TableRow
                              key={item.id}
                              data-state={
                                item.id === selectedId ? "selected" : undefined
                              }
                            >
                              <TableCell className="font-mono text-xs text-muted-foreground">
                                {item.id}
                              </TableCell>
                              <TableCell>
                                <Badge variant={priorityVariant[item.priority]}>
                                  {item.priority} ·{" "}
                                  {priorityLabel[item.priority]}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="min-w-56">
                                  <p className="font-medium">{item.title}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {item.snoozedUntil &&
                                    item.snoozedUntil > Date.now()
                                      ? "Snoozed until tomorrow"
                                      : statusLabel[item.status ?? "awaiting"]}
                                  </p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex min-w-44 items-center gap-3">
                                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full border bg-muted text-muted-foreground">
                                    <HugeiconsIcon
                                      icon={
                                        routeModeIcon[
                                          routeModeById[item.id] ?? "road"
                                        ]
                                      }
                                      className="size-5"
                                      strokeWidth={2}
                                    />
                                  </div>
                                  <div className="space-y-0.5 text-xs">
                                    <p>
                                      <span className="mr-1 text-muted-foreground">
                                        From
                                      </span>
                                      <span className="font-medium">
                                        {from}
                                      </span>
                                    </p>
                                    <p>
                                      <span className="mr-1 text-muted-foreground">
                                        To
                                      </span>
                                      <span className="font-medium">{to}</span>
                                    </p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="min-w-44 text-sm">
                                {item.impact}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">
                                  {item.uncertainty}
                                </Badge>
                              </TableCell>
                              <TableCell>{item.owner}</TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      aria-label={`Actions for ${item.id}`}
                                    >
                                      <MoreHorizontal className="size-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      onSelect={() => {
                                        setSelectedId(item.id);
                                        setDrawerOpen(true);
                                        resetResolution(
                                          item.status ?? "awaiting",
                                          item.approvedActionId ?? null,
                                        );
                                      }}
                                    >
                                      Show details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onSelect={() => {
                                        setSelectedId(item.id);
                                        setDrawerOpen(true);
                                        resetResolution(
                                          item.status ?? "awaiting",
                                          item.approvedActionId ?? null,
                                        );
                                        setActiveTab("audit");
                                      }}
                                    >
                                      View history
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                  <div className="flex items-center justify-between gap-4 border-t px-4 py-3 text-sm text-muted-foreground">
                    <p>
                      Showing {rangeStart}–{rangeEnd} of {visibleCases.length}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="hidden sm:inline">
                        Page {activePage} of {pageCount}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="size-8"
                        aria-label="Previous page"
                        disabled={activePage === 1}
                        onClick={() =>
                          setPage((current) => Math.max(1, current - 1))
                        }
                      >
                        <HugeiconsIcon
                          icon={ChevronLeftIcon}
                          className="size-4"
                          strokeWidth={2}
                        />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="size-8"
                        aria-label="Next page"
                        disabled={activePage === pageCount}
                        onClick={() =>
                          setPage((current) => Math.min(pageCount, current + 1))
                        }
                      >
                        <HugeiconsIcon
                          icon={ChevronRightIcon}
                          className="size-4"
                          strokeWidth={2}
                        />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
                </>
              ) : (
                <ComingSoonPage section={activeSection} />
              )}
            </main>
            <AlertDialog
              open={newExceptionOpen}
              onOpenChange={setNewExceptionOpen}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>New exception</AlertDialogTitle>
                  <AlertDialogDescription>
                    Create a new logistics exception for the operations queue.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="grid gap-4 py-2">
                  <div className="grid gap-2">
                    <label
                      htmlFor="exception-title"
                      className="text-sm font-medium"
                    >
                      Exception title
                    </label>
                    <Input
                      id="exception-title"
                      placeholder="Describe the exception"
                      value={newTitle}
                      onChange={(event) => setNewTitle(event.target.value)}
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <LocationField
                      id="exception-from"
                      label="From"
                      placeholder="Origin location"
                      value={newFrom}
                      suggestions={locationSuggestions}
                      open={locationField === "from"}
                      onFocus={() => setLocationField("from")}
                      onChange={setNewFrom}
                      onSelect={(value) => {
                        setNewFrom(value);
                        setLocationField(null);
                      }}
                    />
                    <LocationField
                      id="exception-to"
                      label="To"
                      placeholder="Destination location"
                      value={newTo}
                      suggestions={locationSuggestions}
                      open={locationField === "to"}
                      onFocus={() => setLocationField("to")}
                      onChange={setNewTo}
                      onSelect={(value) => {
                        setNewTo(value);
                        setLocationField(null);
                      }}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label
                      htmlFor="exception-impact"
                      className="text-sm font-medium"
                    >
                      Impact summary
                    </label>
                    <Textarea
                      id="exception-impact"
                      placeholder="Describe the operational impact"
                      value={newImpact}
                      onChange={(event) => setNewImpact(event.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Priority</label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="justify-between"
                          aria-label="Select priority"
                        >
                          <span>{priorityLabel[newPriority]}</span>
                          <HugeiconsIcon
                            icon={UnfoldMoreIcon}
                            className="size-4 text-muted-foreground"
                            strokeWidth={2}
                          />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="start"
                        className="w-(--radix-dropdown-menu-trigger-width)"
                      >
                        <DropdownMenuLabel>
                          Exception priority
                        </DropdownMenuLabel>
                        <DropdownMenuRadioGroup
                          value={newPriority}
                          onValueChange={(value) =>
                            setNewPriority(value as Priority)
                          }
                        >
                          <DropdownMenuRadioItem value="P1">
                            Critical
                          </DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="P2">
                            High
                          </DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="P3">
                            Medium
                          </DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={createException}>
                    Create exception
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
              <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-2xl">
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="flex min-h-0 flex-1 flex-col"
                >
                  <SheetHeader className="gap-0 border-b border-border/70 p-0">
                    <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-5">
                      <div className="min-w-0 pr-10">
                        <div className="mb-3 flex flex-wrap gap-2">
                          <Badge variant={priorityVariant[selected.priority]}>
                            {selected.priority} ·{" "}
                            {priorityLabel[selected.priority]}
                          </Badge>
                          <Badge variant="outline">
                            {selected.uncertainty}
                          </Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button
                                type="button"
                                className="inline-flex h-5 w-fit shrink-0 items-center justify-center rounded-3xl bg-secondary px-2 text-xs font-medium text-secondary-foreground transition-colors hover:bg-secondary/80 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
                                aria-label={`Assign exception, currently assigned to ${selected.owner}`}
                              >
                                Assigned to {selected.owner}
                                <HugeiconsIcon
                                  icon={UnfoldMoreIcon}
                                  className="ml-1 size-3.5 text-muted-foreground"
                                  strokeWidth={2}
                                />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-52">
                              <DropdownMenuLabel>Assign to</DropdownMenuLabel>
                              <DropdownMenuRadioGroup
                                value={selected.owner}
                                onValueChange={assignSelectedCase}
                              >
                                {assignmentOptions.map((owner) => (
                                  <DropdownMenuRadioItem
                                    key={owner}
                                    value={owner}
                                  >
                                    {owner === "You" ? "You (me)" : owner}
                                  </DropdownMenuRadioItem>
                                ))}
                              </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <SheetTitle className="text-2xl font-semibold tracking-tight">
                          {selected.title}
                        </SheetTitle>
                        <div className="mt-1 flex items-center gap-2 text-base leading-6 text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <SheetDescription className="mt-0 text-base leading-normal text-inherit">
                              {selected.id}
                            </SheetDescription>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon-sm"
                                  className="size-7 shrink-0 rounded-md text-muted-foreground hover:text-foreground"
                                  onClick={copySelectedId}
                                  aria-label={
                                    copiedExceptionId === selected.id
                                      ? `Copied ${selected.id}`
                                      : `Copy ${selected.id}`
                                  }
                                >
                                  <HugeiconsIcon
                                    icon={
                                      copiedExceptionId === selected.id
                                        ? Tick02Icon
                                        : CopyIcon
                                    }
                                    className="size-4"
                                    strokeWidth={2}
                                  />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                {copiedExceptionId === selected.id
                                  ? "Copied"
                                  : "Copy exception ID"}
                              </TooltipContent>
                            </Tooltip>
                          </span>
                          <span aria-hidden="true">·</span>
                          <RouteMapDialog
                            selected={selected}
                            selectedFrom={selectedFrom}
                            selectedTo={selectedTo}
                          />
                        </div>
                      </div>
                    </div>
                    <TabsList
                      variant="line"
                      className="flex h-12 w-full justify-start gap-0 rounded-none border-b-0 bg-transparent px-3 py-0 text-sm"
                    >
                      <TabsTrigger
                        value="decision"
                        onClick={() => setActiveTab("decision")}
                      >
                        Decision
                      </TabsTrigger>
                      <TabsTrigger
                        value="evidence"
                        onClick={() => setActiveTab("evidence")}
                      >
                        Evidence{" "}
                        <Badge variant="secondary">
                          {detail.sources}
                        </Badge>
                      </TabsTrigger>
                      <TabsTrigger
                        value="timeline"
                        onClick={() => setActiveTab("timeline")}
                      >
                        Timeline
                      </TabsTrigger>
                      <TabsTrigger
                        value="audit"
                        onClick={() => setActiveTab("audit")}
                      >
                        Audit
                      </TabsTrigger>
                    </TabsList>
                  </SheetHeader>
                  <ScrollArea className="flex-1">
                    <div className="space-y-6 p-6">
                      <div className="flex items-start gap-3 rounded-lg border bg-muted/30 p-4">
                        <div className="rounded-md bg-primary p-2 text-primary-foreground">
                          <Sparkles className="size-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            AI assessment updated {selected.time} ago
                          </p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {detail.what}
                          </p>
                        </div>
                        <AssessmentReasoningDialog detail={detail} />
                      </div>
                      <TabsContent value="decision" className="space-y-6 pt-6">
                        <Card>
                          <CardHeader className="gap-0">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <CardDescription>
                                  01 / Understand the exception
                                </CardDescription>
                                <CardTitle className="text-lg">
                                  {detail.impact.includes("Product integrity")
                                    ? "Product disposition must be confirmed"
                                    : detail.impact.includes("Customs filing")
                                      ? "Delivery commitment is likely to be missed"
                                      : "Delivery commitment is likely to be missed"}
                                </CardTitle>
                              </div>
                              <Badge variant="secondary">
                                {detail.confidence} confidence
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="grid gap-3 sm:grid-cols-2">
                            <Insight
                              icon={<Activity />}
                              label="What happened"
                              type="Verified fact"
                              text={detail.what}
                            />
                            <Insight
                              icon={<Search />}
                              label="Likely cause"
                              type="AI inference"
                              text={detail.cause}
                            />
                            <Insight
                              icon={<AlertCircle />}
                              label="Business impact"
                              type="AI assessment"
                              text={detail.impact}
                            />
                            <Insight
                              icon={<FileText />}
                              label="Missing data"
                              type="Data gap"
                              text={detail.gap}
                            />
                            <div className="overflow-hidden rounded-xl border bg-card shadow-none sm:col-span-2">
                              <div className="flex items-start justify-between gap-6 p-4">
                                <div className="min-w-0 space-y-1">
                                  <p className="text-sm font-medium">
                                    Evidence readiness
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    High confidence
                                  </p>
                                </div>
                                <div className="shrink-0 text-right">
                                  <p className="text-2xl font-semibold leading-none">
                                    {detail.confidence}
                                  </p>
                                  <p className="mt-1 text-xs text-muted-foreground">
                                    signal confidence
                                  </p>
                                </div>
                              </div>
                              <div className="flex flex-wrap items-center justify-between gap-3 border-t bg-muted/30 px-4 py-3 text-sm">
                                <div className="flex items-center gap-3 text-muted-foreground">
                                  <span>{detail.sources} verified sources</span>
                                  <span
                                    aria-hidden="true"
                                    className="h-4 w-px bg-border"
                                  />
                                  <span>Freshness 2m</span>
                                </div>
                                <Button
                                  variant="link"
                                  size="sm"
                                  className="h-auto p-0"
                                >
                                  View evidence
                                  <HugeiconsIcon
                                    icon={ChevronRightIcon}
                                    strokeWidth={2}
                                    className="ml-1 size-3"
                                  />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="gap-0">
                            <CardDescription>
                              02 / Choose a response
                            </CardDescription>
                            <CardTitle className="text-lg">
                              Choose how to protect the delivery
                              {resolutionStage !== "awaiting" && (
                                <span className="text-emerald-700 dark:text-emerald-400">
                                  {" "}· approved
                                </span>
                              )}
                            </CardTitle>
                            <CardDescription>
                              Compare recovery time, cost and risk before approving.
                            </CardDescription>
                          </CardHeader>
                          <CardContent
                            className={
                              resolutionStage !== "awaiting" ? "px-6 pb-6" : undefined
                            }
                          >
                            {isResolving ? (
                              <div
                                aria-live="polite"
                                className="space-y-4 rounded-xl border bg-card p-4"
                              >
                                <div className="flex items-center justify-between gap-4">
                                  <div className="space-y-2">
                                    <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                                    <div className="h-7 w-72 max-w-full animate-pulse rounded bg-muted" />
                                    <div className="h-4 w-full max-w-xl animate-pulse rounded bg-muted" />
                                  </div>
                                  <div className="size-8 animate-spin rounded-full border-2 border-muted border-t-primary" />
                                </div>
                                <div className="h-px bg-border" />
                                <p className="text-sm text-muted-foreground">
                                  Recording decision and updating monitoring...
                                </p>
                              </div>
                            ) : resolutionStage !== "awaiting" && approvedAction ? (
                              <div className="overflow-hidden rounded-xl border bg-card shadow-none">
                                <div className="flex items-start justify-between gap-6 p-4">
                                  <div className="min-w-0">
                                      <Badge variant="success">
                                        Decision recorded
                                      </Badge>
                                      <h3 className="mt-3 text-xl font-semibold tracking-tight sm:text-2xl">
                                        {approvedAction.name}
                                      </h3>
                                      <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                                        {approvedAction.name} is the selected recovery path. Alternatives remain in the decision audit.
                                      </p>
                                  </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4 border-t px-4 py-3 text-sm">
                                    <div>
                                      <p className="font-semibold text-foreground">{approvedAction.recovery}</p>
                                      <p className="text-xs text-muted-foreground">recovered</p>
                                    </div>
                                    <div>
                                      <p className="font-semibold text-foreground">
                                        {new Intl.NumberFormat("en-US", {
                                          style: "currency",
                                          currency: "USD",
                                          maximumFractionDigits: 0,
                                        }).format(approvedAction.cost)}
                                      </p>
                                      <p className="text-xs text-muted-foreground">added cost</p>
                                    </div>
                                    <div>
                                      <p className="font-semibold text-foreground">{approvedAction.sla}</p>
                                      <p className="text-xs text-muted-foreground">SLA saved</p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap items-center justify-between gap-3 border-t bg-muted/30 px-4 py-3 text-sm">
                                  <span className="text-xs text-muted-foreground sm:text-sm">
                                    Alternatives retained in audit
                                  </span>
                                  <Button
                                    variant="link"
                                    size="sm"
                                    className="h-auto shrink-0 p-0"
                                    onClick={() => setActiveTab("audit")}
                                  >
                                    View history
                                    <HugeiconsIcon
                                      icon={ChevronRightIcon}
                                      className="ml-1 size-3.5"
                                      strokeWidth={2}
                                    />
                                  </Button>
                                </div>
                              </div>
                            ) : detail.actions.length === 0 ? (
                              <div className="flex items-start gap-3 rounded-xl border border-dashed bg-muted/30 p-4">
                                <div className="rounded-full bg-background p-2 text-muted-foreground shadow-sm">
                                  <FileText className="size-4" />
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm font-medium">
                                    No response is available yet
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    We need more verified evidence before a
                                    recovery path can be recommended. Check
                                    Evidence for the missing signal or keep
                                    monitoring this exception.
                                  </p>
                                </div>
                              </div>
                            ) : (
                            <Accordion
                              type="single"
                              collapsible
                              defaultValue={detail.actions[0]?.id}
                            >
                              {detail.actions.map((action, index) => {
                                const key = action.id;
                                const title = action.name;
                                const risk = action.risk;
                                const recovery = action.recovery;
                                const cost = new Intl.NumberFormat("en-US", {
                                  style: "currency",
                                  currency: "USD",
                                  maximumFractionDigits: 0,
                                }).format(action.cost);
                                const saved = action.sla;
                                const hasGap = action.dependencies.some(
                                  ([kind]) => kind === "gap",
                                );
                                return (
                                  <AccordionItem key={key} value={key}>
                                    <AccordionTrigger className="p-4">
                                      <div className="grid min-w-0 flex-1 grid-cols-1 items-center gap-3 pr-0 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-1">
                                        <div className="min-w-0">
                                          <p className="text-base font-medium break-words sm:whitespace-nowrap">
                                            {title}
                                          </p>
                                          {index === 0 ? (
                                            <span className="mt-1 flex w-fit items-center gap-1 text-xs font-medium text-primary">
                                              <Sparkles className="size-3" />
                                              AI recommended
                                            </span>
                                          ) : (
                                            <p className="mt-1 text-xs text-muted-foreground">
                                              Alternative{" "}
                                              {index === 1 ? "A" : "B"}
                                            </p>
                                          )}
                                        </div>
                                        <div className="flex items-center justify-self-end gap-3 whitespace-nowrap">
                                          <p className="text-sm text-muted-foreground">
                                            <span className="font-semibold text-foreground">
                                              {recovery}
                                            </span>{" "}
                                            recovery
                                          </p>
                                          <p className="text-sm text-muted-foreground">
                                            <span className="font-semibold text-foreground">
                                              {cost}
                                            </span>{" "}
                                            cost
                                          </p>
                                          <Badge
                                            variant={
                                              index === 0
                                                ? "warning"
                                                : "outline"
                                            }
                                          >
                                            {risk}
                                          </Badge>
                                        </div>
                                      </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                      <div
                                        className={`mx-0 mb-3 rounded-xl border bg-muted/30 p-4 ${index === 0 ? "border-primary/20" : "border-border"}`}
                                      >
                                        {approvedActionId === key &&
                                        resolutionStage !== "awaiting" ? (
                                          <div className="space-y-4">
                                            <div>
                                              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                                Decision recorded
                                              </p>
                                              <p className="mt-1 text-base font-medium">
                                                {action.name}
                                              </p>
                                              <p className="mt-1 text-sm text-muted-foreground">
                                                The selected response is now being monitored.
                                              </p>
                                            </div>
                                            <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-3">
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-auto px-0"
                                                onClick={() => setActiveTab("audit")}
                                              >
                                                View history
                                                <HugeiconsIcon
                                                  icon={ChevronRightIcon}
                                                  className="ml-1 size-3.5"
                                                  strokeWidth={2}
                                                />
                                              </Button>
                                              <span className="text-xs text-muted-foreground">
                                                Alternatives retained in audit
                                              </span>
                                            </div>
                                          </div>
                                        ) : (
                                          <>
                                        <div className="flex items-start justify-between gap-4">
                                          <div className="min-w-0">
                                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                              Selected response
                                            </p>
                                            <p className="mt-1 text-base font-medium">
                                              {title}
                                            </p>
                                            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                                              {action.description}
                                            </p>
                                          </div>
                                          <div className="shrink-0 text-right">
                                            <p className="text-2xl font-semibold">
                                              {saved}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                              commitment protection
                                            </p>
                                          </div>
                                        </div>
                                        <div
                                          role="status"
                                          className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-warning/40 bg-warning/10 p-3 text-xs text-warning-foreground"
                                        >
                                          <div className="flex items-center gap-2">
                                            <AlertCircle className="size-4 shrink-0" />
                                            <span>
                                              {hasGap
                                                ? `${action.dependencies.filter(([kind]) => kind === "gap").length} confirmation needed before execution`
                                                : "All required checks are available"}
                                            </span>
                                          </div>
                                          <span className="font-medium">
                                            {action.dependencies
                                              .filter(
                                                ([kind]) => kind === "gap",
                                              )
                                              .map(([, text]) => text)
                                              .join(" · ") ||
                                              action.dependencies
                                                .map(([, text]) => text)
                                                .join(" · ")}
                                          </span>
                                        </div>
                                        <Collapsible className="mt-4 border-b pb-4">
                                          <CollapsibleTrigger className="group flex w-full items-center gap-2 text-left text-sm text-muted-foreground transition-colors hover:text-foreground">
                                            <HugeiconsIcon
                                              icon={ChevronRightIcon}
                                              strokeWidth={2}
                                              className="size-4 transition-transform group-data-[state=open]:rotate-90"
                                            />
                                            <span>
                                              View assumptions and trade-offs
                                            </span>
                                          </CollapsibleTrigger>
                                          <CollapsibleContent className="pt-3">
                                            <div className="flex flex-wrap gap-2 text-xs">
                                              {action.dependencies.map(
                                                ([kind, text]) => (
                                                  <Badge
                                                    key={`${kind}-${text}`}
                                                    variant={
                                                      kind === "gap"
                                                        ? "warning"
                                                        : "outline"
                                                    }
                                                  >
                                                    {kind === "gap"
                                                      ? "Needs"
                                                      : kind === "inference"
                                                        ? "Assumes"
                                                        : "Verified"}{" "}
                                                    · {text}
                                                  </Badge>
                                                ),
                                              )}
                                            </div>
                                            <p className="mt-3 text-sm text-muted-foreground">
                                              {action.note}
                                            </p>
                                          </CollapsibleContent>
                                        </Collapsible>
                                          <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
                                          <div className="flex items-start gap-3">
                                            <AlertDialog>
                                              <Tooltip>
                                                <TooltipTrigger asChild>
                                                  <AlertDialogTrigger asChild>
                                                    <Button
                                                      variant="ghost"
                                                      size="icon-xs"
                                                      className="mt-0.5 rounded-full text-muted-foreground"
                                                      aria-label="Why this option?"
                                                    >
                                                      <HugeiconsIcon
                                                        icon={
                                                          InformationCircleIcon
                                                        }
                                                        strokeWidth={2}
                                                      />
                                                    </Button>
                                                  </AlertDialogTrigger>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                  Why this option?
                                                </TooltipContent>
                                              </Tooltip>
                                              <AlertDialogContent>
                                                <AlertDialogHeader>
                                                  <AlertDialogDescription>
                                                    Reasoning trace
                                                  </AlertDialogDescription>
                                                  <AlertDialogTitle>
                                                    Why this exception is
                                                    prioritized
                                                  </AlertDialogTitle>
                                                  <AlertDialogDescription>
                                                    The assessment joins
                                                    operational events, service
                                                    commitments, and historical
                                                    context. It separates
                                                    verified events from AI
                                                    inference and open data.
                                                  </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <div className="space-y-3 rounded-lg bg-muted p-4 text-sm">
                                                  <p className="font-medium">
                                                    Current support
                                                  </p>
                                                  <p className="text-muted-foreground">
                                                    {detail.sources} verified
                                                    sources support this
                                                    assessment. Confidence is{" "}
                                                    {detail.confidence}; it is
                                                    not a guarantee.
                                                  </p>
                                                  <p className="text-muted-foreground">
                                                    Open information:{" "}
                                                    {detail.gap}
                                                  </p>
                                                </div>
                                                <AlertDialogFooter>
                                                  <AlertDialogAction>
                                                    Done
                                                  </AlertDialogAction>
                                                </AlertDialogFooter>
                                              </AlertDialogContent>
                                            </AlertDialog>
                                            <div className="flex flex-col gap-1">
                                              <p className="text-xs leading-none font-medium uppercase tracking-wide text-muted-foreground">
                                                Decision authority
                                              </p>
                                              <p className="text-sm leading-none font-medium">
                                                {action.cost > 2500
                                                  ? "Manager sign-off required"
                                                  : "Within coordinator authority"}
                                              </p>
                                            </div>
                                          </div>
                                          <div className="flex justify-end gap-2">
                                            <AlertDialog>
                                              <AlertDialogTrigger asChild>
                                                <Button variant="outline">
                                                  Override AI
                                                </Button>
                                              </AlertDialogTrigger>
                                              <AlertDialogContent>
                                                <AlertDialogHeader>
                                                  <AlertDialogDescription>
                                                    Human override
                                                  </AlertDialogDescription>
                                                  <AlertDialogTitle>
                                                    Correct the recommendation
                                                  </AlertDialogTitle>
                                                  <AlertDialogDescription>
                                                    Record what the coordinator
                                                    knows that the AI does not.
                                                    This becomes a
                                                    learning-review candidate;
                                                    it does not change live
                                                    systems.
                                                  </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <div className="space-y-2">
                                                  <label
                                                    htmlFor="override-reason"
                                                    className="text-sm font-medium"
                                                  >
                                                    Reason
                                                  </label>
                                                  <Textarea
                                                    id="override-reason"
                                                    value={overrideReason}
                                                    onChange={(event) =>
                                                      setOverrideReason(
                                                        event.target.value,
                                                      )
                                                    }
                                                    rows={3}
                                                  />
                                                </div>
                                                <AlertDialogFooter>
                                                  <AlertDialogCancel>
                                                    Cancel
                                                  </AlertDialogCancel>
                                                  <AlertDialogAction
                                                    onClick={() => undefined}
                                                  >
                                                    Record override
                                                  </AlertDialogAction>
                                                </AlertDialogFooter>
                                              </AlertDialogContent>
                                            </AlertDialog>
                                            <AlertDialog>
                                              <AlertDialogTrigger asChild>
                                                <Button
                                                  onClick={() =>
                                                    setSignoffAcknowledged(
                                                      false,
                                                    )
                                                  }
                                                >
                                                  {action.cost > 2500
                                                    ? "Request sign-off"
                                                    : "Review and approve"}
                                                </Button>
                                              </AlertDialogTrigger>
                                              <AlertDialogContent>
                                                <AlertDialogHeader>
                                                  <AlertDialogDescription>
                                                    Approval threshold
                                                  </AlertDialogDescription>
                                                  <AlertDialogTitle>
                                                    {title}
                                                  </AlertDialogTitle>
                                                  <AlertDialogDescription>
                                                    {action.cost > 2500
                                                      ? `This action adds ${cost}, above the $2,500 coordinator threshold.`
                                                      : "This action is within the coordinator approval threshold."}
                                                  </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <div className="space-y-3 rounded-lg bg-muted p-4 text-sm">
                                                  <p className="font-medium">
                                                    Dependencies and authority
                                                  </p>
                                                  <div className="space-y-2 text-muted-foreground">
                                                    {action.dependencies.map(
                                                      ([kind, text]) => (
                                                        <p
                                                          key={`${kind}-${text}`}
                                                        >
                                                          <span className="font-medium text-foreground">
                                                            {kind === "gap"
                                                              ? "Open dependency:"
                                                              : kind ===
                                                                  "inference"
                                                                ? "Assumption:"
                                                                : "Verified:"}
                                                          </span>{" "}
                                                          {text}
                                                        </p>
                                                      ),
                                                    )}
                                                    <p>
                                                      <span className="font-medium text-foreground">
                                                        Duplicate action check
                                                        passed
                                                      </span>
                                                    </p>
                                                  </div>
                                                </div>
                                                <label className="flex items-start gap-3 text-sm">
                                                  <input
                                                    type="checkbox"
                                                    checked={
                                                      signoffAcknowledged
                                                    }
                                                    onChange={(event) =>
                                                      setSignoffAcknowledged(
                                                        event.target.checked,
                                                      )
                                                    }
                                                    className="mt-0.5 size-4 shrink-0 accent-primary"
                                                  />
                                                  <span>
                                                    I understand the cost,
                                                    dependencies and operational
                                                    exposure.
                                                  </span>
                                                </label>
                                                <AlertDialogFooter>
                                                  <AlertDialogCancel>
                                                    Go back
                                                  </AlertDialogCancel>
                                                  <AlertDialogAction
                                                    disabled={
                                                      !signoffAcknowledged
                                                    }
                                                    onClick={() =>
                                                      startResolution(
                                                        key,
                                                        action.cost > 2500,
                                                      )
                                                    }
                                                  >
                                                    {action.cost > 2500
                                                      ? "Send for sign-off"
                                                      : "Confirm and monitor"}
                                                  </AlertDialogAction>
                                                </AlertDialogFooter>
                                              </AlertDialogContent>
                                            </AlertDialog>
                                          </div>
                                          </div>
                                          </>
                                        )}
                                      </div>
                                    </AccordionContent>
                                  </AccordionItem>
                                );
                              })}
                            </Accordion>
                            )}
                          </CardContent>
                        </Card>
                        <Card
                          className={
                            resolutionStage === "awaiting"
                              ? "gap-0 py-4"
                              : "motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-2 motion-safe:duration-500 motion-safe:ease-out motion-reduce:animate-none"
                          }
                        >
                          <CardHeader
                            className={
                              resolutionStage === "awaiting"
                                ? "gap-0 px-4"
                                : "gap-0"
                            }
                          >
                            <div className="flex items-center justify-between gap-4">
                              <div>
                                <CardDescription>
                                  03 / Resolution progress
                                </CardDescription>
                                {resolutionStage !== "awaiting" && (
                                  <CardTitle className="text-lg">
                                    Track the selected recovery path
                                  </CardTitle>
                                )}
                              </div>
                              <Badge
                                variant={
                                  resolutionStage === "awaiting"
                                    ? "outline"
                                    : resolutionStage === "awaiting-signoff"
                                      ? "warning"
                                      : resolutionStage === "ready"
                                        ? "success"
                                        : resolutionStage === "closed"
                                          ? "secondary"
                                          : "default"
                                }
                              >
                                {resolutionStage === "awaiting"
                                  ? "Needs decision"
                                  : resolutionStage === "awaiting-signoff"
                                    ? "Awaiting sign-off"
                                    : resolutionStage === "in-progress"
                                      ? "Monitoring"
                                      : resolutionStage === "ready"
                                        ? "Ready for closure review"
                                        : "Resolved"}
                              </Badge>
                            </div>
                          </CardHeader>
                          {resolutionStage !== "awaiting" && (
                            <CardContent className="space-y-4">
                              <>
                                <div className="grid gap-4 sm:grid-cols-3">
                                  <div>
                                    <p className="text-xs text-muted-foreground">
                                      Action status
                                    </p>
                                    <p className="mt-1 font-medium">
                                      {resolutionStage === "closed"
                                        ? "Resolution confirmed"
                                        : approvedAction?.name ?? "Response approved"}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground">
                                      Next evidence check
                                    </p>
                                    <p className="mt-1 font-medium">
                                      {resolutionStage === "awaiting-signoff"
                                        ? "Manager sign-off required"
                                        : resolutionStage === "ready" ||
                                            resolutionStage === "closed"
                                          ? "Gate appointment confirmed"
                                          : "Gate appointment confirmation"}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground">
                                      SLA response gate
                                    </p>
                                    <p className="mt-1 font-medium">
                                      {resolutionStage === "awaiting-signoff"
                                        ? "Response timer satisfied"
                                        : resolutionStage === "closed"
                                          ? "Monitoring retained"
                                          : "Acknowledged"}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 rounded-lg border bg-muted/30 p-3 text-sm text-muted-foreground">
                                  <CheckCircle2 className="size-4 text-primary" />
                                  {resolutionStage === "awaiting-signoff"
                                    ? "Coordinator choice is recorded; execution has not started."
                                    : resolutionStage === "in-progress"
                                      ? "Action is tracked; closure requires a verified update."
                                      : resolutionStage === "ready"
                                        ? "Verified update received; closure criteria can now be reviewed."
                                        : "Resolution criteria were confirmed; contradictory events can reopen monitoring."}
                                </div>
                                <div className="flex flex-wrap justify-end gap-2">
                                  {resolutionStage === "awaiting-signoff" && (
                                    <Button
                                      variant="outline"
                                      onClick={simulateManagerSignoff}
                                    >
                                      Simulate manager sign-off
                                    </Button>
                                  )}
                                  {resolutionStage === "in-progress" && (
                                    <Button
                                      variant="outline"
                                      onClick={receiveVerifiedUpdate}
                                    >
                                      Record verified update
                                    </Button>
                                  )}
                                  {resolutionStage === "ready" && (
                                    <Button onClick={() => setClosureOpen(true)}>
                                      Review closure criteria
                                    </Button>
                                  )}
                                  {resolutionStage === "closed" && (
                                    <Button
                                      variant="outline"
                                      onClick={reopenResolution}
                                    >
                                      Reopen monitoring
                                    </Button>
                                  )}
                                </div>
                              </>
                            </CardContent>
                          )}
                        </Card>
                        <AlertDialog open={closureOpen} onOpenChange={setClosureOpen}>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogDescription>
                                Closure review
                              </AlertDialogDescription>
                              <AlertDialogTitle>
                                Confirm objective resolution criteria
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Close this exception only after every condition
                                has been verified.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="space-y-3 rounded-lg bg-muted p-4 text-sm">
                              {[
                                [
                                  "milestone",
                                  "Verified gate appointment is recorded",
                                ],
                                [
                                  "action",
                                  "Approved action is progressing as expected",
                                ],
                                [
                                  "risk",
                                  "Customer commitment risk is acceptable",
                                ],
                                [
                                  "alerts",
                                  "No active related alerts remain",
                                ],
                              ].map(([criterion, label]) => (
                                <label
                                  key={criterion}
                                  className="flex items-start gap-3"
                                >
                                  <input
                                    type="checkbox"
                                    checked={
                                      closureCriteria[
                                        criterion as keyof typeof closureCriteria
                                      ]
                                    }
                                    onChange={(event) =>
                                      setClosureCriteria((current) => ({
                                        ...current,
                                        [criterion]: event.target.checked,
                                      }))
                                    }
                                    className="mt-0.5 size-4 shrink-0 accent-primary"
                                  />
                                  <span>{label}</span>
                                </label>
                              ))}
                            </div>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Keep monitoring</AlertDialogCancel>
                              <Button
                                type="button"
                                disabled={!Object.values(closureCriteria).every(Boolean)}
                                onClick={confirmClosure}
                              >
                                Confirm and close
                              </Button>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TabsContent>
                      <TabsContent value="evidence" className="space-y-3 pt-6">
                        <Card>
                          <CardHeader className="gap-0">
                            <CardDescription>
                              Evidence and provenance
                            </CardDescription>
                            <CardTitle>
                              {verifiedSourceCount === 0
                                ? "No verified signals yet"
                                : `${verifiedSourceCount} verified signals support this assessment`}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            {verifiedSourceCount === 0 ? (
                              <div className="flex items-start gap-3 rounded-xl border border-dashed bg-muted/30 p-4">
                                <div className="rounded-full bg-background p-2 text-muted-foreground shadow-sm">
                                  <ShieldCheck className="size-4" />
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm font-medium">
                                    No verified evidence available
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    Evidence will appear here when operational
                                    signals or partner confirmations are received.
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <div className="divide-y overflow-hidden rounded-xl border bg-background">
                                {[
                                  {
                                    label: "Operational event",
                                    text: detail.what,
                                    state: "Verified",
                                    icon: Activity01Icon,
                                  },
                                  {
                                    label: "AI assessment",
                                    text: detail.cause,
                                    state: "AI inference",
                                    icon: SparklesIcon,
                                  },
                                  {
                                    label: "Customer commitment",
                                    text: detail.impact,
                                    state: "Verified",
                                    icon: HeartPulseIcon,
                                  },
                                  {
                                    label: "Open information",
                                    text: detail.gap,
                                    state: "Missing",
                                    icon: FileTextIcon,
                                  },
                                ].map(({ label, text, state, icon }) => (
                                  <div
                                    className="flex min-h-20 items-center gap-4 px-4 py-3"
                                    key={label}
                                  >
                                    <div className="flex size-12 shrink-0 items-center justify-center rounded-lg border bg-background shadow-sm">
                                      <HugeiconsIcon
                                        icon={icon}
                                        className="size-5 text-foreground"
                                        strokeWidth={2}
                                        aria-hidden="true"
                                      />
                                    </div>
                                    <div className="min-w-0 flex-1 space-y-1">
                                      <p className="font-medium leading-5">
                                        {label}
                                      </p>
                                      <p className="text-sm text-muted-foreground">
                                        {text}
                                      </p>
                                    </div>
                                    <Badge
                                      variant={
                                        state === "Missing"
                                          ? "destructive"
                                          : "outline"
                                      }
                                      className="shrink-0"
                                    >
                                      {state}
                                    </Badge>
                                  </div>
                                ))}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </TabsContent>
                      <TabsContent value="timeline" className="pt-6">
                        <Card>
                          <CardHeader className="gap-0">
                            <CardDescription>
                              Exception lifecycle
                            </CardDescription>
                            <CardTitle>
                              From detection to current decision
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-5">
                            {[
                              [
                                "14:22",
                                "Assessment updated",
                                "New carrier discharge estimate increased predicted delay to 31 hours.",
                              ],
                              [
                                "14:20",
                                "Carrier event received",
                                "Estimated discharge changed after terminal congestion update.",
                              ],
                              [
                                "14:14",
                                "Assigned to Sourav",
                                "P1 response timer started; acknowledgement recorded.",
                              ],
                              [
                                "14:12",
                                "Exception created",
                                "Three correlated signals merged into EXC-2481.",
                              ],
                              [
                                "14:11",
                                "Potential exception detected",
                                "ETA model crossed the customer SLA threshold.",
                              ],
                            ].map(([time, label, text]) => (
                              <div
                                className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-4"
                                key={`${time}-${label}`}
                              >
                                <span className="font-mono text-xs text-muted-foreground">
                                  {time}
                                </span>
                                <div>
                                  <p className="font-medium">{label}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {text}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </CardContent>
                        </Card>
                      </TabsContent>
                      <TabsContent value="audit" className="pt-6">
                        <Card>
                          <CardHeader className="gap-0">
                            <div className="flex items-center justify-between">
                              <div>
                                <CardDescription>
                                  Immutable history
                                </CardDescription>
                                <CardTitle>Decision and action audit</CardTitle>
                              </div>
                              <Button variant="outline" size="sm">
                                Export JSON
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            {detail.audit.length > 0 ? (
                              <div className="divide-y overflow-hidden rounded-xl border bg-background">
                                {detail.audit.map(([time, label, actor]) => {
                                  const normalizedLabel = label.toLowerCase();
                                  const auditIcon = normalizedLabel.includes(
                                    "created"
                                  )
                                    ? FileTextIcon
                                    : normalizedLabel.includes("assessment")
                                      ? SparklesIcon
                                      : normalizedLabel.includes("signal") ||
                                          normalizedLabel.includes("validation")
                                        ? ShieldCheckIcon
                                        : normalizedLabel.includes("assigned") ||
                                            normalizedLabel.includes("acknowledged")
                                          ? CheckmarkCircle04Icon
                                          : Activity01Icon;

                                  return (
                                    <div
                                      className="flex min-h-20 items-center gap-4 px-4 py-3"
                                      key={`${time}-${label}`}
                                    >
                                      <div className="flex size-12 shrink-0 items-center justify-center rounded-lg border bg-background shadow-sm">
                                        <HugeiconsIcon
                                          icon={auditIcon}
                                          className="size-5 text-foreground"
                                          strokeWidth={2}
                                          aria-hidden="true"
                                        />
                                      </div>
                                      <div className="min-w-0 flex-1 space-y-1">
                                        <p className="font-medium leading-5">
                                          {label}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                          Recorded at {time}
                                        </p>
                                      </div>
                                      <code className="shrink-0 rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
                                        {actor}
                                      </code>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <div className="flex items-start gap-4 rounded-xl border border-dashed bg-muted/30 p-4">
                                <div className="flex size-12 shrink-0 items-center justify-center rounded-lg border bg-background shadow-sm">
                                  <HugeiconsIcon
                                    icon={Activity01Icon}
                                    className="size-5 text-muted-foreground"
                                    strokeWidth={2}
                                    aria-hidden="true"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <p className="font-medium">
                                    No decisions recorded yet
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    Decision and action history will appear here
                                    after a response is recorded.
                                  </p>
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </TabsContent>
                    </div>
                  </ScrollArea>
                </Tabs>
              </SheetContent>
            </Sheet>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}

function LocationField({
  id,
  label,
  placeholder,
  value,
  suggestions,
  open,
  onFocus,
  onChange,
  onSelect,
}: {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  suggestions: string[];
  open: boolean;
  onFocus: () => void;
  onChange: (value: string) => void;
  onSelect: (value: string) => void;
}) {
  return (
    <div data-location-autocomplete className="relative grid gap-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <Input
        id={id}
        placeholder={placeholder}
        value={value}
        onFocus={onFocus}
        onChange={(event) => onChange(event.target.value)}
        autoComplete="off"
      />
      {open && suggestions.length > 0 && (
        <div className="absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-xl border bg-popover p-1 text-popover-foreground shadow-md">
          <p className="px-3 py-2 text-xs text-muted-foreground">
            Suggested locations
          </p>
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              className="flex w-full rounded-lg px-3 py-2 text-left text-sm outline-none hover:bg-accent hover:text-accent-foreground"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => onSelect(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function MetricStrip({ cases }: { cases: ExceptionCase[] }) {
  const activeCases = cases.filter((item) => item.status !== "closed");
  const metrics = [
    {
      label: "Open exceptions",
      value: activeCases.length.toString(),
      detail: "Across active shipments",
      icon: (
        <HugeiconsIcon
          icon={PackageSearchIcon}
          className="size-4"
          strokeWidth={2}
        />
      ),
    },
    {
      label: "Critical",
      value: "1",
      detail: "Needs attention",
      icon: (
        <HugeiconsIcon
          icon={AlertCircleIcon}
          className="size-4"
          strokeWidth={2}
        />
      ),
      tone: "text-destructive",
    },
    {
      label: "At-risk value",
      value: "$184k",
      detail: "Across 4 shipments",
      icon: (
        <HugeiconsIcon
          icon={ShieldCheckIcon}
          className="size-4"
          strokeWidth={2}
        />
      ),
    },
    {
      label: "Median response",
      value: "8m",
      detail: "18% faster this week",
      icon: (
        <HugeiconsIcon icon={Clock01Icon} className="size-4" strokeWidth={2} />
      ),
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
                <p
                  className={`text-2xl font-semibold tracking-tight ${metric.tone ?? ""}`}
                >
                  {metric.value}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {metric.label}
                </p>
              </div>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {metric.detail}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function AssessmentReasoningDialog({ detail }: { detail: ScenarioDetail }) {
  return (
    <AlertDialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 shrink-0 rounded-full text-muted-foreground hover:text-foreground"
              aria-label="How was this determined?"
            >
              <HugeiconsIcon
                icon={InformationCircleIcon}
                className="size-4"
                strokeWidth={2}
              />
            </Button>
          </AlertDialogTrigger>
        </TooltipTrigger>
        <TooltipContent>How was this determined?</TooltipContent>
      </Tooltip>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogDescription>Reasoning trace</AlertDialogDescription>
          <AlertDialogTitle>Why this exception is prioritized</AlertDialogTitle>
          <AlertDialogDescription>
            The assessment joins operational events, service commitments, and
            historical context. It separates verified events from AI inference
            and open data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-3 rounded-lg bg-muted p-4 text-sm">
          <p className="font-medium">Current support</p>
          <p className="text-muted-foreground">
            {detail.sources} verified sources support this assessment.
            Confidence is {detail.confidence}; it is not a guarantee.
          </p>
          <p className="text-muted-foreground">
            <span className="font-medium text-foreground">
              Open information:
            </span>{" "}
            {detail.gap}
          </p>
        </div>
        <AlertDialogFooter>
          <AlertDialogAction>Done</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function Insight({
  icon,
  label,
  type,
  text,
}: {
  icon: React.ReactNode;
  label: string;
  type: string;
  text: string;
}) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-center gap-2 text-sm font-medium [&>svg]:size-5 [&>svg]:shrink-0 [&>svg]:stroke-[1.75]">
        {icon}
        <span>{label}</span>
                                  <Badge variant="outline" className="ml-auto text-xs">
          {type}
        </Badge>
      </div>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p>
    </div>
  );
}

export default App;
