// Configuración
const ADMIN_PASSWORD = "amanda2025"; // Cambiar por una contraseña segura
const PROJECTS_KEY = "portfolio_projects";

// Estado global
let isAdmin = false;
let projects = [];
let editingProjectId = null;

// Elementos DOM
let elements = {};

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  initializeElements();
  loadProjects();
  renderProjects();
  setupEventListeners();
  checkAdminStatus();
  initializeBackToTop();
  initializeMobileMenu();
});

function initializeElements() {
  elements = {
    // Login
    loginModal: document.getElementById("login-modal"),
    loginForm: document.getElementById("login-form"),
    adminPassword: document.getElementById("admin-password"),
    adminLoginBtn: document.getElementById("admin-login-btn"),
    modalClose: document.querySelector(".modal-close"),

    // Admin Panel
    adminPanel: document.getElementById("admin-panel"),
    projectForm: document.getElementById("project-form"),
    projectId: document.getElementById("project-id"),
    logoutBtn: document.getElementById("logout-btn"),
    cancelEdit: document.getElementById("cancel-edit"),

    // Form fields
    projectTitle: document.getElementById("project-title"),
    projectCategory: document.getElementById("project-category"),
    projectDescription: document.getElementById("project-description"),
    projectImage: document.getElementById("project-image"),
    projectMockup: document.getElementById("project-mockup"),
    projectTechnologies: document.getElementById("project-technologies"),
    projectLink: document.getElementById("project-link"),
    projectGithub: document.getElementById("project-github"),

    // Previews
    imagePreview: document.getElementById("image-preview"),
    mockupPreview: document.getElementById("mockup-preview"),

    // Portfolio
    projectsGrid: document.getElementById("projects-grid"),
    emptyState: document.getElementById("empty-state"),
    addProjectBtn: document.getElementById("add-project-btn"),

    // Navigation
    backToTop: document.getElementById("back-to-top"),
    mobileBtn: document.querySelector(".navbar__mobile-btn"),
    navbarMenu: document.getElementById("navmenu"),
  };
}

function setupEventListeners() {
  // Admin login button
  if (elements.adminLoginBtn) {
    elements.adminLoginBtn.addEventListener("click", showLoginModal);
  }

  // Modal close
  if (elements.modalClose) {
    elements.modalClose.addEventListener("click", hideLoginModal);
  }

  // Close modal on overlay click
  if (elements.loginModal) {
    elements.loginModal.addEventListener("click", (e) => {
      if (e.target === elements.loginModal) {
        hideLoginModal();
      }
    });
  }

  // Login
  if (elements.loginForm) {
    elements.loginForm.addEventListener("submit", handleLogin);
  }

  if (elements.logoutBtn) {
    elements.logoutBtn.addEventListener("click", handleLogout);
  }

  // Project Form
  if (elements.projectForm) {
    elements.projectForm.addEventListener("submit", handleProjectSubmit);
  }

  if (elements.cancelEdit) {
    elements.cancelEdit.addEventListener("click", cancelEdit);
  }

  // File uploads
  if (elements.projectImage) {
    elements.projectImage.addEventListener("change", (e) =>
      handleFilePreview(e, elements.imagePreview)
    );
  }

  if (elements.projectMockup) {
    elements.projectMockup.addEventListener("change", (e) =>
      handleFilePreview(e, elements.mockupPreview)
    );
  }

  // Add project button
  if (elements.addProjectBtn) {
    elements.addProjectBtn.addEventListener("click", () => {
      resetForm();
      scrollToTop();
    });
  }

  // Escape key to close modal
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && elements.loginModal.classList.contains("active")) {
      hideLoginModal();
    }
  });
}

// Modal functions
function showLoginModal() {
  elements.loginModal.classList.add("active");
  elements.adminPassword.focus();
}

function hideLoginModal() {
  elements.loginModal.classList.remove("active");
  elements.adminPassword.value = "";
}

// Authentication
function handleLogin(e) {
  e.preventDefault();

  const password = elements.adminPassword.value;

  if (password === ADMIN_PASSWORD) {
    isAdmin = true;
    sessionStorage.setItem("portfolio_admin", "true");
    hideLoginModal();
    showAdminInterface();
    showAlert("Acceso concedido", "success");
  } else {
    showAlert("Contraseña incorrecta", "error");
    elements.adminPassword.value = "";
  }
}

