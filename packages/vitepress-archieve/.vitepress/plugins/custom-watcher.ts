import { type Plugin } from 'vitepress';
import { processFile } from '../../scripts/python-prepare';
import { sep } from 'node:path';

export function pythonWatcherPlugin(): Plugin {
  return {
    name: 'python-watcher',
    configureServer(server) {
      // Add more directories to watch as needed

      // server.watcher.add('./src/coding/python');
      server.watcher.on('change', (filePath) => {
        // Perform actions when a file changes
        if (filePath.includes(`coding${sep}python${sep}`)) {
          processFile(filePath);
        }
      });
    }
  };
}
