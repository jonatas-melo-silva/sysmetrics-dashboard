import { createServer, type Server } from 'node:http';
import { DAY, listDays, readDay } from './logs';

/**
 * Servidor somente leitura. Recusa Host diferente de 127.0.0.1 ou localhost
 * (barra DNS rebinding) e não envia CORS, então só a extensão consegue ler.
 * `publicPort` é a porta que o cliente enxerga, caso difira da porta de escuta.
 */
export function createApp(logDir: string, publicPort?: number): Server {
  return createServer(async (req, res) => {
    const send = (status: number, body?: unknown) => {
      res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
      res.end(body === undefined ? '' : JSON.stringify(body));
    };

    if (req.method !== 'GET') return send(405);
    const port = publicPort ?? req.socket.localPort;
    if (req.headers.host !== `127.0.0.1:${port}` && req.headers.host !== `localhost:${port}`) {
      return send(403);
    }

    let pathname: string;
    try {
      pathname = new URL(req.url ?? '/', 'http://localhost').pathname;
    } catch {
      return send(400);
    }

    if (pathname === '/days') return send(200, await listDays(logDir));
    const match = /^\/day\/(\d{8})$/.exec(pathname);
    if (match?.[1] && DAY.test(match[1])) return send(200, await readDay(logDir, match[1]));
    return send(404);
  });
}
