// Calculadora de Orçamento - Versão Portuguesa
// Baseado exatamente no presupuesto.js original

class BudgetCalculatorPT {
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
    document.querySelectorAll(".plan-price-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const text = btn.textContent || "";
        const numeric = parseInt(text.replace(/\D/g, ""), 10);
        this.basePrice = isNaN(numeric) ? 0 : numeric;
        this.updatePriceSummary();
        const ps = document.getElementById("price-summary");
        if (ps) {
          ps.scrollIntoView({ behavior: "smooth", block: "start" });
        }
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

    // Tooltip de hover desativado: agora apenas modal ao clicar no "?"
    // (mantemos funções de tooltip para compatibilidade, mas não anexamos eventos de hover)

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

    // Send button (Enviar) - usa id do botão da calculadora
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

    // Delegação: ícones de informação da lista de exemplos no modal
    document.addEventListener("click", (e) => {
      const btn = e.target.closest(".example-info");
      if (btn) {
        e.preventDefault();
        e.stopPropagation();
        this.showFeatureInfo(btn);
      }
    });

    // Modal close functionality (align with ES)
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
    // Check if clicking on the same card that's already selected
    const isAlreadySelected = card.classList.contains("selected");

    // Remove previous selection from all cards
    document.querySelectorAll(".project-card").forEach((c) => {
      c.classList.remove("selected");
      // Hide plan buttons for all cards
      const planButtons = c.querySelector(".plan-buttons");
      if (planButtons) {
        planButtons.style.display = "none";
        planButtons.classList.remove("show");
      }
    });

    // Hide plan details section when changing project
    const planSection = document.getElementById("selected-plan-section");
    if (planSection) {
      planSection.style.display = "none";
    }

    // Reset selected plan
    this.selectedPlan = null;
    this.basePrice = 0;

    // If the card wasn't already selected, select it
    if (!isAlreadySelected) {
      // Select new project
      card.classList.add("selected");
      this.selectedProject = card.dataset.type;

      // Show plan buttons for selected card only
      const planButtons = card.querySelector(".plan-buttons");
      if (planButtons) {
        planButtons.style.display = "flex";
        setTimeout(() => {
          planButtons.classList.add("show");
        }, 50);
      }

      // Show additional sections
      const featuresSection = document.getElementById("features-section");
      if (featuresSection) {
        featuresSection.style.display = "block";
      }

      const timelineSection = document.getElementById("timeline-section");
      if (timelineSection) {
        timelineSection.style.display = "block";
      }

      // Toggle Web Page specific features
      this.toggleWebPageFeatures(this.selectedProject);

      // Update price summary
      this.updatePriceSummary();
    } else {
      // If clicking the same card, deselect it
      this.selectedProject = null;

      // Hide additional sections
      const featuresSection = document.getElementById("features-section");
      if (featuresSection) {
        featuresSection.style.display = "none";
      }

      const timelineSection = document.getElementById("timeline-section");
      if (timelineSection) {
        timelineSection.style.display = "none";
      }

      // Hide Web Page features when deselecting
      this.toggleWebPageFeatures(null);
    }
  }

  toggleWebPageFeatures(projectType) {
    console.log("toggleWebPageFeatures chamada com projectType:", projectType);

    const webPageFeatures = document.querySelectorAll(".webpage-only");
    const landingPageFeatures = document.querySelectorAll(".landing-only");
    const ecommerceFeatures = document.querySelectorAll(".ecommerce-only");

    console.log("Encontradas funcionalidades:", {
      webpage: webPageFeatures.length,
      landing: landingPageFeatures.length,
      ecommerce: ecommerceFeatures.length,
    });

    // Ocultar todas as funcionalidades específicas primeiro
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

    // Mostrar funcionalidades específicas baseadas no tipo de projeto
    if (projectType === "website") {
      console.log("Mostrando funcionalidades de Website");
      // Mostrar funcionalidades específicas de Website Corporativo
      webPageFeatures.forEach((feature) => {
        feature.style.display = "flex";
      });
    } else if (projectType === "landing") {
      console.log("Mostrando funcionalidades de Landing Page");
      // Mostrar funcionalidades específicas de Landing Page
      landingPageFeatures.forEach((feature) => {
        feature.style.display = "flex";
      });
    } else if (projectType === "ecommerce") {
      console.log("Mostrando funcionalidades de E-commerce");
      // Mostrar funcionalidades específicas de E-commerce
      ecommerceFeatures.forEach((feature) => {
        feature.style.display = "flex";
      });
    }

    // Add systems and integrations tab logic
    this.toggleSystemsTab(projectType);
    this.toggleIntegrationsTab(projectType);

    // Atualizar preço após mudança de funcionalidades
    this.updatePriceSummary();
  }

