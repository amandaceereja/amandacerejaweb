// Sistema de traduções específico para presupuesto_pt.html

// BLOQUEAR a função original em espanhol ANTES que ela seja executada
(function() {
    // Armazenar os textos em português
    const portuguesePhrases = [
        {
            title: "Calcula o Orçamento do seu Projeto",
            subtitle: "Descubra o plano ideal para seu projeto com um cálculo imediato."
        },
        {
            title: "Calcula e dê vida ao seu projeto online.",
            subtitle: "Faça seu cálculo online e dê o primeiro passo para seu novo projeto."
        }
    ];

    // SOBRESCREVER a função original ANTES que ela seja chamada
    window.initPresupuestoTypewriter = function() {
        console.log('🇧🇷 Typewriter em PORTUGUÊS ativado!');
        
        const el = document.querySelector(".typewriter");
        const subtitleEl = document.querySelector(".hero-subtitle");
        if (!el || !subtitleEl) {
            console.log('❌ Elementos não encontrados');
            return;
        }

        const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (prefersReduced) {
            el.textContent = portuguesePhrases[0].title;
            subtitleEl.textContent = portuguesePhrases[0].subtitle;
            console.log('✅ Texto estático aplicado (reduced motion)');
            return;
        }

        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        const typeDelay = 60;
        const deleteDelay = 38;
        const pauseDelay = 1200;

        function updateSubtitle(index) {
            if (subtitleEl) {
                subtitleEl.style.opacity = '0';
                setTimeout(() => {
                    subtitleEl.textContent = portuguesePhrases[index].subtitle;
                    subtitleEl.style.opacity = '1';
                }, 300);
            }
        }

        function typeChar() {
            const currentPhrase = portuguesePhrases[phraseIndex].title;

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
                    phraseIndex = (phraseIndex + 1) % portuguesePhrases.length;
                    updateSubtitle(phraseIndex);
                    setTimeout(typeChar, 500);
                    return;
                }

                setTimeout(typeChar, deleteDelay);
            }
        }

        el.textContent = "";
        subtitleEl.textContent = portuguesePhrases[0].subtitle;
        setTimeout(typeChar, 500);
        
        console.log('✅ Typewriter em português iniciado!');
        console.log('📋 Frases:', portuguesePhrases);
    };
    
    console.log('🛡️ Função initPresupuestoTypewriter BLOQUEADA para português!');
})();

