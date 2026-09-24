from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse, FileResponse, Http404
from django.views.decorators.http import require_http_methods, require_POST
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.utils.dateparse import parse_date
from pathlib import Path
import json

from .models import (
    TeamMember, Address, Service, Project,
    Testimonial, Partner, FAQ, PricingPlan,
    ContactMessage, CompanyInfo, Post, AboutChapter
)

WEBSITE_DIR = Path(__file__).resolve().parent.parent.parent / 'website'


def _is_admin(user):
    return user.is_authenticated and (user.is_staff or user.is_superuser)


def _json_body(request):
    try:
        return json.loads(request.body.decode('utf-8') or '{}')
    except (json.JSONDecodeError, UnicodeDecodeError):
        return {}


def _post_to_dict(p, full=False):
    data = {
        'id': p.id,
        'slug': p.slug,
        'featured': p.featured,
        'title': p.title,
        'excerpt': p.excerpt,
        'category': p.category,
        'tags': p.tags or [],
        'image': p.image,
        'author': p.author,
        'authorRole': p.author_role,
        'date': p.date.isoformat() if p.date else '',
        'readTime': p.read_time,
    }
    if full:
        data['content'] = p.content
    return data


def _validate_post_payload(data, partial=False):
    errors = {}
    if not partial or 'title' in data:
        title = (data.get('title') or '').strip()
        if not title:
            errors['title'] = 'Title is required.'
        elif len(title) > 300:
            errors['title'] = 'Title max 300 characters.'
    if not partial or 'content' in data:
        content = (data.get('content') or '').strip()
        if not content:
            errors['content'] = 'Content is required.'
    if 'date' in data or not partial:
        date = data.get('date')
        if not date:
            errors['date'] = 'Date is required.'
        elif not parse_date(date):
            errors['date'] = 'Invalid date (use YYYY-MM-DD).'
    if 'readTime' in data or not partial:
        try:
            rt = int(data.get('readTime', 3))
            if rt < 1 or rt > 120:
                raise ValueError
        except (TypeError, ValueError):
            errors['readTime'] = 'Read time must be 1–120 minutes.'
    if 'category' in data or not partial:
        cat = (data.get('category') or '').strip()
        if len(cat) > 50:
            errors['category'] = 'Category max 50 characters.'
    return errors


def _apply_post_payload(post, data):
    if 'title' in data:
        post.title = data['title'].strip()
    if 'excerpt' in data:
        post.excerpt = (data.get('excerpt') or '').strip()[:500]
    if 'content' in data:
        post.content = (data.get('content') or '').strip()
    if 'category' in data:
        post.category = (data.get('category') or 'Company').strip() or 'Company'
    if 'tags' in data:
        tags = data.get('tags')
        if isinstance(tags, str):
            tags = [t.strip() for t in tags.split(',') if t.strip()]
        if not isinstance(tags, list):
            tags = []
        post.tags = [str(t)[:50] for t in tags][:20]
    if 'image' in data:
        post.image = (data.get('image') or '').strip()[:500]
    if 'author' in data:
        post.author = (data.get('author') or '').strip()[:100]
    if 'authorRole' in data:
        post.author_role = (data.get('authorRole') or '').strip()[:100]
    if 'date' in data and data['date']:
        post.date = parse_date(data['date'])
    if 'readTime' in data:
        post.read_time = max(1, min(120, int(data.get('readTime') or 3)))
    if 'featured' in data:
        post.featured = bool(data.get('featured'))
    if 'is_active' in data:
        post.is_active = bool(data.get('is_active'))


@ensure_csrf_cookie
def index(request):
    """Serve the static Enzi Dev landing page (same-origin with API)."""
    index_path = WEBSITE_DIR / 'index.html'
    if not index_path.exists():
        raise Http404
    return FileResponse(open(index_path, 'rb'), content_type='text/html; charset=utf-8')


# ===== Auth =====

