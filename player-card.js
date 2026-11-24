// Access is scoped to the finished room; public player IDs are not account IDs.
export function canReadPlayerCard(room,userId,publicId,matchId){if(!userId||room.phase!=='finished'||room.matchId!==matchId||!(room.host===userId||Object.hasOwn(room.players,userId)))return null;return Object.values(room.players).find(p=>p.publicId===publicId)||null;}
export function safeStats(s){return {total:s.total,correct:s.correct,accuracy:s.accuracy,avgMs:s.avgMs,matches:s.matches,wins:s.wins,bestScore:s.bestScore,timeouts:s.timeouts,byCategory:s.byCategory,byDifficulty:s.byDifficulty,byMode:s.byMode};}
