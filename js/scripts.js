document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Configurar efecto de expansión de servicios
  setupServiceCardExpansion();
  
  // --- Menú Móvil ---
  const mobileBtn = document.querySelector(".navbar__mobile-btn");
  const navbarMenu = document.querySelector(".navbar__menu");

  if (mobileBtn && navbarMenu) {
    navbarMenu.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        setMenu(false);
        if (mobileBtn) mobileBtn.focus();
      }
    });
  }

  function setMenu(open) {
    if (navbarMenu) navbarMenu.classList.toggle("is-open", open);
    if (mobileBtn) mobileBtn.setAttribute("aria-expanded", open ? "true" : "false");
    if (open && navbarMenu) navbarMenu.querySelector("a")?.focus();
  }

  if (mobileBtn) {
    mobileBtn.addEventListener("click", () => {
      const isOpen = navbarMenu.classList.contains("is-open");
      setMenu(!isOpen);
    });
  }

  if (navbarMenu) {
    navbarMenu.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (!a) return;
      setMenu(false);
      if (mobileBtn) mobileBtn.focus(); // devuelve el foco al trigger (mejor accesibilidad)
    });
  }

  // --- Scroll suave + actualizar hash ---
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (!targetElement) return; // si no existe, no tocamos nada

      e.preventDefault();
      targetElement.scrollIntoView({ behavior: "smooth" });

      // ✅ Actualiza la URL para que el test vea #checklist
      try {
        if (history.replaceState) {
          history.replaceState(null, "", targetId); // no añade entrada al historial
        } else {
          location.hash = targetId; // fallback
        }
      } catch {
        /* noop */
      }
    });
  });

  // --- Scrollspy (robusto) ---
  const sections = document.querySelectorAll("section[id]");
  const navLinks = [...document.querySelectorAll(".navbar__menu a")];

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const id = entry.target.id;
        // Busca el link correspondiente (si no existe, salimos sin error)
        const link = document.querySelector(`.navbar__menu a[href="#${CSS.escape(id)}"]`);
        if (!link) return;

        navLinks.forEach((a) => a.classList.remove("active"));
        link.classList.add("active");
      });
    },
    { threshold: 0.5 }
  );

  sections.forEach((section) => observer.observe(section));

  // --- Animaciones con GSAP/ScrollTrigger ---
  // Guardamos para que, si GSAP no está cargado, NO reviente el resto de JS.
  if (!prefersReducedMotion && window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    gsap.from(".hero__content", {
      opacity: 0,
      y: 50,
      duration: 1,
      delay: 0.5,
    });

    gsap.to(".hero", {
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: 0.5,
      },
      backgroundPositionY: "30%",
    });

    gsap.utils.toArray(".card").forEach((card) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: "top bottom",
          end: "bottom bottom",
          toggleActions: "restart none none reverse",
        },
        opacity: 0,
        y: 50,
        duration: 0.5,
      });
    });
  }

  // --- Checklist: re-animar SIEMPRE al entrar y ocultar al salir ---
  (() => {
    const section = document.querySelector("#checklist");
    const boxes = Array.from(document.querySelectorAll("#checklist .checklist__box"));
    if (!section || !boxes.length) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let timers = [];

    const clearTimers = () => {
      timers.forEach((t) => clearTimeout(t));
      timers = [];
    };

    const showWithStagger = () => {
      clearTimers();
      // Resetea primero (por si venimos de media animación)
      boxes.forEach((b) => b.classList.remove("is-checked"));

      if (prefersReduced) {
        boxes.forEach((b) => b.classList.add("is-checked"));
        return;
      }

      boxes.forEach((box, i) => {
        const t = setTimeout(() => box.classList.add("is-checked"), i * 300);
        timers.push(t);
      });
    };

    const hideAll = () => {
      clearTimers();
      boxes.forEach((b) => b.classList.remove("is-checked"));
    };

    // Observa entradas y salidas de la sección
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target !== section) return;
          if (entry.isIntersecting) {
            // Entra: vuelve a animar
            showWithStagger();
          } else {
            // Sale: oculta para poder re-animar la próxima vez
            hideAll();
          }
        });
      },
      { threshold: [0, 0.35] }
    ); // dispara cerca del 35% visible

    io.observe(section);
  })();

  // --- Sobre mí: revelar al entrar en viewport ---
  (() => {
    const section = document.querySelector("#sobre");
    if (!section) return;

    const show = () => section.classList.add("in-view");

    // Fallback si el navegador no soporta IO
    if (!("IntersectionObserver" in window)) {
      show();
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            show();
            io.disconnect(); // solo una vez; quita esta línea si quieres que entre/salga
          }
        });
      },
      { threshold: 0.2 }
    );

    io.observe(section);
  })();

  // --- Botón "Volver arriba" visible solo al llegar al final ---
  (() => {
    const btn = document.getElementById("back-to-top");
    if (!btn) return;

    window.addEventListener("scroll", () => {
      // Altura total del documento
      const docHeight = document.documentElement.scrollHeight;
      // Altura visible (viewport)
      const winHeight = window.innerHeight;
      // Distancia actual scrolleada
      const scrollPos = window.scrollY + winHeight;

      // Si llegó al final (o casi, con tolerancia de 20px)
      if (scrollPos >= docHeight - 20) {
        btn.classList.add("show");
      } else {
        btn.classList.remove("show");
      }
    });

    // Scroll suave al top
    btn.addEventListener("click", (e) => {
      e.preventDefault();

      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({
        top: 0,
        behavior: prefersReduced ? "auto" : "smooth",
      });
    });
  })();

  // Servicios: activar animación móvil al entrar en viewport (badge + micro swipe)
  (() => {
    const track = document.querySelector(".servicios-track");
    if (!track) return;

    const isMobile = () => window.matchMedia("(max-width: 640px)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!isMobile() || reduced) return;

    let hinted = false;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            track.classList.add("is-in");
            if (!hinted) {
              track.classList.add("swipe-hint", "hint-label");
              hinted = true;
              setTimeout(() => track.classList.remove("swipe-hint", "hint-label"), 2600);
            }
          }
        });
      },
      { threshold: 0.25 }
    );

    io.observe(track);
  })();

  // --- Typewriter simple (estilo Parrish) ---
  function initTypewriter() {
    const el = document.getElementById("typer");
    const subtitleEl = document.getElementById("hero-subtitle");
    if (!el) return;

    let phrases, subtitles;

    // Verificar se estamos na página em português e se as traduções estão disponíveis
    if (window.location.pathname.includes('_pt') && window.translations_pt) {
      // Usar traduções do pt.js
      phrases = [
        window.translations_pt['hero.phrases.frontend'],
        window.translations_pt['hero.phrases.fullstack'],
        window.translations_pt['hero.phrases.freelance'],
        window.translations_pt['hero.phrases.digital']
      ];

      subtitles = [
        window.translations_pt['hero.subtitles.frontend'],
        window.translations_pt['hero.subtitles.fullstack'],
        window.translations_pt['hero.subtitles.freelance'],
        window.translations_pt['hero.subtitles.digital']
      ];
    } else if (window.location.pathname.includes('_en')) {
      // Usar frases em inglês
      phrases = [
        "Frontend Developer",
        "Fullstack Software Engineer", 
        "Freelance Web Designer",
        "digital experience creator"
      ];

      subtitles = [
        "I create modern, responsive interfaces focused on user experience.",
        "I develop complete web applications and management software systems.",
        "I design and develop custom websites for businesses and digital projects.",
        "I generate functional and attractive digital experiences, focused on usability and UX/UI."
      ];
    } else {
      // Usar frases em espanhol (padrão)
      phrases = [
        "Desarrolladora Frontend",
        "Ingeniera de Software Fullstack", 
        "Diseñadora web Freelance",
        "creadora de experiencias digitales"
      ];

      subtitles = [
        "Creo interfaces modernas, responsivas y centradas en la experiencia del usuario.",
        "Desarrollo aplicaciones web completas y sistemas de software de gestión.",
        "Diseño y desarrollo sitios web personalizados para negocios y proyectos digitales.",
        "Genero experiencias digitales funcionales y atractivas, centradas en la usabilidad y UX/UI."
      ];
    }

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let p = 0,
      i = 0,
      deleting = false;
    const typeDelay = 60; // velocidad tecleo
    const holdDelay = 1800; // pausa al terminar palabra
    const delDelay = 38; // velocidad borrado

    function updateSubtitle(index) {
      if (subtitleEl) {
        subtitleEl.style.opacity = '0';
        setTimeout(() => {
          subtitleEl.textContent = subtitles[index];
          subtitleEl.style.opacity = '1';
        }, 300);
      }
    }

    function tick() {
      const full = phrases[p];
      const current = el.textContent || "";

      if (prefersReduced) {
        el.textContent = phrases[0];
        if (subtitleEl) subtitleEl.textContent = subtitles[0];
        return;
      }

      if (!deleting) {
        // Escribiendo
        el.textContent = full.slice(0, i + 1);
        i++;
        if (i === full.length) {
          deleting = true;
          return setTimeout(tick, holdDelay);
        }

        return setTimeout(tick, typeDelay);
      } else {
        // Borrando
        el.textContent = current.slice(0, -1);
        i--;
        if (i === 0) {
          deleting = false;
          p = (p + 1) % phrases.length;
          updateSubtitle(p); // Atualiza o subtítulo quando muda a frase
          return setTimeout(tick, 260);
        }
        return setTimeout(tick, delDelay);
      }
    }

    el.textContent = "";
    if (subtitleEl) {
      subtitleEl.textContent = subtitles[0];
    }
    tick();
  }

  initTypewriter();
});