// Restante das traduções da página (apenas as que não são do banner)
document.addEventListener('DOMContentLoaded', function() {

document.addEventListener('DOMContentLoaded', function() {
    // Traduzir o título da calculadora
    const calculatorTitle = document.querySelector('.calculator-form h2');
    if (calculatorTitle) {
        calculatorTitle.textContent = 'Que tipo de projeto você precisa?';
    }
    
    // Traduzir o label do tipo de projeto
    const projectTypeLabel = document.querySelector('.form-group .form-label');
    if (projectTypeLabel) {
        projectTypeLabel.textContent = 'Tipo de Projeto';
    }
    
    // Traduzir os nomes dos projetos
    const projectNames = {
        'landing': 'Landing Page',
        'website': 'Website Corporativo', 
        'ecommerce': 'Ecommerce'
    };
    
    document.querySelectorAll('.project-card').forEach(card => {
        const projectType = card.dataset.type;
        const projectTitle = card.querySelector('.project-info h3');
        if (projectTitle && projectNames[projectType]) {
            projectTitle.textContent = projectNames[projectType];
        }
    });
    
    // Traduzir os botões de plano
    const planButtons = document.querySelectorAll('.plan-btn');
    planButtons.forEach(btn => {
        const planType = btn.dataset.plan;
        switch(planType) {
            case 'basico':
                btn.textContent = btn.closest('[data-type="ecommerce"]') ? 'Plano Básico' : 'Básico';
                break;
            case 'estandar':
                btn.textContent = btn.closest('[data-type="ecommerce"]') ? 'Plano Padrão' : 'Padrão';
                break;
            case 'premium':
                btn.textContent = btn.closest('[data-type="ecommerce"]') ? 'Plano Premium' : 'Premium';
                break;
        }
    });
    
    // Traduzir tooltips
    const tooltips = [
        {
            selector: '[data-type="landing"] .tooltip h4',
            text: 'Landing Page - Página única'
        },
        {
            selector: '[data-type="landing"] .tooltip p',
            text: 'Perfeita para promoções, campanhas de marketing, captação de clientes ou para negócios que precisam de uma solução simples e rápida.'
        },
        {
            selector: '[data-type="website"] .tooltip h4',
            text: 'Web Page - Site Institucional'
        },
        {
            selector: '[data-type="website"] .tooltip p',
            text: 'Ideal para empresas que desejam apresentar seus serviços, história, contatos e informações de forma profissional.'
        },
        {
            selector: '[data-type="ecommerce"] .tooltip h4',
            text: 'E-commerce - Loja virtual'
        },
        {
            selector: '[data-type="ecommerce"] .tooltip p',
            text: 'Solução completa para quem deseja vender online com catálogo de produtos, carrinho e checkout seguro.'
        }
    ];
    
    tooltips.forEach(tooltip => {
        const element = document.querySelector(tooltip.selector);
        if (element) {
            element.textContent = tooltip.text;
        }
    });
    
    // Traduzir aria-labels
    const ariaLabels = [
        {
            selector: '[data-type="landing"] .info-trigger',
            label: 'Mais informações sobre Landing Page'
        },
        {
            selector: '[data-type="website"] .info-trigger',
            label: 'Mais informações sobre Website Corporativo'
        },
        {
            selector: '[data-type="ecommerce"] .info-trigger',
            label: 'Mais informações sobre E-commerce'
        }
    ];
    
    ariaLabels.forEach(item => {
        const element = document.querySelector(item.selector);
        if (element) {
            element.setAttribute('aria-label', item.label);
        }
    });
    
    // Traduzir seções adicionais
    const selectedPlanSection = document.querySelector('#selected-plan-section .form-label');
    if (selectedPlanSection) {
        selectedPlanSection.textContent = 'Plano Selecionado';
    }
    
    // Traduzir abas
    const tabButtons = [
        {
            selector: '[data-tab="features-tab"]',
            text: 'Funcionalidades Adicionais'
        },
        {
            selector: '[data-tab="integrations-tab"]',
            text: 'Integrações'
        },
        {
            selector: '[data-tab="systems-tab"]',
            text: 'Sistemas'
        }
    ];
    
    tabButtons.forEach(tab => {
        const element = document.querySelector(tab.selector);
        if (element) {
            element.textContent = tab.text;
        }
    });
    
    // Traduzir funcionalidades
    const features = [
        {
            selector: '#seo + label span',
            text: 'Otimização SEO'
        },
        {
            selector: '#analytics + label span',
            text: 'Google Analytics'
        },
        {
            selector: '#multilang + label span',
            text: 'Multiidioma'
        },
        {
            selector: '#blog + label span',
            text: 'Blog integrado'
        },
        {
            selector: '#booking + label span',
            text: 'Sistema de reservas'
        },
        {
            selector: '#payment + label span',
            text: 'Gateway de pagamento'
        }
    ];
    
    features.forEach(feature => {
        const element = document.querySelector(feature.selector);
        if (element) {
            element.textContent = feature.text;
        }
    });
    
    // Traduzir preços
    const prices = document.querySelectorAll('.feature-price');
    prices.forEach(price => {
        const value = price.textContent.replace('€', '').trim();
        price.textContent = `R$${value}`;
    });
    
    console.log('✅ Sistema de tradução PT aplicado com sucesso!');
});

// Função para atualizar textos dinamicamente
function updateBannerTexts(title, subtitle) {
    const heroTitle = document.querySelector('.hero-presupuesto h1 .typewriter');
    const heroSubtitle = document.querySelector('.hero-presupuesto .hero-subtitle');
    
    if (heroTitle) heroTitle.textContent = title;
    if (heroSubtitle) heroSubtitle.textContent = subtitle;
}
})