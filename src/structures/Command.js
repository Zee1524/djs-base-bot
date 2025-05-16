import { SlashCommandBuilder } from 'discord.js';

/**
 * @typedef {Object} CommandOptions
 * @property {string} name
 * @property {string} description
 * @property {import('discord.js').ApplicationCommandOption[]} [options]
 * @property {boolean} [devOnly=false]
 */

export default class Command {
  /**
   * @param {CommandOptions} options
   */
  constructor(options) {
    if (!options || typeof options !== 'object') {
      throw new TypeError('Command options must be an object');
    }
    if (!options.name || typeof options.name !== 'string') {
      throw new TypeError('Command must have a valid name');
    }
    if (!options.description || typeof options.description !== 'string') {
      throw new TypeError('Command must have a valid description');
    }

    this.name = options.name;
    this.description = options.description;
    this.options = Array.isArray(options.options) ? options.options : [];
    this.devOnly = options.devOnly === true;

  
    const builder = new SlashCommandBuilder()
      .setName(this.name)
      .setDescription(this.description);


    for (const opt of this.options) {
      builder[`add${opt.type}Option`]?.(input => {
        input.setName(opt.name)
          .setDescription(opt.description)
          .setRequired(opt.required ?? false);
        return input;
      });
    }

    this.data = builder;
  }

  async execute(interaction, client) {
    throw new Error(`Command ${this.name} doesn't provide an execute method!`);
  }
}