/* ============================================================
   Enzi Dev Technology — Main JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  // ===== Scroll Animations (Intersection Observer) =====
  var animatedElements = document.querySelectorAll('[data-animate]');
  
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var delay = entry.target.getAttribute('data-delay') || 0;
        setTimeout(function () {
          entry.target.classList.add('animated');
        }, parseInt(delay));
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  animatedElements.forEach(function (el) {
    observer.observe(el);
  });

  // ===== Mobile Menu Toggle =====
  var mobileToggle = document.getElementById('mobile-toggle');
  var navList = document.getElementById('nav-list');

  if (mobileToggle && navList) {
    mobileToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      navList.classList.toggle('active');
      var icon = mobileToggle.querySelector('i');
      if (navList.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-xmark');
      } else {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
      }
    });

    navList.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        navList.classList.remove('active');
        var icon = mobileToggle.querySelector('i');
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
      });
    });

    document.addEventListener('click', function (e) {
      if (!navList.contains(e.target) && !mobileToggle.contains(e.target)) {
        navList.classList.remove('active');
        var icon = mobileToggle.querySelector('i');
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
      }
    });
  }

  // ===== Header Scroll Effect =====
  var header = document.getElementById('header');
  var backToTop = document.getElementById('backToTop');
  var sections = document.querySelectorAll('section[id]');

  function onScroll() {
    var scrollY = window.pageYOffset;

    if (header) {
      header.classList.toggle('scrolled', scrollY > 80);
    }

    if (backToTop) {
      backToTop.classList.toggle('show', scrollY > 400);
    }

    // Active nav link based on scroll position
    sections.forEach(function (section) {
      var top = section.offsetTop - 120;
      var bottom = top + section.offsetHeight;
      var id = section.getAttribute('id');
      var link = document.querySelector('.nav-link[href="#' + id + '"]');
      if (link) {
        link.classList.toggle('active', scrollY >= top && scrollY < bottom);
      }
    });
  }

  window.addEventListener('scroll', onScroll);
  onScroll();

  // ===== Back to Top =====
  if (backToTop) {
    backToTop.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ===== Smooth Scroll for Anchor Links =====
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ===== FAQ Accordion =====
  document.querySelectorAll('.faq-question').forEach(function (q) {
    q.addEventListener('click', function () {
      var item = this.closest('.faq-item');
      var wasActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(function (f) {
        f.classList.remove('active');
      });
      if (!wasActive) item.classList.add('active');
    });
  });

  // ===== Stats Counter Animation =====
  function animateCounters() {
    var counters = document.querySelectorAll('[data-count]');
    counters.forEach(function (counter) {
      if (counter.dataset.animated) return;

      var rect = counter.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        counter.dataset.animated = 'true';
        var target = parseInt(counter.getAttribute('data-count'), 10);
        var duration = 2000;
        var start = 0;
        var startTime = null;

        function step(timestamp) {
          if (!startTime) startTime = timestamp;
          var progress = Math.min((timestamp - startTime) / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          counter.textContent = Math.floor(eased * target);
          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            counter.textContent = target;
          }
        }

        requestAnimationFrame(step);
      }
    });
  }

  window.addEventListener('scroll', animateCounters);
  animateCounters();

  // ===== Spotlight Card Mouse Tracking =====
  document.querySelectorAll('.spotlight-card').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', x + 'px');
      card.style.setProperty('--mouse-y', y + 'px');
    });
  });

  // ===== Contact Form (Demo) =====
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = this.querySelector('button[type="submit"]');
      var originalHTML = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
      btn.style.background = '#25D366';
      btn.disabled = true;
      setTimeout(function () {
        btn.innerHTML = originalHTML;
        btn.style.background = '';
        btn.disabled = false;
        contactForm.reset();
      }, 3000);
    });
  }

  // ===== Language Switcher =====
  var translations = {
    en: {
      'hero.badge': 'Enterprise ICT & Digital Solutions',
      'hero.title': '<span class="text-white">Leading ICT,</span><br><span class="text-red">Cybersecurity,</span><br><span class="text-white">Software</span> <span class="text-stroke">Development</span><br><span class="text-white">in</span> <span class="text-gold">Timor-Leste</span>',
      'hero.subtitle': 'Enzi Dev delivers professional ICT services — Cybersecurity, Bitdefender GravityZone endpoint security, software & web development, cloud hosting, Cisco Meraki networking and 24/7 technical support for government, NGOs, education and private sector organizations.',
      'hero.shop': 'Shop Electronics',
      'hero.quote': 'Get a Free Quote',
      'hero.clients': '200+',
      'hero.projects': '50+',
      'hero.support': '24/7',
      'about.title': 'The Manifesto',
      'about.text1': 'Based in Fatuhada, Dili, Timor-Leste, <strong>Enzi Dev</strong> is a full-service ICT company offering technology solutions that help businesses, government institutions, NGOs and private organizations modernize, connect and grow.',
      'about.text2': 'We specialize in providing comprehensive ICT infrastructure, cybersecurity solutions, software development, and IT support services across Timor-Leste.',
      'services.title': 'Our Services',
      'services.subtitle': 'Everything your organization needs.<br>From cables to cloud — one partner for infrastructure, security, software and support.',
      'projects.title': 'Our Projects',
      'projects.subtitle': 'Delivering reliable technology solutions across Timor-Leste.',
      'team.title': 'The People',
      'team.subtitle': 'Certified engineers, developers and support specialists based in Dili — on call when you need us.',
      'testimonials.title': 'Client Testimonials',
      'testimonials.subtitle': 'What our clients say.',
      'partners.title': 'Our Partners',
      'partners.subtitle': 'Trusted by leading technology brands.',
      'pricing.title': 'Pricing',
      'pricing.subtitle': 'Choose the package that best suits your business needs and budget.',
      'faq.title': 'FAQ',
      'faq.subtitle': 'Frequently asked questions from our clients.',
      'contact.title': 'Contact Us',
      'contact.subtitle': 'Tell us about your project, procurement needs or support request — we respond within one business day.',
      'nav.home': 'Home',
      'nav.about': 'About',
      'nav.services': 'Services',
      'nav.projects': 'Projects',
      'nav.team': 'Team',
      'nav.contact': 'Contact',
      'nav.bitdefender': 'Bitdefender',
      'nav.shop': 'Shop'
    },
    tet: {
      'hero.badge': 'Solusaun ICT & Digitál ba Empreza',
      'hero.title': '<span class="text-white">Lidera ICT,</span><br><span class="text-red">Seguransa Sibernétika,</span><br><span class="text-white">Dezenvolvimentu</span> <span class="text-stroke">Software</span><br><span class="text-white">iha</span> <span class="text-gold">Timor-Leste</span>',
      'hero.subtitle': 'KINOS fornese servisu ICT profisionál iha Timor-Leste inklui Seguransa Sibernétika, Bitdefender GravityZone, dezenvolvimentu software & web, cloud hosting, rede Cisco Meraki no apoiu tékniku 24/7 ba governu, ONG, edukasaun no organizasaun setor privadu.',
      'hero.shop': 'Buka Loja',
      'hero.quote': 'Husu Kotasaun Grátis',
      'hero.clients': 'Klijente Sira',
      'hero.projects': 'Projetu Remata',
      'hero.support': 'Apoiu Tékniku',
      'about.title': 'Manifesto',
      'about.text1': 'Bazeia iha Fatuhada, Dili, Timor-Leste, <strong>Enzi Dev</strong> mak kompaña TIK servisu-kompletu ne\'ebe oferese solusaun teknolojia hodi ajuda empreza, instituisaun governu, ONG no organizasaun privadu sira atu moderniza, liga no buras.',
      'about.text2': 'Ami spesializa iha fornese infrastrutura TIK kompletu, solusaun seguransa siber, dezenvolvimentu software, no servisu suporte TI iha Timor-Leste hotu.',
      'services.title': 'Servisu Ami',
      'services.subtitle': 'Saida sei necesidade organisasaun.<br>Tebe-lia to\'o klaudu — parceria ida ba infrastrutura, seguransa, software no suporte.',
      'projects.title': 'Projetu Ami',
      'projects.subtitle': 'Entrega solusaun teknolojia konfiavel iha Timor-Leste hotu.',
      'team.title': 'Povu',
      'team.subtitle': 'Ingenieiru, dezenvolvedor no espesialista apoiu sertifikadu bazeia iha Dili — pronto bainhira ita presiza.',
      'testimonials.title': 'Testimunia Kliente',
      'testimonials.subtitle': 'Saida kliente ami nian.',
      'partners.title': 'Parceria Ami',
      'partners.subtitle': 'Konfiansa ba marca teknolojia lidér.',
      'pricing.title': 'Prezu',
      'pricing.subtitle': 'Escolhe pakote ne\'ebe mai alkla ba necesidade no orsamentu negosiain.',
      'faq.title': 'FAQ',
      'faq.subtitle': 'Pergunta frequentemente kliente ami nian.',
      'contact.title': 'Kontaktu Ami',
      'contact.subtitle': 'Kontenti ho projetu, necesidade kumpra no pedidu apoiu — ami responde iha loron negosiain 1.',
      'nav.home': 'Uma',
      'nav.about': 'Ba Ita',
      'nav.services': 'Servisu',
      'nav.projects': 'Projetu',
      'nav.team': 'Ekipa',
      'nav.contact': 'Kontaktu',
      'nav.bitdefender': 'Bitdefender',
      'nav.shop': 'Loja'
    }
  };

  var currentLang = 'en';

  function switchLanguage(lang) {
    currentLang = lang;
    var elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (translations[lang] && translations[lang][key]) {
        el.innerHTML = translations[lang][key];
      }
    });
    var htmlElements = document.querySelectorAll('[data-i18n-html]');
    htmlElements.forEach(function (el) {
      var key = el.getAttribute('data-i18n-html');
      if (translations[lang] && translations[lang][key]) {
        el.innerHTML = translations[lang][key];
      }
    });
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
    document.documentElement.setAttribute('lang', lang === 'tet' ? 'tet' : lang);
  }

  document.querySelectorAll('.lang-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var lang = this.getAttribute('data-lang');
      switchLanguage(lang);
    });
  });

});

// ===== Team Modal =====
function openTeamModal(element) {
  var modal = document.getElementById('teamModal');
  var modalPhoto = document.getElementById('modalPhoto');
  var modalName = document.getElementById('modalName');
  var modalRole = document.getElementById('modalRole');
  var modalBio = document.getElementById('modalBio');
  var modalEmail = document.getElementById('modalEmail');
  var modalEmailText = document.getElementById('modalEmailText');
  var modalPhone = document.getElementById('modalPhone');
  var modalPhoneText = document.getElementById('modalPhoneText');
  var modalWhatsapp = document.getElementById('modalWhatsapp');

  // Get data from element
  var name = element.getAttribute('data-name');
  var role = element.getAttribute('data-role');
  var bio = element.getAttribute('data-bio');
  var photo = element.getAttribute('data-photo');
  var email = element.getAttribute('data-email');
  var phone = element.getAttribute('data-phone');

  // Set modal content
  modalPhoto.src = photo;
  modalPhoto.alt = name;
  modalName.textContent = name;
  modalRole.textContent = role;
  modalBio.textContent = bio;
  modalEmail.href = 'mailto:' + email;
  modalEmailText.textContent = email;
  modalPhone.href = 'tel:' + phone.replace(/\s/g, '');
  modalPhoneText.textContent = phone;
  modalWhatsapp.href = 'https://wa.me/' + phone.replace(/[^0-9]/g, '');

  // Show modal
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeTeamModal() {
  var modal = document.getElementById('teamModal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

// Close modal on overlay click
document.getElementById('teamModalOverlay').addEventListener('click', closeTeamModal);

// Close modal on close button click
document.getElementById('teamModalClose').addEventListener('click', closeTeamModal);

// Close modal on ESC key press
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeTeamModal();
  }
});
