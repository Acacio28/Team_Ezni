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
      'nav.posts': 'Posts',
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
      'clients.cta': 'Partner with us →',
      'posts.label': 'Insights & Updates',
      'posts.title': 'Latest posts',
      'posts.sub': 'News, tutorials and project notes from the Enzi Dev team — everything we learn, shared.',
      'posts.search': 'Search posts…',
      'posts.empty': 'No posts match your filters.',
      'posts.loadMore': 'Load more',
      'posts.featured': 'Featured',
      'posts.read': 'min read',
      'posts.share': 'Share',
      'posts.copied': 'Link copied',
      'posts.showing': 'Showing {shown} of {total} posts',
      'posts.catAll': 'All',
      'posts.login': 'Admin',
      'posts.logout': 'Logout',
      'posts.newPost': 'New post',
      'posts.loginTitle': 'Admin login',
      'posts.loginHint': 'Sign in to create, edit or delete posts.',
      'posts.username': 'Username',
      'posts.password': 'Password',
      'posts.signIn': 'Sign in',
      'posts.fieldTitle': 'Title',
      'posts.fieldCategory': 'Category',
      'posts.fieldDate': 'Date',
      'posts.fieldAuthor': 'Author',
      'posts.fieldAuthorRole': 'Author role',
      'posts.fieldReadTime': 'Read time (min)',
      'posts.fieldImage': 'Image URL',
      'posts.fieldExcerpt': 'Excerpt',
      'posts.fieldContent': 'Content',
      'posts.fieldTags': 'Tags (comma-separated)',
      'posts.fieldFeatured': 'Featured post',
      'posts.cancel': 'Cancel',
      'posts.save': 'Save',
      'posts.editPost': 'Edit post',
      'posts.deleteConfirm': 'Delete this post?',
      'posts.delete': 'Delete',
      'posts.saved': 'Post saved',
      'posts.deleted': 'Post deleted',
      'posts.edit': 'Edit',
      'posts.loadFailed': 'Could not load posts.'
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
      'nav.posts': 'Post',
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
      'clients.cta': 'Parseiru ho ami →',
      'posts.label': 'Hasaun & Atualizasaun',
      'posts.title': 'Post foun',
      'posts.sub': 'Notisia, tutorial no nota projetu hotu husi ekipa Enzi Dev — tanba ita aprende, ita partaje.',
      'posts.search': 'Buka post…',
      'posts.empty': 'La iha post ne’ebe maka fituran ita.',
      'posts.loadMore': 'Hata’es labarik',
      'posts.featured': 'Destaka',
      'posts.read': 'minutu hanoi',
      'posts.share': 'Partaje',
      'posts.copied': 'Link kopia ona',
      'posts.showing': 'Hatudu {shown} ho {total} post',
      'posts.catAll': 'Hotu',
      'posts.login': 'Admin',
      'posts.logout': 'Sai',
      'posts.newPost': 'Post foun',
      'posts.loginTitle': 'Login admin',
      'posts.loginHint': 'Login hodi kria, hatadikin ohin hanesa post sira.',
      'posts.username': 'Uzúriáriu',
      'posts.password': 'Senha',
      'posts.signIn': 'Login',
      'posts.fieldTitle': 'Titulu',
      'posts.fieldCategory': 'Kategoria',
      'posts.fieldDate': 'Data',
      'posts.fieldAuthor': 'Autor',
      'posts.fieldAuthorRole': 'Kargu autor',
      'posts.fieldReadTime': 'Tempu hanoi (min)',
      'posts.fieldImage': 'URL imajen',
      'posts.fieldExcerpt': 'Resumu',
      'posts.fieldContent': 'Konteúdu',
      'posts.fieldTags': 'Etika (separadu ho vírgula)',
      'posts.fieldFeatured': 'Post destakadu',
      'posts.cancel': 'Kansela',
      'posts.save': 'Grava',
      'posts.editPost': 'Hatadikin post',
      'posts.deleteConfirm': 'Hapus post ida ne’e?',
      'posts.delete': 'Hapus',
      'posts.saved': 'Post grava ona',
      'posts.deleted': 'Post hapus ona',
      'posts.edit': 'Hatadikin',
      'posts.loadFailed': 'La konsege karrega post sira.'
    }
  };

  var currentLang = 'en';

  window.EnziI18n = {
    get lang() { return currentLang; },
    t: function (key) {
      var pack = translations[currentLang] || translations.en;
      return pack[key] || (translations.en[key] || key);
    }
  };

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
    var phElements = document.querySelectorAll('[data-i18n-placeholder]');
    phElements.forEach(function (el) {
      var key = el.getAttribute('data-i18n-placeholder');
      if (translations[lang] && translations[lang][key]) {
        el.setAttribute('placeholder', translations[lang][key]);
      }
    });
    var langCode = document.getElementById('lang-code');
    if (langCode) {
      langCode.textContent = lang === 'tet' ? 'TT' : 'EN';
    }
    document.documentElement.setAttribute('lang', lang === 'tet' ? 'tet' : lang);
    if (typeof renderPosts === 'function') {
      renderPosts();
    }
    if (typeof updatePostModalChrome === 'function') {
      updatePostModalChrome();
    }
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
    if (typeof closePostEditor === 'function') closePostEditor();
    closeTeamModal();
    closeActivityGallery();
    closeSignupModal();
    if (typeof closePostModal === 'function') closePostModal();
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

