import { useSession } from "next-auth/react";
import { DoGet } from "../Helpers/webFetchHelper";
import { LoadingOverlay, Paper, Table, Text } from "@mantine/core";
import { GetServerSideProps } from "next";
import { RecentGameUpdatesDayList } from "../types/Api/Games/GetRecentlyAddedAndUpdatedGames";
import Image from 'next/image'
import { useState } from "react";
import { GetSpecificGameInfo } from "../types/Api/Games/GetSpecificGameInfo";
import { toast } from "react-toastify";
import LoggedOutModal from "../components/App/Games/LoggedOutModal";

type HomeProps = {
    recentGames: RecentGameUpdatesDayList[]
}

const Home = (props: HomeProps) => {
    const { data: session, status } = useSession();
    const [loggedOutModal, useLoggedOutModal] = useState<GetSpecificGameInfo | undefined>(undefined);
    const [loadingOverlayVisible, useLoadingOverlayVisible] = useState(false);
    const [modalOpened, useModalOpened] = useState(true);

    const GetGameInfo = async (gameId: number, sessionId: string | undefined) => {
        if(sessionId){
            //logged in
        }
        else{
            await GetLoggedOutGameInfo(gameId);
        }
    }

    const GetLoggedOutGameInfo = async (gameId: number) =>{
        console.log(modalOpened);
        console.log(loggedOutModal);

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

    return ( 
        <>
            {status === "authenticated" && <Text size={55} align="center">Welcome back, {session.username}!</Text>}
            {status === "unauthenticated" && <h1>Home</h1>}
            {props.recentGames === undefined && <Text size={30} align="center">Error loading recent updated games, please try again shortly</Text>}

            {props.recentGames && 
                props.recentGames.map((games) => {
                    return(
                        <div key={games.date}>
                            <Text size={25} align="center" key={games.date} mt={20}> { games.date } </Text>
                            <Paper shadow="md" p="md" withBorder mt={15}>
                                <div style={{position: 'relative'}}>
                                    <LoadingOverlay visible={loadingOverlayVisible} overlayBlur={2} />
                                    <Table striped highlightOnHover>
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
                        </div>
                    )
                })
            }

            {loggedOutModal && modalOpened && <LoggedOutModal recentGames={loggedOutModal} loggedOutModal={useModalOpened}/>}
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