import { AlertTriangle } from "lucide-react";

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-destructive/40 bg-destructive/10 p-4">
      <AlertTriangle className="mt-0.5 h-5 w-5 text-destructive" />
      <div>
        <div className="text-sm font-semibold text-foreground">Analyse fehlgeschlagen</div>
        <div className="mt-1 text-sm text-muted-foreground">{message}</div>
      </div>
    </div>
  );
}