"""Seed AboutChapter + TeamMember from current website content (idempotent)."""
from django.core.management.base import BaseCommand
from website.models import AboutChapter, TeamMember


ABOUT = [
    {
        'key': 'ch1',
        'order': 1,
        'title_en': 'Who We Are',
        'title_tet': 'Se Mak Ami',
        'body_en': 'Based in Fatuhada, Dili, Timor-Leste, Enzi Dev is a full-service ICT company offering technology solutions that help businesses, government institutions, NGOs and private organizations modernize, connect and grow.',
        'body_tet': "Bazeia iha Fatuhada, Dili, Timor-Leste, Enzi Dev mak kompañia ICT servisu-kompletu ida ne'ebé oferese solusaun teknolojia hodi ajuda empreza, instituisaun governu, ONG no organizasaun privadu sira atu moderniza, liga no buras.",
    },
    {
        'key': 'ch2',
        'order': 2,
        'title_en': 'Our Mission',
        'title_tet': 'Ami-nia Misaun',
        'body_en': '“Create innovative, reliable and flexible technology products and services, continuously evolving to challenge the market and guarantee seamless stakeholder satisfaction.”',
        'body_tet': '“Kria produtu no servisu teknolojia ne\'ebé inovativu, fiar no fleksivel, kontinua evolui hodi desafia merkadu no garante satisfasaun ba stakeholder sira.”',
    },
    {
        'key': 'ch3',
        'order': 3,
        'title_en': 'Our Vision',
        'title_tet': 'Ami-nia Visaun',
        'body_en': 'To be the most reliable and trusted IT provider in Timor-Leste, recognized for responsiveness, innovation and service excellence.',
        'body_tet': 'Sai fornecedor IT ne\'ebé fiar no konfiadu liu iha Timor-Leste, rekonseidu tanba responsividade, inovasaun no exselénsia iha servisu.',
    },
]


TEAM = [
    {
        'name': 'Acacio',
        'position': 'Director',
        'order': 1,
        'photo_url': 'images/team/Acacio.jpg',
        'bio': 'Acacio is the Director of Enzi Dev, an ICT, cybersecurity and software development company based in Dili, Timor-Leste.',
    },
    {
        'name': 'Frenky',
        'position': 'Business Manager',
        'order': 2,
        'photo_url': 'images/team/Frenky.jpg',
        'bio': "Frenky is Business Manager at Enzi Dev, supporting the company's business operations in Dili, Timor-Leste.",
    },
    {
        'name': 'Xisto',
        'position': 'Networking',
        'order': 3,
        'photo_url': 'images/team/Xisto.jpg',
        'bio': 'Xisto is a Networking professional at Enzi Dev, supporting efficient network operations and reliable infrastructure.',
    },
    {
        'name': 'Ezequel',
        'position': 'IT Manager',
        'order': 4,
        'photo_url': 'images/team/Ezequel.jpg',
        'bio': 'Ezequel is an IT Manager at Enzi Dev, supporting the company\'s ICT, cybersecurity, and software development operations.',
    },
    {
        'name': 'Reinildo',
        'position': 'Networking',
        'order': 5,
        'photo_url': 'images/team/Reinildo.jpg',
        'bio': 'Reinildo is a Networking professional at Enzi Dev, supporting the planning, implementation, and maintenance of network infrastructure.',
    },
    {
        'name': 'Joao',
        'position': 'System Analyst',
        'order': 6,
        'photo_url': 'images/team/joao.jpg',
        'bio': 'Joao is a System Analyst at Enzi Dev, supporting the analysis and improvement of systems.',
    },
    {
        'name': 'Brigida',
        'position': 'IT Support',
        'order': 7,
        'photo_url': 'images/team/Brigida.jpg',
        'bio': 'Brigida is an IT Support professional at Enzi Dev, helping maintain reliable technology operations.',
    },
]

TEAM_DEFAULTS = {
    'email': 'enzi23dev@gmail.com',
    'phone': '+670 76726974',
    'is_active': True,
}


class Command(BaseCommand):
    help = 'Seed AboutChapter and TeamMember rows from website content (idempotent)'

    def handle(self, *args, **options):
        about_created = about_updated = 0
        for item in ABOUT:
            obj, created = AboutChapter.objects.update_or_create(
                key=item['key'],
                defaults=item,
            )
            if created:
                about_created += 1
            else:
                about_updated += 1

        team_created = team_updated = 0
        for item in TEAM:
            defaults = {**TEAM_DEFAULTS, **item}
            obj, created = TeamMember.objects.update_or_create(
                name=item['name'],
                position=item['position'],
                defaults=defaults,
            )
            if created:
                team_created += 1
            else:
                team_updated += 1

        # Deactivate leftover seed rows that are not part of the live site
        live_names = {t['name'] for t in TEAM}
        stale = TeamMember.objects.exclude(name__in=live_names)
        stale_count = stale.count()
        stale.update(is_active=False)

        self.stdout.write(self.style.SUCCESS(
            f'About: {about_created} created, {about_updated} updated '
            f'(total {AboutChapter.objects.count()}). '
            f'Team: {team_created} created, {team_updated} updated '
            f'(active {TeamMember.objects.filter(is_active=True).count()}, '
            f'deactivated stale {stale_count}).'
        ))
