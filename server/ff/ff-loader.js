import { isMainThread } from 'worker_threads';
import path from 'path';
import glob from 'glob';

import { WorkerPool } from '../worker/worker-pool';
import config from '../../gameconfig.json';
import { unpack } from './ff-unpacker';

const WORKER_LIMIT = 4;
let WORKER_POOL = null;

const initializeWorkerPool = () => {
    WORKER_POOL = new WorkerPool(
        // TODO: Подумать, как сделать более безопасно к изменениям
        path.join(__dirname, 'unpacker.worker.js'), 
        WORKER_LIMIT
    );
}

const unpackFFs = () => {
    if (isMainThread) {
        if (!WORKER_POOL) {
            initializeWorkerPool();
        }

        const files = glob.sync(path.join(__dirname, config.server_resources, '**/*.ff'));
        files.forEach((fileName) => {
           WORKER_POOL.sheduleTask(fileName);
        });
    }
}

export { unpackFFs };