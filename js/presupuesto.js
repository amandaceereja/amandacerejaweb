// Budget Calculator and Availability System
class BudgetCalculator {
  constructor() {
    this.basePrice = 0;
    this.featuresPrice = 0;
    this.timelineMultiplier = 1;
    this.selectedProject = null;
    this.selectedFeatures = [];
    this.selectedTimeline = "normal";
    this.selectedPlan = null;
    this.totalPrice = 0;
    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    // Project type selection
    document.querySelectorAll(".project-card").forEach((card) => {
      card.addEventListener("click", (e) => {
        // Don't trigger if clicking on info button or plan buttons
        if (e.target.closest(".info-trigger") || e.target.closest(".plan-btn")) {
          return;
        }
        this.selectProject(e.currentTarget);
      });
    });

    // Info trigger buttons (modal)
    document.querySelectorAll(".info-trigger").forEach((trigger) => {
      trigger.addEventListener("click", (e) => {
        e.stopPropagation();
        this.showFeatureInfo(e.currentTarget);
      });
    });

    // Plan buttons
    document.querySelectorAll(".plan-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.selectPlan(e.currentTarget);
      });
    });

    // Features selection
    document.querySelectorAll('.feature-item input[type="checkbox"]').forEach((checkbox) => {
      checkbox.addEventListener("change", (e) => this.toggleFeature(e.target));
    });

    // Timeline selection
    document.querySelectorAll(".timeline-option").forEach((option) => {
      option.addEventListener("click", (e) => this.selectTimeline(e.currentTarget));
    });

    // Close tooltips when clicking outside
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".info-trigger") && !e.target.closest(".tooltip")) {
        this.closeAllTooltips();
      }
    });

    // Contact button
    const contactBtn = document.getElementById("contact-btn");
    if (contactBtn) {
      contactBtn.addEventListener("click", () => this.contactForProject());
    }

    // Send button (Enviar)
    const sendBtn = document.getElementById("check-availability");
    if (sendBtn) {
      sendBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.contactForProject();
      });
    }

    // Calendar navigation
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("prev-month")) {
        this.changeMonth(-1);
      } else if (e.target.classList.contains("next-month")) {
        this.changeMonth(1);
      }
    });

    // Delegación: íconos de información de la lista dentro del modal
    document.addEventListener("click", (e) => {
      const btn = e.target.closest(".example-info");
      if (btn) {
        e.preventDefault();
        e.stopPropagation();
        this.showFeatureInfo(btn);
      }
    });

    document.querySelectorAll(".tab-button").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const target = btn.getAttribute("data-tab");
        document.querySelectorAll(".tab-button").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        document.querySelectorAll(".tab-content").forEach((c) => c.classList.remove("active"));
        const targetEl = document.getElementById(target);
        if (targetEl) {
          targetEl.classList.add("active");
        }
        if (target === "systems-tab") {
          const selectedCard = document.querySelector(".project-card.selected");
          const projectType = selectedCard ? selectedCard.dataset.type : this.selectedProject;
          this.toggleSystemsByProjectType(projectType);
        }
      });
    });

    // Modal close functionality
    const modal = document.getElementById("feature-info-modal");
    const modalClose = modal?.querySelector(".modal-close");

    if (modalClose) {
      modalClose.addEventListener("click", () => this.hideFeatureModal());
    }

    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          this.hideFeatureModal();
        }
      });
    }

    // ESC key to close modal
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal?.classList.contains("active")) {
        this.hideFeatureModal();
      }
    });
  }

  selectProject(card) {
    const isAlreadySelected = card.classList.contains("selected");

    document.querySelectorAll(".project-card").forEach((c) => {
      c.classList.remove("selected");
      const planButtons = c.querySelector(".plan-buttons");
      if (planButtons) {
        planButtons.style.display = "none";
        planButtons.classList.remove("show");
      }
    });

    const planSection = document.getElementById("selected-plan-section");
    if (planSection) {
      planSection.style.display = "none";
    }

    this.selectedPlan = null;
    this.basePrice = 0;

    if (!isAlreadySelected) {
      card.classList.add("selected");
      this.selectedProject = card.dataset.type;

      const planButtons = card.querySelector(".plan-buttons");
      if (planButtons) {
        planButtons.style.display = "flex";
        setTimeout(() => {
          planButtons.classList.add("show");
        }, 50);
      }

      const featuresSection = document.getElementById("features-section");
      if (featuresSection) {
        featuresSection.style.display = "block";
      }

      const timelineSection = document.getElementById("timeline-section");
      if (timelineSection) {
        timelineSection.style.display = "block";
      }

      this.toggleWebPageFeatures(this.selectedProject);
      this.updatePriceSummary();
    } else {
      this.selectedProject = null;

      const featuresSection = document.getElementById("features-section");
      if (featuresSection) {
        featuresSection.style.display = "none";
      }

      const timelineSection = document.getElementById("timeline-section");
      if (timelineSection) {
        timelineSection.style.display = "none";
      }

      this.toggleWebPageFeatures(null);
    }
  }

  toggleWebPageFeatures(projectType) {
    const webPageFeatures = document.querySelectorAll(".webpage-only");
    const landingPageFeatures = document.querySelectorAll(".landing-only");
    const ecommerceFeatures = document.querySelectorAll(".ecommerce-only");

    webPageFeatures.forEach((feature) => {
      feature.style.display = "none";
      const checkbox = feature.querySelector('input[type="checkbox"]');
      if (checkbox && checkbox.checked) {
        checkbox.checked = false;
      }
    });

    landingPageFeatures.forEach((feature) => {
      feature.style.display = "none";
      const checkbox = feature.querySelector('input[type="checkbox"]');
      if (checkbox && checkbox.checked) {
        checkbox.checked = false;
      }
    });

    ecommerceFeatures.forEach((feature) => {
      feature.style.display = "none";
      const checkbox = feature.querySelector('input[type="checkbox"]');
      if (checkbox && checkbox.checked) {
        checkbox.checked = false;
      }
    });

    if (projectType === "website") {
      webPageFeatures.forEach((feature) => {
        feature.style.display = "flex";
      });
    } else if (projectType === "landing") {
      landingPageFeatures.forEach((feature) => {
        feature.style.display = "flex";
      });
    } else if (projectType === "ecommerce") {
      ecommerceFeatures.forEach((feature) => {
        feature.style.display = "flex";
      });
    }

    this.toggleSystemsTab(projectType);
    this.toggleIntegrationsTab(projectType);
    this.updatePriceSummary();
  }

  toggleSystemsTab(projectType) {
    const systemsTabButton = document.getElementById("systems-tab-button");

    if (projectType === "landing" || projectType === "website" || projectType === "ecommerce") {
      systemsTabButton.style.display = "block";
      this.toggleSystemsByProjectType(projectType);
    } else {
      systemsTabButton.style.display = "none";
      if (systemsTabButton.classList.contains("active")) {
        const featuresTab = document.querySelector('[data-tab="features-tab"]');
        if (featuresTab) featuresTab.click();
      }
    }
  }

  toggleIntegrationsTab(projectType) {
    const integrationsTabButton = document.getElementById("integrations-tab-button");

    if (projectType === "landing" || projectType === "website" || projectType === "ecommerce") {
      integrationsTabButton.style.display = "block";
    } else {
      integrationsTabButton.style.display = "none";
      if (integrationsTabButton.classList.contains("active")) {
        const featuresTab = document.querySelector('[data-tab="features-tab"]');
        if (featuresTab) featuresTab.click();
      }
    }
  }

  toggleSystemsByProjectType(projectType) {
    const systemsTab = document.getElementById("systems-tab");
    if (!systemsTab) return;

    const allSystemsInTab = systemsTab.querySelectorAll(".feature-item");
    const ecommerceSystems = systemsTab.querySelectorAll(".feature-item.ecommerce-system");
    const webpageSystems = systemsTab.querySelectorAll(".feature-item.webpage-system");
    const landingSystems = systemsTab.querySelectorAll(".feature-item.landing-system");
    const regularSystems = systemsTab.querySelectorAll(
      ".feature-item:not(.ecommerce-system):not(.webpage-system):not(.landing-system)"
    );

    allSystemsInTab.forEach((system) => {
      system.style.display = "none";
      const checkbox = system.querySelector('input[type="checkbox"]');
      if (checkbox && checkbox.checked) {
        checkbox.checked = false;
      }
    });

    if (!projectType) {
      return;
    }

    if (projectType === "ecommerce") {
      regularSystems.forEach((system) => {
        system.style.display = "flex";
      });
      ecommerceSystems.forEach((system) => {
        system.style.display = "flex";
      });
    } else if (projectType === "website") {
      regularSystems.forEach((system) => {
        system.style.display = "flex";
      });
      webpageSystems.forEach((system) => {
        system.style.display = "flex";
      });
    } else if (projectType === "landing") {
      regularSystems.forEach((system) => {
        system.style.display = "flex";
      });
      landingSystems.forEach((system) => {
        system.style.display = "flex";
      });
    }
  }

  selectTimeline(option) {
    document.querySelectorAll(".timeline-option").forEach((o) => o.classList.remove("selected"));
    option.classList.add("selected");
    this.timelineMultiplier = parseFloat(option.dataset.multiplier);
    this.selectedTimeline = option.dataset.multiplier;
    this.updatePriceSummary();
    this.updateDeliveryEstimate();
  }

  toggleFeature(checkbox) {
    const featurePrice = parseInt(checkbox.dataset.price);

    if (checkbox.checked) {
      this.selectedFeatures.push({
        id: checkbox.id,
        price: featurePrice,
      });
    } else {
      this.selectedFeatures = this.selectedFeatures.filter((f) => f.id !== checkbox.id);
    }

    this.calculateFeaturesPrice();
    this.updatePriceSummary();
  }

  calculateFeaturesPrice() {
    this.featuresPrice = this.selectedFeatures.reduce((total, feature) => total + feature.price, 0);
  }

  updatePriceSummary() {
    const baseTotal = this.basePrice + this.featuresPrice;
    const finalTotal = Math.round(baseTotal * this.timelineMultiplier);
    const timelineAdjustment = Math.round(baseTotal * (this.timelineMultiplier - 1));

    document.getElementById("base-price").textContent = `€${this.basePrice.toLocaleString()}`;

    const existingFeatures = document.querySelectorAll(".individual-feature-item");
    existingFeatures.forEach((item) => item.remove());

    const baseItem = document.querySelector("#features-cost").parentNode.children[0];

    this.selectedFeatures.forEach((feature) => {
      const featureItem = document.createElement("div");
      featureItem.className = "price-item individual-feature-item removable";
      const featureName = this.getFeatureName(feature.id);
      featureItem.innerHTML = `
        <span>${featureName}</span>
        <button class="remove-btn" title="Eliminar ${featureName}" data-feature-id="${feature.id}">
          <i class="fas fa-times"></i>
        </button>
        <span>€${feature.price.toLocaleString()}</span>
      `;
      const removeBtn = featureItem.querySelector(".remove-btn");
      removeBtn.addEventListener("click", () => this.removeIndividualFeature(feature.id));
      baseItem.insertAdjacentElement("afterend", featureItem);
    });

    const featuresElement = document.getElementById("features-cost");
    featuresElement.style.display = "none";

    const timelineElement = document.getElementById("timeline-cost");
    if (timelineAdjustment !== 0) {
      timelineElement.style.display = "flex";
      timelineElement.classList.add("removable");
      const sign = timelineAdjustment > 0 ? "+" : "";
      document.getElementById("timeline-price").textContent =
        `${sign}€${timelineAdjustment.toLocaleString()}`;
      if (!timelineElement.querySelector(".remove-btn")) {
        const removeBtn = document.createElement("button");
        removeBtn.className = "remove-btn";
        removeBtn.innerHTML = '<i class="fas fa-times"></i>';
        removeBtn.title = "Restablecer timeline normal";
        removeBtn.addEventListener("click", () => this.resetTimeline());
        timelineElement.appendChild(removeBtn);
      }
    } else {
      timelineElement.style.display = "none";
      timelineElement.classList.remove("removable");
    }

    document.getElementById("total-price").textContent = `€${finalTotal.toLocaleString()}`;
    this.totalPrice = finalTotal;
  }

  removeIndividualFeature(featureId) {
    const checkbox = document.getElementById(featureId);
    if (checkbox) {
      checkbox.checked = false;
    }
    this.selectedFeatures = this.selectedFeatures.filter((f) => f.id !== featureId);
    this.calculateFeaturesPrice();
    this.updatePriceSummary();
  }

  updateDeliveryEstimate() {
    const deliveryElement = document.getElementById("delivery-estimate");

    if (!this.selectedProject || !this.selectedPlan) {
      if (deliveryElement) deliveryElement.textContent = "";
      return;
    }

    const baseTimes = {
      landing: { basico: 1, estandar: 2, premium: 3 },
      website: { basico: 2, estandar: 3, premium: 4 },
      ecommerce: { basico: 4, estandar: 6, premium: 8 },
    };

    let baseTime = baseTimes[this.selectedProject]?.[this.selectedPlan] || 2;

    const selectedFeatures = document.querySelectorAll(
      '.feature-item input[type="checkbox"]:checked'
    );
    let additionalTime = 0;
    selectedFeatures.forEach((checkbox) => {
      additionalTime += parseInt(checkbox.dataset.time) || 0;
    });

    const totalTime = Math.ceil((baseTime + additionalTime) / this.timelineMultiplier);

    if (deliveryElement) {
      const timeText = totalTime === 1 ? "1 semana" : `${totalTime} semanas`;
      deliveryElement.textContent = `Plazo estimado: ${timeText}`;
    }
  }

  toggleTooltip(trigger) {
    this.closeAllTooltips();
    const tooltip = trigger.nextElementSibling;
    if (tooltip && tooltip.classList.contains("tooltip")) {
      tooltip.style.opacity = "1";
      tooltip.style.visibility = "visible";
      tooltip.style.transform = "translateY(0)";
    }
  }

  closeAllTooltips() {
    document.querySelectorAll(".tooltip").forEach((tooltip) => {
      tooltip.style.opacity = "0";
      tooltip.style.visibility = "hidden";
      tooltip.style.transform = "translateY(-10px)";
    });
  }

  selectPlan(planBtn) {
    const plan = planBtn.dataset.plan;
    const projectCard = planBtn.closest(".project-card");
    const projectType = projectCard.dataset.type;

    document.querySelectorAll(".plan-btn").forEach((btn) => {
      btn.classList.remove("selected");
    });

    planBtn.classList.add("selected");

    this.basePrice = this.getPlanPrice(projectType, plan);
    this.selectedPlan = plan;
    this.selectedProject = projectType;

    const featuresSection = document.getElementById("features-section");
    if (featuresSection) {
      featuresSection.style.display = "block";
    }
    const timelineSection = document.getElementById("timeline-section");
    if (timelineSection) {
      timelineSection.style.display = "block";
    }
    const systemsTabButton = document.getElementById("systems-tab-button");
    if (systemsTabButton) {
      systemsTabButton.style.display = "block";
    }

    this.showPlanDetails(projectType, plan);
    this.toggleSystemsTab(projectType);
    this.toggleIntegrationsTab(projectType);
    this.updatePriceSummary();
  }

  getPlanPrice(projectType, plan) {
    const planEl = document.getElementById(`${projectType}-${plan}`);
    if (planEl) {
      const priceEl = planEl.querySelector(".plan-price");
      if (priceEl && priceEl.textContent) {
        const n = parseInt(priceEl.textContent.replace(/[^0-9]/g, ""), 10);
        if (!isNaN(n)) return n;
      }
    }
    const prices = {
      landing: { basico: 450, estandar: 650, premium: 1200 },
      website: { basico: 600, estandar: 1200, premium: 1800 },
      ecommerce: { basico: 800, estandar: 1500, premium: 2000 },
    };
    return prices[projectType]?.[plan] || 0;
  }

  showPlanDetails(projectType, plan) {
    document.querySelectorAll(".plan-details-content").forEach((planDiv) => {
      planDiv.style.display = "none";
    });

    const planId = `${projectType}-${plan}`;
    const selectedPlan = document.getElementById(planId);

    if (selectedPlan) {
      selectedPlan.style.display = "block";
      const planSection = document.getElementById("selected-plan-section");
      if (planSection) {
        planSection.style.display = "block";
        planSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  }

  showAvailability() {
    const availabilitySection = document.getElementById("availability-section");
    if (availabilitySection) {
      availabilitySection.style.display = "block";
      availabilitySection.scrollIntoView({ behavior: "smooth" });
      this.initCalendar();
    }
  }

  initCalendar() {
    this.generateCalendar();
  }

  generateCalendar() {
    const calendarContainer = document.getElementById("calendar-container");
    if (calendarContainer) {
      calendarContainer.innerHTML = `
        <div class="calendar-placeholder">
          <p>Calendario de disponibilidad en desarrollo</p>
        </div>
      `;
    }
  }

  contactForProject() {
    const projectMap = { landing: "Landing Page", website: "Web Page", ecommerce: "E-commerce" };
    const planMap = { basico: "Básico", estandar: "Estándar", premium: "Premium" };
    const projectName = projectMap[this.selectedProject] || "No seleccionado";
    const planName = planMap[this.selectedPlan] || this.selectedPlan || "No seleccionado";
    const base = this.basePrice || 0;
    const featuresLines =
      this.selectedFeatures.length > 0
        ? this.selectedFeatures
            .map((f) => `- ${this.getFeatureName(f.id)} — €${f.price.toLocaleString()}`)
            .join("\n")
        : "- Ninguna";
    const total = this.totalPrice || 0;

    const message = `¡Hola! Me gustaría avanzar con el presupuesto:

Proyecto: ${projectName}
Plan: ${planName}
Precio base: €${base.toLocaleString()}

Ítems adicionales:
${featuresLines}

Total estimado: €${total.toLocaleString()}

¿Podemos coordinar los próximos pasos por email?`;

    const emailUrl = `mailto:amandacerejaweb@gmail.com?subject=${encodeURIComponent(
      "Presupuesto"
    )}&body=${encodeURIComponent(message)}`;
    window.open(emailUrl, "_blank");
  }

  getFeatureName(featureId) {
    const label = document.querySelector(`label[for="${featureId}"]`);
    return label ? label.querySelector("span").textContent : featureId;
  }

  resetTimeline() {
    const normalOption = document.querySelector('.timeline-option[data-multiplier="1"]');
    if (normalOption) {
      this.selectTimeline(normalOption);
    }
  }

  showFeatureInfo(trigger) {
    const modal = document.getElementById("feature-info-modal");
    const modalTitle = document.getElementById("modal-feature-title");
    const modalDescription = document.getElementById("modal-feature-description");
    const modalIcon = document.getElementById("modal-title-icon");
    const modalBack = document.querySelector("#feature-info-modal .modal-back");
    const modalBox = document.querySelector("#feature-info-modal .modal");

    const featureItem = trigger.closest(".feature-item");
    const exampleItem = trigger.closest(".example-item");
    const projectCard = trigger.closest(".project-card");
    const sectionHeader =
      trigger.closest(".section-header") || trigger.closest(".section-title-row");

    let sectionTitle = "";
    let tooltip = null;
    let iconClass = "fas fa-info-circle";

    if (featureItem) {
      const nameEl = featureItem.querySelector("label span");
      sectionTitle = nameEl ? nameEl.textContent : "";
      tooltip = featureItem.querySelector(".tooltip");
      const iconEl = featureItem.querySelector("label i");
      if (iconEl) iconClass = iconEl.className;
      if (modal && modalBack && modalBox) {
        modalBox.classList.remove("show-back");
      }
    } else if (exampleItem) {
      const titleEl = exampleItem.querySelector(".example-text");
      sectionTitle = titleEl ? titleEl.textContent.trim() : "Información";
      tooltip = exampleItem.querySelector(".tooltip");
      iconClass = this.getExampleIcon(sectionTitle);
      if (modal && modalBack && modalBox) {
        if (!modal.dataset.prevTitle) {
          modal.dataset.prevTitle = modalTitle.textContent || "";
          modal.dataset.prevContent =
            modalDescription.innerHTML || modalDescription.textContent || "";
          // extrae clase del icono actual
          const currentIcon = modalIcon.querySelector("i")?.className || "fas fa-info-circle";
          modal.dataset.prevIcon = currentIcon;
        }
        modalBox.classList.add("show-back");
        if (!modalBack._bound) {
          modalBack.addEventListener("click", () => {
            const prevTitle = modal.dataset.prevTitle || "Información";
            const prevContent = modal.dataset.prevContent || "";
            const prevIcon = modal.dataset.prevIcon || "fas fa-info-circle";
            modalTitle.textContent = prevTitle;
            if (prevContent) modalDescription.innerHTML = prevContent;
            if (modalIcon) modalIcon.innerHTML = `<i class="${prevIcon}"></i>`;
            modalBox.classList.remove("show-back");
            delete modal.dataset.prevTitle;
            delete modal.dataset.prevContent;
            delete modal.dataset.prevIcon;
          });
          modalBack._bound = true;
        }
      }
    } else if (projectCard) {
      const projectName = projectCard.querySelector("h3")?.textContent || "";
      const projectIconEl = projectCard.querySelector(".project-icon i");
      if (projectIconEl) iconClass = projectIconEl.className;
      sectionTitle = projectName;
      tooltip = projectCard.querySelector(".tooltip") || trigger.nextElementSibling;
      if (tooltip) {
        // cuando el tooltip tiene estructura extendida, usamos su HTML completo
        if (modalDescription) {
          modalDescription.innerHTML = tooltip.innerHTML || tooltip.textContent;
        }
      }
      if (modal && modalBack && modalBox) {
        modalBox.classList.remove("show-back");
      }
    } else if (sectionHeader) {
      sectionTitle = sectionHeader.querySelector("h3")?.textContent || "";
      tooltip = trigger.nextElementSibling;
      const iconEl = trigger.querySelector("i");
      if (iconEl) iconClass = iconEl.className;
      if (modal && modalBack && modalBox) {
        modalBox.classList.remove("show-back");
      }
    }

    if (modal && modalTitle && modalDescription && tooltip) {
      if (modalIcon) {
        modalIcon.innerHTML = `<i class="${iconClass}"></i>`;
      }
      modalTitle.textContent = sectionTitle;
      if (!projectCard) {
        modalDescription.innerHTML = tooltip.innerHTML || tooltip.textContent;
      }
      modal.classList.add("active");
      document.documentElement.classList.add("feature-modal-open");
      document.body.style.overflow = "hidden";
    }
  }

  // Mapeo de íconos por título/palabras clave (ES)
  getExampleIcon(title) {
    const t = (title || "").toLowerCase();
    const map = {
      "lanzamiento de producto": "fas fa-rocket",
      "promociones y ofertas": "fas fa-tags",
      "cursos y educación": "fas fa-chalkboard-teacher",
      "eventos y webinars": "fas fa-calendar-alt",
      "recaudación y financiamiento colectivo": "fas fa-donate",
      "negocios locales": "fas fa-store",
      restaurantes: "fas fa-utensils",
      influenciadores: "fas fa-bullhorn",
      artistas: "fas fa-palette",
      "agencias de viajes": "fas fa-plane",
      "instituciones educativas": "fas fa-graduation-cap",
      "mini portafolio": "fas fa-address-card",
      "agencias de marketing y consultoría": "fas fa-chart-line",
      "consultores y profesionales independientes": "fas fa-briefcase",
      "servicios de eventos y bodas": "fas fa-heart",
      "clínicas y consultorios": "fas fa-stethoscope",
      "servicios de educación online": "fas fa-graduation-cap",
      "tiendas de ropa": "fas fa-tshirt",
      "tiendas de cosméticos y belleza": "fas fa-spa",
      "mercado de alimentos y bebidas": "fas fa-shopping-basket",
      "artículos para hogar y decoración": "fas fa-couch",
      "productos electrónicos": "fas fa-microchip",
      "productos personalizados": "fas fa-gift",
      "salud y bienestar": "fas fa-heartbeat",
      "librerías online": "fas fa-book-open",
      "productos artesanales y locales": "fas fa-hammer",
      "fitness y deportes": "fas fa-dumbbell",
    };
    if (map[t]) return map[t];
    if (t.includes("lanzamiento")) return "fas fa-rocket";
    if (t.includes("promociones") || t.includes("ofertas")) return "fas fa-tags";
    if (t.includes("cursos") || t.includes("inscripción")) return "fas fa-chalkboard-teacher";
    if (t.includes("eventos") || t.includes("webinars")) return "fas fa-calendar-alt";
    if (t.includes("recaudación") || t.includes("financi")) return "fas fa-donate";
    if (t.includes("consultor")) return "fas fa-briefcase";
    if (t.includes("restaur")) return "fas fa-utensils";
    if (t.includes("tienda") || t.includes("local")) return "fas fa-store";
    if (t.includes("influenc")) return "fas fa-bullhorn";
    if (t.includes("artista")) return "fas fa-palette";
    if (t.includes("viajes")) return "fas fa-plane";
    if (t.includes("educa") || t.includes("escuela") || t.includes("universidad"))
      return "fas fa-graduation-cap";
    if (t.includes("portafolio")) return "fas fa-address-card";
    if (t.includes("marketing")) return "fas fa-chart-line";
    if (t.includes("clínic") || t.includes("consultor")) return "fas fa-stethoscope";
    if (t.includes("salud") || t.includes("bienestar")) return "fas fa-heartbeat";
    if (t.includes("libros") || t.includes("librería")) return "fas fa-book-open";
    if (t.includes("electrón")) return "fas fa-microchip";
    if (t.includes("hogar") || t.includes("decoración")) return "fas fa-couch";
    if (t.includes("personaliz")) return "fas fa-gift";
    if (t.includes("fitness") || t.includes("deporte")) return "fas fa-dumbbell";
    return "fas fa-question-circle";
  }

  hideFeatureModal() {
    const modal = document.getElementById("feature-info-modal");
    if (modal) {
      modal.classList.remove("active");
    }
    document.documentElement.classList.remove("feature-modal-open");
    document.body.style.overflow = "";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.budgetCalculator = new BudgetCalculator();
  initPresupuestoTypewriter();
  initTabs();
  enforceCalculatorLayout();
  window.addEventListener("resize", enforceCalculatorLayout);

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!prefersReducedMotion && window.gsap) {
    window.gsap.from(".hero-content", {
      opacity: 0,
      y: 50,
      duration: 1,
      delay: 0.5,
    });

    if (window.ScrollTrigger) {
      window.gsap.registerPlugin(window.ScrollTrigger);
      window.gsap.to(".hero-presupuesto", {
        scrollTrigger: {
          trigger: ".hero-presupuesto",
          start: "top top",
          end: "bottom top",
          scrub: 0.5,
        },
        backgroundPositionY: "30%",
      });
    }
  }
});

