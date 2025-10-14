# Amanda Cereja — Website Profissional

[![Deploy Status](https://img.shields.io/badge/deploy-GitHub%20Pages-success)](https://amandaceereja.github.io/Pagina-web/)
[![License](https://img.shields.io/badge/license-Educational-blue)](#licença)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.18-brightgreen)](https://nodejs.org/)
[![Playwright](https://img.shields.io/badge/tested%20with-Playwright-45ba4b)](https://playwright.dev/)

> Website profissional moderno, responsivo e multilíngue desenvolvido com tecnologias web nativas. Inclui portfólio, sistema de checklist interativo e páginas de serviços, otimizado para performance e acessibilidade.

## 🌟 Características Principais

### 🌍 **Multilíngue**
- **3 idiomas**: Espanhol (padrão), Português e Inglês
- Sistema de traduções dinâmico com arquivos JSON
- URLs específicas por idioma (`index.html`, `index_pt.html`, `index_en.html`)

### 📱 **Design Responsivo**
- **Mobile-first**: otimizado para dispositivos móveis
- Breakpoints inteligentes: `≤640px` (mobile), `641px-1024px` (tablet), `>1024px` (desktop)
- Tipografia fluida com `clamp()` para escalabilidade perfeita
- Carruseis horizontais tácteis em mobile

### ⚡ **Performance & Acessibilidade**
- **100% Vanilla**: HTML5, CSS3 e JavaScript puro (sem frameworks)
- Respeita `prefers-reduced-motion` para usuários sensíveis a animações
- Navegação por teclado completa com `:focus-visible`
- Contraste otimizado e semântica correta
- Skip links e elementos `sr-only` para leitores de tela

### 🎨 **UI/UX Moderno**
- Header sticky com efeito blur
- Animações typewriter no hero
- Microinterações sutis e feedback visual
- Sistema de cores consistente com CSS custom properties
- Cards com sombras suaves e hover effects

### 🛠️ **Funcionalidades Avançadas**
- **Checklist interativo**: sistema de briefing para clientes
- **Portfólio dinâmico**: galeria de projetos com filtros
- **Formulários integrados**: Formspree para envio sem backend
- **Sistema de orçamento**: calculadora interativa de preços
- **Páginas de processo**: workflow detalhado de desenvolvimento

## 🏗️ Estrutura do Projeto

```
amanda-cereja-website/
├── 📄 Páginas Principais
│   ├── index.html              # Home (Espanhol)
│   ├── index_pt.html           # Home (Português)
│   ├── index_en.html           # Home (Inglês)
│   ├── portafolio.html         # Portfólio
│   ├── servicos.html           # Serviços
│   ├── proceso.html            # Processo
│   ├── presupuesto.html        # Orçamento
│   ├── checklist.html          # Checklist
│   └── privacidad.html         # Privacidade
│
├── 🎨 Estilos CSS
│   ├── styles.css              # Estilos globais e componentes
│   ├── portafolio.css          # Estilos específicos do portfólio
│   ├── servicos.css            # Estilos da página de serviços
│   ├── proceso.css             # Estilos do processo
│   ├── presupuesto.css         # Estilos do orçamento
│   ├── checklist.css           # Estilos do checklist
│   └── privacidad.css          # Estilos da página de privacidade
│
├── ⚙️ JavaScript
│   ├── scripts.js              # Funcionalidades principais
│   ├── portafolio.js           # Lógica do portfólio
│   ├── servicos.js             # Interações dos serviços
│   ├── presupuesto.js          # Calculadora de orçamento
│   ├── checklist.js            # Sistema de checklist
│   ├── language-selector.js    # Seletor de idiomas
│   └── translations/           # Arquivos de tradução
│       ├── pt.js              # Traduções em português
│       └── en.js              # Traduções em inglês
│
├── 🖼️ Recursos
│   ├── img/                    # Imagens e ícones
│   │   ├── 1.png - 12.png     # Galeria de projetos
│   │   ├── servicios1-3.png   # Imagens dos serviços
│   │   ├── simplelogo.png     # Logo
│   │   └── flag-it.svg        # Bandeiras dos idiomas
│
├── 🧪 Testes
│   ├── tests/
│   │   ├── home.spec.js        # Testes da página inicial
│   │   └── privacidad.spec.js  # Testes da página de privacidade
│   └── playwright.config.js    # Configuração do Playwright
│
├── ⚙️ Configuração
│   ├── package.json            # Dependências e scripts
│   ├── eslint.config.mjs       # Configuração do ESLint
│   ├── .prettierrc.json       # Configuração do Prettier
│   ├── .editorconfig          # Configuração do editor
│   └── .github/workflows/     # CI/CD GitHub Actions
│
└── 📚 Documentação
    └── README.md              # Este arquivo
```

## 🚀 Tecnologias Utilizadas

### Frontend
- **HTML5**: Estrutura semântica e acessível
- **CSS3**: Flexbox, Grid, Custom Properties, Media Queries
- **JavaScript ES6+**: Módulos, DOM manipulation, Event handling

### Ferramentas de Desenvolvimento
- **Node.js** `>=18.18`: Runtime para ferramentas de desenvolvimento
- **http-server**: Servidor de desenvolvimento local
- **ESLint**: Linting de código JavaScript
- **Prettier**: Formatação automática de código
- **Playwright**: Testes end-to-end automatizados

### Serviços Externos
- **GitHub Pages**: Hospedagem estática
- **Formspree**: Processamento de formulários
- **Google Analytics**: Análise de tráfego (opcional)

## 🛠️ Instalação e Desenvolvimento

### Pré-requisitos
- Node.js >= 18.18
- npm ou yarn

### Configuração Local

```bash
# 1. Clone o repositório
git clone https://github.com/amandaceereja/amanda-cereja-website.git
cd amanda-cereja-website

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev

# 4. Acesse no navegador
# http://localhost:5173
```

### Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor local na porta 5173

# Qualidade de Código
npm run lint         # Executa ESLint
npm run format       # Formata código com Prettier
npm run check:format # Verifica formatação

# Testes
npm test            # Executa testes Playwright
npm run test:ui     # Interface visual dos testes
```

## 🧪 Testes

O projeto inclui testes automatizados com Playwright:

```bash
# Executar todos os testes
npm test

# Executar testes com interface visual
npm run test:ui

# Executar testes específicos
npx playwright test tests/home.spec.js
```

### Cobertura de Testes
- ✅ Carregamento das páginas principais
- ✅ Navegação entre seções
- ✅ Funcionalidade do checklist
- ✅ Responsividade básica
- ✅ Acessibilidade fundamental

## 🌐 Deploy

### GitHub Pages (Automático)
O site é automaticamente deployado no GitHub Pages a cada push na branch `main`.

**URL de Produção**: https://amandaceereja.github.io/Pagina-web/

### Deploy Manual
```bash
# 1. Build (se necessário)
# Este projeto não requer build, usa arquivos estáticos

# 2. Deploy para qualquer servidor web
# Copie todos os arquivos para o diretório do servidor
```

## 📱 Funcionalidades Detalhadas

### Sistema de Checklist
- ✅ Interface interativa com checkboxes animados
- ✅ Validação de campos obrigatórios
- ✅ Feedback visual em tempo real
- ✅ Acessibilidade completa por teclado

### Portfólio Dinâmico
- 🖼️ Galeria responsiva com lazy loading
- 🔍 Sistema de filtros por categoria
- 📱 Carrossel táctil em dispositivos móveis
- 🎨 Lightbox para visualização ampliada

### Calculadora de Orçamento
- 💰 Cálculo dinâmico baseado em seleções
- 📊 Breakdown detalhado de custos
- 💾 Salvamento local das configurações
- 📧 Envio direto por formulário

### Sistema Multilíngue
- 🌍 Detecção automática do idioma do navegador
- 🔄 Troca dinâmica sem recarregamento
- 📝 Traduções completas de interface
- 🎯 URLs específicas para SEO

## 🎨 Personalização

### Cores e Temas
As cores principais são definidas em CSS custom properties:

```css
:root {
  --primary-color: #2563eb;
  --secondary-color: #64748b;
  --accent-color: #f59e0b;
  --background-color: #ffffff;
  --text-color: #1e293b;
}
```

### Tipografia
```css
:root {
  --font-primary: 'Inter', sans-serif;
  --font-secondary: 'Poppins', sans-serif;
  --font-size-base: clamp(1rem, 2.5vw, 1.125rem);
}
```

### Breakpoints Responsivos
```css
/* Mobile */
@media (max-width: 640px) { }

/* Tablet */
@media (min-width: 641px) and (max-width: 1024px) { }

/* Desktop */
@media (min-width: 1025px) { }
```

## 🔧 Configuração Avançada

### ESLint
```javascript
// eslint.config.mjs
export default [
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: { ...globals.browser }
    }
  }
];
```

### Prettier
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": false,
  "printWidth": 80,
  "tabWidth": 2
}
```

## 📈 Performance

### Métricas de Performance
- ⚡ **First Contentful Paint**: < 1.5s
- 🎯 **Largest Contentful Paint**: < 2.5s
- 📱 **Cumulative Layout Shift**: < 0.1
- 🚀 **Time to Interactive**: < 3s

### Otimizações Implementadas
- 🗜️ Imagens otimizadas e lazy loading
- 📦 CSS e JS minificados em produção
- 🔄 Cache de recursos estáticos
- 📱 Carregamento progressivo em mobile

## 🛡️ Segurança

### Medidas de Segurança
- 🔒 Headers de segurança configurados
- 🚫 Sanitização de inputs de formulário
- 🔐 Validação client-side e server-side
- 📧 Proteção contra spam em formulários

## 🤝 Contribuição

### Como Contribuir
1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Padrões de Código
- Siga as configurações do ESLint e Prettier
- Escreva testes para novas funcionalidades
- Mantenha a documentação atualizada
- Use commits semânticos

## 📄 Licença

Este projeto é destinado para **fins educacionais e de portfólio**. 

### Permissões
- ✅ Visualizar e estudar o código
- ✅ Usar como referência para aprendizado
- ✅ Fazer fork para fins educacionais

### Restrições
- ❌ Uso comercial sem autorização
- ❌ Redistribuição como trabalho próprio
- ❌ Remoção de créditos de autoria

## 👩‍💻 Autora

**Amanda Cereja**
- 🌐 Website: [amandacereja.dev](https://amandaceereja.github.io/Pagina-web/)
- 📧 Email: amandacereja027@outlook.com
- 💼 LinkedIn: [Amanda Cereja](https://linkedin.com/in/amanda-cereja)
- 🐙 GitHub: [@amandaceereja](https://github.com/amandaceereja)

## 🙏 Agradecimentos

- Inspiração de design da comunidade web moderna
- Ícones e recursos visuais da comunidade open source
- Feedback valioso da comunidade de desenvolvedores

---

<div align="center">

**⭐ Se este projeto foi útil para você, considere dar uma estrela!**

[🌟 Star no GitHub](https://github.com/amandaceereja/amanda-cereja-website) • [🐛 Reportar Bug](https://github.com/amandaceereja/amanda-cereja-website/issues) • [💡 Sugerir Feature](https://github.com/amandaceereja/amanda-cereja-website/issues)

</div>

