# Deck Commander VPS Setup

## Current status
- Backend build passes locally
- API health endpoint works locally
- Production server can be started from `dist/server/index.js`

## Live start checklist
1. Copy the repo to your VPS
2. Create a real `.env` file on the VPS with:

```env
CLASH_API_KEY=your_real_supercell_api_key
HOST=0.0.0.0
PORT=3000
VITE_API_BASE_URL=http://5.75.140.186:3000
```

3. Install dependencies and build:

```bash
npm install
npm run build:all
```

4. Start the API permanently:

```bash
pm2 start dist/server/index.js --name clash-api
pm2 save
pm2 startup
```

5. Open the port in your VPS firewall:
- `3000/tcp` for the API
- later, `80/443` if you add a domain + HTTPS

## Important
- The frontend must be rebuilt if `VITE_API_BASE_URL` changes.
- For production, use a domain and reverse proxy instead of exposing port 3000 directly.

## 1. Environment
Create `.env` in project root:

```env
CLASH_API_KEY=your_supercell_api_key
HOST=0.0.0.0
PORT=3000
VITE_API_BASE_URL=http://5.75.140.186:3000
```

## 2. Local development
Run frontend and backend in separate terminals:

```bash
npm install
npm run dev:api
npm run dev
```

Frontend: `http://localhost:5173`
Backend health: `http://localhost:3000/api/health`

## 3. Production build on VPS

```bash
npm install
npm run build:all
```

## 4. Start backend on VPS

```bash
npm run start:api
```

For persistent process management:

```bash
npm install -g pm2
pm2 start dist/server/index.js --name clash-api
pm2 save
pm2 startup
```
