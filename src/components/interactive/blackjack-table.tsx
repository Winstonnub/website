"use client";

import { useCallback, useEffect, useState } from "react";
import {
  newHand,
  recommend,
  step,
  totalOf,
  type HandState,
  type PolicyModel,
} from "@/lib/blackjack";
import { cn } from "@/lib/utils";

type ModelMeta = {
  model_id: string;
  name: string;
  benchmarks: { house_edge_percent: number; win_rate: number };
};

type Tally = { played: number; won: number; lost: number; drawn: number };

const EMPTY_TALLY: Tally = { played: 0, won: 0, lost: 0, drawn: 0 };

const CARD_LABEL = ["", "A", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

function Card({ value, hidden = false }: { value: number; hidden?: boolean }) {
  return (
    <span
      className={cn(
        "mono inline-flex h-12 w-9 items-center justify-center rounded-md border text-sm font-medium",
        hidden
          ? "border-border bg-muted text-transparent"
          : "border-border bg-card text-foreground",
      )}
    >
      {hidden ? "?" : CARD_LABEL[value]}
    </span>
  );
}

/**
 * Plays a hand against the policies trained in Winstonnub/blackjackRL. The
 * Q-tables are the real exported artefacts, so the advice shown here is what
 * the agent actually learned over a million episodes.
 */
export default function BlackjackTable() {
  const [models, setModels] = useState<ModelMeta[]>([]);
  const [modelId, setModelId] = useState("expected_sarsa");
  const [policy, setPolicy] = useState<PolicyModel | null>(null);
  const [hand, setHand] = useState<HandState | null>(null);
  const [tally, setTally] = useState<Tally>(EMPTY_TALLY);
  const [revealed, setRevealed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/models/blackjack/index.json")
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status));
        return res.json();
      })
      .then((data: ModelMeta[]) => {
        if (!cancelled) setModels(data);
      })
      .catch(() => {
        if (!cancelled) setError("Could not load the model list.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // `policy` is cleared by the select handler, which is the only thing that
  // changes `modelId`; clearing it here would cascade an extra render.
  useEffect(() => {
    let cancelled = false;
    fetch(`/models/blackjack/${modelId}.json`)
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status));
        return res.json();
      })
      .then((data: PolicyModel) => {
        if (!cancelled) {
          setPolicy(data);
          setError(null);
        }
      })
      .catch(() => {
        if (!cancelled) setError("Could not load that policy.");
      });
    return () => {
      cancelled = true;
    };
  }, [modelId]);

  const deal = useCallback(() => {
    setHand(newHand());
    setRevealed(false);
  }, []);

  const act = useCallback(
    (action: 0 | 1) => {
      setHand((current) => {
        if (!current || current.terminated) return current;
        const next = step(current, action);
        if (next.terminated) {
          setTally((t) => ({
            played: t.played + 1,
            won: t.won + (next.reward > 0 ? 1 : 0),
            lost: t.lost + (next.reward < 0 ? 1 : 0),
            drawn: t.drawn + (next.reward === 0 ? 1 : 0),
          }));
        }
        return next;
      });
    },
    [],
  );

  const meta = models.find((m) => m.model_id === modelId);
  const advice = policy && hand && !hand.terminated ? recommend(policy, hand.obs) : null;
  const playerTotal = hand ? totalOf(hand.playerCards) : 0;
  const dealerTotal = hand ? totalOf(hand.dealerCards) : 0;

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-border bg-card/40 p-5 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="bj-model" className="eyebrow">
            Opponent policy
          </label>
          <select
            id="bj-model"
            value={modelId}
            onChange={(event) => {
              setModelId(event.target.value);
              setPolicy(null);
              setHand(null);
              setTally(EMPTY_TALLY);
            }}
            className="mono rounded-lg border border-border bg-background px-3 py-2 text-[12px] text-foreground"
          >
            {models.map((model) => (
              <option key={model.model_id} value={model.model_id}>
                {model.name}
              </option>
            ))}
          </select>
        </div>

        {meta && (
          <dl className="flex gap-5">
            <div>
              <dt className="mono text-[10px] uppercase tracking-wider text-muted-foreground">
                House edge
              </dt>
              <dd className="mono text-lg text-primary">
                {meta.benchmarks.house_edge_percent}%
              </dd>
            </div>
            <div>
              <dt className="mono text-[10px] uppercase tracking-wider text-muted-foreground">
                Win rate
              </dt>
              <dd className="mono text-lg text-primary">
                {(meta.benchmarks.win_rate * 100).toFixed(1)}%
              </dd>
            </div>
          </dl>
        )}
      </div>

      {error && (
        <p className="mono rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-[12px] text-destructive">
          {error}
        </p>
      )}

      <div className="grid gap-5 rounded-xl border border-border bg-background/60 p-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <span className="eyebrow">
            Dealer{hand?.terminated ? ` · ${dealerTotal}` : ""}
          </span>
          <div className="flex gap-2">
            {hand ? (
              hand.dealerCards.map((card, i) => (
                <Card key={i} value={card} hidden={!hand.terminated && i > 0} />
              ))
            ) : (
              <>
                <Card value={0} hidden />
                <Card value={0} hidden />
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="eyebrow">You{hand ? ` · ${playerTotal}` : ""}</span>
          <div className="flex flex-wrap gap-2">
            {hand ? (
              hand.playerCards.map((card, i) => <Card key={i} value={card} />)
            ) : (
              <>
                <Card value={0} hidden />
                <Card value={0} hidden />
              </>
            )}
          </div>
        </div>
      </div>

      {hand?.terminated && (
        <p
          className={cn(
            "mono rounded-lg border p-3 text-[13px]",
            hand.reward > 0 && "border-primary/40 bg-primary/10 text-primary",
            hand.reward < 0 && "border-border bg-muted/40 text-muted-foreground",
            hand.reward === 0 && "border-border bg-muted/40 text-muted-foreground",
          )}
        >
          {hand.reward > 0 && `You win — ${playerTotal} beats ${dealerTotal}.`}
          {hand.reward < 0 &&
            (playerTotal > 21
              ? `Bust at ${playerTotal}.`
              : `Dealer wins — ${dealerTotal} beats ${playerTotal}.`)}
          {hand.reward === 0 && `Push at ${playerTotal}.`}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        {!hand || hand.terminated ? (
          <button
            type="button"
            onClick={deal}
            disabled={!policy}
            className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-40"
          >
            {hand ? "Next hand" : "Deal"}
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={() => act(1)}
              className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              Hit
            </button>
            <button
              type="button"
              onClick={() => act(0)}
              className="rounded-full border border-border px-5 py-2 text-sm font-medium transition-colors hover:border-primary/50"
            >
              Stand
            </button>
            <button
              type="button"
              onClick={() => setRevealed((r) => !r)}
              className="mono rounded-full border border-border px-4 py-2 text-[12px] text-muted-foreground transition-colors hover:text-foreground"
            >
              {revealed ? "Hide" : "What would the agent do?"}
            </button>
          </>
        )}
      </div>

      {revealed && advice && (
        <div className="mono flex flex-wrap items-center gap-x-5 gap-y-1 rounded-lg border border-primary/30 bg-primary/5 p-3 text-[12px]">
          <span className="text-primary">
            Agent says: {advice.action === 1 ? "HIT" : "STAND"}
          </span>
          {advice.known ? (
            <>
              <span className="text-muted-foreground">
                Q(stand) {advice.qStand.toFixed(3)}
              </span>
              <span className="text-muted-foreground">
                Q(hit) {advice.qHit.toFixed(3)}
              </span>
            </>
          ) : (
            <span className="text-muted-foreground">
              State never seen in training — falling back to stand on 17+.
            </span>
          )}
        </div>
      )}

      <div className="mono flex flex-wrap gap-x-5 gap-y-1 border-t border-border pt-3 text-[11px] text-muted-foreground">
        <span>Hands {tally.played}</span>
        <span>W {tally.won}</span>
        <span>L {tally.lost}</span>
        <span>Push {tally.drawn}</span>
        {tally.played > 0 && (
          <span className="text-primary">
            Your win rate {((tally.won / tally.played) * 100).toFixed(0)}%
          </span>
        )}
      </div>
    </div>
  );
}
