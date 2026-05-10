import type { Player } from "@/types/player";
import { Trophy, Crown, Shield } from "lucide-react";

export function PlayerHeader({ player }: { player: Player }) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl border border-border bg-card/60 p-5 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Spieler
        </div>
        <div className="mt-1 flex items-center gap-2">
          <h2 className="text-2xl font-bold text-foreground">{player.name}</h2>
          <span className="text-sm text-muted-foreground">{player.tag}</span>
        </div>
        {player.clan?.name && (
          <div className="mt-1 text-sm text-muted-foreground">Clan: {player.clan.name}</div>
        )}
      </div>
      <div className="mt-4 flex flex-wrap gap-3 sm:mt-0">
        <Stat icon={<Trophy className="h-4 w-4 text-accent" />} label="Trophäen" value={player.trophies.toLocaleString("de-DE")} />
        <Stat icon={<Crown className="h-4 w-4 text-primary" />} label="Level" value={String(player.expLevel)} />
        {player.arena?.name && (
          <Stat icon={<Shield className="h-4 w-4 text-muted-foreground" />} label="Arena" value={player.arena.name} />
        )}
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-border bg-secondary/40 px-3 py-2">
      {icon}
      <div className="leading-tight">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="text-sm font-semibold text-foreground">{value}</div>
      </div>
    </div>
  );
}