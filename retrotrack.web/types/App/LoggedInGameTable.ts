import { Game } from "../Api/Games/LoggedInGame";

export interface LoggedInGameTableProps {
    gameData: Game[];
    setTableDataUpdateNeeded?: (toggleState: boolean) => void; //used for updating the table in /trackedgames and /inprogressgames
}