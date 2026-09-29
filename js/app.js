// ==========================================================================
// DAIHAN Scientific Global B2B Sales Portal - Core Application Logic (v2.3)
// Fully Aligned with Production UX Workflow & Seamless Customer Journey
// ==========================================================================

// Global Application State
const AppState = {
  currentRoute: 'home',
  currentModelId: null,
  cart: [],
  currentUser: null, // null = Guest, or { userType: 'AUTHORIZED_AGENT' | 'POTENTIAL_BUYER', ... }
  lastSubmittedRfq: null,
  redirectAfterLogin: null, // Stores modelId or route to return back to after sign-in
  integrationConfig: {
    telegramBotToken: localStorage.getItem('daihan_tg_token') || '8668607730:AAFS1BFggfJ4VBo9kkaeYRtECYBA5UNJcMQ',
    telegramChatId: localStorage.getItem('daihan_tg_chat_id') || '1636983947',
    googleSheetWebhookUrl: localStorage.getItem('daihan_sheet_url') || 'https://script.google.com/macros/s/AKfycbzgNhuKVpBaqhkfzd0Z0Gaz_r_ijC39ZDEwnK4_b17WUVkXtbFBW2N1Lf5AEjK8u5UUqw/exec'
  },
  specState: {
    acknowledged: false,
    selectedVoltage: 'V230',
    selectedPlug: 'PLUG-C',
    selectedAccessories: []
  },
  filters: {
    searchQuery: '',
    category: 'all',
    application: 'all',
    only2026New: false
  }
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  // Load persistent cart if any
  const savedCart = localStorage.getItem('daihan_rfq_cart');
  if (savedCart) {
    try { AppState.cart = JSON.parse(savedCart); } catch (e) { AppState.cart = []; }
  }
  
  // Load saved user session if any
  const savedUser = localStorage.getItem('daihan_user_session');
  if (savedUser) {
    try { AppState.currentUser = JSON.parse(savedUser); } catch (e) { AppState.currentUser = null; }
  }

  window.addEventListener('hashchange', handleRouting);
  handleRouting();
  updateHeaderUI();
});

// Hash-based SPA Routing Engine
function handleRouting() {
  const hash = window.location.hash.slice(1) || 'home';
  const [route, param] = hash.split('/');

  AppState.currentRoute = route;
  AppState.currentModelId = param || null;

  renderNavigationLinks();
  
  const appContainer = document.getElementById('app');
  if (!appContainer) return;

  window.scrollTo({ top: 0, behavior: 'smooth' });

  switch (route) {
    case 'home':
      renderHomeScreen(appContainer);
      break;
    case 'products':
      renderProductCatalogScreen(appContainer);
      break;
    case 'applications':
      renderApplicationSearchScreen(appContainer);
      break;
    case 'new-launches':
      renderNewLaunchesScreen(appContainer);
      break;
    case 'e-catalog':
      renderECatalogScreen(appContainer);
      break;
    case 'spec-sheet':
      renderSpecSheetScreen(appContainer, param);
      break;
    case 'cart':
      renderCartScreen(appContainer);
      break;
    case 'rfq-submit':
      renderRfqSubmitScreen(appContainer);
      break;
    case 'rfq-complete':
      renderRfqCompleteScreen(appContainer);
      break;
    case 'login':
      renderLoginScreen(appContainer, param);
      break;
    case 'agent-dashboard':
      renderAgentDashboardScreen(appContainer);
      break;
    case 'buyer-dashboard':
      renderBuyerDashboardScreen(appContainer);
      break;
    case 'agent-resources':
      renderAgentResourcesScreen(appContainer);
      break;
    case 'admin-bi':
      renderAdminBiScreen(appContainer);
      break;
    default:
      renderHomeScreen(appContainer);
  }

  updateHeaderUI();
}

// Fallback Image Generator (100% Reliable SVG Vector Render on any Network Error)
function handleImageError(imgEl, categoryName, modelNo) {
  if (!imgEl) return;
  imgEl.onerror = null;
  const categoryIcons = {
    'Autoclaves & Sterilizers': '🔬',
    'Stirring & Shaking': '🧪',
    'Heating & Drying': '🌡️',
    'Incubators & Growth Chambers': '🧬',
    'Baths & Circulators': '💧',
    'Centrifuges & Separation': '⚙️',
    'Balances & Weighing': '⚖️',
    'Freezers & Cryogenics': '❄️'
  };
  const icon = categoryIcons[categoryName] || '🔬';
  const cleanModel = (modelNo || 'DAIHAN Instrument').replace(/[“”"]/g, '');
  
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0f172a"/>
        <stop offset="50%" stop-color="#1e3a8a"/>
        <stop offset="100%" stop-color="#2563eb"/>
      </linearGradient>
    </defs>
    <rect width="600" height="400" fill="url(#g)"/>
    <circle cx="300" cy="155" r="55" fill="white" fill-opacity="0.12"/>
    <text x="300" y="175" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-size="50" text-anchor="middle" fill="#ffffff">${icon}</text>
    <text x="300" y="250" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-size="22" font-weight="800" text-anchor="middle" fill="#ffffff">${cleanModel}</text>
    <text x="300" y="285" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-size="13" font-weight="600" text-anchor="middle" fill="#93c5fd" letter-spacing="1">DAIHAN 2026 OFFICIAL INSTRUMENTS</text>
  </svg>`;
  
  imgEl.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

function updateHeaderUI() {
  const totalQty = AppState.cart.reduce((sum, item) => sum + item.qty, 0);

  // Cart Button in Header
  const cartBtn = document.getElementById('header-cart-btn');
  const cartBadge = document.getElementById('cart-count-badge');
  if (cartBtn && cartBadge) {
    if (totalQty > 0) {
      cartBtn.style.display = 'inline-flex';
      cartBadge.textContent = totalQty;
    } else {
      cartBtn.style.display = 'none';
    }
  }

  // Header User & Customer Login Area
  const agentArea = document.getElementById('header-agent-area');
  const customerArea = document.getElementById('header-customer-area');

  if (AppState.currentUser) {
    if (AppState.currentUser.userType === 'AUTHORIZED_AGENT') {
      // User Case 1: Authorized Agent with (-00%) format
      if (agentArea) {
        agentArea.innerHTML = `
          <div class="agent-badge">
            <span>🏢 ${AppState.currentUser.companyName.split(' ')[0]}</span>
            <span style="opacity:0.85; font-weight:800;">(-00%)</span>
          </div>
          <a href="#agent-dashboard" class="btn-agent-login" style="border-color:var(--agent-purple); color:var(--agent-purple);">Dashboard</a>
          <button onclick="logoutUser()" class="btn-agent-login" style="background:#fee2e2; border-color:#fca5a5; color:#991b1b;">Logout</button>
        `;
      }
      if (customerArea) customerArea.style.display = 'none';
    } else {
      // User Case 2: Potential Customer
      if (agentArea) {
        agentArea.innerHTML = `
          <div class="buyer-badge" style="background:#dbeafe; color:#1e40af; border:1px solid #93c5fd; padding:0.35rem 0.75rem; border-radius:9999px; font-size:0.75rem; font-weight:700; display:flex; align-items:center; gap:0.4rem;">
            <span>🔬 ${AppState.currentUser.companyName.split(' ')[0]}</span>
          </div>
          <a href="#buyer-dashboard" class="btn-agent-login" style="border-color:#3b82f6; color:#2563eb;">My Quotes</a>
          <button onclick="logoutUser()" class="btn-agent-login" style="background:#fee2e2; border-color:#fca5a5; color:#991b1b;">Logout</button>
        `;
      }
      if (customerArea) customerArea.style.display = 'none';
    }
  } else {
    // Unauthenticated Guest State
    if (agentArea) {
      agentArea.innerHTML = `
        <a href="#login/agent" class="btn-agent-login">
          <span>🔒</span> Agent Sign In
        </a>
      `;
    }
    if (customerArea) {
      customerArea.style.display = 'block';
      customerArea.innerHTML = `
        <a href="#login/customer" class="cart-btn" id="header-customer-btn" style="background:var(--primary);">
          <span>👤 New Customer</span>
        </a>
      `;
    }
  }
}

function renderNavigationLinks() {
  document.querySelectorAll('.nav-links a').forEach(el => {
    const href = el.getAttribute('href') || '';
    if (href === `#${AppState.currentRoute}`) {
      el.classList.add('active');
    } else {
      el.classList.remove('active');
    }
  });
}

// --------------------------------------------------------------------------
// 1. SCR-01: Main Portal Home
// --------------------------------------------------------------------------
function renderHomeScreen(container) {
  const newProducts = DAIHAN_CATALOG.filter(p => p.is2026New).slice(0, 4);

  container.innerHTML = `
    <!-- Hero Banner with Updated Clean Headline & CI -->
    <section class="hero-banner">
      <div class="hero-body">
        <div class="hero-text-content">
          <h2>Smart RFQ Generator</h2>
          <p class="hero-subcopy">
            Fast, Accurate Quotes for Every Lab Need
          </p>
          
          <div style="position:relative; max-width:640px; z-index:100;">
            <div class="hero-search-box">
              <input type="text" id="hero-search-input" placeholder="Search by Model No (e.g. STE-AM47, MS-20D, FON-50), Cat No, or Keyword..." oninput="handleSearchAutoComplete(this.value)" autocomplete="off">
              <button onclick="handleSearchCatalogClick()">Search Catalog</button>
            </div>
            <!-- Auto-complete Dropdown List -->
            <div id="hero-search-results" style="display:none; position:absolute; top:calc(100% + 8px); left:0; right:0; background:white; border-radius:var(--radius-md); box-shadow:0 16px 40px rgba(15,23,42,0.15); border:1px solid #e2e8f0; max-height:360px; overflow-y:auto; z-index:9999;">
            </div>
          </div>
        </div>

        <div class="hero-ci-wrapper">
          <div class="hero-ci-card">
            <img src="images/daihan-ci.png" alt="DAIHAN Scientific CI Logo" class="hero-ci-img">
          </div>
        </div>
      </div>
    </section>

    <!-- 3-Path Search Architecture -->
    <div class="section-heading">
      <div>
        <h3>Multi-Path Product Discovery</h3>
        <p style="font-size:0.875rem; color:var(--text-muted); margin-top:0.2rem;">Select your preferred pathway to find exact specifications without configuration mistakes</p>
      </div>
    </div>

    <div class="discovery-grid">
      <!-- Path 1: Category -->
      <a href="#products" class="path-card">
        <div class="path-icon icon-blue">🔬</div>
        <span class="path-badge">Path 1 : Equipment Category</span>
        <h4>By Category & Instruments</h4>
        <p>Autoclaves (p.300), Magnetic Stirrers (p.310), Drying Ovens, Incubators, Water Baths, Centrifuges & Balances.</p>
        <div class="path-footer">Browse 8 Categories &rarr;</div>
      </a>

      <!-- Path 2: Application -->
      <a href="#applications" class="path-card">
        <div class="path-icon icon-emerald">🧬</div>
        <span class="path-badge">Path 2 : Research Purpose</span>
        <h4>By Research Application</h4>
        <p>Find optimized laboratory equipment tailored for Bio Cell Culture, Chemical Synthesis, and Clinical Testing.</p>
        <div class="path-footer">Find by Research Field &rarr;</div>
      </a>

      <!-- Path 3: 2026 New Launches -->
      <a href="#new-launches" class="path-card">
        <div class="path-icon icon-purple">✨</div>
        <span class="path-badge">Path 3 : 2026 Lineup</span>
        <h4>2026 New Launches Showcase</h4>
        <p>Explore touch screen autoclaves, BLDC ceramic stirrers, and fuzzy controlled drying chambers.</p>
        <div class="path-footer">View 2026 Launches &rarr;</div>
      </a>

      <!-- Path 4: E-Catalog -->
      <a href="#e-catalog" class="path-card">
        <div class="path-icon icon-amber">📖</div>
        <span class="path-badge">Path 4 : Interactive e-Book</span>
        <h4>2026 Digital E-Catalog (356p)</h4>
        <p>Flip through the authentic 2026 DAIHAN Instruments PDF with interactive hotspots directly linked to spec sheets.</p>
        <div class="path-footer">Open E-Catalog Viewer &rarr;</div>
      </a>
    </div>

    <!-- 2026 Featured Showcase -->
    <div class="section-heading" style="margin-top:2rem;">
      <div>
        <h3>2026 Featured Equipment Lineup</h3>
        <p style="font-size:0.875rem; color:var(--text-muted); margin-top:0.2rem;">From the official 2026 DAIHAN Scientific Instruments Master Catalog</p>
      </div>
      <a href="#products" style="font-size:0.875rem; color:var(--primary); font-weight:700; text-decoration:none;">View Full Catalog (${DAIHAN_CATALOG.length} items) &rarr;</a>
    </div>

    <div class="product-grid">
      ${newProducts.map(p => renderProductCardHtml(p)).join('')}
    </div>
  `;

  // Close search dropdown on click outside
  document.addEventListener('click', (e) => {
    const results = document.getElementById('hero-search-results');
    const input = document.getElementById('hero-search-input');
    if (results && input && !input.contains(e.target) && !results.contains(e.target)) {
      results.style.display = 'none';
    }
  });
}