@require_POST
def api_auth_login(request):
    data = _json_body(request)
    username = (data.get('username') or '').strip()
    password = data.get('password') or ''
    if not username or not password:
        return JsonResponse({'success': False, 'message': 'Username and password required.'}, status=400)
    user = authenticate(request, username=username, password=password)
    if user is None:
        return JsonResponse({'success': False, 'message': 'Invalid username or password.'}, status=401)
    if not (user.is_staff or user.is_superuser):
        return JsonResponse({'success': False, 'message': 'Admin access required.'}, status=403)
    login(request, user)
    return JsonResponse({
        'success': True,
        'user': {'username': user.username, 'isStaff': True}
    })


@require_POST
def api_auth_logout(request):
    logout(request)
    return JsonResponse({'success': True})


@require_http_methods(["GET"])
def api_auth_me(request):
    if request.user.is_authenticated:
        return JsonResponse({
            'authenticated': True,
            'user': {
                'username': request.user.username,
                'isStaff': _is_admin(request.user),
            }
        })
    return JsonResponse({'authenticated': False, 'user': None})


# ===== Posts API =====

@require_http_methods(["GET", "POST"])
def api_posts(request):
    """GET: public list. POST: create (admin only)."""
    if request.method == 'GET':
        qs = Post.objects.filter(is_active=True)
        posts = [_post_to_dict(p, full=True) for p in qs]
        return JsonResponse({'posts': posts, 'count': len(posts)})

    # POST create
    if not _is_admin(request.user):
        return JsonResponse({'success': False, 'message': 'Admin access required.'}, status=403)
    data = _json_body(request)
    errors = _validate_post_payload(data)
    if errors:
        return JsonResponse({'success': False, 'errors': errors}, status=400)
    post = Post()
    _apply_post_payload(post, data)
    post.save()
    return JsonResponse({'success': True, 'post': _post_to_dict(post, full=True)}, status=201)


@require_http_methods(["GET", "PUT", "PATCH", "DELETE"])
def api_post_detail(request, pk):
    """GET public (incl. inactive for admin). PUT/PATCH/DELETE admin only."""
    try:
        post = Post.objects.get(pk=pk)
    except Post.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'Post not found.'}, status=404)

    if request.method == 'GET':
        if not post.is_active and not _is_admin(request.user):
            return JsonResponse({'success': False, 'message': 'Post not found.'}, status=404)
        return JsonResponse({'post': _post_to_dict(post, full=True)})

    if not _is_admin(request.user):
        return JsonResponse({'success': False, 'message': 'Admin access required.'}, status=403)

    if request.method == 'DELETE':
        title = post.title
        post.delete()
        return JsonResponse({'success': True, 'message': f'Deleted "{title}".'})

    # PUT / PATCH update
    data = _json_body(request)
    partial = request.method == 'PATCH'
    errors = _validate_post_payload(data, partial=partial)
    if errors:
        return JsonResponse({'success': False, 'errors': errors}, status=400)
    _apply_post_payload(post, data)
    post.save()
    return JsonResponse({'success': True, 'post': _post_to_dict(post, full=True)})


# ===== About Chapters API =====

def _about_to_dict(c):
    return {
        'id': c.id,
        'key': c.key,
        'titleEn': c.title_en,
        'titleTet': c.title_tet,
        'bodyEn': c.body_en,
        'bodyTet': c.body_tet,
        'order': c.order,
    }


def _validate_about_payload(data, partial=False):
    errors = {}
    if not partial or 'key' in data:
        key = (data.get('key') or '').strip()
        if not key:
            errors['key'] = 'Key is required.'
        elif len(key) > 40:
            errors['key'] = 'Key max 40 characters.'
    if not partial or 'titleEn' in data:
        if not (data.get('titleEn') or '').strip():
            errors['titleEn'] = 'English title is required.'
    if not partial or 'bodyEn' in data:
        if not (data.get('bodyEn') or '').strip():
            errors['bodyEn'] = 'English body is required.'
    return errors


def _apply_about_payload(chapter, data):
    if 'key' in data:
        chapter.key = (data.get('key') or '').strip()[:40]
    if 'titleEn' in data:
        chapter.title_en = (data.get('titleEn') or '').strip()[:200]
    if 'titleTet' in data:
        chapter.title_tet = (data.get('titleTet') or '').strip()[:200]
    if 'bodyEn' in data:
        chapter.body_en = (data.get('bodyEn') or '').strip()
    if 'bodyTet' in data:
        chapter.body_tet = (data.get('bodyTet') or '').strip()
    if 'order' in data:
        try:
            chapter.order = int(data.get('order') or 0)
        except (TypeError, ValueError):
            pass
    if 'is_active' in data:
        chapter.is_active = bool(data.get('is_active'))


