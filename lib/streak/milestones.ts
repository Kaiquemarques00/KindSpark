export const STREAK_MILESTONES = [3, 7, 14, 30] as const;

export type StreakMilestone = (typeof STREAK_MILESTONES)[number];

const MILESTONE_MESSAGES: Record<StreakMilestone, string> = {
  3: 'Three days of kindness — you’re building a beautiful habit.',
  7: 'One week of kindness — your consistency is inspiring.',
  14: 'Two weeks strong — kindness is becoming part of you.',
  30: '30 days of kindness — that’s a powerful commitment.',
};

export function getMilestoneMessage(days: StreakMilestone): string {
  return MILESTONE_MESSAGES[days];
}

export function getActiveMilestone(streak: number): StreakMilestone | null {
  if ((STREAK_MILESTONES as readonly number[]).includes(streak)) {
    return streak as StreakMilestone;
  }
  return null;
}

export function getNextMilestone(streak: number): StreakMilestone | null {
  for (const m of STREAK_MILESTONES) {
    if (streak < m) return m;
  }
  return null;
}
