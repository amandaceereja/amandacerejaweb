// Script simples e direto para resolver o problema dos cartões de plano
// Este script funciona de forma independente e garante que os cartões apareçam

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Script de correção dos cartões carregado');
    
    // Aguardar um pouco para garantir que todos os elementos estejam carregados
    setTimeout(function() {
        initializeProjectCards();
    }, 500);
});

function initializeProjectCards() {
    console.log('🔧 Inicializando cartões de projeto');
    
    // Selecionar todos os cartões de projeto
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(function(card) {
        // Remover listeners anteriores para evitar duplicação
        card.removeEventListener('click', handleProjectClick);
        
        // Adicionar novo listener
        card.addEventListener('click', handleProjectClick);
        
        console.log('✅ Listener adicionado ao cartão:', card.dataset.type);
    });
    
    // Adicionar listeners aos botões de plano
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('plan-btn')) {
            handlePlanClick(e);
        }
    });
    
    console.log('🎯 Inicialização completa');
}

function handleProjectClick(event) {
    const clickedCard = event.currentTarget;
    const projectType = clickedCard.dataset.type;
    
    console.log('🎯 Projeto clicado:', projectType);
    
    // Remover seleção de todos os cartões
    document.querySelectorAll('.project-card').forEach(function(card) {
        card.classList.remove('selected');
        
        // Esconder botões de plano
        const planButtons = card.querySelector('.plan-buttons');
        if (planButtons) {
            planButtons.style.display = 'none';
            planButtons.classList.remove('show');
        }
    });
    
    // Esconder seção de plano selecionado
    const planSection = document.getElementById('selected-plan-section');
    if (planSection) {
        planSection.style.display = 'none';
    }
    
    // Selecionar o cartão clicado
    clickedCard.classList.add('selected');
    
    // Mostrar botões de plano para o cartão selecionado
    const planButtons = clickedCard.querySelector('.plan-buttons');
    if (planButtons) {
        console.log('✅ Mostrando botões de plano para:', projectType);
        planButtons.style.display = 'flex';
        
        // Adicionar classe show com delay para animação
        setTimeout(function() {
            planButtons.classList.add('show');
        }, 100);
    } else {
        console.log('❌ Botões de plano não encontrados para:', projectType);
    }
}

function handlePlanClick(event) {
    const planButton = event.target;
    const projectCard = planButton.closest('.project-card');
    
    if (!projectCard) {
        console.log('❌ Cartão de projeto não encontrado');
        return;
    }
    
    const projectType = projectCard.dataset.type;
    const plan = planButton.dataset.plan;
    
    console.log('📋 Plano clicado:', projectType, plan);
    
    // Converter "estandar" para "padrao" se necessário
    const normalizedPlan = plan === 'estandar' ? 'padrao' : plan;
    
    showPlanDetails(projectType, normalizedPlan);
}

function showPlanDetails(projectType, plan) {
    console.log('🎨 Mostrando detalhes do plano:', projectType, plan);
    
    // Esconder todos os planos
    document.querySelectorAll('.plan-details-content').forEach(function(planDiv) {
        planDiv.style.display = 'none';
    });
    
    // Mostrar o plano selecionado
    const planId = projectType + '-' + plan;
    const selectedPlan = document.getElementById(planId);
    
    console.log('🔍 Procurando plano com ID:', planId);
    
    if (selectedPlan) {
        console.log('✅ Plano encontrado, exibindo');
        selectedPlan.style.display = 'block';
        
        // Mostrar a seção de plano selecionado
        const planSection = document.getElementById('selected-plan-section');
        if (planSection) {
            planSection.style.display = 'block';
            console.log('✅ Seção de plano exibida');
            
            // Scroll suave para a seção
            planSection.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        } else {
            console.log('❌ Seção selected-plan-section não encontrada');
        }
    } else {
        console.log('❌ Plano não encontrado com ID:', planId);
        
        // Listar todos os IDs disponíveis para debug
        const allPlans = document.querySelectorAll('.plan-details-content');
        console.log('📝 Planos disponíveis:');
        allPlans.forEach(function(plan) {
            console.log('  -', plan.id);
        });
    }
}

// Função para debug - listar todos os elementos relevantes
function debugElements() {
    console.log('🔍 DEBUG: Elementos encontrados');
    
    const projectCards = document.querySelectorAll('.project-card');
    console.log('Cartões de projeto:', projectCards.length);
    
    const planButtons = document.querySelectorAll('.plan-btn');
    console.log('Botões de plano:', planButtons.length);
    
    const planDetails = document.querySelectorAll('.plan-details-content');
    console.log('Detalhes de plano:', planDetails.length);
    
    const planSection = document.getElementById('selected-plan-section');
    console.log('Seção de plano:', planSection ? 'Encontrada' : 'Não encontrada');
}

// Executar debug após carregamento
setTimeout(debugElements, 1000);