function handleLogout() {
  isAdmin = false;
  sessionStorage.removeItem("portfolio_admin");
  hideAdminInterface();
  resetForm();
  showAlert("Sesión cerrada", "success");
}

function checkAdminStatus() {
  const adminStatus = sessionStorage.getItem("portfolio_admin");
  if (adminStatus === "true") {
    isAdmin = true;
    showAdminInterface();
  } else {
    hideAdminInterface();
  }
}

function showAdminInterface() {
  elements.adminPanel.style.display = "block";
  elements.addProjectBtn.style.display = "block";
  elements.adminLoginBtn.classList.add("admin-active");

  // Mostrar controles de admin en proyectos existentes
  document.querySelectorAll(".project-admin").forEach((el) => {
    el.style.display = "flex";
  });
}

function hideAdminInterface() {
  elements.adminPanel.style.display = "none";
  elements.addProjectBtn.style.display = "none";
  elements.adminLoginBtn.classList.remove("admin-active");

  // Ocultar controles de admin
  document.querySelectorAll(".project-admin").forEach((el) => {
    el.style.display = "none";
  });
}

// Project Management
function loadProjects() {
  try {
    const stored = localStorage.getItem(PROJECTS_KEY);
    projects = stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error loading projects:", error);
    projects = [];
  }
}

function saveProjects() {
  try {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  } catch (error) {
    console.error("Error saving projects:", error);
    showAlert("Error al guardar el proyecto", "error");
  }
}

function handleProjectSubmit(e) {
  e.preventDefault();

  if (!isAdmin) {
    showAlert("No tienes permisos para realizar esta acción", "error");
    return;
  }

  // Validación básica
  const title = elements.projectTitle.value.trim();
  const category = elements.projectCategory.value;
  const description = elements.projectDescription.value.trim();
  const technologies = elements.projectTechnologies.value.trim();

  if (!title || !category || !description || !technologies) {
    showAlert("Por favor completa todos los campos obligatorios", "warning");
    return;
  }

  // Crear objeto proyecto
  const projectData = {
    id: editingProjectId || generateId(),
    title,
    category,
    description,
    technologies: technologies.split(",").map((tech) => tech.trim()),
    link: elements.projectLink.value.trim() || null,
    github: elements.projectGithub.value.trim() || null,
    image: null,
    mockup: null,
    createdAt: editingProjectId
      ? projects.find((p) => p.id === editingProjectId)?.createdAt
      : new Date().toISOString(),
  };

  // Manejar imágenes
  Promise.all([
    handleImageUpload(elements.projectImage.files[0]),
    handleImageUpload(elements.projectMockup.files[0]),
  ])
    .then(([imageData, mockupData]) => {
      projectData.image = imageData;
      projectData.mockup = mockupData;

      if (editingProjectId) {
        updateProject(projectData);
      } else {
        addProject(projectData);
      }
    })
    .catch((error) => {
      console.error("Error processing images:", error);
      showAlert("Error al procesar las imágenes", "error");
    });
}

function addProject(projectData) {
  projects.unshift(projectData);
  saveProjects();
  renderProjects();
  resetForm();
  showAlert("Proyecto agregado correctamente", "success");
  scrollToProjects();
}

function updateProject(projectData) {
  const index = projects.findIndex((p) => p.id === projectData.id);
  if (index !== -1) {
    // Mantener imagen existente si no se subió una nueva
    if (!projectData.image && projects[index].image) {
      projectData.image = projects[index].image;
    }
    if (!projectData.mockup && projects[index].mockup) {
      projectData.mockup = projects[index].mockup;
    }

    projects[index] = projectData;
    saveProjects();
    renderProjects();
    resetForm();
    showAlert("Proyecto actualizado correctamente", "success");
    scrollToProjects();
  }
}

function deleteProject(projectId) {
  if (!confirm("¿Estás seguro de que quieres eliminar este proyecto?")) {
    return;
  }

  projects = projects.filter((p) => p.id !== projectId);
  saveProjects();
  renderProjects();
  showAlert("Proyecto eliminado", "success");
}

