import {
  resolveRouteData,
  type RouteMapData,
} from "@/components/route-map-data";

export type Priority = "P1" | "P2" | "P3";

export type ImpactSummary = {
  headline: string;
  detail?: string;
};

export type ConfidenceSummary = {
  level: "confirmed" | "likely" | "possible" | "unknown";
  score?: number;
};

export type ResolutionStage =
  | "awaiting"
  | "awaiting-signoff"
  | "in-progress"
  | "ready"
  | "closed";

export type ExceptionCase = {
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

export type ExceptionCaseInput = Omit<ExceptionCase, "route"> & {
  route: string;
};

export type RouteDisplay = {
  from: string;
  to: string;
  data: RouteMapData;
};

export type QueueStatusFilter = "active" | "all" | "resolved";

export type ScenarioAction = {
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

export type AuditEntry = [string, string, string];

export type ScenarioDetail = {
  what: string;
  cause: string;
  impact: string;
  gap: string;
  confidence: string;
  sources: string;
  actions: ScenarioAction[];
  audit: AuditEntry[];
};

export const confidenceText = ({ level, score }: ConfidenceSummary) => {
  const label = level[0].toUpperCase() + level.slice(1);
  return score === undefined ? label : `${label} · ${score}%`;
};

export const routeDisplayFor = (
  item: Pick<ExceptionCase, "route">,
): RouteDisplay => ({
  from: item.route.from.label,
  to: item.route.to.label,
  data: item.route,
});

export const routeSearchText = (route: RouteMapData) =>
  [route.from.label, route.from.country, route.to.label, route.to.country]
    .join(" ")
    .toLowerCase();

export const normalizeExceptionCase = (
  item: ExceptionCaseInput,
  routeMode?: Parameters<typeof resolveRouteData>[2],
): ExceptionCase => ({
  ...item,
  route: resolveRouteData(item.id, item.route, routeMode),
});

export const initialCaseInputs: ExceptionCaseInput[] = [
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

export const initialCases = initialCaseInputs.map((item) =>
  normalizeExceptionCase(item),
);
export const assignmentOptions = ["You", "Mina", "Nadia", "Unassigned"] as const;
export const impactText = (impact: ImpactSummary) =>
  [impact.headline, impact.detail].filter(Boolean).join(" · ");
