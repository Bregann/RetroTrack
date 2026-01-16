import { Group, Checkbox } from '@mantine/core'

interface PublicAchievementFiltersProps {
  showProgressionOnly: boolean
  showMissableOnly: boolean
  onShowProgressionOnlyChange: (_checked: boolean) => void
  onShowMissableOnlyChange: (_checked: boolean) => void
}

export function PublicAchievementFilters({
  showProgressionOnly,
  showMissableOnly,
  onShowProgressionOnlyChange,
  onShowMissableOnlyChange,
}: PublicAchievementFiltersProps) {
  return (
    <Group>
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
