/** View-model type for a single achievement, mapped from the API response. */
export interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedDate?: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'ultra-rare';
  points: number;
  type?: 'normal' | 'missable' | 'win' | 'progression';
  /** DEBUG: raw type number from API */
  debugType?: number | null;
}
