// Configuração específica da calculadora para presupuesto_pt.html
// Garante que todos os valores sejam exibidos em R$ (Reais)

document.addEventListener('DOMContentLoaded', function() {
    console.log('🇧🇷 Iniciando configuração da calculadora em Reais...');
    
    // Função para converter € para R$ em qualquer elemento
    function convertToReais(element) {
        if (!element) return;
        
        // Converter textContent
        if (element.textContent && element.textContent.includes('€')) {
            element.textContent = element.textContent.replace(/€/g, 'R$');
        }
        
        // Converter innerHTML apenas se não contém elementos filhos complexos
        if (element.children.length === 0 && element.innerHTML && element.innerHTML.includes('€')) {
            element.innerHTML = element.innerHTML.replace(/€/g, 'R$');
        }
        
        // Converter atributos data-price se existirem
        if (element.dataset && element.dataset.price && element.dataset.price.includes('€')) {
            element.dataset.price = element.dataset.price.replace(/€/g, 'R$');
        }
    }
    
    // Função para converter todos os preços na página
    function convertAllPrices() {
        try {
            // Converter preços nas funcionalidades
            const featurePrices = document.querySelectorAll('.feature-price');
            featurePrices.forEach(convertToReais);
            
            // Converter preços no resumo
            const summaryPrices = document.querySelectorAll('#base-price, #features-price, #timeline-price, #total-price');
            summaryPrices.forEach(convertToReais);
            
            // Converter preços nos planos
            const planPrices = document.querySelectorAll('.plan-price, .price, .total-price');
            planPrices.forEach(convertToReais);
            
            // Converter elementos específicos que podem conter €
            const euroElements = document.querySelectorAll('[data-price], .price-display, .price-breakdown');
            euroElements.forEach(convertToReais);
            
            // Converter qualquer texto que contenha € (mais específico)
            const textElements = document.querySelectorAll('span, div, p, h1, h2, h3, h4, h5, h6');
            textElements.forEach(element => {
                if (element.textContent && element.textContent.includes('€') && 
                    element.children.length === 0) {
                    convertToReais(element);
                }
            });
            
        } catch (error) {
            console.warn('Erro na conversão de preços:', error);
        }
    }
    
    // Interceptar a classe PresupuestoCalculator se existir
    if (window.PresupuestoCalculator) {
        const originalCalculator = window.PresupuestoCalculator;
        
        // Sobrescrever método de atualização de resumo
        const originalUpdatePriceSummary = originalCalculator.prototype.updatePriceSummary;
        if (originalUpdatePriceSummary) {
            originalCalculator.prototype.updatePriceSummary = function() {
                originalUpdatePriceSummary.call(this);
                setTimeout(convertAllPrices, 50);
            };
        }
        
        // Sobrescrever método de seleção de plano
        const originalSelectPlan = originalCalculator.prototype.selectPlan;
        if (originalSelectPlan) {
            originalCalculator.prototype.selectPlan = function(plan, projectType) {
                originalSelectPlan.call(this, plan, projectType);
                setTimeout(convertAllPrices, 50);
            };
        }
        
        // Sobrescrever método de cálculo de preços de funcionalidades
        const originalCalculateFeaturesPrice = originalCalculator.prototype.calculateFeaturesPrice;
        if (originalCalculateFeaturesPrice) {
            originalCalculator.prototype.calculateFeaturesPrice = function() {
                originalCalculateFeaturesPrice.call(this);
                setTimeout(convertAllPrices, 50);
            };
        }
    }
    
    // Interceptar a classe BudgetCalculator se existir (nome alternativo)
    if (window.BudgetCalculator) {
        const originalBudgetCalculator = window.BudgetCalculator;
        
        // Sobrescrever método de atualização de resumo
        const originalUpdatePriceSummary = originalBudgetCalculator.prototype.updatePriceSummary;
        if (originalUpdatePriceSummary) {
            originalBudgetCalculator.prototype.updatePriceSummary = function() {
                originalUpdatePriceSummary.call(this);
                setTimeout(convertAllPrices, 50);
            };
        }
        
        // Sobrescrever método de cálculo de preços de funcionalidades
        const originalCalculateFeaturesPrice = originalBudgetCalculator.prototype.calculateFeaturesPrice;
        if (originalCalculateFeaturesPrice) {
            originalBudgetCalculator.prototype.calculateFeaturesPrice = function() {
                originalCalculateFeaturesPrice.call(this);
                setTimeout(convertAllPrices, 50);
            };
        }
    }
    
    // Observador de mutações mais específico (apenas para elementos de preço)
    const observer = new MutationObserver(function(mutations) {
        let shouldConvert = false;
        mutations.forEach(function(mutation) {
            if (mutation.type === 'characterData' || 
                (mutation.type === 'childList' && mutation.target.matches && 
                 mutation.target.matches('.feature-price, #base-price, #features-price, #timeline-price, #total-price, .price, .total-price'))) {
                shouldConvert = true;
            }
        });
        
        if (shouldConvert) {
            setTimeout(convertAllPrices, 100);
        }
    });
    
    // Observar apenas elementos específicos de preço
    const priceElements = document.querySelectorAll('.feature-price, #base-price, #features-price, #timeline-price, #total-price, .price-breakdown');
    priceElements.forEach(element => {
        observer.observe(element, {
            childList: true,
            subtree: true,
            characterData: true
        });
    });
    
    // Conversão inicial
    setTimeout(convertAllPrices, 100);
    
    // Conversão após interações do usuário
    document.addEventListener('click', function(e) {
        if (e.target.closest('.plan-btn, .feature-item, .project-card, .timeline-option')) {
            setTimeout(convertAllPrices, 150);
        }
    });
    
    // Conversão após mudanças em checkboxes
    document.addEventListener('change', function(e) {
        if (e.target.type === 'checkbox' && e.target.closest('.feature-item')) {
            setTimeout(convertAllPrices, 150);
        }
    });
    
    console.log('✅ Configuração da calculadora em Reais ativada!');
});