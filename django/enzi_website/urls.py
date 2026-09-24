from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve
from pathlib import Path

WEBSITE_DIR = Path(settings.BASE_DIR).parent / 'website'

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('website.urls')),
]

# Serve static site assets (css/js/images/favicon) same-origin with API
if WEBSITE_DIR.is_dir():
    urlpatterns += [
        re_path(r'^(?P<path>favicon\.svg)$', serve, {'document_root': str(WEBSITE_DIR)}),
    ]

if (WEBSITE_DIR / 'css').is_dir():
    urlpatterns += [
        re_path(r'^css/(?P<path>.*)$', serve, {'document_root': WEBSITE_DIR / 'css'}),
        re_path(r'^js/(?P<path>.*)$', serve, {'document_root': WEBSITE_DIR / 'js'}),
        re_path(r'^images/(?P<path>.*)$', serve, {'document_root': WEBSITE_DIR / 'images'}),
    ]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
