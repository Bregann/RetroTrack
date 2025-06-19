'use client'

// components/GameModal.tsx
import {
  Modal,
  Group,
  Stack,
  Text,
  Card,
  Image,
  ThemeIcon,
  SimpleGrid,
  Textarea,
  Button,
  Divider,
  Progress,
} from '@mantine/core'
import {
  IconTrophy,
  IconStar,
  IconDeviceGamepad,
  IconUsers,
  IconCheck,
} from '@tabler/icons-react'

interface LoggedInGameModalProps {
  gameId?: number
  onClose: () => void
}

export function LoggedInGameModal(props: LoggedInGameModalProps) {

  return (
    <Modal
      opened={props.gameId !== undefined}
      onClose={() => props.onClose()}
      size={'75%'}
      padding="md"
      radius="md"
      title={<Text size="xl" fw={700}>Captain Commando - {props.gameId}</Text>}
    >
      {/* Screenshots */}
      <Group grow gap="md" mb="md">
        {Array(3)
          .fill(0)
          .map((_, idx) => (
            <Image
              key={idx}
              src="https://via.placeholder.com/300x200"
              alt={`Screenshot ${idx + 1}`}
              radius="sm"
            />
          ))}
      </Group>

      <Divider my="sm" label="Summary" labelPosition="center" />

      {/* Summary Cards */}
      <SimpleGrid cols={4} mb="md">
        {/* Achievements */}
        <Card withBorder>
          <Stack align="center" gap={6}>
            <ThemeIcon size="xl" radius="md" color="yellow">
              <IconTrophy size={24} />
            </ThemeIcon>
            <Text fw={700}>48/73 Achievements</Text>
            <Stack gap="xs" justify="center" ta={'center'}>
              <Text size="sm" c="dimmed">73.73% complete</Text>
              <Text size="sm" c="cyan">Softcore: 18</Text>
              <Text size="sm" c="grape">Hardcore: 30</Text>
              <Text size="sm" c="grape">Locked: 30</Text>
            </Stack>
          </Stack>
        </Card>

        {/* Points */}
        <Card withBorder>
          <Stack align="center" gap={6}>
            <ThemeIcon size="xl" radius="md" color="teal">
              <IconStar size={24} />
            </ThemeIcon>
            <Text fw={700}>520/730 Points</Text>
            <Stack gap="xs" justify="center" ta={'center'}>
              <Text size="sm" c="dimmed">73.73% complete</Text>
              <Text size="sm" c="cyan">Softcore: 180</Text>
              <Text size="sm" c="grape">Hardcore: 300</Text>
            </Stack>
          </Stack>
        </Card>

        {/* Game Info */}
        <Card withBorder>
          <Stack gap={6} align="center">
            <ThemeIcon size="xl" radius="md" color="violet">
              <IconDeviceGamepad size={24} />
            </ThemeIcon>
            <Text fw={700}>Game Info</Text>
            <Stack gap={4}>
              <Group gap="6"><IconDeviceGamepad size={16} /> <Text>PlayStation</Text></Group>
              <Group gap="6"><IconStar size={16} /> <Text>Run &amp; Gun</Text></Group>
              <Group gap="6"><IconUsers size={16} /> <Text>4 Players</Text></Group>
            </Stack>
          </Stack>
        </Card>

        {/* Beat Status */}
        <Card withBorder>
          <Stack align="center" gap={6}>
            <ThemeIcon size="xl" radius="md" color="teal">
              <IconCheck size={24} />
            </ThemeIcon>
            <Text fw={700}>Completion State</Text>
            <Stack gap={4}>
              <Group gap="6"><IconDeviceGamepad size={16} /> <Text>Date Beaten:</Text></Group>
              <Text size="sm" c="dimmed" ta={'center'}>2023-10-01</Text>

              <Group gap="6"><IconDeviceGamepad size={16} /> <Text>Date Mastered:</Text></Group>
              <Text size="sm" c="dimmed" ta={'center'}>2023-10-01</Text>
            </Stack>
          </Stack>
        </Card>
      </SimpleGrid>

      <Divider my="sm" label="Achievements" labelPosition="center" />
      <Progress.Root size={20} style={{ marginBottom: '1rem', width: '90%', justifyContent: 'center', marginLeft: 'auto', marginRight: 'auto' }}>
        <Progress.Section value={50} color="cyan">
          <Progress.Label>hardcore</Progress.Label>
        </Progress.Section>
        <Progress.Section value={30} color="pink">
          <Progress.Label>softcore</Progress.Label>
        </Progress.Section>
        <Progress.Section value={20} color="orange">
          <Progress.Label>locked</Progress.Label>
        </Progress.Section>
      </Progress.Root>
      {/* Achievements Grid */}
      <SimpleGrid cols={6} mb="md">

        {Array(12)
          .fill(0)
          .map((_, idx) => (
            <Card key={idx} withBorder radius="sm" p={4}>
              <Image
                src="https://via.placeholder.com/64"
                alt={`Achv ${idx + 1}`}
                radius="sm"
              />
            </Card>
          ))}
      </SimpleGrid>

      {/* Notes Section */}
      <Stack gap="xs" mb="md">
        <Text fw={500}>Your Notes</Text>
        <Textarea
          placeholder="Write your notes here..."
          minRows={3}
        />
        <Group justify="right">
          <Button>Save Notes</Button>
        </Group>
      </Stack>

      {/* Action Buttons */}
      <Group justify="apart">
        <Button variant="outline">Update</Button>
        <Group gap="sm">
          <Button variant="gradient" gradient={{ from: 'cyan', to: 'blue' }}>
            Track Game
          </Button>
          <Button>Details</Button>
          <Button>RA Page</Button>
        </Group>
      </Group>
    </Modal>
  )
}
