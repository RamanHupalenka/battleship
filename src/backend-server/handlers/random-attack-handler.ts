import { RequestType } from '../../types';
import { gamesDB, sockets } from '../../globals';

type RandomAttackReqData = {
    gameId: number;
    indexPlayer: number;
};

type RandomAttackResData = {
    position: {
        x: number;
        y: number;
    };
    currentPlayer: number;
    status: 'miss' | 'killed' | 'shot';
};

export const handleRandomAttackRequest = (data: string) => {
    const { gameId, indexPlayer } = JSON.parse(data) as RandomAttackReqData;

    if (gamesDB.getCurrentPlayerIndex(gameId) === indexPlayer) {
        const gameUsers = gamesDB.getGameUsers(gameId);
        const nextUser = gameUsers.filter((u) => u.userIdx !== indexPlayer).pop();
        const shotResult = gamesDB.getRandomShootResult(gameId);
        const nextCurrentPlayer = shotResult.status === 'miss' ? nextUser!.userIdx : indexPlayer;

        gamesDB.updateCurrentPlayerIndex(gameId, nextCurrentPlayer);

        gameUsers.forEach((u) => {
            const userSocket = sockets[u.userIdx]!;

            userSocket.send(
                JSON.stringify({
                    type: RequestType.Attack,
                    data: JSON.stringify({
                        currentPlayer: indexPlayer,
                        ...shotResult,
                    } as RandomAttackResData),
                    id: 0,
                }),
            );

            userSocket.send(
                JSON.stringify({
                    type: RequestType.Turn,
                    data: JSON.stringify({
                        currentPlayer: nextCurrentPlayer,
                    }),
                    id: 0,
                }),
            );
        });
    }
};
