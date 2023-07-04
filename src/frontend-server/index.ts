import { readFile } from 'fs/promises';
import { createServer, IncomingMessage, ServerResponse } from 'http';
import { resolve } from 'path';
import { getFileInfoFromURL } from '../utils/path';

const handleError = (res: ServerResponse, err: unknown, statusCode: number): void => {
    const errorInfo = JSON.stringify(err);

    res.writeHead(statusCode);
    res.end(errorInfo);
};

const handleRequest = async (filePath: string, res: ServerResponse): Promise<void> => {
    try {
        const fileData = await readFile(filePath);

        res.writeHead(200);
        res.end(fileData);
    } catch (err) {
        handleError(res, err, 404);
    }
};

const requestsHandler = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
    try {
        const [__dirname] = getFileInfoFromURL(import.meta.url);
        const relativeFilePath = `../../front${req.url === '/' ? '/index.html' : req.url}`;
        const fullFilePath = resolve(__dirname, relativeFilePath);

        await handleRequest(fullFilePath, res);
    } catch (err) {
        handleError(res, err, 500);
    }
};

export const createHttpFrontEndServer = () => {
    const server = createServer(requestsHandler);

    const frontendPort = 8181;

    server.listen(frontendPort, () => {
        console.log(`Start FrondEnd http server on the http://localhost:${frontendPort}`);
    });

    return server;
};
