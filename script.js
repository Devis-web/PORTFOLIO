/* ==========================================================================
   Portfolio — JavaScript global
   Vanilla JS, aucune dépendance externe
   ========================================================================== */

(function() {
  'use strict';

  // ========================================================================
  // 1. MENU BURGER
  // ========================================================================
  
  function initMenuBurger() {
    const nav = document.querySelector('nav');
    const menuToggle = document.querySelector('[data-menu-toggle]');
    
    if (!nav || !menuToggle) return;

    // Fonction pour fermer le menu
    const closeMenu = () => {
      nav.classList.remove('nav-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    };

    // Fonction pour basculer le menu
    const toggleMenu = (e) => {
      e.stopPropagation();
      const isOpen = nav.classList.contains('nav-open');
      if (isOpen) {
        closeMenu();
      } else {
        nav.classList.add('nav-open');
        menuToggle.setAttribute('aria-expanded', 'true');
      }
    };

    // Clic sur le bouton hamburger
    menuToggle.addEventListener('click', toggleMenu);

    // Fermer au clic sur un lien de navigation
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', (e) => {
        closeMenu();
      });
    });

    // Fermer au clic en dehors du menu
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && e.target !== menuToggle && !menuToggle.contains(e.target)) {
        closeMenu();
      }
    });

    // Fermer à la touche ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('nav-open')) {
        closeMenu();
      }
    });
  }

  // ========================================================================
  // 2. SCROLL FLUIDE POUR LIENS INTERNES
  // ========================================================================
  
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  // ========================================================================
  // 3. INTERSECTION OBSERVER — APPARITION AU SCROLL
  // ========================================================================
  
  function initRevealOnScroll() {
    const revealElements = document.querySelectorAll('[data-reveal]');
    if (revealElements.length === 0) return;

    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));
  }

  // ========================================================================
  // 4. BOUTON "RETOUR EN HAUT"
  // ========================================================================
  
  function initScrollToTop() {
    const scrollTopBtn = document.querySelector('[data-scroll-top]');
    
    // Créer le bouton s'il n'existe pas
    let btn = scrollTopBtn;
    if (!btn) {
      btn = document.createElement('button');
      btn.setAttribute('data-scroll-top', '');
      btn.setAttribute('aria-label', 'Retour en haut');
      btn.textContent = '↑';
      btn.style.display = 'none';
      document.body.appendChild(btn);
    }

    // Afficher/masquer au scroll
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        btn.style.display = 'block';
      } else {
        btn.style.display = 'none';
      }
    });

    // Clic pour remonter
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ========================================================================
  // 5. SURLIGNER LE LIEN ACTIF DANS LE MENU
  // ========================================================================
  
  function initActiveMenuLink() {
    const navLinks = document.querySelectorAll('nav a[href^="#"], nav a[href$=".html"]');
    if (navLinks.length === 0) return;

    const updateActiveLink = () => {
      // Récupérer la section actuelle
      let activeSection = null;
      const sections = document.querySelectorAll('section[id]');

      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom > 100) {
          activeSection = section.id;
        }
      });

      // Mettre à jour les liens
      navLinks.forEach(link => {
        link.classList.remove('active');
        
        const href = link.getAttribute('href');
        if (activeSection && href === '#' + activeSection) {
          link.classList.add('active');
        } else if (href.endsWith(window.location.pathname.split('/').pop())) {
          link.classList.add('active');
        }
      });
    };

    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink();
  }

  // ========================================================================
  // 6. LIGHTBOX / MODALE SUR IMAGES
  // ========================================================================
  
  function initLightbox() {
    const projectImages = document.querySelectorAll('[data-lightbox] img, .project img');
    if (projectImages.length === 0) return;

    // Créer la modale
    const modal = document.createElement('div');
    modal.className = 'lightbox-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-label', 'Lightbox');
    modal.innerHTML = `
      <div class="lightbox-backdrop"></div>
      <div class="lightbox-content">
        <img class="lightbox-image" src="" alt="" />
        <button class="lightbox-close" aria-label="Fermer">&times;</button>
        <button class="lightbox-prev" aria-label="Image précédente">&lt;</button>
        <button class="lightbox-next" aria-label="Image suivante">&gt;</button>
      </div>
    `;
    document.body.appendChild(modal);

    const backdrop = modal.querySelector('.lightbox-backdrop');
    const image = modal.querySelector('.lightbox-image');
    const closeBtn = modal.querySelector('.lightbox-close');
    const prevBtn = modal.querySelector('.lightbox-prev');
    const nextBtn = modal.querySelector('.lightbox-next');
    let currentIndex = 0;
    let images = [];

    const openLightbox = (img, index) => {
      images = Array.from(projectImages);
      currentIndex = index;
      image.src = img.src;
      image.alt = img.alt;
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    };

    const showImage = (index) => {
      if (images.length === 0) return;
      currentIndex = (index + images.length) % images.length;
      image.src = images[currentIndex].src;
      image.alt = images[currentIndex].alt;
    };

    // Événements
    projectImages.forEach((img, index) => {
      img.style.cursor = 'pointer';
      img.addEventListener('click', () => openLightbox(img, index));
    });

    closeBtn.addEventListener('click', closeLightbox);
    backdrop.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
    nextBtn.addEventListener('click', () => showImage(currentIndex + 1));

    // Clavier
    document.addEventListener('keydown', (e) => {
      if (!modal.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
      if (e.key === 'ArrowRight') showImage(currentIndex + 1);
    });
  }

  // ========================================================================
  // 7. FILTRAGE DES PROJETS PAR TAGS
  // ========================================================================
  
  function initProjectFilter() {
    const filterContainer = document.querySelector('[data-project-filters]');
    const projects = document.querySelectorAll('[data-project-tags]');

    if (!filterContainer || projects.length === 0) return;

    // Récupérer tous les tags uniques
    const allTags = new Set();
    projects.forEach(project => {
      const tags = project.getAttribute('data-project-tags').split(',').map(t => t.trim());
      tags.forEach(tag => allTags.add(tag));
    });

    // Créer les boutons de filtrage
    const allBtn = document.createElement('button');
    allBtn.className = 'filter-btn active';
    allBtn.textContent = 'Tous';
    allBtn.setAttribute('data-filter', 'all');
    filterContainer.appendChild(allBtn);

    allTags.forEach(tag => {
      const btn = document.createElement('button');
      btn.className = 'filter-btn';
      btn.textContent = tag;
      btn.setAttribute('data-filter', tag);
      filterContainer.appendChild(btn);
    });

    // Événement de filtrage
    filterContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('filter-btn')) {
        const filter = e.target.getAttribute('data-filter');

        // Mettre à jour les boutons
        filterContainer.querySelectorAll('.filter-btn').forEach(btn => {
          btn.classList.remove('active');
        });
        e.target.classList.add('active');

        // Filtrer les projets
        projects.forEach(project => {
          if (filter === 'all') {
            project.style.display = '';
            project.classList.add('project-fade-in');
          } else {
            const tags = project.getAttribute('data-project-tags').split(',').map(t => t.trim());
            if (tags.includes(filter)) {
              project.style.display = '';
              project.classList.add('project-fade-in');
            } else {
              project.style.display = 'none';
              project.classList.remove('project-fade-in');
            }
          }
        });
      }
    });
  }

  // ========================================================================
  // 8. THÈME SOMBRE/CLAIR AVEC LOCALSTORAGE
  // ========================================================================
  
  function initThemeToggle() {
    const themeToggle = document.querySelector('[data-theme-toggle]');
    const html = document.documentElement;

    if (!themeToggle) return;

    // Récupérer le thème sauvegardé
    const savedTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);
    themeToggle.setAttribute('aria-pressed', savedTheme === 'light');

    // Basculer le thème
    themeToggle.addEventListener('click', () => {
      const currentTheme = html.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

      html.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      themeToggle.setAttribute('aria-pressed', newTheme === 'light');
    });
  }

  // ========================================================================
  // INITIALISATION GLOBALE
  // ========================================================================
  
  function init() {
    // Vérifier que le DOM est prêt
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    initMenuBurger();
    initSmoothScroll();
    initRevealOnScroll();
    initScrollToTop();
    initActiveMenuLink();
    initLightbox();
    initProjectFilter();
    initThemeToggle();
  }

  // Lancer l'initialisation
  init();
})();

