import type { AchievementBadgeState } from '@/components/ui/AchievementBadge';
import { STREAK_MILESTONES } from '@/lib/streak/milestones';

export function getAchievementState(
  streak: number,
  days: (typeof STREAK_MILESTONES)[number],
  nextMilestone: number | null,
): AchievementBadgeState {
  if (streak >= days) return 'completed';
  if (nextMilestone === days) return 'active';
  return 'locked';
}
