import { RequestType, WebSocketWithIdx } from '../types';
import { WebSocketServer } from 'ws';
import {
    gamesDB,
    notifyAnotherUsersAboutRoomsUpdate,
    notifyUsersAboutWinnersUpdate,
    roomsDB,
    sockets,
    usersDB,
    winners,
} from '../globals';
import { handleLoginRequest } from './handlers/login-handler';
import { handleAddUserToRoomRequest, handleCreateRoomRequest } from './handlers/rooms-handler';
import { handleAddShipsRequest } from './handlers/ships-handler';
import { handleAttackRequest } from './handlers/attack-handler';
import { handleRandomAttackRequest } from './handlers/random-attack-handler';

type RequestBody = {
    type: RequestType;
    data: string;
    id: number;
};

export const createHttpBackEndServer = (): WebSocketServer => {
    const backendPort = 3000;

    const ws = new WebSocketServer({
        host: 'localhost',
        port: backendPort,
    });

    ws.on('connection', (socket: WebSocketWithIdx) => {
        socket.on('message', (data) => {
            const requestBody: RequestBody = JSON.parse(String(data));

            if (requestBody.type === RequestType.RegistrationLogin) {
                handleLoginRequest(socket, requestBody.data);
            }

            if (requestBody.type === RequestType.CreateRoom) {
                handleCreateRoomRequest(socket);
            }

            if (requestBody.type === RequestType.AddUserToRoom) {
                handleAddUserToRoomRequest(socket, requestBody.data);
            }

            if (requestBody.type === RequestType.AddShips) {
                handleAddShipsRequest(requestBody.data);
            }

            if (requestBody.type === RequestType.Attack) {
                handleAttackRequest(requestBody.data);
            }

            if (requestBody.type === RequestType.RandomAttack) {
                handleRandomAttackRequest(requestBody.data);
            }
        });

        socket.on('close', () => {
            const username = usersDB.getUserNameByIdx(socket.idx);

            if (username === 'unknown') return;

            const roomIdx = usersDB.getUserRoomIdx(username);

            roomsDB.removeUserFromTheRoom(username, roomIdx);

            const isUserInGame = usersDB.isUserInGame(username);

            if (isUserInGame) {
                const gameIdx = usersDB.getUserGameIdx(username);
                const gameUsers = gamesDB.getGameUsers(gameIdx);
                const winUser = gameUsers.find((u) => u.username !== username)!;
                const userSocket = sockets[winUser.userIdx]!;

                userSocket.send(
                    JSON.stringify({
                        type: RequestType.Finish,
                        data: JSON.stringify({
                            winPlayer: winUser.userIdx,
                        }),
                        id: 0,
                    }),
                );

                gameUsers.forEach((u) => {
                    usersDB.updateUserGameIdx(u.username, -1);
                });

                if (winners[username]) {
                    winners[username]!.wins += 1;
                } else {
                    winners[username] = {
                        wins: 1,
                    };
                }
            }

            notifyAnotherUsersAboutRoomsUpdate();
            notifyUsersAboutWinnersUpdate();
        });
    });

    ws.on('close', () => {
        // console.log('Connection closed');
    });

    ws.on('error', (/* err */) => {
        // console.error(err);
    });

    ws.on('listening', () => {
        console.log(`Start BackEnd ws server on the ws://localhost:${backendPort}`);
    });

    return ws;
};
