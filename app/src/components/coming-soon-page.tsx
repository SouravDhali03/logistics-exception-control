import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function ComingSoonPage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
      <div className="w-full max-w-lg text-center">
        <div className="flex flex-col items-center px-6 py-16">
          <Badge variant="outline" className="mt-6">Coming soon</Badge>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
            {description} will be available here as this workspace grows.
          </p>
          <Button asChild variant="outline" className="mt-6">
            <a href="#inbox">Back to Exception inbox</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
