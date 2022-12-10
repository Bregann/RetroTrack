import { DataTable, DataTableSortStatus } from "mantine-datatable";
import { PublicGameTableProps } from "../../../types/App/publicGameTable";
import Image from "next/image";
import { MediaQuery, Paper, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";
import sortBy from 'lodash/sortBy';
import { IconSearch } from '@tabler/icons';


const PublicGamesTable = (props: PublicGameTableProps) => {
    const [pageSize, setPageSize] = useState(15);
    const [page, setPage] = useState(1);
    const [games, setGames] = useState(sortBy(props.gameData.slice(0, pageSize), 'gameName'));
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'gameName', direction: 'asc' });
    const [query, setQuery] = useState('');

    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;

        const data = sortBy(props.gameData, sortStatus.columnAccessor);
        const sortedData = sortStatus.direction === 'desc' ? data.reverse() : data;

        setGames(sortedData.slice(from, to));
      }, [page, props.gameData, sortStatus, pageSize]);

    return ( 
        <>
        <MediaQuery smallerThan="sm" styles={{width: 600, marginLeft: 'auto', marginRight: 'auto', display: 'block'}}>
            <Paper shadow="md" p="md" withBorder mt={15}>
                <TextInput
                    placeholder="Search games..."
                    icon={<IconSearch size={16} />}
                    value={query}
                    onChange={(e) => setQuery(e.currentTarget.value)}
                />
                <DataTable 
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
                        }
                    ]}
                    totalRecords={props.gameData.length}
                    recordsPerPage={pageSize}
                    page={page}
                    onPageChange={(p) => setPage(p)}
                    sortStatus={sortStatus}
                    onSortStatusChange={setSortStatus}
                    recordsPerPageOptions={[5, 15, 25, 50]}
                    onRecordsPerPageChange={setPageSize}
                />
            </Paper>
        </MediaQuery>
        </>
     );
}
 
export default PublicGamesTable;