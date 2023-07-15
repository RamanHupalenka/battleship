import { GamesInfo, GameUserInfo, ShipPosition, ShipsInfo } from '../../types';

type ShotResult = {
    position: ShipPosition;
    status: 'miss' | 'killed' | 'shot';
};

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

    getCurrentPlayerIndex(gameIdx: number): number {
        return this._games[gameIdx]!.currentPlayerIndex!;
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

    getShootResult(gameIdx: number, position: ShipPosition): ShotResult | null {
        const { gameUsers, currentPlayerIndex } = this._games[gameIdx]!;
        const secondUserIndex = gameUsers.findIndex((u) => u.userIdx !== currentPlayerIndex);
        const secondUserGameInfo = gameUsers[secondUserIndex];
        const secondUserShipsInfo = secondUserGameInfo!.ships;
        const currentUserIndex = gameUsers.findIndex((u) => u.userIdx === currentPlayerIndex);
        const missedShoots = gameUsers[currentUserIndex]!.missedShoots;

        const isShootAlreadyInMissedShots = missedShoots.some(({ x, y }) => position.x === x && position.y === y);

        if (isShootAlreadyInMissedShots) {
            return null;
        }

        let shipIdx = 0;

        for (const { positions } of secondUserShipsInfo) {
            const shipWithShootPosition = positions!.findIndex(({ x, y }) => position.x === x && position.y === y);

            if (shipWithShootPosition >= 0 && positions![shipWithShootPosition]!.status === 'killed') {
                return null;
            }

            if (shipWithShootPosition >= 0) {
                const isShipKilled = positions!.every(
                    ({ status, x, y }) => status === 'killed' || (position.x === x && position.y === y),
                );

                this._games[gameIdx]!.gameUsers[secondUserIndex]!.ships[shipIdx]!.positions! = this._games[
                    gameIdx
                ]!.gameUsers[secondUserIndex]!.ships[shipIdx]!.positions!.map((pos, idx) => {
                    if (idx === shipWithShootPosition) {
                        return {
                            status: 'killed',
                            x: pos.x,
                            y: pos.y,
                        };
                    }

                    return pos;
                });

                return {
                    position,
                    status: isShipKilled ? 'killed' : 'shot',
                };
            }

            shipIdx += 1;
        }

        this._games[gameIdx]!.gameUsers[currentUserIndex]!.missedShoots.push(position);

        return {
            position,
            status: 'miss',
        };
    }

    getRandomShootResult(gameIdx: number): ShotResult {
        const randomX = Math.floor(Math.random() * 10);
        const randomY = Math.floor(Math.random() * 10);

        const randomResult = this.getShootResult(gameIdx, {
            x: randomX,
            y: randomY,
        });

        if (randomResult) {
            return randomResult;
        }

        return this.getRandomShootResult(gameIdx);
    }
}
