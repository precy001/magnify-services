# PHP Backend Setup

This project ships a PHP backend for the contact form plus a password-protected
admin dashboard. It uses **SQLite by default** (no DB server required) and
supports MySQL as an alternative.

## Layout

```
api/
  config.php         ← edit: DB driver, admin password hash, notify email
  db.php             ← PDO connection + schema auto-init
  submit.php         ← POST endpoint the contact form calls
admin/
  index.php          ← redirects to login or dashboard
  login.php          ← admin login
  logout.php
  dashboard.php      ← list of submissions (search + filter + pagination)
  view.php           ← view a single submission
  action.php         ← CSRF-checked mark read / delete / bulk actions
  includes/          ← shared auth + layout
  assets/style.css
data/                ← SQLite DB lives here (denied to the web by .htaccess)
```

## Requirements

- PHP 8.0+ with PDO and either the `pdo_sqlite` or `pdo_mysql` extension.
- For local dev: Node.js (existing setup) + PHP CLI (`php -v`).
- For production: any PHP-capable host — shared hosting, Apache+PHP-FPM, Nginx+PHP-FPM, LAMP, etc.

## First-time configuration

1. Open `api/config.php`.
2. **Change the admin password.** Generate a new bcrypt hash:
   ```bash
   php -r "echo password_hash('your-new-password', PASSWORD_BCRYPT) . PHP_EOL;"
   ```
   Paste the result into `ADMIN_PASSWORD_HASH` (or set the `ADMIN_PASSWORD_HASH` env var).
3. Optional: set `NOTIFY_EMAIL` to receive an email on every new submission.
4. Optional: lock `ALLOWED_ORIGIN` to your production domain.
5. If you'd rather use MySQL, set `DB_DRIVER` to `mysql` and fill in the MySQL
   credentials. The schema auto-creates on first request.

Default login (CHANGE BEFORE GOING LIVE): `admin` / `changeme`

## Local development

You'll run **two** dev servers at once: Vite (for the React app) and PHP
(for the backend). Vite proxies `/api` and `/admin` to the PHP server.

**Terminal 1 — start PHP** (from the project root):

```bash
php -S localhost:8000 -t .
```

**Terminal 2 — start Vite:**

```bash
npm install       # first time only
npm run dev
```

Then:

- App:       http://localhost:8080
- Contact:   http://localhost:8080/contact  (submits to `/api/submit.php`)
- Admin:     http://localhost:8080/admin/login.php

If you need the PHP server on a different host or port, set
`VITE_PHP_BACKEND_URL` before starting Vite:

```bash
VITE_PHP_BACKEND_URL=http://127.0.0.1:9000 npm run dev
```

## Production deployment

### Option A — Apache / shared hosting (simplest)

1. Build the frontend: `npm run build`. This produces `dist/`.
2. Upload the **contents of `dist/`** plus the **`api/`**, **`admin/`**, and
   **`data/`** directories to your webroot (typically `public_html/`).
3. Ensure `data/` is writable by PHP (`chmod 775 data/` and match the webserver user).
4. Copy `.htaccess` from the repo root to the webroot. It:
   - Lets `/api/*.php` and `/admin/*.php` through to PHP.
   - Serves real files (images, JS, CSS) as-is.
   - Falls back everything else to `index.html` so React Router works.
5. Verify:
   - https://yoursite.com/contact → submit a test message.
   - https://yoursite.com/admin/ → log in, see the submission.

### Option B — Nginx + PHP-FPM

Rough server block:

```nginx
server {
    server_name magnifyservices.com;
    root /var/www/magnify-services;
    index index.html;

    # Deny direct access to the SQLite DB.
    location ^~ /data/ { deny all; return 404; }

    # PHP endpoints.
    location ~ ^/(api|admin)/.*\.php$ {
        include fastcgi_params;
        fastcgi_pass unix:/run/php/php8.3-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    }

    # Static files + SPA fallback.
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Option C — Docker / custom

Any PHP-capable image works. Mount `data/` as a persistent volume so the SQLite
file survives container restarts.

## Troubleshooting

**`SQLSTATE[HY000] [14] unable to open database file`**
`data/` isn't writable. `chmod 775 data/` and make sure PHP's user owns it.

**Admin login silently fails**
You probably edited the password but kept the `getenv('ADMIN_PASSWORD_HASH') ?:`
fallback wrong. Re-run the `password_hash` command and paste the complete
`$2y$10$…` string.

**CORS errors in the browser console**
You deployed the frontend and API on different origins. Set `ALLOWED_ORIGIN` in
`api/config.php` to your frontend URL (e.g. `https://magnifyservices.com`).

**`mail()` doesn't send notifications**
Shared hosts often block `mail()`. Either set up SPF/DKIM, use your host's
relay, or swap `mail()` in `api/submit.php` for an SMTP library (PHPMailer,
Symfony Mailer).

## Security checklist before going live

- [ ] Changed `ADMIN_PASSWORD_HASH` away from the default.
- [ ] Set `ALLOWED_ORIGIN` to your production domain (not `*`).
- [ ] Set `DEBUG_MODE` to `false` (default).
- [ ] Serving over HTTPS (session cookies auto-upgrade to Secure under HTTPS).
- [ ] `data/` is outside the webroot OR the `.htaccess` there is honored by
      your webserver (verified by trying to open `/data/contact.db` in a browser
      and getting a 403 / 404).
- [ ] Rotate `ADMIN_PASSWORD_HASH` periodically.
