import { useEffect, useMemo, useRef, useState } from "react";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  Activity01Icon,
  AlertCircleIcon,
  BellIcon,
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
  Search01Icon,
  ShieldCheckIcon,
  SparklesIcon,
  Analytics01Icon,
  Settings05Icon,
  Tick02Icon,
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
import { InlineEmptyState } from "@/components/inline-empty-state";
import { MetricStrip } from "@/components/metric-strip";
import { AssessmentReasoningDialog } from "@/components/assessment-reasoning-dialog";
import { Insight } from "@/components/insight";
import { ComingSoonPage } from "@/components/coming-soon-page";
import { LocationField } from "@/components/location-field";
import { RouteMapDialog } from "@/components/route-map-dialog";
import {
  resolveRouteData,
  routeModeIcon,
  type RouteMapData,
} from "@/components/route-map-data";
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
import { ResponsiveDataTable, type ResponsiveTableColumn } from "@/components/responsive-data-table";
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


type Priority = "P1" | "P2" | "P3";
type ImpactSummary = {
  headline: string;
  detail?: string;
};
type ConfidenceSummary = {
  level: "confirmed" | "likely" | "possible" | "unknown";
  score?: number;
};
type ExceptionCase = {
  id: string;
  priority: Priority;
  title: string;
  route: RouteMapData;
  detail: string;
  impact: ImpactSummary;
  time: string;
  owner: string;
  confidence: ConfidenceSummary;
  status?: ResolutionStage;
  approvedActionId?: string;
  activityAt?: number;
  snoozedUntil?: number;
};

type ExceptionCaseInput = Omit<ExceptionCase, "route"> & { route: string };

type RouteDisplay = {
  from: string;
  to: string;
  data: RouteMapData;
};

const confidenceText = ({ level, score }: ConfidenceSummary) => {
  const label = level[0].toUpperCase() + level.slice(1);
  return score === undefined ? label : `${label} · ${score}%`;
};

const routeDisplayFor = (item: Pick<ExceptionCase, "route">): RouteDisplay => ({
  from: item.route.from.country,
  to: item.route.to.country,
  data: item.route,
});

const normalizeExceptionCase = (item: ExceptionCaseInput): ExceptionCase => {
  return {
    ...item,
    route: resolveRouteData(item.id, item.route),
  };
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
type AuditEntry = [string, string, string];

const initialCaseInputs: ExceptionCaseInput[] = [
  {
    id: "EXC-2457",
    priority: "P2",
    title: "Reefer power interruption detected",
    route: "Kobe → Rotterdam",
    detail: "Cold-chain telemetry dropped for 18 min",
    impact: { headline: "Product integrity at risk", detail: "$28k load" },
    time: "18m",
    owner: "You",
    confidence: { level: "possible", score: 72 },
  },
  {
    id: "EXC-2481",
    priority: "P1",
    title: "Port congestion threatens delivery",
    route: "Rotterdam → Chicago",
    detail: "31h predicted delay · $42k at risk",
    impact: { headline: "Late by 25–37h", detail: "$42k at risk" },
    time: "2m",
    owner: "You",
    confidence: { level: "likely", score: 82 },
  },
  {
    id: "EXC-2479",
    priority: "P2",
    title: "Temperature excursion detected",
    route: "Singapore → Frankfurt",
    detail: "8.4°C for 22 min · Pharma",
    impact: { headline: "Quality release at risk", detail: "Pharma load" },
    time: "11m",
    owner: "Mina",
    confidence: { level: "confirmed" },
  },
  {
    id: "EXC-2476",
    priority: "P2",
    title: "Customs documents incomplete",
    route: "Dhaka → Toronto",
    detail: "Commercial invoice mismatch",
    impact: { headline: "Late by 5–6 days" },
    time: "26m",
    owner: "You",
    confidence: { level: "possible", score: 64 },
  },
  {
    id: "EXC-2471",
    priority: "P3",
    title: "Tracking signal stale",
    route: "Shenzhen → Long Beach",
    detail: "No carrier event for 9h",
    impact: { headline: "Up to 15h late" },
    time: "1h",
    owner: "Unassigned",
    confidence: { level: "unknown" },
  },
  {
    id: "EXC-2468",
    priority: "P3",
    title: "Warehouse handoff delayed",
    route: "Hamburg → Prague",
    detail: "Pickup missed by 46 min",
    impact: { headline: "Up to 8h late", detail: "$4k penalty" },
    time: "2h",
    owner: "Nadia",
    confidence: { level: "likely", score: 71 },
  },
  {
    id: "EXC-2464",
    priority: "P3",
    title: "Delivery appointment at risk",
    route: "Antwerp → Lyon",
    detail: "Driver hours limit approaching",
    impact: { headline: "At risk", detail: "2h of slack left" },
    time: "3h",
    owner: "You",
    confidence: { level: "possible", score: 58 },
  },
  {
    id: "EXC-2461",
    priority: "P2",
    title: "Container release delayed",
    route: "Busan → Seattle",
    detail: "Customs release pending for 6h",
    impact: { headline: "Up to 8h late" },
    time: "4h",
    owner: "Mina",
    confidence: { level: "possible", score: 61 },
  },
  {
    id: "EXC-2459",
    priority: "P3",
    title: "Proof of delivery missing",
    route: "Paris → Madrid",
    detail: "Signed receipt not uploaded",
    impact: { headline: "Proof required before release" },
    time: "5h",
    owner: "Unassigned",
    confidence: { level: "unknown" },
  },
  {
    id: "EXC-2458",
    priority: "P2",
    title: "Carrier capacity reduced",
    route: "Los Angeles → Dallas",
    detail: "Two booked trailers cancelled",
    impact: { headline: "Up to 8h late", detail: "$4k penalty" },
    time: "6h",
    owner: "You",
    confidence: { level: "likely", score: 74 },
  },
  {
    id: "EXC-2456",
    priority: "P3",
    title: "Temperature logger offline",
    route: "Osaka → Vancouver",
    detail: "No telemetry received for 3h",
    impact: { headline: "No reliable ETA" },
    time: "7h",
    owner: "Nadia",
    confidence: { level: "possible", score: 55 },
  },
];

const initialCases: ExceptionCase[] = initialCaseInputs.map(normalizeExceptionCase);

const assignmentOptions = ["You", "Mina", "Nadia", "Unassigned"] as const;

const impactText = (impact: ImpactSummary) =>
  [impact.headline, impact.detail].filter(Boolean).join(" · ");

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
  impact: impactText(item.impact) || "Operational impact is not yet estimated.",
  gap: "Supporting evidence and partner confirmation.",
  confidence: item.confidence.score === undefined
    ? "Unverified"
    : `${item.confidence.score}%`,
  sources: "0",
  actions: [],
  audit: [],
});

