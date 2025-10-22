// Budget Calculator and Availability System
class BudgetCalculator {
  constructor() {
    this.basePrice = 0;
    this.featuresPrice = 0;
    this.timelineMultiplier = 1;
    this.selectedProject = null;
    this.selectedFeatures = [];
    this.selectedTimeline = "normal";

    this.init();
  }

  init() {
    this.bindEvents();
    this.initCalendar();
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

    // Availability button
    document.getElementById("check-availability").addEventListener("click", () => {
      this.showAvailability();
    });

    // Calendar navigation
    document.getElementById("prev-month").addEventListener("click", () => {
      this.changeMonth(-1);
    });

    document.getElementById("next-month").addEventListener("click", () => {
      this.changeMonth(1);
    });

    // Contact button
    document.getElementById("contact-btn").addEventListener("click", () => {
      this.contactForProject();
    });

    // Close tooltips when clicking outside
    document.addEventListener("click", (e) => {
      if (!e.target.closest('.info-trigger') && !e.target.closest('.tooltip')) {
        this.closeAllTooltips();
      }
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

    // Escape key to close modal
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
    document.getElementById("selected-plan-section").style.display = "none";
    
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
      document.getElementById("features-section").style.display = "block";
      document.getElementById("timeline-section").style.display = "block";

      // Toggle Web Page specific features
      this.toggleWebPageFeatures(this.selectedProject);

      // Enable availability button
      document.getElementById("check-availability").disabled = false;

      this.updatePriceSummary();
      this.updateDeliveryEstimate();
    } else {
      // If clicking on already selected card, deselect it
      this.selectedProject = null;
      
      // Hide additional sections
      document.getElementById("features-section").style.display = "none";
      document.getElementById("timeline-section").style.display = "none";
      document.getElementById("selected-plan-section").style.display = "none";

      // Hide Web Page features when deselecting
      this.toggleWebPageFeatures(null);

      // Disable availability button
      document.getElementById("check-availability").disabled = true;
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
    
    // Atualizar preço após mudança de funcionalidades
    this.updatePriceSummary();
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
    const priceBreakdown = document.querySelector(".price-breakdown");
    const baseItem = document.querySelector("#features-cost").parentNode.children[0]; // Base price item

    this.selectedFeatures.forEach((feature, index) => {
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
    if (!this.selectedProject) return;

    const deliveryTimes = {
      landing: { min: 3, max: 7 },
      website: { min: 7, max: 10 },
      ecommerce: { min: 10, max: 15 },
    };

    const timelineMultipliers = {
      1.5: 0.5, // Urgente: reduce time by 50%
      1.2: 0.7, // Rápido: reduce time by 30%
      1: 1, // Normal: standard time
    };

    const baseTime = deliveryTimes[this.selectedProject];
    const multiplier = timelineMultipliers[this.selectedTimeline] || 1;

    const minDays = Math.ceil(baseTime.min * multiplier);
    const maxDays = Math.ceil(baseTime.max * multiplier);

    const deliveryInfo = document.getElementById("delivery-info");
    const deliveryText = document.getElementById("delivery-text");

    deliveryText.textContent = `Entrega estimada: ${minDays}-${maxDays} días`;
    deliveryInfo.style.display = "flex";
  }

  toggleTooltip(trigger) {
    const tooltip = trigger.nextElementSibling;
    if (!tooltip || !tooltip.classList.contains('tooltip')) return;

    // Close all other tooltips first
    this.closeAllTooltips();

    // Toggle current tooltip
    const isVisible = tooltip.style.opacity === '1';
    if (isVisible) {
      tooltip.style.opacity = '0';
      tooltip.style.visibility = 'hidden';
      tooltip.style.transform = 'translateY(10px)';
    } else {
      tooltip.style.opacity = '1';
      tooltip.style.visibility = 'visible';
      tooltip.style.transform = 'translateY(0)';
    }
  }

  closeAllTooltips() {
    document.querySelectorAll('.tooltip').forEach(tooltip => {
      tooltip.style.opacity = '0';
      tooltip.style.visibility = 'hidden';
      tooltip.style.transform = 'translateY(10px)';
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

    console.log(`Selected ${plan} plan for ${projectType}: €${this.basePrice}`);

    this.updatePriceSummary();
  }

  getPlanPrice(projectType, plan) {
    const prices = {
      landing: {
        basico: 350,
        padrao: 600,
        estandar: 600,
        premium: 900
      },
      website: {
        basico: 500,
        padrao: 800,
        estandar: 800,
        premium: 1000
      },
      ecommerce: {
        basico: 900,
        padrao: 1500,
        estandar: 1500,
        premium: 3500
      }
    };

    return prices[projectType]?.[plan] || 0;
  }

  showPlanDetails(projectType, plan) {
    // Verificar se estamos na página portuguesa (que tem planos estáticos)
    const isPortuguesePage = window.location.pathname.includes('_pt.html');
    
    if (isPortuguesePage) {
      // Na página portuguesa, os planos são gerenciados pelo presupuesto-pt.js
      return;
    }
    
    const planSection = document.getElementById('selected-plan-section');
    const planContent = document.getElementById('plan-content');
    
    // Get plan details
    const planDetails = this.getPlanDetails(projectType, plan);
    
    if (planDetails) {
      // Create plan content HTML
      planContent.innerHTML = `
        <div class="plan-details-content">
          <div class="plan-header">
            <h3 class="plan-title">${planDetails.title}</h3>
            <p class="plan-price">€${planDetails.price}</p>
          </div>
          <ul class="plan-features-list">
            ${planDetails.features.map(feature => `<li>${feature}</li>`).join('')}
          </ul>
        </div>
      `;
      
      // Show the section
      planSection.style.display = 'block';
    } else {
      // Hide the section if no plan details
      planSection.style.display = 'none';
    }
  }

  getPlanDetails(projectType, plan) {
    const planDetails = {
      landing: {
        basico: {
          title: 'Plan Básico',
          price: 350,
          features: [
            '1 página única con diseño objetivo',
            'Diseño responsivo (desktop + móvil)',
            'Banner principal o destaque del producto/servicio',
            'Formulário + Botón flotante de WhatsApp',
            'SEO básico para búsquedas locales',
            'Call to Action (CTA) principal',
            'Soporte inicial 7 días'
          ]
        },
        estandar: {
          title: 'Plan Estándar',
          price: 600,
          features: [
            '1 página única + hasta 3 secciones',
            'Diseño responsivo y layout personalizado',
            'Banner interactivo o slideshow simple',
            'Formulario + Integración avanzada de WhatsApp',
            'SEO básico + optimización de velocidad',
            'CTAs múltiples',
            'Sección de testimonios o reseñas',
            'Soporte inicial 15 días'
          ]
        },
        premium: {
          title: 'Plan Premium',
          price: 900,
          features: [
            'Página única + hasta 8 secciones',
            'Diseño responsivo, moderno y atractivo',
            'Banner interactivo o slideshow avanzado',
            'Formulario + Integración avanzada de WhatsApp',
            'Integración con redes sociales - Feed de Instagram',
            'SEO avanzado + optimización de velocidad',
            'CTAs múltiples estratégicos y pop-ups de captación',
            'Galería de imágenes o videos interactiva (hasta 15 ítems)',
            'Google Maps avanzado',
            'Soporte inicial 30 días'
          ]
        }
      },
      website: {
        basico: {
          title: 'Plan Básico',
          price: 500,
          features: [
            '2-4 páginas: Inicio, Servicios, Contacto',
            'Diseño responsivo (desktop + móvil)',
            'Banner interactivo',
            'SEO básico',
            'Formulario de contacto + Botón flotante de WhatsApp',
            'Mapa interactivo',
            'Soporte inicial 15 días',
            'Valor Base del proyecto: €500'
          ]
        },
        estandar: {
          title: 'Plan Estándar',
          price: 800,
          features: [
            '6-8 páginas',
            'Identidad visual – Paleta de colores y tipografía',
            'Banner interactivo o slideshow en la página de inicio',
            'Galería simple con hasta 15 imágenes o videos',
            'Formulario + Integración avanzada de WhatsApp',
            'Mapa interactivo',
            'SEO optimización para Google',
            'Soporte 30 días',
            'Valor Base del proyecto: €800'
          ]
        },
        premium: {
          title: 'Plan Premium',
          price: 1000,
          features: [
            '8-12 páginas',
            'Multiidioma – 1 idioma adicional',
            'Galería interactiva con hasta 30 imágenes o videos',
            'Formulario + Integración avanzada de WhatsApp',
            'Integración con redes sociales – Feed de Instagram',
            'Google Maps avanzado',
            'Copias de seguridad automáticas semanales',
            'Firewall',
            'SEO avanzado',
            'Soporte 45 días',
            'Valor Base del proyecto: €1.000'
          ]
        }
      },
      ecommerce: {
        basico: {
          title: 'Plan Básico',
          price: 900,
          features: [
            'Catálogo de hasta 10 productos',
            'Diseño responsivo (desktop + mobile)',
            'Formulario + botón flotante de WhatsApp',
            'Carrito de compras y checkout básico',
            'Integración de pago simple',
            'SEO básico para búsquedas locales',
            'Soporte inicial 15 días',
            'Valor Base del proyecto: €900'
          ]
        },
        estandar: {
          title: 'Plan Estándar',
          price: 1500,
          features: [
            'Catálogo de hasta 50 productos',
            'Diseño responsivo y layout personalizado',
            'Banner o slideshow interactivo en la página inicial',
            'Formulario de contacto + WhatsApp avanzado',
            'Carrito y checkout con pasarelas de pago',
            'SEO optimizado + velocidad mejorada',
            'Sistema de stock automático simple',
            'Panel administrativo básico para productos y categorías',
            'Soporte inicial 30 días',
            'Valor Base del proyecto: €1.500'
          ]
        },
        premium: {
          title: 'Plan Premium',
          price: 3500,
          features: [
            'Catálogo de hasta 200 productos con categorías y filtros',
            'Diseño responsivo, moderno y personalizado',
            'Banner slideshow avanzado',
            'Formulario + WhatsApp Business API',
            'Carrito de compras completo y checkout seguro',
            'Pagos integrados',
            'SEO avanzado + optimización de velocidad',
            'Panel administrativo completo',
            'Integración con Google Analytics',
            'Integración  Facebook Pixel e Instagram Shopping',
            'Soporte inicial 45 días',
            'Valor Base del proyecto: €3.500'
          ]
        }
      }
    };

    return planDetails[projectType]?.[plan] || null;
  }

  showAvailability() {
    const availabilitySection = document.getElementById("availability-section");
    availabilitySection.style.display = "block";

    // Smooth scroll to availability
    availabilitySection.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  // Calendar functionality
  initCalendar() {
    this.currentDate = new Date();
    this.selectedDate = null;
    this.generateCalendar();
  }

  generateCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    // Update month display
    const monthNames = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];

    document.getElementById("current-month").textContent = `${monthNames[month]} ${year}`;

    // Generate calendar grid
    const calendarGrid = document.getElementById("calendar-grid");
    calendarGrid.innerHTML = "";

    // Add day headers
    const dayHeaders = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    dayHeaders.forEach((day) => {
      const dayHeader = document.createElement("div");
      dayHeader.textContent = day;
      dayHeader.style.fontWeight = "600";
      dayHeader.style.textAlign = "center";
      dayHeader.style.padding = "0.5rem";
      dayHeader.style.color = "var(--muted-fg)";
      calendarGrid.appendChild(dayHeader);
    });

    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      const emptyDay = document.createElement("div");
      emptyDay.className = "calendar-day other-month";
      calendarGrid.appendChild(emptyDay);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayElement = document.createElement("div");
      dayElement.className = "calendar-day";
      dayElement.textContent = day;

      const currentDay = new Date(year, month, day);
      const today = new Date();

      // Mark past dates as unavailable
      if (currentDay < today) {
        dayElement.classList.add("busy");
      } else {
        // Simulate some busy days (for demo purposes)
        const busyDays = [5, 12, 18, 25, 28];
        if (busyDays.includes(day)) {
          dayElement.classList.add("busy");
        } else {
          dayElement.classList.add("available");
          dayElement.addEventListener("click", () => this.selectDate(currentDay, dayElement));
        }
      }

      calendarGrid.appendChild(dayElement);
    }
  }

  selectDate(date, element) {
    // Remove previous selection
    document.querySelectorAll(".calendar-day.selected").forEach((day) => {
      day.classList.remove("selected");
      if (day.classList.contains("available")) {
        day.classList.add("available");
      }
    });

    // Select new date
    element.classList.remove("available");
    element.classList.add("selected");
    this.selectedDate = date;

    // Update next available date display
    this.updateNextAvailableDate(date);
  }

  updateNextAvailableDate(date) {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    const formattedDate = date.toLocaleDateString("es-ES", options);
    document.getElementById("next-date").textContent = formattedDate;
  }

  changeMonth(direction) {
    this.currentDate.setMonth(this.currentDate.getMonth() + direction);
    this.generateCalendar();
  }

  contactForProject() {
    const projectInfo = {
      type: this.selectedProject,
      basePrice: this.basePrice,
      features: this.selectedFeatures,
      timeline: this.selectedTimeline,
      totalPrice: Math.round((this.basePrice + this.featuresPrice) * this.timelineMultiplier),
      selectedDate: this.selectedDate,
    };

    // Create contact message
    let message = `Hola Amanda! Me interesa un proyecto de ${this.getProjectTypeName(this.selectedProject)}.%0A%0A`;
    message += `Presupuesto estimado: €${projectInfo.totalPrice.toLocaleString()}%0A`;

    if (this.selectedFeatures.length > 0) {
      message += `Funcionalidades adicionales: ${this.selectedFeatures.map((f) => this.getFeatureName(f.id)).join(", ")}%0A`;
    }

    message += `Timeline: ${this.getTimelineName(this.selectedTimeline)}%0A`;

    if (this.selectedDate) {
      message += `Fecha preferida de inicio: ${this.selectedDate.toLocaleDateString("es-ES")}%0A`;
    }

    message += `%0A¿Podemos hablar sobre los detalles?`;

    // Open WhatsApp or email
    const whatsappUrl = `https://wa.me/1234567890?text=${message}`;
    window.open(whatsappUrl, "_blank");
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
    const names = {
      seo: "SEO",
      analytics: "Analytics",
      multilang: "Multiidioma",
      blog: "Blog",
      booking: "Reservas",
      payment: "Pagos",
    };
    return names[id] || id;
  }

  getTimelineName(multiplier) {
    const names = {
      1.5: "Urgente",
      1.2: "Rápido",
      1: "Normal",
    };
    return names[multiplier] || "Normal";
  }

  removeAllFeatures() {
    // Uncheck all feature checkboxes
    document.querySelectorAll('.feature-item input[type="checkbox"]').forEach((checkbox) => {
      checkbox.checked = false;
    });

    // Clear selected features array
    this.selectedFeatures = [];
    this.calculateFeaturesPrice();
    this.updatePriceSummary();
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
    // Check if it's a feature item or project card
    const featureItem = trigger.closest('.feature-item');
    const projectCard = trigger.closest('.project-card');
    
    const modal = document.getElementById("feature-info-modal");
    const modalTitle = modal.querySelector("#modal-feature-title");
    const modalDescription = modal.querySelector("#modal-feature-description");

    if (featureItem) {
      // Handle feature items (existing functionality)
      const tooltip = featureItem.querySelector('.tooltip');
      const featureName = featureItem.querySelector('span').textContent;
      const featurePrice = featureItem.querySelector('.feature-price').textContent;
      
      if (tooltip && featureName) {
        modalTitle.textContent = featureName;
        modalDescription.textContent = `${tooltip.textContent} - ${featurePrice}`;
        modal.classList.add("active");
        document.body.style.overflow = "hidden";
      }
    } else if (projectCard) {
      // Handle project cards (new functionality)
      const tooltip = projectCard.querySelector('.tooltip');
      const projectName = projectCard.querySelector('h3').textContent;
      
      if (tooltip && projectName) {
        modalTitle.textContent = projectName;
        modalDescription.textContent = tooltip.textContent;
        modal.classList.add("active");
        document.body.style.overflow = "hidden";
      }
    }
  }

  hideFeatureModal() {
    const modal = document.getElementById("feature-info-modal");
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }
}

// Initialize calculator when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new BudgetCalculator();
  initPresupuestoTypewriter();
});

// Typewriter animation for presupuesto page
function initPresupuestoTypewriter() {
  const el = document.querySelector(".typewriter");
  const subtitleEl = document.querySelector(".hero-subtitle");
  if (!el || !subtitleEl) return;

  const phrases = [
    {
      title: "Tu web, tu presupuesto, en tiempo real",
      subtitle: "Descubre el plan ideal para tu proyecto con un cálculo inmediato."
    },
    {
      title: "Calcula y da vida a tu proyecto online.",
      subtitle: "Haz tu cálculo online y da el primer paso hacia tu nuevo proyecto."
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
  const typeDelay = 60; // velocidad tecleo (igual que index.html)
  const deleteDelay = 38; // velocidad borrado (igual que index.html)
  const pauseDelay = 1200; // pausa al terminar palabra (igual que index.html)

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
      // Typing
      el.textContent = currentPhrase.slice(0, charIndex + 1);
      charIndex++;

      if (charIndex === currentPhrase.length) {
        // Finished typing, pause then start deleting
        setTimeout(() => {
          isDeleting = true;
          typeChar();
        }, pauseDelay);
        return;
      }

      setTimeout(typeChar, typeDelay);
    } else {
      // Deleting
      el.textContent = currentPhrase.slice(0, charIndex);
      charIndex--;

      if (charIndex === 0) {
        // Finished deleting, move to next phrase
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        updateSubtitle(phraseIndex); // Update subtitle when phrase changes (like index.html)
        setTimeout(typeChar, 500);
        return;
      }

      setTimeout(typeChar, deleteDelay);
    }
  }

  el.textContent = "";
  subtitleEl.textContent = phrases[0].subtitle; // Set initial subtitle
  setTimeout(typeChar, 500); // Start after 500ms delay
}

document.addEventListener("DOMContentLoaded", function () {
  // Configuración de tooltips
  function initTooltips() {
    const triggers = document.querySelectorAll(".info-trigger");

    triggers.forEach((trigger) => {
      const tooltipId = trigger.getAttribute("aria-controls");
      const tooltip = document.getElementById(tooltipId);

      if (!tooltip) return;

      // Función para mostrar el tooltip
      const showTooltip = () => {
        tooltip.setAttribute("data-show", "");
        trigger.setAttribute("aria-expanded", "true");

        // Posicionamiento del tooltip
        positionTooltip(tooltip, trigger);

        // Cerrar al hacer clic fuera
        document.addEventListener("click", handleClickOutside);

        // Cerrar con tecla Escape
        document.addEventListener("keydown", handleEscape);
      };

      // Función para ocultar el tooltip
      const hideTooltip = () => {
        tooltip.removeAttribute("data-show");
        trigger.setAttribute("aria-expanded", "false");

        // Limpiar event listeners
        document.removeEventListener("click", handleClickOutside);
        document.removeEventListener("keydown", handleEscape);
      };

      // Manejador de clic fuera del tooltip
      const handleClickOutside = (e) => {
        if (!tooltip.contains(e.target) && !trigger.contains(e.target)) {
          hideTooltip();
        }
      };

      // Manejador de tecla Escape
      const handleEscape = (e) => {
        if (e.key === "Escape") {
          hideTooltip();
        }
      };

      // Alternar tooltip al hacer clic
      trigger.addEventListener("click", (e) => {
        e.stopPropagation();
        const isExpanded = trigger.getAttribute("aria-expanded") === "true";

        if (isExpanded) {
          hideTooltip();
        } else {
          // Cerrar otros tooltips abiertos
          document.querySelectorAll('.info-trigger[aria-expanded="true"]').forEach((t) => {
            if (t !== trigger) {
              const otherTooltipId = t.getAttribute("aria-controls");
              const otherTooltip = document.getElementById(otherTooltipId);
              if (otherTooltip) {
                otherTooltip.removeAttribute("data-show");
                t.setAttribute("aria-expanded", "false");
              }
            }
          });

          showTooltip();
        }
      });

      // Cerrar al hacer scroll
      window.addEventListener(
        "scroll",
        () => {
          if (tooltip.hasAttribute("data-show")) {
            positionTooltip(tooltip, trigger);
          }
        },
        true
      );
    });

    // Posicionar tooltip
    function positionTooltip(tooltip, trigger) {
      const triggerRect = trigger.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();

      // Posición vertical
      const top = triggerRect.bottom + window.scrollY + 8;

      // Posición horizontal (centrado en móvil, alineado al trigger en desktop)
      let left = triggerRect.left + window.scrollX;

      if (window.innerWidth >= 768) {
        // En desktop, alinear a la derecha del trigger
        left = triggerRect.right + window.scrollX - tooltipRect.width;

        // Asegurarse de que no se salga por la izquierda
        if (left < 0) {
          left = 16; // Márgen de 16px
        }
      } else {
        // En móvil, centrar
        left = (window.innerWidth - tooltipRect.width) / 2;
      }

      tooltip.style.top = `${top}px`;
      tooltip.style.left = `${left}px`;
    }
  }

  // Inicializar tooltips
  initTooltips();

  // Resto del código del presupuestador...
  const projectCards = document.querySelectorAll(".project-card");
  const planSection = document.getElementById("plan-section");
  const featuresSection = document.getElementById("features-section");

  // ... (resto del código existente)
});

// Add smooth scrolling for anchor links
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

// Add loading animation for price updates
function animatePrice(element) {
  element.style.transform = "scale(1.05)";
  element.style.transition = "transform 0.2s ease";

  setTimeout(() => {
    element.style.transform = "scale(1)";
  }, 200);
}

// Enhance form interactions with animations
document.addEventListener("DOMContentLoaded", () => {
  // Add entrance animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  });

  // Observe elements for animation
  document.querySelectorAll(".project-card, .feature-item, .timeline-option").forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // DOM Elements
  const projectCards = document.querySelectorAll(".project-card");
  const planSection = document.getElementById("plan-section");
  const featuresSection = document.getElementById("features-section");
  const planCards = document.querySelectorAll(".plan-card");
  const selectPlanBtns = document.querySelectorAll(".select-plan-btn");
  const featureCheckboxes = document.querySelectorAll('.feature-item input[type="checkbox"]');
  const totalPriceElement = document.querySelector(".total-price");
  const selectedFeaturesList = document.querySelector(".selected-features");
  const checkoutBtn = document.querySelector(".checkout-btn");

  // State
  let selectedProject = null;
  let selectedPlan = null;
  let selectedFeatures = [];

  // Project type selection
  projectCards.forEach((card) => {
    card.addEventListener("click", function () {
      // Remove active class from all cards
      projectCards.forEach((c) => c.classList.remove("active"));
      // Add active class to clicked card
      this.classList.add("active");

      // Set selected project
      selectedProject = {
        type: this.dataset.type,
        basePrice: parseInt(this.dataset.price, 10),
      };

      // Show plan selection
      planSection.style.display = "block";
      featuresSection.style.display = "none";

      // Scroll to plan section
      planSection.scrollIntoView({ behavior: "smooth" });

      // Reset selected plan
      resetPlanSelection();
      updatePrice();
    });
  });

  // Plan selection
  selectPlanBtns.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();

      const planCard = this.closest(".plan-card");
      const planType = planCard.dataset.plan;

      // Update selected plan
      selectedPlan = {
        type: planType,
        price: getPlanPrice(planType),
      };

      // Update UI
      planCards.forEach((card) => card.classList.remove("selected"));
      planCard.classList.add("selected");

      // Show features section
      featuresSection.style.display = "block";

      // Scroll to features section
      featuresSection.scrollIntoView({ behavior: "smooth" });

      // Update price
      updatePrice();
    });
  });

  // Feature selection
  featureCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      const feature = {
        id: this.id,
        name: this.nextElementSibling.querySelector("span").textContent,
        price: parseInt(this.dataset.price, 10),
      };

      if (this.checked) {
        selectedFeatures.push(feature);
      } else {
        selectedFeatures = selectedFeatures.filter((f) => f.id !== feature.id);
      }

      updateSelectedFeaturesList();
      updatePrice();
    });
  });

  // Helper functions
  function getPlanPrice(planType) {
    // This would come from your database or configuration
    const prices = {
      landing: { basic: 450, standard: 700, premium: 1200 },
      website: { basic: 800, standard: 1500, premium: 2500 },
      ecommerce: { basic: 1500, standard: 3000, premium: 5000 },
    };

    return prices[selectedProject.type][planType];
  }

  function updatePrice() {
    if (!selectedProject) return;

    let total = 0;

    // Add plan price if selected
    if (selectedPlan) {
      total += selectedPlan.price;
    } else {
      // Default to base price if no plan selected yet
      total += selectedProject.basePrice;
    }

    // Add features price
    selectedFeatures.forEach((feature) => {
      total += feature.price;
    });

    // Update UI
    if (totalPriceElement) {
      totalPriceElement.textContent = `€${total.toLocaleString("es-ES")}`;
    }
  }

  function updateSelectedFeaturesList() {
    if (!selectedFeaturesList) return;

    if (selectedFeatures.length === 0) {
      selectedFeaturesList.innerHTML =
        '<li class="empty">No hay funcionalidades adicionales seleccionadas</li>';
      return;
    }

    selectedFeaturesList.innerHTML = selectedFeatures
      .map(
        (feature) => `
                <li>
                    <span>${feature.name}</span>
                    <span class="feature-price">+€${feature.price}</span>
                </li>
            `
      )
      .join("");
  }

  function resetPlanSelection() {
    selectedPlan = null;
    planCards.forEach((card) => card.classList.remove("selected"));
    selectedFeatures = [];
    featureCheckboxes.forEach((checkbox) => (checkbox.checked = false));
    updateSelectedFeaturesList();
  }

  // Initialize
  updateSelectedFeaturesList();

  // Handle checkout button
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", function (e) {
      if (!selectedProject) {
        e.preventDefault();
        alert("Por favor, selecciona un tipo de proyecto para continuar.");
        return;
      }

      if (!selectedPlan) {
        e.preventDefault();
        alert("Por favor, selecciona un plan para continuar.");
        return;
      }

      // Here you would typically submit the form or redirect to checkout
      console.log("Proceeding to checkout with:", {
        project: selectedProject,
        plan: selectedPlan,
        features: selectedFeatures,
      });
    });
  }
});

