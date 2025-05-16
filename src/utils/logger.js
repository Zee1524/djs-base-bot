import chalk from 'chalk';

const timestamp = () => chalk.gray(`[${new Date().toLocaleTimeString()}]`);

const logger = {
  info: (msg) => {
    console.log(`${timestamp()} ${chalk.blue('[INFO]')} ${msg}`);
  },
  warn: (msg) => {
    console.log(`${timestamp()} ${chalk.yellow('[WARN]')} ${msg}`);
  },
  error: (msg) => {
    console.log(`${timestamp()} ${chalk.red('[ERROR]')} ${msg}`);
  },
  success: (msg) => {
    console.log(`${timestamp()} ${chalk.green('[SUCCESS]')} ${msg}`);
  },
};

export default logger;