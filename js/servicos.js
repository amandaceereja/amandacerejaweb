// Função para inicializar o typewriter na página de serviços
function initTypewriterServicos() {
  const el = document.getElementById("typer-servicos");
  const subtitleEl = document.getElementById("hero-servicos-subtitle");
  if (!el) return;

  let phrases, subtitles;

  // Verificar se estamos na página em português
  if (window.location.pathname.includes("_pt")) {
    phrases = ["Serviços que ofereço"];
    subtitles = ["Soluções completas para presença digital — do desenvolvimento à manutenção."];
  } else if (window.location.pathname.includes("_en")) {
    phrases = ["Services I offer"];
    subtitles = ["Complete solutions for digital presence — from development to maintenance."];
  } else {
    // Espanhol (padrão)
    phrases = ["Servicios que ofrezco"];
    subtitles = ["Soluciones completas para presencia digital — del desarrollo al mantenimiento."];
  }

  // Corrigir o problema: usar apenas uma frase por idioma
  // Não precisamos de múltiplas frases já que não estamos alternando

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let p = 0,
    i = 0,
    deleting = false;
  const typeDelay = 60;
  const holdDelay = 1800;
  const delDelay = 38;

  function updateSubtitle(index) {
    if (subtitleEl) {
      subtitleEl.textContent = subtitles[index];
      // Removido o fade in/out - subtítulo aparece estático
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
      // Escrevendo
      el.textContent = full.slice(0, i + 1);
      i++;
      if (i === full.length) {
        deleting = true;
        return setTimeout(tick, holdDelay);
      }

      return setTimeout(tick, typeDelay);
    } else {
      // Apagando
      el.textContent = current.slice(0, -1);
      i--;
      if (i === 0) {
        deleting = false;
        p = (p + 1) % phrases.length;
        // Removido updateSubtitle - subtítulo permanece estático
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

function initHeroEntranceServicos() {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return;
  if (!window.gsap) return;

  const contentEl = document.querySelector(".hero-servicos__content");
  if (!contentEl) return;

  window.gsap.from(contentEl, {
    opacity: 0,
    y: 50,
    duration: 1,
    delay: 0.5,
    ease: "power2.out",
  });
}

// Função para obter slidesPerView baseado na largura da tela
function getSlidesPerView() {
  const width = window.innerWidth;
  if (width >= 1024) return 3; // Desktop
  if (width >= 768) return 1; // Tablet - agora 1 container por vez
  return 1; // Mobile
}

// Função para inicializar o carrossel de restaurantes
function initRestaurantesCarousel() {
  const slider = document.querySelector(".services-restaurantes-slider");
  if (!slider) return;

  const slides = slider.querySelectorAll(".servico-restaurante-card");
  if (slides.length === 0) return;

  let currentSlide = 0;
  const totalSlides = slides.length;
  let slidesPerView = getSlidesPerView();
  let maxSlide = Math.ceil(totalSlides / slidesPerView) - 1;
  let startX = 0;
  let isDragging = false;

  // Criar indicadores dinamicamente baseado no dispositivo
  const indicatorsContainer = document.querySelector(".services-restaurantes-indicators");
  if (indicatorsContainer) {
    indicatorsContainer.innerHTML = "";

    // Desktop: 3 indicadores (grupos de slides)
    // Móvel/Tablet: 8 indicadores (cards individuais)
    const isDesktop = window.innerWidth >= 1025;
    const numIndicators = isDesktop ? Math.ceil(totalSlides / slidesPerView) : 8;

    for (let i = 0; i < numIndicators; i++) {
      const indicator = document.createElement("div");
      indicator.classList.add("indicator-restaurante");
      indicator.setAttribute("data-slide", i);
      if (i === 0) indicator.classList.add("active");
      indicatorsContainer.appendChild(indicator);
    }
  }

  // Função para atualizar o slide atual
  function updateSlide(newIndex) {
    currentSlide = newIndex;

    const isDesktop = window.innerWidth >= 1025;
    let offset;

    if (isDesktop) {
      // Desktop: navegação por grupos de slides (3 containers por bolinha)
      // Cada bolinha move o carrossel por 3 containers (33.333% cada)
      offset = -(currentSlide * 100);
    } else {
      // Móvel/Tablet: navegação por cards individuais (1 por vez)
      // Como slidesPerView = 1, cada container ocupa 100% da largura
      const cardWidth = 100 / slidesPerView; // 100% tanto no móvel quanto tablet
      offset = -(currentSlide * cardWidth);
    }

    slider.style.transform = `translateX(${offset}%)`;

    // Atualiza os indicadores
    updateIndicators();
  }

  // Função para atualizar os indicadores
  function updateIndicators() {
    const indicators = document.querySelectorAll(
      ".services-restaurantes-indicators .indicator-restaurante"
    );
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle("active", index === currentSlide);
    });
  }

  // Função para ir para o próximo slide individual
  function nextSlide() {
    const isDesktop = window.innerWidth >= 1025;
    const maxIndex = isDesktop ? maxSlide : 7; // Desktop: grupos, Móvel/Tablet: cards individuais
    const newIndex = currentSlide >= maxIndex ? 0 : currentSlide + 1;
    updateSlide(newIndex);
  }

  // Função para ir para o slide anterior individual
  function prevSlide() {
    const isDesktop = window.innerWidth >= 1025;
    const maxIndex = isDesktop ? maxSlide : 7; // Desktop: grupos, Móvel/Tablet: cards individuais
    const newIndex = currentSlide <= 0 ? maxIndex : currentSlide - 1;
    updateSlide(newIndex);
  }

  // Eventos de clique nos indicadores
  const indicators = document.querySelectorAll(
    ".services-restaurantes-indicators .indicator-restaurante"
  );
  indicators.forEach((indicator, index) => {
    indicator.addEventListener("click", () => {
      const isDesktop = window.innerWidth >= 1025;

      if (isDesktop) {
        // Desktop: indicador representa grupo de slides
        updateSlide(index);
      } else {
        // Móvel/Tablet: indicador representa card individual
        if (index < 8) {
          // 0-7 para 8 cards
          updateSlide(index);
        }
      }
    });
  });

  // Eventos de clique nas setas - APENAS DESKTOP
  function initArrowEvents() {
    const isDesktop = window.innerWidth >= 1025;

    if (isDesktop) {
      const arrowLeft = document.querySelector(".solucoes-restaurantes .slider-arrow-left");
      const arrowRight = document.querySelector(".solucoes-restaurantes .slider-arrow-right");

      if (arrowLeft) {
        arrowLeft.addEventListener("click", prevSlide);
      }

      if (arrowRight) {
        arrowRight.addEventListener("click", nextSlide);
      }
    }
  }

  // Inicializar eventos das setas
  initArrowEvents();

  // Reinicializar eventos das setas no resize
  window.addEventListener("resize", initArrowEvents);

  // Funcionalidade de swipe para mobile/tablet
  let touchStartX = 0;
  let touchEndX = 0;
  let isTouching = false;

  function handleTouchStart(e) {
    // Só funciona em mobile/tablet
    if (window.innerWidth >= 1025) return;

    touchStartX = e.touches[0].clientX;
    isTouching = true;
  }

  function handleTouchMove(e) {
    if (!isTouching || window.innerWidth >= 1025) return;

    // Previne o scroll da página durante o swipe
    e.preventDefault();
  }

  function handleTouchEnd(e) {
    if (!isTouching || window.innerWidth >= 1025) return;

    touchEndX = e.changedTouches[0].clientX;
    isTouching = false;

    const swipeDistance = touchStartX - touchEndX;
    const minSwipeDistance = 50; // Distância mínima para considerar um swipe

    if (Math.abs(swipeDistance) > minSwipeDistance) {
      if (swipeDistance > 0) {
        // Swipe para a esquerda - próximo slide
        nextSlide();
      } else {
        // Swipe para a direita - slide anterior
        prevSlide();
      }
    }
  }

  // Adicionar event listeners para touch
  slider.addEventListener("touchstart", handleTouchStart, { passive: true });
  slider.addEventListener("touchmove", handleTouchMove, { passive: false });
  slider.addEventListener("touchend", handleTouchEnd, { passive: true });

  // Eventos de deslize desativados para permitir navegação apenas com bolinhas
  // Removendo cursor de arrastar
  slider.style.cursor = "default";

  // Inicializa o carrossel
  updateSlide(0);
}

// Função para inicializar o carrossel de lojas online (idêntico ao de restaurantes)
function initLojasCarousel() {
  // Função para detectar se é modo responsivo (celular e tablet até 1023px)
  function isMobileResponsive() {
    return window.innerWidth <= 1023;
  }

  const slider = document.querySelector(".services-lojas-slider");
  if (!slider) return;

  const lojasSection = document.querySelector(".solucoes-lojas");
  const containerEl = document.querySelector(".services-lojas-container");

  const slides = slider.querySelectorAll(".servico-loja-card");
  if (slides.length === 0) return;

  let currentSlide = 0;
  const totalSlides = slides.length;
  let slidesPerView = getSlidesPerView();
  let maxSlide = Math.ceil(totalSlides / slidesPerView) - 1;
  let startX = 0;
  let isDragging = false;

  // Swiper desativado para usar navegação manual com bolinhas
  let swiperInstance = null;
  function mountSwiperIfNeeded() {
    // Função desativada para permitir o funcionamento das bolinhas personalizadas
    return;
  }
  // (removido) criação manual de indicadores: passa a ser gerido pelo Swiper

  // Função para atualizar o slide atual
  function updateSlide(newIndex) {
    currentSlide = newIndex;

    const isDesktop = window.innerWidth >= 1025;
    let offset;

    if (isDesktop) {
      // Desktop: navegação por grupos de slides (3 containers por bolinha)
      // Cada bolinha move o carrossel por 3 containers (33.333% cada)
      offset = -(currentSlide * 100);
    } else {
      // Móvel/Tablet: navegação por cards individuais (1 por vez)
      // Como slidesPerView = 1, cada container ocupa 100% da largura
      const cardWidth = 100 / slidesPerView; // 100% tanto no móvel quanto tablet
      offset = -(currentSlide * cardWidth);
    }

    slider.style.transform = `translateX(${offset}%)`;
    slider.style.transition = "transform 0.3s ease-in-out";

    // Atualiza os indicadores
    updateIndicators();
  }

  // Função para atualizar slidesPerView e maxSlide quando a tela muda
  function updateSlidesPerView() {
    console.log("updateSlidesPerView chamada");
    const newSlidesPerView = getSlidesPerView();
    console.log("newSlidesPerView:", newSlidesPerView, "slidesPerView:", slidesPerView);

    // Sempre recriar indicadores
    slidesPerView = newSlidesPerView;
    maxSlide = Math.ceil(totalSlides / slidesPerView) - 1;

    // Recria indicadores com o novo número
    const indicatorsContainer = document.querySelector(".services-lojas-indicators");
    console.log("indicatorsContainer encontrado:", !!indicatorsContainer);
    if (indicatorsContainer) {
      indicatorsContainer.innerHTML = "";

      // Desktop: 3 indicadores (grupos de slides)
      // Móvel/Tablet: 7 indicadores (cards individuais)
      const isDesktop = window.innerWidth >= 1025;
      const numIndicators = isDesktop ? Math.ceil(totalSlides / slidesPerView) : 7;

      for (let i = 0; i < numIndicators; i++) {
        const indicator = document.createElement("div");
        indicator.classList.add("indicator-loja");
        indicator.setAttribute("data-slide", i);
        if (i === 0) indicator.classList.add("active");
        indicatorsContainer.appendChild(indicator);
      }

      // Readicionar eventos de clique aos novos indicadores
      const newIndicators = indicatorsContainer.querySelectorAll(".indicator-loja");
      newIndicators.forEach((indicator, index) => {
        indicator.addEventListener("click", () => {
          const isDesktop = window.innerWidth >= 1025;

          if (isDesktop) {
            // Desktop: indicador representa grupo de slides
            updateSlide(index);
          } else {
            // Móvel/Tablet: indicador representa card individual
            if (index < 7) {
              // 0-6 para 7 cards
              updateSlide(index);
            }
          }
        });
      });
    }

    // Ajusta currentSlide se necessário
    if (currentSlide > maxSlide) {
      currentSlide = maxSlide;
    }

    // Atualiza a posição do slider
    updateSlide(currentSlide);
  }

  // Função para atualizar os indicadores
  function updateIndicators() {
    const indicators = document.querySelectorAll(".services-lojas-indicators .indicator-loja");
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle("active", index === currentSlide);
    });
  }

  // Função para ir para o próximo slide individual
  function nextSlide() {
    const isDesktop = window.innerWidth >= 1025;
    const maxIndex = isDesktop ? maxSlide : 6; // Desktop: grupos, Móvel/Tablet: cards individuais (0-6 para 7 cards)
    const newIndex = currentSlide >= maxIndex ? 0 : currentSlide + 1;
    updateSlide(newIndex);
  }

  // Função para ir para o slide anterior individual
  function prevSlide() {
    const isDesktop = window.innerWidth >= 1025;
    const maxIndex = isDesktop ? maxSlide : 6; // Desktop: grupos, Móvel/Tablet: cards individuais (0-6 para 7 cards)
    const newIndex = currentSlide <= 0 ? maxIndex : currentSlide - 1;
    updateSlide(newIndex);
  }

  // Eventos de clique nos indicadores
  const indicators = document.querySelectorAll(".services-lojas-indicators .indicator-loja");
  indicators.forEach((indicator, index) => {
    indicator.addEventListener("click", () => {
      const isDesktop = window.innerWidth >= 1025;

      if (isDesktop) {
        // Desktop: indicador representa grupo de slides
        updateSlide(index);
      } else {
        // Móvel/Tablet: indicador representa card individual
        if (index < 7) {
          // 0-6 para 7 cards
          updateSlide(index);
        }
      }
    });
  });

  // Eventos de clique nas setas - APENAS DESKTOP
  function initLojasArrowEvents() {
    const isDesktop = window.innerWidth >= 1025;

    if (isDesktop) {
      const arrowLeft = document.querySelector(".solucoes-lojas .slider-arrow-left");
      const arrowRight = document.querySelector(".solucoes-lojas .slider-arrow-right");

      if (arrowLeft) {
        arrowLeft.addEventListener("click", () => {
          if (currentSlide > 0) {
            updateSlide(currentSlide - 1);
          }
        });
      }

      if (arrowRight) {
        arrowRight.addEventListener("click", () => {
          if (currentSlide < maxSlide) {
            updateSlide(currentSlide + 1);
          }
        });
      }
    }
  }

  // Inicializar eventos das setas
  initLojasArrowEvents();

  // Reinicializar eventos das setas no resize
  window.addEventListener("resize", initLojasArrowEvents);

  // Funcionalidade de swipe para mobile/tablet
  let touchStartX = 0;
  let touchEndX = 0;
  let isTouching = false;

  function handleTouchStart(e) {
    // Só funciona em mobile/tablet
    if (window.innerWidth >= 1025) return;

    touchStartX = e.touches[0].clientX;
    isTouching = true;
  }

  function handleTouchMove(e) {
    if (!isTouching || window.innerWidth >= 1025) return;

    // Previne o scroll da página durante o swipe
    e.preventDefault();
  }

  function handleTouchEnd(e) {
    if (!isTouching || window.innerWidth >= 1025) return;

    touchEndX = e.changedTouches[0].clientX;
    isTouching = false;

    const swipeDistance = touchStartX - touchEndX;
    const minSwipeDistance = 50; // Distância mínima para considerar um swipe

    if (Math.abs(swipeDistance) > minSwipeDistance) {
      if (swipeDistance > 0) {
        // Swipe para a esquerda - próximo slide
        nextSlide();
      } else {
        // Swipe para a direita - slide anterior
        prevSlide();
      }
    }
  }

  // Adicionar event listeners para touch
  slider.addEventListener("touchstart", handleTouchStart, { passive: true });
  slider.addEventListener("touchmove", handleTouchMove, { passive: false });
  slider.addEventListener("touchend", handleTouchEnd, { passive: true });

  // Eventos de swipe desativados para permitir navegação apenas com bolinhas

  // Inicializa carrossel sem Swiper
  updateSlide(0);

  // Chama updateSlidesPerView na inicialização para criar os indicadores corretos
  updateSlidesPerView();

  // Define o cursor padrão
  slider.style.cursor = "default";

  // Adiciona listener para resize da janela
  window.addEventListener("resize", updateSlidesPerView);
}

// Função para controlar a visibilidade das setas do carrossel
function initCarouselArrowsVisibility() {
  const arrows = document.querySelectorAll(".solucoes-restaurantes .slider-arrow");
  const restaurantesSection = document.querySelector(".solucoes-restaurantes");

  if (!arrows.length || !restaurantesSection) return;

  function checkSectionVisibility() {
    const rect = restaurantesSection.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

    arrows.forEach((arrow) => {
      arrow.classList.toggle("visible", isVisible);
    });
  }

  // Verifica no scroll e no load
  window.addEventListener("scroll", checkSectionVisibility);
  window.addEventListener("load", checkSectionVisibility);

  // Verificação inicial
  checkSectionVisibility();
}

// Removido: Função para controlar visibilidade das setas - não há mais setas

// Inicialização quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", function () {
  initHeroEntranceServicos();

  // Inicializa o efeito de máquina de escrever
  initTypewriterServicos();

  // Inicializa o carrossel de restaurantes
  initRestaurantesCarousel();

  // Inicializa o carrossel de lojas online
  initLojasCarousel();

  // Inicializa a visibilidade das setas
  initCarouselArrowsVisibility();

  // Removido: Inicialização da visibilidade das setas de lojas - não há mais setas
});
