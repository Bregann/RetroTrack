import { useSession } from "next-auth/react";
import { DoGet } from "../Helpers/webFetchHelper";
import { createStyles, LoadingOverlay, MediaQuery, Paper, Table, Text } from "@mantine/core";
import { GetServerSideProps } from "next";
import { RecentGameUpdatesDayList } from "../types/Api/Games/GetRecentlyAddedAndUpdatedGames";
import Image from 'next/image'
import { useState } from "react";
import { GetSpecificGameInfo } from "../types/Api/Games/GetSpecificGameInfo";
import { toast } from "react-toastify";
import LoggedOutModal from "../components/App/Nav/LoggedOutModal";
import LoggedInModal from "../components/App/Nav/LoggedInModal";
import { GetGameInfoForUser } from "../types/Api/Games/GetGameInfoForUser";

type HomeProps = {
    recentGames: RecentGameUpdatesDayList[]
}

const Home = (props: HomeProps) => {
    const { data: session, status } = useSession();
    const [loggedOutModal, useLoggedOutModal] = useState<GetSpecificGameInfo | undefined>(undefined);
    const [loggedInModal, useLoggedInModal] = useState<GetGameInfoForUser | undefined>(undefined);
    const [loadingOverlayVisible, useLoadingOverlayVisible] = useState(false);
    const [modalOpened, useModalOpened] = useState(true);

    const GetGameInfo = async (gameId: number, sessionId: string | undefined) => {
        if(sessionId){
            await GetLoggedInGameInfo(gameId, sessionId);
        }
        else{
            await GetLoggedOutGameInfo(gameId);
        }
    }

    const GetLoggedOutGameInfo = async (gameId: number) => {
        useLoadingOverlayVisible(true);
        const res = await DoGet('/api/games/GetSpecificGameInfo/'+ gameId);
        let data: GetSpecificGameInfo | undefined = undefined;

        if(res.ok){
            data = await res.json();
        }
        else{
            toast.error("Error getting game info: " + res.status, {
                position: 'bottom-right',
                closeOnClick: true,
                theme: 'colored'
            });
        }

        useModalOpened(true);
        useLoggedOutModal(data);
        useLoadingOverlayVisible(false);
    }

    const GetLoggedInGameInfo = async(gameId: number, sessionId: string) => {
        useLoadingOverlayVisible(true);

        const res = await DoGet('/api/games/GetGameInfoForUser/'+ 1842, sessionId); //hard coded for dev purposes - change back lol
        let data: GetGameInfoForUser | undefined = undefined;

        if(res.ok){
            data = await res.json();
        }
        else{
            toast.error("Error getting game info: " + res.status, {
                position: 'bottom-right',
                closeOnClick: true,
                theme: 'colored'
            });
        }

        useModalOpened(true);
        useLoggedInModal(data);
        useLoadingOverlayVisible(false);
    }

    return ( 
        <>
            {status === "authenticated" && <Text size={55} align="center">Welcome back, {session.username}!</Text>}
            {status === "unauthenticated" && <Text size={55} align="center">Home</Text>}
            {props.recentGames === undefined && <Text size={30} align="center">Error loading recent updated games, please try again shortly</Text>}

            {props.recentGames && 
                props.recentGames.map((games) => {
                    return(
                        <div key={games.date}>
                            <Text size={25} align="center" key={games.date} mt={20}> { games.date } </Text>
                            <MediaQuery smallerThan="sm" styles={{width: 600, marginLeft: 'auto', marginRight: 'auto', display: 'block'}}>
                                <Paper shadow="md" p="md" withBorder mt={15}>
                                
                                    <div style={{position: 'relative'}}>
                                        <LoadingOverlay visible={loadingOverlayVisible} overlayBlur={2} />
                                        <Table striped highlightOnHover sx={{'& thead tr th': {color: 'white', paddingBottom: 20}, 'tr:hover td': {backgroundColor: '#5291f770'}}}>
                                            <thead>
                                                <tr>
                                                    <th>Icon</th>
                                                    <th>Game Name</th>
                                                    <th>Achievement Count</th>
                                                    <th>Game Genre</th>
                                                    <th>Console</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {games.gamesTable?.map((gameTableData) => {
                                                    return(
                                                    <tr key={gameTableData.gameId} onClick={async () => await GetGameInfo(gameTableData.gameId, session?.sessionId)}>
                                                        <td><Image
                                                            width={64}
                                                            height={64}
                                                            src={gameTableData.gameIconUrl}
                                                            alt=""
                                                        /></td>
                                                        <td>{gameTableData.gameName}</td>
                                                        <td>{gameTableData.achievementCount}</td>
                                                        <td>{gameTableData.gameGenre}</td>
                                                        <td>{gameTableData.console}</td>
                                                    </tr>
                                                )})}
                                            </tbody>
                                        </Table>
                                    </div>
                                </Paper>
                            </MediaQuery>
                        </div>
                    )
                })
            }

            {loggedOutModal && modalOpened && <LoggedOutModal gameInfo={loggedOutModal} loggedOutModal={useModalOpened}/>}
            {loggedInModal && modalOpened && <LoggedInModal gameInfo={loggedInModal} loggedInModal={useModalOpened}/>}
        </>
     );
}
 
export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
    const res = await DoGet('/api/games/GetRecentlyAddedAndUpdatedGames');
    const recentGames = await res.json();

    return {
        props: {
            recentGames: recentGames
        }, // will be passed to the page component as props
        }
  }
export default Home;