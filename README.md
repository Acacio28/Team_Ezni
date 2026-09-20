# Enzi Dev Website

## Structure

```
enzidev/
├── website/              # Static HTML website
│   ├── index.html        # Main HTML file
│   ├── css/
│   │   └── style.css     # Stylesheet
│   ├── js/
│   │   └── script.js     # JavaScript
│   └── images/
│       ├── Enzi.png      # Logo
│       └── team/         # Team member photos
│           ├── joaquim_martins.png
│           ├── lucia_pereira.jpeg
│           ├── anadelia_belita.jpeg
│           ├── manuel_godinho.jpeg
│           ├── baquito_felisberto.jpeg
│           ├── rabina_marques.jpeg
│           ├── joaquim_klaud.jpeg
│           ├── custodio.jpeg
│           └── sancho_salsinha.jpeg
│
├── django/               # Django backend
│   ├── enzi_website/     # Django project settings
│   ├── website/          # Django app
│   ├── manage.py         # Django management
│   ├── db.sqlite3        # SQLite database
│   └── venv/             # Python virtual environment
│
└── README.md             # This file
```

## How to Run

### Static Website
```bash
cd enzidev/website
python3 -m http.server 8000
```
Open: http://localhost:8000

### Django Backend
```bash
cd enzidev/django
source venv/bin/activate
python3 manage.py runserver
```
Open: http://localhost:8000

### Django Admin
Open: http://localhost:8000/admin/
- Username: admin
- Password: admin123

## Contact

- Email: enzi23dev@gmail.com
- Phone: +670 76726974
- WhatsApp: wa.me/67076726974