function initPresupuestoTypewriter() {
  const el = document.querySelector(".typewriter");
  const subtitleEl = document.querySelector(".hero-subtitle");
  if (!el || !subtitleEl) return;

  const pathname = window.location.pathname;

  let phrases;
  let subtitles;

  if (pathname.endsWith("presupuesto_en.html")) {
    phrases = ["Online Quote", "Automatic Calculator", "Custom Prices"];
    subtitles = [
      "Calculate your project price in just a few clicks.",
      "Choose the project type, features, extra integrations and essential systems for your website, and calculate the quote in real time.",
      "Choose between custom code development or an online platform and see the price difference depending on the option.",
    ];
  } else {
    phrases = ["Presupuesto Online", "Calculadora Automática", "Precios Personalizados"];
    subtitles = [
      "Calcula el precio de tu proyecto con solo unos clics.",
      "Elige el tipo de proyecto, funcionalidades, integraciones extra y sistemas esenciales para tu sitio, y calcula el presupuesto en tiempo real.",
      "Elige entre desarrollo con código puro o plataforma online y ve la diferencia de precios según la opción elegida.",
    ];
  }

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced) {
    el.textContent = phrases[0];
    subtitleEl.textContent = subtitles[0];
    return;
  }

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typeDelay = 60;
  const deleteDelay = 38;
  const pauseDelay = 1800;

  function updateSubtitle(index) {
    subtitleEl.style.opacity = "0";
    setTimeout(() => {
      subtitleEl.textContent = subtitles[index];
      subtitleEl.style.opacity = "1";
    }, 300);
  }

  function typeChar() {
    const currentPhrase = phrases[phraseIndex];

    if (!isDeleting) {
      el.textContent = currentPhrase.slice(0, charIndex + 1);
      charIndex++;
      if (charIndex === currentPhrase.length) {
        setTimeout(() => {
          isDeleting = true;
          typeChar();
        }, pauseDelay);
        return;
      }
      setTimeout(typeChar, typeDelay);
    } else {
      const current = el.textContent || "";
      el.textContent = current.slice(0, -1);
      charIndex--;

      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        updateSubtitle(phraseIndex);
        setTimeout(typeChar, 260);
        return;
      }

      setTimeout(typeChar, deleteDelay);
    }
  }

  el.textContent = "";
  subtitleEl.textContent = subtitles[0];
  typeChar();
}

