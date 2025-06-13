'use client'

import { Badge, Card, Container, Grid, Group, Stack, Text } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { IconStar, IconTrophy } from '@tabler/icons-react'
import Image from 'next/image'
export default function HomeComponent() {
  const isLg = useMediaQuery('(min-width: 1600px)')
  const isXl = useMediaQuery('(min-width: 2440px)')
  const span = isXl ? 3 : isLg ? 6 : 12
  return (
    <>
      <Container size="95%">
        <h1>Welcome to RetroTrack</h1>
        <h1>12th June</h1>
        <Grid gutter={'5%'}>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <h2>New Sets</h2>
            <Grid>
              <Grid.Col span={span}>
                <Card padding="md" radius="md" shadow="md" withBorder>
                  <Stack gap="md">
                    <Group align="flex-start" gap="sm" >
                      <Image
                        src="https://media.retroachievements.org/Images/113314.png"
                        alt="Cover Art"
                        width={64}
                        height={64}
                        style={{ flexShrink: 0 }}
                      />
                      <Text
                        fw={700}
                        size="lg"
                        style={{ flex: 1, wordBreak: 'break-word' }}
                      >
                        Sesame Street: Elmo&apos;s A-To-Zoo Adventure
                      </Text>
                    </Group>
                    <Group align='center' justify='center'>
                      <Badge color="blue" variant="light" size="xs">
                        PlayStation
                      </Badge>
                    </Group>
                    <Group gap="lg" wrap="wrap" align='center' justify='center'>
                      <Group gap={4} align="center">
                        <IconTrophy size={20} color="#FFD700" />
                        <Text size="sm" fw={600}>
                          55 Achievements
                        </Text>
                      </Group>
                      <Group gap={4} align="center">
                        <IconStar size={20} color="#4EA8DE" />
                        <Text size="sm" fw={600}>
                          100 Points
                        </Text>
                      </Group>
                    </Group>
                  </Stack>
                </Card>
              </Grid.Col>
              <Grid.Col span={span}>
                <Card padding="md" radius="md" shadow="md" withBorder>
                  <Stack gap="md">
                    <Group align="flex-start" gap="sm" >
                      <Image
                        src="https://media.retroachievements.org/Images/113314.png"
                        alt="Cover Art"
                        width={64}
                        height={64}
                        style={{ flexShrink: 0 }}
                      />
                      <Text
                        fw={700}
                        size="lg"
                        style={{ flex: 1, wordBreak: 'break-word' }}
                      >
                        Sesame Street: Elmo&apos;s A-To-Zoo Adventure
                      </Text>
                    </Group>
                    <Group align='center' justify='center'>
                      <Badge color="blue" variant="light" size="xs">
                        PlayStation
                      </Badge>
                    </Group>
                    <Group gap="lg" wrap="wrap" align='center' justify='center'>
                      <Group gap={4} align="center">
                        <IconTrophy size={20} color="#FFD700" />
                        <Text size="sm" fw={600}>
                          55 Achievements
                        </Text>
                      </Group>
                      <Group gap={4} align="center">
                        <IconStar size={20} color="#4EA8DE" />
                        <Text size="sm" fw={600}>
                          100 Points
                        </Text>
                      </Group>
                    </Group>
                  </Stack>
                </Card>
              </Grid.Col>
              <Grid.Col span={span}>
                <Card padding="md" radius="md" shadow="md" withBorder>
                  <Stack gap="md">
                    <Group align="flex-start" gap="sm" >
                      <Image
                        src="https://media.retroachievements.org/Images/113314.png"
                        alt="Cover Art"
                        width={64}
                        height={64}
                        style={{ flexShrink: 0 }}
                      />
                      <Text
                        fw={700}
                        size="lg"
                        style={{ flex: 1, wordBreak: 'break-word' }}
                      >
                        Sesame Street: Elmo&apos;s A-To-Zoo Adventure
                      </Text>
                    </Group>
                    <Group align='center' justify='center'>
                      <Badge color="blue" variant="light" size="xs">
                        PlayStation
                      </Badge>
                    </Group>
                    <Group gap="lg" wrap="wrap" align='center' justify='center'>
                      <Group gap={4} align="center">
                        <IconTrophy size={20} color="#FFD700" />
                        <Text size="sm" fw={600}>
                          55 Achievements
                        </Text>
                      </Group>
                      <Group gap={4} align="center">
                        <IconStar size={20} color="#4EA8DE" />
                        <Text size="sm" fw={600}>
                          100 Points
                        </Text>
                      </Group>
                    </Group>
                  </Stack>
                </Card>
              </Grid.Col>
            </Grid>
          </Grid.Col>
          <Grid.Col span={6}>
            <h2>Updated Sets</h2>
            <Grid>
            </Grid>
          </Grid.Col>
        </Grid>
      </Container>
    </>
  )
}
