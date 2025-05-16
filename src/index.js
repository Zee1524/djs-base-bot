import { Client, GatewayIntentBits, Collection } from 'discord.js';
import dotenv from 'dotenv';
import loadCommands from './handlers/commandHandler.js';
import loadEvents from './handlers/eventHandler.js';
import logger from './utils/logger.js';
import './utils/antiCrash.js';

dotenv.config();

/*
process.on('unhandledRejection', (reason, promise) => {
  console.error('[ERROR] Unhandled rejection:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('[ERROR] Uncaught exception:', err);
});
*/
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();

(async () => {
  try {
    await loadCommands(client);
    await loadEvents(client);

    logger.info('All commands and events loaded successfully.');
    await client.login(process.env.TOKEN);
  } catch (error) {
    logger.error('Failed to start bot:', error);
  }
})();