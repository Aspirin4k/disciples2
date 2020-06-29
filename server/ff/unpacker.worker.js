import { parentPort } from 'worker_threads';

import { unpack } from './ff-unpacker';

parentPort.on('message', (workerData) => {
    const fileName = workerData;
    unpack(fileName);
    parentPort.postMessage('ok');
})