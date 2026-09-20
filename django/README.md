# Enzi Dev Website with Django Backend

## Database Structure

### Models

1. **TeamMember** - People/Nama
   - name, position, bio, photo, email, linkedin, twitter, order

2. **Address** - Alamat
   - name, street_address, city, state_province, postal_code, country, phone, email, latitude, longitude, is_main

3. **Service** - Layanan
   - title, slug, category, description, icon, features (JSON), order

4. **Project** - Proyek
   - title, slug, client, description, short_description, location, completion_date, image, technologies (JSON), status, is_featured, order

5. **Testimonial** - Testimoni Klien
   - client_name, client_position, client_company, content, rating, avatar, is_featured, order

6. **Partner** - Mitra
   - name, slug, logo, website, description, partnership_type, order

7. **FAQ** - Pertanyaan Umum
   - question, answer, category, order

8. **PricingPlan** - Paket Harga
   - name, plan_type, price, currency, billing_period, description, features (JSON), is_popular, order

9. **ContactMessage** - Pesan Kontak
   - name, email, phone, company, subject, message, is_read, is_replied

10. **CompanyInfo** - Info Perusahaan
    - key, value, description

## Quick Start

```bash
cd enzidev/django

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install Django
pip install django

# Run migrations
python3 manage.py migrate

# Create superuser
python3 manage.py createsuperuser

# Populate sample data
python3 manage.py populate_data

# Run server
python3 manage.py runserver
```

## Admin Access

- URL: http://localhost:8000/admin/
- Username: admin
- Password: admin123

## API Endpoints

- `GET /api/team/` - Team members
- `GET /api/services/` - Services
- `GET /api/projects/` - Projects
- `GET /api/projects/<slug>/` - Project detail
- `GET /api/testimonials/` - Testimonials
- `GET /api/partners/` - Partners
- `GET /api/faq/` - FAQ
- `GET /api/pricing/` - Pricing plans
- `GET /api/addresses/` - Addresses
- `POST /api/contact/` - Submit contact form
