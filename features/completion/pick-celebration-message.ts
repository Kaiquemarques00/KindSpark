import { copy } from '@/constants/copy';

export function pickCelebrationMessage(actionDate: string): string {
  const messages = copy.completion.messages;
  let hash = 0;

  for (let i = 0; i < actionDate.length; i += 1) {
    hash = (hash * 31 + actionDate.charCodeAt(i)) >>> 0;
  }

  return messages[hash % messages.length];
}