// Tab System Functionality
document.addEventListener("DOMContentLoaded", function () {
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');

  // Initialize tab functionality
  function initTabs() {
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
            toggleSystemsByProjectType(projectType);
          } else if (targetTab === 'features-tab') {
            // Apply features logic (call the original function)
            if (window.budgetCalculator && window.budgetCalculator.toggleWebPageFeatures) {
              window.budgetCalculator.toggleWebPageFeatures(projectType);
            }
          }
        }
      });
    });
  }

  // Show/hide systems tab based on project selection
  function toggleSystemsTab(projectType) {
    const systemsTabButton = document.getElementById('systems-tab-button');
    
    if (projectType === 'landing' || projectType === 'website' || projectType === 'ecommerce') {
      systemsTabButton.style.display = 'block';
      // Show/hide specific systems based on project type
      toggleSystemsByProjectType(projectType);
    } else {
      systemsTabButton.style.display = 'none';
      // If systems tab is active and we hide it, switch to features tab
      if (systemsTabButton.classList.contains('active')) {
        document.querySelector('[data-tab="features-tab"]').click();
      }
    }
  }

  // Show/hide integrations tab based on project selection
  function toggleIntegrationsTab(projectType) {
    const integrationsTabButton = document.getElementById('integrations-tab-button');
    
    if (projectType === 'landing' || projectType === 'website' || projectType === 'ecommerce') {
      integrationsTabButton.style.display = 'block';
    } else {
      integrationsTabButton.style.display = 'none';
      // If integrations tab is active and we hide it, switch to features tab
      if (integrationsTabButton.classList.contains('active')) {
        document.querySelector('[data-tab="features-tab"]').click();
      }
    }
  }

  // Function to show/hide systems based on project type
  function toggleSystemsByProjectType(projectType) {
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

  // Initialize tabs
  initTabs();

  // Override the original toggleWebPageFeatures to include systems and integrations tab logic
  const originalToggleWebPageFeatures = window.budgetCalculator?.toggleWebPageFeatures;
  if (window.budgetCalculator) {
    const originalMethod = window.budgetCalculator.toggleWebPageFeatures;
    window.budgetCalculator.toggleWebPageFeatures = function(projectType) {
      // Call original method
      originalMethod.call(this, projectType);
      
      // Add systems and integrations tab logic
      toggleSystemsTab(projectType);
      toggleIntegrationsTab(projectType);
    };
  }

  // Listen for project selection changes
  document.addEventListener('click', function(e) {
    if (e.target.closest('.project-card')) {
      const projectCard = e.target.closest('.project-card');
      const projectType = projectCard.getAttribute('data-type');
      
      // Small delay to ensure the project is selected first
      setTimeout(() => {
        toggleSystemsTab(projectType);
        toggleIntegrationsTab(projectType);
      }, 100);
    }
  });
});
