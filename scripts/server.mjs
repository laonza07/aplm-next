import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(fileURLToPath(new URL('../', import.meta.url)));
const port = Number(process.env.PORT || 4177);
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.woff2':'font/woff2','.ico':'image/x-icon'};
const server = http.createServer(async (request,response) => {
  if (!['GET','HEAD'].includes(request.method)) {response.writeHead(405,{'Allow':'GET, HEAD'});response.end();return;}
  try {
    const pathname = decodeURIComponent(new URL(request.url,'http://localhost').pathname);
    const resolved = path.resolve(root, '.' + pathname);
    const relative = path.relative(root,resolved);
    if (relative.startsWith('..') || path.isAbsolute(relative) || relative.split(path.sep).some(part => part.startsWith('.'))) { response.writeHead(403);response.end('Forbidden');return; }
    const file = (await stat(resolved)).isDirectory() ? path.join(resolved,'index.html') : resolved;
    const data = await readFile(file);
    response.writeHead(200,{'Content-Type':types[path.extname(file)] || 'application/octet-stream','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'});
    response.end(request.method === 'HEAD' ? undefined : data);
  } catch { response.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'});response.end('ไม่พบหน้าที่ต้องการ'); }
});
server.on('error',error => { console.error(error.code === 'EADDRINUSE' ? `Port ${port} is already in use. Set PORT to another port.` : error.message);process.exitCode=1; });
server.listen(port,'127.0.0.1',() => console.log(`APLM Next → http://127.0.0.1:${port}\nPress Ctrl+C to stop.`));