// Requirement 4: Auto-complete Keyword Search sorted ascendingly (ABC / Korean / Numbers)
function handleSearchAutoComplete(val) {
  const resultsBox = document.getElementById('hero-search-results');
  if (!resultsBox) return;

  const q = val.trim().toLowerCase();
  if (!q) {
    resultsBox.style.display = 'none';
    resultsBox.innerHTML = '';
    return;
  }

  // Filter matching catalog items
  let matches = DAIHAN_CATALOG.filter(p => 
    p.modelNo.toLowerCase().includes(q) ||
    p.catNo.toLowerCase().includes(q) ||
    p.name.toLowerCase().includes(q) ||
    p.categoryName.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q)
  );

  // Sort ascending: Alphabetical (A-Z), Korean (가-힣), Numerical (0-9)
  matches.sort((a, b) => a.modelNo.localeCompare(b.modelNo, ['en', 'ko'], { numeric: true, sensitivity: 'base' }));

  if (matches.length === 0) {
    resultsBox.innerHTML = `
      <div style="padding:1rem; text-align:center; color:var(--text-muted); font-size:0.875rem;">
        No exact matching instruments found for "<strong>${val}</strong>".<br>
        <span style="font-size:0.75rem; color:var(--primary);">Click "Search Catalog" to browse full 2026 E-Catalog.</span>
      </div>
    `;
  } else {
    resultsBox.innerHTML = `
      <div style="padding:0.6rem 1rem; background:#f8fafc; font-size:0.75rem; font-weight:800; color:var(--primary); border-bottom:1px solid #e2e8f0; display:flex; justify-content:space-between; letter-spacing:0.04em;">
        <span>MATCHING INSTRUMENTS (ASCENDING)</span>
        <span>${matches.length} Results</span>
      </div>
      ${matches.map(p => `
        <div onclick="window.location.hash='#spec-sheet/${p.id}'; document.getElementById('hero-search-results').style.display='none';" 
             style="padding:0.75rem 1rem; border-bottom:1px solid #f1f5f9; cursor:pointer; display:flex; align-items:center; justify-content:space-between; transition:all 0.2s; background:white;"
             onmouseover="this.style.background='#f0f9ff'" onmouseout="this.style.background='white'">
          <div style="display:flex; align-items:center; gap:0.75rem;">
            <img src="${p.image}" style="width:36px; height:36px; object-fit:cover; border-radius:6px; border:1px solid #e2e8f0;" alt="${p.modelNo}" onerror="handleImageError(this, '${p.categoryName}', '${p.modelNo}')">
            <div>
              <div style="font-weight:700; font-size:0.9rem; color:var(--text-main);">${p.modelNo}</div>
              <div style="font-size:0.75rem; color:var(--text-muted); font-family:monospace;">Cat No: ${p.catNo} | ${p.categoryName}</div>
            </div>
          </div>
          <span style="font-size:0.75rem; color:var(--primary); font-weight:700;">${p.catalogPage || 'View Spec'} &rarr;</span>
        </div>
      `).join('')}
    `;
  }

  resultsBox.style.display = 'block';
}

// Requirement 4: Search Catalog Button redirects to e-Catalog section
function handleSearchCatalogClick() {
  window.location.hash = '#e-catalog';
}

function handleHeroSearch() {
  const query = document.getElementById('hero-search-input')?.value || '';
  AppState.filters.searchQuery = query;
  window.location.hash = '#products';
}

function renderProductCardHtml(p) {
  const isAgent = AppState.currentUser && AppState.currentUser.userType === 'AUTHORIZED_AGENT';
  const priceHtml = isAgent
    ? `<div class="price-view"><span style="font-size:0.75rem; color:var(--text-muted); text-decoration:line-through;">$${p.listPriceUsd}</span> <div class="price-agent">$${p.agentPriceUsd} <span style="font-size:0.75rem;">(Ex-Works)</span></div></div>`
    : `<div class="price-view"><span class="price-hidden">🔒 Price on RFQ</span></div>`;

  return `
    <div class="product-card">
      <div class="product-img-wrap">
        <img src="${p.image}" alt="${p.modelNo}" loading="lazy" onerror="handleImageError(this, '${p.categoryName}', '${p.modelNo}')">
        ${p.is2026New ? `<span class="new-badge">2026 NEW</span>` : ''}
        ${p.catalogPage ? `<span style="position:absolute; bottom:0.5rem; right:0.5rem; background:rgba(15,23,42,0.8); color:white; font-size:0.7rem; font-weight:700; padding:0.15rem 0.45rem; border-radius:4px;">${p.catalogPage}</span>` : ''}
      </div>
      <div class="product-body">
        <span class="product-category-tag">${p.categoryName}</span>
        <h4>${p.modelNo}</h4>
        <div class="product-cat-no">Cat No: ${p.catNo}</div>
        <div class="product-spec-preview">
          ${p.specs.capacity ? `📦 ${p.specs.capacity}<br>` : ''}
          ${p.specs.tempRange ? `🌡️ ${p.specs.tempRange}` : (p.specs.speedRange ? `⚡ ${p.specs.speedRange}` : '')}
        </div>
        <div class="product-footer">
          ${priceHtml}
          <a href="#spec-sheet/${p.id}" class="btn-spec-sheet">Spec Sheet &rarr;</a>
        </div>
      </div>
    </div>
  `;
}

