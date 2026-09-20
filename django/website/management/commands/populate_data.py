"""
Management command to populate database with sample data for Enzi Dev website.
Run: python manage.py populate_data
"""
from django.core.management.base import BaseCommand
from django.utils.text import slugify
from website.models import (
    TeamMember, Address, Service, Project,
    Testimonial, Partner, FAQ, PricingPlan,
    CompanyInfo
)


class Command(BaseCommand):
    help = 'Populate database with sample data for Enzi Dev website'

    def handle(self, *args, **kwargs):
        self.stdout.write('Populating database with sample data...')
        
        # ===== Team Members =====
        team_data = [
            {
                'name': 'Joaquim Martins',
                'position': 'Director',
                'bio': 'Joaquim Martins is the Director of Enzi Dev, an ICT, cybersecurity and software development company based in Dili, Timor-Leste. He supports the company\'s strategic direction and commitment to delivering reliable technology solutions.',
                'email': 'enzi23dev@gmail.com',
                'order': 1,
            },
            {
                'name': 'Lucia Pereira',
                'position': 'Business Manager',
                'bio': 'Lucia Pereira is Business Manager at Enzi Dev, an ICT, cybersecurity, and software development company in Dili, Timor-Leste. She supports the company\'s business operations and contributes to delivering effective technology solutions for clients.',
                'email': 'enzi23dev@gmail.com',
                'order': 2,
            },
            {
                'name': 'Anadelia Belita',
                'position': 'Office & System Analyst',
                'bio': 'Anadelia Belita is an Office & System Analyst at Enzi Dev, supporting efficient office operations and reliable information systems. She contributes to the organization\'s ICT and software development initiatives in Dili, Timor-Leste.',
                'email': 'enzi23dev@gmail.com',
                'order': 3,
            },
            {
                'name': 'Manuel Godinho',
                'position': 'IT Manager',
                'bio': 'Manuel Godinho is an IT Manager at Enzi Dev, supporting the company\'s ICT, cybersecurity, and software development operations in Dili, Timor-Leste. He helps ensure reliable, secure, and effective technology solutions for Enzi Dev and its clients.',
                'email': 'enzi23dev@gmail.com',
                'order': 4,
            },
            {
                'name': 'Baquito Felisberto',
                'position': 'Site Engineering',
                'bio': 'Baquito Felisberto is a Site Engineering professional at Enzi Dev, supporting the planning, implementation, and maintenance of reliable technical infrastructure. He contributes to delivering effective ICT and technology solutions for clients in Timor-Leste.',
                'email': 'enzi23dev@gmail.com',
                'order': 5,
            },
            {
                'name': 'Rabina Marques',
                'position': 'System Analyst',
                'bio': 'Rabina Marques is a System Analyst at Enzi Dev, an ICT, cybersecurity and software development company in Dili, Timor-Leste. She supports the analysis and improvement of systems to help deliver reliable, secure, and effective technology solutions.',
                'email': 'enzi23dev@gmail.com',
                'order': 6,
            },
            {
                'name': 'Joaquim Klaud',
                'position': 'IT Support',
                'bio': 'Joaquim Klaud is an IT Support professional at Enzi Dev, helping maintain reliable technology operations for clients and teams. He provides practical technical assistance and contributes to effective ICT solutions in Dili, Timor-Leste.',
                'email': 'enzi23dev@gmail.com',
                'order': 7,
            },
            {
                'name': 'Custodio',
                'position': 'IT Site Support',
                'bio': 'Custodio is an IT Site Support professional at Enzi Dev, providing reliable technical assistance to support daily operations. He helps maintain effective IT services and responds to technology needs across the organization.',
                'email': 'enzi23dev@gmail.com',
                'order': 8,
            },
            {
                'name': 'Sancho Salsinha',
                'position': 'Graphic Design',
                'bio': 'Sancho Salsinha is a Graphic Designer at Enzi Dev, creating clear, engaging visual solutions that support the company\'s ICT, cybersecurity, and software development services. He contributes creativity and attention to detail to Enzi Dev projects in Dili, Timor-Leste.',
                'email': 'enzi23dev@gmail.com',
                'order': 9,
            },
        ]
        
        for data in team_data:
            TeamMember.objects.get_or_create(
                name=data['name'],
                defaults=data
            )
        self.stdout.write(self.style.SUCCESS(f'Created {len(team_data)} team members'))

        # ===== Addresses =====
        address_data = [
            {
                'name': 'Headquarters',
                'street_address': 'Fatuhada, Dili',
                'city': 'Dili',
                'country': 'Timor-Leste',
                'phone': '+670 76726974',
                'email': 'enzi23dev@gmail.com',
                'is_main': True,
            },
        ]
        
        for data in address_data:
            Address.objects.get_or_create(
                name=data['name'],
                defaults=data
            )
        self.stdout.write(self.style.SUCCESS(f'Created {len(address_data)} addresses'))

        # ===== Services =====
        services_data = [
            {
                'title': 'ICT Infrastructure',
                'category': 'infrastructure',
                'description': 'Complete network design, installation and maintenance — structured cabling, LAN/WAN, switches, routers and fiber optics.',
                'icon': 'fa-network-wired',
                'features': ['Network Design', 'Cable Management', 'LAN/WAN Setup'],
                'order': 1,
            },
            {
                'title': 'Software Development',
                'category': 'software',
                'description': 'Custom web and mobile applications, APIs, databases and enterprise software built to your specifications.',
                'icon': 'fa-code',
                'features': ['Web Development', 'Mobile Apps', 'API Integration'],
                'order': 2,
            },
            {
                'title': 'Cybersecurity',
                'category': 'security',
                'description': 'Bitdefender GravityZone enterprise endpoint protection, vulnerability assessments, penetration testing and security audits.',
                'icon': 'fa-shield-halved',
                'features': ['Endpoint Protection', 'Security Audits', 'Penetration Testing'],
                'order': 3,
            },
            {
                'title': 'Cloud & Hosting',
                'category': 'cloud',
                'description': 'Scalable cloud infrastructure, managed hosting, domain registration, email services and data backup solutions.',
                'icon': 'fa-cloud',
                'features': ['Cloud Migration', 'Managed Hosting', 'Data Backup'],
                'order': 4,
            },
            {
                'title': 'Hardware Supply',
                'category': 'hardware',
                'description': 'IT procurement of servers, workstations, laptops, printers, UPS systems and networking equipment from leading brands.',
                'icon': 'fa-server',
                'features': ['Server Supply', 'Workstations', 'Networking Equipment'],
                'order': 5,
            },
            {
                'title': 'Support & Consultancy',
                'category': 'support',
                'description': '24/7 technical support, IT strategy consulting, digital transformation planning and managed services.',
                'icon': 'fa-headset',
                'features': ['24/7 Support', 'IT Consulting', 'Managed Services'],
                'order': 6,
            },
        ]
        
        for data in services_data:
            Service.objects.get_or_create(
                title=data['title'],
                defaults=data
            )
        self.stdout.write(self.style.SUCCESS(f'Created {len(services_data)} services'))

        # ===== Projects =====
        projects_data = [
            {
                'title': 'Government Network Modernization',
                'client': 'Ministry of ICT',
                'description': 'Complete network infrastructure upgrade for government offices across Dili, improving connectivity and security for over 500 government employees.',
                'short_description': 'Network infrastructure upgrade for government offices.',
                'location': 'Dili, Timor-Leste',
                'technologies': ['Cisco Meraki', 'Fiber Optic', 'Bitdefender'],
                'status': 'completed',
                'is_featured': True,
                'order': 1,
            },
            {
                'title': 'NGO Cloud & Server Migration',
                'client': 'International NGO Coalition',
                'description': 'Migrated 15 NGO organizations from legacy on-premise servers to secure cloud infrastructure, reducing costs by 40%.',
                'short_description': 'Cloud migration for 15 NGO organizations.',
                'location': 'Dili, Timor-Leste',
                'technologies': ['AWS', 'Azure', 'Office 365'],
                'status': 'completed',
                'is_featured': True,
                'order': 2,
            },
            {
                'title': 'Campus Wi-Fi & Meraki Deployment',
                'client': 'National University of Timor-Leste',
                'description': 'Full campus wireless network deployment using Cisco Meraki access points, covering 12 buildings and supporting 3,000+ concurrent users.',
                'short_description': 'Campus-wide Wi-Fi deployment for 3,000+ users.',
                'location': 'Dili, Timor-Leste',
                'technologies': ['Cisco Meraki', 'RADIUS', 'Load Balancing'],
                'status': 'completed',
                'is_featured': True,
                'order': 3,
            },
        ]
        
        for data in projects_data:
            Project.objects.get_or_create(
                title=data['title'],
                defaults=data
            )
        self.stdout.write(self.style.SUCCESS(f'Created {len(projects_data)} projects'))

        # ===== Testimonials =====
        testimonials_data = [
            {
                'client_name': 'João Santos',
                'client_position': 'Director of IT',
                'client_company': 'Ministry of Health',
                'content': 'Enzi Dev transformed our network infrastructure. Their team delivered on time and provided excellent support throughout the project.',
                'rating': 5,
                'is_featured': True,
                'order': 1,
            },
            {
                'client_name': 'Maria Oliveira',
                'client_position': 'Operations Manager',
                'client_company': 'UNDP Timor-Leste',
                'content': 'The cloud migration service was seamless. Enzi Dev helped us reduce costs while improving reliability and security.',
                'rating': 5,
                'is_featured': True,
                'order': 2,
            },
            {
                'client_name': 'Pedro Costa',
                'client_position': 'CTO',
                'client_company': 'Banco Nacional de Timor-Leste',
                'content': 'Their cybersecurity solutions gave us peace of mind. The Bitdefender deployment was professional and effective.',
                'rating': 5,
                'is_featured': True,
                'order': 3,
            },
        ]
        
        for data in testimonials_data:
            Testimonial.objects.get_or_create(
                client_name=data['client_name'],
                defaults=data
            )
        self.stdout.write(self.style.SUCCESS(f'Created {len(testimonials_data)} testimonials'))

        # ===== Partners =====
        partners_data = [
            {'name': 'Bitdefender', 'partnership_type': 'Technology Partner', 'order': 1},
            {'name': 'Cisco Meraki', 'partnership_type': 'Networking Partner', 'order': 2},
            {'name': 'Microsoft', 'partnership_type': 'Cloud Partner', 'order': 3},
            {'name': 'Fortinet', 'partnership_type': 'Security Partner', 'order': 4},
            {'name': 'HP Enterprise', 'partnership_type': 'Hardware Partner', 'order': 5},
        ]
        
        for data in partners_data:
            Partner.objects.get_or_create(
                name=data['name'],
                defaults=data
            )
        self.stdout.write(self.style.SUCCESS(f'Created {len(partners_data)} partners'))

        # ===== FAQs =====
        faqs_data = [
            {
                'question': 'What services does Enzi Dev offer?',
                'answer': 'Enzi Dev offers comprehensive ICT services including network infrastructure, cybersecurity, software development, cloud hosting, hardware supply, and 24/7 technical support.',
                'category': 'General',
                'order': 1,
            },
            {
                'question': 'Do you provide Bitdefender enterprise solutions?',
                'answer': 'Yes, we are an authorized Bitdefender partner offering GravityZone enterprise endpoint protection, including deployment, configuration, and ongoing management.',
                'category': 'Security',
                'order': 2,
            },
            {
                'question': 'What areas do you serve?',
                'answer': 'We primarily serve clients across Timor-Leste, with our main office in Dili. We also support regional projects in neighboring countries.',
                'category': 'General',
                'order': 3,
            },
            {
                'question': 'How can I request a quote?',
                'answer': 'You can request a quote by filling out the contact form on our website, calling our office, or sending an email to enzi23dev@gmail.com. We typically respond within one business day.',
                'category': 'Support',
                'order': 4,
            },
            {
                'question': 'Do you offer managed IT services?',
                'answer': 'Yes, we offer fully managed IT services including 24/7 monitoring, helpdesk support, maintenance, and strategic IT consulting for organizations of all sizes.',
                'category': 'Support',
                'order': 5,
            },
        ]
        
        for data in faqs_data:
            FAQ.objects.get_or_create(
                question=data['question'],
                defaults=data
            )
        self.stdout.write(self.style.SUCCESS(f'Created {len(faqs_data)} FAQs'))

        # ===== Pricing Plans =====
        pricing_data = [
            {
                'name': 'Basic',
                'plan_type': 'basic',
                'price': 99.00,
                'currency': 'USD',
                'billing_period': 'per month',
                'description': 'Perfect for small businesses starting their digital journey.',
                'features': [
                    'Up to 10 devices',
                    'Basic endpoint protection',
                    'Email support',
                    'Monthly reporting',
                    '8x5 support hours'
                ],
                'is_popular': False,
                'order': 1,
            },
            {
                'name': 'Professional',
                'plan_type': 'professional',
                'price': 299.00,
                'currency': 'USD',
                'billing_period': 'per month',
                'description': 'Ideal for growing organizations with advanced needs.',
                'features': [
                    'Up to 50 devices',
                    'Advanced security suite',
                    'Phone & email support',
                    'Weekly reporting',
                    '24x7 support hours',
                    'Cloud backup'
                ],
                'is_popular': True,
                'order': 2,
            },
            {
                'name': 'Enterprise',
                'plan_type': 'enterprise',
                'price': 799.00,
                'currency': 'USD',
                'billing_period': 'per month',
                'description': 'Complete solution for large organizations with complex requirements.',
                'features': [
                    'Unlimited devices',
                    'Full security stack',
                    'Dedicated account manager',
                    'Real-time monitoring',
                    '24x7 priority support',
                    'Custom SLA',
                    'On-site support'
                ],
                'is_popular': False,
                'order': 3,
            },
        ]
        
        for data in pricing_data:
            PricingPlan.objects.get_or_create(
                name=data['name'],
                defaults=data
            )
        self.stdout.write(self.style.SUCCESS(f'Created {len(pricing_data)} pricing plans'))

        # ===== Company Info =====
        company_info_data = [
            {'key': 'phone', 'value': '+670 76726974', 'description': 'Main contact phone'},
            {'key': 'email', 'value': 'enzi23dev@gmail.com', 'description': 'Main contact email'},
            {'key': 'address', 'value': 'Fatuhada, Dili, Timor-Leste', 'description': 'Main office address'},
            {'key': 'working_hours', 'value': 'Mon - Fri: 8:00 AM - 5:00 PM', 'description': 'Business hours'},
            {'key': 'slogan', 'value': 'Creative Developer', 'description': 'Company slogan'},
        ]
        
        for data in company_info_data:
            CompanyInfo.objects.get_or_create(
                key=data['key'],
                defaults=data
            )
        self.stdout.write(self.style.SUCCESS(f'Created {len(company_info_data)} company info entries'))

        self.stdout.write(self.style.SUCCESS('\nDatabase populated successfully!'))
        self.stdout.write(self.style.SUCCESS('Run: python manage.py runserver'))
        self.stdout.write(self.style.SUCCESS('Admin: http://localhost:8000/admin/'))
