import { Worker } from 'worker_threads';

import config from '../../gameconfig.json';

export class WorkerPool {
    constructor(fileName, numOfWorkers) {
        this.numOfWorkers = numOfWorkers;
        this.fileName = fileName;
        this.queue = [];

        this.initializePool();
    }

    sheduleTask(workerData) {
        if (!this.pool.length) {
            throw new Error('No workers to complete the task!')
        }

        const workerTuple = this.pool.find((workerTuple) => {
            return !workerTuple.working;
        })

        if (!!workerTuple) {
            this.runTask(workerData, workerTuple);
            return;
        }

        this.queue.push(workerData);
    }

    getOnCompleteCallback(index) {
        return () => {
            console.log('Worker finished task!');
            this.tryRunTaskFromQueue(index);
        }
    }

    getOnErrorCallback(index) {
        return (error) => {
            console.log(error);
            this.tryRunTaskFromQueue(index);
        }
    }

    getOnExitCallback(index) {
        return (code) => {
            console.log('Worker finished with code ' + code);
        }
    }

    tryRunTaskFromQueue(workerIndex) {
        const workerTuple = this.pool[workerIndex];
        if (this.queue.length) {
            this.runTask(this.queue.shift(), workerTuple);
        } else {
            workerTuple.working = false;
        }
    }

    runTask(workerData, workerTuple) {
        console.log('Worker starting task ' + workerData);
        workerTuple.working = true;
        workerTuple.worker.postMessage(workerData);
    }

    initializePool() {
        this.pool = [];
        for (let i = 0; i < this.numOfWorkers; i++) {
            const worker = new Worker(
                this.fileName,
                {
                    resourceLimits: {
                        maxOldGenerationSizeMb: config.worker.maxOldGenerationSizeMb,
                        maxYoungGenerationSizeMb: config.worker.maxYoungGenerationSizeMb
                    }
                }
            );

            worker.on('message', this.getOnCompleteCallback(i));
            worker.on('error', this.getOnErrorCallback(i));
            worker.on('exit', this.getOnExitCallback(i));

            this.pool.push(
                {
                    worker: worker,
                    working: false
                }
            )
        }
    }
}