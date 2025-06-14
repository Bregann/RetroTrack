import { ConsoleType } from '@/enums/consoleType'

export default class ConsoleHelper {
  static getConsoleColour(consoleType: ConsoleType): string {
    switch (consoleType) {
      case ConsoleType.Nintendo:
        return '#E60012' // Nintendo Red
      case ConsoleType.Sony:
        return '#003791' // Sony Blue
      case ConsoleType.Atari:
        return '#F68026' // Atari Orange
      case ConsoleType.Sega:
        return '#0095D9' // Sega Blue
      case ConsoleType.NEC:
        return '#FF0000' // NEC Red
      case ConsoleType.SNK:
        return '#000000' // SNK Black
      case ConsoleType.Other:
        return '#808080' // Other Grey
      case ConsoleType.NotSet:
        return '#FFFFFF' // Not Set White
      default:
        return '#000000' // Default to Black for unknown types
    }
  }
}
