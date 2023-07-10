import { RequestType, WebSocketWithIdx } from '../types';
import { WebSocketServer } from 'ws';
import { notifyAnotherUsersAboutRoomsUpdate, roomsDB, usersDB } from '../globals';
import { handleLoginRequest } from './handlers/login-handler';
import { handleAddUserToRoomRequest, handleCreateRoomRequest } from './handlers/rooms-handler';
import { handleAddShipsRequest } from './handlers/ships-handler';

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
        });

        socket.on('close', () => {
            const username = usersDB.getUserNameByIdx(socket.idx);

            if (username === 'unknown') return;

            const roomIdx = usersDB.getUserRoomIdx(username);

            roomsDB.removeUserFromTheRoom(username, roomIdx);

            notifyAnotherUsersAboutRoomsUpdate();
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
