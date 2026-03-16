/**
 * Sistema de Seletor de Idiomas
 * Gerencia a troca de idiomas e navegação entre páginas
 */

class LanguageSelector {
  constructor() {
    this.currentLang = this.detectCurrentLanguage();
    this.portal = null;
    this.dropdownHome = null;
    this.init();
  }

  /**
   * Detecta o idioma atual baseado na URL ou no conteúdo da página
   */
  detectCurrentLanguage() {
    const path = window.location.pathname;
    const filename = path.split("/").pop();

    // Detecta baseado no nome do arquivo
    if (filename.includes("_pt.html") || filename === "index_pt.html") {
      return "pt";
    } else if (filename.includes("_en.html") || filename === "index_en.html") {
      return "en";
    } else {
      return "es"; // Padrão espanhol
    }
  }

  /**
   * Mapeia as páginas para cada idioma
   */
  getPageMappings() {
    return {
      "index.html": {
        es: "index.html",
        pt: "index_pt.html",
        en: "index_en.html",
      },
      "index_pt.html": {
        es: "index.html",
        pt: "index_pt.html",
        en: "index_en.html",
      },
      "index_en.html": {
        es: "index.html",
        pt: "index_pt.html",
        en: "index_en.html",
      },
      "servicos.html": {
        es: "servicos.html",
        pt: "servicos_pt.html",
        en: "servicos_en.html",
      },
      "servicos_pt.html": {
        es: "servicos.html",
        pt: "servicos_pt.html",
        en: "servicos_en.html",
      },
      "servicos_en.html": {
        es: "servicos.html",
        pt: "servicos_pt.html",
        en: "servicos_en.html",
      },
      "portafolio.html": {
        es: "portafolio.html",
        pt: "portafolio_pt.html",
        en: "portafolio_en.html",
      },
      "portafolio_pt.html": {
        es: "portafolio.html",
        pt: "portafolio_pt.html",
        en: "portafolio_en.html",
      },
      "portafolio_en.html": {
        es: "portafolio.html",
        pt: "portafolio_pt.html",
        en: "portafolio_en.html",
      },
      "presupuesto.html": {
        es: "presupuesto.html",
        pt: "presupuesto_pt.html",
      },
      "presupuesto_pt.html": {
        es: "presupuesto.html",
        pt: "presupuesto_pt.html",
      },
      "checklist.html": {
        es: "checklist.html",
        pt: "checklist_pt.html",
        en: "checklist_en.html",
      },
      "checklist_pt.html": {
        es: "checklist.html",
        pt: "checklist_pt.html",
        en: "checklist_en.html",
      },
      "checklist_en.html": {
        es: "checklist.html",
        pt: "checklist_pt.html",
        en: "checklist_en.html",
      },
      "proceso.html": {
        es: "proceso.html",
        pt: "proceso_pt.html",
        en: "proceso_en.html",
      },
      "proceso_pt.html": {
        es: "proceso.html",
        pt: "proceso_pt.html",
        en: "proceso_en.html",
      },
      "proceso_en.html": {
        es: "proceso.html",
        pt: "proceso_pt.html",
        en: "proceso_en.html",
      },
      "privacidad.html": {
        es: "privacidad.html",
        pt: "privacidad_pt.html",
        en: "privacidad_en.html",
      },
      "privacidad_pt.html": {
        es: "privacidad.html",
        pt: "privacidad_pt.html",
        en: "privacidad_en.html",
      },
      "privacidad_en.html": {
        es: "privacidad.html",
        pt: "privacidad_pt.html",
        en: "privacidad_en.html",
      },
    };
  }