const auditIconForLabel = (label: string): IconSvgElement => {
  const normalizedLabel = label.toLowerCase();

  if (normalizedLabel.includes("created")) return FileTextIcon;
  if (normalizedLabel.includes("assessment")) return SparklesIcon;
  if (
    normalizedLabel.includes("signal") ||
    normalizedLabel.includes("validation") ||
    normalizedLabel.includes("verified")
  ) {
    return ShieldCheckIcon;
  }
  if (normalizedLabel.includes("override")) return AlertCircleIcon;
  if (
    normalizedLabel.includes("approved") ||
    normalizedLabel.includes("assigned") ||
    normalizedLabel.includes("acknowledged")
  ) {
    return CheckmarkCircle04Icon;
  }
  if (normalizedLabel.includes("sign-off")) return ShieldCheckIcon;
  if (normalizedLabel.includes("closed")) return Tick02Icon;
  if (normalizedLabel.includes("reopened")) return Navigation03Icon;
  if (normalizedLabel.includes("monitoring")) return Activity01Icon;

  return Activity01Icon;
};

const priorityVariant: Record<Priority, "destructive" | "secondary" | "outline"> =
  { P1: "destructive", P2: "secondary", P3: "outline" };
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

function App() {
  const getSectionFromHash = (): WorkspaceSection => {
    const section = window.location.hash.replace("#", "") as WorkspaceSection;
    return section in workspaceSectionMeta ? section : "inbox";
  };
  const [activeSection, setActiveSection] = useState<WorkspaceSection>(
    getSectionFromHash,
  );
  const getSidebarViewport = () =>
    window.innerWidth < 768
      ? "mobile"
      : window.innerWidth < 1536
        ? "compact"
        : "wide";
  const [sidebarOpen, setSidebarOpen] = useState(
    () => getSidebarViewport() !== "compact",
  );
  const sidebarViewportRef = useRef(getSidebarViewport());
  useEffect(() => {
    const handleSidebarViewportChange = () => {
      const nextViewport = getSidebarViewport();
      if (nextViewport === sidebarViewportRef.current) return;

      sidebarViewportRef.current = nextViewport;
      setSidebarOpen(nextViewport !== "compact");
    };

    window.addEventListener("resize", handleSidebarViewportChange);
    return () => window.removeEventListener("resize", handleSidebarViewportChange);
  }, []);
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
  const [liveAudit, setLiveAudit] = useState<Record<string, AuditEntry[]>>({});
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
  const selected =
    cases.find((item) => item.id === selectedId) ?? cases[0] ?? initialCases[0];
  const selectedRoute = routeDisplayFor(selected);
  const selectedRouteData = selectedRoute.data;
  const detail = scenarioDetails[selected.id] ?? fallbackScenario(selected);
  const hasResponseOptions = detail.actions.length > 0;
  const auditEntries: AuditEntry[] = [
    ...(liveAudit[selected.id] ?? []).slice().reverse(),
    ...detail.audit,
  ];
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
    const actionName =
      detail.actions.find((action) => action.id === actionId)?.name ?? actionId;
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
      recordAudit(
        selected.id,
        requiresSignoff
          ? `Requested manager sign-off for ${actionName}`
          : `Approved ${actionName} and started monitoring`,
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
      recordAudit(selected.id, "Manager sign-off recorded; monitoring started");
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
      recordAudit(
        selected.id,
        "Recorded a verified update after reopening monitoring",
      );
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
    recordAudit(selected.id, "Recorded verified update; closure review is ready");
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
    recordAudit(selected.id, "Reopened monitoring for reassessment");
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
      recordAudit(selected.id, "Closed exception after closure criteria were confirmed");
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
    if (selected.owner === owner) return;
    setCases((currentCases) =>
      currentCases.map((item) =>
        item.id === selected.id ? { ...item, owner } : item,
      ),
    );
    recordAudit(selected.id, `Assigned exception to ${owner}`);
  };
  const recordAudit = (caseId: string, label: string, actor = "user/sourav") => {
    const time = new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date());
    setLiveAudit((current) => ({
      ...current,
      [caseId]: [...(current[caseId] ?? []), [time, label, actor]],
    }));
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
              `${routeDisplayFor(item).from} ${routeDisplayFor(item).to}`,
              impactText(item.impact),
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
      ...cases.flatMap((item) => {
        const route = routeDisplayFor(item);
        return [route.from, route.to];
      }),
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
      route: resolveRouteData(id, `${from} → ${to}`),
      detail: newImpact.trim() || "Impact assessment pending",
      impact: { headline: newImpact.trim() || "Impact assessment pending" },
      time: "now",
      owner: "Unassigned",
      confidence: { level: "unknown" },
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
  const openCaseDetails = (item: ExceptionCase, tab?: string) => {
    setSelectedId(item.id);
    setDrawerOpen(true);
    resetResolution(item.status ?? "awaiting", item.approvedActionId ?? null);
    if (tab) setActiveTab(tab);
  };
  const inboxColumns: ResponsiveTableColumn<ExceptionCase>[] = [
    {
      id: "id",
      header: "ID",
      render: (item) => <span className="font-mono text-xs text-muted-foreground">{item.id}</span>,
    },
    {
      id: "priority",
      header: "Priority",
      render: (item) => <Badge variant={priorityVariant[item.priority]}>{item.priority} · {priorityLabel[item.priority]}</Badge>,
    },
    {
      id: "exception",
      header: "Exception",
      cellClassName: "min-w-56",
      render: (item) => (
        <div>
          <p className="font-medium">{item.title}</p>
          <p className="text-xs text-muted-foreground">
            {item.snoozedUntil && item.snoozedUntil > Date.now()
              ? "Snoozed until tomorrow"
              : statusLabel[item.status ?? "awaiting"]}
          </p>
        </div>
      ),
    },
    {
      id: "route",
      header: "Route",
      cellClassName: "min-w-44",
      render: (item) => {
        const route = routeDisplayFor(item);
        return (
          <div className="flex items-center gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full border bg-muted text-muted-foreground">
              <HugeiconsIcon icon={routeModeIcon[route.data.mode]} className="size-5" strokeWidth={2} />
            </div>
            <div className="space-y-0.5 text-xs">
              <p><span className="mr-1 text-muted-foreground">From</span><span className="font-medium">{route.from}</span></p>
              <p><span className="mr-1 text-muted-foreground">To</span><span className="font-medium">{route.to}</span></p>
            </div>
          </div>
        );
      },
    },
    {
      id: "impact",
      header: "Impact",
      cellClassName: "min-w-44 text-sm",
      render: (item) => (
        <div>
          <p className="font-medium">{item.impact.headline}</p>
          {item.impact.detail && <p className="text-xs text-muted-foreground">{item.impact.detail}</p>}
        </div>
      ),
    },
    {
      id: "confidence",
      header: "Confidence",
      headClassName: "hidden xl:table-cell",
      cellClassName: "hidden xl:table-cell",
      render: (item) => <Badge variant="outline">{confidenceText(item.confidence)}</Badge>,
    },
    {
      id: "owner",
      header: "Owner",
      headClassName: "hidden 2xl:table-cell",
      cellClassName: "hidden 2xl:table-cell",
      render: (item) => item.owner,
    },
    {
      id: "actions",
      header: "",
      headClassName: "w-12",
      hideOnMobile: true,
      render: (item) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label={`Actions for ${item.id}`}>
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => openCaseDetails(item)}>Show details</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => openCaseDetails(item, "audit")}>View history</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <TooltipProvider>
      <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen} className="overflow-x-hidden">
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
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-auto w-full justify-between rounded-2xl px-3 py-3 text-sm font-semibold tracking-tight"
                            >
                              <span>Status</span>
                              <HugeiconsIcon
                                icon={ChevronRightIcon}
                                className={`size-4 text-muted-foreground transition-transform ${statusFilterOpen ? "rotate-90" : ""}`}
                                strokeWidth={2}
                              />
                            </Button>
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
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-auto w-full justify-between rounded-2xl px-3 py-3 text-sm font-semibold tracking-tight"
                            >
                              <span>Priority</span>
                              <HugeiconsIcon
                                icon={ChevronRightIcon}
                                className={`size-4 text-muted-foreground transition-transform ${priorityFilterOpen ? "rotate-90" : ""}`}
                                strokeWidth={2}
                              />
                            </Button>
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
                <ResponsiveDataTable
                  rows={paginatedCases}
                  columns={inboxColumns}
                  getRowId={(item) => item.id}
                  getRowProps={(item) => ({
                    "data-state": item.id === selectedId ? "selected" : undefined,
                  })}
                  renderMobileActions={(item) => (
                    <Button variant="outline" className="w-full" onClick={() => openCaseDetails(item)}>
                      View exception details
                    </Button>
                  )}
                />
                  <div className="mt-4 flex items-center justify-between gap-4 px-4 py-3 text-sm text-muted-foreground sm:mt-0">
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
                </>
              ) : (
                <ComingSoonPage
                  title={workspaceSectionMeta[activeSection].title}
                  description={workspaceSectionMeta[activeSection].description}
                />
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
              <SheetContent className="flex w-full! max-w-[100vw] min-w-0 flex-col gap-0 p-0 sm:max-w-2xl">
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="flex min-h-0 flex-1 flex-col"
                >
                  <SheetHeader className="gap-0 border-b border-border/70 p-0">
                    <div className="flex min-w-0 items-start justify-between gap-4 px-4 pt-4 pb-4 sm:px-6 sm:pt-6 sm:pb-5">
                      <div className="min-w-0 pr-9 sm:pr-10">
                        <div className="mb-3 flex flex-wrap gap-1.5 sm:gap-2">
                          <Badge variant={priorityVariant[selected.priority]}>
                            {selected.priority} ·{" "}
                            {priorityLabel[selected.priority]}
                          </Badge>
                          <Badge variant="outline">
                            {confidenceText(selected.confidence)}
                          </Badge>
                        </div>
                        <SheetTitle className="break-words text-xl font-semibold leading-tight tracking-tight sm:text-2xl">
                          {selected.title}
                        </SheetTitle>
                        <div className="mt-1 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-sm leading-5 text-muted-foreground sm:text-base sm:leading-6">
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
                            selectedId={selected.id}
                            routeData={selectedRouteData}
                          />
                        </div>
                        <div className="mt-3 flex items-center gap-3">
                          <span className="text-sm text-muted-foreground">
                            Assigned to
                          </span>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                type="button"
                                variant="secondary"
                                size="xs"
                                className="rounded-3xl"
                                aria-label={`Assign exception, currently assigned to ${selected.owner}`}
                              >
                                {selected.owner}
                                <HugeiconsIcon
                                  icon={UnfoldMoreIcon}
                                  className="ml-1 size-3.5 text-muted-foreground"
                                  strokeWidth={2}
                                />
                              </Button>
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
                      </div>
                    </div>
                    <TabsList
                      variant="line"
                      className="flex h-12 w-full justify-start gap-0 overflow-x-auto rounded-none border-b-0 bg-transparent px-1 py-0 text-sm sm:px-3"
                    >
                      <TabsTrigger
                        value="decision"
                        className="shrink-0"
                        onClick={() => setActiveTab("decision")}
                      >
                        Decision
                      </TabsTrigger>
                      <TabsTrigger
                        value="evidence"
                        className="shrink-0"
                        onClick={() => setActiveTab("evidence")}
                      >
                        Evidence{" "}
                        <Badge variant="secondary">
                          {detail.sources}
                        </Badge>
                      </TabsTrigger>
                      <TabsTrigger
                        value="timeline"
                        className="shrink-0"
                        onClick={() => setActiveTab("timeline")}
                      >
                        Timeline
                      </TabsTrigger>
                      <TabsTrigger
                        value="audit"
                        className="shrink-0"
                        onClick={() => setActiveTab("audit")}
                      >
                        Audit
                      </TabsTrigger>
                    </TabsList>
                  </SheetHeader>
                  <ScrollArea className="flex-1">
                    <div className="space-y-6 p-4 sm:p-6">
                      <div className="flex min-w-0 items-start gap-3 rounded-lg border bg-muted/30 p-4">
                        <div className="rounded-md bg-primary p-2 text-primary-foreground">
                          <Sparkles className="size-4" />
                        </div>
                        <div className="min-w-0 flex-1">
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
                            <div className="flex flex-col items-start justify-between gap-3 sm:flex-row">
                              <div className="min-w-0">
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
                                  onClick={() => setActiveTab("evidence")}
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
                                <span className="text-primary">
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
                                      <Badge variant="default">
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
                              <InlineEmptyState
                                icon={<FileText className="size-4" />}
                                title="No response is available yet"
                                description="We need more verified evidence before a recovery path can be recommended. Check Evidence for the missing signal or keep monitoring this exception."
                              />
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
                                                ? "secondary"
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
                                          className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-border bg-muted p-3 text-xs text-muted-foreground"
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
                                                        ? "secondary"
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
                                                    onClick={() =>
                                                      recordAudit(
                                                        selected.id,
                                                        `Overrode AI recommendation: ${overrideReason.trim() || "No reason provided"}`,
                                                      )
                                                    }
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
                              ? "gap-0 rounded-xl border bg-card py-0 shadow-none ring-0"
                              : "motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-2 motion-safe:duration-500 motion-safe:ease-out motion-reduce:animate-none"
                          }
                        >
                          <CardHeader
                            className={
                              resolutionStage === "awaiting"
                                ? "gap-0 px-4 py-4"
                                : "gap-0"
                            }
                          >
                            <div className="flex items-center justify-between gap-4">
                              <div>
                                <CardDescription>
                                  {resolutionStage === "awaiting"
                                    ? "03 / Resolution not started"
                                    : "03 / Resolution progress"}
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
                                      ? "secondary"
                                      : resolutionStage === "ready"
                                        ? "default"
                                        : resolutionStage === "closed"
                                          ? "secondary"
                                          : "default"
                                }
                              >
                                {resolutionStage === "awaiting"
                                  ? hasResponseOptions
                                    ? "Needs decision"
                                    : "Needs evidence"
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
                          {resolutionStage === "awaiting" && (
                            <CardContent className="flex items-center justify-start gap-2 border-t bg-muted/30 px-4 py-4 text-sm text-muted-foreground">
                              <HugeiconsIcon
                                icon={InformationCircleIcon}
                                strokeWidth={2}
                                className="size-4 shrink-0"
                              />
                              <span>
                                {hasResponseOptions
                                  ? "Select a response above to start resolution"
                                  : "Waiting for verified evidence before a recovery response can be recommended"}
                              </span>
                            </CardContent>
                          )}
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
                              <InlineEmptyState
                                icon={<ShieldCheck className="size-4" />}
                                title="No verified evidence available"
                                description="Evidence will appear here when operational signals or partner confirmations are received."
                              />
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
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            {auditEntries.length > 0 ? (
                              <div className="divide-y overflow-hidden rounded-xl border bg-background">
                                {auditEntries.map(([time, label, actor]) => {
                                  const auditIcon = auditIconForLabel(label);

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
                              <InlineEmptyState
                                icon={
                                  <HugeiconsIcon
                                    icon={Activity01Icon}
                                    className="size-4"
                                    strokeWidth={2}
                                    aria-hidden="true"
                                  />
                                }
                                title="No audit records yet"
                                description="Decision and action history will appear here after the first action is recorded."
                              />
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

export default App;
