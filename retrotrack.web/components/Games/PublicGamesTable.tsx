import { DataTable, DataTableSortStatus } from "mantine-datatable";
import Image from "next/image";
import { Group, LoadingOverlay, MediaQuery, Paper, TextInput, UnstyledButton } from "@mantine/core";
import { useEffect, useState } from "react";
import sortBy from 'lodash/sortBy';
import { IconSearch, IconSquareX } from '@tabler/icons';
import { useDebouncedValue } from "@mantine/hooks";
import { toast } from "react-toastify";
import { GetSpecificGameInfo } from "../../types/Api/Games/GetSpecificGameInfo";
import { DoGet } from "../../Helpers/webFetchHelper";
import LoggedOutModal from "./LoggedOutModal";
import { PublicGameTableProps } from "../../types/App/publicGameTable";

const PublicGamesTable = (props: PublicGameTableProps) => {
    const [pageSize, setPageSize] = useState(15);
    const [page, setPage] = useState(1);
    const [games, setGames] = useState(sortBy(props.gameData.slice(0, pageSize), 'gameName'));
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'gameName', direction: 'asc' });
    const [query, setQuery] = useState('');
    const [debouncedQuery] = useDebouncedValue(query, 200);
    const [totalRecords, setTotalRecords] = useState(props.gameData.length);
    const [showGameModal, setShowGameModal] = useState<GetSpecificGameInfo | undefined>(undefined);
    const [loadingOverlayVisible, setLoadingOverlayVisible] = useState(false);
    const [modalOpened, setModalOpened] = useState(true);

    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;

        const data = sortBy(props.gameData, sortStatus.columnAccessor);
        const sortedData = sortStatus.direction === 'desc' ? data.reverse() : data;

        const filteredGames = sortedData.filter(({gameName, achievementCount, gameGenre, players}) => {
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

        setTotalRecords(filteredGames.length);
        setGames(filteredGames.slice(from, to));

      }, [page, props.gameData, sortStatus, pageSize, debouncedQuery]);

      const GetGameInfoForModal = async (gameId: number) => {
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
        setShowGameModal(data);
        setLoadingOverlayVisible(false);
    }

    return ( 
        <>
        <MediaQuery smallerThan="sm" styles={{width: 600, marginLeft: 'auto', marginRight: 'auto', display: 'block'}}>
            <Paper shadow="md" p="md" withBorder mt={15}>
                <Group>
                <TextInput
                    sx={{width:'100%', marginBottom: 20}}
                    placeholder="Search games..."
                    icon={<IconSearch size={16} />}
                    value={query}
                    onChange={(e) => setQuery(e.currentTarget.value)}
                />
                <UnstyledButton sx={{marginBottom: 21, marginLeft:-45, zIndex: 1}} onClick={() => setQuery('')}>
                    <IconSquareX size={20} />
                </UnstyledButton>
                </Group>
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

        {showGameModal && modalOpened && <LoggedOutModal gameInfo={showGameModal} loggedOutModal={setModalOpened}/>}
        </>
     );
}
 
export default PublicGamesTable;