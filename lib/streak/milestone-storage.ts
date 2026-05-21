import AsyncStorage from '@react-native-async-storage/async-storage';

import type { StreakMilestone } from './milestones';

const PREFIX = 'kindspark:milestone-shown:';

function keyForDate(calendarDate: string): string {
  return `${PREFIX}${calendarDate}`;
}

export async function getShownMilestonesToday(
  calendarDate: string,
): Promise<StreakMilestone[]> {
  const raw = await AsyncStorage.getItem(keyForDate(calendarDate));
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((n): n is StreakMilestone =>
      [3, 7, 14, 30].includes(n as number),
    );
  } catch {
    return [];
  }
}

export async function markMilestoneShownToday(
  calendarDate: string,
  milestone: StreakMilestone,
): Promise<void> {
  const shown = await getShownMilestonesToday(calendarDate);
  if (shown.includes(milestone)) return;
  await AsyncStorage.setItem(
    keyForDate(calendarDate),
    JSON.stringify([...shown, milestone]),
  );
}
