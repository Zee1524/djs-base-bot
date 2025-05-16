import process from 'process';
import logger from './logger.js';

process.on('unhandledRejection', err => {
  logger.error('Unhandled rejection:', err);
});

process.on('uncaughtException', err => {
  logger.error('Uncaught exception:', err);
});
