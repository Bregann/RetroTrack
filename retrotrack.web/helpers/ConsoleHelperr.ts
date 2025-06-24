import { ConsoleType } from '@/enums/consoleType'

export default class consoleHelper {
  static getConsoleColour(consoleType: ConsoleType): string {
    switch (consoleType) {
      case ConsoleType.Nintendo:
        return '#e7484a' // Nintendo Red
      case ConsoleType.Sony:
        return '#2559af' // Sony Blue
      case ConsoleType.Atari:
        return '#F68026' // Atari Orange
      case ConsoleType.Sega:
        return '#0095D9' // Sega Blue
      case ConsoleType.NEC:
        return '#FF0000' // NEC Red
      case ConsoleType.SNK:
        return '#000000' // SNK Black
      case ConsoleType.Other:
        return '#836d6d' // Other grey ish
      case ConsoleType.NotSet:
        return '#FFFFFF' // Not Set White
      default:
        return '#000000' // Default to Black for unknown types
    }
  }
}
