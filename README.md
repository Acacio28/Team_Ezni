# Enzi Dev Website

Corporate landing page for **Enzi Dev** — an ICT company in Dili, Timor-Leste. Static frontend (HTML/CSS/JS) served by a Django backend that also provides the content API and admin panel.

## Structure

```
enzidev/
├── website/                  # Frontend (static site)
│   ├── index.html            # Single-page site: home, about, services, projects,
│   │                         #   activities, posts, team, contact, …
│   ├── css/style.css         # All styles
│   ├── js/script.js          # All behavior: i18n (EN/Tetum), animations, admin CRUD
│   ├── js/posts-data.js      # Post categories + seed source for posts
│   ├── favicon.svg
│   └── images/
│       ├── Enzi.png          # Social-share image (og/twitter)
│       ├── clients/          # Client logos (10)
│       └── team/             # Team member photos (7)
│
├── django/                   # Backend
│   ├── manage.py             # Django CLI
│   ├── db.sqlite3            # Database (local, git-ignored)
│   ├── venv/                 # Python virtualenv (git-ignored)
│   ├── enzi_website/         # Project settings, root URLs, WSGI
│   └── website/              # Main app
│       ├── models.py         # Content models (see django/README.md)
│       ├── views.py          # Page view + JSON API
│       ├── urls.py           # API routes
│       ├── admin.py          # /admin/ panel registrations
│       ├── migrations/       # Schema history
│       └── management/commands/
│           ├── seed_posts.py     # Seed sample blog posts
│           └── seed_content.py   # Seed About chapters + Team members
│
└── README.md                 # This file
```

## How to Run

Everything (site + API + admin) is served by **one Django server**.

```bash
cd django
python3 manage.py runserver 0.0.0.0:8000
```

Then open:

- **Website:** http://127.0.0.1:8000/
- **Admin:** http://127.0.0.1:8000/admin/

Stop the server with `Ctrl+C`.

### First-time setup

```bash
cd django
python3 -m venv venv
source venv/bin/activate
pip install django
python3 manage.py migrate
python3 manage.py seed_content   # About + Team
python3 manage.py seed_posts     # Sample posts
python3 manage.py createsuperuser
```

### Admin accounts

Manage users at `/admin/` (create one with `createsuperuser` above).

- Logged-in staff can edit **Posts**, **About**, and **Team** directly on the page (New / Edit / Delete buttons).
- Visitors without a session only see content — all write APIs return `403`.

## Contact

- Email: enzi23dev@gmail.com
- Phone: +670 76726974
- WhatsApp: wa.me/67076726974