// Función para manejar la expansión de las tarjetas de servicio
function setupServiceCardExpansion() {
  const serviciosCards = document.querySelector('.servicios-cards');
  const serviciosTrack = document.querySelector('.servicios-track');
  
  if (serviciosCards) {
    const cards = serviciosCards.querySelectorAll('.card');
    let webPagesCard = null;
    let followingCards = [];
    
    // Identificar el card de Web Pages y los siguientes
    cards.forEach((card, index) => {
      const title = card.querySelector('h3');
      if (title && (title.textContent.includes('Web Pages') || title.getAttribute('data-translate') === 'services.webpages')) {
        webPagesCard = card;
        webPagesCard.classList.add('webpages-card');
        
        // Obtener todos los cards siguientes
        followingCards = Array.from(cards).slice(index + 1);
      }
    });
    
    if (webPagesCard) {
      const planContainers = webPagesCard.querySelectorAll('.plan-container');
      
      planContainers.forEach(planContainer => {
        planContainer.addEventListener('mouseenter', () => {
          // Expandir el card de Web Pages
          webPagesCard.classList.add('expanded');
          
          // Mover los cards siguientes hacia abajo
          followingCards.forEach(card => {
            card.classList.add('move-down');
          });
        });
        
        planContainer.addEventListener('mouseleave', () => {
          // Contraer el card de Web Pages
          webPagesCard.classList.remove('expanded');
          
          // Volver los cards siguientes a su posición original
          followingCards.forEach(card => {
            card.classList.remove('move-down');
          });
        });
      });
    }
  }
  
  // LÓGICA CORRETA: Hover na segunda coluna → terceira coluna aparece → Web Pages desliza
  if (serviciosTrack && serviciosCards) {
    const serviceCards = serviciosTrack.querySelectorAll('.service-card');
    console.log('🔍 Cards encontrados:', serviceCards.length);
    
    serviceCards.forEach((serviceCard, index) => {
      console.log(`📝 Configurando eventos para card ${index + 1}`);
      
      serviceCard.addEventListener('mouseenter', () => {
        console.log(`🖱️ HOVER na segunda coluna (card ${index + 1})`);
        console.log(`📋 Terceira coluna aparece automaticamente via CSS`);
        console.log(`🎯 Seção Web Pages desliza suavemente para baixo`);
        
        // Quando terceira coluna aparece, Web Pages desliza suavemente
        serviciosCards.classList.add('slide-down-from-features');
      });
      
      serviceCard.addEventListener('mouseleave', () => {
        console.log(`🖱️ HOVER FINALIZADO no card ${index + 1}`);
        console.log(`📋 Terceira coluna desaparece automaticamente via CSS`);
        console.log(`🎯 Seção Web Pages volta à posição original`);
        
        // Quando terceira coluna desaparece, Web Pages volta ao normal
        serviciosCards.classList.remove('slide-down-from-features');
      });
    });
  } else {
    console.log('❌ ERRO: serviciosTrack ou serviciosCards não encontrados!');
  }
}

  // Dropdown functionality
  const dropdowns = document.querySelectorAll('.dropdown');
  
  dropdowns.forEach(dropdown => {
    const toggle = dropdown.querySelector('.dropdown-toggle');
    
    toggle.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Close other dropdowns
      dropdowns.forEach(otherDropdown => {
        if (otherDropdown !== dropdown) {
          otherDropdown.classList.remove('active');
        }
      });
      
      // Toggle current dropdown
      dropdown.classList.toggle('active');
    });
  });
  
  // Close dropdown when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.dropdown')) {
      dropdowns.forEach(dropdown => {
        dropdown.classList.remove('active');
      });
    }
  });

  // Menu Icon functionality
  const menuIcon = document.querySelector(".navbar-menu-icon");
  if (menuIcon) {
    const menuIconBtn = menuIcon.querySelector(".menu-icon-btn");

    menuIconBtn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      // Close other dropdowns
      dropdowns.forEach((dropdown) => {
        dropdown.classList.remove("active");
      });

      // Toggle menu icon dropdown
      menuIcon.classList.toggle("active");
    });
  }

  // Close menu icon when clicking outside
  document.addEventListener("click", function (e) {
    if (menuIcon && !e.target.closest(".navbar-menu-icon")) {
      menuIcon.classList.remove("active");
    }
  });

  // Close dropdown on mobile menu close
  const mobileBtn = document.querySelector(".navbar__mobile-btn");
  if (mobileBtn) {
    mobileBtn.addEventListener("click", function () {
      dropdowns.forEach((dropdown) => {
        dropdown.classList.remove("active");
      });
      if (menuIcon) {
        menuIcon.classList.remove("active");
      }
    });
  }

  // ===== SERVICES SLIDER FUNCTIONALITY =====
  function initServicesSlider() {
    const slider = document.querySelector('.services-slider');
    const indicators = document.querySelectorAll('.indicator');
    let currentSlide = 0;

    if (!slider || indicators.length === 0) return;

    function goToSlide(slideIndex) {
      currentSlide = slideIndex;
      const translateX = -(slideIndex * 33.333);
      slider.style.transform = `translateX(${translateX}%)`;
      
      // Atualizar indicadores
      indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === slideIndex);
      });
    }

    // Adicionar event listeners aos indicadores
    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
        goToSlideWithArrows(index);
      });
    });

    // Suporte para navegação por teclado
    indicators.forEach((indicator, index) => {
      indicator.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          goToSlideWithArrows(index);
        }
      });
    });

    // Suporte para swipe em dispositivos móveis
    let startX = 0;
    let isDragging = false;

    slider.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
    });

    slider.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      e.preventDefault();
    });

    slider.addEventListener('touchend', (e) => {
      if (!isDragging) return;
      isDragging = false;
      
      const endX = e.changedTouches[0].clientX;
      const diffX = startX - endX;
      
      if (Math.abs(diffX) > 50) { // Mínimo de 50px para considerar swipe
        if (diffX > 0 && currentSlide < 2) {
          goToSlideWithArrows(currentSlide + 1);
        } else if (diffX < 0 && currentSlide > 0) {
          goToSlideWithArrows(currentSlide - 1);
        }
      }
    });

    // Navegação por teclado (setas)
    document.addEventListener('keydown', (e) => {
      if (e.target.closest('.services-slider-container')) {
        if (e.key === 'ArrowLeft' && currentSlide > 0) {
          e.preventDefault();
          goToSlideWithArrows(currentSlide - 1);
        } else if (e.key === 'ArrowRight' && currentSlide < 2) {
          e.preventDefault();
          goToSlideWithArrows(currentSlide + 1);
        }
      }
    });

    // Funcionalidade das setas de navegação
    const leftArrow = document.querySelector('.slider-arrow-left');
    const rightArrow = document.querySelector('.slider-arrow-right');

    if (leftArrow) {
      leftArrow.addEventListener('click', () => {
        if (currentSlide > 0) {
          goToSlideWithArrows(currentSlide - 1);
        }
      });
    }

    if (rightArrow) {
      rightArrow.addEventListener('click', () => {
        if (currentSlide < 2) {
          goToSlideWithArrows(currentSlide + 1);
        }
      });
    }

    // Atualizar visibilidade das setas baseado no slide atual
    function updateArrowsVisibility() {
      if (leftArrow) {
        leftArrow.style.opacity = currentSlide === 0 ? '0.5' : '1';
        leftArrow.style.cursor = currentSlide === 0 ? 'not-allowed' : 'pointer';
      }
      if (rightArrow) {
        rightArrow.style.opacity = currentSlide === 2 ? '0.5' : '1';
        rightArrow.style.cursor = currentSlide === 2 ? 'not-allowed' : 'pointer';
      }
    }

    // Modificar a função goToSlide para incluir a atualização das setas
    function goToSlideWithArrows(slideIndex) {
      goToSlide(slideIndex);
      updateArrowsVisibility();
    }

    // Atualizar swipe para usar a nova função
    slider.addEventListener('touchend', (e) => {
      if (!isDragging) return;
      isDragging = false;
      
      const endX = e.changedTouches[0].clientX;
      const diffX = startX - endX;
      
      if (Math.abs(diffX) > 50) { // Mínimo de 50px para considerar swipe
        if (diffX > 0 && currentSlide < 2) {
          goToSlideWithArrows(currentSlide + 1);
        } else if (diffX < 0 && currentSlide > 0) {
          goToSlideWithArrows(currentSlide - 1);
        }
      }
    });
 
    // Inicializar visibilidade das setas
    updateArrowsVisibility();
  }

  // Inicializar o slider
  initServicesSlider();

  // ===== CORREÇÃO GLOBAL DE ROLAGEM INICIAL =====
  // Garante que as páginas comecem do topo, exceto quando há uma âncora na URL
  function aplicarCorrecaoRolagem() {
    // Verifica se há uma âncora (hash) na URL
    const hash = window.location.hash;
    
    if (hash) {
      // Se há uma âncora, tenta rolar para a seção correspondente
      const targetElement = document.querySelector(hash);
      if (targetElement) {
        setTimeout(() => {
          targetElement.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
          console.log('[Correção de Rolagem] Rolagem para seção:', hash);
        }, 100);
        return; // Não rola para o topo se há uma âncora válida
      }
    }
    
    // Apenas rola para o topo se não há âncora na URL
    window.scrollTo({ 
      top: 0, 
      behavior: 'instant' 
    });
    
    console.log('[Correção de Rolagem] Aplicada rolagem para o topo absoluto');
  }

  // Aplicar correção no carregamento
  window.addEventListener('load', () => {
    // Primeira tentativa imediata
    aplicarCorrecaoRolagem();
    
    // Segunda tentativa após 300ms para garantir que outros scripts executem
    setTimeout(aplicarCorrecaoRolagem, 300);
  });

  // ===== DETECÇÃO DE HASH PARA NAVEGAÇÃO EXTERNA =====
  // Detecta quando a página é carregada com um hash na URL (links externos)
  function handleHashNavigation() {
    const hash = window.location.hash;
    if (hash) {
      const targetElement = document.querySelector(hash);
      if (targetElement) {
        // Aguarda um pouco para garantir que a página carregou completamente
        setTimeout(() => {
          targetElement.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
          console.log('[Hash Navigation] Navegação para seção:', hash);
        }, 500);
      }
    }
  }

  // Detecta mudanças no hash (quando o usuário navega usando botões do navegador)
  window.addEventListener('hashchange', () => {
    handleHashNavigation();
  });

  // Executa no DOMContentLoaded para casos de navegação externa
  document.addEventListener('DOMContentLoaded', () => {
    handleHashNavigation();
  });
