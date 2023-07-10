import { AddShipsReqData, RequestType } from '../../types';
import { gamesDB, sockets } from '../../globals';

export const handleAddShipsRequest = (data: string) => {
    const { gameId, ships, indexPlayer } = JSON.parse(data) as AddShipsReqData;

    gamesDB.updateGameUserShips(gameId, indexPlayer, ships);

    if (gamesDB.isUsersReadyForGameStart(gameId)) {
        const gameUsers = gamesDB.getGameUsers(gameId);
        const currentPlayerIndex = gamesDB.generateCurrentPlayerIndex(gameId);

        gamesDB.updateCurrentPlayerIndex(gameId, currentPlayerIndex);

        gameUsers.forEach((u) => {
            const userSocket = sockets[u.userIdx]!;

            userSocket.send(
                JSON.stringify({
                    type: RequestType.StartGame,
                    data: JSON.stringify({
                        ships: u.ships,
                        currentPlayerIndex,
                    }),
                    id: 0,
                }),
            );
        });
    }
};
