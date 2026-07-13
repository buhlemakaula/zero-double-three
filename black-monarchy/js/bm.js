/* ============================================================
   BLACK MONARCHY — storefront interactions
   ============================================================ */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Catalogue ---------- */
  var PRODUCTS = [
    { id:"monarch-set-white", cat:"Two-piece", name:"Monarch Cotton Set", price:899, img:"img/white-set-front.jpg", flag:"Bestseller", swatch:["#F4F1EA","#0E0E10"] },
    { id:"heather-polo", cat:"Polo", name:"Heather Ribbed Polo", price:649, img:"img/grey-polo-portrait.jpg", flag:null, swatch:["#9A979A","#0E0E10"] },
    { id:"grey-tracksuit", cat:"Tracksuit", name:"Grey Monarch Tracksuit", price:1199, img:"img/grey-polo-full.jpg", flag:"New", swatch:["#9A979A","#F4F1EA"] },
    { id:"signature-cardigan", cat:"Knitwear", name:"Signature Chenille Cardigan", price:1099, img:"img/cardigan-logo-portrait.jpg", flag:"Limited", swatch:["#0E0E10"] },
    { id:"bubble-tee", cat:"Tee", name:"Bubble Logo Tee", price:499, img:"img/blue-logo-tee.jpg", flag:null, swatch:["#0E0E10","#F4F1EA"] },
    { id:"monarch-joggers", cat:"Loungewear", name:"Monarch Wide Joggers", price:699, img:"img/white-joggers-detail.jpg", flag:null, swatch:["#F4F1EA","#9A979A"] },
    { id:"white-tee", cat:"Tee", name:"Essential Seal Tee", price:449, img:"img/white-tee-portrait.jpg", flag:null, swatch:["#F4F1EA","#0E0E10"] },
    { id:"duo-set", cat:"Two-piece", name:"Court Lounge Set", price:1149, img:"img/duo-grey-steps.jpg", flag:"Couple's", swatch:["#9A979A"] }
  ];

  var rand = function (n) { return "R" + n.toLocaleString("en-ZA"); };

  /* ---------- Render grid ---------- */
  var grid = document.getElementById("grid");
  if (grid) {
    grid.innerHTML = PRODUCTS.map(function (p, i) {
      var sw = p.swatch.map(function (c) { return '<i style="background:' + c + '"></i>'; }).join("");
      var delay = (i % 4) + 1;
      return '' +
      '<article class="card card-bone" data-reveal data-reveal-delay="' + delay + '">' +
        '<div class="card__media">' +
          (p.flag ? '<span class="card__flag">' + p.flag + '</span>' : '') +
          '<button class="card__wish" aria-label="Save ' + p.name + '"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 21C5 16 3 12 3 8.5A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 9 2.5C21 12 19 16 12 21z"/></svg></button>' +
          '<img src="' + p.img + '" alt="' + p.name + '" loading="lazy">' +
          '<button class="card__add" data-add="' + p.id + '">Add to bag +</button>' +
        '</div>' +
        '<div class="card__body">' +
          '<span class="card__cat">' + p.cat + '</span>' +
          '<h3 class="card__name">' + p.name + '</h3>' +
          '<div class="card__meta">' +
            '<span class="card__price">' + rand(p.price) + '</span>' +
            '<span class="card__swatch">' + sw + '</span>' +
          '</div>' +
        '</div>' +
      '</article>';
    }).join("");
  }

  /* ---------- Cart ---------- */
  var bag = [];
  var els = {
    count: document.getElementById("cartCount"),
    headCount: document.getElementById("cartHeadCount"),
    items: document.getElementById("cartItems"),
    foot: document.getElementById("cartFoot"),
    sub: document.getElementById("cartSub"),
    total: document.getElementById("cartTotal"),
    cart: document.getElementById("cart"),
    scrim: document.getElementById("scrim")
  };

  function find(id) { for (var i=0;i<PRODUCTS.length;i++) if (PRODUCTS[i].id===id) return PRODUCTS[i]; }
  function qtyTotal() { return bag.reduce(function (n,l){ return n+l.qty; },0); }
  function sum() { return bag.reduce(function (n,l){ return n + l.qty * find(l.id).price; },0); }

  function renderCart() {
    var n = qtyTotal();
    els.count.textContent = n;
    els.headCount.textContent = "(" + n + ")";
    if (!bag.length) {
      els.items.innerHTML = '<div class="cart__empty"><span class="woven">Black&nbsp;Monarchy</span><p>Your bag is empty. The court awaits.</p></div>';
      els.foot.hidden = true;
      return;
    }
    els.items.innerHTML = bag.map(function (l) {
      var p = find(l.id);
      return '' +
      '<div class="citem">' +
        '<img src="' + p.img + '" alt="' + p.name + '">' +
        '<div><b>' + p.name + '</b><small>' + p.cat + '</small>' +
          '<div class="citem__qty">' +
            '<button data-dec="' + l.id + '" aria-label="Decrease">−</button>' +
            '<span>' + l.qty + '</span>' +
            '<button data-inc="' + l.id + '" aria-label="Increase">+</button>' +
          '</div>' +
        '</div>' +
        '<div><div class="citem__price">' + rand(p.price * l.qty) + '</div>' +
          '<button class="citem__rm" data-rm="' + l.id + '">Remove</button></div>' +
      '</div>';
    }).join("");
    els.foot.hidden = false;
    els.sub.textContent = rand(sum());
    els.total.textContent = rand(sum());
  }

  function add(id) {
    var line = null;
    for (var i=0;i<bag.length;i++) if (bag[i].id===id) line=bag[i];
    if (line) line.qty++; else bag.push({ id:id, qty:1 });
    renderCart();
    els.count.classList.add("pop");
    setTimeout(function(){ els.count.classList.remove("pop"); }, 300);
    toast(find(id).name);
  }
  function change(id, d) {
    for (var i=0;i<bag.length;i++) if (bag[i].id===id) {
      bag[i].qty += d;
      if (bag[i].qty<=0) bag.splice(i,1);
      break;
    }
    renderCart();
  }
  function remove(id) { bag = bag.filter(function(l){ return l.id!==id; }); renderCart(); }

  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-add],[data-inc],[data-dec],[data-rm]");
    if (!t) return;
    if (t.dataset.add) add(t.dataset.add);
    else if (t.dataset.inc) change(t.dataset.inc, 1);
    else if (t.dataset.dec) change(t.dataset.dec, -1);
    else if (t.dataset.rm) remove(t.dataset.rm);
  });

  /* ---------- Cart drawer ---------- */
  function openCart(){ els.cart.classList.add("open"); els.scrim.classList.add("open"); document.body.style.overflow="hidden"; }
  function closeCart(){ els.cart.classList.remove("open"); els.scrim.classList.remove("open"); document.body.style.overflow=""; }
  document.getElementById("cartBtn").addEventListener("click", openCart);
  document.getElementById("cartClose").addEventListener("click", closeCart);
  els.scrim.addEventListener("click", closeCart);
  document.addEventListener("keydown", function(e){ if (e.key==="Escape") closeCart(); });
  renderCart();

  /* ---------- Toast ---------- */
  var toastEl = document.getElementById("toast"), toastName = document.getElementById("toastName"), toastTimer;
  function toast(name) {
    toastName.textContent = name;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function(){ toastEl.classList.remove("show"); }, 2200);
  }

  /* ---------- Newsletter ---------- */
  var joinForm = document.getElementById("joinForm");
  if (joinForm) joinForm.addEventListener("submit", function (e) {
    e.preventDefault();
    joinForm.querySelector("input").value = "";
    document.getElementById("joinNote").textContent = "Welcome to the court. Watch your inbox.";
  });

  /* ---------- Sticky nav ---------- */
  var nav = document.getElementById("nav");
  function onScroll(){ nav.classList.toggle("is-solid", window.scrollY > 40); }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive:true });

  /* ---------- Mobile menu ---------- */
  var burger = document.getElementById("burger");
  var mob = document.getElementById("mobmenu");
  var mobClose = document.getElementById("mobClose");
  function openMob(){ mob.classList.add("open"); document.body.style.overflow="hidden"; }
  function closeMob(){ mob.classList.remove("open"); document.body.style.overflow=""; }
  if (burger) burger.addEventListener("click", openMob);
  if (mobClose) mobClose.addEventListener("click", closeMob);
  if (mob) mob.querySelectorAll("a").forEach(function(a){ a.addEventListener("click", closeMob); });
  document.addEventListener("keydown", function(e){ if (e.key==="Escape") closeMob(); });

  /* ---------- Reveal on scroll ---------- */
  function bindReveals() {
    var items = document.querySelectorAll("[data-reveal]");
    if (reduce || !("IntersectionObserver" in window)) {
      items.forEach(function(el){ el.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold:0.12, rootMargin:"0px 0px -8% 0px" });
    items.forEach(function(el){ io.observe(el); });
  }
  bindReveals();

  /* ---------- Parallax ---------- */
  var parallax = document.querySelectorAll("[data-parallax]");
  if (parallax.length && !reduce) {
    var ticking = false;
    function para() {
      parallax.forEach(function (img) {
        var r = img.getBoundingClientRect();
        var wrap = img.parentElement.getBoundingClientRect();
        if (wrap.bottom < 0 || wrap.top > window.innerHeight) return;
        var prog = (window.innerHeight - wrap.top) / (window.innerHeight + wrap.height);
        img.style.transform = "translateY(" + ((prog - .5) * 16) + "%)";
      });
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { window.requestAnimationFrame(para); ticking = true; }
    }, { passive:true });
    para();
  }
})();
