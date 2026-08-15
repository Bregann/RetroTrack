import { HighestAwardKind } from '@/enums/highestAwardKind'
import { Badge } from '@mantine/core'
import {
  IconCrown,
  IconDeviceGamepad,
  IconMedal,
  IconPlayerPlay,
  IconTargetArrow
} from '@tabler/icons-react'
import { ReactNode } from 'react'

/**
 * Single source of truth for how a HighestAwardKind is presented.
 *
 * Before this existed, five components each switched on the enum with their own
 * colours and labels, so the same award rendered differently depending on the
 * page - "Completed" was orange in the games tables but blue on a playlist page,
 * where orange meant "Beaten (Casual)". The colours below are the games-table
 * scheme, which was already used by three of the five.
 *
 * Note the spelling split: the helpers are British to match consoleHelper, but
 * they feed Mantine's `color` prop, which is American by their API.
 */
export default class awardHelper {
  static getAwardColour(award?: HighestAwardKind | null): string {
    switch (award) {
      case HighestAwardKind.Mastered:
        return 'yellow'
      case HighestAwardKind.Completed:
        return 'orange'
      case HighestAwardKind.BeatenHardcore:
        return 'cyan'
      case HighestAwardKind.BeatenSoftcore:
        return 'teal'
      default:
        return 'gray'
    }
  }

  static getAwardIcon(award?: HighestAwardKind | null): ReactNode {
    switch (award) {
      case HighestAwardKind.Mastered:
        return <IconCrown size={16} />
      case HighestAwardKind.Completed:
        return <IconMedal size={16} />
      case HighestAwardKind.BeatenHardcore:
        return <IconTargetArrow size={16} />
      case HighestAwardKind.BeatenSoftcore:
        return <IconPlayerPlay size={16} />
      default:
        return <IconDeviceGamepad size={16} />
    }
  }

  /** "Casual" rather than "Softcore" - the wording used across the navbar and tables */
  static getAwardLabel(award?: HighestAwardKind | null): string {
    switch (award) {
      case HighestAwardKind.Mastered:
        return 'Mastered'
      case HighestAwardKind.Completed:
        return 'Completed'
      case HighestAwardKind.BeatenHardcore:
        return 'Beaten (Hardcore)'
      case HighestAwardKind.BeatenSoftcore:
        return 'Beaten (Casual)'
      default:
        return 'Not Started'
    }
  }

  /**
   * The award badge as used in the games tables. Returns null for an unset or
   * Unknown award so table cells stay empty rather than reading "Not Started".
   */
  static getAwardBadge(award?: HighestAwardKind | null): ReactNode {
    if (award === undefined || award === null || award === HighestAwardKind.Unknown) {
      return null
    }

    return (
      <Badge
        color={awardHelper.getAwardColour(award)}
        variant={award === HighestAwardKind.Mastered ? 'filled' : 'light'}
        style={award === HighestAwardKind.Mastered
          ? { whiteSpace: 'normal', overflow: 'visible' }
          : undefined}
      >
        {awardHelper.getAwardLabel(award)}
      </Badge>
    )
  }
}
