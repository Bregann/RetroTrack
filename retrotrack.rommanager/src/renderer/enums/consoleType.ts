export enum ConsoleType {
  Nintendo = 0,
  Sony = 1,
  Atari = 2,
  Sega = 3,
  NEC = 4,
  SNK = 5,
  Other = 6,
  NotSet = 7,
}

const ICONS: Record<number, string> = {
  [ConsoleType.Nintendo]: '🎮',
  [ConsoleType.Sony]: '🎲',
  [ConsoleType.Sega]: '🎯',
  [ConsoleType.Atari]: '🕹️',
  [ConsoleType.NEC]: '💿',
  [ConsoleType.SNK]: '🃏',
  [ConsoleType.Other]: '🖥️',
  [ConsoleType.NotSet]: '🖥️',
};

export function getConsoleTypeIcon(consoleType: number): string {
  return ICONS[consoleType] ?? '🖥️';
}
