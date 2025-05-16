import { EmbedBuilder } from 'discord.js';
import Command from '../../structures/Command.js';

export default class PingCommand extends Command {
  constructor() {
    super({
      name: 'ping',
      description: 'Check bot latency and websocket ping',
    });
  }

  async execute(interaction) {
    const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });

    const latency = sent.createdTimestamp - interaction.createdTimestamp;
    const wsPing = interaction.client.ws.ping;

    const embed = new EmbedBuilder()
      .setTitle('🏓 Pong!')
      .setColor(0x00bfff)
      .addFields(
        { name: 'Bot Latency', value: `\`${latency}ms\``, inline: true },
        { name: 'WebSocket Ping', value: `\`${wsPing}ms\``, inline: true }
      )
      .setTimestamp()
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });

    await interaction.editReply({ content: '', embeds: [embed] });
  }
}