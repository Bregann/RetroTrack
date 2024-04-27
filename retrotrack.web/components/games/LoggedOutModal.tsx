import { Button, Checkbox, Divider, Grid, Group, HoverCard, Modal, Paper, Text } from '@mantine/core'
import { useState } from 'react'
import Image from 'next/image'
import { type GetSpecificGameInfo } from '@/pages/api/games/GetSpecificGameInfo'
import classes from '@/styles/GameModal.module.css'
interface LoggedOutModalProps {
  gameInfo: GetSpecificGameInfo | undefined
  onClose: () => void
}

const LoggedOutModal = (props: LoggedOutModalProps): JSX.Element => {
  const [checked, setChecked] = useState(true)

  return (
    <>
      {props.gameInfo !== undefined &&
        <Modal
          opened={props.gameInfo !== undefined}
          onClose={() => { props.onClose() }}
          size="75%"
        >
          <h1 style={{ fontSize: 35, marginTop: -10 }}>{props.gameInfo.title}</h1>
          <Group justify='center'>

            <Image
              width={420}
              height={320}
              src={props.gameInfo.imageTitle}
              alt={`${props.gameInfo.title} in game title screen`}
              style={{ marginLeft: 'auto', marginRight: 'auto', display: 'block' }}
            />

            <Image
              width={420}
              height={320}
              src={props.gameInfo.imageInGame}
              alt={`${props.gameInfo.title} in game image`}
              style={{ marginLeft: 'auto', marginRight: 'auto', display: 'block' }}
            />
            <Image
              width={320}
              height={320}
              src={props.gameInfo.imageBoxArt}
              alt={`${props.gameInfo.title} in game box art`}
              style={{ marginLeft: 'auto', marginRight: 'auto', display: 'block' }}
            />
          </Group>

          <Grid justify='center' style={{ textAlign: 'center' }}>
            <Grid.Col span={{ base: 12, lg: 3, md: 6 }}>
              <h3>Achievements</h3>
              <span>{props.gameInfo.achievementCount}</span>
            </Grid.Col>
            <Grid.Col span={{ base: 12, lg: 3, md: 6 }}>
              <h3>Genre</h3>
              <span>{props.gameInfo.genre}</span>
            </Grid.Col>
            <Grid.Col span={{ base: 12, lg: 3, md: 6 }}>
              <h3>Console</h3>
              <span>{props.gameInfo.consoleName}</span>
            </Grid.Col>
            <Grid.Col span={{ base: 12, lg: 3, md: 6 }}>
              <h3>Players</h3>
              <span>{props.gameInfo.players}</span>
            </Grid.Col>

            <Grid.Col>
              <Divider my="xs" />
            </Grid.Col>
          </Grid>

          {checked &&
            <div style={{ marginLeft: 25 }}>
              <Group gap={5} justify='flex-start'>
                {props.gameInfo.achievements.map((achievement) => {
                  return (
                    <div key={achievement.id}>
                      <HoverCard position="bottom">
                        <HoverCard.Target>
                          <Image
                            src={achievement.badgeName}
                            alt={`${achievement.title} achievement badge`}
                            width={64}
                            height={64}
                          />
                        </HoverCard.Target>
                        <HoverCard.Dropdown>
                          <Text fw={500} mt={-5}>{achievement.title} ({achievement.points})</Text>
                          <Text fz="sm">{achievement.description}</Text>
                        </HoverCard.Dropdown>
                      </HoverCard>
                    </div>
                  )
                })}
              </Group>
            </div>
          }

          {!checked &&
            <>
              <Grid>
                {props.gameInfo.achievements.map((achievement) => {
                  return (
                    <>
                      <Grid.Col span={1} key={achievement.id}>
                        <Image
                          width={64}
                          height={64}
                          src={achievement.badgeName}
                          alt=""
                        />
                      </Grid.Col>
                      <Grid.Col span={{ base: 11, lg: 3, md: 5 }}>
                        <Text style={achievement.type === 0 ? { color: 'orange' } : undefined} className={classes.achievementText} fw={500} mt={-5}>{achievement.title} ({achievement.points})</Text>
                        <Text className={classes.achievementText} fz="sm">{achievement.description}</Text>
                      </Grid.Col>
                    </>
                  )
                })}
              </Grid>
            </>
          }

          <Divider my="xs" />
          <Paper className={classes.stickyFooter}>
            <Group align="left">
              <Button
                component="a"
                variant="gradient"
                gradient={{ from: 'indigo', to: 'cyan' }}
                target="_blank"
                style={{ ':hover': { color: 'white' } }}
              >
                Game Page
              </Button>
              <Button
                component="a"
                variant="gradient"
                gradient={{ from: 'indigo', to: 'cyan' }}
                target="_blank"
                style={{ ':hover': { color: 'white' } }}
                href={'https://retroachievements.org/game/' + props.gameInfo.gameId}
              >
                RA Page
              </Button>
              <Checkbox defaultChecked={true} mt={3} label="Compact" size="lg" onChange={(event) => { setChecked(event.currentTarget.checked) }} />
            </Group>
          </Paper>
        </Modal>

      }
    </>
  )
}

export default LoggedOutModal
