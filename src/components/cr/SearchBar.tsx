import { useState, type FormEvent } from "react";
import { Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
  onSubmit: (tag: string) => void;
  loading?: boolean;
  initialTag?: string;
}

export function SearchBar({ onSubmit, loading, initialTag = "" }: Props) {
  const [tag, setTag] = useState(initialTag);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = tag.trim();
    if (trimmed.length < 3) return;
    onSubmit(trimmed);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl">
      <div className="relative flex items-center">
        <Search className="absolute left-4 h-4 w-4 text-muted-foreground" aria-hidden />
        <Input
          aria-label="Clash Royale Player Tag"
          placeholder="#ABC123"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          maxLength={16}
          autoCapitalize="characters"
          spellCheck={false}
          className="h-14 rounded-2xl border-border bg-card pl-11 pr-36 text-base tracking-widest uppercase placeholder:normal-case placeholder:tracking-normal placeholder:text-muted-foreground"
        />
        <Button
          type="submit"
          disabled={loading || tag.trim().length < 3}
          className="absolute right-1.5 h-11 rounded-xl px-5 font-semibold"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Lade
            </>
          ) : (
            "Analyse starten"
          )}
        </Button>
      </div>
      <p className="mt-2 pl-2 text-xs text-muted-foreground">
        Beispiel: #2PP oder 9LJC0VL — kein Account, keine Datenspeicherung.
      </p>
    </form>
  );
}