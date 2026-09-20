from django.urls import path
from . import views

app_name = 'website'

urlpatterns = [
    # Main page
    path('', views.index, name='index'),
    
    # API endpoints
    path('api/team/', views.api_team, name='api_team'),
    path('api/services/', views.api_services, name='api_services'),
    path('api/projects/', views.api_projects, name='api_projects'),
    path('api/projects/<slug:slug>/', views.api_project_detail, name='api_project_detail'),
    path('api/testimonials/', views.api_testimonials, name='api_testimonials'),
    path('api/partners/', views.api_partners, name='api_partners'),
    path('api/faq/', views.api_faq, name='api_faq'),
    path('api/pricing/', views.api_pricing, name='api_pricing'),
    path('api/addresses/', views.api_addresses, name='api_addresses'),
    path('api/contact/', views.api_contact, name='api_contact'),
]