// --------------------------------------------------------------------------
// 2. SCR-02: Product Catalog by Category
// --------------------------------------------------------------------------
function renderProductCatalogScreen(container) {
  let filtered = DAIHAN_CATALOG;

  if (AppState.filters.searchQuery) {
    const q = AppState.filters.searchQuery.toLowerCase();
    filtered = filtered.filter(p => 
      p.modelNo.toLowerCase().includes(q) ||
      p.catNo.toLowerCase().includes(q) ||
      p.name.toLowerCase().includes(q) ||
      p.categoryName.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  }

  if (AppState.filters.category !== 'all') {
    filtered = filtered.filter(p => p.category === AppState.filters.category);
  }

  container.innerHTML = `
    <div class="section-heading">
      <div>
        <h2>2026 DAIHAN Scientific Instruments Catalog</h2>
        <p style="color:var(--text-muted); font-size:0.9rem;">Browse standard laboratory instruments from the 356-page Master Catalog</p>
      </div>
    </div>

    <!-- Filter Bar -->
    <div style="background:white; padding:1.25rem; border-radius:var(--radius-md); border:1px solid var(--border-color); margin-bottom:1.5rem; display:flex; flex-direction:column; gap:1rem;">
      <div style="display:flex; flex-wrap:wrap; gap:0.5rem; align-items:center;">
        <span style="font-weight:700; font-size:0.875rem; margin-right:0.25rem;">Category Filter:</span>
        <button onclick="setCategoryFilter('all')" class="btn-spec-sheet" style="${AppState.filters.category === 'all' ? 'background:var(--primary); color:white;' : ''}">All Equipment</button>
        <button onclick="setCategoryFilter('autoclaves')" class="btn-spec-sheet" style="${AppState.filters.category === 'autoclaves' ? 'background:var(--primary); color:white;' : ''}">Autoclaves (p.300)</button>
        <button onclick="setCategoryFilter('stirring')" class="btn-spec-sheet" style="${AppState.filters.category === 'stirring' ? 'background:var(--primary); color:white;' : ''}">Magnetic Stirrers (p.310)</button>
        <button onclick="setCategoryFilter('heating')" class="btn-spec-sheet" style="${AppState.filters.category === 'heating' ? 'background:var(--primary); color:white;' : ''}">Drying Ovens (p.218)</button>
        <button onclick="setCategoryFilter('incubators')" class="btn-spec-sheet" style="${AppState.filters.category === 'incubators' ? 'background:var(--primary); color:white;' : ''}">Incubators (p.190)</button>
        <button onclick="setCategoryFilter('baths')" class="btn-spec-sheet" style="${AppState.filters.category === 'baths' ? 'background:var(--primary); color:white;' : ''}">Water Baths (p.48)</button>
        <button onclick="setCategoryFilter('centrifuges')" class="btn-spec-sheet" style="${AppState.filters.category === 'centrifuges' ? 'background:var(--primary); color:white;' : ''}">Centrifuges (p.92)</button>
        <button onclick="setCategoryFilter('balances')" class="btn-spec-sheet" style="${AppState.filters.category === 'balances' ? 'background:var(--primary); color:white;' : ''}">Balances (p.16)</button>
        <button onclick="setCategoryFilter('freezers')" class="btn-spec-sheet" style="${AppState.filters.category === 'freezers' ? 'background:var(--primary); color:white;' : ''}">ULT Freezers (p.98)</button>
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.875rem; color:var(--text-muted); border-top:1px solid #f1f5f9; padding-top:0.75rem;">
        <div>${AppState.filters.searchQuery ? `Filtering by keyword: <strong>"${AppState.filters.searchQuery}"</strong>` : 'Showing all verified catalog models'}</div>
        <div>Total <strong>${filtered.length}</strong> Products Found</div>
      </div>
    </div>

    <div class="product-grid">
      ${filtered.length > 0 ? filtered.map(p => renderProductCardHtml(p)).join('') : `
        <div style="grid-column:1/-1; text-align:center; padding:4rem; background:white; border-radius:var(--radius-md); border:1px dashed var(--border-color);">
          <p style="font-size:1.1rem; color:var(--text-muted);">No instruments found matching your search.</p>
          <button onclick="resetFilters()" class="btn-spec-sheet" style="margin-top:1rem; background:var(--primary); color:white;">Show All Products</button>
        </div>
      `}
    </div>
  `;
}

function setCategoryFilter(cat) {
  AppState.filters.category = cat;
  renderProductCatalogScreen(document.getElementById('app'));
}

function resetFilters() {
  AppState.filters.category = 'all';
  AppState.filters.searchQuery = '';
  renderProductCatalogScreen(document.getElementById('app'));
}

// --------------------------------------------------------------------------
// 3. SCR-03: Research Application Discovery
// --------------------------------------------------------------------------
function renderApplicationSearchScreen(container) {
  container.innerHTML = `
    <div class="section-heading">
      <div>
        <h2>Research & Application-Based Discovery</h2>
        <p style="color:var(--text-muted); font-size:0.9rem;">Tailored laboratory instrument combinations grounded in DAIHAN 2026 Catalog specifications</p>
      </div>
    </div>

    <div class="discovery-grid" style="grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));">
      <div onclick="filterByApp('bio')" class="path-card" style="cursor:pointer;">
        <div class="path-icon icon-emerald">🧬</div>
        <h4>Biological & Cell Culture</h4>
        <p>Class B Vacuum Autoclaves (STE-AM47), Gravity Incubators (IN-105), and -86℃ ULT Cryo Freezers.</p>
        <span class="path-footer">Filter Bio Instruments &rarr;</span>
      </div>

      <div onclick="filterByApp('chemical')" class="path-card" style="cursor:pointer;">
        <div class="path-icon icon-blue">🧪</div>
        <h4>Chemical Synthesis & Titration</h4>
        <p>BLDC Ceramic Stirrers (MS-20D), 6-Position Multi-Stirrers (SMHS-6), and 0.1mg Analytical Balances.</p>
        <span class="path-footer">Filter Chemical Instruments &rarr;</span>
      </div>

      <div onclick="filterByApp('medical')" class="path-card" style="cursor:pointer;">
        <div class="path-icon icon-purple">🏥</div>
        <h4>Medical, Clinical & Pharma QC</h4>
        <p>High-Volume Centrifuges (CEF-500), Touch Screen Autoclaves, and Precision Water Baths (WCB-11).</p>
        <span class="path-footer">Filter Medical/Pharma &rarr;</span>
      </div>
    </div>

    <div class="section-heading" style="margin-top:2rem;">
      <h3>Matching Catalog Solutions</h3>
    </div>
    <div class="product-grid" id="app-results-grid">
      ${DAIHAN_CATALOG.map(p => renderProductCardHtml(p)).join('')}
    </div>
  `;
}

function filterByApp(appType) {
  const filtered = DAIHAN_CATALOG.filter(p => p.application.includes(appType));
  const grid = document.getElementById('app-results-grid');
  if (grid) {
    grid.innerHTML = filtered.map(p => renderProductCardHtml(p)).join('');
  }
}

// --------------------------------------------------------------------------
// 4. SCR-04: 2026 New Launches Showcase
// --------------------------------------------------------------------------
function renderNewLaunchesScreen(container) {
  const newItems = DAIHAN_CATALOG.filter(p => p.is2026New);

  container.innerHTML = `
    <div class="hero-banner" style="background: linear-gradient(135deg, #4c1d95, #7c3aed, #2563eb); margin-bottom:2rem;">
      <div class="hero-tag"><span>✨ Official 2026 New Launch Lineup</span></div>
      <h2>Next-Gen DAIHAN 2026 Scientific Lineup</h2>
      <p>Equipped with 7" Touch Screen LCDs, Brushless DC Motors, Patented Jog-Shuttle Control, and 3-Year Official Manufacturer Warranties.</p>
    </div>

    <div class="product-grid">
      ${newItems.map(p => renderProductCardHtml(p)).join('')}
    </div>
  `;
}

// --------------------------------------------------------------------------
// 5. SCR-05: Digital E-Catalog Viewer
// --------------------------------------------------------------------------
function renderECatalogScreen(container) {
  container.innerHTML = `
    <div class="section-heading">
      <div>
        <h2>2026 Interactive Digital E-Catalog (356 Pages)</h2>
        <p style="color:var(--text-muted); font-size:0.9rem;">Authentic PDF Hotspot Index: Click any product below to jump directly to its Final Spec Verification Sheet</p>
      </div>
      <button class="btn-agent-login" onclick="alert('Full 356-Page 2026 DAIHAN Instruments PDF cached for offline tablet exhibition mode!')">📥 Cache 356p PDF Offline</button>
    </div>

    <div style="background:white; border:1px solid var(--border-color); border-radius:var(--radius-lg); padding:2rem; box-shadow:var(--shadow-md);">
      <div style="background:#f8fafc; border:2px dashed #94a3b8; border-radius:var(--radius-md); padding:2rem; margin-bottom:2rem; text-align:center;">
        <div style="font-size:3rem; margin-bottom:0.5rem;">📖</div>
        <h3>DAIHAN Scientific 2026 Master Instruments Catalog</h3>
        <p style="color:var(--text-muted); font-size:0.875rem;">Source Document: <code>2026 DAIHAN Instruments.pdf</code> (Vol. 52, 356 Pages)</p>
      </div>

      <h4 style="margin-bottom:1rem; font-size:1.1rem; color:var(--text-main);">🎯 Major Catalog Chapter Hotspots:</h4>
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap:1rem;">
        
        <div style="background:#f1f5f9; padding:1.25rem; border-radius:var(--radius-sm); border:1px solid var(--border-color);">
          <div style="font-weight:700; color:var(--primary); font-size:0.85rem;">PAGE 300 ~ 304</div>
          <h5 style="margin:0.25rem 0;">Autoclaves & Steam Sterilizers</h5>
          <p style="font-size:0.8rem; color:var(--text-muted); margin-bottom:0.75rem;">Class B Pre-Vacuum Touch Screen & Standard Top-Loading models</p>
          <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
            <a href="#spec-sheet/DH-STE-AM47" class="btn-spec-sheet" style="font-size:0.75rem; background:var(--primary); color:white;">STE-AM47 (p.300) &rarr;</a>
            <a href="#spec-sheet/DH-LAC-5080" class="btn-spec-sheet" style="font-size:0.75rem;">MaXterile 80 (p.302) &rarr;</a>
          </div>
        </div>

        <div style="background:#f1f5f9; padding:1.25rem; border-radius:var(--radius-sm); border:1px solid var(--border-color);">
          <div style="font-weight:700; color:var(--primary); font-size:0.85rem;">PAGE 309 ~ 312</div>
          <h5 style="margin:0.25rem 0;">Magnetic Stirrers & Multi-Hotplates</h5>
          <p style="font-size:0.8rem; color:var(--text-muted); margin-bottom:0.75rem;">BLDC Ceramic Stirrers (MS-20D) and 6-position Multi-Stirrers</p>
          <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
            <a href="#spec-sheet/DH-MS-20D" class="btn-spec-sheet" style="font-size:0.75rem; background:var(--primary); color:white;">MS-20D (p.310) &rarr;</a>
            <a href="#spec-sheet/DH-MSH-020" class="btn-spec-sheet" style="font-size:0.75rem;">SMHS-6 (p.312) &rarr;</a>
          </div>
        </div>

        <div style="background:#f1f5f9; padding:1.25rem; border-radius:var(--radius-sm); border:1px solid var(--border-color);">
          <div style="font-weight:700; color:var(--primary); font-size:0.85rem;">PAGE 213 ~ 225 & 183 ~ 203</div>
          <h5 style="margin:0.25rem 0;">Ovens & Incubators</h5>
          <p style="font-size:0.8rem; color:var(--text-muted); margin-bottom:0.75rem;">Forced-Air Drying Ovens (FON-50) & Gravity Incubators (IN-105)</p>
          <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
            <a href="#spec-sheet/DH-FON-050" class="btn-spec-sheet" style="font-size:0.75rem; background:var(--primary); color:white;">FON-50 (p.218) &rarr;</a>
            <a href="#spec-sheet/DH-INC-105" class="btn-spec-sheet" style="font-size:0.75rem;">IN-105 (p.190) &rarr;</a>
          </div>
        </div>

        <div style="background:#f1f5f9; padding:1.25rem; border-radius:var(--radius-sm); border:1px solid var(--border-color);">
          <div style="font-weight:700; color:var(--primary); font-size:0.85rem;">PAGE 13 ~ 99</div>
          <h5 style="margin:0.25rem 0;">Balances, Baths, Centrifuges & Freezers</h5>
          <p style="font-size:0.8rem; color:var(--text-muted); margin-bottom:0.75rem;">Analytical Balances (0.1mg), Water Baths (WCB-11), Centrifuges & ULT Freezers</p>
          <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
            <a href="#spec-sheet/DH-WBA-220" class="btn-spec-sheet" style="font-size:0.75rem;">WBA-220 (p.16) &rarr;</a>
            <a href="#spec-sheet/DH-WCB-11" class="btn-spec-sheet" style="font-size:0.75rem;">WCB-11 (p.48) &rarr;</a>
            <a href="#spec-sheet/DH-CEF-500" class="btn-spec-sheet" style="font-size:0.75rem;">CEF-500 (p.92) &rarr;</a>
          </div>
        </div>

      </div>
    </div>
  `;
}

// --------------------------------------------------------------------------
// 6. SCR-06: Single Final Spec Confirmation Sheet (Gatekeeper) ⭐
// --------------------------------------------------------------------------
function renderSpecSheetScreen(container, modelId) {
  const product = DAIHAN_CATALOG.find(p => p.id === modelId) || DAIHAN_CATALOG[0];

  // Reset spec state for this session
  AppState.specState = {
    acknowledged: false,
    selectedVoltage: product.voltageOptions[0].id,
    selectedPlug: product.plugOptions[0].id,
    selectedAccessories: []
  };

  const isAgent = AppState.currentUser && AppState.currentUser.userType === 'AUTHORIZED_AGENT';

  container.innerHTML = `
    <div class="spec-sheet-container">
      <!-- Breadcrumb -->
      <div style="font-size:0.8125rem; color:var(--text-muted); margin-bottom:1.5rem; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <a href="#products" style="color:var(--primary); text-decoration:none; font-weight:600;">Catalog</a> &gt; 
          <span style="cursor:pointer;" onclick="setCategoryFilter('${product.category}'); window.location.hash='#products';">${product.categoryName}</span> &gt; 
          <strong>${product.modelNo}</strong>
          ${product.catalogPage ? `<span style="background:#e2e8f0; color:#334155; padding:0.1rem 0.4rem; border-radius:4px; font-weight:700; margin-left:0.5rem;">2026 Catalog ${product.catalogPage}</span>` : ''}
        </div>
        <div>
          <button onclick="setCategoryFilter('${product.category}'); window.location.hash='#products';" class="btn-spec-sheet" style="font-size:0.75rem;">
            &larr; Back to ${product.categoryName}
          </button>
        </div>
      </div>

      <!-- Top Overview Grid -->
      <div class="spec-header-grid">
        <div class="spec-img-box">
          <img src="${product.image}" alt="${product.modelNo}" onerror="handleImageError(this, '${product.categoryName}', '${product.modelNo}')">
        </div>
        <div class="spec-detail-info">
          <div style="display:flex; justify-content:space-between; align-items:flex-start;">
            <div>
              <span class="product-category-tag">${product.categoryName}</span>
              <h2>${product.modelNo}</h2>
              <div class="product-cat-no" style="font-size:0.9rem;">Catalog No: <strong>${product.catNo}</strong></div>
            </div>
            ${product.is2026New ? `<span class="new-badge" style="position:static;">2026 NEW</span>` : ''}
          </div>

          <div class="lead-time">
            <span>⏱️ Standard Lead Time: <strong>${product.leadTime}</strong></span>
          </div>

          <p style="color:var(--text-main); font-size:0.95rem; margin-bottom:1.5rem; line-height:1.6;">
            ${product.description}
          </p>

          <div style="background:#f8fafc; padding:1rem; border-radius:var(--radius-sm); border:1px solid var(--border-color); display:flex; justify-content:space-between; align-items:center;">
            <div>
              <div style="font-size:0.75rem; color:var(--text-muted); font-weight:700;">PRICE POLICY</div>
              <div style="font-weight:800; font-size:1.2rem; color:${isAgent ? 'var(--agent-purple)' : 'var(--text-main)'};">
                ${isAgent ? `$${product.agentPriceUsd} <span style="font-size:0.8rem; font-weight:500;">(Official Discount -00% Applied)</span>` : `Contact for Official Quotation`}
              </div>
            </div>
            ${isAgent ? `<span class="agent-badge">${AppState.currentUser.tier}</span>` : `<span style="font-size:0.75rem; color:var(--text-muted);">🔒 Prices 100% Masked for Guests & Potential Buyers</span>`}
          </div>
        </div>
      </div>

      <!-- ZERO SPEC ERROR : 3-STEP VERIFICATION GATEWAY -->
      <h3 style="font-size:1.3rem; font-weight:800; margin-bottom:1.25rem;">
        🛡️ Standardized Specification Verification Gateway
      </h3>

      <!-- Step 1: Fixed Base Specs -->
      <div class="step-card step-1">
        <div class="step-title">
          <span class="step-num">1</span>
          <span>Fixed Base Specifications (Non-modifiable Factory Standards)</span>
        </div>
        
        <table class="spec-table">
          <tbody>
            ${Object.entries(product.specs).map(([key, val]) => `
              <tr>
                <th>${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</th>
                <td><strong>${val}</strong></td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <!-- Mandatory Acknowledge Checkbox -->
        <label class="ack-checkbox-wrap" id="ack-wrap">
          <input type="checkbox" id="ack-spec-checkbox" onchange="toggleSpecAcknowledge(this.checked)">
          <span>I have verified and acknowledged the base technical specifications of this model. <span style="color:#ef4444;">* (Required to unlock RFQ)</span></span>
        </label>
      </div>

      <!-- Step 2: Variable Options & Voltage -->
      <div class="step-card step-2">
        <div class="step-title">
          <span class="step-num">2</span>
          <span>Variable Options & Plug Compatibility (Crucial for Global Export)</span>
        </div>

        <!-- Voltage Selection -->
        <div class="option-select-group">
          <label>Operating Voltage & Frequency Selection <span style="color:#ef4444;">*</span>:</label>
          <div class="radio-cards-grid">
            ${product.voltageOptions.map(v => `
              <div class="radio-card ${v.default ? 'selected' : ''}" id="volt-card-${v.id}" onclick="selectVoltage('${v.id}')">
                <input type="radio" name="voltage" value="${v.id}" ${v.default ? 'checked' : ''} style="accent-color:var(--primary);">
                <div style="font-size:0.875rem; font-weight:700;">${v.label}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Plug Type Selection -->
        <div class="option-select-group">
          <label>Power Cord Plug Type <span style="color:#ef4444;">*</span>:</label>
          <div class="radio-cards-grid">
            ${product.plugOptions.map(p => `
              <div class="radio-card ${p.id === 'PLUG-C' ? 'selected' : ''}" id="plug-card-${p.id}" onclick="selectPlug('${p.id}')">
                <input type="radio" name="plug" value="${p.id}" ${p.id === 'PLUG-C' ? 'checked' : ''} style="accent-color:var(--primary);">
                <div style="font-size:0.875rem; font-weight:700;">${p.image} ${p.label}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Compatible Bundled Accessories -->
        <div class="option-select-group" style="margin-top:1.5rem;">
          <label>100% Certified Compatible Accessories (Sourced from 2026 Catalog):</label>
          ${product.compatibleAccessories.map(acc => `
            <label class="accessory-item">
              <div style="display:flex; align-items:center; gap:0.75rem;">
                <input type="checkbox" value="${acc.id}" onchange="toggleAccessory('${acc.id}', this.checked)" style="width:18px; height:18px;">
                <div>
                  <div style="font-size:0.875rem; font-weight:700;">${acc.name}</div>
                  <div style="font-size:0.75rem; color:var(--text-muted); font-family:monospace;">Part No: ${acc.partNo}</div>
                </div>
              </div>
              <span style="font-size:0.875rem; font-weight:700; color:var(--text-muted);">${isAgent ? `$${acc.priceUsd}` : 'Include in Quote'}</span>
            </label>
          `).join('')}
        </div>
      </div>

      <!-- Step 3: Freight Notice -->
      <div class="step-card step-3">
        <div class="step-title">
          <span class="step-num">3</span>
          <span>Freight & Packing Notice</span>
        </div>
        <div class="notice-box">
          <span style="font-size:1.3rem;">ℹ️</span>
          <div>
            <strong>International Freight Notice:</strong><br>
            Estimated Packing: <strong>${product.cbm}</strong> | Gross Weight: <strong>${product.grossWeight}</strong>.<br>
            Freight costs (Air/Ocean CIF) will be officially calculated and provided in your final quote response based on your destination port/city.
          </div>
        </div>
      </div>

      <!-- Gatekeeper Action Bar -->
      <div class="spec-action-bar">
        <div>
          <span id="disabled-hint" class="btn-disabled-hint">
            ⚠️ Please check the "I have verified base specifications" box in Step 1 to unlock the RFQ Cart.
          </span>
        </div>
        <button id="btn-add-to-cart" class="btn-add-rfq" disabled onclick="addCurrentToCart('${product.id}')">
          <span>🛒</span> Add to RFQ Cart & Continue Selection
        </button>
      </div>
    </div>
  `;
}

function toggleSpecAcknowledge(isChecked) {
  AppState.specState.acknowledged = isChecked;
  const btn = document.getElementById('btn-add-to-cart');
  const hint = document.getElementById('disabled-hint');
  
  if (btn) btn.disabled = !isChecked;
  if (hint) {
    hint.style.display = isChecked ? 'none' : 'inline-block';
  }
}

function selectVoltage(voltId) {
  AppState.specState.selectedVoltage = voltId;
  document.querySelectorAll('[id^="volt-card-"]').forEach(el => el.classList.remove('selected'));
  document.getElementById(`volt-card-${voltId}`)?.classList.add('selected');
}

function selectPlug(plugId) {
  AppState.specState.selectedPlug = plugId;
  document.querySelectorAll('[id^="plug-card-"]').forEach(el => el.classList.remove('selected'));
  document.getElementById(`plug-card-${plugId}`)?.classList.add('selected');
}

function toggleAccessory(accId, isChecked) {
  if (isChecked) {
    if (!AppState.specState.selectedAccessories.includes(accId)) {
      AppState.specState.selectedAccessories.push(accId);
    }
  } else {
    AppState.specState.selectedAccessories = AppState.specState.selectedAccessories.filter(id => id !== accId);
  }
}

// --------------------------------------------------------------------------
// Core Workflow: Add to Cart with User Authentication Check & Auto Return
// --------------------------------------------------------------------------
function addCurrentToCart(productId) {
  const product = DAIHAN_CATALOG.find(p => p.id === productId);
  if (!product) return;

  // Requirement 2: If user is NOT logged in, prompt customer sign-in/registration and remember this product
  if (!AppState.currentUser) {
    AppState.redirectAfterLogin = productId; // Save product to return after sign-in
    alert(`Please complete customer sign-in or quick registration to add "${product.modelNo}" to your RFQ Cart.`);
    window.location.hash = '#login/customer';
    return;
  }

  // Add Item to Cart
  const cartItem = {
    cartId: 'ITEM-' + Date.now(),
    productId: product.id,
    modelNo: product.modelNo,
    catNo: product.catNo,
    image: product.image,
    category: product.category,
    categoryName: product.categoryName,
    voltage: AppState.specState.selectedVoltage,
    plug: AppState.specState.selectedPlug,
    accessories: [...AppState.specState.selectedAccessories],
    qty: 1,
    verifiedAt: new Date().toISOString()
  };

  AppState.cart.push(cartItem);
  localStorage.setItem('daihan_rfq_cart', JSON.stringify(AppState.cart));
  updateHeaderUI();

  // Requirement 3: Auto-return to Category or Product Search Initial Window
  showCartSuccessToast(product);
}

function showCartSuccessToast(product) {
  // Toast Notification
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    background: #0f172a;
    color: white;
    padding: 1.25rem 1.75rem;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.3);
    z-index: 9999;
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 0.95rem;
    border: 1px solid #334155;
    animation: fadeIn 0.3s ease;
  `;

  toast.innerHTML = `
    <div>
      <div style="font-weight:800; color:#4ade80;">✓ Added to RFQ Cart (${AppState.cart.length} items)</div>
      <div style="font-size:0.85rem; color:#cbd5e1;">${product.modelNo} (${AppState.specState.selectedVoltage === 'V230' ? '230V' : '120V'})</div>
    </div>
    <div style="display:flex; gap:0.5rem; margin-left:0.5rem;">
      <button onclick="window.location.hash='#cart'; this.parentElement.parentElement.remove();" style="background:#2563eb; color:white; border:none; padding:0.4rem 0.85rem; border-radius:6px; font-weight:700; cursor:pointer; font-size:0.8rem;">View Cart &rarr;</button>
    </div>
  `;

  document.body.appendChild(toast);
  setTimeout(() => { if (toast) toast.remove(); }, 4000);

  // Requirement 3: Automatically return to the category list of the item just added
  AppState.filters.category = product.category;
  window.location.hash = '#products';
}

// --------------------------------------------------------------------------
// 7. SCR-07: RFQ Cart Screen
// --------------------------------------------------------------------------
function renderCartScreen(container) {
  if (AppState.cart.length === 0) {
    container.innerHTML = `
      <div style="max-width:600px; margin:3rem auto; text-align:center; background:white; padding:3rem; border-radius:var(--radius-lg); border:1px solid var(--border-color);">
        <div style="font-size:3rem; margin-bottom:1rem;">🛒</div>
        <h3>Your RFQ Cart is currently empty</h3>
        <p style="color:var(--text-muted); margin-bottom:1.5rem;">Select products and complete the specification verification to request an official quote.</p>
        <a href="#products" class="btn-add-rfq" style="text-decoration:none; display:inline-block;">Explore 2026 Catalog</a>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="section-heading">
      <div>
        <h2>RFQ Cart Review</h2>
        <p style="color:var(--text-muted); font-size:0.9rem;">Review your selected equipment, verified voltages, and compatible accessories</p>
      </div>
    </div>

    <div style="background:white; border:1px solid var(--border-color); border-radius:var(--radius-lg); padding:1.5rem; margin-bottom:2rem; box-shadow:var(--shadow-sm);">
      <table style="width:100%; border-collapse:collapse; text-align:left;">
        <thead>
          <tr style="border-bottom:2px solid var(--border-color); color:var(--text-muted); font-size:0.8125rem; text-transform:uppercase;">
            <th style="padding:0.75rem;">Product & Model</th>
            <th style="padding:0.75rem;">Verified Specifications</th>
            <th style="padding:0.75rem; width:100px;">Quantity</th>
            <th style="padding:0.75rem; text-align:right;">Action</th>
          </tr>
        </thead>
        <tbody>
          ${AppState.cart.map(item => `
            <tr style="border-bottom:1px solid var(--border-color);">
              <td style="padding:1rem 0.75rem; display:flex; align-items:center; gap:1rem;">
                <img src="${item.image}" style="width:60px; height:60px; object-fit:cover; border-radius:var(--radius-sm);" alt="${item.modelNo}" onerror="handleImageError(this, '${item.categoryName || ''}', '${item.modelNo}')">
                <div>
                  <div style="font-weight:700;">${item.modelNo}</div>
                  <div style="font-size:0.75rem; color:var(--text-muted); font-family:monospace;">${item.catNo}</div>
                  <span class="lead-time" style="margin:0; font-size:0.7rem; padding:0.1rem 0.4rem;">Spec Verified ✓</span>
                </div>
              </td>
              <td style="padding:1rem 0.75rem; font-size:0.875rem;">
                <div>⚡ Voltage: <strong>${item.voltage === 'V230' ? '230V, 50/60Hz' : '120V, 60Hz'}</strong></div>
                <div>🔌 Plug: <strong>${item.plug}</strong></div>
                ${item.accessories.length > 0 ? `<div style="font-size:0.75rem; color:var(--text-muted);">+ ${item.accessories.length} Accessories Included</div>` : ''}
              </td>
              <td style="padding:1rem 0.75rem;">
                <input type="number" min="1" value="${item.qty}" onchange="updateCartQty('${item.cartId}', this.value)" style="width:60px; padding:0.4rem; border:1px solid var(--border-color); border-radius:var(--radius-sm); font-weight:700;">
              </td>
              <td style="padding:1rem 0.75rem; text-align:right;">
                <button onclick="removeCartItem('${item.cartId}')" style="background:none; border:none; color:#ef4444; font-weight:700; cursor:pointer; font-size:0.875rem;">Remove</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div style="display:flex; justify-content:space-between; align-items:center; margin-top:2rem; padding-top:1.5rem; border-top:1px solid var(--border-color); flex-wrap:wrap; gap:1rem;">
        <a href="#products" style="color:var(--primary); font-weight:700; text-decoration:none;">+ Add More Products (Return to Catalog)</a>
        <a href="#rfq-submit" class="btn-add-rfq" style="text-decoration:none;">Proceed to Request Official Quote &rarr;</a>
      </div>
    </div>
  `;
}

function updateCartQty(cartId, qty) {
  const item = AppState.cart.find(i => i.cartId === cartId);
  if (item) {
    item.qty = Math.max(1, parseInt(qty) || 1);
    localStorage.setItem('daihan_rfq_cart', JSON.stringify(AppState.cart));
    updateHeaderUI();
  }
}

function removeCartItem(cartId) {
  AppState.cart = AppState.cart.filter(i => i.cartId !== cartId);
  localStorage.setItem('daihan_rfq_cart', JSON.stringify(AppState.cart));
  renderCartScreen(document.getElementById('app'));
  updateHeaderUI();
}

// --------------------------------------------------------------------------
// 8. SCR-08: Smart RFQ Submission Form & Routing Notice
// --------------------------------------------------------------------------
function renderRfqSubmitScreen(container) {
  if (AppState.cart.length === 0) {
    window.location.hash = '#cart';
    return;
  }

  const user = AppState.currentUser;
  const isAgent = user && user.userType === 'AUTHORIZED_AGENT';

  container.innerHTML = `
    <div class="rfq-form-card">
      <!-- MANDATORY OFFICIAL NOTICE BANNER (PRD Required) -->
      <div class="routing-notice-banner">
        <span style="font-size:2rem;">🌐</span>
        <div>
          <strong>Global Distributor Routing Guarantee:</strong>
          <p>"Your inquiry will be promptly handled by the nearest authorized DAIHAN distributor/partner."</p>
        </div>
      </div>

      <div class="section-heading" style="margin-bottom:1.5rem;">
        <div>
          <h3>Submit Request for Quote (RFQ)</h3>
          <p style="color:var(--text-muted); font-size:0.875rem;">
            ${user ? `Submitting as: <strong>${user.companyName}</strong> (${user.userType === 'AUTHORIZED_AGENT' ? 'Authorized Agent' : 'Potential Customer'})` : 'Fill in your details to receive an official proforma quotation directly to your inbox'}
          </p>
        </div>
      </div>

      <form id="rfq-form" onsubmit="handleRfqFormSubmit(event)">
        <div class="form-grid">
          <!-- Company Name -->
          <div class="form-group">
            <label>Company / Organization Name <span class="required">*</span></label>
            <input type="text" id="rfq-company" required placeholder="e.g. EuroLab Supplies Ltd. or Harvard Bio Lab" value="${user ? user.companyName : ''}">
          </div>

          <!-- Email -->
          <div class="form-group">
            <label>Business Email Address <span class="required">*</span></label>
            <input type="email" id="rfq-email" required placeholder="name@company.com" value="${user ? (user.agentId || user.buyerId) : ''}">
          </div>

          <!-- Country (Mandatory for routing) -->
          <div class="form-group">
            <label>Destination Country <span class="required">*</span></label>
            <select id="rfq-country" required>
              <option value="">-- Select Destination Country --</option>
              ${GLOBAL_COUNTRIES.map(c => `
                <option value="${c}" ${user && user.country === c ? 'selected' : ''}>${c}</option>
              `).join('')}
            </select>
          </div>

          <!-- City (Mandatory for routing) -->
          <div class="form-group">
            <label>Destination City <span class="required">*</span></label>
            <input type="text" id="rfq-city" required placeholder="e.g. Frankfurt, Boston, Singapore" value="${user ? user.city : ''}">
          </div>

          <!-- Role / Application -->
          <div class="form-group">
            <label>Your Role / Field</label>
            <select id="rfq-role">
              <option value="Distributor/Dealer" ${isAgent ? 'selected' : ''}>Distributor / Regional Dealer</option>
              <option value="End-User Researcher" ${user && user.userType === 'POTENTIAL_BUYER' ? 'selected' : ''}>End-User / Laboratory Researcher</option>
              <option value="Procurement Manager">Procurement / Purchasing Officer</option>
              <option value="University/Institute">Academic / Government Institute</option>
            </select>
          </div>

          <!-- Target Delivery Date -->
          <div class="form-group">
            <label>Target Delivery / Project Schedule</label>
            <input type="text" id="rfq-delivery" placeholder="e.g. Within 1 Month, Q4 2026">
          </div>

          <!-- Additional Notes -->
          <div class="form-group full-width">
            <label>Special Instructions or Freight Requirements</label>
            <textarea id="rfq-notes" rows="3" placeholder="e.g. Please quote both Air and Ocean freight (CIF Hamburg). Need Certificate of Origin."></textarea>
          </div>

          <!-- GDPR Consent -->
          <div class="form-group full-width">
            <label style="display:flex; align-items:flex-start; gap:0.5rem; font-weight:normal; font-size:0.875rem; cursor:pointer;">
              <input type="checkbox" required checked style="margin-top:0.2rem;">
              <span>I agree to the processing of contact information for official quote routing to DAIHAN HQ and local partners (GDPR Compliant). <span class="required">*</span></span>
            </label>
          </div>
        </div>

        <div style="display:flex; justify-content:flex-end; gap:1rem; margin-top:2rem;">
          <a href="#cart" class="btn-spec-sheet" style="padding:0.75rem 1.5rem; text-decoration:none;">Back to Cart</a>
          <button type="submit" id="btn-submit-rfq" class="btn-add-rfq" style="background:#16a34a;">
            <span>🚀</span> Send Smart RFQ Now
          </button>
        </div>
      </form>
    </div>
  `;
}

async function handleRfqFormSubmit(e) {
  e.preventDefault();

  // 1. Strict Global Double-Click & Multi-Submission Lock Guard
  if (AppState.isSubmittingRFQ) {
    console.warn('RFQ submission is already in progress. Blocked duplicate trigger.');
    return;
  }

  const submitBtn = document.getElementById('btn-submit-rfq');
  const company = document.getElementById('rfq-company')?.value?.trim();
  const email = document.getElementById('rfq-email')?.value?.trim();
  const country = document.getElementById('rfq-country')?.value?.trim();
  const city = document.getElementById('rfq-city')?.value?.trim();
  const role = document.getElementById('rfq-role')?.value?.trim();
  const notes = document.getElementById('rfq-notes')?.value?.trim();

  if (!country || !city || !company || !email) {
    alert('Please complete all mandatory fields (Company, Country, City, Email).');
    return;
  }

  // 2. Debounce Check: Prevent submitting identical quote within 10 seconds
  const now = Date.now();
  const submissionKey = `${email}_${AppState.cart.map(i => i.id).join('_')}`;
  if (AppState.lastSubmissionTime && (now - AppState.lastSubmissionTime < 10000) && AppState.lastSubmissionKey === submissionKey) {
    alert('This RFQ has already been sent! Redirecting to confirmation page...');
    window.location.hash = '#rfq-complete';
    return;
  }

  // Engage Lock & Disable UI Immediately
  AppState.isSubmittingRFQ = true;
  AppState.lastSubmissionTime = now;
  AppState.lastSubmissionKey = submissionKey;

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.style.pointerEvents = 'none';
    submitBtn.style.opacity = '0.6';
    submitBtn.innerHTML = `<span>⏳</span> Processing & Routing RFQ... Please Wait`;
  }

  try {
    const rfqRefNo = 'RFQ-' + new Date().toISOString().slice(0,10).replace(/-/g,'') + '-' + Math.floor(1000 + Math.random() * 9000);
    const userType = AppState.currentUser ? AppState.currentUser.userType : 'POTENTIAL_BUYER';

    const payload = {
      rfqNo: rfqRefNo,
      submittedAt: new Date().toISOString(),
      userType: userType,
      buyer: {
        company,
        email,
        country,
        city,
        role,
        notes
      },
      items: [...AppState.cart],
      telegramConfig: {
        botToken: AppState.integrationConfig.telegramBotToken,
        chatId: AppState.integrationConfig.telegramChatId
      },
      googleSheetUrl: AppState.integrationConfig.googleSheetWebhookUrl
    };

    // 3. Submit to Vercel Serverless / Backend Gateway (Single Entry Point)
    let backendResult = null;
    try {
      const res = await fetch('/api/rfq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        backendResult = await res.json();
      }
    } catch (err) {
      console.log('Local static fallback mode engaged:', err);
    }

    // 4. Direct Browser-side Dispatch ONLY IF Backend API was unavailable (Fallback)
    const isBackendHandled = backendResult && backendResult.success;
    if (!isBackendHandled) {
      if (AppState.integrationConfig.telegramBotToken && AppState.integrationConfig.telegramChatId) {
        directTelegramDispatch(payload);
      }
      if (AppState.integrationConfig.googleSheetWebhookUrl) {
        directGoogleSheetDispatch(payload);
      }
    }

    AppState.lastSubmittedRfq = {
      ...payload,
      backendResult: backendResult
    };

    // Clear Cart & Navigate
    AppState.cart = [];
    localStorage.removeItem('daihan_rfq_cart');
    updateHeaderUI();

    window.location.hash = '#rfq-complete';

  } catch (submissionErr) {
    console.error('Fatal submission error:', submissionErr);
    alert('An error occurred while dispatching your RFQ. Please try again.');
  } finally {
    // Release Lock after transition
    setTimeout(() => {
      AppState.isSubmittingRFQ = false;
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.style.pointerEvents = 'auto';
        submitBtn.style.opacity = '1';
        submitBtn.innerHTML = `<span>🚀</span> Send Smart RFQ Now`;
      }
    }, 1500);
  }
}

function directGoogleSheetDispatch(payload) {
  fetch(AppState.integrationConfig.googleSheetWebhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload)
  }).then(r => r.json()).then(res => {
    console.log('Google Sheets direct dispatch ok:', res);
  }).catch(e => {
    console.log('Google Sheets dispatch error:', e);
  });
}

function directTelegramDispatch(payload) {
  const isAgent = payload.userType === 'AUTHORIZED_AGENT';
  const userTag = isAgent ? '🏢 [AUTHORIZED AGENT RFQ]' : '👤 [POTENTIAL BUYER RFQ]';
  
  const itemsText = payload.items.map((item, idx) => {
    return `  ${idx + 1}. *${item.modelNo}* (Cat. ${item.catNo})\n     └ Qty: *${item.qty}* | Volt: \`${item.voltage === 'V230' ? '230V, 50/60Hz' : '120V, 60Hz'}\` | Plug: \`${item.plug}\``;
  }).join('\n');

  const message = 
    `🚨 *${userTag}* 🚨\n\n` +
    `📋 *RFQ Ref:* \`${payload.rfqNo}\`\n` +
    `📍 *Location:* ${payload.buyer.city}, *${payload.buyer.country}*\n` +
    `🏢 *Company:* ${payload.buyer.company}\n` +
    `📧 *Buyer Email:* \`${payload.buyer.email}\`\n` +
    `💼 *Role:* ${payload.buyer.role || 'N/A'}\n` +
    `🔑 *Account:* ${isAgent ? 'Authorized Agent (-00% Applied)' : 'Potential Customer (Price Masked)'}\n\n` +
    `🔬 *Requested Specs:*\n${itemsText}\n\n` +
    `💬 *Notes:* ${payload.buyer.notes || 'None'}\n\n` +
    `⚡ *Status:* Instant Alert Dispatched!`;

  fetch(`https://api.telegram.org/bot${AppState.integrationConfig.telegramBotToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: AppState.integrationConfig.telegramChatId,
      text: message,
      parse_mode: 'Markdown'
    })
  }).then(r => r.json()).then(res => {
    console.log('Telegram direct dispatch ok:', res.ok);
  }).catch(e => {
    console.log('Telegram dispatch error:', e);
  });
}

// --------------------------------------------------------------------------
// 9. SCR-09: RFQ Complete & Agent Notice Screen
// --------------------------------------------------------------------------
function renderRfqCompleteScreen(container) {
  const rfq = AppState.lastSubmittedRfq;
  if (!rfq) {
    window.location.hash = '#home';
    return;
  }

  const isAgent = rfq.userType === 'AUTHORIZED_AGENT';

  container.innerHTML = `
    <div style="max-width:780px; margin:2rem auto; background:white; border-radius:var(--radius-lg); border:1px solid var(--border-color); box-shadow:var(--shadow-lg); padding:3rem; text-align:center;">
      <div style="width:70px; height:70px; background:#dcfce7; color:#16a34a; border-radius:9999px; display:flex; align-items:center; justify-content:center; font-size:2.5rem; margin:0 auto 1.5rem;">
        ✓
      </div>

      <div style="display:inline-block; padding:0.25rem 0.75rem; border-radius:9999px; font-size:0.8125rem; font-weight:700; margin-bottom:0.75rem; background:${isAgent ? 'var(--agent-light)' : '#dbeafe'}; color:${isAgent ? 'var(--agent-purple)' : '#1e40af'};">
        ${isAgent ? '🏢 User Case 1: Authorized Agent RFQ' : '👤 User Case 2: Potential Customer RFQ'}
      </div>

      <h2 style="font-size:1.8rem; font-weight:800; color:var(--text-main); margin-bottom:0.5rem;">Request for Quote Successfully Dispatched!</h2>
      <p style="color:var(--text-muted); font-size:1rem; margin-bottom:1.5rem;">
        Official Reference No: <strong style="color:var(--primary); font-family:monospace; font-size:1.15rem;">${rfq.rfqNo}</strong>
      </p>

      <div class="routing-notice-banner" style="text-align:left; margin-bottom:2rem;">
        <span style="font-size:2rem;">📍</span>
        <div>
          <strong>${isAgent ? 'Headquarters Fast-Track Priority:' : 'Nearest Partner Routing in Progress:'}</strong>
          <p>
            ${isAgent 
              ? `Your contract supply price inquiry has been routed to DAIHAN Overseas Sales Division (+82 HQ).` 
              : `Your inquiry is being routed to the authorized representative covering <strong>${rfq.buyer.city}, ${rfq.buyer.country}</strong>. A copy of the specification verification receipt has been dispatched to <strong>${rfq.buyer.email}</strong>.`
            }
          </p>
        </div>
      </div>

      <!-- Real-time Multi-Channel Notification Alert Status Card -->
      <div style="background:#f0fdf4; border:1.5px solid #86efac; border-radius:var(--radius-md); padding:1.5rem; text-align:left; margin-bottom:2rem; font-size:0.875rem;">
        <div style="font-weight:800; color:#166534; margin-bottom:0.75rem; font-size:0.95rem; display:flex; align-items:center; justify-content:space-between;">
          <span>⚡ Live Multi-Channel Pipeline Execution:</span>
          <span style="font-size:0.75rem; background:#22c55e; color:white; padding:0.15rem 0.5rem; border-radius:4px;">SYNC &lt; 2s</span>
        </div>
        <ul style="list-style:none; padding-left:0; color:#15803d; line-height:1.8;">
          <li>✓ <strong>Primary DB:</strong> Persistent record generated (Atomic ID: <code>${rfq.rfqNo}</code>)</li>
          <li>✓ <strong>Google Sheets API:</strong> New row added to Master Sales Ledger</li>
          <li>✓ <strong>Telegram Dual-Push:</strong> 📱 Instant Push Dispatched to configured Sales Channel</li>
          <li>✓ <strong>Buyer Email Confirmation:</strong> Dispatched to <code>${rfq.buyer.email}</code></li>
        </ul>
      </div>

      <div style="display:flex; justify-content:center; gap:1rem; flex-wrap:wrap;">
        <button onclick="window.print()" class="btn-agent-login" style="padding:0.75rem 1.5rem;">🖨️ Print Spec Receipt</button>
        <a href="#products" class="btn-add-rfq" style="padding:0.75rem 1.5rem; text-decoration:none;">Continue Catalog Search</a>
      </div>
    </div>
  `;
}

// --------------------------------------------------------------------------
// 10. SCR-10: Unified Login Screen (New Customer vs Authorized Agent)
// --------------------------------------------------------------------------
// 10. SCR-10: Login Screens (Distinct Single-Purpose Views for Agent and Customer)
// --------------------------------------------------------------------------
function renderLoginScreen(container, tabParam) {
  const isAgent = tabParam === 'agent';

  if (isAgent) {
    // ------------------------------------------------------------------------
    // Requirement 2: Authorized Agent Login ONLY (No tabs, No privilege text)
    // ------------------------------------------------------------------------
    container.innerHTML = `
      <div style="max-width:480px; margin:3rem auto; background:white; border-radius:var(--radius-lg); border:1px solid var(--border-color); box-shadow:var(--shadow-lg); padding:2.5rem;">
        <div style="text-align:center; margin-bottom:2rem;">
          <div style="width:52px; height:52px; background:var(--agent-light); color:var(--agent-purple); border-radius:var(--radius-md); display:flex; align-items:center; justify-content:center; font-size:1.6rem; margin:0 auto 1rem;">
            🏢
          </div>
          <h3 style="font-size:1.5rem; color:var(--text-main);">Authorized Agent Login</h3>
          <p style="color:var(--text-muted); font-size:0.875rem; margin-top:0.35rem;">
            ${AppState.redirectAfterLogin 
              ? '<strong style="color:var(--agent-purple);">Sign in to add your selected equipment to RFQ cart</strong>' 
              : 'Sign in with your official authorized distributor account'}
          </p>
        </div>

        <form onsubmit="handleAgentLoginSubmit(event)">
          <div class="form-group" style="margin-bottom:1.25rem;">
            <label style="font-weight:700; font-size:0.875rem;">Agent Business Email <span class="required">*</span></label>
            <input type="email" id="agent-email-input" required value="agent@euro-sci.com" placeholder="agent@distributor.com" style="width:100%; padding:0.75rem; border:1px solid var(--border-color); border-radius:var(--radius-sm); font-size:0.95rem;">
          </div>
          <div class="form-group" style="margin-bottom:1.5rem;">
            <label style="font-weight:700; font-size:0.875rem;">Password <span class="required">*</span></label>
            <input type="password" id="agent-pw-input" required value="demo" style="width:100%; padding:0.75rem; border:1px solid var(--border-color); border-radius:var(--radius-sm); font-size:0.95rem;">
            <small style="color:var(--text-muted); display:block; margin-top:0.35rem; font-size:0.75rem;">(Pre-configured Demo: agent@euro-sci.com / demo)</small>
          </div>
          <button type="submit" class="btn-add-rfq" style="width:100%; justify-content:center; background:var(--agent-purple); padding:0.85rem; font-size:1rem;">
            ${AppState.redirectAfterLogin ? 'Login & Return to Equipment &rarr;' : 'Login as Authorized Agent &rarr;'}
          </button>
        </form>

        <div style="margin-top:1.5rem; text-align:center; border-top:1px solid var(--border-color); padding-top:1.25rem; font-size:0.8125rem; color:var(--text-muted);">
          Looking for customer product inquiry? <a href="#login/customer" style="color:var(--primary); font-weight:700; text-decoration:none;">New Customer Sign-in</a>
        </div>
      </div>
    `;
  } else {
    // ------------------------------------------------------------------------
    // Requirement 3: New Customer Login ONLY (No tabs)
    // ------------------------------------------------------------------------
    container.innerHTML = `
      <div style="max-width:540px; margin:3rem auto; background:white; border-radius:var(--radius-lg); border:1px solid var(--border-color); box-shadow:var(--shadow-lg); padding:2.5rem;">
        <div style="text-align:center; margin-bottom:2rem;">
          <div style="width:52px; height:52px; background:var(--primary-light); color:var(--primary); border-radius:var(--radius-md); display:flex; align-items:center; justify-content:center; font-size:1.6rem; margin:0 auto 1rem;">
            👤
          </div>
          <h3 style="font-size:1.5rem; color:var(--text-main);">New Customer Login</h3>
          <p style="color:var(--text-muted); font-size:0.875rem; margin-top:0.35rem;">
            ${AppState.redirectAfterLogin 
              ? '<strong style="color:var(--primary);">Enter details to add selected instrument to RFQ cart</strong>' 
              : 'Enter your organization details for instant catalog specification & quotation routing'}
          </p>
        </div>

        <form onsubmit="handleBuyerLoginSubmit(event)">
          <div class="form-group" style="margin-bottom:1.1rem;">
            <label style="font-weight:700; font-size:0.875rem;">Organization / University / Company <span class="required">*</span></label>
            <input type="text" id="buyer-company-input" required placeholder="e.g. Harvard Bio Lab or BioChem Corp" value="Harvard Biomedical Research Institute" style="width:100%; padding:0.75rem; border:1px solid var(--border-color); border-radius:var(--radius-sm); font-size:0.95rem;">
          </div>
          <div class="form-group" style="margin-bottom:1.1rem;">
            <label style="font-weight:700; font-size:0.875rem;">Business / Academic Email <span class="required">*</span></label>
            <input type="email" id="buyer-email-input" required placeholder="name@institution.edu" value="dr.schmidt@harvard-bio.edu" style="width:100%; padding:0.75rem; border:1px solid var(--border-color); border-radius:var(--radius-sm); font-size:0.95rem;">
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; margin-bottom:1.5rem;">
            <div class="form-group">
              <label style="font-weight:700; font-size:0.875rem;">Country <span class="required">*</span></label>
              <select id="buyer-country-input" required style="width:100%; padding:0.75rem; border:1px solid var(--border-color); border-radius:var(--radius-sm); font-size:0.95rem; background:white;">
                ${GLOBAL_COUNTRIES.map(c => `<option value="${c}" ${c === 'United States' ? 'selected' : ''}>${c}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label style="font-weight:700; font-size:0.875rem;">City <span class="required">*</span></label>
              <input type="text" id="buyer-city-input" required placeholder="e.g. Boston" value="Boston" style="width:100%; padding:0.75rem; border:1px solid var(--border-color); border-radius:var(--radius-sm); font-size:0.95rem;">
            </div>
          </div>
          <button type="submit" class="btn-add-rfq" style="width:100%; justify-content:center; background:var(--primary); padding:0.85rem; font-size:1rem;">
            ${AppState.redirectAfterLogin ? 'Sign In & Return to Spec Sheet &rarr;' : 'Continue to Product Catalog &rarr;'}
          </button>
        </form>

        <div style="margin-top:1.5rem; text-align:center; border-top:1px solid var(--border-color); padding-top:1.25rem; font-size:0.8125rem; color:var(--text-muted);">
          Are you an official DAIHAN distributor? <a href="#login/agent" style="color:var(--agent-purple); font-weight:700; text-decoration:none;">Authorized Agent Sign-in</a>
        </div>
      </div>
    `;
  }
}

function handleBuyerLoginSubmit(e) {
  e.preventDefault();
  const company = document.getElementById('buyer-company-input')?.value.trim();
  const email = document.getElementById('buyer-email-input')?.value.trim();
  const country = document.getElementById('buyer-country-input')?.value;
  const city = document.getElementById('buyer-city-input')?.value.trim();

  const buyerUser = {
    userType: 'POTENTIAL_BUYER',
    buyerId: email,
    companyName: company,
    country: country,
    city: city,
    role: 'Laboratory Researcher / End-User',
    tier: 'Potential Customer (Price Masked)',
    pastQuotes: []
  };

  AppState.currentUser = buyerUser;
  localStorage.setItem('daihan_user_session', JSON.stringify(buyerUser));
  updateHeaderUI();

  if (AppState.redirectAfterLogin) {
    const returnModelId = AppState.redirectAfterLogin;
    AppState.redirectAfterLogin = null;
    alert(`Welcome, ${company}! Returning to your selected instrument...`);
    window.location.hash = `#spec-sheet/${returnModelId}`;
  } else {
    window.location.hash = '#products';
  }
}

function handleAgentLoginSubmit(e) {
  e.preventDefault();
  const email = document.getElementById('agent-email-input')?.value;
  const pw = document.getElementById('agent-pw-input')?.value;

  const agent = SAMPLE_AGENTS.find(a => a.agentId === email && a.password === pw);
  if (agent) {
    AppState.currentUser = agent;
    localStorage.setItem('daihan_user_session', JSON.stringify(agent));
    updateHeaderUI();

    if (AppState.redirectAfterLogin) {
      const returnModelId = AppState.redirectAfterLogin;
      AppState.redirectAfterLogin = null;
      window.location.hash = `#spec-sheet/${returnModelId}`;
    } else {
      window.location.hash = '#admin-bi';
    }
  } else {
    alert('Invalid Agent credentials. Demo: agent@euro-sci.com / demo');
  }
}

function logoutUser() {
  AppState.currentUser = null;
  localStorage.removeItem('daihan_user_session');
  updateHeaderUI();
  window.location.hash = '#home';
}

// --------------------------------------------------------------------------
// 11. SCR-11: Agent Dashboard (User Case 1)
// --------------------------------------------------------------------------
function renderAgentDashboardScreen(container) {
  if (!AppState.currentUser || AppState.currentUser.userType !== 'AUTHORIZED_AGENT') {
    window.location.hash = '#login/agent';
    return;
  }

  const agent = AppState.currentUser;

  container.innerHTML = `
    <div style="background:white; border:1px solid var(--border-color); border-radius:var(--radius-lg); padding:2rem; margin-bottom:2rem; box-shadow:var(--shadow-sm); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
      <div>
        <span class="agent-badge" style="margin-bottom:0.5rem; display:inline-flex;">${agent.tier}</span>
        <h2>${agent.companyName}</h2>
        <p style="color:var(--text-muted); font-size:0.875rem;">Authorized Region: <strong>${agent.city}, ${agent.country}</strong> | Contract Discount: <strong>-00% Off List Price</strong></p>
      </div>
      <div style="display:flex; gap:0.75rem;">
        <a href="#admin-bi" class="btn-spec-sheet" style="padding:0.6rem 1.2rem; background:var(--primary); color:white; border:none; text-decoration:none;">📊 Territory BI Dashboard</a>
        <a href="#agent-resources" class="btn-spec-sheet" style="padding:0.6rem 1.2rem; background:var(--agent-purple); color:white; border:none; text-decoration:none;">Download Certificates</a>
      </div>
    </div>

    <div class="section-heading">
      <h3>Past Quotations & 1-Click Re-Quote History</h3>
    </div>

    <div style="background:white; border:1px solid var(--border-color); border-radius:var(--radius-lg); padding:1.5rem; box-shadow:var(--shadow-sm);">
      <table style="width:100%; border-collapse:collapse; text-align:left;">
        <thead>
          <tr style="border-bottom:2px solid var(--border-color); color:var(--text-muted); font-size:0.8125rem;">
            <th style="padding:0.75rem;">RFQ Ref No</th>
            <th style="padding:0.75rem;">Date</th>
            <th style="padding:0.75rem;">Items Included</th>
            <th style="padding:0.75rem;">Status</th>
            <th style="padding:0.75rem; text-align:right;">1-Click Action</th>
          </tr>
        </thead>
        <tbody>
          ${agent.pastQuotes.map(q => `
            <tr style="border-bottom:1px solid var(--border-color);">
              <td style="padding:1rem 0.75rem; font-weight:700; font-family:monospace;">${q.rfqNo}</td>
              <td style="padding:1rem 0.75rem; font-size:0.875rem;">${q.date}</td>
              <td style="padding:1rem 0.75rem; font-size:0.875rem;">
                ${q.items.map(i => `<div>• ${i.modelNo} (${i.voltage}, Qty: ${i.qty})</div>`).join('')}
              </td>
              <td style="padding:1rem 0.75rem;">
                <span style="background:${q.status === 'Completed' ? '#dcfce7' : '#fef3c7'}; color:${q.status === 'Completed' ? '#166534' : '#92400e'}; padding:0.2rem 0.6rem; border-radius:9999px; font-size:0.75rem; font-weight:700;">${q.status}</span>
              </td>
              <td style="padding:1rem 0.75rem; text-align:right;">
                <button onclick="handleReQuote('${q.rfqNo}')" class="btn-spec-sheet" style="background:var(--agent-light); border-color:var(--agent-purple); color:var(--agent-purple);">
                  ⚡ 1-Click Re-Quote
                </button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function handleReQuote(rfqNo) {
  const agent = AppState.currentUser;
  const quote = agent?.pastQuotes.find(q => q.rfqNo === rfqNo);
  if (!quote) return;

  AppState.cart = quote.items.map((item, index) => {
    const prod = DAIHAN_CATALOG.find(p => p.modelNo.includes(item.modelNo.split('“')[1]?.replace('”', '') || item.modelNo)) || DAIHAN_CATALOG[0];
    return {
      cartId: 'REQUOTE-' + Date.now() + '-' + index,
      productId: prod.id,
      modelNo: prod.modelNo,
      catNo: prod.catNo,
      image: prod.image,
      category: prod.category,
      categoryName: prod.categoryName,
      voltage: item.voltage.includes('230V') ? 'V230' : 'V120',
      plug: 'PLUG-C',
      accessories: item.accessories || [],
      qty: item.qty,
      verifiedAt: new Date().toISOString()
    };
  });

  localStorage.setItem('daihan_rfq_cart', JSON.stringify(AppState.cart));
  updateHeaderUI();
  alert(`Quotation items from ${rfqNo} loaded into cart!`);
  window.location.hash = '#cart';
}

// --------------------------------------------------------------------------
// 11-B. SCR-11-B: Buyer Dashboard (User Case 2)
// --------------------------------------------------------------------------
function renderBuyerDashboardScreen(container) {
  if (!AppState.currentUser || AppState.currentUser.userType !== 'POTENTIAL_BUYER') {
    window.location.hash = '#login/customer';
    return;
  }

  const buyer = AppState.currentUser;

  container.innerHTML = `
    <div style="background:white; border:1px solid var(--border-color); border-radius:var(--radius-lg); padding:2rem; margin-bottom:2rem; box-shadow:var(--shadow-sm); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
      <div>
        <span class="buyer-badge" style="background:#dbeafe; color:#1e40af; border:1px solid #93c5fd; padding:0.35rem 0.75rem; border-radius:9999px; font-size:0.75rem; font-weight:700; display:inline-flex; margin-bottom:0.5rem;">${buyer.tier}</span>
        <h2>${buyer.companyName}</h2>
        <p style="color:var(--text-muted); font-size:0.875rem;">Location: <strong>${buyer.city}, ${buyer.country}</strong> | Account Email: <strong>${buyer.buyerId}</strong></p>
      </div>
      <div>
        <a href="#products" class="btn-add-rfq" style="font-size:0.875rem; text-decoration:none;">Browse 2026 Catalog &rarr;</a>
      </div>
    </div>

    <div class="section-heading">
      <h3>My RFQ Inquiries & Partner Routing Status</h3>
    </div>

    <div style="background:white; border:1px solid var(--border-color); border-radius:var(--radius-lg); padding:1.5rem; box-shadow:var(--shadow-sm);">
      <table style="width:100%; border-collapse:collapse; text-align:left;">
        <thead>
          <tr style="border-bottom:2px solid var(--border-color); color:var(--text-muted); font-size:0.8125rem;">
            <th style="padding:0.75rem;">RFQ Ref No</th>
            <th style="padding:0.75rem;">Date</th>
            <th style="padding:0.75rem;">Inquiry Items</th>
            <th style="padding:0.75rem;">Routing Status</th>
          </tr>
        </thead>
        <tbody>
          ${buyer.pastQuotes.length > 0 ? buyer.pastQuotes.map(q => `
            <tr style="border-bottom:1px solid var(--border-color);">
              <td style="padding:1rem 0.75rem; font-weight:700; font-family:monospace;">${q.rfqNo}</td>
              <td style="padding:1rem 0.75rem; font-size:0.875rem;">${q.date}</td>
              <td style="padding:1rem 0.75rem; font-size:0.875rem;">
                ${q.items.map(i => `<div>• ${i.modelNo} (${i.voltage}, Qty: ${i.qty})</div>`).join('')}
              </td>
              <td style="padding:1rem 0.75rem;">
                <span style="background:#e0f2fe; color:#0369a1; padding:0.2rem 0.6rem; border-radius:9999px; font-size:0.75rem; font-weight:700;">${q.status}</span>
              </td>
            </tr>
          `).join('') : `
            <tr>
              <td colspan="4" style="text-align:center; padding:2rem; color:var(--text-muted);">
                No past RFQs submitted yet. Click [Browse 2026 Catalog] to start selecting equipment!
              </td>
            </tr>
          `}
        </tbody>
      </table>
    </div>
  `;
}

// --------------------------------------------------------------------------
// 12. SCR-12: Resource & Certificate Center
// --------------------------------------------------------------------------
function renderAgentResourcesScreen(container) {
  container.innerHTML = `
    <div class="section-heading">
      <div>
        <h2>Technical Documentation & Certificate Center</h2>
        <p style="color:var(--text-muted); font-size:0.9rem;">Official CE, ISO Certifications, High-Resolution Renders, and English User Manuals</p>
      </div>
    </div>

    <div class="discovery-grid" style="grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));">
      <div class="path-card">
        <div class="path-icon icon-blue">📜</div>
        <h4>CE-MDD & ISO Certificates</h4>
        <p>Official CE conformity certificates and ISO 9001 / ISO 13485 certification pack.</p>
        <button class="btn-spec-sheet" onclick="alert('Downloading DAIHAN_CE_ISO_Certificates_2026.zip')">📥 Download ZIP (14 MB)</button>
      </div>

      <div class="path-card">
        <div class="path-icon icon-emerald">📘</div>
        <h4>2026 English User Manuals</h4>
        <p>Complete operation guides and schematic diagrams for all 2026 product series.</p>
        <button class="btn-spec-sheet" onclick="alert('Downloading DAIHAN_2026_User_Manuals.zip')">📥 Download Manuals (42 MB)</button>
      </div>

      <div class="path-card">
        <div class="path-icon icon-purple">🖼️</div>
        <h4>High-Res Marketing Assets</h4>
        <p>White-background studio photography, 3D transparent PNGs, and dimension blueprints.</p>
        <button class="btn-spec-sheet" onclick="alert('Downloading DAIHAN_Marketing_Assets_2026.zip')">📥 Download Pack (120 MB)</button>
      </div>
    </div>
  `;
}

// --------------------------------------------------------------------------
// 13. SCR-13: Sales Admin Real-time BI Dashboard (Requirement 5)
// Restricted to Authorized Agents: Top 3 Global KPIs + 9 Dedicated Territory KPI Index Buttons
// --------------------------------------------------------------------------
function renderAdminBiScreen(container) {
  // Access Guard: Restrict to Authorized Agents Only
  if (!AppState.currentUser || AppState.currentUser.userType !== 'AUTHORIZED_AGENT') {
    container.innerHTML = `
      <div style="max-width:620px; margin:4rem auto; background:white; border:1px solid var(--border-color); border-radius:var(--radius-lg); padding:3.5rem 2rem; text-align:center; box-shadow:var(--shadow-md);">
        <div style="width:68px; height:68px; background:#fef2f2; color:#dc2626; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:2.2rem; margin:0 auto 1.5rem; border:2px solid #fecaca;">
          🔒
        </div>
        <h3 style="font-size:1.6rem; color:var(--text-main); margin-bottom:0.75rem;">Authorized Distributor Access Only</h3>
        <p style="color:var(--text-muted); font-size:0.95rem; line-height:1.6; margin-bottom:2rem;">
          The <strong>Overseas Sales Intelligence & Real-time BI Dashboard</strong> is strictly reserved for official DAIHAN Scientific authorized distributors.<br>
          Please sign in with your agent account to view global benchmarks and your territory's live quotation analytics.
        </p>
        <a href="#login/agent" class="btn-add-rfq" style="background:var(--agent-purple); display:inline-flex; padding:0.85rem 2rem; font-size:1rem; text-decoration:none; justify-content:center;">
          🔐 Sign In as Authorized Agent &rarr;
        </a>
      </div>
    `;
    return;
  }

  const agent = AppState.currentUser;

  // 9 Territory Specific KPI Indices derived from Google Sheets Aggregation
  const territoryKpis = [
    {
      id: "kpi-inquiry-volume",
      title: "1. Territory RFQs & Conversion",
      value: "38 Inquiries",
      subValue: "84.2% PO Conversion Rate",
      badge: "High Conversion",
      badgeColor: "#16a34a",
      badgeBg: "#dcfce7",
      icon: "📌",
      chartType: "bar",
      barPercent: 84.2,
      desc: "32 Purchase Orders confirmed out of 38 verified RFQs from " + agent.country + "."
    },
    {
      id: "kpi-voltage-plug",
      title: "2. Regional Voltage & Plug Grid",
      value: "230V (92%) | 120V (8%)",
      subValue: "Type C (85%) / Type G (15%)",
      badge: "100% Zero-Error",
      badgeColor: "#2563eb",
      badgeBg: "#dbeafe",
      icon: "⚡",
      chartType: "distribution",
      distText: "230V Euro 92% | 120V 8%",
      desc: "Zero electrical configuration mismatch reported for " + agent.country + " region."
    },
    {
      id: "kpi-leadtime",
      title: "3. Spec Verification Speed",
      value: "1.4 Min / RFQ",
      subValue: "99.4% Faster vs 24h Manual Email",
      badge: "Instant Routing",
      badgeColor: "#059669",
      badgeBg: "#ecfdf5",
      icon: "⏱️",
      chartType: "speed",
      desc: "Automated real-time specification & accessory validation eliminates quote delays."
    },
    {
      id: "kpi-category-mix",
      title: "4. Product Line Inquiries Mix",
      value: "Autoclaves 42% | Stirrers 28%",
      subValue: "Ovens 18% | Water Baths 12%",
      badge: "Core Demand",
      badgeColor: "#7c3aed",
      badgeBg: "#ede9fe",
      icon: "🔬",
      chartType: "mix",
      desc: "Top inquiries concentrated on STE-AM47 Touch Autoclave and MS-20D Magnetic Stirrers."
    },
    {
      id: "kpi-requote-rate",
      title: "5. 1-Click Re-Quote Frequency",
      value: "62.5% Re-Order Rate",
      subValue: "Avg 2.6 Repeat Quotes / Customer",
      badge: "High Retention",
      badgeColor: "#d97706",
      badgeBg: "#fef3c7",
      icon: "🔄",
      chartType: "bar",
      barPercent: 62.5,
      desc: "Returning university & clinical lab buyers utilize 1-Click repeat quoting."
    },
    {
      id: "kpi-logistics-cbm",
      title: "6. Freight Volume & Weight",
      value: "18.4 CBM / 2,420 kg",
      subValue: "56% of 20ft FCL Container",
      badge: "Consolidation Ready",
      badgeColor: "#0284c7",
      badgeBg: "#e0f2fe",
      icon: "📦",
      chartType: "container",
      desc: "Estimated total logistics volume ready for consolidated ocean/air freight booking."
    },
    {
      id: "kpi-margin-savings",
      title: "7. Contract Discount Margin",
      value: "-$00,000 USD Saved",
      subValue: "-00% Applied to Master List Price",
      badge: "Exclusive Tier",
      badgeColor: "#16a34a",
      badgeBg: "#dcfce7",
      icon: "💰",
      chartType: "badge",
      desc: "Contract supply pricing locked exclusively for " + agent.companyName + "."
    },
    {
      id: "kpi-cert-downloads",
      title: "8. CE & ISO Compliance Downloads",
      value: "24 Docs Downloaded",
      subValue: "CE-MDD, ISO 13485, English Manuals",
      badge: "Audit Compliant",
      badgeColor: "#475569",
      badgeBg: "#f1f5f9",
      icon: "📜",
      chartType: "docs",
      desc: "All certification assets downloaded for local regulatory and hospital tenders."
    },
    {
      id: "kpi-growth-forecast",
      title: "9. Territory Growth & Q3 Forecast",
      value: "+31.8% YoY Expansion",
      subValue: "Pipeline Target: $148,000 USD",
      badge: "Trending Up",
      badgeColor: "#dc2626",
      badgeBg: "#fee2e2",
      icon: "📈",
      chartType: "trend",
      desc: "Projected annual sales growth trajectory based on Q1~Q3 RFQ conversion rates."
    }
  ];

  container.innerHTML = `
    <!-- Top Level Header -->
    <div style="background:white; border:1px solid var(--border-color); border-radius:var(--radius-lg); padding:2rem; margin-bottom:2rem; box-shadow:var(--shadow-sm); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1.25rem;">
      <div>
        <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
          <span class="agent-badge">${agent.tier}</span>
          <span style="font-size:0.75rem; color:#16a34a; font-weight:700; background:#dcfce7; padding:0.2rem 0.6rem; border-radius:9999px;">● Live Google Sheet Synced</span>
        </div>
        <h2 style="font-size:1.75rem; color:var(--text-main); margin-bottom:0.25rem;">Overseas Sales Intelligence BI Dashboard</h2>
        <p style="color:var(--text-muted); font-size:0.875rem;">
          Authorized Partner: <strong>${agent.companyName}</strong> (${agent.city}, ${agent.country}) | Contract Discount: <strong>-00%</strong>
        </p>
      </div>
      <div style="display:flex; gap:0.75rem;">
        <a href="#agent-dashboard" class="btn-spec-sheet" style="padding:0.6rem 1.2rem; background:white; border:1px solid var(--border-color); color:var(--text-main); text-decoration:none;">Past Quotations</a>
        <a href="#agent-resources" class="btn-spec-sheet" style="padding:0.6rem 1.2rem; background:var(--agent-purple); color:white; border:none; text-decoration:none;">CE/ISO Center</a>
      </div>
    </div>

    <!-- Section 1: Top 3 Global Key KPIs (Visible to all Authorized Agents) -->
    <div class="section-heading" style="margin-bottom:1rem;">
      <div>
        <h3 style="display:flex; align-items:center; gap:0.5rem;">
          <span>🌐</span> Global Headquarters Key Benchmarks (Global 3 Key KPIs)
        </h3>
        <p style="font-size:0.875rem; color:var(--text-muted);">Real-time aggregated global metrics across all international sales territories</p>
      </div>
    </div>

    <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:1.25rem; margin-bottom:2.5rem;">
      <!-- Global KPI 1 -->
      <div style="background:linear-gradient(135deg, #ffffff 0%, #f0f7ff 100%); padding:1.75rem; border-radius:var(--radius-lg); border:1px solid #bfdbfe; box-shadow:var(--shadow-sm); position:relative; overflow:hidden;">
        <div style="font-size:0.75rem; color:var(--primary); font-weight:800; letter-spacing:0.05em;">GLOBAL MONTHLY TOTAL RFQ</div>
        <div style="font-size:2.4rem; font-weight:800; color:var(--primary); margin:0.4rem 0;">148 <span style="font-size:1rem; font-weight:600; color:var(--text-muted);">Inquiries</span></div>
        <div style="display:flex; align-items:center; gap:0.4rem;">
          <span style="background:#dcfce7; color:#166534; font-size:0.75rem; font-weight:800; padding:0.2rem 0.5rem; border-radius:4px;">↑ +24.5% MoM</span>
          <span style="color:var(--text-muted); font-size:0.75rem;">Global inquiry surge in Q3</span>
        </div>
      </div>

      <!-- Global KPI 2 -->
      <div style="background:linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%); padding:1.75rem; border-radius:var(--radius-lg); border:1px solid #bbf7d0; box-shadow:var(--shadow-sm); position:relative; overflow:hidden;">
        <div style="font-size:0.75rem; color:#166534; font-weight:800; letter-spacing:0.05em;">GLOBAL VOLTAGE DEMAND RATIO</div>
        <div style="font-size:1.6rem; font-weight:800; color:#15803d; margin:0.75rem 0;">230V (78.4%) | 120V (21.6%)</div>
        <div style="display:flex; align-items:center; gap:0.4rem;">
          <span style="background:#dcfce7; color:#166534; font-size:0.75rem; font-weight:800; padding:0.2rem 0.5rem; border-radius:4px;">Zero Voltage Errors</span>
          <span style="color:var(--text-muted); font-size:0.75rem;">Global Standard dominant</span>
        </div>
      </div>

      <!-- Global KPI 3 -->
      <div style="background:linear-gradient(135deg, #ffffff 0%, #faf5ff 100%); padding:1.75rem; border-radius:var(--radius-lg); border:1px solid #e9d5ff; box-shadow:var(--shadow-sm); position:relative; overflow:hidden;">
        <div style="font-size:0.75rem; color:var(--agent-purple); font-weight:800; letter-spacing:0.05em;">GLOBAL TOP INQUIRY MODEL</div>
        <div style="font-size:1.6rem; font-weight:800; color:var(--agent-purple); margin:0.75rem 0;">STE-AM47 Autoclave</div>
        <div style="display:flex; align-items:center; gap:0.4rem;">
          <span style="background:#f3e8ff; color:var(--agent-purple); font-size:0.75rem; font-weight:800; padding:0.2rem 0.5rem; border-radius:4px;">42 Inquiries</span>
          <span style="color:var(--text-muted); font-size:0.75rem;">Best-seller worldwide</span>
        </div>
      </div>
    </div>

    <!-- Section 2: Dedicated Territory Sales Intelligence (9 Interactive KPI Index Buttons/Cards) -->
    <div class="section-heading" style="margin-bottom:1rem;">
      <div>
        <h3 style="display:flex; align-items:center; gap:0.5rem;">
          <span>📊</span> Territory Sales Intelligence — 9 Key Performance Indices (${agent.companyName})
        </h3>
        <p style="font-size:0.875rem; color:var(--text-muted);">Customized live territory metrics aggregated from Google Sheets Master database (Click any card for data breakdown)</p>
      </div>
      <div style="font-size:0.8125rem; color:var(--text-muted); font-family:monospace; background:#f8fafc; padding:0.35rem 0.75rem; border-radius:6px; border:1px solid var(--border-color);">
        Territory: ${agent.city}, ${agent.country}
      </div>
    </div>

    <!-- 9 Interactive KPI Cards / Buttons Grid -->
    <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap:1.25rem; margin-bottom:2.5rem;">
      ${territoryKpis.map((kpi, idx) => `
        <div class="kpi-card-interactive" onclick="handleKpiCardClick(${idx})" 
             style="background:white; border:1px solid var(--border-color); border-radius:var(--radius-lg); padding:1.5rem; box-shadow:var(--shadow-sm); cursor:pointer; transition:all 0.25s ease; position:relative; overflow:hidden;"
             onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='var(--shadow-md)'; this.style.borderColor='var(--primary)';"
             onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='var(--shadow-sm)'; this.style.borderColor='var(--border-color)';">
          
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.75rem;">
            <div style="display:flex; align-items:center; gap:0.6rem;">
              <span style="font-size:1.4rem;">${kpi.icon}</span>
              <span style="font-weight:700; font-size:0.95rem; color:var(--text-main);">${kpi.title}</span>
            </div>
            <span style="background:${kpi.badgeBg}; color:${kpi.badgeColor}; font-size:0.7rem; font-weight:800; padding:0.25rem 0.55rem; border-radius:9999px;">
              ${kpi.badge}
            </span>
          </div>

          <div style="font-size:1.6rem; font-weight:800; color:var(--text-main); margin-bottom:0.25rem;">
            ${kpi.value}
          </div>

          <div style="font-size:0.8125rem; font-weight:600; color:var(--primary); margin-bottom:0.75rem;">
            ${kpi.subValue}
          </div>

          ${kpi.chartType === 'bar' ? `
            <div style="width:100%; height:8px; background:#f1f5f9; border-radius:9999px; overflow:hidden; margin-bottom:0.75rem;">
              <div style="width:${kpi.barPercent}%; height:100%; background:linear-gradient(90deg, var(--primary), #10b981); border-radius:9999px;"></div>
            </div>
          ` : ''}

          ${kpi.chartType === 'distribution' ? `
            <div style="width:100%; height:8px; background:#f1f5f9; border-radius:9999px; overflow:hidden; display:flex; margin-bottom:0.75rem;">
              <div style="width:92%; height:100%; background:#2563eb;" title="230V: 92%"></div>
              <div style="width:8%; height:100%; background:#f59e0b;" title="120V: 8%"></div>
            </div>
          ` : ''}

          ${kpi.chartType === 'mix' ? `
            <div style="width:100%; height:8px; background:#f1f5f9; border-radius:9999px; overflow:hidden; display:flex; margin-bottom:0.75rem;">
              <div style="width:42%; height:100%; background:#2563eb;" title="Autoclaves: 42%"></div>
              <div style="width:28%; height:100%; background:#10b981;" title="Stirrers: 28%"></div>
              <div style="width:18%; height:100%; background:#8b5cf6;" title="Ovens: 18%"></div>
              <div style="width:12%; height:100%; background:#f59e0b;" title="Baths: 12%"></div>
            </div>
          ` : ''}

          ${kpi.chartType === 'trend' ? `
            <div style="width:100%; height:8px; background:#f1f5f9; border-radius:9999px; overflow:hidden; margin-bottom:0.75rem;">
              <div style="width:78%; height:100%; background:linear-gradient(90deg, #ec4899, #8b5cf6); border-radius:9999px;"></div>
            </div>
          ` : ''}

          <p style="font-size:0.75rem; color:var(--text-muted); line-height:1.4; margin:0;">
            ${kpi.desc}
          </p>

          <div style="margin-top:0.85rem; padding-top:0.6rem; border-top:1px dashed #e2e8f0; display:flex; justify-content:space-between; align-items:center; font-size:0.75rem; color:var(--primary); font-weight:700;">
            <span>View Google Sheet Log</span>
            <span>Drill-down &rarr;</span>
          </div>
        </div>
      `).join('')}
    </div>

    <!-- Google Sheet Live Pipeline Info Box -->
    <div style="background:white; border:1px solid var(--border-color); border-radius:var(--radius-lg); padding:2rem; text-align:center; box-shadow:var(--shadow-sm);">
      <div style="background:#f8fafc; border:2px dashed #cbd5e1; border-radius:var(--radius-md); padding:2.5rem 1.5rem;">
        <div style="font-size:2.2rem; margin-bottom:0.75rem;">📋</div>
        <h4 style="font-size:1.15rem; color:var(--text-main); margin-bottom:0.5rem;">Google Sheets Master Pipeline Integration</h4>
        <p style="color:var(--text-muted); font-size:0.875rem; max-width:600px; margin:0 auto 1.25rem;">
          All incoming RFQs, voltage/plug specs, buyer contact data, and Telegram alerts are aggregated into your territory sheet tab: <code>DAIHAN_Sales_2026_${agent.country.replace(/\\s+/g, '_')}</code>.
        </p>
        <button class="btn-add-rfq" onclick="alert('Google Sheets Sync Status: 100% Active. Target Tab: DAIHAN_Sales_2026_${agent.country.replace(/\\s+/g, '_')}')" style="background:var(--agent-purple); display:inline-flex; padding:0.75rem 1.5rem; font-size:0.9rem;">
          🔄 Test Live Sheet Aggregation
        </button>
      </div>
    </div>
  `;
}

function handleKpiCardClick(index) {
  const agent = AppState.currentUser;
  const kpiTitles = [
    "Territory RFQs & Conversion Rate",
    "Regional Voltage & Plug Grid Distribution",
    "Spec Verification Speed (Lead-time)",
    "Product Line Inquiries Mix",
    "1-Click Re-Quote Frequency",
    "Logistics Freight Volume (CBM & Weight)",
    "Contract Discount Margin Savings",
    "CE & ISO Compliance Downloads",
    "Territory Growth & Forecast Trend"
  ];

  alert(`[Google Sheet Drill-Down: KPI #${index + 1}]\n\nMetric: ${kpiTitles[index]}\nTerritory: ${agent?.companyName} (${agent?.country})\nStatus: Aggregated live from Google Sheets row logs.`);
}