@require_http_methods(["GET", "POST"])
def api_about(request):
    """GET: public chapters. POST: create (admin only)."""
    if request.method == 'GET':
        qs = AboutChapter.objects.filter(is_active=True)
        chapters = [_about_to_dict(c) for c in qs]
        return JsonResponse({'chapters': chapters, 'count': len(chapters)})

    if not _is_admin(request.user):
        return JsonResponse({'success': False, 'message': 'Admin access required.'}, status=403)
    data = _json_body(request)
    errors = _validate_about_payload(data)
    if errors:
        return JsonResponse({'success': False, 'errors': errors}, status=400)
    chapter = AboutChapter()
    _apply_about_payload(chapter, data)
    chapter.save()
    return JsonResponse({'success': True, 'chapter': _about_to_dict(chapter)}, status=201)


@require_http_methods(["GET", "PUT", "PATCH", "DELETE"])
def api_about_detail(request, pk):
    try:
        chapter = AboutChapter.objects.get(pk=pk)
    except AboutChapter.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'Chapter not found.'}, status=404)

    if request.method == 'GET':
        if not chapter.is_active and not _is_admin(request.user):
            return JsonResponse({'success': False, 'message': 'Chapter not found.'}, status=404)
        return JsonResponse({'chapter': _about_to_dict(chapter)})

    if not _is_admin(request.user):
        return JsonResponse({'success': False, 'message': 'Admin access required.'}, status=403)

    if request.method == 'DELETE':
        key = chapter.key
        chapter.delete()
        return JsonResponse({'success': True, 'message': f'Deleted "{key}".'})

    data = _json_body(request)
    partial = request.method == 'PATCH'
    errors = _validate_about_payload(data, partial=partial)
    if errors:
        return JsonResponse({'success': False, 'errors': errors}, status=400)
    _apply_about_payload(chapter, data)
    chapter.save()
    return JsonResponse({'success': True, 'chapter': _about_to_dict(chapter)})


# ===== Team API (CRUD — write requires admin session) =====

def _team_to_dict(m):
    return {
        'id': m.id,
        'name': m.name,
        'role': m.position,
        'bio': m.bio,
        'photo': m.photo_url or '',
        'email': m.email,
        'phone': m.phone,
        'order': m.order,
    }


def _validate_team_payload(data, partial=False):
    errors = {}
    if not partial or 'name' in data:
        name = (data.get('name') or '').strip()
        if not name:
            errors['name'] = 'Name is required.'
        elif len(name) > 200:
            errors['name'] = 'Name max 200 characters.'
    if not partial or 'role' in data:
        role = (data.get('role') or '').strip()
        if not role:
            errors['role'] = 'Role is required.'
        elif len(role) > 200:
            errors['role'] = 'Role max 200 characters.'
    if 'bio' in data and len(data.get('bio') or '') > 2000:
        errors['bio'] = 'Bio max 2000 characters.'
    if 'email' in data:
        email = (data.get('email') or '').strip()
        if email and ('@' not in email or ' ' in email):
            errors['email'] = 'Invalid email address.'
    if 'phone' in data and len(data.get('phone') or '') > 50:
        errors['phone'] = 'Phone max 50 characters.'
    if 'photo' in data and len(data.get('photo') or '') > 500:
        errors['photo'] = 'Photo path max 500 characters.'
    return errors


def _apply_team_payload(member, data):
    if 'name' in data:
        member.name = (data.get('name') or '').strip()[:200]
    if 'role' in data:
        member.position = (data.get('role') or '').strip()[:200]
    if 'bio' in data:
        member.bio = (data.get('bio') or '').strip()
    if 'photo' in data:
        member.photo_url = (data.get('photo') or '').strip()[:500]
    if 'email' in data:
        member.email = (data.get('email') or '').strip()
    if 'phone' in data:
        member.phone = (data.get('phone') or '').strip()[:50]
    if 'order' in data:
        try:
            member.order = int(data.get('order') or 0)
        except (TypeError, ValueError):
            pass
    if 'is_active' in data:
        member.is_active = bool(data.get('is_active'))


