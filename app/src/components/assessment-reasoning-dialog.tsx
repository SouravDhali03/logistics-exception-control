import { HugeiconsIcon } from "@hugeicons/react";
import { InformationCircleIcon } from "@hugeicons/core-free-icons";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type AssessmentDetail = {
  sources: string;
  confidence: string;
  gap: string;
};

export function AssessmentReasoningDialog({ detail }: { detail: AssessmentDetail }) {
  return (
    <AlertDialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8 shrink-0 rounded-full text-muted-foreground hover:text-foreground" aria-label="How was this determined?">
              <HugeiconsIcon icon={InformationCircleIcon} className="size-4" strokeWidth={2} />
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
            The assessment joins operational events, service commitments, and historical context. It separates verified events from AI inference and open data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-3 rounded-lg bg-muted p-4 text-sm">
          <p className="font-medium">Current support</p>
          <p className="text-muted-foreground">{detail.sources} verified sources support this assessment. Confidence is {detail.confidence}; it is not a guarantee.</p>
          <p className="text-muted-foreground"><span className="font-medium text-foreground">Open information:</span>{" "}{detail.gap}</p>
        </div>
        <AlertDialogFooter><AlertDialogAction>Done</AlertDialogAction></AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
