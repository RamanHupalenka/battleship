import { GamesInfo, GameUserInfo, ShipsInfo } from '../../types';

export class GamesDB {
    private _games: GamesInfo = {};
    private _nextGameIdx = -1;

    addUsersToTheGame(gameIdx: number, gameUsers: GameUserInfo[]): void {
        this._games[gameIdx] = {
            gameUsers,
        };
    }

    getNextGameIdx(): number {
        this._nextGameIdx += 1;

        return this._nextGameIdx;
    }

    getGameUsers(gameIdx: number): GameUserInfo[] {
        return this._games[gameIdx]!.gameUsers;
    }

    generateCurrentPlayerIndex(gameIdx: number): number {
        const gameUsers = this.getGameUsers(gameIdx);
        const randomIndex = Math.floor(Math.random() * 2);

        return gameUsers[randomIndex]!.userIdx;
    }

    updateCurrentPlayerIndex(gameIdx: number, idx: number): void {
        this._games[gameIdx]!.currentPlayerIndex = idx;
    }

    updateGameUserShips(gameIdx: number, userIdx: number, ships: ShipsInfo[]): void {
        const idx = this._games[gameIdx]!.gameUsers.findIndex((u) => u.userIdx === userIdx);

        this._games[gameIdx]!.gameUsers[idx]!.ships = ships;
    }

    isUsersReadyForGameStart(gameIdx: number): boolean {
        return this._games[gameIdx]!.gameUsers.every((u) => u.ships.length > 0);
    }
}
