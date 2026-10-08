export const TASK_XP = 25;
export const LEVEL_XP = 100;

export function levelProgress(xp = 0) {
  const totalXp = Number.isSafeInteger(xp) && xp >= 0 ? xp : 0;
  const level = Math.floor(totalXp / LEVEL_XP);
  const currentXp = totalXp % LEVEL_XP;
  return { totalXp, level, nextLevel: level + 1, currentXp, requiredXp: LEVEL_XP, remainingXp: LEVEL_XP - currentXp };
}

export function childProgress(data, childId) {
  // Older families have reward history but no persistent XP counter yet.
  // Use the full history, not the last 100 transactions shown in the UI.
  const stored = data.experience?.[childId];
  const totalXp = Number.isSafeInteger(stored) && stored >= 0
    ? stored
    : data.transactions.filter(t => t.childId === childId && t.type === 'reward').length * TASK_XP;
  return levelProgress(totalXp);
}
