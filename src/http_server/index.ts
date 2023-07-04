import { readFile } from 'fs';
import * as http from 'http';
import { getFileInfoFromURL } from '../utils/path';

export const httpServer = http.createServer((req, res) => {
    const [__dirname] = getFileInfoFromURL(import.meta.url);
    const relativeFilePath = `/front${req.url === '/' ? '/index.html' : req.url}`; 
    const fullFilePath = `${__dirname}${relativeFilePath}`;

    readFile(fullFilePath, (err, data) => {
        if (err) {
            const errorInfo = JSON.stringify(err);

            res.writeHead(404);
            res.end(errorInfo);

            return;
        }

        res.writeHead(200);
        res.end(data);
    });
});
