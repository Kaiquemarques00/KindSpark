import type { Ionicons } from '@expo/vector-icons';

export type ActionCategory =
  | 'kindness'
  | 'gratitude'
  | 'health'
  | 'connection'
  | 'mindfulness'
  | 'community'
  | 'environment'
  | 'self-care';

type CategoryVisual = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
};

const CATEGORY_VISUALS: Record<ActionCategory, CategoryVisual> = {
  kindness: { icon: 'heart', label: 'Kindness' },
  gratitude: { icon: 'sunny', label: 'Gratitude' },
  health: { icon: 'fitness', label: 'Health' },
  connection: { icon: 'people', label: 'Connection' },
  mindfulness: { icon: 'leaf', label: 'Mindfulness' },
  community: { icon: 'earth', label: 'Community' },
  environment: { icon: 'water', label: 'Environment' },
  'self-care': { icon: 'sparkles', label: 'Self-care' },
};

const DEFAULT_VISUAL: CategoryVisual = { icon: 'heart', label: 'Kindness' };

/** Maps DB `actions.category` to a consistent icon for the Today action card. */
export function getCategoryVisual(category: string | null | undefined): CategoryVisual {
  if (!category) return DEFAULT_VISUAL;
  const key = category.trim().toLowerCase() as ActionCategory;
  return CATEGORY_VISUALS[key] ?? DEFAULT_VISUAL;
}
