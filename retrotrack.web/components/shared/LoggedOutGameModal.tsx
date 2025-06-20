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
} from '@tabler/icons-react'
import styles from '@/css/components/gameModal.module.scss'

interface LoggedInGameModalProps {
  gameId?: number
  onClose: () => void
}

export function LoggedOutGameModal(props: LoggedInGameModalProps) {
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

      <SimpleGrid cols={isSmall ? 2 : 3} mb="md">
        <Card withBorder>
          <Stack align="center" justify="center" h="100%" style={{ minHeight: 120 }}>
            <ThemeIcon size="xl" radius="md" color="yellow">
              <IconTrophy size={24} />
            </ThemeIcon>
            <Text fw={700} ta="center">73 Achievements</Text>
          </Stack>
        </Card>

        <Card withBorder>
          <Stack align="center" justify="center" h="100%" style={{ minHeight: 120 }}>
            <ThemeIcon size="xl" radius="md" color="teal">
              <IconStar size={24} />
            </ThemeIcon>
            <Text fw={700} ta={'center'}>730 Points</Text>
          </Stack>
        </Card>

        <Card withBorder>
          <Stack gap={6} align="center">
            <ThemeIcon size="xl" radius="md" color="violet">
              <IconDeviceGamepad size={24} />
            </ThemeIcon>
            <Text fw={700} ta={'center'}>Game Info</Text>
            <Stack gap={4}>
              <Group gap="6"><IconDeviceGamepad size={16} /> <Text>PlayStation</Text></Group>
              <Group gap="6"><IconStar size={16} /> <Text>Run &amp; Gun</Text></Group>
              <Group gap="6"><IconUsers size={16} /> <Text>4 Players</Text></Group>
            </Stack>
          </Stack>
        </Card>
      </SimpleGrid>

      <Divider my="sm" label="Achievements" labelPosition="center" styles={{ label: { fontSize: 15 } }} />
      <Group>
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

      {/* Action Buttons */}
      <Group justify="apart">
        <Button>Details</Button>
        <Button>RA Page</Button>
      </Group>
    </Modal >
  )
}