function initTabs() {
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const targetTab = this.getAttribute("data-tab");

      tabButtons.forEach((btn) => btn.classList.remove("active"));
      tabContents.forEach((content) => content.classList.remove("active"));

      this.classList.add("active");
      document.getElementById(targetTab).classList.add("active");

      const selectedCard = document.querySelector(".project-card.selected");
      const projectType =
        selectedCard?.getAttribute("data-type") || window.budgetCalculator?.selectedProject || null;

      if (targetTab === "systems-tab") {
        window.budgetCalculator.toggleSystemsByProjectType(projectType);
      } else if (targetTab === "features-tab") {
        window.budgetCalculator.toggleWebPageFeatures(projectType);
      }
    });
  });

  const defaultTab = document.querySelector('[data-tab="features-tab"]');
  if (defaultTab) {
    defaultTab.click();
  }
}

function enforceCalculatorLayout() {
  const calculatorWrapper = document.querySelector(".calculator-wrapper");
  const priceSummary = document.querySelector(".price-summary");

  if (window.innerWidth >= 901) {
    if (calculatorWrapper) {
      calculatorWrapper.style.display = "grid";
      calculatorWrapper.style.gridTemplateColumns = "2fr 1fr";
    }
    if (priceSummary) {
      priceSummary.style.position = "sticky";
      priceSummary.style.top = "4.5rem";
    }
  } else {
    if (calculatorWrapper) {
      calculatorWrapper.style.display = "";
      calculatorWrapper.style.gridTemplateColumns = "";
    }
    if (priceSummary) {
      priceSummary.style.position = "";
      priceSummary.style.top = "";
    }
  }
}
