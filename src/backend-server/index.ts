import { WebSocketServer } from 'ws';
import { handleLoginRequest } from './handlers/login-handler';

export const enum RequestType {
    RegistrationLogin = 'reg',
    CreateRoom = 'create_room',
    AddUserToRoom = 'add_user_to_room',
    UpdateRoom = 'update_room',
    CreateGame = 'create_game',
}

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

    ws.on('connection', (socket) => {
        socket.on('message', (data) => {
            const requestBody: RequestBody = JSON.parse(String(data));

            if (requestBody.type === RequestType.RegistrationLogin) {
                handleLoginRequest(socket, requestBody.data);
            }
        });

        socket.on('close', (code, reason) => {
            console.log('Connection closed', code, String(reason));
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
