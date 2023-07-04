import { WebSocketServer } from 'ws';

export const createHttpBackEndServer = (): WebSocketServer => {
    const backendPort = 3000;

    const ws = new WebSocketServer({
        host: 'localhost',
        port: backendPort,
    });

    ws.on('connection', (sok, req) => {
        console.log(sok, req);
    });

    ws.on('close', () => {
        console.log('Connection closed');
    });

    ws.on('error', (err) => {
        console.error(err);
    });

    ws.on('listening', () => {
        console.log(`Start BackEnd ws server on the ws://localhost:${backendPort}`);
    });

    return ws;
};
