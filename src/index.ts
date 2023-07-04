import { createHttpBackEndServer } from './backend-server/index';
import { createHttpFrontEndServer } from './frontend-server/index';

try {
    const backend = createHttpBackEndServer();
    const frontend = createHttpFrontEndServer();

    process.on('SIGINT', (signal) => {
        if (signal === 'SIGINT') {
            backend.close();
            frontend.close();

            process.exit();
        }
    });
} catch {
    console.error('Something went wrong');

    process.exit(1);
}
