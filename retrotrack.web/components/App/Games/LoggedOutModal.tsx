import { Autocomplete, Button, Container, Divider, Footer, Grid, Group, HoverCard, Modal, Stack, Switch, Text, Image as MantineImage } from "@mantine/core";
import { forwardRef, useState } from "react";
import Image from 'next/image' 
import { GetSpecificGameInfo } from "../../../types/Api/Games/GetSpecificGameInfo";
import { useDisclosure } from "@mantine/hooks";

type LoggedOutModalProps = {
    recentGames: GetSpecificGameInfo
    loggedOutModal: (toggleState: boolean) => void;
}
  
const LoggedOutModal = (props: LoggedOutModalProps) => {
    const [checked, setChecked] = useState(false);
    const [opened, { close, open }] = useDisclosure(false);

    return ( 
        <>
        <Modal
          opened={true}
          onClose={() => props.loggedOutModal(false)}
          size="xl"
        >
            <Text align="center" mt={-50} mb={20} size={40}>{props.recentGames.title}</Text>
            <Grid>
                <Grid.Col xs={6}>
                <Image
                width={256}
                height={256}
                src={"https://s3-eu-west-1.amazonaws.com/i.retroachievements.org"+ props.recentGames.imageBoxArt}
                alt=""
                style={{marginLeft: 'auto', marginRight: 'auto', display: 'block'}}
                />
                </Grid.Col>

                <Grid.Col xs={6}>
                    <Image
                    width={256}
                    height={256}
                    src={"https://s3-eu-west-1.amazonaws.com/i.retroachievements.org"+ props.recentGames.imageInGame}
                    alt=""
                    style={{marginLeft: 'auto', marginRight: 'auto', display: 'block'}}
                    />
                </Grid.Col>

                <Grid.Col md={3} xs={6}>
                    <Text fw={500} align="center">Achievements</Text>
                    <Text align="center">{props.recentGames.achievementCount}</Text>
                </Grid.Col>

                <Grid.Col md={3} xs={6}>
                    <Text fw={500} align="center">Genre</Text>
                    <Text align="center">{props.recentGames.genre}</Text>
                </Grid.Col>

                <Grid.Col md={3} xs={6}>
                    <Text fw={500} align="center">Console</Text>
                    <Text align="center">{props.recentGames.consoleName}</Text>
                </Grid.Col>

                <Grid.Col md={3} xs={6}>
                    <Text fw={500} align="center">Players</Text>
                    <Text align="center">{props.recentGames.players}</Text>
                </Grid.Col>

                <Grid.Col>
                    <Divider my="xs" />
                </Grid.Col>

                {!checked && props.recentGames.achievements.map((achievement) => {
                    return(
                    <div key={achievement.id}>
                        <HoverCard position="bottom">
                            <HoverCard.Target>
                                 {/* hovercard is not supported when it comes to next/image */}
                                <MantineImage 
                                    style={{marginRight: 5, marginBottom: 5}}
                                    width={48}
                                    height={48}
                                    src={"https://s3-eu-west-1.amazonaws.com/i.retroachievements.org/Badge/" + achievement.badgeName + "_lock.png"}
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

                {checked && props.recentGames.achievements.map((achievement) => {
                    return(
                    <>
                        <Grid.Col md={1} xs={1} key={achievement.id}>
                            <Image
                                style={{marginRight: 5, marginBottom: 5}}
                                width={48}
                                height={48}
                                src={"https://s3-eu-west-1.amazonaws.com/i.retroachievements.org/Badge/" + achievement.badgeName + "_lock.png"}
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
                        href={"https://retroachievements.org/game/" + props.recentGames.gameId}
                        >
                            RA Page
                        </Button>
                    <Switch onLabel="Compact" offLabel="Full" size="lg" mt={-20} onChange={(event) => setChecked(event.currentTarget.checked)}/>
                </Group>
            </Grid.Col>
            
            </Grid>
        </Modal>
        </>
     );
}
 
export default LoggedOutModal;