  // Show/hide systems tab based on project selection
  toggleSystemsTab(projectType) {
    const systemsTabButton = document.getElementById("systems-tab-button");

    if (projectType === "landing" || projectType === "website" || projectType === "ecommerce") {
      systemsTabButton.style.display = "block";
      // Show/hide specific systems based on project type
      this.toggleSystemsByProjectType(projectType);
    } else {
      systemsTabButton.style.display = "none";
      // If systems tab is active and we hide it, switch to features tab
      if (systemsTabButton.classList.contains("active")) {
        const featuresTab = document.querySelector('[data-tab="features-tab"]');
        if (featuresTab) featuresTab.click();
      }
    }
  }

  // Show/hide integrations tab based on project selection
  toggleIntegrationsTab(projectType) {
    const integrationsTabButton = document.getElementById("integrations-tab-button");

    if (projectType === "landing" || projectType === "website" || projectType === "ecommerce") {
      integrationsTabButton.style.display = "block";
    } else {
      integrationsTabButton.style.display = "none";
      // If integrations tab is active and we hide it, switch to features tab
      if (integrationsTabButton.classList.contains("active")) {
        const featuresTab = document.querySelector('[data-tab="features-tab"]');
        if (featuresTab) featuresTab.click();
      }
    }
  }

  // Function to show/hide systems based on project type
  toggleSystemsByProjectType(projectType) {
    // Get all systems in the systems tab (not in the features tab)
    const systemsTab = document.getElementById("systems-tab");
    if (!systemsTab) return;

    const allSystemsInTab = systemsTab.querySelectorAll(".feature-item");
    const ecommerceSystems = systemsTab.querySelectorAll(".feature-item.ecommerce-system");
    const webpageSystems = systemsTab.querySelectorAll(".feature-item.webpage-system");
    const landingSystems = systemsTab.querySelectorAll(".feature-item.landing-system");
    const regularSystems = systemsTab.querySelectorAll(
      ".feature-item:not(.ecommerce-system):not(.webpage-system):not(.landing-system)"
    );

    // Hide all systems first and uncheck their checkboxes
    allSystemsInTab.forEach((system) => {
      system.style.display = "none";
      const checkbox = system.querySelector('input[type="checkbox"]');
      if (checkbox && checkbox.checked) {
        checkbox.checked = false;
      }
    });

    // Show systems based on project type
    if (projectType === "ecommerce") {
      // For E-commerce: show regular systems + e-commerce specific systems
      regularSystems.forEach((system) => {
        system.style.display = "flex";
      });
      ecommerceSystems.forEach((system) => {
        system.style.display = "flex";
      });
    } else if (projectType === "website") {
      // For Website: show regular systems + webpage specific systems
      regularSystems.forEach((system) => {
        system.style.display = "flex";
      });
      webpageSystems.forEach((system) => {
        system.style.display = "flex";
      });
    } else if (projectType === "landing") {
      // For Landing Page: show regular systems + landing specific systems
      regularSystems.forEach((system) => {
        system.style.display = "flex";
      });
      landingSystems.forEach((system) => {
        system.style.display = "flex";
      });
    }
  }

