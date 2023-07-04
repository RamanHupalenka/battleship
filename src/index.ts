import { httpServer } from './http_server/index';

const PORT = 8181;

console.log(`Start http server on the http://localhost:${PORT} / http://127.0.0.1:${PORT}`);

httpServer.listen(PORT);
