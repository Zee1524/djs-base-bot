import { readdir } from 'fs/promises';
import path from 'path';
import logger from '../utils/logger.js';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function loadDirRecursive(dir) {
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    const files = [];

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...await loadDirRecursive(fullPath));
      } else if (entry.isFile() && entry.name.endsWith('.js')) {
        files.push(fullPath);
      }
    }

    return files;
  } catch (error) {
    logger.error(`Error reading directory ${dir}: ${error.message}`);
    return [];
  }
}

export default async function loadEvents(client) {
  try {
    const eventsPath = path.join(__dirname, '../events');

    
    const eventFiles = await loadDirRecursive(eventsPath);
    
    if (eventFiles.length === 0) {
      logger.warn('No event files found to load!');
      return;
    }

    for (const file of eventFiles) {
      try {
        const fileUrl = `file://${file}`;
        const eventModule = await import(fileUrl);
        const event = eventModule.default;
        
        if (!event || !event.name || typeof event.run !== 'function') {
          logger.warn(`Invalid event format in file: ${file}`);
          continue;
        }

        if (event.once) {
          client.once(event.name, (...args) => event.run(client, ...args));
        } else {
          client.on(event.name, (...args) => event.run(client, ...args));
        }

        logger.info(`Loaded event: ${event.name} (${event.once ? 'once' : 'on'})`);
      } catch (error) {
        logger.error(`Failed to load event file ${file}: ${error.message}`);
      }
    }

    logger.info(`Successfully loaded ${eventFiles.length} event files`);
  } catch (error) {
    logger.error(`Error in loadEvents: ${error.message}`);
  }
}