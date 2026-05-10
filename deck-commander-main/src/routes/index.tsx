import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { analyzePlayerViaApi } from "@/services/apiClient";
import { SearchBar } from "@/components/cr/SearchBar";
import { DeckCard } from "@/components/cr/DeckCard";
import { PlayerHeader } from "@/components/cr/PlayerHeader";
import { LoadingState } from "@/components/cr/LoadingState";
import { ErrorState } from "@/components/cr/ErrorState";
import { AlertTriangle, Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Clash Royale Deck Recommender — 3 personalisierte Decks" },
      {
        name: "description",
        content:
          "Gib deinen Clash Royale Player Tag ein und erhalte sofort 3 personalisierte Deck-Empfehlungen: aggressiv, defensiv, balanced. Kein Account, keine Datenspeicherung.",
      },
      { property: "og:title", content: "Clash Royale Deck Recommender" },
      {
        property: "og:description",
        content:
          "3 personalisierte Decks basierend auf deinen Karten und dem aktuellen Meta.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [submittedTag, setSubmittedTag] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: analyzePlayerViaApi,
  });

  const handleSubmit = (tag: string) => {
    setSubmittedTag(tag);
    mutation.mutate(tag);
  };

  const result = mutation.data;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-4 py-12 sm:py-20">
      <header className="flex flex-col items-center gap-4 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
          <Sparkles className="h-3 w-3 text-accent" />
          Meta-basierte Deck Empfehlungen
        </div>
        <h1 className="max-w-3xl text-balance text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl">
          Dein perfektes Deck — in <span className="text-primary">Sekunden</span>.
        </h1>
        <p className="max-w-xl text-balance text-base text-muted-foreground sm:text-lg">
          Gib deinen Clash Royale Player Tag ein und erhalte 3 personalisierte Deck-Vorschläge,
          basierend auf deinen Karten und dem aktuellen Meta.
        </p>
        <div className="mt-4 flex w-full justify-center">
          <SearchBar
            onSubmit={handleSubmit}
            loading={mutation.isPending}
            initialTag={submittedTag ?? ""}
          />
        </div>
      </header>

      <section className="flex flex-col gap-6">
        {mutation.isPending && <LoadingState />}

        {mutation.isError && (
          <ErrorState
            message={
              mutation.error instanceof Error
                ? mutation.error.message
                : "Unbekannter Fehler. Bitte überprüfe dein Tag und versuche es erneut."
            }
          />
        )}

        {result && (
          <>
            <PlayerHeader player={result.player} />

            {result.usedMock && (
              <div className="flex items-start gap-3 rounded-2xl border border-accent/40 bg-accent/10 p-4">
                <AlertTriangle className="mt-0.5 h-5 w-5 text-accent" />
                <div className="text-sm">
                  <div className="font-semibold text-foreground">Mock-Daten aktiv</div>
                  <div className="text-muted-foreground">
                    {result.warning ?? "Spielerdaten konnten nicht geladen werden."} Die unten gezeigten Decks basieren auf einem Beispiel-Profil.
                  </div>
                </div>
              </div>
            )}

            <div className="grid gap-6 lg:grid-cols-3">
              {result.recommendations.aggressive && (
                <DeckCard deck={result.recommendations.aggressive} />
              )}
              {result.recommendations.defensive && (
                <DeckCard deck={result.recommendations.defensive} />
              )}
              {result.recommendations.balanced && (
                <DeckCard deck={result.recommendations.balanced} />
              )}
            </div>
          </>
        )}

        {!mutation.isPending && !mutation.data && !mutation.isError && (
          <div className="mx-auto max-w-md rounded-2xl border border-dashed border-border bg-card/40 p-6 text-center text-sm text-muted-foreground">
            Tipp: Dein Player Tag findest du in deinem Profil unter dem Spielernamen.
          </div>
        )}
      </section>

      <footer className="mt-auto pt-12 text-center text-xs text-muted-foreground">
        Inoffiziell. Nicht von Supercell unterstützt. Daten via offizieller Clash Royale API.
      </footer>
    </main>
  );
}
