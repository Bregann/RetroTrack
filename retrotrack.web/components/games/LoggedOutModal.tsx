import { Button, Divider, Grid, Group, HoverCard, Modal, Switch, Text } from '@mantine/core'
import { useState } from 'react'
import Image from 'next/image'
import { type GetSpecificGameInfo } from '@/pages/api/games/GetSpecificGameInfo'

interface LoggedOutModalProps {
  gameInfo: GetSpecificGameInfo | undefined
  onClose: () => void
}

const LoggedOutModal = (props: LoggedOutModalProps): JSX.Element => {
  const [checked, setChecked] = useState(false)

  return (
    <>
    {props.gameInfo !== undefined &&
      <Modal
        opened={props.gameInfo !== undefined}
        onClose={() => { props.onClose() }}
        size="xl"
      >
        <h2>{props.gameInfo.title}</h2>
        <Grid>
          <Grid.Col span={6}>
            <Image
              width={256}
              height={256}
              src={props.gameInfo.imageBoxArt}
              alt=""
              style={{ marginLeft: 'auto', marginRight: 'auto', display: 'block' }}
            />
          </Grid.Col>

          <Grid.Col span={6}>
            <Image
              width={256}
              height={256}
              src={props.gameInfo.imageInGame}
              alt=""
              style={{ marginLeft: 'auto', marginRight: 'auto', display: 'block' }}
            />
          </Grid.Col>

          <Grid.Col span={3}>
            <h6>Achievements</h6>
            <span>{props.gameInfo.achievementCount}</span>
          </Grid.Col>

          <Grid.Col span={3}>
            <h6>Genre</h6>
            <span>{props.gameInfo.genre}</span>
          </Grid.Col>

          <Grid.Col span={3}>
            <h6>Console</h6>
            <span>{props.gameInfo.consoleName}</span>
          </Grid.Col>

          <Grid.Col span={3}>
            <h6>Players</h6>
            <span>{props.gameInfo.players}</span>
          </Grid.Col>

          <Grid.Col>
            <Divider my="xs" />
          </Grid.Col>

          {!checked && props.gameInfo.achievements.map((achievement) => {
            return (
              <div key={achievement.id}>
                <HoverCard position="bottom">
                  <HoverCard.Target>
                    <Image src={achievement.badgeName} alt={''} width={64} height={64}/>
                  </HoverCard.Target>
                  <HoverCard.Dropdown>
                    <Text fw={500} mt={-5}>{achievement.title} ({achievement.points})</Text>
                    <Text fz="sm">{achievement.description}</Text>
                  </HoverCard.Dropdown>
                </HoverCard>
              </div>
            )
          })}

          {checked && props.gameInfo.achievements.map((achievement) => {
            return (
              <>
                <Grid.Col span={1} key={achievement.id}>
                  <Image
                    style={{ marginRight: 5, marginBottom: 5 }}
                    width={48}
                    height={48}
                    src={achievement.badgeName}
                    alt=""
                  />
                </Grid.Col>
                <Grid.Col span={10}>
                  <Text fw={500} mt={-5}>{achievement.title} ({achievement.points})</Text>
                  <Text fz="sm">{achievement.description}</Text>
                </Grid.Col>
              </>
            )
          })}

          <Grid.Col>
            <Divider my="xs" />
          </Grid.Col>

          <Grid.Col>
            <Group align="left">
              <Button
                component="a"
                mr={5}
                variant="gradient"
                gradient={{ from: 'indigo', to: 'cyan' }}
                target="_blank"
                style={{ ':hover': { color: 'white' } }}
              >
                Game Page
              </Button>
              <Button
                component="a"
                mr={5}
                variant="gradient"
                gradient={{ from: 'indigo', to: 'cyan' }}
                target="_blank"
                style={{ ':hover': { color: 'white' } }}
                href={'https://retroachievements.org/game/' + props.gameInfo.gameId}
              >
                RA Page
              </Button>
              <Switch offLabel="Compact" onLabel="Full" size="lg" onChange={(event) => { setChecked(event.currentTarget.checked) }} />
            </Group>
          </Grid.Col>
        </Grid>
      </Modal>
      }
    </>
  )
}

export default LoggedOutModal
