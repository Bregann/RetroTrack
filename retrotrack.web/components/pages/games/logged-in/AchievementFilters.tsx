import { Group, Checkbox } from '@mantine/core'

interface AchievementFiltersProps {
  hideUnlocked: boolean
  showProgressionOnly: boolean
  showMissableOnly: boolean
  onHideUnlockedChange: (_checked: boolean) => void
  onShowProgressionOnlyChange: (_checked: boolean) => void
  onShowMissableOnlyChange: (_checked: boolean) => void
}

export function AchievementFilters({
  hideUnlocked,
  showProgressionOnly,
  showMissableOnly,
  onHideUnlockedChange,
  onShowProgressionOnlyChange,
  onShowMissableOnlyChange,
}: AchievementFiltersProps) {
  return (
    <Group>
      <Checkbox
        label="Hide Unlocked Achievements"
        checked={hideUnlocked}
        onChange={(e) => onHideUnlockedChange(e.currentTarget.checked)}
      />
      <Checkbox
        label="Show Progression Achievements Only"
        checked={showProgressionOnly}
        onChange={(e) => onShowProgressionOnlyChange(e.currentTarget.checked)}
      />
      <Checkbox
        label="Show Missable Achievements Only"
        checked={showMissableOnly}
        onChange={(e) => onShowMissableOnlyChange(e.currentTarget.checked)}
      />
    </Group>
  )
}
