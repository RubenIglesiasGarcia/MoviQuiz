// A failed claim costs at most 100 points, without creating negative balances.
export const BUZZER_PENALTY=100;
export function buzzerPenalty(score){return Math.min(BUZZER_PENALTY,Math.max(0,Number(score)||0));}
