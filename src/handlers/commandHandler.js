import { readdirSync } from 'fs';
import path from 'path';
import logger from '../utils/logger.js';

export default async function loadCommands(client) {
  const commandsPath = path.resolve('src/commands');
  const commandFiles = [];


  const folders = readdirSync(commandsPath);
  for (const folder of folders) {
    const folderPath = path.join(commandsPath, folder);
    const files = readdirSync(folderPath).filter(file => file.endsWith('.js'));
    for (const file of files) {
      commandFiles.push(path.join(folderPath, file));
    }
  }

  for (const filePath of commandFiles) {
    try {
      const CommandClass = (await import(`file://${filePath}`)).default;

      if (!CommandClass || typeof CommandClass !== 'function') {
        logger.warn(`Command at ${filePath} is not a valid class.`);
        continue;
      }

      const command = new CommandClass();


      if (!command.name || typeof command.execute !== 'function') {
        logger.warn(`Command at ${filePath} is missing name or execute method.`);
        continue;
      }

      client.commands.set(command.name, command);
      logger.info(`Loaded command: ${command.name}`);
    } catch (error) {
      logger.error(`Failed to load command at ${filePath}:`, error);
    }
  }
}