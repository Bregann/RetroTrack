import {  Button, Divider, Grid, Group, HoverCard, Modal, Switch, Text, Image as MantineImage } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import Image from 'next/image'
import { GetGameInfoForUser } from "../../types/Api/Games/GetGameInfoForUser";
import { DoDelete, DoGet } from "../../Helpers/webFetchHelper";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

type LoggedInModalProps = {
    gameInfo: GetGameInfoForUser;
    loggedInModal: (toggleState: boolean) => void;
    setTableDataUpdateNeeded?: (toggleState: boolean) => void;
}

const LoggedInModal = (props: LoggedInModalProps) => {
    const [gameLayoutChecked, setGameLayoutChecked] = useState(false);
    const [autoUpdateChecked, setAutoUpdateChecked] = useState(false);
    const [currentDisplayedAchievements, setCurrentDisplayedAchievements] = useState(props.gameInfo.achievements);
    const [achievementList, setAchievementList] = useState(props.gameInfo.achievements);
    const [gameStats, setGameStats] = useState(props.gameInfo)
    const [gameTracked, setGameTracked] = useState(props.gameInfo.gameTracked);
    const [trackedGameButtonLoading, setTrackedGameButtonLoading] = useState(false);
    const [achievementsFiltered, setAchievementsFiltered] = useState(false);
    const { data: session, status } = useSession();
    const interval = useRef<NodeJS.Timeout | null>(null);

    const FilterCurrentAchievements = (checked: boolean) => {
        setAchievementsFiltered(checked);

        if(checked){
            setCurrentDisplayedAchievements(achievementList.filter(x => x.dateEarned === null));
        }
        else{
            setCurrentDisplayedAchievements(achievementList)
        }
    }

    const UpdateTrackedGame = async () => {
        setTrackedGameButtonLoading(true);

        if(gameTracked){
            const res = await DoDelete('/api/trackedgames/DeleteTrackedGame/'+ props.gameInfo.gameId, null, session?.sessionId);

            if(res.ok){
                setGameTracked(false);
                toast.success("The game has been removed from your tracked list", {
                    position: 'bottom-right',
                    closeOnClick: true,
                    theme: 'colored'
                });
            }
            else{
                toast.error("Error updating tracked game: " + res.status, {
                    position: 'bottom-right',
                    closeOnClick: true,
                    theme: 'colored'
                });
            }
        }
        else{
            const res = await DoDelete('/api/trackedgames/AddTrackedGame/'+ props.gameInfo.gameId, null, session?.sessionId);

            if(res.ok){
                setGameTracked(true);
                toast.success("The game has been added to your tracked list", {
                    position: 'bottom-right',
                    closeOnClick: true,
                    theme: 'colored'
                });
            }
            else{
                toast.error("Error updating tracked game: " + res.status, {
                    position: 'bottom-right',
                    closeOnClick: true,
                    theme: 'colored'
                });
            }
        }
        setTrackedGameButtonLoading(false);
    }

    const UpdateUserProgress = async () => {
        const res = await DoGet('/api/games/GetGameInfoForUser/'+ props.gameInfo.gameId, session?.sessionId);

        if(res.ok){
            const data: GetGameInfoForUser = await res.json();

            setGameStats(data);
            setAchievementList(data.achievements!);
            toast.success("Achievements updated", {
                position: 'bottom-right',
                closeOnClick: true,
                theme: 'colored'
            });
            
            FilterCurrentAchievements(achievementsFiltered);
            return;
        }
        else{
            toast.error("Error updating user: " + res.status, {
                position: 'bottom-right',
                closeOnClick: true,
                theme: 'colored'
            });
        }
    }

    const UpdateCloseModalStates = () => {
        props.loggedInModal(false)

        if(props.setTableDataUpdateNeeded){
            props.setTableDataUpdateNeeded(true)
        }
    }

    useEffect(() =>  {
        FilterCurrentAchievements(achievementsFiltered);
    // Ignoring the below warning as the filter is used in other places
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [achievementList]);

    useEffect(() => {
        if(autoUpdateChecked){
            toast.success("Achievements auto update enabled", {
                position: 'bottom-right',
                closeOnClick: true,
                theme: 'colored'
            });

            interval.current = setInterval(async () => {
                UpdateUserProgress();
            }, 60000)
        }
        if(!autoUpdateChecked && interval.current){
            clearInterval(interval.current);
            interval.current = null;
            toast.success("Achievements auto update disabled", {
                position: 'bottom-right',
                closeOnClick: true,
                theme: 'colored'
            });
        }
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [autoUpdateChecked]);

    return (
        <>
        <Modal
          opened={true}
          onClose={() => UpdateCloseModalStates()}
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

                <Grid.Col md={2} xs={6} ml={60}>
                    <Text fw={500} align="center">Achievements</Text>
                    <Text align="center">{gameStats.numAwardedToUser}/{gameStats.achievementCount} ({gameStats.userCompletion})</Text>
                </Grid.Col>

                <Grid.Col md={2} xs={6}>
                    <Text fw={500} align="center">Points</Text>
                    <Text align="center">{gameStats.pointsEarned}/{gameStats.totalPoints}</Text>
                </Grid.Col>

                <Grid.Col md={2} xs={6}>
                    <Text fw={500} align="center">Genre</Text>
                    <Text align="center">{props.gameInfo.genre}</Text>
                </Grid.Col>

                <Grid.Col md={2} xs={6}>
                    <Text fw={500} align="center">Console</Text>
                    <Text align="center">{props.gameInfo.consoleName}</Text>
                </Grid.Col>

                <Grid.Col md={2} xs={6}>
                    <Text fw={500} align="center">Players</Text>
                    <Text align="center">{props.gameInfo.players}</Text>
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

                {gameLayoutChecked && currentDisplayedAchievements.map((achievement) => {
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
                            <Text style={achievement.type === 0 ? {color: 'orange'} : null} fw={500} mt={-5}>{achievement.title} ({achievement.points}) {achievement.type === 0 ? "[m]" : ""}</Text>
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
                        mr={5}
                        mt={-5}
                        variant="gradient"
                        loading={trackedGameButtonLoading}
                        gradient={{ from: 'indigo', to: 'cyan'  }}
                        onClick={() => UpdateUserProgress()}>
                            Update
                    </Button>

                    {gameTracked && 
                    <Button 
                        mr={5}
                        mt={-5}
                        variant="gradient"
                        loading={trackedGameButtonLoading}
                        gradient={{ from: 'orange', to: 'red' }}
                        onClick={() => UpdateTrackedGame()}>
                            Untrack Game
                    </Button>}

                    {!gameTracked && 
                    <Button 
                        mr={5}
                        mt={-5}
                        variant="gradient"
                        loading={trackedGameButtonLoading}
                        gradient={{ from: 'teal', to: 'lime', deg: 105 }} 
                        onClick={() => UpdateTrackedGame()}
                        >
                            Track Game
                    </Button>}

                    <Button
                        component="a"
                        mr={5}
                        mt={-5}
                        variant="gradient" 
                        gradient={{ from: 'indigo', to: 'cyan' }}
                        sx={{':hover': {color: 'white'}}}
                        href={'game/' + props.gameInfo.gameId}
                        >
                            Game Page
                    </Button>

                    <Button
                        component="a"
                        mr={5}
                        mt={-5}
                        variant="gradient" 
                        gradient={{ from: 'indigo', to: 'cyan' }}
                        target="_blank"
                        sx={{':hover': {color: 'white'}}}
                        href={"https://retroachievements.org/game/" + props.gameInfo.gameId}
                        >
                            RA Page
                        </Button>

                    <Switch offLabel="Compact" onLabel="Full" size="lg" mt={-9} mr={5} ml={20} onChange={(event) => setGameLayoutChecked(event.currentTarget.checked)}/>
                    <Switch offLabel="Auto update" onLabel="Auto update" size="lg" mt={-9} mr={5} onChange={(event) => setAutoUpdateChecked(event.currentTarget.checked)}/>
                    <Switch offLabel="Show Complete" onLabel="Hide Complete" size="lg" mt={-9} mr={5} onChange={(event) => FilterCurrentAchievements(event.currentTarget.checked)}/>
                </Group>
            </Grid.Col>
            </Grid>
        </Modal>
        </>
     );
}
 
export default LoggedInModal;