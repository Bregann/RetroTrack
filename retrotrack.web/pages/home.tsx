import { signIn, useSession } from "next-auth/react";
import App from "./_app";
import { DoGet } from "../Helpers/webFetchHelper";
import { Paper, Table, Text } from "@mantine/core";
import { GetServerSideProps } from "next";
import { RecentGameUpdatesDayList } from "../types/Api/Games/GetRecentlyAddedAndUpdatedGames";
import Image from 'next/image'

type HomeProps = {
    recentGames: RecentGameUpdatesDayList[]
}

const Home = (props: HomeProps) => {
    const { data: session, status } = useSession();

    return ( 
        <>
            {status === "authenticated" && <Text size={55} align="center">Welcome back, {session.username}!</Text>}
            {status === "unauthenticated" && <h1>Home</h1>}
            {props.recentGames === undefined && <Text size={30} align="center">Error loading recent updated games, please try again shortly</Text>}

            {props.recentGames && 
                props.recentGames.map((games) => {
                    return(
                        <>
                            <Text size={25} align="center" key={games.date} mt={20}> { games.date } </Text>
                            <Paper shadow="md" p="md" withBorder mt={15}>
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
                                            <tr key={gameTableData.gameId} onClick={() => console.log(gameTableData.gameId)}>
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
                            </Paper>
                        </>
                    )
                })
            }
        </>
     );
}
 
export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
    const res = await DoGet('/api/games/GetRecentlyAddedAndUpdatedGames');;
    const recentGames = await res.json();

    return {
        props: {
            recentGames: recentGames
        }, // will be passed to the page component as props
        }
  }
export default Home;