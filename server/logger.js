import factory from 'simple-node-logger';

const logger = factory.createSimpleLogger();
logger.setLevel('debug');

const consoleLogger = {
    debug: (data) => {
        console.log(data);
    },
    error: (data) => {
        console.log(data);
    }
}

export { consoleLogger as logger };