function editProject(projectId) {
  const project = projects.find((p) => p.id === projectId);
  if (!project) return;

  editingProjectId = projectId;

  // Llenar formulario
  elements.projectTitle.value = project.title;
  elements.projectCategory.value = project.category;
  elements.projectDescription.value = project.description;
  elements.projectTechnologies.value = project.technologies.join(", ");
  elements.projectLink.value = project.link || "";
  elements.projectGithub.value = project.github || "";

  // Mostrar previews existentes
  if (project.image) {
    showImagePreview(elements.imagePreview, project.image);
  }
  if (project.mockup) {
    showImagePreview(elements.mockupPreview, project.mockup);
  }

  scrollToTop();
}

function cancelEdit() {
  resetForm();
}

function resetForm() {
  editingProjectId = null;
  elements.projectForm.reset();
  elements.imagePreview.innerHTML =
    '<div class="mockup-placeholder">Selecciona una imagen del proyecto</div>';
  elements.mockupPreview.innerHTML =
    '<div class="mockup-placeholder">Selecciona un mockup (opcional)</div>';
}

// File handling
function handleFilePreview(event, previewElement) {
  const file = event.target.files[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    showAlert("Por favor selecciona un archivo de imagen válido", "warning");
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    showImagePreview(previewElement, e.target.result);
  };
  reader.readAsDataURL(file);
}

function showImagePreview(element, src) {
  element.innerHTML = `<img src="${src}" alt="Preview" />`;
}

function handleImageUpload(file) {
  return new Promise((resolve) => {
    if (!file) {
      resolve(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.readAsDataURL(file);
  });
}

// Rendering
function renderProjects() {
  if (!elements.projectsGrid) return;

  if (projects.length === 0) {
    elements.projectsGrid.style.display = "none";
    elements.emptyState.style.display = "block";
    return;
  }

  elements.projectsGrid.style.display = "grid";
  elements.emptyState.style.display = "none";

  elements.projectsGrid.innerHTML = projects
    .map(
      (project) => `
        <article class="project-card fade-in">
          <div class="project-content">
            <div class="project-header">
              <h3 class="project-title">${escapeHtml(project.title)}</h3>
              <span class="project-category">${getCategoryName(project.category)}</span>
            </div>
            
            <p class="project-description">${escapeHtml(project.description)}</p>
            
            <div class="project-technologies">
              ${project.technologies
                .map((tech) => `<span class="tech-tag">${escapeHtml(tech)}</span>`)
                .join("")}
            </div>
            
            <div class="project-links">
              ${
                project.link
                  ? `
                <a href="${escapeHtml(project.link)}" class="project-link" target="_blank" rel="noopener">
                  <span>Ver Sitio</span>
                  <i class="fas fa-external-link-alt"></i>
                </a>
              `
                  : ""
              }
              
              ${
                project.github
                  ? `
                <a href="${escapeHtml(project.github)}" class="project-link" target="_blank" rel="noopener">
                  <span>Código</span>
                  <i class="fab fa-github"></i>
                </a>
              `
                  : ""
              }
            </div>
            
            <div class="project-admin" style="display: ${isAdmin ? "flex" : "none"}">
              <button class="btn btn--ghost" onclick="editProject('${project.id}')" style="font-size: 0.9rem; padding: 0.5rem 1rem;">
                <i class="fas fa-edit"></i> Editar
              </button>
              <button class="btn btn--danger" onclick="deleteProject('${project.id}')" style="font-size: 0.9rem; padding: 0.5rem 1rem;">
                <i class="fas fa-trash"></i> Eliminar
              </button>
            </div>
          </div>
          
          <div class="project-mockup">
            ${
              project.mockup
                ? `<img src="${project.mockup}" alt="Mockup de ${escapeHtml(project.title)}" loading="lazy" />`
                : `<div class="mockup-placeholder">
                <i class="fas fa-image" style="font-size: 2rem; opacity: 0.3; margin-bottom: 1rem;"></i>
                <p>Mockup no disponible</p>
              </div>`
            }
          </div>
        </article>
      `
    )
    .join("");
}

// Utilities
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function getCategoryName(category) {
  const categories = {
    webpage: "Web Page",
    landing: "Landing Page",
    ecommerce: "E-commerce",
  };
  return categories[category] || category;
}

function escapeHtml(unsafe) {
  if (typeof unsafe !== "string") return "";
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function showAlert(message, type = "info") {
  // Crear elemento de alerta
  const alertDiv = document.createElement("div");
  alertDiv.className = `alert alert--${type}`;
  alertDiv.textContent = message;

  // Insertar al inicio del contenido principal
  const container = document.querySelector(".container");
  if (container) {
    container.insertBefore(alertDiv, container.firstChild);

    // Eliminar después de 5 segundos
    setTimeout(() => {
      if (alertDiv.parentNode) {
        alertDiv.remove();
      }
    }, 5000);
  }
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function scrollToProjects() {
  const portfolio = document.getElementById("portfolio");
  if (portfolio) {
    portfolio.scrollIntoView({ behavior: "smooth" });
  }
}

// Back to top functionality
function initializeBackToTop() {
  if (!elements.backToTop) return;

  window.addEventListener("scroll", () => {
    const docHeight = document.documentElement.scrollHeight;
    const winHeight = window.innerHeight;
    const scrollPos = window.scrollY + winHeight;

    if (scrollPos >= docHeight - 50) {
      elements.backToTop.classList.add("show");
    } else {
      elements.backToTop.classList.remove("show");
    }
  });

  elements.backToTop.addEventListener("click", (e) => {
    e.preventDefault();
    scrollToTop();
  });
}

// Mobile menu functionality
function initializeMobileMenu() {
  if (!elements.mobileBtn || !elements.navbarMenu) return;

  elements.mobileBtn.addEventListener("click", () => {
    const isOpen = elements.navbarMenu.classList.contains("is-open");
    elements.navbarMenu.classList.toggle("is-open");
    elements.mobileBtn.setAttribute("aria-expanded", !isOpen);
  });

  // Close menu when clicking on links
  elements.navbarMenu.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      elements.navbarMenu.classList.remove("is-open");
      elements.mobileBtn.setAttribute("aria-expanded", "false");
    }
  });
}

// Exponer funciones globalmente para uso en el HTML
window.editProject = editProject;
window.deleteProject = deleteProject;

// Service Worker registration (opcional, para PWA)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then(() => console.log("SW registered"))
      .catch(() => console.log("SW registration failed"));
  });
}

