import { useSession } from "next-auth/react";
import { DoGet } from "../Helpers/webFetchHelper";
import { createStyles, LoadingOverlay, MediaQuery, Paper, Table, Text } from "@mantine/core";
import { GetServerSideProps } from "next";
import { RecentGameUpdatesDayList } from "../types/Api/Games/GetRecentlyAddedAndUpdatedGames";
import Image from 'next/image'
import { useState } from "react";
import { GetSpecificGameInfo } from "../types/Api/Games/GetSpecificGameInfo";
import { toast } from "react-toastify";
import LoggedOutModal from "../components/Games/LoggedOutModal";
import LoggedInModal from "../components/Games/LoggedInModal";
import { GetGameInfoForUser } from "../types/Api/Games/GetGameInfoForUser";

type HomeProps = {
    recentGames: RecentGameUpdatesDayList[]
}

const Home = (props: HomeProps) => {
    const { data: session, status } = useSession();
    const [loggedOutModal, setLoggedOutModal] = useState<GetSpecificGameInfo | undefined>(undefined);
    const [loggedInModal, setLoggedInModal] = useState<GetGameInfoForUser | undefined>(undefined);
    const [loadingOverlayVisible, setLoadingOverlayVisible] = useState(false);
    const [modalOpened, setModalOpened] = useState(true);

    const GetGameInfo = async (gameId: number, sessionId: string | undefined) => {
        if(sessionId){
            await GetLoggedInGameInfo(gameId, sessionId);
        }
        else{
            await GetLoggedOutGameInfo(gameId);
        }
    }

    const GetLoggedOutGameInfo = async (gameId: number) => {
        setLoadingOverlayVisible(true);
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

        setModalOpened(true);
        setLoggedOutModal(data);
        setLoadingOverlayVisible(false);
    }

    const GetLoggedInGameInfo = async(gameId: number, sessionId: string) => {
        setLoadingOverlayVisible(true);

        const res = await DoGet('/api/games/GetGameInfoForUser/'+ gameId, sessionId); //hard coded for dev purposes - change back lol
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

        setModalOpened(true);
        setLoggedInModal(data);
        setLoadingOverlayVisible(false);
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

            {loggedOutModal && modalOpened && <LoggedOutModal gameInfo={loggedOutModal} loggedOutModal={setModalOpened}/>}
            {loggedInModal && modalOpened && <LoggedInModal gameInfo={loggedInModal} loggedInModal={setModalOpened}/>}
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