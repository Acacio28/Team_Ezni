/* ============================================================
   Enzi Dev Technology — Main JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  // ===== Lenis Smooth Scroll =====
  if (typeof Lenis !== 'undefined') {
    var lenis = new Lenis({
      duration: 1.2,
      easing: function (t) {
        return Math.min(1, 1.001 - Math.pow(2, -10 * t));
      },
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Update scroll triggers on Lenis scroll
    lenis.on('scroll', function (e) {
      updateHeroParallax(e.scroll || window.pageYOffset);
    });
  }

  // ===== Hero Parallax (kinos.tl style) =====
  var hero = document.querySelector('.hero');
  var heroBgImg = document.querySelector('.hero-bg-img');
  var heroContentWrap = document.querySelector('.hero-content-wrap');

  function updateHeroParallax(scrollY) {
    if (!hero || !heroBgImg || !heroContentWrap) return;
    var heroHeight = hero.offsetHeight;
    if (scrollY > heroHeight) return;
    var progress = Math.min(scrollY / heroHeight, 1);
    heroBgImg.style.transform = 'translateY(' + (progress * 22) + '%)';
    heroContentWrap.style.transform = 'translateY(' + (progress * 38) + '%)';
    heroContentWrap.style.opacity = String(Math.max(1 - progress / 0.7, 0));
  }

  window.addEventListener('scroll', function () {
    updateHeroParallax(window.pageYOffset);
  }, { passive: true });
  updateHeroParallax(window.pageYOffset);

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

  // ===== Mouse Tracking Spotlight =====
  var spotlightCards = document.querySelectorAll('.spotlight-card');
  spotlightCards.forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      card.style.setProperty('--mx', x + 'px');
      card.style.setProperty('--my', y + 'px');
    });
  });

  // ===== Mobile Menu Toggle =====
  var mobileToggle = document.getElementById('mobile-toggle');
  var mobilePanel = document.getElementById('nav-list');

  function closeMobileMenu() {
    if (!mobilePanel || !mobileToggle) return;
    mobilePanel.classList.remove('active');
    var icon = mobileToggle.querySelector('i');
    icon.classList.remove('fa-xmark');
    icon.classList.add('fa-bars');
  }

  if (mobileToggle && mobilePanel) {
    mobileToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      mobilePanel.classList.toggle('active');
      var icon = mobileToggle.querySelector('i');
      if (mobilePanel.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-xmark');
      } else {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
      }
    });

    mobilePanel.querySelectorAll('.mobile-link').forEach(function (link) {
      link.addEventListener('click', closeMobileMenu);
    });

    document.addEventListener('click', function (e) {
      if (!mobilePanel.contains(e.target) && !mobileToggle.contains(e.target)) {
        closeMobileMenu();
      }
    });
  }

  // Mobile language toggle
  var mobileLangToggle = document.getElementById('mobile-lang-toggle');
  if (mobileLangToggle) {
    mobileLangToggle.addEventListener('click', function () {
      var newLang = currentLang === 'en' ? 'tet' : 'en';
      switchLanguage(newLang);
    });
  }

  // ===== Header Scroll Effect =====
  var header = document.getElementById('header');
  var backToTop = document.getElementById('backToTop');

  function onScroll() {
    var scrollY = window.pageYOffset;

    if (header) {
      header.classList.toggle('scrolled', scrollY > 40);
    }

    if (backToTop) {
      backToTop.classList.toggle('show', scrollY > 400);
    }
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

  // ===== Hero Scroll Indicator =====
  var heroScroll = document.querySelector('.hero-scroll');
  if (heroScroll) {
    heroScroll.addEventListener('click', function () {
      var about = document.getElementById('about');
      if (about) {
        about.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

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
      'hero.title': '<span class="hero-line-mask"><span class="hero-line">Leading ICT,</span></span><span class="hero-line-mask"><span class="hero-line text-red">Cybersecurity,</span></span><span class="hero-line-mask"><span class="hero-line">Software <span class="text-stroke">Development</span></span></span><span class="hero-line-mask"><span class="hero-line">in <span class="text-gold">Timor-Leste</span></span></span>',
      'hero.subtitle': 'Enzi Dev delivers professional ICT services — Cybersecurity, Bitdefender GravityZone endpoint security, software & web development, cloud hosting, Cisco Meraki networking and 24/7 technical support for government, NGOs, education and private sector organizations.',
      'hero.shop': 'Shop Electronics',
      'hero.quote': 'Get a Free Quote',
      'hero.clients': '200+',
      'hero.projects': '50+',
      'hero.support': '24/7',
      'about.label': 'The Manifesto',
      'about.title1': 'Built in Dili.',
      'about.title2': 'Trusted across',
      'about.title3': 'the nation',
      'about.ch1title': 'Who We Are',
      'about.ch1body': 'Based in Fatuhada, Dili, Timor-Leste, Enzi Dev is a full-service ICT company offering technology solutions that help businesses, government institutions, NGOs and private organizations modernize, connect and grow.',
      'about.ch2title': 'Our Mission',
      'about.ch2body': '“Create innovative, reliable and flexible technology products and services, continuously evolving to challenge the market and guarantee seamless stakeholder satisfaction.”',
      'about.ch3title': 'Our Vision',
      'about.ch3body': 'To be the most reliable and trusted IT provider in Timor-Leste, recognized for responsiveness, innovation and service excellence.',
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
      'nav.shop': 'Shop',
      'nav.language': 'English'
    },
    tet: {
      'hero.badge': 'Solusaun ICT & Digitál ba Empreza',
      'hero.title': '<span class="hero-line-mask"><span class="hero-line">Lidera ICT,</span></span><span class="hero-line-mask"><span class="hero-line text-red">Seguransa Sibernétika,</span></span><span class="hero-line-mask"><span class="hero-line">Dezenvolvimentu <span class="text-stroke">Software</span></span></span><span class="hero-line-mask"><span class="hero-line">iha <span class="text-gold">Timor-Leste</span></span></span>',
      'hero.subtitle': 'Enzi Dev fornese servisu ICT profisionál iha Timor-Leste inklui Seguransa Sibernétika, Bitdefender GravityZone, dezenvolvimentu software & web, cloud hosting, rede Cisco Meraki no apoiu tékniku 24/7 ba governu, ONG, edukasaun no organizasaun setor privadu.',
      'hero.shop': 'Buka Loja',
      'hero.quote': 'Husu Kotasaun Grátis',
      'hero.clients': 'Klijente Sira',
      'hero.projects': 'Projetu Remata',
      'hero.support': 'Apoiu Tékniku',
      'about.label': 'Manifestu',
      'about.title1': 'Harii iha Dili.',
      'about.title2': 'Konfiadu iha',
      'about.title3': 'nasaun tomak',
      'about.ch1title': 'Se Mak Ami',
      'about.ch1body': 'Bazeia iha Fatuhada, Dili, Timor-Leste, Enzi Dev mak kompañia ICT servisu-kompletu ida ne\'ebé oferese solusaun teknolojia hodi ajuda empreza, instituisaun governu, ONG no organizasaun privadu sira atu moderniza, liga no buras.',
      'about.ch2title': 'Ami-nia Misaun',
      'about.ch2body': '“Kria produtu no servisu teknolojia ne\'ebé inovativu, fiar no fleksivel, kontinua evolui hodi desafia merkadu no garante satisfasaun ba stakeholder sira.”',
      'about.ch3title': 'Ami-nia Visaun',
      'about.ch3body': 'Sai fornecedor IT ne\'ebé fiar no konfiadu liu iha Timor-Leste, rekonseidu tanba responsividade, inovasaun no exselénsia iha servisu.',
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
      'nav.shop': 'Loja',
      'nav.language': 'Tetum'
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
    var langCode = document.getElementById('lang-code');
    if (langCode) {
      langCode.textContent = lang === 'tet' ? 'TT' : 'EN';
    }
    document.documentElement.setAttribute('lang', lang === 'tet' ? 'tet' : lang);
  }

  // Language toggle button
  var langToggle = document.getElementById('lang-toggle');
  if (langToggle) {
    langToggle.addEventListener('click', function () {
      var newLang = currentLang === 'en' ? 'tet' : 'en';
      switchLanguage(newLang);
    });
  }

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