// --- Typewriter genérico (reutilizable)
function startTypewriter(el, phrases, opts = {}){
  if(!el) return;
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const typeDelay = opts.typeDelay ?? 40;
  const holdDelay = opts.holdDelay ?? 1200;
  const delDelay  = opts.delDelay  ?? 18;

  if (prefersReduced){
    el.textContent = phrases[0] ?? "";
    return;
  }

  let p = 0, i = 0, deleting = false;

  function tick(){
    const full = phrases[p] ?? "";
    const current = el.textContent || "";

    if(!deleting){
      el.textContent = full.slice(0, i + 1);
      i++;
      if(i === full.length){
        deleting = true;
        return setTimeout(tick, holdDelay);
      }
      return setTimeout(tick, typeDelay);
    }else{
      el.textContent = current.slice(0, -1);
      i--;
      if(i === 0){
        deleting = false;
        p = (p + 1) % phrases.length;
        return setTimeout(tick, 260);
      }
      return setTimeout(tick, delDelay);
    }
  }

  el.textContent = "";
  tick();
}

document.addEventListener("DOMContentLoaded", () => {
  const el = document.getElementById("typer-portfolio");
  
  // Detectar idioma da página
  function getCurrentLanguage() {
    const path = window.location.pathname;
    const filename = path.split('/').pop() || 'portafolio.html';
    
    if (filename.includes('_pt.html')) {
      return 'pt';
    }
    if (filename.includes('_en.html')) {
      return 'en';
    }
    return 'es'; // padrão é espanhol
  }
  
  // Frases baseadas no idioma
  function getPortfolioTitlePhrases(lang) {
    switch (lang) {
      case 'pt':
        return ["Meu Portfólio", "Projetos Destacados"];
      case 'en':
        return ["My Portfolio", "Featured Projects"];
      case 'es':
      default:
        return ["Mi Portafolio", "Proyectos Destacados"];
    }
  }
  
  const currentLang = getCurrentLanguage();
  const frases = getPortfolioTitlePhrases(currentLang);
  startTypewriter(el, frases);
});