  /**
   * Inicializa o seletor de idiomas
   */
  init() {
    const selector = document.querySelector(".language-selector");
    if (!selector) return;

    const toggle = selector.querySelector(".language-selector__toggle");
    const dropdown = selector.querySelector(".language-selector__dropdown");
    const options = selector.querySelectorAll(".language-selector__option");

    if (dropdown) {
      this.dropdownHome = { parent: dropdown.parentElement, nextSibling: dropdown.nextSibling };
    }

    // Configura o estado inicial
    this.updateActiveOption(options);

    // Event listener para o toggle
    if (toggle) {
      toggle.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.toggleDropdown(selector);
      });
    }

    // Event listeners para as opções
    options.forEach((option) => {
      option.addEventListener("click", (e) => {
        e.preventDefault();
        const lang = option.getAttribute("data-lang");
        this.changeLanguage(lang);
      });
    });

    // Fecha o dropdown ao clicar fora
    document.addEventListener("click", (e) => {
      if (!this.isEventInside(selector, e.target)) {
        this.closeDropdown(selector);
      }
    });

    // Fecha o dropdown com ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeDropdown(selector);
      }
    });

    window.addEventListener("resize", () => {
      if (selector.classList.contains("is-open")) {
        this.positionPortal(selector);
      }
    });

    window.addEventListener(
      "scroll",
      () => {
        if (selector.classList.contains("is-open")) {
          this.positionPortal(selector);
        }
      },
      { passive: true, capture: true }
    );
  }

  /**
   * Alterna a visibilidade do dropdown
   */
  toggleDropdown(selector) {
    const isOpen = selector.classList.contains("is-open");
    if (isOpen) {
      this.closeDropdown(selector);
    } else {
      this.openDropdown(selector);
    }
  }

  /**
   * Abre o dropdown
   */
  openDropdown(selector) {
    selector.classList.add("is-open");
    this.mountDropdownInPortal(selector);

    // Foca no primeiro item para acessibilidade
    const firstOption =
      this.portal?.querySelector(".language-selector__option") ||
      selector.querySelector(".language-selector__option");
    if (firstOption) {
      firstOption.focus();
    }
  }

  /**
   * Fecha o dropdown
   */
  closeDropdown(selector) {
    selector.classList.remove("is-open");
    this.unmountDropdownToHome(selector);
  }

  ensurePortal() {
    if (this.portal) return this.portal;
    const portal = document.createElement("div");
    portal.className = "language-selector__portal";
    document.body.appendChild(portal);
    this.portal = portal;
    return portal;
  }

  mountDropdownInPortal(selector) {
    const dropdown =
      selector.querySelector(".language-selector__dropdown") ||
      this.portal?.querySelector(".language-selector__dropdown");
    if (!dropdown) return;
    const portal = this.ensurePortal();
    if (dropdown.parentElement !== portal) {
      portal.appendChild(dropdown);
    }
    dropdown.classList.add("is-open");
    this.positionPortal(selector);
  }

  unmountDropdownToHome(selector) {
    const dropdown = this.portal?.querySelector(".language-selector__dropdown");
    if (dropdown) {
      dropdown.classList.remove("is-open");
      if (this.dropdownHome?.parent) {
        this.dropdownHome.parent.insertBefore(dropdown, this.dropdownHome.nextSibling || null);
      } else {
        selector.appendChild(dropdown);
      }
    }
    if (this.portal) {
      this.portal.removeAttribute("style");
    }
  }

  positionPortal(selector) {
    if (!this.portal) return;
    const toggle = selector.querySelector(".language-selector__toggle");
    const dropdown = this.portal.querySelector(".language-selector__dropdown");
    if (!toggle || !dropdown) return;

    const rect = toggle.getBoundingClientRect();
    const gap = 8;
    const top = Math.round(rect.bottom + gap);
    const right = Math.max(8, Math.round(window.innerWidth - rect.right));

    this.portal.style.top = `${top}px`;
    this.portal.style.right = `${right}px`;
    this.portal.style.left = "auto";
  }

  isEventInside(selector, target) {
    if (selector.contains(target)) return true;
    if (this.portal && this.portal.contains(target)) return true;
    return false;
  }

  /**
   * Atualiza a opção ativa baseada no idioma atual
   */
  updateActiveOption(options) {
    options.forEach((option) => {
      const lang = option.getAttribute("data-lang");
      if (lang === this.currentLang) {
        option.classList.add("is-active");
      } else {
        option.classList.remove("is-active");
      }
    });
  }

  /**
   * Muda o idioma e navega para a página correspondente
   */
  changeLanguage(targetLang) {
    if (targetLang === this.currentLang) return;
    const selector = document.querySelector(".language-selector");
    if (selector) this.closeDropdown(selector);

    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    const mappings = this.getPageMappings();

    // Encontra o mapeamento para a página atual
    let targetPage = null;

    // Procura pela página atual nos mapeamentos
    for (const [page, langs] of Object.entries(mappings)) {
      if (page === currentPage || langs[this.currentLang] === currentPage) {
        targetPage = langs[targetLang];
        break;
      }
    }

    // Se não encontrou mapeamento, tenta a página index
    if (!targetPage) {
      const indexMappings = mappings["index.html"];
      targetPage = indexMappings[targetLang];
    }

    // Navega para a nova página
    if (targetPage) {
      // Preserva parâmetros de URL se existirem
      const urlParams = window.location.search;
      const hash = window.location.hash;

      const isProcesoPage = (page) => /^proceso(?:_(?:pt|en))?\.html$/i.test(page || "");
      const isProcesoHash = (value) => /^#(?:fase-\d+|phase-\d+)$/i.test(value || "");

      const nextHash =
        isProcesoPage(currentPage) || isProcesoPage(targetPage) || isProcesoHash(hash) ? "" : hash;

      window.location.href = targetPage + urlParams + nextHash;
    }
  }

  /**
   * Método público para mudar idioma (pode ser usado externamente)
   */
  static changeTo(lang) {
    const instance = new LanguageSelector();
    instance.changeLanguage(lang);
  }
}

// Inicializa quando o DOM estiver carregado
document.addEventListener("DOMContentLoaded", () => {
  new LanguageSelector();
});

// Exporta para uso global
window.LanguageSelector = LanguageSelector;
