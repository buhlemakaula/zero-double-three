/* Misitu — storefront behaviour: rendering, cart, reveal animations */

(() => {
  'use strict';

  /* ---------- cart state (localStorage) ---------- */

  const CART_KEY = 'misitu-cart';

  function loadCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || {}; }
    catch { return {}; }
  }

  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }

  let cart = loadCart();

  /* ---------- scroll reveal ---------- */

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  function observeReveals(root = document) {
    root.querySelectorAll('.reveal:not(.in)').forEach(el => {
      if (reduceMotion) el.classList.add('in');
      else io.observe(el);
    });
  }

  const cartItemCount = () => Object.values(cart).reduce((n, q) => n + q, 0);
  const cartTotal = () => Object.entries(cart).reduce((sum, [id, qty]) => {
    const p = PRODUCTS.find(p => p.id === id);
    return p ? sum + p.price * qty : sum;
  }, 0);

  /* ---------- product cards ---------- */

  function tagClass(tag) {
    return tag === 'premium' ? 'premium' : tag === 'new' ? 'new' : '';
  }

  function productCard(p) {
    return `
      <article class="product-card reveal" data-id="${p.id}">
        <div class="pc-top">
          <h3 class="pc-name">${p.name}</h3>
          <span class="pc-tag ${tagClass(p.tag)}">${p.tag}</span>
        </div>
        <p class="pc-materials">${p.materials}</p>
        <p class="pc-blurb">${p.blurb}</p>
        <div class="pc-buy">
          <span class="pc-price">${ZAR.format(p.price)}</span>
          <button class="pc-add" data-add="${p.id}">Add to cart</button>
        </div>
        <div class="pc-art">
          ${productArt(p)}
          <div class="pc-meta">
            <span class="pc-chip rate">${p.rating.toFixed(1)}</span>
            <span class="pc-chip">${p.category.toLowerCase()}</span>
            <span class="pc-chip">handcrafted</span>
          </div>
        </div>
      </article>`;
  }

  /* homepage: three featured pieces, matching the inspiration band */
  const featuredGrid = document.querySelector('[data-featured-grid]');
  if (featuredGrid) {
    const featured = ['kiaat-curve', 'blackwood-shell', 'amber-karoo']
      .map(id => PRODUCTS.find(p => p.id === id));
    featuredGrid.innerHTML = featured.map(productCard).join('');
  }

  /* catalogue page: filterable full grid */
  const catalogGrid = document.querySelector('[data-catalog-grid]');
  const filterRow = document.querySelector('[data-filter-row]');
  if (catalogGrid && filterRow) {
    const categories = ['All', ...new Set(PRODUCTS.map(p => p.category))];
    let active = decodeURIComponent(location.hash.slice(1)) || 'All';
    if (!categories.includes(active)) active = 'All';

    function renderFilters() {
      filterRow.innerHTML = categories.map(c =>
        `<button class="filter-chip" data-filter="${c}" aria-pressed="${c === active}">${c}</button>`
      ).join('');
    }

    function renderCatalog() {
      const list = active === 'All' ? PRODUCTS : PRODUCTS.filter(p => p.category === active);
      catalogGrid.innerHTML = list.map(productCard).join('');
      observeReveals(catalogGrid);
      catalogGrid.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
    }

    filterRow.addEventListener('click', e => {
      const btn = e.target.closest('[data-filter]');
      if (!btn) return;
      active = btn.dataset.filter;
      renderFilters();
      renderCatalog();
    });

    renderFilters();
    renderCatalog();
  }

  /* ---------- cart UI ---------- */

  const drawer = document.querySelector('[data-cart-drawer]');
  const overlay = document.querySelector('[data-cart-overlay]');
  const itemsEl = document.querySelector('[data-cart-items]');
  const totalEl = document.querySelector('[data-cart-total]');
  const countEls = document.querySelectorAll('[data-cart-count]');
  const toast = document.querySelector('[data-toast]');

  function renderCartCount() {
    const n = cartItemCount();
    countEls.forEach(el => {
      el.textContent = n;
      el.classList.toggle('show', n > 0);
    });
  }

  function renderCartItems() {
    if (!itemsEl) return;
    const entries = Object.entries(cart);
    if (!entries.length) {
      itemsEl.innerHTML = `<p class="cart-empty">Your cart is empty.<br><a href="shop.html">Browse the catalogue</a> to find your piece.</p>`;
    } else {
      itemsEl.innerHTML = entries.map(([id, qty]) => {
        const p = PRODUCTS.find(p => p.id === id);
        if (!p) return '';
        return `
          <div class="cart-item">
            <div class="ci-art">${productArt(p)}</div>
            <div>
              <div class="ci-name">${p.name}</div>
              <div class="ci-price">${ZAR.format(p.price)} each</div>
              <div class="ci-qty">
                <button data-dec="${id}" aria-label="Decrease quantity of ${p.name}">&minus;</button>
                <span>${qty}</span>
                <button data-inc="${id}" aria-label="Increase quantity of ${p.name}">+</button>
              </div>
            </div>
            <button class="ci-remove" data-remove="${id}">Remove</button>
          </div>`;
      }).join('');
    }
    if (totalEl) totalEl.textContent = ZAR.format(cartTotal());
  }

  function updateCart() {
    saveCart(cart);
    renderCartCount();
    renderCartItems();
  }

  function openCart() {
    renderCartItems();
    drawer?.classList.add('open');
    overlay?.classList.add('open');
    drawer?.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    drawer?.classList.remove('open');
    overlay?.classList.remove('open');
    drawer?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  let toastTimer;
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
  }

  document.addEventListener('click', e => {
    const add = e.target.closest('[data-add]');
    if (add) {
      const id = add.dataset.add;
      cart[id] = (cart[id] || 0) + 1;
      updateCart();
      const p = PRODUCTS.find(p => p.id === id);
      showToast(`${p.name} added to cart`);
      add.textContent = 'Added ✓';
      add.classList.add('added');
      setTimeout(() => { add.textContent = 'Add to cart'; add.classList.remove('added'); }, 1400);
      return;
    }
    if (e.target.closest('[data-cart-open]')) { openCart(); return; }
    if (e.target.closest('[data-cart-close]') || e.target.closest('[data-cart-overlay]')) { closeCart(); return; }

    const inc = e.target.closest('[data-inc]');
    if (inc) { cart[inc.dataset.inc]++; updateCart(); return; }

    const dec = e.target.closest('[data-dec]');
    if (dec) {
      const id = dec.dataset.dec;
      cart[id]--;
      if (cart[id] <= 0) delete cart[id];
      updateCart();
      return;
    }

    const rem = e.target.closest('[data-remove]');
    if (rem) { delete cart[rem.dataset.remove]; updateCart(); return; }

    if (e.target.closest('[data-checkout]')) {
      if (!cartItemCount()) { showToast('Your cart is empty'); return; }
      showToast(`Checkout coming soon — total ${ZAR.format(cartTotal())}`);
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeCart();
  });

  observeReveals();
  renderCartCount();
  renderCartItems();
})();
