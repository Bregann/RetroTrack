import { Button, Divider, Grid, Group, HoverCard, Modal, Switch, Text, Image as MantineImage } from "@mantine/core";
import { useState } from "react";
import Image from 'next/image' 
import { GetSpecificGameInfo } from "../../types/Api/Games/GetSpecificGameInfo";

type LoggedOutModalProps = {
    gameInfo: GetSpecificGameInfo
    loggedOutModal: (toggleState: boolean) => void;
}
  
const LoggedOutModal = (props: LoggedOutModalProps) => {
    const [checked, setChecked] = useState(false);

    return ( 
        <>
        <Modal
          opened={true}
          onClose={() => props.loggedOutModal(false)}
          size="xl"
        >
            <Text align="center" mt={-50} mb={20} size={40}>{props.gameInfo.title}</Text>
            <Grid>
                <Grid.Col xs={6}>
                <Image
                width={256}
                height={256}
                src={props.gameInfo.imageBoxArt}
                alt=""
                style={{marginLeft: 'auto', marginRight: 'auto', display: 'block'}}
                />
                </Grid.Col>

                <Grid.Col xs={6}>
                    <Image
                    width={256}
                    height={256}
                    src={props.gameInfo.imageInGame}
                    alt=""
                    style={{marginLeft: 'auto', marginRight: 'auto', display: 'block'}}
                    />
                </Grid.Col>

                <Grid.Col md={3} xs={6}>
                    <Text fw={500} align="center">Achievements</Text>
                    <Text align="center">{props.gameInfo.achievementCount}</Text>
                </Grid.Col>

                <Grid.Col md={3} xs={6}>
                    <Text fw={500} align="center">Genre</Text>
                    <Text align="center">{props.gameInfo.genre}</Text>
                </Grid.Col>

                <Grid.Col md={3} xs={6}>
                    <Text fw={500} align="center">Console</Text>
                    <Text align="center">{props.gameInfo.consoleName}</Text>
                </Grid.Col>

                <Grid.Col md={3} xs={6}>
                    <Text fw={500} align="center">Players</Text>
                    <Text align="center">{props.gameInfo.players}</Text>
                </Grid.Col>

                <Grid.Col>
                    <Divider my="xs" />
                </Grid.Col>

                {!checked && props.gameInfo.achievements.map((achievement) => {
                    return(
                    <div key={achievement.id}>
                        <HoverCard position="bottom">
                            <HoverCard.Target>
                                 {/* hovercard is not supported when it comes to next/image */}
                                <MantineImage 
                                    style={{marginRight: 5, marginBottom: 5}}
                                    width={48}
                                    height={48}
                                    src={achievement.badgeName}
                                    alt=""
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

                {checked && props.gameInfo.achievements.map((achievement) => {
                    return(
                    <>
                        <Grid.Col md={1} xs={1} key={achievement.id}>
                            <Image
                                style={{marginRight: 5, marginBottom: 5}}
                                width={48}
                                height={48}
                                src={achievement.badgeName}
                                alt=""
                            />
                        </Grid.Col>
                        <Grid.Col md={5} xs={10}>
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
                <Group position="left" spacing={0}>
                    <Button
                        component="a"
                        mr={5} 
                        variant="gradient" 
                        gradient={{ from: 'indigo', to: 'cyan' }}
                        target="_blank"
                        sx={{':hover': {color: 'white'}}}
                        >
                            Game Page
                        </Button>
                    <Button
                        component="a"
                        mr={5} 
                        variant="gradient" 
                        gradient={{ from: 'indigo', to: 'cyan' }}
                        target="_blank"
                        sx={{':hover': {color: 'white'}}}
                        href={"https://retroachievements.org/game/" + props.gameInfo.gameId}
                        >
                            RA Page
                        </Button>
                    <Switch offLabel="Compact" onLabel="Full" size="lg" mt={-20} onChange={(event) => setChecked(event.currentTarget.checked)}/>
                </Group>
            </Grid.Col>
            </Grid>
        </Modal>
        </>
     );
}
 
export default LoggedOutModal;