import { isMainThread } from 'worker_threads';
import glob from 'glob';
import path from 'path';

import config from '../../gameconfig';
import { WorkerPool } from '../worker/worker-pool';

const WORKER_LIMIT = config.decoder.threads;
let WORKER_POOL = null;

const initializeWorkerPool = () => {
    WORKER_POOL = new WorkerPool(
        // TODO: Подумать, как сделать более безопасно к изменениям
        path.join(__dirname, 'converter.worker.js'), 
        WORKER_LIMIT
    );
}

const convertVideos = () => {
    if (isMainThread) {
        if (!WORKER_POOL) {
            initializeWorkerPool();
        }

        const files = glob.sync(path.join(__dirname, config.server_resources, '**/*.bik'));
        files.forEach((fileName) => {
           WORKER_POOL.sheduleTask(fileName);
        });
    }
}

export { convertVideos };