@require_http_methods(["GET", "POST"])
def api_team(request):
    """GET: public active members. POST: create (admin only)."""
    if request.method == 'GET':
        qs = TeamMember.objects.filter(is_active=True)
        members = [_team_to_dict(m) for m in qs]
        return JsonResponse({'team': members, 'count': len(members)})

    if not _is_admin(request.user):
        return JsonResponse({'success': False, 'message': 'Admin access required.'}, status=403)
    data = _json_body(request)
    errors = _validate_team_payload(data)
    if errors:
        return JsonResponse({'success': False, 'errors': errors}, status=400)
    member = TeamMember()
    _apply_team_payload(member, data)
    member.save()
    return JsonResponse({'success': True, 'member': _team_to_dict(member)}, status=201)


@require_http_methods(["GET", "PUT", "PATCH", "DELETE"])
def api_team_detail(request, pk):
    try:
        member = TeamMember.objects.get(pk=pk)
    except TeamMember.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'Member not found.'}, status=404)

    if request.method == 'GET':
        if not member.is_active and not _is_admin(request.user):
            return JsonResponse({'success': False, 'message': 'Member not found.'}, status=404)
        return JsonResponse({'member': _team_to_dict(member)})

    if not _is_admin(request.user):
        return JsonResponse({'success': False, 'message': 'Admin access required.'}, status=403)

    if request.method == 'DELETE':
        name = member.name
        member.delete()
        return JsonResponse({'success': True, 'message': f'Deleted "{name}".'})

    data = _json_body(request)
    partial = request.method == 'PATCH'
    errors = _validate_team_payload(data, partial=partial)
    if errors:
        return JsonResponse({'success': False, 'errors': errors}, status=400)
    _apply_team_payload(member, data)
    member.save()
    return JsonResponse({'success': True, 'member': _team_to_dict(member)})


# ===== Existing API Views for AJAX =====


@require_http_methods(["GET"])
def api_services(request):
    services = Service.objects.filter(is_active=True).values(
        'id', 'title', 'slug', 'category', 'description', 'icon', 'features', 'order'
    )
    return JsonResponse({'services': list(services)})


@require_http_methods(["GET"])
def api_projects(request):
    projects = Project.objects.filter(is_active=True).values(
        'id', 'title', 'slug', 'client', 'description', 'short_description',
        'location', 'completion_date', 'technologies', 'status', 'is_featured', 'order'
    )
    return JsonResponse({'projects': list(projects)})


@require_http_methods(["GET"])
def api_project_detail(request, slug):
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
    testimonials = Testimonial.objects.filter(is_active=True).values(
        'id', 'client_name', 'client_position', 'client_company',
        'content', 'rating', 'is_featured', 'order'
    )
    return JsonResponse({'testimonials': list(testimonials)})


@require_http_methods(["GET"])
def api_partners(request):
    partners = Partner.objects.filter(is_active=True).values(
        'id', 'name', 'website', 'partnership_type', 'order'
    )
    return JsonResponse({'partners': list(partners)})


@require_http_methods(["GET"])
def api_faq(request):
    faqs = FAQ.objects.filter(is_active=True).values(
        'id', 'question', 'answer', 'category', 'order'
    )
    return JsonResponse({'faqs': list(faqs)})


@require_http_methods(["GET"])
def api_pricing(request):
    plans = PricingPlan.objects.filter(is_active=True).values(
        'id', 'name', 'plan_type', 'price', 'currency',
        'billing_period', 'description', 'features', 'is_popular', 'order'
    )
    return JsonResponse({'plans': list(plans)})


@require_http_methods(["GET"])
def api_addresses(request):
    addresses = Address.objects.filter(is_active=True).values(
        'id', 'name', 'street_address', 'city', 'state_province',
        'postal_code', 'country', 'phone', 'email', 'is_main'
    )
    return JsonResponse({'addresses': list(addresses)})


@require_http_methods(["POST"])
def api_contact(request):
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
