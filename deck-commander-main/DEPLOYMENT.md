# Deck Commander – VPS Deployment

Ein einziger Express-Prozess liefert API + Frontend aus.

## 1. Voraussetzungen
- Node.js 20+
- Clash Royale API Key von https://developer.clashroyale.com
- Public IP deines Servers bei Supercell whitelisten (sonst 403)

## 2. .env auf dem Server
```env
CLASH_API_KEY=dein_supercell_key
HOST=0.0.0.0
PORT=3000
# WICHTIG: gleiche Origin wie der Server, damit das Frontend die API trifft
VITE_API_BASE_URL=
```
`VITE_API_BASE_URL=` (leer) → das Frontend ruft `/api/...` relativ auf, also automatisch über denselben Express-Port.

## 3. Build & Start
```bash
cd deck-commander-main
npm install
npm run build:all          # baut Frontend (dist/client) + Server (dist/server)
node dist/server/standalone.js
```
Aufruf: `http://DEIN_SERVER:3000`

## 4. Persistent mit PM2
```bash
npm install -g pm2
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

## 5. Reverse Proxy (optional, mit Domain + HTTPS)
nginx/Caddy auf 80/443 → `proxy_pass http://127.0.0.1:3000`.

## Endpoints
- `GET /api/health` → `{ ok: true }`
- `GET /api/player/:tag` → Spielerdaten + Mock-Fallback bei API-Fehler
- alles andere → SPA (`dist/client/index.html`)

## Troubleshooting
| Problem | Ursache |
|---|---|
| 403 Clash API | Server-IP nicht bei Supercell whitelisted |
| Frontend lädt, API leer | `CLASH_API_KEY` fehlt in `.env` |
| 404 auf `/` | `npm run build` vergessen → kein `dist/client` |
| Mock Warning sichtbar | Backend bekam 403 oder Tag ungültig |
