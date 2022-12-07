import { Autocomplete, Button, Container, Divider, Footer, Grid, Group, HoverCard, Modal, Switch, Text, Image as MantineImage } from "@mantine/core";
import { useState } from "react";
import Image from 'next/image'
import { GetSpecificGameInfo } from "../../../types/Api/Games/GetSpecificGameInfo";
import { GetGameInfoForUser } from "../../../types/Api/Games/GetGameInfoForUser";

type LoggedOutModalProps = {
    recentGames: GetGameInfoForUser;
    loggedInModal: (toggleState: boolean) => void;
}

const LoggedInModal = (props: LoggedOutModalProps) => {
    const [gameLayoutChecked, setGameLayoutChecked] = useState(false);
    const [currentDisplayedAchievements, setCurrentDisplayedAchievements] = useState(props.recentGames.achievements);
    const [achievementsFiltered, setAchievementsFiltered] = useState(false);

    const FilterCurrentAchievements = (checked: boolean) => {
        if(checked){
            setCurrentDisplayedAchievements(props.recentGames.achievements.filter(x => x.dateEarned === null));
        }
        else{
            setCurrentDisplayedAchievements(props.recentGames.achievements)
        }

        setAchievementsFiltered(checked);
    }

    return (
        <>
        <Modal
          opened={true}
          onClose={() => props.loggedInModal(false)}
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
                    <Text align="center">{props.recentGames.numAwardedToUser}/{props.recentGames.achievementCount} ({props.recentGames.userCompletion})</Text>
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

                {!gameLayoutChecked && currentDisplayedAchievements.map((achievement) => {
                    return(
                    <div key={achievement.id}>
                        <HoverCard position="bottom">
                            <HoverCard.Target>
                                 {/* hovercard is not supported when it comes to next/image */}
                                <MantineImage 
                                    style={{marginRight: 5, marginBottom: 5}}
                                    width={48}
                                    height={48}
                                    src={"https://s3-eu-west-1.amazonaws.com/i.retroachievements.org/Badge/" + achievement.badgeName}
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

                {gameLayoutChecked && currentDisplayedAchievements.map((achievement) => {
                    return(
                    <>
                        <Grid.Col md={1} xs={1} key={achievement.id}>
                            <Image
                                style={{marginRight: 5, marginBottom: 5}}
                                width={48}
                                height={48}
                                src={"https://s3-eu-west-1.amazonaws.com/i.retroachievements.org/Badge/" + achievement.badgeName}
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
                    <Button mr={5}>Update</Button>
                    <Button mr={5}>Track Game</Button>

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

                    <Switch onLabel="Compact" offLabel="Full" size="lg" mt={-15} mr={5} onChange={(event) => setGameLayoutChecked(event.currentTarget.checked)}/>
                    <Switch onLabel="Auto update" offLabel="Auto update" size="lg" mt={-15} mr={5} onChange={(event) => setGameLayoutChecked(event.currentTarget.checked)}/>
                    <Switch onLabel="Show Complete" offLabel="Hide Complete" size="lg" mt={-15} mr={5} onChange={(event) => FilterCurrentAchievements(event.currentTarget.checked)}/>
                </Group>
            </Grid.Col>
            </Grid>
        </Modal>
        </>
     );
}
 
export default LoggedInModal;