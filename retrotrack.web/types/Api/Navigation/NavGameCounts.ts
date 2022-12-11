export interface LoggedOutGameTypes{
  games: { [key: string]: number };
}

export interface LoggedInGameTypes {
  games: { [key: string]: Game };
  gamesTracked: number;
  inProgressGames: number;
}

export interface Game {
  gamesTotalAndCompleted: string;
  percentage:     number;
}

export interface NavData {
  loggedOut?: LoggedOutGameTypes;
  loggedIn?: LoggedInGameTypes;
}