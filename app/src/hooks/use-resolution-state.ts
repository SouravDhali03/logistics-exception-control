import { useState } from "react";
import type { ResolutionStage } from "@/app-model";

export type ClosureCriteria = {
  milestone: boolean;
  action: boolean;
  risk: boolean;
  alerts: boolean;
};

const emptyClosureCriteria: ClosureCriteria = {
  milestone: false,
  action: false,
  risk: false,
  alerts: false,
};

export function useResolutionState() {
  const [stage, setStage] = useState<ResolutionStage>("awaiting");
  const [activeTab, setActiveTab] = useState("decision");
  const [approvedActionId, setApprovedActionId] = useState<string | null>(null);
  const [isResolving, setIsResolving] = useState(false);
  const [closureOpen, setClosureOpen] = useState(false);
  const [closureCriteria, setClosureCriteria] =
    useState<ClosureCriteria>(emptyClosureCriteria);
  const [overrideReason, setOverrideReason] = useState(
    "Customer relationship or operational context changes the preferred response.",
  );
  const [signoffAcknowledged, setSignoffAcknowledged] = useState(false);

  const resetResolution = (
    nextStage: ResolutionStage = "awaiting",
    nextActionId: string | null = null,
  ) => {
    setIsResolving(false);
    setStage(nextStage);
    setApprovedActionId(nextActionId);
    setActiveTab("decision");
    setClosureOpen(false);
    setClosureCriteria(emptyClosureCriteria);
  };

  return {
    resolutionStage: stage,
    setResolutionStage: setStage,
    activeTab,
    setActiveTab,
    approvedActionId,
    setApprovedActionId,
    isResolving,
    setIsResolving,
    closureOpen,
    setClosureOpen,
    closureCriteria,
    setClosureCriteria,
    overrideReason,
    setOverrideReason,
    signoffAcknowledged,
    setSignoffAcknowledged,
    resetResolution,
  };
}