  selectTimeline(option) {
    // Remove previous selection
    document.querySelectorAll(".timeline-option").forEach((o) => o.classList.remove("selected"));

    // Select new timeline
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

    // Update base price
    document.getElementById("base-price").textContent = `R$${this.basePrice.toLocaleString()}`;

    // Remove existing individual feature items
    const existingFeatures = document.querySelectorAll(".individual-feature-item");
    existingFeatures.forEach((item) => item.remove());

    // Add individual feature items
    const baseItem = document.querySelector("#features-cost").parentNode.children[0]; // Base price item

    this.selectedFeatures.forEach((feature, _index) => {
      const featureItem = document.createElement("div");
      featureItem.className = "price-item individual-feature-item removable";

      const featureName = this.getFeatureName(feature.id);

      featureItem.innerHTML = `
        <span>${featureName}</span>
        <button class="remove-btn" title="Eliminar ${featureName}" data-feature-id="${feature.id}">
          <i class="fas fa-times"></i>
        </button>
        <span>R$${feature.price.toLocaleString()}</span>
      `;

      // Add event listener to remove button
      const removeBtn = featureItem.querySelector(".remove-btn");
      removeBtn.addEventListener("click", () => this.removeIndividualFeature(feature.id));

      // Insert after base price
      baseItem.insertAdjacentElement("afterend", featureItem);
    });

    // Hide the old grouped features element
    const featuresElement = document.getElementById("features-cost");
    featuresElement.style.display = "none";

    // Update timeline adjustment
    const timelineElement = document.getElementById("timeline-cost");
    if (timelineAdjustment !== 0) {
      timelineElement.style.display = "flex";
      timelineElement.classList.add("removable");
      const sign = timelineAdjustment > 0 ? "+" : "";
      document.getElementById("timeline-price").textContent =
        `${sign}R$${timelineAdjustment.toLocaleString()}`;

      // Add remove button if not exists
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

    // Update total
    document.getElementById("total-price").textContent = `R$${finalTotal.toLocaleString()}`;

    this.totalPrice = finalTotal;
  }

  removeIndividualFeature(featureId) {
    // Uncheck the specific feature checkbox
    const checkbox = document.getElementById(featureId);
    if (checkbox) {
      checkbox.checked = false;
    }

    // Remove from selected features array
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

    // Base delivery times (in weeks)
    const baseTimes = {
      landing: { basico: 1, estandar: 2, padrao: 2, premium: 3 },
      website: { basico: 2, estandar: 3, padrao: 3, premium: 4 },
      ecommerce: { basico: 4, estandar: 6, padrao: 6, premium: 8 },
    };

    let baseTime = baseTimes[this.selectedProject]?.[this.selectedPlan] || 2;

    // Add time for selected features
    const selectedFeatures = document.querySelectorAll(
      '.feature-item input[type="checkbox"]:checked'
    );
    let additionalTime = 0;
    selectedFeatures.forEach((checkbox) => {
      additionalTime += parseInt(checkbox.dataset.time) || 0;
    });

    // Apply timeline multiplier (inverse for delivery time)
    const totalTime = Math.ceil((baseTime + additionalTime) / this.timelineMultiplier);

    if (deliveryElement) {
      const timeText = totalTime === 1 ? "1 semana" : `${totalTime} semanas`;
      deliveryElement.textContent = `Prazo estimado: ${timeText}`;
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

    // Remove previous plan selection
    document.querySelectorAll(".plan-btn").forEach((btn) => {
      btn.classList.remove("selected");
    });

    // Select current plan
    planBtn.classList.add("selected");

    // Set base price based on project type and plan
    this.basePrice = this.getPlanPrice(projectType, plan);
    this.selectedPlan = plan;

    // Show plan details
    this.showPlanDetails(projectType, plan);

    this.updatePriceSummary();
  }

  getPlanPrice(projectType, plan) {
    const prices = {
      landing: {
        basico: 0,
        padrao: 0,
        estandar: 0,
        premium: 0,
      },
      website: {
        basico: 0,
        padrao: 0,
        estandar: 0,
        premium: 0,
      },
      ecommerce: {
        basico: 0,
        padrao: 0,
        estandar: 0,
        premium: 0,
      },
    };

    return prices[projectType]?.[plan] || 0;
  }

  showPlanDetails(projectType, plan) {
    // Hide all plan details first
    document.querySelectorAll(".plan-details-content").forEach((planDiv) => {
      planDiv.style.display = "none";
    });

    // Normalize plan name (convert "estandar" to "padrao")
    const normalizedPlan = plan === "estandar" ? "padrao" : plan;

    // Show the selected plan
    const planId = `${projectType}-${normalizedPlan}`;
    const selectedPlan = document.getElementById(planId);

    if (selectedPlan) {
      selectedPlan.style.display = "block";

      // Show the plan section
      const planSection = document.getElementById("selected-plan-section");
      if (planSection) {
        planSection.style.display = "block";
        const label = planSection.querySelector(".form-label");
        if (label) {
          const names = { basico: "Básico", padrao: "Padrão", premium: "Premium" };
          const displayName = names[normalizedPlan] || normalizedPlan;
          label.textContent = `Plano Selecionado: ${displayName}`;
        }

        // Smooth scroll to the section
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
    // Calendar generation logic would go here
    // For now, just show a simple message
    const calendarContainer = document.getElementById("calendar-container");
    if (calendarContainer) {
      calendarContainer.innerHTML = `
        <div class="calendar-placeholder">
          <p>Calendário de disponibilidade em desenvolvimento</p>
        </div>
      `;
    }
  }

  contactForProject() {
    const projectName = this.getProjectTypeName(this.selectedProject) || "Não selecionado";
    const names = { basico: "Básico", padrao: "Padrão", premium: "Premium", estandar: "Padrão" };
    const planDisplay = names[this.selectedPlan] || this.selectedPlan || "Não selecionado";
    const base = this.basePrice || 0;
    const featuresLines =
      this.selectedFeatures.length > 0
        ? this.selectedFeatures
            .map((f) => `- ${this.getFeatureName(f.id)} — R$ ${f.price.toLocaleString("pt-BR")}`)
            .join("\n")
        : "- Nenhum";
    const timeline = this.getTimelineName(this.timelineMultiplier);
    const total = this.totalPrice || 0;

    const message = `Olá! Gostaria de avançar com o orçamento:

Projeto: ${projectName}
Plano: ${planDisplay}
Preço Base: R$ ${base.toLocaleString("pt-BR")}

Itens adicionais:
${featuresLines}

Prazo: ${timeline}
Total estimado: R$ ${total.toLocaleString("pt-BR")}

Podemos alinhar os próximos passos por email?`;

    const emailUrl = `mailto:amandacerejaweb@gmail.com?subject=${encodeURIComponent(
      "Orçamento"
    )}&body=${encodeURIComponent(message)}`;
    window.open(emailUrl, "_blank");
  }

  getProjectTypeName(type) {
    const names = {
      landing: "Landing Page",
      website: "Website Corporativo",
      ecommerce: "E-commerce",
    };
    return names[type] || type;
  }

  getFeatureName(id) {
    const element = document.querySelector(`label[for="${id}"]`);
    if (!element) return id;
    const clone = element.cloneNode(true);
    // Remover qualquer nó que contenha o valor/preço dentro do label
    clone
      .querySelectorAll(".feature-price, .price, .valor, .feature-value")
      .forEach((n) => n.remove());
    // Extrair apenas o texto do nome
    return clone.textContent.replace(/\s+/g, " ").trim();
  }

  getTimelineName(multiplier) {
    const names = {
      0.5: "Prazo Urgente (+100%)",
      1: "Prazo Normal",
      1.5: "Prazo Estendido (-25%)",
    };
    return names[multiplier] || `×${multiplier}`;
  }

  removeAllFeatures() {
    document
      .querySelectorAll('.feature-item input[type="checkbox"]:checked')
      .forEach((checkbox) => {
        checkbox.checked = false;
      });
    this.calculateFeaturesPrice();
    this.updatePriceSummary();
    this.updateDeliveryEstimate();
  }

  resetTimeline() {
    // Reset to normal timeline
    document.querySelectorAll(".timeline-option").forEach((option) => {
      option.classList.remove("selected");
      if (option.dataset.multiplier === "1") {
        option.classList.add("selected");
      }
    });

    this.timelineMultiplier = 1;
    this.selectedTimeline = "1";
    this.updatePriceSummary();
    this.updateDeliveryEstimate();
  }

  showFeatureInfo(trigger) {
    const featureItem = trigger.closest(".feature-item");
    const exampleItem = trigger.closest(".example-item");
    const projectCard = trigger.closest(".project-card");
    const sectionHeader =
      trigger.closest(".section-header") || trigger.closest(".section-title-row");

    const modal = document.getElementById("feature-info-modal");
    const modalTitle = modal.querySelector("#modal-feature-title");
    const modalDescription = modal.querySelector("#modal-feature-description");
    const modalIconEl = modal.querySelector("#modal-title-icon i");
    const modalBack = modal.querySelector(".modal-back");
    const modalBox = modal.querySelector(".modal");

    this.closeAllTooltips();

    if (featureItem) {
      const tooltip = featureItem.querySelector(".tooltip");
      const nameEl = featureItem.querySelector("label span");
      const featureName = nameEl
        ? nameEl.textContent
        : this.getFeatureName(featureItem.querySelector("input")?.id);
      const itemIconEl = featureItem.querySelector("label i, .feature-icon i");
      if (modalIconEl) {
        modalIconEl.className = itemIconEl ? itemIconEl.className : "fas fa-info-circle";
      }
      if (tooltip && featureName) {
        modalTitle.textContent = featureName;
        modalDescription.textContent = tooltip.textContent;
        modal.classList.add("active");
        document.documentElement.classList.add("feature-modal-open");
        document.body.style.overflow = "hidden";
        modalBox?.classList.remove("show-back");
      }
      return;
    }

    if (exampleItem) {
      const tooltip = exampleItem.querySelector(".tooltip");
      const titleEl = exampleItem.querySelector(".example-text");
      const exampleTitle = titleEl ? titleEl.textContent.trim() : "Informação";
      if (modalIconEl) {
        // Ícone relacionado ao título do item da lista
        modalIconEl.className = this.getExampleIcon(exampleTitle);
      }
      if (tooltip && exampleTitle) {
        // Armazena o conteúdo anterior para permitir "voltar"
        if (!modal.classList.contains("show-back")) {
          modal.dataset.prevTitle = modalTitle.textContent || "";
          modal.dataset.prevContent =
            modalDescription.innerHTML || modalDescription.textContent || "";
          modal.dataset.prevIcon = modalIconEl?.className || "fas fa-info-circle";
        }
        modalTitle.textContent = exampleTitle;
        modalDescription.innerHTML = tooltip.innerHTML || tooltip.textContent;
        modal.classList.add("active");
        document.documentElement.classList.add("feature-modal-open");
        document.body.style.overflow = "hidden";
        modalBox?.classList.add("show-back");
        // Liga o botão de voltar
        if (modalBack && !modalBack._bound) {
          modalBack.addEventListener("click", () => {
            const prevTitle = modal.dataset.prevTitle || "Informação";
            const prevContent = modal.dataset.prevContent || "";
            const prevIcon = modal.dataset.prevIcon || "fas fa-info-circle";
            modalTitle.textContent = prevTitle;
            if (prevContent) {
              modalDescription.innerHTML = prevContent;
            }
            if (modalIconEl) modalIconEl.className = prevIcon;
            modalBox?.classList.remove("show-back");
          });
          modalBack._bound = true;
        }
      }
      return;
    }

    if (projectCard) {
      const tooltip = projectCard.querySelector(".tooltip");
      const projectName = projectCard.querySelector("h3")?.textContent || "";
      const projectIconEl = projectCard.querySelector(".project-icon i");
      if (modalIconEl) {
        modalIconEl.className = projectIconEl ? projectIconEl.className : "fas fa-info-circle";
      }
      if (tooltip && projectName) {
        modalTitle.textContent = projectName;
        modalDescription.innerHTML = tooltip.innerHTML || tooltip.textContent;
        modal.classList.add("active");
        document.documentElement.classList.add("feature-modal-open");
        document.body.style.overflow = "hidden";
        modalBox?.classList.remove("show-back");
      }
      return;
    }

    if (sectionHeader) {
      const tooltip = trigger.nextElementSibling;
      const titleEl = sectionHeader.querySelector("h2, h3, h4, h5, h6, .form-label");
      const sectionTitle = titleEl ? titleEl.textContent.trim() : "Informação";
      let iconClass = "fas fa-info-circle";
      if (sectionHeader.closest(".price-summary")) {
        iconClass = "fas fa-calculator";
      } else if (trigger.closest("#timeline-section")) {
        iconClass = "fas fa-calendar-alt";
      } else if (trigger.closest("#features-section")) {
        const activeTabButton = document.querySelector(".tab-button.active");
        const activeTabId =
          activeTabButton?.getAttribute("data-tab") ||
          document.querySelector(".tab-content.active")?.id;
        if (activeTabId === "features-tab") {
          iconClass = "fas fa-laptop-code";
        } else if (activeTabId === "integrations-tab") {
          iconClass = "fas fa-plug";
        } else if (activeTabId === "systems-tab") {
          iconClass = "fas fa-server";
        } else {
          iconClass = "fas fa-toolbox";
        }
      } else {
        const formGroup = trigger.closest(".form-group");
        if (formGroup && formGroup.querySelector(".project-types")) {
          iconClass = "fas fa-diagram-project";
        }
      }
      if (modalIconEl) {
        modalIconEl.className = iconClass;
      }
      if (tooltip && sectionTitle) {
        modalTitle.textContent = sectionTitle;
        modalDescription.innerHTML = tooltip.innerHTML || tooltip.textContent;
        modal.classList.add("active");
        document.documentElement.classList.add("feature-modal-open");
        document.body.style.overflow = "hidden";
        modal.classList.remove("show-back");
      }
    }
  }

  getExampleIcon(title) {
    const t = (title || "").toLowerCase();
    const map = {
      "lançamento de produto": "fas fa-rocket",
      "promoções e ofertas": "fas fa-tags",
      "cursos e educação": "fas fa-chalkboard-teacher",
      "eventos e webinars": "fas fa-calendar-alt",
      "arrecadação e financiamento coletivo": "fas fa-donate",
      "consultoria e serviços profissionais": "fas fa-briefcase",
      restaurantes: "fas fa-utensils",
      "negócios locais": "fas fa-store",
      influenciadores: "fas fa-bullhorn",
      artistas: "fas fa-palette",
      "agências de viagens": "fas fa-plane",
      "instituições de ensino": "fas fa-graduation-cap",
      "mini portfólio": "fas fa-address-card",
      "agências de marketing e consultoria": "fas fa-chart-line",
      "consultores e profissionais independentes": "fas fa-briefcase",
      "restaurantes, lanchonetes, bares e cafés": "fas fa-utensils",
      "empresas locais, salões de beleza, oficinas": "fas fa-store",
      "artistas e criativos": "fas fa-palette",
      "escolas e instituições de ensino": "fas fa-graduation-cap",
      "consultorias de marketing ou ti": "fas fa-chart-line",
      "serviços de eventos e casamentos": "fas fa-heart",
      "clínicas e consultórios": "fas fa-stethoscope",
      "serviços de educação online": "fas fa-graduation-cap",
      "lojas de roupas": "fas fa-tshirt",
      "cursos e material educativo online": "fas fa-chalkboard-teacher",
      "lojas de cosméticos e beleza": "fas fa-spa",
      "mercado de alimentos e bebidas": "fas fa-shopping-basket",
      "artigos para casa e decoração": "fas fa-couch",
      "produtos eletrônicos": "fas fa-microchip",
      "produtos personalizados": "fas fa-gift",
      "lojas de saúde e bem-estar": "fas fa-heartbeat",
      "livrarias online": "fas fa-book-open",
      "produtos artesanais e locais": "fas fa-hammer",
      "mercado de fitness e esportes": "fas fa-dumbbell",
    };
    if (map[t]) return map[t];
    if (t.includes("lançamento")) return "fas fa-rocket";
    if (t.includes("promoções") || t.includes("ofertas")) return "fas fa-tags";
    if (t.includes("webinars") || t.includes("cursos") || t.includes("inscrição"))
      return "fas fa-chalkboard-teacher";
    if (t.includes("eventos") || t.includes("palestras")) return "fas fa-calendar-alt";
    if (t.includes("arrecadação") || t.includes("financiamento")) return "fas fa-donate";
    if (t.includes("consultoria") || t.includes("profissionais")) return "fas fa-briefcase";
    if (t.includes("restaurante")) return "fas fa-utensils";
    if (t.includes("roupas")) return "fas fa-tshirt";
    if (t.includes("cosméticos") || t.includes("cosmeticos") || t.includes("beleza"))
      return "fas fa-spa";
    if (
      t.includes("alimentos") ||
      t.includes("bebidas") ||
      t.includes("vinhos") ||
      t.includes("mercado")
    )
      return "fas fa-shopping-basket";
    if (
      t.includes("casa") ||
      t.includes("decoração") ||
      t.includes("decoracao") ||
      t.includes("móveis") ||
      t.includes("moveis")
    )
      return "fas fa-couch";
    if (t.includes("eletrônicos") || t.includes("eletronicos")) return "fas fa-microchip";
    if (t.includes("personalizados") || t.includes("presentes")) return "fas fa-gift";
    if (t.includes("negócios locais") || t.includes("local") || t.includes("loja"))
      return "fas fa-store";
    if (t.includes("influenciadores")) return "fas fa-bullhorn";
    if (t.includes("artistas")) return "fas fa-palette";
    if (t.includes("viagens") || t.includes("agências de viagens")) return "fas fa-plane";
    if (
      t.includes("ensino") ||
      t.includes("universidade") ||
      t.includes("idiomas") ||
      t.includes("educação") ||
      t.includes("educacao") ||
      t.includes("escola")
    )
      return "fas fa-graduation-cap";
    if (
      t.includes("clínicas") ||
      t.includes("clinicas") ||
      t.includes("clínica") ||
      t.includes("clinica") ||
      t.includes("consultórios") ||
      t.includes("consultorios") ||
      t.includes("consultório") ||
      t.includes("consultorio")
    )
      return "fas fa-stethoscope";
    if (t.includes("fitness") || t.includes("esportes")) return "fas fa-dumbbell";
    if (t.includes("casamentos") || t.includes("casamento")) return "fas fa-heart";
    if (t.includes("portfólio")) return "fas fa-address-card";
    if (t.includes("marketing")) return "fas fa-chart-line";
    return "fas fa-question-circle";
  }

  hideFeatureModal() {
    const modal = document.getElementById("feature-info-modal");
    if (modal) {
      modal.classList.remove("active");
      document.documentElement.classList.remove("feature-modal-open");
      document.body.style.overflow = "";
      const modalBox = modal.querySelector(".modal");
      modalBox?.classList.remove("show-back");
      delete modal.dataset.prevTitle;
      delete modal.dataset.prevContent;
      delete modal.dataset.prevIcon;
    }
  }
}

// Initialize calculator when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.budgetCalculator = new BudgetCalculatorPT();
  initPresupuestoTypewriterPT();
  initTabs();

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

// Tab System Functionality
function initTabs() {
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const targetTab = this.getAttribute("data-tab");

      // Remove active class from all buttons and contents
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      tabContents.forEach((content) => content.classList.remove("active"));

      // Add active class to clicked button and corresponding content
      this.classList.add("active");
      document.getElementById(targetTab).classList.add("active");

      // Apply project-specific logic based on which tab is clicked
      const selectedProject = document.querySelector(".project-card.selected");
      if (selectedProject) {
        const projectType = selectedProject.getAttribute("data-type");

        if (targetTab === "systems-tab") {
          // Apply systems logic
          window.budgetCalculator.toggleSystemsByProjectType(projectType);
        } else if (targetTab === "features-tab") {
          // Apply features logic
          window.budgetCalculator.toggleWebPageFeatures(projectType);
        }
      }
    });
  });

  // Set default active tab (features)
  const defaultTab = document.querySelector('[data-tab="features-tab"]');
  if (defaultTab) {
    defaultTab.click();
  }
}

// Typewriter animation for presupuesto page
function initPresupuestoTypewriterPT() {
  const el = document.querySelector(".typewriter");
  const subtitleEl = document.querySelector(".hero-subtitle");
  if (!el || !subtitleEl) return;

  const phrases = ["Orçamento Online", "Calculadora Automática", "Preços Personalizados"];

  const subtitles = [
    "Calcule o preço do seu projeto com apenas alguns cliques.",
    "Escolha o tipo de projeto, funcionalidades, integrações extras e sistemas essenciais para o seu site, e calcule o orçamento em tempo real.",
    "Escolha entre desenvolvimento com código puro ou plataforma online e veja a diferença de preços de acordo com a opção escolhida.",
  ];

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

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});
