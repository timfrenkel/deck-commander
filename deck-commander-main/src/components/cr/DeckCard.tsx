import type { ScoredDeck } from "@/types/deck";
import { cardIconUrl } from "@/utils/normalizeCards";
import { ChevronUp, Sparkles, Sword, Shield, Scale } from "lucide-react";

const STYLE_META: Record<
  string,
  { label: string; icon: React.ReactNode; color: string; ring: string }
> = {
  aggressive: {
    label: "Aggressiv",
    icon: <Sword className="h-4 w-4" />,
    color: "text-[oklch(0.7_0.2_25)]",
    ring: "hover:ring-[oklch(0.7_0.2_25_/_0.35)]",
  },
  defensive: {
    label: "Defensiv",
    icon: <Shield className="h-4 w-4" />,
    color: "text-[oklch(0.7_0.16_220)]",
    ring: "hover:ring-[oklch(0.7_0.16_220_/_0.35)]",
  },
  balanced: {
    label: "Balanced",
    icon: <Scale className="h-4 w-4" />,
    color: "text-[oklch(0.78_0.16_140)]",
    ring: "hover:ring-[oklch(0.78_0.16_140_/_0.35)]",
  },
};

export function DeckCard({ deck }: { deck: ScoredDeck }) {
  const meta = STYLE_META[deck.style];
  return (
    <article
      className={`group relative flex flex-col gap-5 rounded-3xl border border-border bg-card/80 p-6 shadow-[var(--shadow-card)] backdrop-blur transition-all hover:-translate-y-0.5 hover:ring-2 ${meta.ring}`}
    >
      <header className="flex items-start justify-between gap-3">
        <div>
          <div className={`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest ${meta.color}`}>
            {meta.icon}
            {meta.label}
          </div>
          <h3 className="mt-1 text-xl font-bold text-foreground">{deck.name}</h3>
        </div>
        <ScoreBadge score={deck.finalScore} />
      </header>

      <div className="grid grid-cols-4 gap-2">
        {deck.cards.map((card) => (
          <div
            key={card}
            className="relative flex aspect-[3/4] items-end overflow-hidden rounded-lg border border-border bg-secondary/40"
            title={card}
          >
            <img
              src={cardIconUrl(card)}
              alt={card}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-contain p-1"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
            <div className="relative z-10 w-full bg-gradient-to-t from-black/80 to-transparent px-1 py-0.5 text-[9px] font-medium leading-tight text-white">
              {card}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <Metric label="Ø Kartenlevel" value={deck.averagePlayerLevel ? deck.averagePlayerLevel.toFixed(1) : "—"} />
        <Metric label="Empfohlen" value={`Lvl ${deck.averageRecommendedLevel}`} />
        <Metric label="Schwierigkeit" value={"★".repeat(deck.difficulty) + "☆".repeat(5 - deck.difficulty)} />
        <Metric label="Win Rate" value={`${deck.metaWinRate.toFixed(1)}%`} />
      </div>

      <p className="text-sm leading-relaxed text-muted-foreground">{deck.description}</p>

      <Section title="Spielweise">
        <p className="text-sm text-foreground/90">{deck.playstyle}</p>
      </Section>

      <div className="grid gap-4 sm:grid-cols-2">
        <BulletList title="Stärken" items={deck.strengths} tone="positive" />
        <BulletList title="Schwächen" items={deck.weaknesses} tone="negative" />
        <BulletList title="Gut gegen" items={deck.goodAgainst} tone="positive" />
        <BulletList title="Schwach gegen" items={deck.badAgainst} tone="negative" />
      </div>

      <Section title="Upgrade Priorität">
        <ol className="space-y-1 text-sm">
          {deck.upgradePriority.map((c, i) => (
            <li key={c} className="flex items-center gap-2 text-foreground/90">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-[10px] font-bold text-primary">
                {i + 1}
              </span>
              <ChevronUp className="h-3.5 w-3.5 text-accent" /> {c}
            </li>
          ))}
        </ol>
      </Section>
    </article>
  );
}

function ScoreBadge({ score }: { score: number }) {
  return (
    <div className="flex flex-col items-end">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Score</div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-extrabold tabular-nums text-foreground">
          {Math.round(score)}
        </span>
        <Sparkles className="h-3.5 w-3.5 text-accent" />
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-secondary/30 px-3 py-2">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="text-sm font-semibold text-foreground">{value}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        {title}
      </div>
      {children}
    </div>
  );
}

function BulletList({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "positive" | "negative";
}) {
  const dot = tone === "positive" ? "bg-[oklch(0.78_0.16_140)]" : "bg-[oklch(0.7_0.2_25)]";
  return (
    <div>
      <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        {title}
      </div>
      <ul className="space-y-1 text-sm">
        {items.map((it) => (
          <li key={it} className="flex items-start gap-2 text-foreground/90">
            <span className={`mt-1.5 inline-block h-1.5 w-1.5 rounded-full ${dot}`} />
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}