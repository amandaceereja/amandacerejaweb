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
            
            // Converter preços no resumo (tanto com -pt quanto sem)
            const summaryPrices = document.querySelectorAll('#base-price, #base-price-pt, #features-price, #features-price-pt, #timeline-price, #timeline-price-pt, #total-price, #total-price-pt');
            summaryPrices.forEach(convertToReais);
            
            // Converter preços nos planos
            const planPrices = document.querySelectorAll('.plan-price, .price, .total-price');
            planPrices.forEach(convertToReais);
            
            // Converter elementos específicos que podem conter €
            const euroElements = document.querySelectorAll('[data-price], .price-display, .price-breakdown, .price-breakdown-pt');
            euroElements.forEach(convertToReais);
            
            // Converter qualquer elemento que contenha € no texto
            const allElements = document.querySelectorAll('*');
            allElements.forEach(element => {
                // Verificar apenas elementos que têm texto direto (sem filhos de elemento)
                if (element.childNodes.length > 0) {
                    element.childNodes.forEach(node => {
                        if (node.nodeType === Node.TEXT_NODE && node.textContent.includes('€')) {
                            node.textContent = node.textContent.replace(/€/g, 'R$');
                        }
                    });
                }
                
                // Verificar elementos que só têm texto
                if (element.children.length === 0 && element.textContent && element.textContent.includes('€')) {
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
                // Aguardar um pouco para garantir que o DOM foi atualizado
                setTimeout(() => {
                    convertAllPrices();
                }, 10);
            };
        }
        
        // Sobrescrever método de seleção de plano
        const originalSelectPlan = originalBudgetCalculator.prototype.selectPlan;
        if (originalSelectPlan) {
            originalBudgetCalculator.prototype.selectPlan = function(planBtn) {
                originalSelectPlan.call(this, planBtn);
                // Aguardar um pouco para garantir que o DOM foi atualizado
                setTimeout(() => {
                    convertAllPrices();
                }, 10);
            };
        }
        
        // Sobrescrever método de seleção de projeto
        const originalSelectProject = originalBudgetCalculator.prototype.selectProject;
        if (originalSelectProject) {
            originalBudgetCalculator.prototype.selectProject = function(card) {
                originalSelectProject.call(this, card);
                // Aguardar um pouco para garantir que o DOM foi atualizado
                setTimeout(() => {
                    convertAllPrices();
                }, 10);
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
    
    // Observador de mutações mais robusto para detectar mudanças no DOM
    const observer = new MutationObserver(function(mutations) {
        let shouldConvert = false;
        
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                // Verificar se novos elementos foram adicionados
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Verificar se o elemento ou seus filhos contêm €
                        if (node.textContent && node.textContent.includes('€')) {
                            shouldConvert = true;
                        }
                    }
                });
            } else if (mutation.type === 'characterData') {
                // Verificar se o texto modificado contém €
                if (mutation.target.textContent && mutation.target.textContent.includes('€')) {
                    shouldConvert = true;
                }
            }
        });
        
        if (shouldConvert) {
            // Aguardar um pouco para garantir que todas as mudanças foram aplicadas
            setTimeout(() => {
                convertAllPrices();
            }, 50);
        }
    });
    
    // Observar mudanças no documento
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: false
    });
    
    // Converter preços a cada 500ms para garantir que nada escape
    setInterval(() => {
        const hasEuros = document.body.textContent.includes('€');
        if (hasEuros) {
            convertAllPrices();
        }
    }, 500);
    
    // Conversão inicial
    setTimeout(convertAllPrices, 100);
    
    // Conversão após interações do usuário
    document.addEventListener('click', function(e) {
        if (e.target.closest('.plan-btn-pt, .feature-item, .project-card, .timeline-option')) {
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