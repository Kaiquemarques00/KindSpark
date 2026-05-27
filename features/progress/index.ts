export { ProgressScreen } from './ProgressScreen';
export { useProgress } from './useProgress';
export {
  fetchBestStreak,
  fetchCurrentStreak,
  fetchDailyActivity,
  fetchDoneDates,
  fetchTotalDoneCount,
  fetchWeeklyDoneCount,
} from '@/lib/supabase';
export type {
  DailyActivityCell,
  DayActivityStatus,
  WeeklyProgress,
} from '@/lib/supabase';
export { computeBestStreak } from '@/lib/streak/compute-best-streak';
export { computeStreak, addDaysToDateString } from '@/lib/streak/compute-streak';
export {
  computeLightAchievements,
  type LightAchievement,
  type LightAchievementId,
} from '@/lib/streak/light-achievements';
export {
  STREAK_MILESTONES,
  getActiveMilestone,
  getMilestoneMessage,
  getNextMilestone,
} from '@/lib/streak/milestones';
export type { StreakMilestone } from '@/lib/streak/milestones';
