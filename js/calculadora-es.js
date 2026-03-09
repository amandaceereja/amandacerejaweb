// Configuración específica de la calculadora para presupuesto.html (versión ES)
// Garantiza que todos los valores se muestren en € (Euros)

document.addEventListener('DOMContentLoaded', function () {
  console.log('🇪🇸 Iniciando configuración de la calculadora en Euros...');

  function convertToEuros(element) {
    if (!element) return;
    if (element.textContent && element.textContent.includes('R$')) {
      element.textContent = element.textContent.replace(/R\$/g, '€');
    }
    if (element.children.length === 0 && element.innerHTML && element.innerHTML.includes('R$')) {
      element.innerHTML = element.innerHTML.replace(/R\$/g, '€');
    }
    if (element.dataset && element.dataset.price && element.dataset.price.includes('R$')) {
      element.dataset.price = element.dataset.price.replace(/R\$/g, '€');
    }
  }

  function convertAllPricesToEuros() {
    try {
      const featurePrices = document.querySelectorAll('.feature-price');
      featurePrices.forEach(convertToEuros);

      const summaryPrices = document.querySelectorAll(
        '#base-price, #features-price, #timeline-price, #total-price, #base-price-es, #features-price-es, #timeline-price-es, #total-price-es'
      );
      summaryPrices.forEach(convertToEuros);

      const planPrices = document.querySelectorAll('.plan-price, .price, .total-price');
      planPrices.forEach(convertToEuros);

      const priceElements = document.querySelectorAll('[data-price], .price-display, .price-breakdown');
      priceElements.forEach(convertToEuros);

      const allElements = document.querySelectorAll('*');
      allElements.forEach((element) => {
        if (element.childNodes.length > 0) {
          element.childNodes.forEach((node) => {
            if (node.nodeType === Node.TEXT_NODE && node.textContent.includes('R$')) {
              node.textContent = node.textContent.replace(/R\$/g, '€');
            }
          });
        }
        if (element.children.length === 0 && element.textContent && element.textContent.includes('R$')) {
          convertToEuros(element);
        }
      });
    } catch (error) {
      console.warn('Error en la conversión de precios a Euros:', error);
    }
  }

  if (window.PresupuestoCalculator) {
    const OriginalCalc = window.PresupuestoCalculator;
    const origUpdate = OriginalCalc.prototype.updatePriceSummary;
    if (origUpdate) {
      OriginalCalc.prototype.updatePriceSummary = function () {
        origUpdate.call(this);
        setTimeout(convertAllPricesToEuros, 50);
      };
    }
    const origSelectPlan = OriginalCalc.prototype.selectPlan;
    if (origSelectPlan) {
      OriginalCalc.prototype.selectPlan = function (plan, projectType) {
        origSelectPlan.call(this, plan, projectType);
        setTimeout(convertAllPricesToEuros, 50);
      };
    }
    const origCalcFeatures = OriginalCalc.prototype.calculateFeaturesPrice;
    if (origCalcFeatures) {
      OriginalCalc.prototype.calculateFeaturesPrice = function () {
        origCalcFeatures.call(this);
        setTimeout(convertAllPricesToEuros, 50);
      };
    }
  }

  if (window.BudgetCalculator) {
    const OriginalBudget = window.BudgetCalculator;
    const origUpdate = OriginalBudget.prototype.updatePriceSummary;
    if (origUpdate) {
      OriginalBudget.prototype.updatePriceSummary = function () {
        origUpdate.call(this);
        setTimeout(convertAllPricesToEuros, 10);
      };
    }
    const origSelectPlan = OriginalBudget.prototype.selectPlan;
    if (origSelectPlan) {
      OriginalBudget.prototype.selectPlan = function (planBtn) {
        origSelectPlan.call(this, planBtn);
        setTimeout(convertAllPricesToEuros, 10);
      };
    }
    const origSelectProject = OriginalBudget.prototype.selectProject;
    if (origSelectProject) {
      OriginalBudget.prototype.selectProject = function (card) {
        origSelectProject.call(this, card);
        setTimeout(convertAllPricesToEuros, 10);
      };
    }
    const origCalcFeatures = OriginalBudget.prototype.calculateFeaturesPrice;
    if (origCalcFeatures) {
      OriginalBudget.prototype.calculateFeaturesPrice = function () {
        origCalcFeatures.call(this);
        setTimeout(convertAllPricesToEuros, 50);
      };
    }
  }

  const observer = new MutationObserver(function (mutations) {
    let shouldConvert = false;
    mutations.forEach(function (mutation) {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.textContent && node.textContent.includes('R$')) {
              shouldConvert = true;
            }
          }
        });
      } else if (mutation.type === 'characterData') {
        if (mutation.target.textContent && mutation.target.textContent.includes('R$')) {
          shouldConvert = true;
        }
      }
    });
    if (shouldConvert) {
      setTimeout(() => {
        convertAllPricesToEuros();
      }, 50);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: false,
  });

  setInterval(() => {
    const hasReais = document.body.textContent.includes('R$');
    if (hasReais) {
      convertAllPricesToEuros();
    }
  }, 500);

  setTimeout(convertAllPricesToEuros, 100);

  document.addEventListener('click', function (e) {
    if (e.target.closest('.plan-btn, .feature-item, .project-card, .timeline-option')) {
      setTimeout(convertAllPricesToEuros, 150);
    }
  });

  document.addEventListener('change', function (e) {
    if (e.target.type === 'checkbox' && e.target.closest('.feature-item')) {
      setTimeout(convertAllPricesToEuros, 150);
    }
  });

  console.log('✅ Configuración de la calculadora en Euros activada!');
});
