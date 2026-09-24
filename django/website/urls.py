from django.urls import path
from . import views

app_name = 'website'

urlpatterns = [
    # Main page (serves website/index.html)
    path('', views.index, name='index'),

    # Auth
    path('api/auth/login/', views.api_auth_login, name='api_auth_login'),
    path('api/auth/logout/', views.api_auth_logout, name='api_auth_logout'),
    path('api/auth/me/', views.api_auth_me, name='api_auth_me'),

    # Posts (CRUD — write requires admin session)
    path('api/posts/', views.api_posts, name='api_posts'),
    path('api/posts/<int:pk>/', views.api_post_detail, name='api_post_detail'),

    # About chapters (CRUD — write requires admin session)
    path('api/about/', views.api_about, name='api_about'),
    path('api/about/<int:pk>/', views.api_about_detail, name='api_about_detail'),

    # Other API endpoints
    path('api/team/', views.api_team, name='api_team'),
    path('api/team/<int:pk>/', views.api_team_detail, name='api_team_detail'),
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
