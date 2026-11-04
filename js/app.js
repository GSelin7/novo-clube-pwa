(function () {
  const STORAGE_KEY = 'novo_clube_state_v9';

  // Estado Global da Aplicação
  let state = loadState();
  let currentTab = 'inicio'; // 'inicio' | 'como-funciona' | 'beneficios' | 'colecao' | 'perfil'
  let profileSubTab = 'resumo'; // 'resumo' | 'notas' | 'beneficios' | 'historico' | 'colecionaveis' | 'duvidas' | 'termos' | 'configuracoes'
  let benefitCategoryFilter = 'Todos';
  let benefitSearchQuery = '';
  let selectedBenefitId = null; // ID do benefício aberto na página de detalhes
  let authMode = 'login'; // 'login' | 'register'
  let activeCameraStream = null;
  let capturedReceiptImage = null;

  function normalizeEmail(email) {
    return (email || '').trim().toLowerCase();
  }

  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.profiles)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Erro ao ler localStorage:', e);
    }
    return JSON.parse(JSON.stringify(window.NOVO_CLUBE_DEFAULT_DATA));
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Erro ao salvar localStorage:', e);
    }
  }

  // Retorna SOMENTE os perfis vinculados ao e-mail da conta logada atualmente
  function getAccountProfiles() {
    const activeEmail = normalizeEmail(state.accountEmail);
    return state.profiles.filter(
      (p) => normalizeEmail(p.email) === activeEmail
    );
  }

  function getActiveProfile() {
    const accProfiles = getAccountProfiles();
    const found = accProfiles.find((p) => p.id === state.activeProfileId);
    if (found) return found;
    if (accProfiles.length > 0) {
      state.activeProfileId = accProfiles[0].id;
      return accProfiles[0];
    }
    return state.profiles[0];
  }

  // =========================================================
  // COMPONENTES SVG REUTILIZÁVEIS (LOGO & ÍCONES)
  // =========================================================
  function renderBrandLogo(sizeClass = '') {
    return `
      <a href="#inicio" class="brand-logo ${sizeClass}" onclick="window.NovoClube.navigate('inicio'); return false;" aria-label="Novo Clube">
        <svg viewBox="0 0 250 42" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 35V7H12.2L21.4 22.8V7H29.4V35H21.2L12 19.2V35H4Z" fill="#002745"/>
          <circle cx="46.5" cy="21" r="14.5" fill="#002745"/>
          <path d="M46.5 11.5L49.4 18.1L56 21L49.4 23.9L46.5 30.5L43.6 23.9L37 21L43.6 18.1L46.5 11.5Z" fill="#ffffff"/>
          <path d="M68.5 35L59.5 7H68.4L73.6 25.4L78.8 7H87.7L78.7 35H68.5Z" fill="#002745"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M102.5 35.5C110.784 35.5 117 29.232 117 21C117 12.768 110.784 6.5 102.5 6.5C94.2157 6.5 88 12.768 88 21C88 29.232 94.2157 35.5 102.5 35.5ZM102.5 27.8C106.09 27.8 108.7 25.02 108.7 21C108.7 16.98 106.09 14.2 102.5 14.2C98.9101 14.2 96.3 16.98 96.3 21C96.3 25.02 98.9101 27.8 102.5 27.8Z" fill="#002745"/>
          <path d="M135.8 35.5C128.4 35.5 123.5 30.1 123.5 21C123.5 11.9 128.4 6.5 135.8 6.5C141.7 6.5 145.8 9.9 146.7 15.6H139C138.4 13.7 137.3 12.8 135.7 12.8C132.9 12.8 131.5 15.6 131.5 21C131.5 26.4 132.9 29.2 135.7 29.2C137.3 29.2 138.4 28.3 139 26.4H146.7C145.8 32.1 141.7 35.5 135.8 35.5Z" fill="#ff1d23"/>
          <path d="M150 35V7H157.8V28.6H168.2V35H150Z" fill="#ff1d23"/>
          <path d="M181.6 35.5C174.5 35.5 170.5 31.3 170.5 23.7V7H178.3V23.5C178.3 27.2 179.5 29.1 181.8 29.1C184.1 29.1 185.3 27.2 185.3 23.5V7H193.1V23.7C193.1 31.3 189.1 35.5 181.6 35.5Z" fill="#ff1d23"/>
          <path d="M197 35V7H208.8C214.6 7 218.1 9.7 218.1 14.1C218.1 17.2 216.5 19.3 213.8 20.1C217.1 20.9 218.9 23.3 218.9 26.9C218.9 32 215.1 35 209 35H197ZM204.6 18.1H207.8C209.6 18.1 210.6 17.1 210.6 15.3C210.6 13.6 209.6 12.6 207.8 12.6H204.6V18.1ZM204.6 29.2H208.1C210.1 29.2 211.2 28.1 211.2 26.2C211.2 24.2 210.1 23.2 208.1 23.2H204.6V29.2Z" fill="#ff1d23"/>
          <path d="M222.5 35V7H241.5V13.2H230.3V17.9H239.8V23.9H230.3V28.8H241.8V35H222.5Z" fill="#ff1d23"/>
        </svg>
      </a>
    `;
  }

  function iconSvg(name) {
    const icons = {
      home: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-9.5z"/></svg>`,
      info: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
      gift: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5" rx="1"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>`,
      star: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
      user: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
      receipt: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1z"/><line x1="8" y1="8" x2="16" y2="8"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="16" x2="12" y2="16"/></svg>`,
      bell: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`,
      chevronRight: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`,
      chevronLeft: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`,
      search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
      check: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
      lock: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
      clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
      settings: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
      help: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
      camera: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>`,
      edit: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`
    };
    return icons[name] || '';
  }

  // =========================================================
  // VALIDAÇÃO SUTIL EM TEMPO REAL (SEM POPUP NATIVO GENÉRICO)
  // =========================================================
  function isValidEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val.trim());
  }

  function setFieldValidationState(inputId, isValid, message, isNeutral = false) {
    const input = document.getElementById(inputId);
    const feedback = document.getElementById(inputId + '-feedback');
    const icon = document.getElementById(inputId + '-icon');
    if (!input) return;

    input.classList.remove('is-valid', 'is-invalid');
    if (feedback) {
      feedback.classList.remove('is-error', 'is-success');
      feedback.textContent = message || '';
    }
    if (icon) {
      icon.classList.remove('visible');
    }

    if (isNeutral) return;

    if (isValid) {
      input.classList.add('is-valid');
      if (feedback && message) feedback.classList.add('is-success');
      if (icon) {
        icon.innerHTML = `<span style="color:#16A34A; font-weight:800;">✓</span>`;
        icon.classList.add('visible');
      }
    } else {
      input.classList.add('is-invalid');
      if (feedback && message) feedback.classList.add('is-error');
      if (icon) {
        icon.innerHTML = `<span style="color:#E11D48; font-weight:800;">•</span>`;
        icon.classList.add('visible');
      }
    }
  }

  function validateFieldLive(fieldType, inputId, forceShowError = false) {
    const input = document.getElementById(inputId);
    if (!input) return false;
    const val = input.value;

    if (fieldType === 'name') {
      const trimmed = val.trim();
      if (!trimmed && !forceShowError) {
        setFieldValidationState(inputId, false, 'Como você gostaria de ser chamado(a) no clube.', true);
        return false;
      }
      if (trimmed.length < 3) {
        setFieldValidationState(inputId, false, 'Digite pelo menos 3 letras para o seu nome.');
        return false;
      }
      setFieldValidationState(inputId, true, 'Nome pronto para o seu perfil.');
      return true;
    }

    if (fieldType === 'email') {
      const trimmed = val.trim();
      if (!trimmed && !forceShowError) {
        setFieldValidationState(inputId, false, 'Usaremos este e-mail para reunir os perfis da família.', true);
        return false;
      }
      if (!isValidEmail(trimmed)) {
        setFieldValidationState(inputId, false, 'Formato sugerido: nome@email.com');
        return false;
      }
      setFieldValidationState(inputId, true, 'E-mail válido.');
      return true;
    }

    if (fieldType === 'password') {
      const fillEl = document.getElementById(inputId + '-meter');
      const len = val.length;
      if (fillEl) {
        const pct = Math.min(100, Math.round((len / 8) * 100));
        fillEl.style.width = pct + '%';
        fillEl.style.backgroundColor =
          len === 0 ? '#E2E8F0' : len < 6 ? '#F59E0B' : '#16A34A';
      }

      if (len === 0 && !forceShowError) {
        setFieldValidationState(inputId, false, 'Crie uma senha com pelo menos 6 caracteres.', true);
        return false;
      }
      if (len < 6) {
        const falta = 6 - len;
        setFieldValidationState(
          inputId,
          false,
          `Mais ${falta} ${falta === 1 ? 'caractere' : 'caracteres'} para completar.`
        );
        return false;
      }
      setFieldValidationState(inputId, true, 'Senha segura definida.');
      return true;
    }

    return true;
  }

  // =========================================================
  // CÁLCULO DE STATUS DOS ASTROS (PONTOS + LIBERAÇÃO MENSAL)
  // =========================================================
  function getAstroStatus(astro, profile) {
    const monthIdx = state.monthsOrder.indexOf(state.currentMonth);
    const releaseIdx = state.monthsOrder.indexOf(astro.releaseMonth);

    if (astro.id === 'servicos') {
      return {
        state: 'conquistado',
        progressPoints: 0,
        targetPoints: 0,
        percent: 100
      };
    }

    if (releaseIdx > monthIdx) {
      return {
        state: 'bloqueado-mes',
        progressPoints: profile.collectionPoints,
        targetPoints: astro.requiredPoints,
        percent: 0
      };
    }

    if (profile.collectionPoints >= astro.requiredPoints) {
      return {
        state: 'conquistado',
        progressPoints: astro.requiredPoints,
        targetPoints: astro.requiredPoints,
        percent: 100
      };
    }

    const astroIdx = state.astros.findIndex((a) => a.id === astro.id);
    const prevAstro = state.astros[astroIdx - 1];
    const prevConquered =
      !prevAstro ||
      prevAstro.id === 'servicos' ||
      profile.collectionPoints >= prevAstro.requiredPoints;

    if (prevConquered) {
      const pct = Math.min(
        100,
        Math.round((profile.collectionPoints / astro.requiredPoints) * 100)
      );
      return {
        state: 'andamento',
        progressPoints: profile.collectionPoints,
        targetPoints: astro.requiredPoints,
        percent: pct
      };
    }

    return {
      state: 'bloqueado',
      progressPoints: profile.collectionPoints,
      targetPoints: astro.requiredPoints,
      percent: 0
    };
  }

  function getNextTargetAstro(profile) {
    for (const astro of state.astros) {
      if (astro.id === 'servicos') continue;
      if (profile.collectionPoints < astro.requiredPoints) {
        return astro;
      }
    }
    return state.astros[state.astros.length - 1];
  }

  // =========================================================
  // RENDERIZAÇÃO INTELIGENTE (SEM PISCAR A TELA INTEIRA)
  // =========================================================
  function renderApp(forceFullShell = false) {
    const root = document.getElementById('app-root');
    if (!root) return;

    if (!state.isAuthenticated) {
      root.innerHTML = renderAuthScreen();
      return;
    }

    if (!state.profileSelected) {
      root.innerHTML = renderProfilesScreen();
      return;
    }

    const profile = getActiveProfile();
    const existingShell = document.getElementById('app-shell');

    // Se o shell principal já existe na tela e não mudamos de perfil, atualizamos apenas as áreas necessárias!
    if (existingShell && !forceFullShell) {
      updateNavigationActiveStates();
      const mobileHeaderSlot = document.getElementById('mobile-header-slot');
      if (mobileHeaderSlot) {
        mobileHeaderSlot.innerHTML = renderMobileHeaderInner(profile);
      }
      const mainViewSlot = document.getElementById('main-view-slot');
      if (mainViewSlot) {
        mainViewSlot.innerHTML = renderCurrentTab(profile);
      }
      return;
    }

    root.innerHTML = `
      <div id="app-shell">
        ${renderDesktopHeader(profile)}
        <header class="mobile-header" id="mobile-header-slot">
          ${renderMobileHeaderInner(profile)}
        </header>
        <main class="main-container" id="main-view-slot">
          ${renderCurrentTab(profile)}
        </main>
        ${renderMobileBottomNav()}
      </div>
    `;
  }

  function updateNavigationActiveStates() {
    document.querySelectorAll('.desktop-nav-link[data-tab]').forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === currentTab);
    });
    document.querySelectorAll('.mobile-nav-item[data-tab]').forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === currentTab);
    });
  }

  // =========================================================
  // TELA 0A: LOGIN E CADASTRO (VALIDAÇÃO SUTIL EM TEMPO REAL)
  // =========================================================
  function renderAuthScreen() {
    const isLogin = authMode === 'login';
    return `
      <section class="auth-screen">
        <div class="auth-container">
          <div class="auth-hero">
            <div>
              <div style="background:#FFFFFF; display:inline-block; padding:8px 16px; border-radius:999px; margin-bottom:22px;">
                ${renderBrandLogo()}
              </div>
              <div class="auth-badge">⭐ Novo Shopping Ribeirão Preto</div>
              <h1>Seu dia vale mais aqui.</h1>
              <p>O clube de benefícios feito para toda a família. Cadastre suas notas fiscais, junte pontos para trocar por ofertas mensais e colecione os 4 Astros!</p>
            </div>
            <div class="auth-mascot-box">
              <img src="assets/images/astros/astro-servicos.png?v=8" alt="Astro Serviços" />
              <div>
                <strong>🎁 1º Astro Grátis no Cadastro!</strong>
                <span>Entre ou crie sua conta familiar e desbloqueie o Astro Serviços automaticamente.</span>
              </div>
            </div>
          </div>

          <div class="auth-form-side">
            <div class="auth-tabs">
              <button type="button" class="auth-tab ${isLogin ? 'active' : ''}" onclick="window.NovoClube.setAuthMode('login')">Entrar na Conta</button>
              <button type="button" class="auth-tab ${!isLogin ? 'active' : ''}" onclick="window.NovoClube.setAuthMode('register')">Criar Conta Grátis</button>
            </div>

            ${
              isLogin
                ? `
              <form novalidate onsubmit="window.NovoClube.handleLogin(event)">
                <div class="form-group">
                  <label for="login-email">E-mail da conta familiar</label>
                  <div class="input-wrap">
                    <input
                      id="login-email"
                      type="email"
                      class="form-input is-valid"
                      value="${state.accountEmail}"
                      placeholder="seu@email.com"
                      oninput="window.NovoClube.validateFieldLive('email', 'login-email')"
                      onblur="window.NovoClube.validateFieldLive('email', 'login-email', true)"
                    />
                    <span id="login-email-icon" class="input-status-icon visible"><span style="color:#16A34A; font-weight:800;">✓</span></span>
                  </div>
                  <div id="login-email-feedback" class="field-feedback">Acesse os perfis vinculados a este e-mail.</div>
                </div>

                <div class="form-group">
                  <label for="login-pass">Senha</label>
                  <div class="input-wrap">
                    <input
                      id="login-pass"
                      type="password"
                      class="form-input is-valid"
                      value="123456"
                      placeholder="••••••••"
                      oninput="window.NovoClube.validateFieldLive('password', 'login-pass')"
                      onblur="window.NovoClube.validateFieldLive('password', 'login-pass', true)"
                    />
                    <span id="login-pass-icon" class="input-status-icon visible"><span style="color:#16A34A; font-weight:800;">✓</span></span>
                  </div>
                  <div id="login-pass-feedback" class="field-feedback"></div>
                </div>

                <button type="submit" class="btn-primary" style="width:100%; margin-top:6px; padding:15px;">
                  Continuar para Seleção de Perfil
                </button>
              </form>
            `
                : `
              <form novalidate onsubmit="window.NovoClube.handleRegister(event)">
                <div class="form-group">
                  <label for="reg-name">Seu nome completo</label>
                  <div class="input-wrap">
                    <input
                      id="reg-name"
                      type="text"
                      class="form-input"
                      placeholder="Ex.: Fernanda Oliveira"
                      autocomplete="name"
                      oninput="window.NovoClube.validateFieldLive('name', 'reg-name')"
                      onblur="window.NovoClube.validateFieldLive('name', 'reg-name', true)"
                    />
                    <span id="reg-name-icon" class="input-status-icon"></span>
                  </div>
                  <div id="reg-name-feedback" class="field-feedback">Como você gostaria de ser chamado(a) no clube.</div>
                </div>

                <div class="form-group">
                  <label for="reg-email">E-mail familiar</label>
                  <div class="input-wrap">
                    <input
                      id="reg-email"
                      type="email"
                      class="form-input"
                      placeholder="familia@email.com"
                      autocomplete="email"
                      oninput="window.NovoClube.validateFieldLive('email', 'reg-email')"
                      onblur="window.NovoClube.validateFieldLive('email', 'reg-email', true)"
                    />
                    <span id="reg-email-icon" class="input-status-icon"></span>
                  </div>
                  <div id="reg-email-feedback" class="field-feedback">Usaremos este e-mail para reunir os perfis da família.</div>
                </div>

                <div class="form-group">
                  <label for="reg-pass">Crie uma senha</label>
                  <div class="input-wrap">
                    <input
                      id="reg-pass"
                      type="password"
                      class="form-input"
                      placeholder="Mínimo de 6 caracteres"
                      autocomplete="new-password"
                      oninput="window.NovoClube.validateFieldLive('password', 'reg-pass')"
                      onblur="window.NovoClube.validateFieldLive('password', 'reg-pass', true)"
                    />
                    <span id="reg-pass-icon" class="input-status-icon"></span>
                  </div>
                  <div class="pass-strength-bar">
                    <div id="reg-pass-meter" class="pass-strength-fill"></div>
                  </div>
                  <div id="reg-pass-feedback" class="field-feedback">Crie uma senha com pelo menos 6 caracteres.</div>
                </div>

                <button type="submit" class="btn-primary" style="width:100%; margin-top:4px; padding:15px;">
                  Criar Conta e Ganhar 1º Astro ⭐
                </button>
              </form>
            `
            }
          </div>
        </div>
      </section>
    `;
  }

  // =========================================================
  // TELA 0B: SELEÇÃO DE PERFIS (ISOLADOS POR CONTA DE E-MAIL)
  // =========================================================
  function renderProfilesScreen() {
    const accountProfiles = getAccountProfiles();

    const cardsHtml = accountProfiles
      .map(
        (p) => `
        <button type="button" class="profile-item" onclick="window.NovoClube.selectProfile('${p.id}')">
          <div class="profile-avatar-lg" style="background:${p.avatarBg}; color:${p.avatarColor};">
            ${p.initials}
          </div>
          <div class="profile-item-name">${p.shortName}</div>
          <div class="profile-item-role">${p.role}</div>
          <div class="profile-item-pts">${p.benefitBalance} pts saldo</div>
        </button>
      `
      )
      .join('');

    return `
      <section class="profiles-screen">
        <div class="profiles-card">
          ${renderBrandLogo('brand-logo--lg')}
          <h1>Quem está acessando?</h1>
          <p>Conta familiar <strong>${state.accountEmail}</strong> • Cada pessoa tem seus próprios pontos e coleção de Astros.</p>

          <div class="profiles-grid">
            ${cardsHtml}
            <button type="button" class="profile-item" onclick="window.NovoClube.openNewProfileModal()">
              <div class="profile-avatar-lg" style="background:#F1F5F9; color:#002745; border:2px dashed #94A3B8;">
                +
              </div>
              <div class="profile-item-name">Novo perfil</div>
              <div class="profile-item-role">Família</div>
              <div class="profile-item-pts" style="background:#DCFCE7; color:#15803D;">Ganha 1º Astro</div>
            </button>
          </div>

          <div style="display:flex; justify-content:center; gap:12px; flex-wrap:wrap;">
            <button type="button" class="btn-secondary" onclick="window.NovoClube.logout()">
              Trocar de conta (${state.accountEmail})
            </button>
          </div>
        </div>
      </section>
    `;
  }

  // =========================================================
  // CABEÇALHOS E BARRA INFERIOR
  // =========================================================
  function renderDesktopHeader(profile) {
    const navItems = [
      { id: 'inicio', label: 'Início' },
      { id: 'como-funciona', label: 'Como funciona' },
      { id: 'beneficios', label: 'Benefícios' },
      { id: 'colecao', label: 'Coleção' },
      { id: 'perfil', label: 'Perfil' }
    ];

    return `
      <header class="desktop-header">
        <div class="desktop-header-inner">
          ${renderBrandLogo()}
          <nav class="desktop-nav" aria-label="Menu Principal">
            ${navItems
              .map(
                (item) => `
              <button type="button" data-tab="${item.id}" class="desktop-nav-link ${currentTab === item.id ? 'active' : ''}" onclick="window.NovoClube.navigate('${item.id}')">
                ${item.label}
              </button>
            `
              )
              .join('')}
          </nav>
          <div class="header-right">
            <button type="button" id="desktop-avatar-btn" class="avatar-circle" style="background:${profile.avatarBg}; color:${profile.avatarColor};" onclick="window.NovoClube.openSwitchProfileModal()" title="Trocar perfil (${profile.name})">
              ${profile.initials}
            </button>
          </div>
        </div>
      </header>
    `;
  }

  function renderMobileHeaderInner(profile) {
    if (currentTab === 'inicio') {
      return `
        ${renderBrandLogo('brand-logo--sm')}
        <div style="display:flex; align-items:center; gap:10px;">
          <button type="button" class="mobile-back-btn" onclick="window.NovoClube.openNotificationsModal()" aria-label="Notificações">
            ${iconSvg('bell')}
          </button>
          <button type="button" class="avatar-circle" style="width:34px; height:34px; font-size:0.78rem; background:${profile.avatarBg}; color:${profile.avatarColor};" onclick="window.NovoClube.openSwitchProfileModal()">
            ${profile.initials}
          </button>
        </div>
      `;
    }

    return `
      <div class="mobile-header-sub">
        <button type="button" class="mobile-back-btn" onclick="window.NovoClube.navigate('inicio')" aria-label="Voltar ao Início">
          ${iconSvg('chevronLeft')}
        </button>
        <div style="text-align:center;">
          ${renderBrandLogo('brand-logo--sm')}
        </div>
        <button type="button" class="avatar-circle" style="width:32px; height:32px; font-size:0.75rem; background:${profile.avatarBg}; color:${profile.avatarColor};" onclick="window.NovoClube.openSwitchProfileModal()">
          ${profile.initials}
        </button>
      </div>
    `;
  }

  function renderMobileBottomNav() {
    const items = [
      { id: 'inicio', label: 'Início', icon: 'home' },
      { id: 'como-funciona', label: 'Como funciona', icon: 'info' },
      { id: 'beneficios', label: 'Benefícios', icon: 'gift' },
      { id: 'colecao', label: 'Coleção', icon: 'star' },
      { id: 'perfil', label: 'Perfil', icon: 'user' }
    ];

    return `
      <nav class="mobile-bottom-nav" aria-label="Navegação Mobile">
        ${items
          .map(
            (it) => `
          <button type="button" data-tab="${it.id}" class="mobile-nav-item ${currentTab === it.id ? 'active' : ''}" onclick="window.NovoClube.navigate('${it.id}')">
            ${iconSvg(it.icon)}
            <span>${it.label}</span>
          </button>
        `
          )
          .join('')}
      </nav>
    `;
  }

  function renderCurrentTab(profile) {
    switch (currentTab) {
      case 'inicio':
        return renderHomeTab(profile);
      case 'como-funciona':
        return renderComoFuncionaTab(profile);
      case 'beneficios':
        return renderBeneficiosTab(profile);
      case 'colecao':
        return renderColecaoTab(profile);
      case 'perfil':
        return renderPerfilTab(profile);
      default:
        return renderHomeTab(profile);
    }
  }

  // =========================================================
  // 1. PÁGINA: INÍCIO
  // =========================================================
  function renderHomeTab(profile) {
    const nextAstro = getNextTargetAstro(profile);
    const targetPts = nextAstro.requiredPoints || 500;
    const currentColPts = profile.collectionPoints;
    const remainingPts = Math.max(0, targetPts - currentColPts);
    const colPercent = Math.min(100, Math.round((currentColPts / targetPts) * 100));
    const balPercent = Math.min(100, Math.round((profile.benefitBalance / 500) * 100));

    return `
      <section class="page-section">
        <div class="home-desktop-grid">
          <div class="home-hero-top-mobile">
            <div>
              <p class="home-greeting">Olá, ${profile.shortName}!</p>
              <h1 class="home-title">Seu dia<br/>vale mais aqui.</h1>
              <p class="home-subtitle">Compras, serviços, lazer e muitas recompensas no Novo.</p>
              <div class="home-cta-row">
                <button type="button" class="btn-primary" onclick="window.NovoClube.openInvoiceModal()">
                  Cadastrar nota fiscal
                </button>
                <button type="button" class="btn-secondary" onclick="window.NovoClube.navigate('beneficios')">
                  Ver benefícios
                </button>
              </div>
            </div>
          </div>

          <div class="home-mascot-center">
            <img src="assets/images/astros/astro-hero-desktop.png?v=8" alt="Astro Serviços — Mascote Novo Clube" />
          </div>

          <div class="home-cards-col">
            <div class="status-card" onclick="window.NovoClube.openPointsTimelineModal()">
              <div class="status-card-header">
                <span class="status-card-title">Minha coleção</span>
                <span style="color:var(--text-muted);">${iconSvg('chevronRight')}</span>
              </div>
              <div class="status-card-body">
                <img class="status-card-icon-astro" src="${nextAstro.image3d}" alt="${nextAstro.name}" />
                <div class="status-card-info">
                  <div class="status-points-big">
                    ${currentColPts} <span>/ ${targetPts} pontos</span>
                  </div>
                  <div class="progress-track progress-track--red">
                    <div class="progress-fill progress-fill--red" style="width: ${colPercent}%;"></div>
                  </div>
                  <p class="status-card-caption">
                    ${
                      remainingPts > 0
                        ? `Faltam ${remainingPts} pontos para o próximo Astro.`
                        : `Parabéns! Você completou a meta do ${nextAstro.name}!`
                    }
                  </p>
                </div>
              </div>
            </div>

            <div class="status-card" onclick="window.NovoClube.navigate('beneficios')">
              <div class="status-card-header">
                <span class="status-card-title">Saldo de benefícios</span>
                <span style="color:var(--text-muted);">${iconSvg('chevronRight')}</span>
              </div>
              <div class="status-card-body">
                <div class="status-card-icon-gift">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5" rx="1"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>
                </div>
                <div class="status-card-info">
                  <div class="status-points-big">
                    ${profile.benefitBalance} <span>pontos</span>
                  </div>
                  <div class="progress-track progress-track--blue">
                    <div class="progress-fill progress-fill--blue" style="width: ${balPercent}%;"></div>
                  </div>
                  <p class="status-card-caption">Use seus pontos para resgatar ofertas e experiências.</p>
                </div>
              </div>
            </div>
          </div>

          <div class="home-mobile-actions">
            <button type="button" class="home-mobile-action-card" onclick="window.NovoClube.openInvoiceModal()">
              ${iconSvg('receipt')}
              <span>Cadastrar<br/>nota fiscal</span>
            </button>
            <button type="button" class="home-mobile-action-card" onclick="window.NovoClube.navigate('beneficios')">
              ${iconSvg('gift')}
              <span>Ver<br/>benefícios</span>
            </button>
          </div>
        </div>
      </section>
    `;
  }

  // =========================================================
  // 2. PÁGINA: COMO FUNCIONA
  // =========================================================
  function renderComoFuncionaTab() {
    return `
      <section class="page-section">
        <div class="how-layout">
          <div>
            <p class="section-eyebrow">COMO FUNCIONA</p>
            <h1 class="section-heading">Três passos para viver o melhor do Novo Clube.</h1>
            <p class="section-desc" style="margin-bottom:24px;">
              É simples, rápido e cheio de recompensas. Cadastre suas notas, acumule pontos e conquiste seus Astros.
            </p>
            <div style="display:flex; flex-wrap:wrap; gap:12px;">
              <button type="button" class="btn-primary" onclick="window.NovoClube.openInvoiceModal()">
                ${iconSvg('camera')} Cadastrar nota fiscal
              </button>
              <button type="button" class="btn-secondary" onclick="window.NovoClube.navigate('colecao')">
                Ver os 4 Astros
              </button>
            </div>
          </div>

          <div class="how-steps-grid">
            <div class="step-card">
              <div class="step-left-col">
                <span class="step-number step-number--red">1</span>
                <div class="step-icon">${iconSvg('receipt')}</div>
              </div>
              <div>
                <h3>Cadastre suas notas</h3>
                <p>A cada R$ 1 em compras participantes, você ganha 1 ponto.</p>
              </div>
            </div>

            <div class="step-card">
              <div class="step-left-col">
                <span class="step-number step-number--blue">2</span>
                <div class="step-icon">${iconSvg('star')}</div>
              </div>
              <div>
                <h3>Conquiste os colecionáveis</h3>
                <p>Acumule pontos e complete os desafios para desbloquear os quatro Astros.</p>
              </div>
            </div>

            <div class="step-card">
              <div class="step-left-col">
                <span class="step-number step-number--red">3</span>
                <div class="step-icon">${iconSvg('gift')}</div>
              </div>
              <div>
                <h3>Aproveite os benefícios</h3>
                <p>Troque seu saldo por descontos, ofertas e experiências exclusivas.</p>
              </div>
            </div>
          </div>
        </div>

        <div class="dual-points-explainer">
          <div class="dual-box dual-box--red">
            <img src="assets/images/astros/astro-lazer.png?v=8" alt="Coleção" style="width:56px; height:56px; object-fit:contain;" />
            <div>
              <strong style="color:var(--red); font-size:0.95rem; display:block; margin-bottom:4px;">
                1. Pontos de Coleção (Barra Vermelha • Nunca diminui!)
              </strong>
              <p style="font-size:0.84rem; color:var(--text-main);">
                Toda nota fiscal cadastrada soma pontos na sua jornada dos Astros. Mesmo quando você resgata benefícios, sua pontuação de coleção continua subindo até conquistar os 4 mascotes!
              </p>
            </div>
          </div>

          <div class="dual-box dual-box--blue">
            <div class="status-card-icon-gift" style="width:50px; height:50px; background:#fff;">
              ${iconSvg('gift')}
            </div>
            <div>
              <strong style="color:var(--blue); font-size:0.95rem; display:block; margin-bottom:4px;">
                2. Saldo de Benefícios (Barra Azul • Sobe e desce)
              </strong>
              <p style="font-size:0.84rem; color:var(--text-main);">
                Os mesmos pontos da sua nota também entram no seu Saldo de Benefícios para você trocar por ingressos de cinema, cafés, hambúrgueres, sorvetes e descontos nas lojas do Novo Shopping.
              </p>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // =========================================================
  // 3. PÁGINA: BENEFÍCIOS (LISTAGEM + PÁGINA INTERNA DE DETALHES)
  // =========================================================
  function renderBenefitsGridItems() {
    const filteredBenefits = state.benefits.filter((b) => {
      if (b.month !== state.currentMonth) return false;
      if (benefitCategoryFilter !== 'Todos' && b.category !== benefitCategoryFilter) {
        return false;
      }
      if (
        benefitSearchQuery.trim() !== '' &&
        !b.title.toLowerCase().includes(benefitSearchQuery.toLowerCase()) &&
        !b.partner.toLowerCase().includes(benefitSearchQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    });

    if (filteredBenefits.length === 0) {
      return `
        <div class="subtle-update" style="text-align:center; padding:48px 20px; color:var(--text-muted);">
          Nenhum benefício encontrado para <strong>"${benefitSearchQuery}"</strong> em ${state.currentMonth}.
        </div>
      `;
    }

    return `
      <div class="benefits-grid subtle-update">
        ${filteredBenefits
          .map(
            (b) => `
          <article class="benefit-card" onclick="window.NovoClube.openBenefitDetail('${b.id}')" role="button" tabindex="0" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();window.NovoClube.openBenefitDetail('${b.id}');}">
            <div class="benefit-img-wrap">
              <img src="${b.image}" alt="${b.title}" loading="lazy" />
            </div>
            <div class="benefit-content">
              <div class="benefit-text-col">
                <h3 class="benefit-title">${b.title}</h3>
                <p class="benefit-points">${b.points} pontos</p>
              </div>
              <span class="benefit-chevron" aria-hidden="true">
                ${iconSvg('chevronRight')}
              </span>
            </div>
          </article>
        `
          )
          .join('')}
      </div>
    `;
  }

  function renderBenefitDetailPage(benefit, profile) {
    const canAfford = profile.benefitBalance >= benefit.points;
    const balanceAfter = Math.max(0, profile.benefitBalance - benefit.points);
    const rulesList =
      Array.isArray(benefit.rules) && benefit.rules.length > 0
        ? benefit.rules
        : [
            `Apresente o código de resgate diretamente na loja parceira (${benefit.partner}).`,
            `O valor de ${benefit.points} pontos é descontado apenas do seu Saldo de Benefícios (barra azul).`,
            `Seus Pontos de Coleção (${profile.collectionPoints} pts) permanecem intactos na jornada dos Astros!`
          ];

    return `
      <section class="page-section">
        <div class="benefit-detail-page subtle-update">
          <div class="benefit-back-bar">
            <button type="button" class="benefit-back-link" onclick="window.NovoClube.closeBenefitDetail()">
              ${iconSvg('chevronLeft')} Voltar para Benefícios de ${state.currentMonth}
            </button>
            <div style="font-size:0.86rem; color:var(--navy);">
              Seu saldo atual: <strong style="color:var(--blue);">${profile.benefitBalance} pontos</strong>
            </div>
          </div>

          <div class="benefit-detail-grid">
            <div>
              <div class="benefit-detail-img-box">
                <img src="${benefit.image}" alt="${benefit.title}" />
              </div>
              <div style="margin-top:14px; padding:14px 18px; background:var(--red-bg); border:1px solid #FECDD3; border-radius:16px; display:flex; align-items:center; gap:12px;">
                <img src="assets/images/astros/astro-servicos.png?v=8" alt="Astro" style="width:48px; height:48px; object-fit:contain;" />
                <div style="font-size:0.8rem; color:var(--navy); line-height:1.4;">
                  <strong style="color:var(--red); display:block;">Sua Coleção Astro não diminui!</strong>
                  Ao resgatar este benefício, seus <strong>${profile.collectionPoints} pontos</strong> de coleção continuam valendo para desbloquear os 4 Astros.
                </div>
              </div>
            </div>

            <div>
              <div class="benefit-detail-meta">
                <span class="benefit-tag benefit-tag--cat">${benefit.category}</span>
                <span class="benefit-tag benefit-tag--month">Oferta de ${benefit.month}</span>
              </div>

              <h1 class="benefit-detail-title">${benefit.title}</h1>
              <p class="benefit-detail-partner">
                📍 ${benefit.partner} ${benefit.location ? `• ${benefit.location}` : ''}
              </p>

              <div style="display:inline-flex; align-items:baseline; gap:8px; background:var(--blue-bg); color:var(--blue); padding:10px 20px; border-radius:16px; margin-bottom:18px;">
                <strong style="font-size:1.65rem; font-weight:800;">${benefit.points} pontos</strong>
                <span style="font-size:0.82rem; font-weight:600;">do Saldo de Benefícios</span>
              </div>

              <h4 style="font-size:0.92rem; font-weight:800; color:var(--navy); margin-bottom:6px;">Sobre este benefício</h4>
              <p class="benefit-detail-desc">${benefit.description}</p>

              <div class="benefit-rules-box">
                <h4>Como funciona e regras de uso</h4>
                <ul class="benefit-rules-list">
                  ${rulesList.map((r) => `<li><span>${r}</span></li>`).join('')}
                  ${benefit.validity ? `<li><span><strong>Validade:</strong> ${benefit.validity}</span></li>` : ''}
                </ul>
              </div>

              <div class="benefit-balance-calc">
                <div>
                  <span>Seu saldo atual</span>
                  <strong>${profile.benefitBalance} pts</strong>
                </div>
                <div>
                  <span>Valor do resgate</span>
                  <strong style="color:var(--red);">− ${benefit.points} pts</strong>
                </div>
                <div>
                  <span>Saldo após resgate</span>
                  <strong style="color:${canAfford ? 'var(--green)' : 'var(--text-muted)'};">${canAfford ? `${balanceAfter} pts` : 'Insuficiente'}</strong>
                </div>
              </div>

              ${
                canAfford
                  ? `
                <button type="button" class="btn-primary" style="width:100%; padding:16px; font-size:1rem;" onclick="window.NovoClube.redeemBenefit('${benefit.id}')">
                  Confirmar e Resgatar por ${benefit.points} pontos
                </button>
              `
                  : `
                <div style="background:#FFF1F2; border:1px solid #FECDD3; color:#BE123C; padding:12px 16px; border-radius:14px; font-size:0.85rem; font-weight:600; margin-bottom:12px;">
                  Faltam <strong>${benefit.points - profile.benefitBalance} pontos</strong> no seu Saldo de Benefícios para resgatar esta oferta.
                </div>
                <button type="button" class="btn-primary" style="width:100%; padding:15px;" onclick="window.NovoClube.openInvoiceModal()">
                  ${iconSvg('camera')} Cadastrar Nota Fiscal para Ganhar Pontos
                </button>
              `
              }
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function renderBeneficiosTab(profile) {
    if (selectedBenefitId) {
      const selectedBen = state.benefits.find((b) => b.id === selectedBenefitId);
      if (selectedBen) {
        return renderBenefitDetailPage(selectedBen, profile);
      }
      selectedBenefitId = null;
    }

    const categories = ['Todos', 'Alimentação', 'Lazer', 'Serviços'];

    return `
      <section class="page-section">
        <div class="benefits-layout">
          <div>
            <p class="section-eyebrow">BENEFÍCIOS</p>
            <h1 class="section-heading">Ofertas exclusivas para o seu mês.</h1>
            <p class="section-desc">
              Clique em um benefício para ver os detalhes da oferta e resgatar com seus pontos no Novo Shopping.
            </p>

            <div class="month-pills" role="tablist" aria-label="Mês dos benefícios">
              ${state.monthsOrder
                .map(
                  (m) => `
                <button type="button" data-month-pill="${m}" class="month-pill ${state.currentMonth === m ? 'active' : ''}" onclick="window.NovoClube.setMonth('${m}')">
                  ${m}
                </button>
              `
                )
                .join('')}
            </div>

            <div style="margin-top:22px; padding:14px 18px; background:var(--blue-bg); border-radius:16px; display:inline-flex; align-items:center; gap:10px;">
              <span style="font-size:0.84rem; color:var(--navy);">Seu saldo disponível:</span>
              <strong id="benefits-balance-Number" style="font-size:1.05rem; color:var(--blue);">${profile.benefitBalance} pontos</strong>
            </div>
          </div>

          <div>
            <div class="benefits-toolbar">
              <div class="category-pills">
                ${categories
                  .map(
                    (cat) => `
                  <button type="button" data-cat-pill="${cat}" class="cat-pill ${benefitCategoryFilter === cat ? 'active' : ''}" onclick="window.NovoClube.setBenefitCategory('${cat}')">
                    ${cat}
                  </button>
                `
                  )
                  .join('')}
              </div>

              <div class="search-box">
                ${iconSvg('search')}
                <input
                  id="benefit-search-input"
                  type="search"
                  placeholder="Buscar benefícios..."
                  value="${benefitSearchQuery}"
                  oninput="window.NovoClube.setBenefitSearch(this.value)"
                />
              </div>
            </div>

            <div id="benefits-grid-slot">
              ${renderBenefitsGridItems()}
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // =========================================================
  // 4. PÁGINA: COLEÇÃO + LINHA DO TEMPO DE PONTUAÇÃO (0, 500, 1000, 1500)
  // =========================================================
  function renderPointsTimelineComponent(profile, isModal = false) {
    const pts = profile.collectionPoints;
    const maxPts = 1500;
    const fillPct = Math.min(100, Math.max(0, (pts / maxPts) * 100));
    const nextAstro = getNextTargetAstro(profile);
    const faltaNext = Math.max(0, nextAstro.requiredPoints - pts);

    // 4 marcos igualmente divididos: 0% (0 pts), 33.33% (500 pts), 66.66% (1000 pts), 100% (1500 pts)
    const milestones = [
      { astro: state.astros[0], points: 0, label: '0', sub: 'Cadastro', pos: 0 },
      { astro: state.astros[1], points: 500, label: '500', sub: 'pontos', pos: 33.333 },
      { astro: state.astros[2], points: 1000, label: '1.000', sub: 'pontos', pos: 66.666 },
      { astro: state.astros[3], points: 1500, label: '1.500', sub: 'pontos', pos: 100 }
    ];

    const mascotsHtml = milestones
      .map((m) => {
        const reached = pts >= m.points;
        const isNext = !reached && nextAstro.id === m.astro.id;
        const stateClass = reached ? 'is-reached' : isNext ? 'is-next' : 'is-locked';
        const tagText = reached ? '✓ Conquistado' : isNext ? `Faltam ${faltaNext} pts` : m.astro.shortName || m.astro.category;

        return `
          <div class="timeline-mascot-node ${stateClass}" style="left:${m.pos}%;" onclick="window.NovoClube.openAstroDetailModal('${m.astro.id}')" title="${m.astro.name}">
            <span class="timeline-mascot-tag">${tagText}</span>
            <img src="${m.astro.image3d}" alt="${m.astro.name}" />
          </div>
        `;
      })
      .join('');

    const dotsHtml = milestones
      .map((m) => {
        const reached = pts >= m.points;
        const isNext = !reached && nextAstro.id === m.astro.id;
        const stateClass = reached ? 'is-reached' : isNext ? 'is-next' : '';
        const innerSymbol = reached ? '★' : 'P';

        return `
          <div class="timeline-dot ${stateClass}" style="left:${m.pos}%;" onclick="window.NovoClube.openAstroDetailModal('${m.astro.id}')" title="${m.astro.name} (${m.label} pontos)">
            ${innerSymbol}
          </div>
        `;
      })
      .join('');

    const labelsHtml = milestones
      .map((m) => {
        const reached = pts >= m.points;
        const isNext = !reached && nextAstro.id === m.astro.id;
        const stateClass = reached ? 'is-reached' : isNext ? 'is-next' : '';

        return `
          <div class="timeline-label-node ${stateClass}" style="left:${m.pos}%;">
            <span class="timeline-pts-num">${m.label}</span>
            <span class="timeline-pts-sub">${m.sub}</span>
          </div>
        `;
      })
      .join('');

    return `
      <div class="points-timeline-card" style="${isModal ? 'margin-bottom:0; box-shadow:none; border:none; padding:6px 4px;' : ''}">
        <div class="points-timeline-top">
          <div>
            <p class="section-eyebrow" style="margin-bottom:4px;">SISTEMA DE PONTUAÇÃO DA COLEÇÃO</p>
            <h3>Sua Linha do Tempo Astro</h3>
            <p>Você possui <strong style="color:var(--navy);">${pts} pontos acumulados</strong> de 1.500 pontos da jornada.</p>
            <div class="points-timeline-current-pill">
              ⭐ ${faltaNext > 0 ? `Faltam ${faltaNext} pontos para desbloquear o ${nextAstro.name}` : 'Parabéns! Você atingiu a pontuação máxima de 1.500 pontos!'}
            </div>
          </div>
          <button type="button" class="btn-primary" onclick="window.NovoClube.closeModal(); window.NovoClube.openInvoiceModal();">
            + Cadastrar nota
          </button>
        </div>

        <div class="timeline-wrapper">
          <div class="timeline-mascots-row">
            ${mascotsHtml}
          </div>

          <div class="timeline-track-area">
            <div class="timeline-line-bg">
              <div class="timeline-line-fill" style="width:${fillPct}%;"></div>
            </div>
            ${dotsHtml}
          </div>

          <div class="timeline-labels-row">
            ${labelsHtml}
          </div>
        </div>
      </div>
    `;
  }

  function openPointsTimelineModal() {
    const profile = getActiveProfile();
    const modalRoot = document.getElementById('modal-root');
    if (!modalRoot) return;

    modalRoot.innerHTML = `
      <div class="modal-backdrop" onclick="if(event.target===this) window.NovoClube.closeModal()">
        <div class="modal-card" style="max-width:680px; padding:28px 26px;">
          <button type="button" class="modal-close" onclick="window.NovoClube.closeModal()" aria-label="Fechar">✕</button>
          ${renderPointsTimelineComponent(profile, true)}
          <div style="display:flex; justify-content:space-between; align-items:center; gap:12px; margin-top:18px; padding-top:16px; border-top:1px solid var(--border-color); flex-wrap:wrap;">
            <span style="font-size:0.8rem; color:var(--text-muted);">
              Toque em qualquer bonequinho na linha para ver a pelúcia física no shopping.
            </span>
            <button type="button" class="btn-secondary" style="padding:9px 18px; font-size:0.84rem;" onclick="window.NovoClube.closeModal(); window.NovoClube.navigate('colecao');">
              Ver página da Coleção &gt;
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function renderAstrosGridItems(profile) {
    return state.astros
      .map((astro) => {
        const st = getAstroStatus(astro, profile);

        let statusMiddleHtml = '';
        let badgeHtml = '';

        if (st.state === 'conquistado') {
          statusMiddleHtml = `<p class="astro-req-green">${astro.id === 'servicos' ? 'Ação cadastrada' : `${astro.requiredPoints} pontos atingidos`}</p>`;
          badgeHtml = `
            <div class="astro-badge astro-badge--conquistado">
              ${iconSvg('check')} Conquistado
            </div>
          `;
        } else if (st.state === 'andamento') {
          statusMiddleHtml = `
            <p class="astro-req-progress">${st.progressPoints} <span>/ ${st.targetPoints} pontos</span></p>
            <div class="progress-track progress-track--red">
              <div class="progress-fill progress-fill--red" style="width:${st.percent}%;"></div>
            </div>
          `;
          badgeHtml = `
            <div class="astro-badge astro-badge--andamento">
              Em andamento
            </div>
          `;
        } else if (st.state === 'bloqueado-mes') {
          statusMiddleHtml = `<p class="astro-req-locked">${astro.requirementLabel} • Libera em ${astro.releaseMonth}</p>`;
          badgeHtml = `
            <div class="astro-badge astro-badge--bloqueado">
              ${iconSvg('lock')} Bloqueado
            </div>
          `;
        } else {
          statusMiddleHtml = `<p class="astro-req-locked">${astro.requirementLabel}</p>`;
          badgeHtml = `
            <div class="astro-badge astro-badge--bloqueado">
              ${iconSvg('lock')} Bloqueado
            </div>
          `;
        }

        return `
          <article class="astro-card subtle-update" onclick="window.NovoClube.openAstroDetailModal('${astro.id}')" title="Clique para ver a versão física da pelúcia no Novo Shopping">
            <img class="astro-card-img" src="${astro.image3d}" alt="${astro.name}" />
            <div class="astro-card-body" style="width:100%;">
              <h3 class="astro-card-title">${astro.name}</h3>
              ${statusMiddleHtml}
              ${badgeHtml}
            </div>
          </article>
        `;
      })
      .join('');
  }

  function renderColecaoTab(profile) {
    return `
      <section class="page-section">
        ${renderPointsTimelineComponent(profile, false)}
        <div class="collection-layout">
          <div>
            <p class="section-eyebrow">MINHA COLEÇÃO</p>
            <h1 class="section-heading">Complete os quatro Astros e viva o Novo por inteiro.</h1>
            <p class="section-desc" style="margin-bottom:20px;">
              Acompanhe seu progresso e desbloqueie todos os colecionáveis. Clique em um Astro para conhecer sua versão de pelúcia física no Novo Shopping!
            </p>
            <div style="font-size:0.82rem; color:var(--text-muted); margin-bottom:8px; font-weight:700;">
              Mês da campanha (liberação mensal):
            </div>
            <div class="month-pills" style="margin-top:0;">
              ${state.monthsOrder
                .map(
                  (m) => `
                <button type="button" data-month-pill="${m}" class="month-pill ${state.currentMonth === m ? 'active' : ''}" onclick="window.NovoClube.setMonth('${m}')">
                  ${m}
                </button>
              `
                )
                .join('')}
            </div>
          </div>

          <div class="astros-grid" id="astros-grid-slot">
            ${renderAstrosGridItems(profile)}
          </div>
        </div>
      </section>
    `;
  }

  // =========================================================
  // 5. PÁGINA: PERFIL (SUB-ABAS SUAVES SEM ATUALIZAR A TELA TODA)
  // =========================================================
  function renderPerfilTab(profile) {
    const menuItems = [
      { id: 'resumo', label: 'Resumo', icon: 'gift' },
      { id: 'notas', label: 'Minhas notas fiscais', icon: 'receipt' },
      { id: 'beneficios', label: 'Meus benefícios', icon: 'gift' },
      { id: 'historico', label: 'Meu histórico de pontos', icon: 'clock' },
      { id: 'colecionaveis', label: 'Meus colecionáveis', icon: 'star' },
      { id: 'duvidas', label: 'Dúvidas frequentes', icon: 'help' },
      { id: 'termos', label: 'Termos e condições', icon: 'receipt' },
      { id: 'configuracoes', label: 'Configurações', icon: 'settings' }
    ];

    return `
      <section class="page-section">
        <div class="profile-layout">
          <aside class="profile-sidebar">
            <div class="profile-user-box">
              <div class="avatar-circle" style="width:48px; height:48px; font-size:1.05rem; background:${profile.avatarBg}; color:${profile.avatarColor};">
                ${profile.initials}
              </div>
              <div style="flex:1; min-width:0;">
                <strong>${profile.name}</strong>
                <span>${profile.email}</span>
              </div>
            </div>

            <div class="profile-menu-list">
              ${menuItems
                .map(
                  (it) => `
                <button type="button" data-profile-sub="${it.id}" class="profile-menu-btn ${profileSubTab === it.id ? 'active' : ''}" onclick="window.NovoClube.setProfileSubTab('${it.id}')">
                  ${iconSvg(it.icon)}
                  <span>${it.label}</span>
                </button>
              `
                )
                .join('')}
            </div>
          </aside>

          <div class="profile-main">
            <div class="profile-main-header">
              <div>
                <h2>Meu perfil</h2>
                <p>Acompanhe seus pontos, resgates e conquistas.</p>
              </div>
              <div class="profile-actions-wrap" style="display:flex; gap:10px; flex-wrap:wrap;">
                <button type="button" class="btn-primary" style="padding:10px 18px; font-size:0.86rem;" onclick="window.NovoClube.openInvoiceModal()">
                  ${iconSvg('camera')} Cadastrar nota fiscal
                </button>
                <button type="button" class="btn-secondary" style="padding:10px 16px; font-size:0.85rem;" onclick="window.NovoClube.setProfileSubTab('configuracoes')">
                  ${iconSvg('edit')} Editar perfil
                </button>
                <button type="button" class="btn-secondary" style="padding:10px 16px; font-size:0.85rem;" onclick="window.NovoClube.openSwitchProfileModal()">
                  Trocar perfil
                </button>
              </div>
            </div>

            <div class="profile-kpis-grid">
              <div class="kpi-card" style="cursor:pointer;" onclick="window.NovoClube.openPointsTimelineModal()" title="Clique para abrir a Linha do Tempo da Pontuação">
                <div class="kpi-icon" style="background:var(--red-bg); color:var(--red);">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                </div>
                <div>
                  <div class="kpi-label">Pontos acumulados &gt;</div>
                  <div class="kpi-val">${profile.collectionPoints} <span>pontos</span></div>
                  <div class="kpi-sub">Toque para ver a linha do tempo (0 a 1.500).</div>
                </div>
              </div>

              <div class="kpi-card">
                <div class="kpi-icon" style="background:var(--blue-bg); color:var(--blue);">
                  ${iconSvg('gift')}
                </div>
                <div>
                  <div class="kpi-label">Saldo de benefícios</div>
                  <div class="kpi-val">${profile.benefitBalance} <span>pontos</span></div>
                  <div class="kpi-sub">Disponível para resgates.</div>
                </div>
              </div>

              <div class="kpi-card">
                <div class="kpi-icon" style="background:#F1F5F9; color:var(--navy);">
                  ${iconSvg('receipt')}
                </div>
                <div>
                  <div class="kpi-label">Notas fiscais cadastradas</div>
                  <div class="kpi-val">${profile.invoicesCount} <span>notas</span></div>
                  <div class="kpi-sub">Última nota em ${profile.lastInvoiceDate}.</div>
                </div>
              </div>
            </div>

            <div id="profile-subcontent-slot">
              ${renderProfileSubContent(profile)}
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function renderProfileSubContent(profile) {
    if (profileSubTab === 'notas') {
      return `
        <div class="movements-card subtle-update">
          <div class="movements-header">
            <h3>Minhas notas fiscais (${profile.invoicesCount} cadastradas)</h3>
            <button type="button" class="btn-primary" style="padding:8px 16px; font-size:0.82rem;" onclick="window.NovoClube.openInvoiceModal()">
              + Nova nota fiscal
            </button>
          </div>
          ${
            profile.invoices.length === 0
              ? `<p style="color:var(--text-muted); font-size:0.9rem; padding:16px 0;">Nenhuma nota fiscal cadastrada neste perfil ainda.</p>`
              : profile.invoices
                  .map(
                    (nf) => `
              <div class="movement-row">
                <div class="movement-left">
                  <span class="movement-badge-plus">✓</span>
                  <div>
                    <div>${nf.store}</div>
                    <div style="font-size:0.75rem; color:var(--text-muted); font-weight:500;">CNPJ ${nf.cnpj} • R$ ${nf.value.toFixed(2).replace('.', ',')}</div>
                  </div>
                </div>
                <div class="movement-pts-plus">+ ${nf.points} pontos</div>
                <div class="movement-date">${nf.date}</div>
              </div>
            `
                  )
                  .join('')
          }
        </div>
      `;
    }

    if (profileSubTab === 'beneficios') {
      return `
        <div class="movements-card subtle-update">
          <div class="movements-header">
            <h3>Meus benefícios resgatados (${profile.redeemedBenefits.length})</h3>
            <button type="button" class="btn-secondary" style="padding:7px 14px; font-size:0.8rem;" onclick="window.NovoClube.navigate('beneficios')">
              Ver catálogo do mês
            </button>
          </div>
          ${
            profile.redeemedBenefits.length === 0
              ? `<p style="color:var(--text-muted); font-size:0.9rem; padding:16px 0;">Você ainda não resgatou benefícios neste perfil.</p>`
              : profile.redeemedBenefits
                  .map(
                    (rb) => `
                <div class="movement-row">
                  <div class="movement-left">
                    <span class="movement-badge-plus" style="background:var(--blue);">🎁</span>
                    <div>
                      <div>${rb.title}</div>
                      <div style="font-size:0.76rem; color:var(--text-muted); font-weight:500;">${rb.partner} • Cupom: <strong>${rb.code}</strong></div>
                    </div>
                  </div>
                  <div class="movement-pts-minus">- ${rb.points} pts</div>
                  <div class="movement-date">${rb.date}</div>
                </div>
              `
                  )
                  .join('')
          }
        </div>
      `;
    }

    if (profileSubTab === 'historico') {
      return `
        <div class="movements-card subtle-update">
          <div class="movements-header">
            <h3>Meu histórico completo de pontos</h3>
          </div>
          ${profile.transactions
            .map(
              (tx) => `
            <div class="movement-row">
              <div class="movement-left">
                <span class="${tx.type === 'credit' ? 'movement-badge-plus' : 'movement-badge-minus'}">
                  ${tx.type === 'credit' ? '+' : '−'}
                </span>
                <div>
                  <div>${tx.title}</div>
                  <div style="font-size:0.75rem; color:var(--text-muted); font-weight:500;">${tx.subtitle || 'Novo Shopping'}</div>
                </div>
              </div>
              <div class="${tx.type === 'credit' ? 'movement-pts-plus' : 'movement-pts-minus'}">
                ${tx.type === 'credit' ? `+ ${tx.points}` : `- ${tx.points}`} pontos
              </div>
              <div class="movement-date">${tx.date}</div>
            </div>
          `
            )
            .join('')}
        </div>
      `;
    }

    if (profileSubTab === 'colecionaveis') {
      return `
        <div class="movements-card subtle-update">
          <div class="movements-header">
            <h3>Meus colecionáveis Astro</h3>
            <button type="button" class="btn-secondary" style="padding:7px 14px; font-size:0.8rem;" onclick="window.NovoClube.navigate('colecao')">
              Ir para Coleção
            </button>
          </div>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:14px; margin-top:10px;">
            ${state.astros
              .map((a) => {
                const st = getAstroStatus(a, profile);
                return `
                <div style="border:1px solid var(--border-color); border-radius:16px; padding:14px; display:flex; align-items:center; gap:12px; cursor:pointer;" onclick="window.NovoClube.openAstroDetailModal('${a.id}')">
                  <img src="${a.image3d}" alt="${a.name}" style="width:54px; height:54px; object-fit:contain;" />
                  <div>
                    <strong style="font-size:0.9rem; display:block;">${a.name}</strong>
                    <span style="font-size:0.78rem; color:${st.state === 'conquistado' ? 'var(--green)' : 'var(--text-muted)'}; font-weight:700;">
                      ${st.state === 'conquistado' ? '✔ Conquistado' : st.state === 'andamento' ? `${st.progressPoints}/${st.targetPoints} pts` : '🔒 Bloqueado'}
                    </span>
                  </div>
                </div>
              `;
              })
              .join('')}
          </div>
        </div>
      `;
    }

    if (profileSubTab === 'duvidas') {
      return `
        <div class="movements-card subtle-update">
          <div class="movements-header">
            <h3>Dúvidas frequentes (FAQ)</h3>
          </div>
          <div style="display:flex; flex-direction:column; gap:14px;">
            ${state.faqs
              .map(
                (f) => `
              <div style="padding:14px 16px; background:#F8FAFC; border-radius:14px; border:1px solid var(--border-color);">
                <strong style="display:block; color:var(--navy); margin-bottom:6px; font-size:0.92rem;">${f.q}</strong>
                <p style="font-size:0.85rem; color:var(--text-muted);">${f.a}</p>
              </div>
            `
              )
              .join('')}
          </div>
        </div>
      `;
    }

    if (profileSubTab === 'termos') {
      return `
        <div class="movements-card subtle-update">
          <div class="movements-header">
            <h3>Termos e condições — Novo Clube</h3>
          </div>
          <div style="font-size:0.86rem; color:var(--text-muted); line-height:1.65; display:flex; flex-direction:column; gap:10px;">
            <p><strong>1. Participação e Perfis Familiares:</strong> O Novo Clube é o programa oficial de relacionamento do Novo Shopping Ribeirão Preto. Cada conta familiar pode cadastrar múltiplos perfis individuais gratuitamente.</p>
            <p><strong>2. Acúmulo de Pontos (R$ 1 = 1 ponto):</strong> Notas fiscais emitidas por lojas participantes do Novo Shopping geram 1 ponto a cada R$ 1,00 gasto, creditados simultaneamente nos Pontos de Coleção e no Saldo de Benefícios.</p>
            <p><strong>3. Colecionáveis Astros:</strong> Os 4 Astros representam as categorias Serviços, Lazer, Saúde/Esportes e Varejo/Compras. O primeiro Astro é concedido na adesão e os demais são desbloqueados ao atingir 500, 1.000 e 1.500 pontos, respeitando o calendário de liberação mensal.</p>
          </div>
        </div>
      `;
    }

    if (profileSubTab === 'configuracoes') {
      return `
        <div class="movements-card subtle-update">
          <div class="movements-header">
            <h3>Configurações do Perfil e Conta</h3>
          </div>
          <form novalidate onsubmit="window.NovoClube.saveProfileSettings(event)" style="max-width:460px;">
            <div class="form-group">
              <label for="cfg-name">Nome do perfil</label>
              <div class="input-wrap">
                <input id="cfg-name" type="text" class="form-input is-valid" value="${profile.name}" oninput="window.NovoClube.validateFieldLive('name', 'cfg-name')" />
                <span id="cfg-name-icon" class="input-status-icon visible"><span style="color:#16A34A; font-weight:800;">✓</span></span>
              </div>
              <div id="cfg-name-feedback" class="field-feedback"></div>
            </div>
            <div class="form-group">
              <label for="cfg-email">E-mail da conta familiar</label>
              <div class="input-wrap">
                <input id="cfg-email" type="email" class="form-input is-valid" value="${profile.email}" oninput="window.NovoClube.validateFieldLive('email', 'cfg-email')" />
                <span id="cfg-email-icon" class="input-status-icon visible"><span style="color:#16A34A; font-weight:800;">✓</span></span>
              </div>
              <div id="cfg-email-feedback" class="field-feedback"></div>
            </div>
            <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:16px;">
              <button type="submit" class="btn-primary" style="padding:11px 22px;">Salvar alterações</button>
              <button type="button" class="btn-secondary" style="padding:11px 22px;" onclick="window.NovoClube.resetDemoData()">
                Restaurar dados iniciais
              </button>
            </div>
          </form>
        </div>
      `;
    }

    // Sub-aba padrão: RESUMO
    return `
      <div class="profile-bottom-grid subtle-update">
        <div class="movements-card">
          <div class="movements-header">
            <h3>Últimas movimentações</h3>
            <button type="button" style="color:var(--blue); font-size:0.82rem; font-weight:700;" onclick="window.NovoClube.setProfileSubTab('historico')">
              Ver todas &gt;
            </button>
          </div>

          ${profile.transactions
            .slice(0, 4)
            .map(
              (tx) => `
            <div class="movement-row">
              <div class="movement-left">
                <span class="${tx.type === 'credit' ? 'movement-badge-plus' : 'movement-badge-minus'}">
                  ${tx.type === 'credit' ? '+' : '−'}
                </span>
                <span>${tx.title}</span>
              </div>
              <div class="${tx.type === 'credit' ? 'movement-pts-plus' : 'movement-pts-minus'}">
                ${tx.type === 'credit' ? `+ ${tx.points}` : `- ${tx.points}`} pontos
              </div>
              <div class="movement-date">${tx.date}</div>
            </div>
          `
            )
            .join('')}
        </div>

        <div class="profile-astro-banner">
          <div>
            <h4>Continue acumulando e conquiste todos os Astros!</h4>
            <button type="button" class="btn-navy" onclick="window.NovoClube.navigate('colecao')">
              Ver minha coleção &gt;
            </button>
          </div>
          <img src="assets/images/astros/astro-banner-perfil.png?v=8" alt="Astro Novo Clube" />
        </div>
      </div>
    `;
  }

  // =========================================================
  // MODAL GLOBAL: CADASTRO DE NOTA FISCAL (CÂMERA + UPLOAD)
  // =========================================================
  function openInvoiceModal() {
    capturedReceiptImage = null;
    const modalRoot = document.getElementById('modal-root');
    if (!modalRoot) return;

    const storesOptions = state.partnerStores
      .map((s, idx) => `<option value="${idx}">${s.name} (${s.category})</option>`)
      .join('');

    modalRoot.innerHTML = `
      <div class="modal-backdrop" onclick="if(event.target===this) window.NovoClube.closeModal()">
        <div class="modal-card">
          <button type="button" class="modal-close" onclick="window.NovoClube.closeModal()" aria-label="Fechar">✕</button>
          <p class="section-eyebrow" style="margin-bottom:4px;">CADASTRO DE NOTA FISCAL</p>
          <h3 style="font-size:1.35rem; font-weight:800; color:var(--navy);">Fotografe seu cupom fiscal</h3>
          <p style="font-size:0.86rem; color:var(--text-muted);">
            A cada <strong>R$ 1,00</strong> em compras nas lojas participantes do Novo Shopping, você ganha <strong>1 ponto</strong> na Coleção e no Saldo!
          </p>

          <div class="camera-viewport" id="camera-box">
            <video id="camera-video" autoplay playsinline muted style="display:none;"></video>
            <img id="camera-preview" alt="Prévia da Nota Fiscal" style="display:none;" />
            <div id="camera-placeholder" style="text-align:center; color:#CBD5E1; padding:20px;">
              <div style="margin-bottom:8px;">${iconSvg('camera')}</div>
              <p style="font-size:0.85rem;">Posicione o QR Code ou valor da Nota Fiscal no quadro</p>
            </div>
            <div class="camera-scan-frame">
              <div class="camera-scan-line"></div>
              <span style="background:rgba(0,39,69,0.85); color:#ffffff; font-size:0.72rem; padding:4px 10px; border-radius:999px;">
                Leitor Óptico Novo Clube
              </span>
            </div>
          </div>

          <div style="display:flex; gap:8px; margin-bottom:16px; flex-wrap:wrap;">
            <button type="button" class="btn-secondary" style="flex:1; padding:10px; font-size:0.84rem;" onclick="window.NovoClube.capturePhotoFrame()">
              📸 Capturar Foto da Câmera
            </button>
            <label class="btn-secondary" style="flex:1; padding:10px; font-size:0.84rem; cursor:pointer; text-align:center;">
              🖼️ Enviar / Tirar Foto
              <input type="file" accept="image/*" capture="environment" style="display:none;" onchange="window.NovoClube.handleFileReceipt(event)" />
            </label>
          </div>

          <form novalidate onsubmit="window.NovoClube.confirmInvoiceSubmit(event)">
            <div class="form-group">
              <label for="nf-store">Loja participante identificada</label>
              <select id="nf-store" class="form-input" style="padding-right:16px;">
                ${storesOptions}
              </select>
            </div>
            <div class="form-group">
              <label for="nf-value">Valor da Nota Fiscal (R$)</label>
              <input id="nf-value" type="number" step="1" min="5" max="5000" class="form-input" value="150" />
              <div style="display:flex; gap:6px; margin-top:8px; flex-wrap:wrap;">
                <button type="button" class="month-pill" style="padding:5px 12px; font-size:0.76rem;" onclick="document.getElementById('nf-value').value = 50">+ R$ 50 (50 pts)</button>
                <button type="button" class="month-pill" style="padding:5px 12px; font-size:0.76rem;" onclick="document.getElementById('nf-value').value = 150">+ R$ 150 (150 pts)</button>
                <button type="button" class="month-pill" style="padding:5px 12px; font-size:0.76rem;" onclick="document.getElementById('nf-value').value = 500">+ R$ 500 (500 pts)</button>
              </div>
            </div>
            <button type="submit" class="btn-primary" style="width:100%; padding:14px;">
              Confirmar Leitura e Creditar Pontos
            </button>
          </form>
        </div>
      </div>
    `;

    startCameraStream();
  }

  async function startCameraStream() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;
    try {
      activeCameraStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false
      });
      const videoEl = document.getElementById('camera-video');
      const placeholderEl = document.getElementById('camera-placeholder');
      if (videoEl) {
        videoEl.srcObject = activeCameraStream;
        videoEl.style.display = 'block';
      }
      if (placeholderEl) {
        placeholderEl.style.display = 'none';
      }
    } catch (err) {
      // Sem permissão de câmera: mantém visor óptico
    }
  }

  function stopCameraStream() {
    if (activeCameraStream) {
      activeCameraStream.getTracks().forEach((t) => t.stop());
      activeCameraStream = null;
    }
  }

  function capturePhotoFrame() {
    const videoEl = document.getElementById('camera-video');
    const previewEl = document.getElementById('camera-preview');
    const placeholderEl = document.getElementById('camera-placeholder');

    if (videoEl && videoEl.style.display !== 'none' && videoEl.videoWidth > 0) {
      const canvas = document.createElement('canvas');
      canvas.width = videoEl.videoWidth;
      canvas.height = videoEl.videoHeight;
      canvas.getContext('2d').drawImage(videoEl, 0, 0);
      capturedReceiptImage = canvas.toDataURL('image/jpeg', 0.85);
      stopCameraStream();
      videoEl.style.display = 'none';
      if (previewEl) {
        previewEl.src = capturedReceiptImage;
        previewEl.style.display = 'block';
      }
    } else if (placeholderEl) {
      placeholderEl.innerHTML = `
        <div style="color:#4ADE80; font-weight:800; font-size:0.95rem;">✓ Cupom Fiscal Escaneado</div>
        <p style="font-size:0.8rem; color:#E2E8F0; margin-top:4px;">QR Code SEFAZ-SP validado • Loja participante Novo Shopping</p>
      `;
    }
  }

  function handleFileReceipt(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
      capturedReceiptImage = e.target.result;
      stopCameraStream();
      const videoEl = document.getElementById('camera-video');
      const previewEl = document.getElementById('camera-preview');
      const placeholderEl = document.getElementById('camera-placeholder');
      if (videoEl) videoEl.style.display = 'none';
      if (placeholderEl) placeholderEl.style.display = 'none';
      if (previewEl) {
        previewEl.src = capturedReceiptImage;
        previewEl.style.display = 'block';
      }
    };
    reader.readAsDataURL(file);
  }

  function confirmInvoiceSubmit(event) {
    event.preventDefault();
    const storeIdx = parseInt(document.getElementById('nf-store').value, 10) || 0;
    const rawVal = parseFloat(document.getElementById('nf-value').value) || 0;
    if (rawVal <= 0) return;

    const pointsEarned = Math.max(1, Math.round(rawVal));
    const storeObj = state.partnerStores[storeIdx] || state.partnerStores[0];

    const profile = getActiveProfile();
    const prevCollection = profile.collectionPoints;

    profile.collectionPoints += pointsEarned;
    profile.benefitBalance += pointsEarned;
    profile.invoicesCount += 1;

    const todayStr = new Date().toLocaleDateString('pt-BR');
    profile.lastInvoiceDate = todayStr;

    profile.invoices.unshift({
      id: 'nf-' + Date.now(),
      store: storeObj.name,
      cnpj: storeObj.cnpj,
      value: rawVal,
      points: pointsEarned,
      date: todayStr,
      category: storeObj.category
    });

    profile.transactions.unshift({
      id: 'tx-' + Date.now(),
      type: 'credit',
      title: 'Compra no Shopping',
      subtitle: storeObj.name,
      points: pointsEarned,
      date: todayStr
    });

    saveState();
    stopCameraStream();

    const newlyUnlockedAstro = state.astros.find(
      (a) =>
        a.requiredPoints > 0 &&
        prevCollection < a.requiredPoints &&
        profile.collectionPoints >= a.requiredPoints
    );

    const modalRoot = document.getElementById('modal-root');
    if (modalRoot) {
      modalRoot.innerHTML = `
        <div class="modal-backdrop" onclick="if(event.target===this) window.NovoClube.closeModal()">
          <div class="modal-card" style="text-align:center;">
            <div style="width:64px; height:64px; border-radius:50%; background:var(--green-bg); color:var(--green); display:inline-flex; align-items:center; justify-content:center; font-size:1.8rem; font-weight:800; margin-bottom:14px;">
              ✓
            </div>
            <h3 style="font-size:1.45rem; font-weight:800; color:var(--navy); margin-bottom:6px;">
              Nota Fiscal Confirmada!
            </h3>
            <p style="font-size:0.9rem; color:var(--text-muted); margin-bottom:18px;">
              Compra de <strong>R$ ${rawVal.toFixed(2).replace('.', ',')}</strong> em <strong>${storeObj.name}</strong>
            </p>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:20px; text-align:left;">
              <div style="background:var(--red-bg); border:1px solid #FECDD3; padding:14px; border-radius:16px;">
                <span style="font-size:0.76rem; font-weight:700; color:var(--red);">MINHA COLEÇÃO</span>
                <div style="font-size:1.35rem; font-weight:800; color:var(--navy);">+${pointsEarned} pts</div>
                <span style="font-size:0.76rem; color:var(--text-muted);">Total: ${profile.collectionPoints} pts</span>
              </div>
              <div style="background:var(--blue-bg); border:1px solid #BFDBFE; padding:14px; border-radius:16px;">
                <span style="font-size:0.76rem; font-weight:700; color:var(--blue);">SALDO DE BENEFÍCIOS</span>
                <div style="font-size:1.35rem; font-weight:800; color:var(--navy);">+${pointsEarned} pts</div>
                <span style="font-size:0.76rem; color:var(--text-muted);">Saldo: ${profile.benefitBalance} pts</span>
              </div>
            </div>

            ${
              newlyUnlockedAstro
                ? `
              <div style="background:linear-gradient(135deg, #FEF3C7, #FDE68A); padding:16px; border-radius:18px; margin-bottom:20px; display:flex; align-items:center; gap:14px; text-align:left;">
                <img src="${newlyUnlockedAstro.image3d}" alt="${newlyUnlockedAstro.name}" style="width:68px; height:68px; object-fit:contain; border-radius:14px; background:#fff; padding:4px;" />
                <div>
                  <strong style="color:#92400E; font-size:0.95rem; display:block;">🎉 Novo Astro Desbloqueado!</strong>
                  <span style="font-size:0.84rem; color:#78350F;">Você atingiu ${newlyUnlockedAstro.requiredPoints} pontos e conquistou o <strong>${newlyUnlockedAstro.name}</strong>!</span>
                </div>
              </div>
            `
                : ''
            }

            <button type="button" class="btn-primary" style="width:100%;" onclick="window.NovoClube.closeModal()">
              Continuar no Novo Clube
            </button>
          </div>
        </div>
      `;
    }

    renderApp();
  }

  // =========================================================
  // RESGATE DE BENEFÍCIOS (DESCONTA APENAS DO SALDO AZUL)
  // =========================================================
  function redeemBenefit(benefitId) {
    const benefit = state.benefits.find((b) => b.id === benefitId);
    if (!benefit) return;

    const profile = getActiveProfile();
    if (profile.benefitBalance < benefit.points) {
      showToast(`⚠️ Saldo insuficiente (${profile.benefitBalance} pts). Este benefício requer ${benefit.points} pontos.`);
      return;
    }

    profile.benefitBalance -= benefit.points;
    const todayStr = new Date().toLocaleDateString('pt-BR');
    const voucherCode =
      'NOVO-' +
      Math.random().toString(36).substring(2, 6).toUpperCase() +
      '-' +
      Math.floor(100 + Math.random() * 900);

    profile.redeemedBenefits.unshift({
      id: 'red-' + Date.now(),
      title: benefit.title,
      partner: benefit.partner,
      points: benefit.points,
      date: todayStr,
      code: voucherCode
    });

    profile.transactions.unshift({
      id: 'tx-' + Date.now(),
      type: 'debit',
      title: `Resgate: ${benefit.title}`,
      subtitle: benefit.partner,
      points: benefit.points,
      date: todayStr
    });

    saveState();

    // Atualiza a página (ou saldo da página de detalhe do benefício) sem recarregar o shell
    renderApp(false);

    const modalRoot = document.getElementById('modal-root');
    if (modalRoot) {
      modalRoot.innerHTML = `
        <div class="modal-backdrop" onclick="if(event.target===this) window.NovoClube.closeModal()">
          <div class="modal-card" style="text-align:center;">
            <button type="button" class="modal-close" onclick="window.NovoClube.closeModal()">✕</button>
            <img src="${benefit.image}" alt="${benefit.title}" style="width:110px; height:110px; object-fit:cover; border-radius:20px; margin-bottom:14px;" />
            <p class="section-eyebrow" style="margin-bottom:4px;">BENEFÍCIO RESGATADO COM SUCESSO</p>
            <h3 style="font-size:1.35rem; font-weight:800; color:var(--navy); margin-bottom:6px;">${benefit.title}</h3>
            <p style="font-size:0.86rem; color:var(--text-muted); margin-bottom:16px;">${benefit.partner} • ${benefit.description}</p>

            <div style="background:#F8FAFC; border:2px dashed #CBD5E1; border-radius:18px; padding:16px; margin-bottom:16px;">
              <span style="font-size:0.75rem; color:var(--text-muted); display:block; margin-bottom:4px;">APRESENTE ESTE CÓDIGO NA LOJA</span>
              <strong style="font-size:1.4rem; letter-spacing:0.08em; color:var(--navy);">${voucherCode}</strong>
            </div>

            <div style="font-size:0.82rem; color:var(--text-muted); background:var(--green-bg); color:var(--green); padding:10px 14px; border-radius:12px; margin-bottom:18px; font-weight:700;">
              ✓ Sua coleção permaneceu intacta em ${profile.collectionPoints} pontos! Novo saldo: ${profile.benefitBalance} pontos.
            </div>

            <button type="button" class="btn-primary" style="width:100%;" onclick="window.NovoClube.closeModal()">
              Concluído
            </button>
          </div>
        </div>
      `;
    }
  }

  // =========================================================
  // MODAL DE DETALHE DO ASTRO
  // =========================================================
  function openAstroDetailModal(astroId) {
    const astro = state.astros.find((a) => a.id === astroId);
    if (!astro) return;
    const profile = getActiveProfile();
    const st = getAstroStatus(astro, profile);

    const modalRoot = document.getElementById('modal-root');
    if (!modalRoot) return;

    modalRoot.innerHTML = `
      <div class="modal-backdrop" onclick="if(event.target===this) window.NovoClube.closeModal()">
        <div class="modal-card">
          <button type="button" class="modal-close" onclick="window.NovoClube.closeModal()">✕</button>
          <div style="display:flex; align-items:center; gap:14px; margin-bottom:16px;">
            <img src="${astro.image3d}" alt="${astro.name}" style="width:74px; height:74px; object-fit:contain;" />
            <div>
              <span class="section-eyebrow" style="display:block; margin-bottom:2px;">CATEGORIA: ${astro.category.toUpperCase()}</span>
              <h3 style="font-size:1.4rem; font-weight:800; color:var(--navy);">${astro.name}</h3>
              <span style="font-size:0.82rem; color:var(--text-muted);">${astro.requirementLabel} • Liberação: ${astro.releaseMonth}</span>
            </div>
          </div>

          <p style="font-size:0.9rem; color:var(--text-main); margin-bottom:16px; line-height:1.5;">
            ${astro.description}
          </p>

          <div style="border-radius:20px; overflow:hidden; border:1px solid var(--border-color); margin-bottom:16px; background:#F8FAFC;">
            <img src="${astro.imageReal}" alt="Pelúcia Física ${astro.name} no Novo Shopping" style="width:100%; height:260px; object-fit:cover; display:block;" />
            <div style="padding:12px 16px;">
              <strong style="font-size:0.85rem; color:var(--navy); display:block;">⭐ Pelúcia Colecionável Oficial no Novo Shopping</strong>
              <span style="font-size:0.8rem; color:var(--text-muted);">Visual da categoria: ${astro.accessories}.</span>
            </div>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; gap:12px;">
            <div style="font-size:0.85rem; font-weight:700; color:var(--navy);">
              Status: ${st.state === 'conquistado' ? '✅ Conquistado' : st.state === 'andamento' ? `⏳ Em andamento (${st.progressPoints}/${st.targetPoints} pts)` : '🔒 Bloqueado'}
            </div>
            <button type="button" class="btn-primary" style="padding:10px 20px; font-size:0.86rem;" onclick="window.NovoClube.closeModal(); window.NovoClube.openInvoiceModal();">
              Cadastrar Nota
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // =========================================================
  // MODAIS DE PERFIL (RESTRITOS AO E-MAIL LOGADO)
  // =========================================================
  function openSwitchProfileModal() {
    const modalRoot = document.getElementById('modal-root');
    if (!modalRoot) return;

    const accountProfiles = getAccountProfiles();

    modalRoot.innerHTML = `
      <div class="modal-backdrop" onclick="if(event.target===this) window.NovoClube.closeModal()">
        <div class="modal-card" style="text-align:center;">
          <button type="button" class="modal-close" onclick="window.NovoClube.closeModal()">✕</button>
          <p class="section-eyebrow">CONTA FAMILIAR</p>
          <h3 style="font-size:1.35rem; font-weight:800; color:var(--navy); margin-bottom:6px;">Quem está acessando?</h3>
          <p style="font-size:0.86rem; color:var(--text-muted); margin-bottom:20px;">Perfis vinculados a <strong>${state.accountEmail}</strong></p>

          <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:18px;">
            ${accountProfiles
              .map(
                (p) => `
              <button type="button" onclick="window.NovoClube.selectProfile('${p.id}'); window.NovoClube.closeModal();" style="display:flex; align-items:center; justify-content:space-between; padding:12px 16px; border-radius:16px; border:2px solid ${p.id === state.activeProfileId ? 'var(--red)' : 'var(--border-color)'}; background:${p.id === state.activeProfileId ? 'var(--red-bg)' : '#F8FAFC'};">
                <div style="display:flex; align-items:center; gap:12px; text-align:left;">
                  <div class="avatar-circle" style="background:${p.avatarBg}; color:${p.avatarColor};">${p.initials}</div>
                  <div>
                    <strong style="display:block; color:var(--navy); font-size:0.95rem;">${p.name}</strong>
                    <span style="font-size:0.78rem; color:var(--text-muted);">Coleção: ${p.collectionPoints} pts • Saldo: ${p.benefitBalance} pts</span>
                  </div>
                </div>
                <span style="font-size:0.8rem; font-weight:800; color:var(--blue);">${p.id === state.activeProfileId ? 'Ativo' : 'Entrar >'}</span>
              </button>
            `
              )
              .join('')}
          </div>

          <div style="display:flex; gap:10px;">
            <button type="button" class="btn-secondary" style="flex:1;" onclick="window.NovoClube.openNewProfileModal()">
              + Adicionar Perfil
            </button>
            <button type="button" class="btn-secondary" onclick="window.NovoClube.logout()">
              Sair da Conta
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function openNewProfileModal() {
    const modalRoot = document.getElementById('modal-root');
    if (!modalRoot) return;

    modalRoot.innerHTML = `
      <div class="modal-backdrop" onclick="if(event.target===this) window.NovoClube.closeModal()">
        <div class="modal-card">
          <button type="button" class="modal-close" onclick="window.NovoClube.closeModal()">✕</button>
          <p class="section-eyebrow">NOVO INTEGRANTE DA FAMÍLIA</p>
          <h3 style="font-size:1.35rem; font-weight:800; color:var(--navy); margin-bottom:8px;">Criar Perfil Familiar</h3>
          <p style="font-size:0.86rem; color:var(--text-muted); margin-bottom:18px;">
            Vinculado à conta <strong>${state.accountEmail}</strong>. O <strong>1º Astro (Astro Serviços)</strong> já é desbloqueado automaticamente!
          </p>

          <form novalidate onsubmit="window.NovoClube.createNewProfile(event)">
            <div class="form-group">
              <label for="np-name">Nome do familiar</label>
              <div class="input-wrap">
                <input
                  id="np-name"
                  type="text"
                  class="form-input"
                  placeholder="Ex.: Beatriz Silva"
                  oninput="window.NovoClube.validateFieldLive('name', 'np-name')"
                  onblur="window.NovoClube.validateFieldLive('name', 'np-name', true)"
                />
                <span id="np-name-icon" class="input-status-icon"></span>
              </div>
              <div id="np-name-feedback" class="field-feedback">Como este perfil aparecerá na tela de seleção.</div>
            </div>
            <div class="form-group">
              <label for="np-role">Parentesco / Papel</label>
              <input id="np-role" type="text" class="form-input" value="Família" />
            </div>
            <button type="submit" class="btn-primary" style="width:100%;">
              Criar Perfil e Desbloquear 1º Astro ⭐
            </button>
          </form>
        </div>
      </div>
    `;
  }

  function createNewProfile(event) {
    event.preventDefault();
    if (!validateFieldLive('name', 'np-name', true)) {
      const el = document.getElementById('np-name');
      if (el) el.focus();
      return;
    }

    const name = document.getElementById('np-name').value.trim();
    const role = document.getElementById('np-role').value.trim() || 'Família';

    const parts = name.split(' ').filter(Boolean);
    const initials =
      parts.length > 1
        ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
        : name.substring(0, 2).toUpperCase();
    const shortName = parts[0];
    const id = 'prof-' + Date.now();
    const todayStr = new Date().toLocaleDateString('pt-BR');

    const newProf = {
      id,
      name,
      shortName,
      initials,
      role,
      email: normalizeEmail(state.accountEmail),
      phone: '(16) 99123-4567',
      avatarBg: '#DCFCE7',
      avatarColor: '#15803D',
      collectionPoints: 0,
      benefitBalance: 0,
      invoicesCount: 0,
      lastInvoiceDate: todayStr,
      redeemedBenefits: [],
      invoices: [],
      transactions: [
        {
          id: 'tx-init-' + Date.now(),
          type: 'credit',
          title: 'Cadastro no Novo Clube (1º Astro Conquistado!)',
          subtitle: 'Bônus de Boas-Vindas',
          points: 0,
          date: todayStr
        }
      ]
    };

    state.profiles.push(newProf);
    state.activeProfileId = id;
    state.isAuthenticated = true;
    state.profileSelected = true;
    currentTab = 'inicio';
    saveState();
    closeModal();
    renderApp(true);
  }

  function openNotificationsModal() {
    const profile = getActiveProfile();
    const nextAstro = getNextTargetAstro(profile);
    const rem = Math.max(0, nextAstro.requiredPoints - profile.collectionPoints);

    const modalRoot = document.getElementById('modal-root');
    if (!modalRoot) return;

    modalRoot.innerHTML = `
      <div class="modal-backdrop" onclick="if(event.target===this) window.NovoClube.closeModal()">
        <div class="modal-card">
          <button type="button" class="modal-close" onclick="window.NovoClube.closeModal()">✕</button>
          <p class="section-eyebrow">AVISOS DO CLUBE</p>
          <h3 style="font-size:1.3rem; font-weight:800; color:var(--navy); margin-bottom:14px;">Notificações de ${profile.shortName}</h3>
          <div style="display:flex; flex-direction:column; gap:10px;">
            <div style="padding:12px 14px; background:var(--red-bg); border-radius:14px; font-size:0.86rem;">
              <strong>⭐ Jornada Astro:</strong> ${rem > 0 ? `Faltam apenas ${rem} pontos para você desbloquear o ${nextAstro.name}!` : `Você já atingiu a pontuação do ${nextAstro.name}!`}
            </div>
            <div style="padding:12px 14px; background:var(--blue-bg); border-radius:14px; font-size:0.86rem;">
              <strong>🎁 Ofertas de ${state.currentMonth}:</strong> Você tem ${profile.benefitBalance} pontos disponíveis para trocar por cinema, cafés e lanches.
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function closeModal() {
    stopCameraStream();
    const modalRoot = document.getElementById('modal-root');
    if (modalRoot) modalRoot.innerHTML = '';
  }

  function showToast(msg) {
    const container = document.getElementById('toast-root');
    if (!container) return;
    const el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = `<span>${msg}</span>`;
    container.appendChild(el);
    setTimeout(() => {
      el.remove();
    }, 3200);
  }

  // =========================================================
  // HANDLERS PÚBLICOS EXPOSTOS EM window.NovoClube
  // =========================================================
  window.NovoClube = {
    validateFieldLive,
    navigate(tab) {
      if (currentTab === tab && !selectedBenefitId && document.getElementById('app-shell')) return;
      currentTab = tab;
      selectedBenefitId = null;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      renderApp(false);
    },
    openBenefitDetail(benefitId) {
      selectedBenefitId = benefitId;
      currentTab = 'beneficios';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      renderApp(false);
    },
    closeBenefitDetail() {
      selectedBenefitId = null;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      renderApp(false);
    },
    setAuthMode(mode) {
      authMode = mode;
      renderApp(true);
    },
    handleLogin(event) {
      event.preventDefault();
      const emailOk = validateFieldLive('email', 'login-email', true);
      const passOk = validateFieldLive('password', 'login-pass', true);
      if (!emailOk || !passOk) {
        const firstErr = !emailOk ? 'login-email' : 'login-pass';
        const el = document.getElementById(firstErr);
        if (el) el.focus();
        return;
      }

      const emailVal = normalizeEmail(document.getElementById('login-email').value);
      state.accountEmail = emailVal;

      // Se esse e-mail ainda não possuir nenhum perfil cadastrado, cria um perfil titular limpo exclusivo para ele
      const existingForEmail = getAccountProfiles();
      if (existingForEmail.length === 0) {
        const prefix = emailVal.split('@')[0] || 'Cliente';
        const cleanName = prefix.charAt(0).toUpperCase() + prefix.slice(1);
        const todayStr = new Date().toLocaleDateString('pt-BR');
        const newId = 'user-' + Date.now();
        state.profiles.push({
          id: newId,
          name: cleanName,
          shortName: cleanName,
          initials: cleanName.substring(0, 2).toUpperCase(),
          role: 'Titular • Família',
          email: emailVal,
          phone: '(16) 99123-4567',
          avatarBg: '#B8D4F2',
          avatarColor: '#1E40AF',
          collectionPoints: 0,
          benefitBalance: 0,
          invoicesCount: 0,
          lastInvoiceDate: todayStr,
          redeemedBenefits: [],
          invoices: [],
          transactions: [
            {
              id: 'tx-welcome-' + Date.now(),
              type: 'credit',
              title: 'Adesão Novo Clube — 1º Astro Desbloqueado!',
              subtitle: 'Astro Serviços (Amarelo)',
              points: 0,
              date: todayStr
            }
          ]
        });
        state.activeProfileId = newId;
      } else {
        state.activeProfileId = existingForEmail[0].id;
      }

      state.isAuthenticated = true;
      state.profileSelected = false;
      saveState();
      renderApp(true);
    },
    handleRegister(event) {
      event.preventDefault();
      const nameOk = validateFieldLive('name', 'reg-name', true);
      const emailOk = validateFieldLive('email', 'reg-email', true);
      const passOk = validateFieldLive('password', 'reg-pass', true);

      if (!nameOk || !emailOk || !passOk) {
        const firstInvalid = !nameOk ? 'reg-name' : !emailOk ? 'reg-email' : 'reg-pass';
        const el = document.getElementById(firstInvalid);
        if (el) el.focus();
        return;
      }

      const name = document.getElementById('reg-name').value.trim();
      const email = normalizeEmail(document.getElementById('reg-email').value);
      state.accountEmail = email;

      const parts = name.split(' ').filter(Boolean);
      const initials =
        parts.length > 1
          ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
          : name.substring(0, 2).toUpperCase();
      const newId = 'user-' + Date.now();
      const todayStr = new Date().toLocaleDateString('pt-BR');

      // Remove apenas se já existir perfil homônimo no mesmo e-mail recém-criado; mantém isolamento por e-mail
      state.profiles.push({
        id: newId,
        name,
        shortName: parts[0],
        initials,
        role: 'Titular • Família',
        email,
        phone: '(16) 99123-4567',
        avatarBg: '#B8D4F2',
        avatarColor: '#1E40AF',
        collectionPoints: 0,
        benefitBalance: 0,
        invoicesCount: 0,
        lastInvoiceDate: todayStr,
        redeemedBenefits: [],
        invoices: [],
        transactions: [
          {
            id: 'tx-welcome-' + Date.now(),
            type: 'credit',
            title: 'Adesão Novo Clube — 1º Astro Desbloqueado!',
            subtitle: 'Astro Serviços (Amarelo)',
            points: 0,
            date: todayStr
          }
        ]
      });

      state.activeProfileId = newId;
      state.isAuthenticated = true;
      state.profileSelected = true;
      currentTab = 'inicio';
      saveState();
      renderApp(true);
    },
    selectProfile(profileId) {
      state.activeProfileId = profileId;
      state.profileSelected = true;
      currentTab = 'inicio';
      saveState();
      renderApp(true);
    },
    logout() {
      closeModal();
      state.isAuthenticated = false;
      state.profileSelected = false;
      saveState();
      renderApp(true);
    },
    setMonth(month) {
      if (state.currentMonth === month) return;
      state.currentMonth = month;
      saveState();

      // Atualiza os botões de mês sutilmente sem recarregar a página e sem nenhum alerta
      document.querySelectorAll('[data-month-pill]').forEach((btn) => {
        btn.classList.toggle('active', btn.getAttribute('data-month-pill') === month);
      });

      const benefitsSlot = document.getElementById('benefits-grid-slot');
      if (benefitsSlot) {
        benefitsSlot.innerHTML = renderBenefitsGridItems();
      }

      const astrosSlot = document.getElementById('astros-grid-slot');
      if (astrosSlot) {
        astrosSlot.innerHTML = renderAstrosGridItems(getActiveProfile());
      }
    },
    setBenefitCategory(cat) {
      if (benefitCategoryFilter === cat) return;
      benefitCategoryFilter = cat;

      document.querySelectorAll('[data-cat-pill]').forEach((btn) => {
        btn.classList.toggle('active', btn.getAttribute('data-cat-pill') === cat);
      });

      const benefitsSlot = document.getElementById('benefits-grid-slot');
      if (benefitsSlot) {
        benefitsSlot.innerHTML = renderBenefitsGridItems();
      }
    },
    setBenefitSearch(query) {
      benefitSearchQuery = query;
      // Atualiza SOMENTE o grid de resultados, mantendo o campo de busca intocado e sem piscar a tela!
      const benefitsSlot = document.getElementById('benefits-grid-slot');
      if (benefitsSlot) {
        benefitsSlot.innerHTML = renderBenefitsGridItems();
      }
    },
    setProfileSubTab(subTab) {
      if (profileSubTab === subTab && document.getElementById('profile-subcontent-slot')) return;
      profileSubTab = subTab;

      // Atualiza apenas o estado ativo na barra lateral e o bloco de sub-conteúdo, sem recarregar a tela!
      document.querySelectorAll('[data-profile-sub]').forEach((btn) => {
        btn.classList.toggle('active', btn.getAttribute('data-profile-sub') === subTab);
      });

      const subSlot = document.getElementById('profile-subcontent-slot');
      if (subSlot) {
        subSlot.innerHTML = renderProfileSubContent(getActiveProfile());
      } else {
        renderApp(false);
      }
    },
    saveProfileSettings(event) {
      event.preventDefault();
      if (
        !validateFieldLive('name', 'cfg-name', true) ||
        !validateFieldLive('email', 'cfg-email', true)
      ) {
        return;
      }

      const profile = getActiveProfile();
      const oldEmail = normalizeEmail(profile.email);
      const newName = document.getElementById('cfg-name').value.trim();
      const newEmail = normalizeEmail(document.getElementById('cfg-email').value);

      if (newName) {
        profile.name = newName;
        profile.shortName = newName.split(' ')[0];
      }
      if (newEmail) {
        // Atualiza o e-mail em todos os perfis daquela mesma conta familiar
        state.profiles.forEach((p) => {
          if (normalizeEmail(p.email) === oldEmail) {
            p.email = newEmail;
          }
        });
        state.accountEmail = newEmail;
      }
      saveState();
      profileSubTab = 'resumo';
      renderApp(true);
    },
    resetDemoData() {
      localStorage.removeItem(STORAGE_KEY);
      state = JSON.parse(JSON.stringify(window.NOVO_CLUBE_DEFAULT_DATA));
      state.isAuthenticated = true;
      state.profileSelected = true;
      currentTab = 'inicio';
      profileSubTab = 'resumo';
      saveState();
      renderApp(true);
    },
    openInvoiceModal,
    openPointsTimelineModal,
    capturePhotoFrame,
    handleFileReceipt,
    confirmInvoiceSubmit,
    redeemBenefit,
    openAstroDetailModal,
    openSwitchProfileModal,
    openNewProfileModal,
    createNewProfile,
    openNotificationsModal,
    closeModal
  };

  document.addEventListener('DOMContentLoaded', () => {
    renderApp(true);
    if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
      navigator.serviceWorker
        .register('./sw.js', { updateViaCache: 'none' })
        .then((reg) => reg.update())
        .catch(() => {});
    }
  });
})();



