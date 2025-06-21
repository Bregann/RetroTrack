'use client'

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
  Box,
  Checkbox,
} from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import {
  IconTrophy,
  IconStar,
  IconDeviceGamepad,
  IconUsers,
  IconCheck,
  IconAward,
  IconBuilding,
  IconTools,
} from '@tabler/icons-react'
import styles from '@/css/components/gameModal.module.scss'

interface LoggedInGameModalProps {
  gameId?: number
  onClose: () => void
}

export function LoggedInGameModal(props: LoggedInGameModalProps) {
  const isSmall = useMediaQuery('(max-width: 1100px)')
  return (
    <Modal
      opened={props.gameId !== undefined}
      onClose={() => props.onClose()}
      size={'75%'}
      padding="sm"
      radius="sm"
      title={
        <Group gap="md" align="center" justify="center" style={{ flexWrap: 'nowrap' }}>
          <Box className={styles.iconBox}>
            <Image
              src="https://media.retroachievements.org/Images/086944.png"
              alt="Game Icon"
              width={64}
              height={64}
              radius="sm"
              className={styles.gameIcon}
            />
          </Box>
          <Text size="xl" fw={700}>
            Captain Commando
          </Text>
        </Group>
      }
    >
      <SimpleGrid cols={isSmall ? 1 : 3} spacing="md" mb="md">
        <Image
          src="https://media.retroachievements.org/Images/113309.png"
          alt="Screenshot 1"
          radius="sm"
          className={styles.gameScreenshot}
        />
        <Image
          src="https://media.retroachievements.org/Images/113310.png"
          alt="Screenshot 2"
          radius="sm"
          className={styles.gameScreenshot}
        />
        <Box className={styles.gameCoverBox}>
          <Image
            src="https://media.retroachievements.org/Images/050423.png"
            alt="Box Art"
            radius="sm"
            className={styles.gameCoverArt}
          />
        </Box>
      </SimpleGrid>

      <Divider my="sm" label="Summary" labelPosition="center" styles={{ label: { fontSize: 15 } }} />

      <SimpleGrid cols={isSmall ? 2 : 4} mb="md">
        <Card withBorder>
          <Stack align="center" gap={6}>
            <ThemeIcon size="xl" radius="md" color="yellow">
              <IconTrophy size={24} />
            </ThemeIcon>
            <Text fw={700} ta={'center'}>48/73 Achievements</Text>
            <Stack gap="xs" justify="center" ta={'center'}>
              <Text size="sm" c="dimmed">73.73% complete</Text>
              <Text size="sm" c="cyan">Softcore: 18</Text>
              <Text size="sm" c="orange">Hardcore: 30</Text>
              <Text size="sm" c="grey">Locked: 30</Text>
            </Stack>
          </Stack>
        </Card>

        <Card withBorder>
          <Stack align="center" gap={6}>
            <ThemeIcon size="xl" radius="md" color="teal">
              <IconStar size={24} />
            </ThemeIcon>
            <Text fw={700} ta={'center'}>520/730 Points</Text>
            <Stack gap="xs" justify="center" ta={'center'}>
              <Text size="sm" c="dimmed">73.73% complete</Text>
              <Text size="sm" c="cyan">Softcore: 180</Text>
              <Text size="sm" c="orange">Hardcore: 300</Text>
            </Stack>
          </Stack>
        </Card>

        <Card withBorder radius="md">
          <Stack align="center" gap="sm">
            <ThemeIcon size="xl" radius="md" color="violet">
              <IconDeviceGamepad size={24} />
            </ThemeIcon>
            <Text fw={700}>Game Info</Text>
            <Stack gap="xs">
              <Group gap="lg" >
                <Group gap="xs">
                  <IconDeviceGamepad size={16} />
                  <Text size="sm">PlayStation</Text>
                </Group>
                <Group gap="xs">
                  <IconBuilding size={16} />
                  <Text size="sm">Publisher: Sega</Text>
                </Group>
              </Group>
              <Group gap="lg" >
                <Group gap="xs">
                  <IconStar size={16} />
                  <Text size="sm">Run &amp; Gun</Text>
                </Group>
                <Group gap="xs">
                  <IconTools size={16} />
                  <Text size="sm">Developer: Sonic Team</Text>
                </Group>
              </Group>
              <Group gap="xs" >
                <IconUsers size={16} />
                <Text size="sm">4 Players</Text>
              </Group>
            </Stack>
          </Stack>
        </Card>

        <Card withBorder>
          <Stack align="center" gap={6}>
            <ThemeIcon size="xl" radius="md" color="teal">
              <IconCheck size={24} />
            </ThemeIcon>
            <Text fw={700} ta={'center'}>Completion State</Text>
            <Stack gap={4}>
              <Group gap="6"><IconDeviceGamepad size={16} /> <Text>Date Beaten:</Text></Group>
              <Text size="sm" c="dimmed" ta={'center'}>2023-10-01</Text>

              <Group gap="6"><IconDeviceGamepad size={16} /> <Text>Date Mastered:</Text></Group>
              <Text size="sm" c="dimmed" ta={'center'}>2023-10-01</Text>
            </Stack>
          </Stack>
        </Card>
      </SimpleGrid>

      <Divider my="sm" label="Achievements" labelPosition="center" styles={{ label: { fontSize: 15 } }} />
      <Progress.Root size={20} className={styles.progressBar}>
        <Progress.Section value={50} color="orange">
          <Progress.Label>hardcore</Progress.Label>
        </Progress.Section>
        <Progress.Section value={30} color="cyan">
          <Progress.Label>softcore</Progress.Label>
        </Progress.Section>
        <Progress.Section value={20} color="grey">
          <Progress.Label>locked</Progress.Label>
        </Progress.Section>
      </Progress.Root>
      <Group>
        <Checkbox
          label="Hide Unlocked Achievements"
        />
        <Checkbox
          label="Show Progression Achievements Only"
        />
        <Checkbox
          label="Show Missable Achievements Only"
        />
      </Group>


      <SimpleGrid cols={isSmall ? 1 : 2} mb="md" mt={10}>
        <Card withBorder radius="sm" p="sm" style={{ position: 'relative' }}>
          <Group align="center" gap="md">
            <Box className={styles.iconBox}>
              <Image
                src="https://media.retroachievements.org/Badge/451988.png"
                alt="Achv 1"
                width={64}
                height={64}
                radius="sm"
                style={{ objectFit: 'contain' }}
              />
            </Box>

            <Stack gap={2} style={{ flex: 1 }}>
              <Text fw={500}>Achievement Title 1</Text>
              <Text size="sm" c="dimmed">
                Achievement Description 1
              </Text>
            </Stack>

            <Text fw={600} size="lg" c="yellow" mb={20}>
              10
            </Text>
          </Group>

          {/* Optional badge icon in bottom right */}
          <Box className={styles.achievementIconTypeBox}>
            {/* e.g. progression icon */}
            <ThemeIcon color="cyan" size="sm" radius="xl">
              <IconAward size={16} />
            </ThemeIcon>
          </Box>
        </Card>
        <Card withBorder radius="sm" p="sm" style={{ position: 'relative' }}>
          <Group align="center" gap="md">
            <Box style={{ width: 64, height: 64, flexShrink: 0 }}>
              <Image
                src="https://media.retroachievements.org/Badge/451988.png"
                alt="Achv 1"
                width={64}
                height={64}
                radius="sm"
                style={{ objectFit: 'contain' }}
              />
            </Box>

            <Stack gap={2} style={{ flex: 1 }}>
              <Text fw={500}>Achievement Title 1</Text>
              <Text size="sm" c="dimmed">
                Achievement Description 1
              </Text>
              <Text size="xs" c="dimmed" mt={5}>
                Unlocked on: 2023-10-01 12:34:56
              </Text>
            </Stack>

            <Text fw={600} size="lg" c="yellow" mb={20}>
              10
            </Text>
          </Group>

          <Box
            style={{
              position: 'absolute',
              bottom: 8,
              right: 8,
            }}
          >
            <ThemeIcon color="cyan" size="sm" radius="xl">
              <IconAward size={16} />
            </ThemeIcon>
          </Box>
        </Card>
        <Card withBorder radius="sm" p="sm" style={{ position: 'relative' }}>
          <Group align="center" gap="md">
            <Box style={{ width: 64, height: 64, flexShrink: 0 }}>
              <Image
                src="https://media.retroachievements.org/Badge/451988.png"
                alt="Achv 1"
                width={64}
                height={64}
                radius="sm"
                style={{ objectFit: 'contain' }}
              />
            </Box>

            <Stack gap={2} style={{ flex: 1 }}>
              <Text fw={500}>Achievement Title 1</Text>
              <Text size="sm" c="dimmed">
                Achievement Description 1
              </Text>
            </Stack>

            <Text fw={600} size="lg" c="yellow" mb={20}>
              10
            </Text>
          </Group>

          <Box
            style={{
              position: 'absolute',
              bottom: 8,
              right: 8,
            }}
          >
            <ThemeIcon color="cyan" size="sm" radius="xl">
              <IconAward size={16} />
            </ThemeIcon>
          </Box>
        </Card>
      </SimpleGrid>

      {/* Notes Section */}
      <Stack gap="xs" mb="md">
        <Text fw={500}>Your Notes</Text>
        <Textarea
          placeholder="Write your notes here..."
          minRows={3}
          autosize
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
    </Modal >
  )
}
