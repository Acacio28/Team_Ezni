# Enzi Dev — Django Backend

Serves the static site (`../website/`), the JSON content API, and the `/admin/` panel.

## Quick Start

```bash
cd django

# One-time setup
python3 -m venv venv
source venv/bin/activate
pip install django
python3 manage.py migrate
python3 manage.py seed_content   # About chapters + Team members
python3 manage.py seed_posts     # Sample blog posts
python3 manage.py createsuperuser

# Run
python3 manage.py runserver 0.0.0.0:8000
```

- Website: http://127.0.0.1:8000/
- Admin: http://127.0.0.1:8000/admin/

## Models

1. **TeamMember** — people on the site
   - name, position, bio, photo, photo_url, phone, email, linkedin, twitter, order, is_active
2. **AboutChapter** — About section chapters (EN + Tetum)
   - key, title_en, title_tet, body_en, body_tet, order, is_active
3. **Post** — blog/news posts
   - title, slug, excerpt, content, category, tags, image, author, author_role, date, readTime, featured, is_active
4. **Address** — office addresses
   - name, street_address, city, state_province, postal_code, country, phone, email, latitude, longitude, is_main
5. **Service** — services offered
   - title, slug, category, description, icon, features (JSON), order
6. **Project** — portfolio projects
   - title, slug, client, description, short_description, location, completion_date, image, technologies (JSON), status, is_featured, order
7. **Testimonial** — client testimonials
   - client_name, client_position, client_company, content, rating, avatar, is_featured, order
8. **Partner** — partners
   - name, slug, logo, website, description, partnership_type, order
9. **FAQ** — frequently asked questions
   - question, answer, category, order
10. **PricingPlan** — pricing plans
    - name, plan_type, price, currency, billing_period, description, features (JSON), is_popular, order
11. **ContactMessage** — messages from the contact form
    - name, email, phone, company, subject, message, is_read, is_replied
12. **CompanyInfo** — key/value company settings
    - key, value, description

## API Endpoints

Public (read):

- `GET /api/auth/me/` — current session
- `GET /api/posts/`, `GET /api/posts/<pk>/` — posts
- `GET /api/about/` — About chapters
- `GET /api/team/` — team members
- `GET /api/services/`, `/api/projects/`, `/api/projects/<slug>/`
- `GET /api/testimonials/`, `/api/partners/`, `/api/faq/`, `/api/pricing/`
- `GET /api/addresses/`
- `POST /api/contact/` — submit contact form (guests allowed)

Auth (session-based):

- `POST /api/auth/login/` — `{username, password}`
- `POST /api/auth/logout/`

Write (staff session required, otherwise `403`):

- `POST /api/posts/`, `PUT|PATCH|DELETE /api/posts/<pk>/`
- `POST /api/about/`, `PUT|PATCH|DELETE /api/about/<pk>/`
- `POST /api/team/`, `PUT|PATCH|DELETE /api/team/<pk>/`

## Seed Commands

```bash
python3 manage.py seed_content   # 3 About chapters + 7 team members (idempotent)
python3 manage.py seed_posts     # Sample posts from website/js/posts-data.js (idempotent)
```

## Environment Variables

Settings read `DJANGO_SECRET_KEY`, `DJANGO_DEBUG`, `DJANGO_ALLOWED_HOSTS` from the environment — see `.env.example`. There is no dotenv loader, so export them in your shell before running.
