/**
 * Browser-side Blackjack engine, ported from the one in Winstonnub/blackjackRL
 * so the rules here match exactly what the agents were trained against:
 * Gymnasium Blackjack-v1 with sab=True.
 *
 * - Infinite deck, cards drawn uniformly from 1-13, face cards count 10
 * - Dealer hits until their total reaches 17
 * - An ace counts as 11 whenever that does not bust the hand
 */

export type Action = 0 | 1; // 0 = stand, 1 = hit

/** [player total, dealer upcard, usable ace] — the agent's state. */
export type Observation = readonly [number, number, boolean];

export type HandState = {
  readonly playerCards: readonly number[];
  readonly dealerCards: readonly number[];
  readonly obs: Observation;
  readonly terminated: boolean;
  readonly reward: number;
};

const drawCard = (random: () => number): number =>
  Math.min(Math.floor(random() * 13) + 1, 10);

const handValue = (cards: readonly number[]): { total: number; usableAce: boolean } => {
  const base = cards.reduce((sum, card) => sum + card, 0);
  // Only one ace can ever be worth 11 without busting.
  if (cards.includes(1) && base + 10 <= 21) {
    return { total: base + 10, usableAce: true };
  }
  return { total: base, usableAce: false };
};

const isBust = (cards: readonly number[]): boolean => handValue(cards).total > 21;

export const newHand = (random: () => number = Math.random): HandState => {
  const playerCards = [drawCard(random), drawCard(random)];
  const dealerCards = [drawCard(random), drawCard(random)];
  const { total, usableAce } = handValue(playerCards);

  return {
    playerCards,
    dealerCards,
    obs: [total, dealerCards[0], usableAce],
    terminated: false,
    reward: 0,
  };
};

/** Applies an action and returns a new state; the input is never mutated. */
export const step = (
  state: HandState,
  action: Action,
  random: () => number = Math.random,
): HandState => {
  if (state.terminated) return state;

  if (action === 1) {
    const playerCards = [...state.playerCards, drawCard(random)];
    const { total, usableAce } = handValue(playerCards);
    const bust = isBust(playerCards);

    return {
      ...state,
      playerCards,
      obs: [total, state.obs[1], usableAce],
      terminated: bust,
      reward: bust ? -1 : 0,
    };
  }

  // Stand: the dealer draws to 17, then hands are compared.
  const dealerCards = [...state.dealerCards];
  while (handValue(dealerCards).total < 17) {
    dealerCards.push(drawCard(random));
  }

  const playerTotal = handValue(state.playerCards).total;
  const dealerTotal = handValue(dealerCards).total;
  const dealerBusted = dealerTotal > 21;

  let reward = 0;
  if (dealerBusted || playerTotal > dealerTotal) reward = 1;
  else if (playerTotal < dealerTotal) reward = -1;

  return { ...state, dealerCards, terminated: true, reward };
};

export const totalOf = (cards: readonly number[]): number => handValue(cards).total;

/** Q-tables are keyed "playerTotal,dealerUpcard,usableAce" -> [Q(stand), Q(hit)]. */
export type QTable = Record<string, [number, number]>;

export type PolicyModel = {
  model_id: string;
  name: string;
  algorithm: string;
  episodes: number;
  trained_at: string;
  benchmarks: {
    win_rate: number;
    loss_rate: number;
    draw_rate: number;
    avg_reward: number;
    house_edge_percent: number;
  };
  q_table: QTable;
};

export const observationKey = (obs: Observation): string =>
  `${obs[0]},${obs[1]},${obs[2] ? 1 : 0}`;

export type Recommendation = {
  action: Action;
  qStand: number;
  qHit: number;
  /** False when the state was never visited during training. */
  known: boolean;
};

/** What the trained agent would do in this state, and how strongly. */
export const recommend = (model: PolicyModel, obs: Observation): Recommendation => {
  const entry = model.q_table[observationKey(obs)];
  if (!entry) {
    // Unvisited state. Mirror the usual fallback: stand on 17+.
    return { action: obs[0] >= 17 ? 0 : 1, qStand: 0, qHit: 0, known: false };
  }
  const [qStand, qHit] = entry;
  return { action: qHit > qStand ? 1 : 0, qStand, qHit, known: true };
};
