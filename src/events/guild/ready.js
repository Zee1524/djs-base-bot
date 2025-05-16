import { REST, Routes } from 'discord.js';
import logger from '../../utils/logger.js';

export default {
  name: 'ready',
  once: true,
  
  async run(client) {
    logger.info(`Logged in as ${client.user.tag}`);

    const commands = client.commands
      .filter(cmd => cmd.data && typeof cmd.data.toJSON === 'function')
      .map(cmd => cmd.data.toJSON());

    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

    try {
      logger.info(`Registering ${commands.length} slash command(s)...`);
      await rest.put(
        Routes.applicationCommands(client.user.id),
        { body: commands }
      );
      logger.info('Slash commands registered.');
    } catch (err) {
      logger.error(`Failed to register slash commands: ${err.message}`);
    }
  }
};