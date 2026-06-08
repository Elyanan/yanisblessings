# Deploy Yani's Blessings on cPanel (Node.js)

This site is a **Next.js** app with API routes, admin login, and Sanity CMS. It must run as a **Node.js application**, not as static HTML only.

## Requirements

- cPanel with **Setup Node.js App** (Node **20** or **22** recommended)
- Sanity project + API token
- Environment variables from `.env.example`

## Fix local `npm install` errors (Windows)

If you see `ERR_INVALID_ARG_TYPE` / `"from" argument must be of type string`:

1. **Rename the project folder** so the path has **no apostrophe** (e.g. `Yanis-Blessings-Website` instead of `Yani's Blessings Website`). This is a known npm + Windows issue.
2. Delete `node_modules` and run a clean install:

   ```bash
   npm run clean
   del package-lock.json
   npm install
   ```

3. If it still fails, upgrade Node to **22 LTS** from [nodejs.org](https://nodejs.org/) and run `npm install` again.

Warnings about `mute-stream` engines are suppressed via `package.json` overrides.

## Build on your computer (recommended)

```bash
npm install
npm run build
```

Upload to cPanel (via File Manager or FTP):

- `.next/standalone/` (entire folder)
- `.next/static/` → copy into `.next/standalone/.next/static/`
- `public/` → copy into `.next/standalone/public/`
- `server.js` (project root)
- `package.json` (minimal — only `next` is bundled in standalone; keep root `server.js` that points to standalone)

**Simpler approach:** upload the **whole project** (without `node_modules`), then on the server:

```bash
npm install
npm run build
npm start
```

## cPanel Node.js App setup

1. **Setup Node.js App** → Create application  
2. **Node version:** 20.x or 22.x  
3. **Application root:** folder where you uploaded the site  
4. **Application URL:** your domain or subdomain  
5. **Application startup file:** `server.js`  
6. **Application mode:** Production  

### Environment variables (cPanel → Node.js app → Environment)

Set at least:

| Variable | Example |
|----------|---------|
| `NODE_ENV` | `production` |
| `PORT` | (cPanel often sets this automatically) |
| `NEXT_PUBLIC_SITE_URL` | `https://yourdomain.com` |
| `AUTH_SECRET` | random 32+ char secret |
| `AUTH_URL` | `https://yourdomain.com` |
| `ADMIN_USERNAME` | your admin user |
| `ADMIN_PASSWORD` | strong password |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | from sanity.io |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` |
| `SANITY_API_TOKEN` | write token |
| `RESEND_API_KEY` | from resend.com |
| `RESEND_FROM_EMAIL` | e.g. `Yani's Blessings <noreply@yanisblessings.com>` |
| `ORDERS_EMAIL` | `orders@yanisblessings.com` |
| `OWNER_EMAIL` | `contact@yanisblessings.com` |

7. Click **Run NPM Install** (if available), then **Restart** the app.

## Verify

- Homepage loads  
- `/menu` works  
- `/cart` checkout  
- `/admin/login` (after env vars are set)

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `'next' is not recognized` | `npm install` did not finish — fix install locally, re-upload, or run install on server |
| 502 / app won't start | Check Node version ≥ 20, startup file = `server.js`, run `npm run build` |
| Admin login fails | Set `AUTH_SECRET`, `AUTH_URL`, `ADMIN_USERNAME`, `ADMIN_PASSWORD` |
| No products | Set Sanity env vars and publish content in Sanity |
