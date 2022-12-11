import { MediaQuery, Paper, Group, TextInput, UnstyledButton, LoadingOverlay, Text, Switch } from "@mantine/core";
import { IconSearch, IconSquareX } from "@tabler/icons";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import { LoggedInGameTableProps } from "../../types/App/LoggedInGameTable";
import Image from "next/image";
import { useDebouncedValue } from "@mantine/hooks";
import { sortBy } from "lodash";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { GetGameInfoForUser } from "../../types/Api/Games/GetGameInfoForUser";
import { DoGet } from "../../Helpers/webFetchHelper";
import LoggedInModal from "./LoggedInModal";

const LoggedInGamesTable = (props: LoggedInGameTableProps) => {
    const [pageSize, setPageSize] = useState(15);
    const [page, setPage] = useState(1);
    const [games, setGames] = useState(sortBy(props.gameData.slice(0, pageSize), 'gameName'));
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'gameName', direction: 'asc' });
    const [query, setQuery] = useState('');
    const [debouncedQuery] = useDebouncedValue(query, 200);
    const [totalRecords, setTotalRecords] = useState(props.gameData.length);
    const [loadingOverlayVisible, setLoadingOverlayVisible] = useState(false);
    const [modalOpened, setModalOpened] = useState(true);
    const [completedSwitch, setCompletedSwitch] = useState(true);
    const [inProgressSwitch, setInProgressSwitch] = useState(false);
    const [showGameModal, setShowGameModal] = useState<GetGameInfoForUser | undefined>(undefined);
    const { data: session, status } = useSession();

    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;

        const data = sortBy(props.gameData, sortStatus.columnAccessor);
        const sortedData = sortStatus.direction === 'desc' ? data.reverse() : data;

        let filteredGames = sortedData.filter(({gameName, achievementCount, gameGenre, players}) => {
            if(
                debouncedQuery !== '' &&
                !`${gameName} ${achievementCount} ${gameGenre} ${players}`
                    .toLowerCase()
                    .includes(debouncedQuery.trim().toLowerCase())
            ) {
                return false;
            }

            return true;
        });

        if(completedSwitch){
            filteredGames = filteredGames.filter(({ percentageCompleted }) => {
                    return percentageCompleted !== 100
            });
        }

        if(inProgressSwitch){
            filteredGames = filteredGames.filter(({ percentageCompleted }) => {
                    return percentageCompleted === 0 || percentageCompleted === 100
            });
        }

        setTotalRecords(filteredGames.length);
        setGames(filteredGames.slice(from, to));

    }, [page, props.gameData, sortStatus, pageSize, debouncedQuery, completedSwitch, inProgressSwitch]);

    const GetGameInfoForModal = async (gameId: number) => {
        setLoadingOverlayVisible(true);
        const res = await DoGet('/api/games/GetGameInfoForUser/'+ gameId, session?.sessionId);
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
        setShowGameModal(data);
        setLoadingOverlayVisible(false);
    }

    return ( 
        <>
        <MediaQuery smallerThan="sm" styles={{width: 600, marginLeft: 'auto', marginRight: 'auto', display: 'block'}}>
            <Paper shadow="md" p="md" withBorder mt={15}>

            <MediaQuery query="(max-width: 1660px)" styles={{display: 'none'}}>
                <Group>
                    <TextInput
                        sx={{width:'80%', marginBottom: 20}}
                        placeholder="Search games..."
                        icon={<IconSearch size={16} />}
                        value={query}
                        onChange={(e) => setQuery(e.currentTarget.value)}
                    />

                    <UnstyledButton sx={{marginBottom: 21, marginLeft:-45, zIndex: 1}} onClick={() => setQuery('')}>
                        <IconSquareX size={20} />
                    </UnstyledButton>
                    
                    <Switch size="lg" onLabel="Show Completed" offLabel="Hide Completed" pb={35} pl={10} onChange={(event) => setCompletedSwitch(event.currentTarget.checked)} defaultChecked={true}/>
                    <Switch size="lg" onLabel="Show In Progress" offLabel="Hide In Progress" pb={35}onChange={(event) => setInProgressSwitch(event.currentTarget.checked)}/>
                </Group>
            </MediaQuery>

            <MediaQuery query="(min-width: 1661px)" styles={{display: 'none'}}>
                <Group>
                    <TextInput
                        sx={{width:'50%', marginBottom: 20}}
                        placeholder="Search games..."
                        icon={<IconSearch size={16} />}
                        value={query}
                        onChange={(e) => setQuery(e.currentTarget.value)}
                    />

                    <UnstyledButton sx={{marginBottom: 21, marginLeft:-45, zIndex: 1}} onClick={() => setQuery('')}>
                        <IconSquareX size={20} />
                    </UnstyledButton>
                    
                    <Switch size="lg" onLabel="Show Completed" offLabel="Hide Completed" pb={35} pl={10} onChange={(event) => setCompletedSwitch(event.currentTarget.checked)} defaultChecked={true}/>
                    <Switch size="lg" onLabel="Show In Progress" offLabel="Hide In Progress" pb={35}onChange={(event) => setInProgressSwitch(event.currentTarget.checked)}/>
                </Group>
            </MediaQuery>

                <div style={{position: 'relative'}}>
                    <LoadingOverlay visible={loadingOverlayVisible} overlayBlur={2} />
                    <DataTable 
                        sx={{'& thead tr th': {color: 'white'}, 'tr:hover td': {backgroundColor: '#5291f770'}}}
                        withBorder
                        striped
                        highlightOnHover
                        records={games}
                        columns={[
                            {
                                accessor: 'gameIconUrl',
                                title: '',
                                render: ({ gameIconUrl }) => (
                                    <Image
                                        width={64}
                                        height={64}
                                        src={gameIconUrl}
                                        alt={"game icon"}
                                    />
                                )
                            },
                            {
                                accessor: 'gameName',
                                title: 'Game Title',
                                sortable: true
                            },
                            {
                                accessor: 'achievementCount',
                                title: 'Achievement Count',
                                sortable: true
                            },
                            {
                                accessor: 'achievementsGained',
                                title: 'Achievements Gained',
                                sortable: true
                            },
                            {
                                accessor: 'percentageCompleted',
                                title: 'Percentage Completed',
                                sortable: true,

                                render: ({ percentageCompleted }) => (
                                    <Text>{percentageCompleted}%</Text>
                                )
                            },
                            {
                                accessor: 'gameGenre',
                                title: 'Game Genre',
                                sortable: true
                            },
                            {
                                accessor: 'players',
                                title: 'Players',
                                sortable: true
                            }
                        ]}
                        totalRecords={totalRecords}
                        recordsPerPage={pageSize}
                        page={page}
                        onPageChange={(p) => setPage(p)}
                        sortStatus={sortStatus}
                        onSortStatusChange={setSortStatus}
                        recordsPerPageOptions={[5, 15, 25, 50]}
                        onRecordsPerPageChange={setPageSize}
                        onRowClick={(row) => GetGameInfoForModal(row.gameId)}
                    />
                </div>
            </Paper>
        </MediaQuery>

        {showGameModal && modalOpened && <LoggedInModal gameInfo={showGameModal} loggedInModal={setModalOpened} setTableDataUpdateNeeded={props.setTableDataUpdateNeeded}/>}

        </>
     );
}
 
export default LoggedInGamesTable;