import logger from '../../utils/logger.js';

export default {
  name: 'interactionCreate',
  once: false,

  async run(client, interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) {
      logger.warn(`Command not found: ${interaction.commandName}`);
      return;
    }

    try {
      logger.info(`${interaction.user.tag} used /${interaction.commandName} in ${interaction.guild?.name || 'DM'}`);
      await command.execute(interaction, client);
    } catch (error) {
      logger.error(`Error executing command ${interaction.commandName}: ${error.message}`);
      logger.error(error.stack);

      const errorMessage = {
        content: 'There was an error while executing this command!',
        ephemeral: true
      };

      try {
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp(errorMessage);
        } else {
          await interaction.reply(errorMessage);
        }
      } catch (sendError) {
        logger.error(`Failed to send error message: ${sendError.message}`);
      }
    }
  }
};