// ===== Posts Section (dynamic + admin API) =====
(function () {
  var PAGE_SIZE = 6;
  var API_POSTS = '/api/posts/';
  var API_LOGIN = '/api/auth/login/';
  var API_LOGOUT = '/api/auth/logout/';
  var API_ME = '/api/auth/me/';

  var state = {
    category: 'all',
    query: '',
    visible: PAGE_SIZE,
    activeId: null,
    posts: [],
    isAdmin: false,
    username: null,
    editingId: null,
    loading: true,
    loadError: false
  };

  function t(key) {
    if (window.EnziI18n && typeof window.EnziI18n.t === 'function') {
      return window.EnziI18n.t(key);
    }
    return key;
  }

  function isTet() {
    return window.EnziI18n && window.EnziI18n.lang === 'tet';
  }

  function formatDate(iso) {
    if (!iso) return '';
    var d = new Date(iso + 'T00:00:00');
    if (isNaN(d.getTime())) return iso;
    try {
      return d.toLocaleDateString(isTet() ? 'tet-TL' : 'en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch (err) {
      return d.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    }
  }

  function escapeHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function getCsrfToken() {
    var match = document.cookie.match(/(?:^|;\s*)csrftoken=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : '';
  }

  function apiFetch(url, options) {
    options = options || {};
    options.credentials = 'same-origin';
    options.headers = options.headers || {};
    if (options.body && !(options.body instanceof FormData)) {
      options.headers['Content-Type'] = options.headers['Content-Type'] || 'application/json';
    }
    var method = (options.method || 'GET').toUpperCase();
    if (method !== 'GET' && method !== 'HEAD') {
      options.headers['X-CSRFToken'] = getCsrfToken();
    }
    return fetch(url, options).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (data) {
        data.__status = res.status;
        data.__ok = res.ok;
        return data;
      });
    });
  }

  function contentToHtml(content) {
    if (!content) return '';
    return String(content)
      .split(/\n\n+/)
      .map(function (block) {
        var b = block.trim();
        if (!b) return '';
        if (/^•\s/.test(b) || /\n•\s/.test(block)) {
          var items = block.split(/\n/).filter(function (line) {
            return /^•\s/.test(line.trim());
          });
          if (items.length && items.length === block.split(/\n/).filter(function (l) { return l.trim(); }).length) {
            return '<ul>' + items.map(function (line) {
              return '<li>' + escapeHtml(line.replace(/^•\s*/, '')) + '</li>';
            }).join('') + '</ul>';
          }
        }
        if (/^\d+\.\s/.test(b)) {
          var lines = block.split(/\n/).filter(function (l) { return l.trim(); });
          if (lines.length && lines.every(function (l) { return /^\d+\.\s/.test(l.trim()); })) {
            return '<ol>' + lines.map(function (line) {
              return '<li>' + escapeHtml(line.replace(/^\d+\.\s*/, '')) + '</li>';
            }).join('') + '</ol>';
          }
        }
        return '<p>' + escapeHtml(b).replace(/\n/g, '<br>') + '</p>';
      })
      .join('');
  }

  function getCategories() {
    var base = (typeof POST_CATEGORIES !== 'undefined' && Array.isArray(POST_CATEGORIES))
      ? POST_CATEGORIES.slice()
      : [{ key: 'all', label: 'All' }];
    var seen = {};
    base.forEach(function (c) { seen[String(c.key).toLowerCase()] = true; });
    state.posts.forEach(function (p) {
      var cat = String(p.category || '').trim();
      if (cat && !seen[cat.toLowerCase()]) {
        seen[cat.toLowerCase()] = true;
        base.push({ key: cat, label: cat });
      }
    });
    return base;
  }

  function getFiltered() {
    var list = state.posts.slice();
    list.sort(function (a, b) {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return String(b.date || '').localeCompare(String(a.date || ''));
    });
    if (state.category && state.category !== 'all') {
      list = list.filter(function (p) {
        return String(p.category || '').toLowerCase() === state.category.toLowerCase();
      });
    }
    var q = state.query.trim().toLowerCase();
    if (q) {
      list = list.filter(function (p) {
        var hay = [p.title, p.excerpt, p.content, p.author, (p.tags || []).join(' '), p.category]
          .join(' ')
          .toLowerCase();
        return hay.indexOf(q) !== -1;
      });
    }
    return list;
  }

  function observePostCards(root) {
    var els = (root || document).querySelectorAll('[data-animate]:not(.animated)');
    if (typeof IntersectionObserver === 'undefined') {
      els.forEach(function (el) { el.classList.add('animated'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var delay = entry.target.getAttribute('data-delay') || 0;
          setTimeout(function () {
            entry.target.classList.add('animated');
          }, parseInt(delay, 10) || 0);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  function renderFilters() {
    var wrap = document.getElementById('postsFilters');
    if (!wrap) return;
    var cats = getCategories();
    wrap.innerHTML = '';
    cats.forEach(function (cat) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'posts-filter-btn' + (state.category === cat.key ? ' active' : '');
      btn.textContent = cat.key === 'all' ? t('posts.catAll') : cat.label;
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', state.category === cat.key ? 'true' : 'false');
      btn.addEventListener('click', function () {
        state.category = cat.key;
        state.visible = PAGE_SIZE;
        renderPosts();
      });
      wrap.appendChild(btn);
    });
    var dl = document.getElementById('postCategoryList');
    if (dl) {
      dl.innerHTML = '';
      cats.forEach(function (c) {
        if (c.key === 'all') return;
        var opt = document.createElement('option');
        opt.value = c.label;
        dl.appendChild(opt);
      });
    }
  }

  function renderAdminBar() {
    // No login/logout in posts UI. New post only when staff session exists (via /admin/).
    var newBtn = document.getElementById('postsNewBtn');
    var userEl = document.getElementById('postsAdminUser');
    if (newBtn) newBtn.hidden = !state.isAdmin;
    if (userEl) {
      userEl.hidden = !state.isAdmin;
      userEl.textContent = state.username || '';
    }
  }

  function cardHtml(p, index) {
    var isFeaturedCard = !!p.featured && state.category === 'all' && !state.query;
    var delay = (index % 3) * 80;
    var adminActions = state.isAdmin
      ? '<div class="post-card-actions">' +
          '<button type="button" class="post-card-action post-card-edit" data-action="edit" data-id="' + escapeHtml(p.id) + '" title="' + escapeHtml(t('posts.edit')) + '"><i class="fas fa-pen"></i></button>' +
          '<button type="button" class="post-card-action post-card-delete" data-action="delete" data-id="' + escapeHtml(p.id) + '" title="' + escapeHtml(t('posts.delete')) + '"><i class="fas fa-trash"></i></button>' +
        '</div>'
      : '';
    var media = p.image
      ? '<div class="post-card-media">' +
          (p.featured ? '<span class="post-featured-badge">' + escapeHtml(t('posts.featured')) + '</span>' : '') +
          '<img src="' + escapeHtml(p.image) + '" alt="' + escapeHtml(p.title) + '" loading="lazy">' +
          '<span class="post-card-category">' + escapeHtml(p.category || '') + '</span>' +
        '</div>'
      : '<div class="post-card-media">' +
          (p.featured ? '<span class="post-featured-badge">' + escapeHtml(t('posts.featured')) + '</span>' : '') +
          '<div class="post-card-placeholder"><i class="fas fa-newspaper"></i></div>' +
          '<span class="post-card-category">' + escapeHtml(p.category || '') + '</span>' +
        '</div>';

    return (
      '<article class="post-card' + (isFeaturedCard ? ' post-card-featured' : '') + '" ' +
        'data-animate="fade-up" data-delay="' + delay + '" data-post-id="' + escapeHtml(p.id) + '" ' +
        'role="button" tabindex="0" aria-label="' + escapeHtml(p.title) + '">' +
        media +
        adminActions +
        '<div class="post-card-body">' +
          '<h3>' + escapeHtml(p.title) + '</h3>' +
          '<p class="post-card-excerpt">' + escapeHtml(p.excerpt || '') + '</p>' +
          '<div class="post-card-meta">' +
            '<span><i class="fas fa-calendar-days"></i>' + escapeHtml(formatDate(p.date)) + '</span>' +
            '<span><i class="fas fa-user"></i>' + escapeHtml(p.author || '') + '</span>' +
            '<span class="post-card-read">' + escapeHtml(p.readTime || 3) + ' ' + escapeHtml(t('posts.read')) + '</span>' +
          '</div>' +
        '</div>' +
      '</article>'
    );
  }

  function updateCount(shown, total) {
    var el = document.getElementById('postsCount');
    if (!el) return;
    el.textContent = t('posts.showing')
      .replace('{shown}', String(shown))
      .replace('{total}', String(total));
  }

  function findPost(id) {
    var key = String(id);
    return state.posts.find(function (p) { return String(p.id) === key; });
  }

  window.renderPosts = function renderPosts() {
    var grid = document.getElementById('postsGrid');
    var empty = document.getElementById('postsEmpty');
    var moreBtn = document.getElementById('postsMoreBtn');
    if (!grid) return;

    renderFilters();
    renderAdminBar();

    if (state.loading) {
      grid.innerHTML = '<div class="posts-empty posts-loading"><i class="fas fa-circle-notch fa-spin"></i><p>…</p></div>';
      if (empty) empty.hidden = true;
      return;
    }

    if (state.loadError && state.posts.length === 0) {
      grid.innerHTML = '';
      if (empty) {
        empty.hidden = false;
        empty.innerHTML = '<i class="fas fa-triangle-exclamation"></i><p>' + escapeHtml(t('posts.loadFailed')) + '</p>';
      }
      return;
    }

    var filtered = getFiltered();
    var visible = filtered.slice(0, state.visible);

    grid.innerHTML = visible.map(cardHtml).join('');

    if (empty) {
      empty.hidden = filtered.length !== 0;
      if (filtered.length === 0) {
        empty.innerHTML = '<i class="fas fa-newspaper"></i><p>' + escapeHtml(t('posts.empty')) + '</p>';
      }
    }

    if (moreBtn) {
      moreBtn.hidden = filtered.length <= state.visible;
    }

    updateCount(visible.length, filtered.length);

    grid.querySelectorAll('.post-card').forEach(function (card) {
      function openFromCard(e) {
        if (e.target.closest('.post-card-actions')) return;
        openPostModal(card.getAttribute('data-post-id'));
      }
      card.addEventListener('click', openFromCard);
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openFromCard(e);
        }
      });
    });

    grid.querySelectorAll('.post-card-action').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        e.preventDefault();
        var id = btn.getAttribute('data-id');
        var action = btn.getAttribute('data-action');
        if (action === 'edit') openEditor(id);
        else if (action === 'delete') deletePost(id);
      });
    });

    observePostCards(grid);
  };

  window.openPostModal = function openPostModal(id) {
    var listPost = findPost(id);
    if (!listPost) return;

    state.activeId = id;

    function fill(post) {
      var media = document.getElementById('postModalMedia');
      var img = document.getElementById('postModalImage');
      if (media && img) {
        if (post.image) {
          media.hidden = false;
          img.src = post.image;
          img.alt = post.title || '';
        } else {
          media.hidden = true;
          img.removeAttribute('src');
        }
      }

      var cat = document.getElementById('postModalCategory');
      var date = document.getElementById('postModalDate');
      var read = document.getElementById('postModalRead');
      var title = document.getElementById('postModalTitle');
      var avatar = document.getElementById('postModalAvatar');
      var author = document.getElementById('postModalAuthor');
      var role = document.getElementById('postModalAuthorRole');
      var content = document.getElementById('postModalContent');
      var tags = document.getElementById('postModalTags');

      if (cat) cat.textContent = post.category || '';
      if (date) date.textContent = formatDate(post.date);
      if (read) read.textContent = (post.readTime || 3) + ' ' + t('posts.read');
      if (title) title.textContent = post.title || '';
      if (avatar) {
        var initials = String(post.author || 'E')
          .split(/\s+/)
          .map(function (w) { return w.charAt(0); })
          .join('')
          .slice(0, 2)
          .toUpperCase();
        avatar.textContent = initials;
      }
      if (author) author.textContent = post.author || '';
      if (role) role.textContent = post.authorRole || '';
      if (content) content.innerHTML = contentToHtml(post.content || post.excerpt || '');
      if (tags) {
        tags.innerHTML = (post.tags || [])
          .map(function (tag) {
            return '<span class="post-tag">' + escapeHtml(tag) + '</span>';
          })
          .join('');
      }

      updatePostModalChrome();
      updateShareLinks(post);
    }

    if (typeof listPost.content === 'string' && listPost.content) {
      fill(listPost);
    } else {
      apiFetch(API_POSTS + id + '/').then(function (data) {
        if (data.post) {
          var idx = state.posts.findIndex(function (p) { return String(p.id) === String(id); });
          if (idx >= 0) state.posts[idx] = Object.assign({}, state.posts[idx], data.post);
          fill(data.post);
        } else {
          fill(listPost);
        }
      }).catch(function () {
        fill(listPost);
      });
    }

    var modal = document.getElementById('postModal');
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      var closeBtn = document.getElementById('postModalClose');
      if (closeBtn) closeBtn.focus();
    }
  };

  window.closePostModal = function closePostModal() {
    var modal = document.getElementById('postModal');
    if (modal) {
      modal.classList.remove('active');
      if (!document.querySelector('.post-modal.active:not(#postModal), .activity-gallery-modal.active, .activity-share-modal.active, .activity-signup-modal.active, .team-modal.active')) {
        document.body.style.overflow = '';
      }
    }
    state.activeId = null;
    var toast = document.getElementById('postShareToast');
    if (toast) toast.hidden = true;
  };

  window.updatePostModalChrome = function updatePostModalChrome() {
    var shareLabel = document.querySelector('.post-modal-share > span');
    if (shareLabel) shareLabel.textContent = t('posts.share');
    var toast = document.getElementById('postShareToast');
    if (toast) toast.setAttribute('data-i18n', 'posts.copied');
    if (state.activeId) {
      var read = document.getElementById('postModalRead');
      var post = findPost(state.activeId);
      if (read && post) {
        read.textContent = (post.readTime || 3) + ' ' + t('posts.read');
      }
    }
  };

  function updateShareLinks(post) {
    var url = window.location.origin + window.location.pathname + '#posts';
    var text = (post.title || '') + ' — Enzi Dev';
    var encUrl = encodeURIComponent(url);
    var encText = encodeURIComponent(text);

    var wa = document.getElementById('postShareWa');
    var fb = document.getElementById('postShareFb');
    var x = document.getElementById('postShareX');
    if (wa) wa.href = 'https://wa.me/?text=' + encText + '%20' + encUrl;
    if (fb) fb.href = 'https://www.facebook.com/sharer/sharer.php?u=' + encUrl;
    if (x) x.href = 'https://twitter.com/intent/tweet?text=' + encText + '&url=' + encUrl;
  }

  // ---- Data loading ----
  function loadPosts() {
    state.loading = true;
    state.loadError = false;
    renderPosts();
    return apiFetch(API_POSTS).then(function (data) {
      state.posts = Array.isArray(data.posts) ? data.posts : [];
      state.loading = false;
      state.loadError = !data.__ok;
      renderPosts();
    }).catch(function () {
      state.posts = [];
      state.loading = false;
      state.loadError = true;
      renderPosts();
    });
  }

  function refreshMe() {
    return apiFetch(API_ME).then(function (data) {
      state.isAdmin = !!(data.authenticated && data.user && data.user.isStaff);
      state.username = state.isAdmin && data.user ? data.user.username : null;
      renderAdminBar();
      renderPosts();
    }).catch(function () {
      state.isAdmin = false;
      state.username = null;
      renderAdminBar();
    });
  }

  // ---- Editor (create / edit) ----
  function openEditor(id) {
    if (!state.isAdmin) return;
    var modal = document.getElementById('postEditorModal');
    if (!modal) return;

    state.editingId = id != null && id !== '' ? String(id) : null;
    var title = document.getElementById('postEditorTitle');
    var err = document.getElementById('postEditorError');
    if (err) { err.hidden = true; err.textContent = ''; }

    var fields = {
      title: document.getElementById('postFieldTitle'),
      category: document.getElementById('postFieldCategory'),
      date: document.getElementById('postFieldDate'),
      author: document.getElementById('postFieldAuthor'),
      authorRole: document.getElementById('postFieldAuthorRole'),
      readTime: document.getElementById('postFieldReadTime'),
      image: document.getElementById('postFieldImage'),
      excerpt: document.getElementById('postFieldExcerpt'),
      content: document.getElementById('postFieldContent'),
      tags: document.getElementById('postFieldTags'),
      featured: document.getElementById('postFieldFeatured')
    };

    if (state.editingId) {
      if (title) title.textContent = t('posts.editPost');
      // List API has no content — always fetch full post before fill
      apiFetch(API_POSTS + state.editingId + '/').then(function (data) {
        if (!data.post) return;
        var idx = state.posts.findIndex(function (p) { return String(p.id) === String(state.editingId); });
        if (idx >= 0) state.posts[idx] = Object.assign({}, state.posts[idx], data.post);
        fillEditor(fields, data.post);
      }).catch(function () {
        var post = findPost(state.editingId);
        if (post) fillEditor(fields, post);
      });
    } else {
      if (title) title.textContent = t('posts.newPost');
      Object.keys(fields).forEach(function (k) {
        var el = fields[k];
        if (!el) return;
        if (el.type === 'checkbox') el.checked = false;
        else if (k === 'date') el.value = new Date().toISOString().slice(0, 10);
        else if (k === 'readTime') el.value = '3';
        else el.value = '';
      });
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (fields.title) fields.title.focus();
  }

  function fillEditor(fields, post) {
    if (fields.title) fields.title.value = post.title || '';
    if (fields.category) fields.category.value = post.category || '';
    if (fields.date) fields.date.value = post.date || '';
    if (fields.author) fields.author.value = post.author || '';
    if (fields.authorRole) fields.authorRole.value = post.authorRole || '';
    if (fields.readTime) fields.readTime.value = String(post.readTime || 3);
    if (fields.image) fields.image.value = post.image || '';
    if (fields.excerpt) fields.excerpt.value = post.excerpt || '';
    if (fields.content) fields.content.value = post.content || '';
    if (fields.tags) fields.tags.value = (post.tags || []).join(', ');
    if (fields.featured) fields.featured.checked = !!post.featured;
  }

  function closeEditor() {
    var modal = document.getElementById('postEditorModal');
    if (modal) modal.classList.remove('active');
    state.editingId = null;
    if (!document.querySelector('.post-modal.active, .activity-gallery-modal.active, .activity-share-modal.active, .activity-signup-modal.active, .team-modal.active')) {
      document.body.style.overflow = '';
    }
  }

  function showEditorError(msg) {
    var err = document.getElementById('postEditorError');
    if (!err) return;
    err.textContent = msg;
    err.hidden = false;
  }

  function bindEditor() {
    var newBtn = document.getElementById('postsNewBtn');
    if (newBtn) newBtn.addEventListener('click', function () { openEditor(null); });

    var closeBtn = document.getElementById('postEditorClose');
    if (closeBtn) closeBtn.addEventListener('click', closeEditor);
    var cancel = document.getElementById('postEditorCancel');
    if (cancel) cancel.addEventListener('click', closeEditor);
    var overlay = document.getElementById('postEditorOverlay');
    if (overlay) overlay.addEventListener('click', closeEditor);

    var form = document.getElementById('postEditorForm');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!state.isAdmin) return;

        var payload = {
          title: (document.getElementById('postFieldTitle') || {}).value || '',
          category: (document.getElementById('postFieldCategory') || {}).value || 'Company',
          date: (document.getElementById('postFieldDate') || {}).value || '',
          author: (document.getElementById('postFieldAuthor') || {}).value || '',
          authorRole: (document.getElementById('postFieldAuthorRole') || {}).value || '',
          readTime: parseInt((document.getElementById('postFieldReadTime') || {}).value, 10) || 3,
          image: (document.getElementById('postFieldImage') || {}).value || '',
          excerpt: (document.getElementById('postFieldExcerpt') || {}).value || '',
          content: (document.getElementById('postFieldContent') || {}).value || '',
          tags: ((document.getElementById('postFieldTags') || {}).value || '')
            .split(',')
            .map(function (s) { return s.trim(); })
            .filter(Boolean),
          featured: !!((document.getElementById('postFieldFeatured') || {}).checked)
        };

        if (!payload.title.trim() || !payload.content.trim() || !payload.date) {
          showEditorError(t('posts.fieldTitle') + ' / ' + t('posts.fieldContent') + ' / ' + t('posts.fieldDate'));
          return;
        }

        var saveBtn = document.getElementById('postEditorSave');
        if (saveBtn) saveBtn.disabled = true;

        var isEdit = !!state.editingId;
        var url = isEdit ? API_POSTS + state.editingId + '/' : API_POSTS;
        var method = isEdit ? 'PUT' : 'POST';

        apiFetch(url, { method: method, body: JSON.stringify(payload) })
          .then(function (data) {
            if (saveBtn) saveBtn.disabled = false;
            if (data.success) {
              closeEditor();
              return loadPosts();
            }
            var msgs = data.errors
              ? Object.keys(data.errors).map(function (k) { return data.errors[k]; }).join(' ')
              : (data.message || 'Error');
            showEditorError(msgs);
          })
          .catch(function () {
            if (saveBtn) saveBtn.disabled = false;
            showEditorError('Error saving post');
          });
      });
    }
  }

  function deletePost(id) {
    if (!state.isAdmin) return;
    if (!window.confirm(t('posts.deleteConfirm'))) return;
    apiFetch(API_POSTS + id + '/', { method: 'DELETE' }).then(function (data) {
      if (data.success) {
        if (String(state.activeId) === String(id)) closePostModal();
        return loadPosts();
      }
      window.alert(data.message || 'Delete failed');
    }).catch(function () {
      window.alert('Delete failed');
    });
  }

  window.closePostEditor = closeEditor;

  function bindPostsUi() {
    var search = document.getElementById('postsSearch');
    if (search) {
      var timer = null;
      search.addEventListener('input', function () {
        clearTimeout(timer);
        timer = setTimeout(function () {
          state.query = search.value || '';
          state.visible = PAGE_SIZE;
          renderPosts();
        }, 200);
      });
      search.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
          search.value = '';
          state.query = '';
          renderPosts();
        }
      });
    }

    var moreBtn = document.getElementById('postsMoreBtn');
    if (moreBtn) {
      moreBtn.addEventListener('click', function () {
        state.visible += PAGE_SIZE;
        renderPosts();
      });
    }

    var overlay = document.getElementById('postModalOverlay');
    if (overlay) overlay.addEventListener('click', closePostModal);

    var closeBtn = document.getElementById('postModalClose');
    if (closeBtn) closeBtn.addEventListener('click', closePostModal);

    var copyBtn = document.getElementById('postShareCopy');
    if (copyBtn) {
      copyBtn.addEventListener('click', function () {
        var url = window.location.origin + window.location.pathname + '#posts';
        var toast = document.getElementById('postShareToast');
        function showCopied() {
          if (toast) {
            toast.hidden = false;
            setTimeout(function () { toast.hidden = true; }, 2000);
          }
        }
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(url).then(showCopied).catch(function () {
            fallbackCopy(url);
            showCopied();
          });
        } else {
          fallbackCopy(url);
          showCopied();
        }
      });
    }

    function fallbackCopy(text) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch (err) {}
      document.body.removeChild(ta);
    }

    bindEditor();
  }

  function boot() {
    bindPostsUi();
    refreshMe().then(function () {
      return loadPosts();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
