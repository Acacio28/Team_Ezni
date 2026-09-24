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

    mobilePanel.querySelectorAll('.mobile-link, .mobile-action-card').forEach(function (link) {
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
      'projects.label': 'Selected Work',
      'projects.title1': 'Projects that moved',
      'projects.title2': 'Timor-Leste forward',
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
      'nav.language': 'English',
      'nav.whatsapp': 'Chat WhatsApp',
      'activities.label': 'Activities & Training',
      'activities.title': 'Enzi in action',
      'activities.sub': 'Training programs and project work across Timor-Leste — building skills, supplying equipment and delivering systems.',
      'activities.latest': 'Latest',
      'activities.gallery': 'View gallery',
      'activities.register': 'Register',
      'activities.signupTitle': 'Training registration',
      'activities.phName': 'Full name',
      'activities.phEmail': 'Email address',
      'activities.phPhone': 'Phone / WhatsApp',
      'activities.phCompany': 'Company / Organization',
      'activities.phParticipants': 'Number of participants',
      'activities.signupSubmit': 'Submit registration',
      'activities.signupSuccess': 'Registration received',
      'activities.signupRef': 'Your reference',
      'activities.signupNote': 'Our team will contact you with the training schedule and details.',
      'activities.signupAgain': 'Register another person',
      'team.label': 'The People',
      'team.title': 'Meet the team',
      'team.sub': 'Certified engineers, developers and support specialists based in Dili — on call when you need us.',
      'team.viewProfile': 'View profile',
      'clients.label': 'Our Clients',
      'clients.title': 'Trusted by leading organizations',
      'clients.hint': 'Want your organization listed here?',
      'clients.cta': 'Partner with us →'
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
      'projects.label': 'Servisu Hili',
      'projects.title1': 'Projetu sira ne\'ebé hala\'o',
      'projects.title2': 'Timor-Leste ba oin',
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
      'nav.language': 'Tetum',
      'nav.whatsapp': 'Halo Sia WhatsApp',
      'activities.label': 'Atividade & Formasaun',
      'activities.title': 'Enzi iha asaun',
      'activities.sub': 'Programa formasaun no servisu projetu iha Timor-Leste tomak — harii kapasidade, fornese ekipamentu no entrega sistema sira.',
      'activities.latest': 'Foun',
      'activities.gallery': 'Haree galeria',
      'activities.register': 'Rejistu',
      'activities.signupTitle': 'Rejistrasaun formasaun',
      'activities.phName': 'Naran kompletu',
      'activities.phEmail': 'Email',
      'activities.phPhone': 'Telefone / WhatsApp',
      'activities.phCompany': 'Empreza / Organizasaun',
      'activities.phParticipants': 'Númeru partisipante',
      'activities.signupSubmit': 'Haruka rejistrasaun',
      'activities.signupSuccess': 'Rejistrasaun simu ona',
      'activities.signupRef': 'Ita-nia referénsia',
      'activities.signupNote': 'Ami-nia ekipa sei kontaktu ita ho oráriu no detallu formasaun nian.',
      'activities.signupAgain': 'Rejistu ema seluk',
      'team.label': 'Ema Sira',
      'team.title': 'Hasoru ami-nia ekipa',
      'team.sub': 'Engenheiru sertifikadu, dezenvolvedor no espesialista apoiu bazeia iha Dili — pronto bainhira ita presiza.',
      'team.viewProfile': 'Haree perfil',
      'clients.label': 'Ami-nia Klijente',
      'clients.title': 'Organizasaun boot sira konfia ami',
      'clients.hint': 'Hakarak ita-nia organizasaun hatudu iha ne’e?',
      'clients.cta': 'Parseiru ho ami →'
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
    closeActivityGallery();
    closeSignupModal();
  }
});

