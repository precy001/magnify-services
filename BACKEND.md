# Backend setup

## 1. Create the database

In phpMyAdmin, run `database.sql` (Import tab → choose the file → Go).

This creates:
- `contact_submissions` — stores form submissions
- `admin_users` — stores the admin login (seeded with **admin / changeme**)

## 2. Configure the DB connection

Edit `api/db.php` if your MySQL credentials differ from XAMPP defaults
(user `root`, empty password).

## 3. Change the admin password

Generate a new hash:

```bash
php -r "echo password_hash('your-new-password', PASSWORD_BCRYPT);"
```

Then in phpMyAdmin:

```sql
UPDATE admin_users SET password_hash = '<the-hash>' WHERE username = 'admin';
```

## 4. Run it

### On XAMPP (simplest)

Place the project inside `htdocs/` and open
`http://localhost/<project-folder>/` — Apache serves the built React app
(run `npm run build` first) and executes the `api/` PHP files directly.

### For development with `npm run dev`

Run two servers side-by-side:

```bash
# terminal 1 — PHP
php -S localhost:8000 -t .

# terminal 2 — Vite
npm run dev
```

Vite (at http://localhost:8080) proxies `/api/*` to the PHP server.

## Admin dashboard

Visit `/admin` (e.g. http://localhost:8080/admin).

## Endpoints

| Method | Path                             | Purpose                  |
|--------|----------------------------------|--------------------------|
| POST   | `/api/contact.php`               | Submit contact form      |
| POST   | `/api/admin.php?action=login`    | Log in (sets session)    |
| POST   | `/api/admin.php?action=logout`   | Log out                  |
| GET    | `/api/admin.php?action=me`       | Check session            |
| GET    | `/api/admin.php?action=list`     | List submissions         |
| POST   | `/api/admin.php?action=delete`   | Delete submission `{id}` |
