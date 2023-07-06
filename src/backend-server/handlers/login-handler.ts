import { WebSocket } from 'ws';
import { RequestType } from 'backend-server';
import { usersDB } from '../db/index';

type LoginReqData = {
    name: string;
    password: string;
};

type LoginResData = {
    name: string;
    index: number;
    error: boolean;
    errorText: string;
};

const sendResData = (socket: WebSocket, data: LoginResData): void => {
    socket.send(
        JSON.stringify({
            type: RequestType.RegistrationLogin,
            data: JSON.stringify(data),
            id: 0,
        }),
    );
};

export const handleLoginRequest = (socket: WebSocket, data: string): void => {
    const { password, name } = JSON.parse(data) as LoginReqData;
    const isUserDoesNotExists = usersDB.isNewUser(name);

    if (isUserDoesNotExists) {
        const index = usersDB.nextUserIdx;

        sendResData(socket, {
            name,
            index,
            error: false,
            errorText: '',
        });

        usersDB.addUser(name, {
            index,
            password,
            socket,
        });

        return;
    }

    const { index } = usersDB.getUserMetadata(name);
    const isUserPasswordValid = usersDB.isPasswordValid(name, password);

    if (isUserPasswordValid) {
        sendResData(socket, {
            name,
            index,
            error: false,
            errorText: '',
        });

        return;
    }

    sendResData(socket, {
        name,
        index,
        error: true,
        errorText: 'Your password is wrong, please, try again!',
    });
};
