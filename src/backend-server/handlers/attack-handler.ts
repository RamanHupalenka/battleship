import { RequestType } from '../../types';
import { gamesDB, sockets } from '../../globals';

type AttackReqData = {
    x: number;
    y: number;
    gameId: number;
    indexPlayer: number;
};

type AttackResData = {
    position: {
        x: number;
        y: number;
    };
    currentPlayer: number;
    status: 'miss' | 'killed' | 'shot';
};

export const handleAttackRequest = (data: string) => {
    const { x, y, gameId, indexPlayer } = JSON.parse(data) as AttackReqData;

    if (gamesDB.getCurrentPlayerIndex(gameId) === indexPlayer) {
        const gameUsers = gamesDB.getGameUsers(gameId);
        const nextUser = gameUsers.filter((u) => u.userIdx !== indexPlayer).pop();
        const shotResult = gamesDB.getShootResult(gameId, { x, y });

        if (shotResult) {
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
                        } as AttackResData),
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
    }
};