/* ==========================================================================
   STYLES INJECTÉS (optionnel — à ajouter dans style.css si préféré)
   ========================================================================== */

const injectStyles = () => {
  const style = document.createElement('style');
  style.textContent = `
    /* Menu burger */
    [data-menu-toggle] {
      display: none;
      flex-direction: column;
      gap: 6px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 8px;
      z-index: 1001;
    }

    [data-menu-toggle] span {
      width: 24px;
      height: 2px;
      background: var(--text-primary);
      transition: all 0.3s ease;
    }

    [data-menu-toggle][aria-expanded="true"] span:nth-child(1) {
      transform: rotate(45deg) translate(10px, 10px);
    }

    [data-menu-toggle][aria-expanded="true"] span:nth-child(2) {
      opacity: 0;
    }

    [data-menu-toggle][aria-expanded="true"] span:nth-child(3) {
      transform: rotate(-45deg) translate(7px, -7px);
    }

    @media (max-width: 768px) {
      [data-menu-toggle] {
        display: flex;
      }

      nav {
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: var(--bg-secondary);
        border-bottom: 1px solid var(--border);
        flex-direction: column;
        padding: 20px;
      }

      nav.nav-open {
        display: flex;
      }

      nav ul {
        flex-direction: column;
        gap: 10px;
      }
    }

    /* Lien actif */
    nav a.active {
      color: var(--accent);
      border-bottom: 2px solid var(--accent);
    }

    /* Bouton retour en haut */
    [data-scroll-top] {
      position: fixed;
      bottom: 40px;
      right: 40px;
      width: 50px;
      height: 50px;
      background: var(--accent);
      color: white;
      border: none;
      border-radius: 50%;
      font-size: 24px;
      cursor: pointer;
      z-index: 999;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }

    [data-scroll-top]:hover {
      background: var(--accent-light);
      transform: translateY(-3px);
    }

    /* Lightbox */
    .lightbox-modal {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 2000;
    }

    .lightbox-modal.open {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .lightbox-backdrop {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.9);
    }

    .lightbox-content {
      position: relative;
      z-index: 2001;
      max-width: 90%;
      max-height: 90%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .lightbox-image {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }

    .lightbox-close,
    .lightbox-prev,
    .lightbox-next {
      position: absolute;
      background: rgba(255, 255, 255, 0.1);
      border: none;
      color: white;
      font-size: 32px;
      width: 50px;
      height: 50px;
      cursor: pointer;
      border-radius: 4px;
      transition: all 0.3s ease;
    }

    .lightbox-close:hover,
    .lightbox-prev:hover,
    .lightbox-next:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    .lightbox-close {
      top: 20px;
      right: 20px;
    }

    .lightbox-prev {
      left: 20px;
      top: 50%;
      transform: translateY(-50%);
    }

    .lightbox-next {
      right: 20px;
      top: 50%;
      transform: translateY(-50%);
    }

    /* Filtres projets */
    [data-project-filters] {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 30px;
    }

    .filter-btn {
      padding: 8px 16px;
      background: var(--bg-tertiary);
      color: var(--text-secondary);
      border: 1px solid var(--border);
      border-radius: 20px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: 500;
    }

    .filter-btn:hover {
      border-color: var(--accent);
      color: var(--accent);
    }

    .filter-btn.active {
      background: var(--accent);
      color: white;
      border-color: var(--accent);
    }

    .project-fade-in {
      animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    /* Révélation au scroll */
    [data-reveal] {
      opacity: 0;
      transform: translateY(30px);
      transition: all 0.6s ease;
    }

    [data-reveal].revealed {
      opacity: 1;
      transform: translateY(0);
    }

    /* Thème clair */
    [data-theme="light"] {
      --bg-primary: #ffffff;
      --bg-secondary: #f5f5f5;
      --bg-tertiary: #eeeeee;
      --text-primary: #1a1a1a;
      --text-secondary: #4a4a4a;
      --text-muted: #7a7a7a;
    }
  `;
  document.head.appendChild(style);
};

// Injecter les styles (optionnel)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectStyles);
} else {
  injectStyles();
}