// ===== Activity Gallery =====
var activityGalleries = [
  {
    title: 'Network Infrastructure Rollout',
    images: [
      { url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80', caption: 'Core switch rack and structured cabling' },
      { url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a2?auto=format&fit=crop&w=1200&q=80', caption: 'Wireless access point installation' },
      { url: 'https://images.unsplash.com/photo-1551703599-6b3e8379aa8b?auto=format&fit=crop&w=1200&q=80', caption: 'Firewall and security appliance configuration' }
    ]
  }
];
var activeGalleryIdx = 0;
var activeGalleryImg = 0;

function openActivityGallery(galleryIdx) {
  activeGalleryIdx = galleryIdx || 0;
  activeGalleryImg = 0;
  renderActivityGallery();
  var modal = document.getElementById('activityGalleryModal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function renderActivityGallery() {
  var g = activityGalleries[activeGalleryIdx];
  if (!g) return;
  var title = document.getElementById('activityGalleryTitle');
  var main = document.getElementById('activityGalleryMain');
  var caption = document.getElementById('activityGalleryCaption');
  var thumbs = document.getElementById('activityGalleryThumbs');
  if (title) title.textContent = g.title;
  if (main) {
    main.src = g.images[activeGalleryImg].url;
    main.alt = g.title;
  }
  if (caption) caption.textContent = g.images[activeGalleryImg].caption || '';
  if (thumbs) {
    thumbs.innerHTML = '';
    g.images.forEach(function (img, i) {
      var btn = document.createElement('button');
      btn.className = 'activity-gallery-thumb' + (i === activeGalleryImg ? ' active' : '');
      btn.innerHTML = '<img src="' + img.url + '" alt="">';
      btn.addEventListener('click', function () {
        activeGalleryImg = i;
        renderActivityGallery();
      });
      thumbs.appendChild(btn);
    });
  }
}

function closeActivityGallery() {
  var modal = document.getElementById('activityGalleryModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// ===== Activity Signup =====
function openSignupModal(title) {
  var modal = document.getElementById('activitySignupModal');
  var titleEl = document.getElementById('signupActivityTitle');
  var formView = document.getElementById('signupFormView');
  var successView = document.getElementById('signupSuccessView');
  if (titleEl) titleEl.textContent = title;
  if (formView) formView.style.display = '';
  if (successView) successView.style.display = 'none';
  var form = document.getElementById('activitySignupForm');
  if (form) form.reset();
  var participants = document.getElementById('signupParticipants');
  if (participants) participants.value = '1';
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeSignupModal() {
  var modal = document.getElementById('activitySignupModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Modal close bindings
(function () {
  var gOverlay = document.getElementById('activityGalleryOverlay');
  var gClose = document.getElementById('activityGalleryClose');
  if (gOverlay) gOverlay.addEventListener('click', closeActivityGallery);
  if (gClose) gClose.addEventListener('click', closeActivityGallery);

  var sOverlay = document.getElementById('activitySignupOverlay');
  var sClose = document.getElementById('activitySignupClose');
  if (sOverlay) sOverlay.addEventListener('click', closeSignupModal);
  if (sClose) sClose.addEventListener('click', closeSignupModal);

  var form = document.getElementById('activitySignupForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var formView = document.getElementById('signupFormView');
      var successView = document.getElementById('signupSuccessView');
      var refEl = document.getElementById('signupRefNumber');
      if (refEl) {
        var n = Math.floor(1000 + Math.random() * 9000);
        refEl.textContent = 'ENZ-' + n;
      }
      if (formView) formView.style.display = 'none';
      if (successView) successView.style.display = '';
    });
  }

  var againBtn = document.getElementById('signupAgainBtn');
  if (againBtn) {
    againBtn.addEventListener('click', function () {
      openSignupModal(document.getElementById('signupActivityTitle') ? document.getElementById('signupActivityTitle').textContent : '');
    });
  }
})();

// ===== Activity Countdown =====
(function () {
  document.querySelectorAll('[data-countdown]').forEach(function (el) {
    var dateStr = el.getAttribute('data-countdown');
    var start = new Date(dateStr + 'T00:00:00');
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var days = Math.round((start - today) / 86400000);
    var isTet = typeof currentLang !== 'undefined' && currentLang === 'tet';
    if (days < 0) {
      el.textContent = isTet ? 'Rejistu taka ona' : 'Registration closed';
      el.className = 'activity-countdown';
      el.style.color = '#64748B';
      el.style.borderColor = 'rgba(255,255,255,0.15)';
      el.style.background = 'transparent';
      var btn = el.closest('.activity-meta');
      if (btn) {
        var regBtn = btn.querySelector('.activity-register-btn');
        if (regBtn) regBtn.style.display = 'none';
      }
    } else if (days === 0) {
      el.textContent = isTet ? 'Hahu ohin' : 'Starts today';
      el.className = 'activity-countdown activity-countdown-soon';
    } else {
      el.textContent = isTet
        ? 'Hahu iha loron ' + days
        : 'Starts in ' + days + ' day' + (days === 1 ? '' : 's');
      el.className = days <= 3 ? 'activity-countdown activity-countdown-soon' : 'activity-countdown activity-countdown-ok';
    }
  });
})();
