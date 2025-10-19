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
        if (e.target.closest('.info-trigger') || e.target.closest('.plan-btn')) {
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

    // Tooltip triggers
    document.querySelectorAll(".info-trigger").forEach((trigger) => {
      trigger.addEventListener("mouseenter", (e) => this.toggleTooltip(e.currentTarget));
      trigger.addEventListener("mouseleave", () => this.closeAllTooltips());
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

    // Availability button
    const availabilityBtn = document.getElementById("availability-btn");
    if (availabilityBtn) {
      availabilityBtn.addEventListener("click", () => this.showAvailability());
    }

    // Calendar navigation
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("prev-month")) {
        this.changeMonth(-1);
      } else if (e.target.classList.contains("next-month")) {
        this.changeMonth(1);
      }
    });

    // Feature modal close
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("modal-overlay") || e.target.classList.contains("close-modal")) {
        this.hideFeatureModal();
      }
    });

    // ESC key to close modal
    document.addEventListener("keydown", (e) => {
      const modal = document.querySelector('.feature-modal');
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
    console.log('toggleWebPageFeatures chamada com projectType:', projectType);
    
    const webPageFeatures = document.querySelectorAll('.webpage-only');
    const landingPageFeatures = document.querySelectorAll('.landing-only');
    const ecommerceFeatures = document.querySelectorAll('.ecommerce-only');
    
    console.log('Encontradas funcionalidades:', {
      webpage: webPageFeatures.length,
      landing: landingPageFeatures.length,
      ecommerce: ecommerceFeatures.length
    });
    
    // Ocultar todas as funcionalidades específicas primeiro
    webPageFeatures.forEach(feature => {
      feature.style.display = 'none';
      const checkbox = feature.querySelector('input[type="checkbox"]');
      if (checkbox && checkbox.checked) {
        checkbox.checked = false;
      }
    });
    
    landingPageFeatures.forEach(feature => {
      feature.style.display = 'none';
      const checkbox = feature.querySelector('input[type="checkbox"]');
      if (checkbox && checkbox.checked) {
        checkbox.checked = false;
      }
    });
    
    ecommerceFeatures.forEach(feature => {
      feature.style.display = 'none';
      const checkbox = feature.querySelector('input[type="checkbox"]');
      if (checkbox && checkbox.checked) {
        checkbox.checked = false;
      }
    });
    
    // Mostrar funcionalidades específicas baseadas no tipo de projeto
    if (projectType === 'website') {
      console.log('Mostrando funcionalidades de Website');
      // Mostrar funcionalidades específicas de Website Corporativo
      webPageFeatures.forEach(feature => {
        feature.style.display = 'flex';
      });
    } else if (projectType === 'landing') {
      console.log('Mostrando funcionalidades de Landing Page');
      // Mostrar funcionalidades específicas de Landing Page
      landingPageFeatures.forEach(feature => {
        feature.style.display = 'flex';
      });
    } else if (projectType === 'ecommerce') {
      console.log('Mostrando funcionalidades de E-commerce');
      // Mostrar funcionalidades específicas de E-commerce
      ecommerceFeatures.forEach(feature => {
        feature.style.display = 'flex';
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
    const systemsTabButton = document.getElementById('systems-tab-button');
    
    if (projectType === 'landing' || projectType === 'website' || projectType === 'ecommerce') {
      systemsTabButton.style.display = 'block';
      // Show/hide specific systems based on project type
      this.toggleSystemsByProjectType(projectType);
    } else {
      systemsTabButton.style.display = 'none';
      // If systems tab is active and we hide it, switch to features tab
      if (systemsTabButton.classList.contains('active')) {
        const featuresTab = document.querySelector('[data-tab="features-tab"]');
        if (featuresTab) featuresTab.click();
      }
    }
  }

  // Show/hide integrations tab based on project selection
  toggleIntegrationsTab(projectType) {
    const integrationsTabButton = document.getElementById('integrations-tab-button');
    
    if (projectType === 'landing' || projectType === 'website' || projectType === 'ecommerce') {
      integrationsTabButton.style.display = 'block';
    } else {
      integrationsTabButton.style.display = 'none';
      // If integrations tab is active and we hide it, switch to features tab
      if (integrationsTabButton.classList.contains('active')) {
        const featuresTab = document.querySelector('[data-tab="features-tab"]');
        if (featuresTab) featuresTab.click();
      }
    }
  }

  // Function to show/hide systems based on project type
  toggleSystemsByProjectType(projectType) {
    // Get all systems in the systems tab (not in the features tab)
    const systemsTab = document.getElementById('systems-tab');
    if (!systemsTab) return;
    
    const allSystemsInTab = systemsTab.querySelectorAll('.feature-item');
    const ecommerceSystems = systemsTab.querySelectorAll('.feature-item.ecommerce-system');
    const webpageSystems = systemsTab.querySelectorAll('.feature-item.webpage-system');
    const landingSystems = systemsTab.querySelectorAll('.feature-item.landing-system');
    const regularSystems = systemsTab.querySelectorAll('.feature-item:not(.ecommerce-system):not(.webpage-system):not(.landing-system)');
    
    // Hide all systems first and uncheck their checkboxes
    allSystemsInTab.forEach(system => {
      system.style.display = 'none';
      const checkbox = system.querySelector('input[type="checkbox"]');
      if (checkbox && checkbox.checked) {
        checkbox.checked = false;
      }
    });
    
    // Show systems based on project type
    if (projectType === 'ecommerce') {
      // For E-commerce: show regular systems + e-commerce specific systems
      regularSystems.forEach(system => {
        system.style.display = 'flex';
      });
      ecommerceSystems.forEach(system => {
        system.style.display = 'flex';
      });
    } else if (projectType === 'website') {
      // For Website: show regular systems + webpage specific systems
      regularSystems.forEach(system => {
        system.style.display = 'flex';
      });
      webpageSystems.forEach(system => {
        system.style.display = 'flex';
      });
    } else if (projectType === 'landing') {
      // For Landing Page: show regular systems + landing specific systems
      regularSystems.forEach(system => {
        system.style.display = 'flex';
      });
      landingSystems.forEach(system => {
        system.style.display = 'flex';
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
    document.getElementById("base-price").textContent = `€${this.basePrice.toLocaleString()}`;

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
        <span>€${feature.price.toLocaleString()}</span>
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
        `${sign}€${timelineAdjustment.toLocaleString()}`;

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
    document.getElementById("total-price").textContent = `€${finalTotal.toLocaleString()}`;
    
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
      ecommerce: { basico: 4, estandar: 6, padrao: 6, premium: 8 }
    };

    let baseTime = baseTimes[this.selectedProject]?.[this.selectedPlan] || 2;
    
    // Add time for selected features
    const selectedFeatures = document.querySelectorAll('.feature-item input[type="checkbox"]:checked');
    let additionalTime = 0;
    selectedFeatures.forEach(checkbox => {
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
    if (tooltip && tooltip.classList.contains('tooltip')) {
      tooltip.style.opacity = '1';
      tooltip.style.visibility = 'visible';
      tooltip.style.transform = 'translateY(0)';
    }
  }

  closeAllTooltips() {
    document.querySelectorAll('.tooltip').forEach(tooltip => {
      tooltip.style.opacity = '0';
      tooltip.style.visibility = 'hidden';
      tooltip.style.transform = 'translateY(-10px)';
    });
  }

  selectPlan(planBtn) {
    const plan = planBtn.dataset.plan;
    const projectCard = planBtn.closest('.project-card');
    const projectType = projectCard.dataset.type;

    // Remove previous plan selection
    document.querySelectorAll('.plan-btn').forEach(btn => {
      btn.classList.remove('selected');
    });

    // Select current plan
    planBtn.classList.add('selected');

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
        basico: 450,
        padrao: 650,
        estandar: 650,
        premium: 1200
      },
      website: {
        basico: 600,
        padrao: 1100,
        estandar: 1100,
        premium: 1600
      },
      ecommerce: {
        basico: 1200,
        padrao: 2500,
        estandar: 2500,
        premium: 5000
      }
    };

    return prices[projectType]?.[plan] || 0;
  }

  showPlanDetails(projectType, plan) {
    // Hide all plan details first
    document.querySelectorAll('.plan-details-content').forEach(planDiv => {
      planDiv.style.display = 'none';
    });

    // Normalize plan name (convert "estandar" to "padrao")
    const normalizedPlan = plan === 'estandar' ? 'padrao' : plan;
    
    // Show the selected plan
    const planId = `${projectType}-${normalizedPlan}`;
    const selectedPlan = document.getElementById(planId);
    
    if (selectedPlan) {
      selectedPlan.style.display = 'block';
      
      // Show the plan section
      const planSection = document.getElementById('selected-plan-section');
      if (planSection) {
        planSection.style.display = 'block';
        
        // Smooth scroll to the section
        planSection.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
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
    if (!this.selectedProject || !this.selectedPlan) {
      alert("Por favor, selecione um tipo de projeto e um plano primeiro.");
      return;
    }

    const projectName = this.getProjectTypeName(this.selectedProject);
    const planName = this.selectedPlan;
    const price = this.totalPrice;

    const message = `Olá! Gostaria de solicitar um orçamento para:
    
Projeto: ${projectName}
Plano: ${planName}
Valor estimado: R$ ${price.toLocaleString('pt-BR')}

Podemos conversar sobre os detalhes?`;

    const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  }

  getProjectTypeName(type) {
    const names = {
      landing: "Landing Page",
      website: "Website Corporativo", 
      ecommerce: "E-commerce"
    };
    return names[type] || type;
  }

  getFeatureName(id) {
    const element = document.querySelector(`label[for="${id}"]`);
    return element ? element.textContent.trim() : id;
  }

  getTimelineName(multiplier) {
    const names = {
      0.5: "Prazo Urgente (+100%)",
      1: "Prazo Normal",
      1.5: "Prazo Estendido (-25%)"
    };
    return names[multiplier] || `×${multiplier}`;
  }

  removeAllFeatures() {
    document.querySelectorAll('.feature-item input[type="checkbox"]:checked').forEach(checkbox => {
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
    // Feature info modal logic would go here
    console.log("Feature info requested for:", trigger);
  }

  hideFeatureModal() {
    const modal = document.querySelector('.feature-modal');
    if (modal) {
      modal.classList.remove('active');
    }
  }
}

// Initialize calculator when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.budgetCalculator = new BudgetCalculatorPT();
  initPresupuestoTypewriterPT();
  initTabs();
});

// Tab System Functionality
function initTabs() {
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      const targetTab = this.getAttribute('data-tab');
      
      // Remove active class from all buttons and contents
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
      
      // Add active class to clicked button and corresponding content
      this.classList.add('active');
      document.getElementById(targetTab).classList.add('active');
      
      // Apply project-specific logic based on which tab is clicked
      const selectedProject = document.querySelector('.project-card.selected');
      if (selectedProject) {
        const projectType = selectedProject.getAttribute('data-type');
        
        if (targetTab === 'systems-tab') {
          // Apply systems logic
          window.budgetCalculator.toggleSystemsByProjectType(projectType);
        } else if (targetTab === 'features-tab') {
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

  const phrases = [
    {
      title: "Calcula o Orçamento do seu Projeto",
      subtitle: "Descubra o plano ideal para seu projeto com um cálculo imediato."
    },
    {
      title: "Sua web, seu orçamento, em tempo real",
      subtitle: "Faça seu cálculo online e dê o primeiro passo para seu novo projeto."
    }
  ];

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced) {
    el.textContent = phrases[0].title;
    subtitleEl.textContent = phrases[0].subtitle;
    return;
  }

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typeDelay = 60; // velocidade de digitação
  const deleteDelay = 38; // velocidade de apagar
  const pauseDelay = 1200; // pausa ao terminar frase

  function updateSubtitle(index) {
    if (subtitleEl) {
      subtitleEl.style.opacity = '0';
      setTimeout(() => {
        subtitleEl.textContent = phrases[index].subtitle;
        subtitleEl.style.opacity = '1';
      }, 300);
    }
  }

  function typeChar() {
    const currentPhrase = phrases[phraseIndex].title;

    if (!isDeleting) {
      // Digitando
      el.textContent = currentPhrase.slice(0, charIndex + 1);
      charIndex++;

      if (charIndex === currentPhrase.length) {
        // Terminou de digitar, pausa e depois começa a apagar
        setTimeout(() => {
          isDeleting = true;
          typeChar();
        }, pauseDelay);
        return;
      }

      setTimeout(typeChar, typeDelay);
    } else {
      // Apagando
      el.textContent = currentPhrase.slice(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        // Terminou de apagar, muda para próxima frase
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        updateSubtitle(phraseIndex);
      }

      setTimeout(typeChar, deleteDelay);
    }
  }

  // Inicia com o primeiro subtítulo
  updateSubtitle(0);
  typeChar();
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});
