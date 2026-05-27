export type LightAchievementId = 'first_done' | 'streak_7' | 'completed_30';

export type LightAchievement = {
  id: LightAchievementId;
  unlocked: boolean;
};

export function computeLightAchievements(input: {
  totalDone: number;
  currentStreak: number;
  bestStreak: number;
}): LightAchievement[] {
  return [
    { id: 'first_done', unlocked: input.totalDone >= 1 },
    {
      id: 'streak_7',
      unlocked: input.currentStreak >= 7 || input.bestStreak >= 7,
    },
    { id: 'completed_30', unlocked: input.totalDone >= 30 },
  ];
}
