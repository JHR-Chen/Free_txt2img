const http = require('http');
const { existsSync, readFileSync } = require('fs');
const { join } = require('path');

const PORT = 8765;
const API_URL = 'https://apihub.agnes-ai.com/v1/images/generations';

function loadLocalEnv() {
  const envPath = join(__dirname, '.env');
  if (!existsSync(envPath)) {
    return;
  }

  const lines = readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const idx = trimmed.indexOf('=');
    if (idx === -1) {
      continue;
    }

    const key = trimmed.slice(0, idx).trim();
    let value = trimmed.slice(idx + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    if (key && !(key in process.env)) {
      process.env[key] = value;
    }
  }
}

loadLocalEnv();

const server = http.createServer(async (req, res) => {
  if (req.url === '/v1/images/generations' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      let payload;

      try {
        payload = JSON.parse(body || '{}');
      } catch {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ error: { message: 'Invalid JSON body' } }));
        return;
      }

      try {
        const apiRes = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + process.env.AGNES_API_KEY,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const data = await apiRes.text();
        res.writeHead(apiRes.status, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(data);
      } catch (err) {
        res.writeHead(502, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
          error: {
            message: err?.message || 'Failed to reach upstream image API'
          }
        }));
      }
    });
    return;
  }

  if (req.url === '/' || req.url === '/index.html') {
    const html = readFileSync(__dirname + '/index.html', 'utf-8');
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Not Found');
});

server.listen(PORT, () => {
  console.log(`服务已启动 http://localhost:${PORT}`);
  if (!process.env.AGNES_API_KEY) {
    console.log('警告: 未设置 AGNES_API_KEY 环境变量');
  }
});
