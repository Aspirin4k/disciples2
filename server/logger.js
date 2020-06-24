import factory from 'simple-node-logger';

const logger = factory.createSimpleLogger();
logger.setLevel('debug');

export { logger };