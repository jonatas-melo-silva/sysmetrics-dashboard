import os from 'node:os';
import path from 'node:path';
import { createApp } from './app';

const port = Number(process.env.PORT ?? 8765);
const host = process.env.HOST ?? '127.0.0.1';
const logDir = process.env.LOG_DIR ?? path.join(os.homedir(), 'system_logs');

createApp(logDir, Number(process.env.PUBLIC_PORT ?? port)).listen(port, host, () => {
  console.log(`sysmetrics-dashboard: http://${host}:${port} (logs em ${logDir})`);
});
