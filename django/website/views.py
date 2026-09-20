from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
import json

from .models import (
    TeamMember, Address, Service, Project,
    Testimonial, Partner, FAQ, PricingPlan,
    ContactMessage, CompanyInfo
)


def index(request):
    """Main page view"""
    context = {
        'team_members': TeamMember.objects.filter(is_active=True),
        'addresses': Address.objects.filter(is_active=True),
        'services': Service.objects.filter(is_active=True),
        'projects': Project.objects.filter(is_active=True)[:6],
        'testimonials': Testimonial.objects.filter(is_active=True)[:5],
        'partners': Partner.objects.filter(is_active=True),
        'faqs': FAQ.objects.filter(is_active=True),
        'pricing_plans': PricingPlan.objects.filter(is_active=True),
        'company_info': {ci.key: ci.value for ci in CompanyInfo.objects.all()},
    }
    return render(request, 'page.html', context)


# ===== API Views for AJAX =====

@require_http_methods(["GET"])
def api_team(request):
    """API endpoint for team members"""
    members = TeamMember.objects.filter(is_active=True).values(
        'id', 'name', 'position', 'bio', 'email', 'linkedin', 'twitter', 'order'
    )
    return JsonResponse({'team': list(members)})


@require_http_methods(["GET"])
def api_services(request):
    """API endpoint for services"""
    services = Service.objects.filter(is_active=True).values(
        'id', 'title', 'slug', 'category', 'description', 'icon', 'features', 'order'
    )
    return JsonResponse({'services': list(services)})


@require_http_methods(["GET"])
def api_projects(request):
    """API endpoint for projects"""
    projects = Project.objects.filter(is_active=True).values(
        'id', 'title', 'slug', 'client', 'description', 'short_description',
        'location', 'completion_date', 'technologies', 'status', 'is_featured', 'order'
    )
    return JsonResponse({'projects': list(projects)})


@require_http_methods(["GET"])
def api_project_detail(request, slug):
    """API endpoint for single project"""
    project = get_object_or_404(Project, slug=slug, is_active=True)
    data = {
        'id': project.id,
        'title': project.title,
        'client': project.client,
        'description': project.description,
        'short_description': project.short_description,
        'location': project.location,
        'completion_date': project.completion_date,
        'technologies': project.technologies,
        'status': project.status,
    }
    return JsonResponse({'project': data})


@require_http_methods(["GET"])
def api_testimonials(request):
    """API endpoint for testimonials"""
    testimonials = Testimonial.objects.filter(is_active=True).values(
        'id', 'client_name', 'client_position', 'client_company',
        'content', 'rating', 'is_featured', 'order'
    )
    return JsonResponse({'testimonials': list(testimonials)})


@require_http_methods(["GET"])
def api_partners(request):
    """API endpoint for partners"""
    partners = Partner.objects.filter(is_active=True).values(
        'id', 'name', 'website', 'partnership_type', 'order'
    )
    return JsonResponse({'partners': list(partners)})


@require_http_methods(["GET"])
def api_faq(request):
    """API endpoint for FAQ"""
    faqs = FAQ.objects.filter(is_active=True).values(
        'id', 'question', 'answer', 'category', 'order'
    )
    return JsonResponse({'faqs': list(faqs)})


@require_http_methods(["GET"])
def api_pricing(request):
    """API endpoint for pricing plans"""
    plans = PricingPlan.objects.filter(is_active=True).values(
        'id', 'name', 'plan_type', 'price', 'currency',
        'billing_period', 'description', 'features', 'is_popular', 'order'
    )
    return JsonResponse({'plans': list(plans)})


@require_http_methods(["GET"])
def api_addresses(request):
    """API endpoint for addresses"""
    addresses = Address.objects.filter(is_active=True).values(
        'id', 'name', 'street_address', 'city', 'state_province',
        'postal_code', 'country', 'phone', 'email', 'is_main'
    )
    return JsonResponse({'addresses': list(addresses)})


@require_http_methods(["POST"])
def api_contact(request):
    """API endpoint for contact form submission"""
    try:
        data = json.loads(request.body)
        message = ContactMessage.objects.create(
            name=data.get('name', ''),
            email=data.get('email', ''),
            phone=data.get('phone', ''),
            company=data.get('company', ''),
            subject=data.get('subject', 'general'),
            message=data.get('message', '')
        )
        return JsonResponse({
            'success': True,
            'message': 'Thank you! Your message has been sent.'
        })
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': str(e)
        }, status=400)
