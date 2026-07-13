/* ============================================================
   BLACK MONARCHY — interactions
   ============================================================ */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- PRODUCTS ---------- */
  var PRODUCTS = [
    { id: "graffiti-tee", name: "Sovereign Graffiti Tee", sub: "Black · Heavyweight", price: 650, img: "img/tee-black-graffiti.jpg", tag: "New", tagCls: "new" },
    { id: "heritage-polo", name: "Heritage Ribbed Polo", sub: "Grey · Red trim", price: 850, img: "img/polo-grey.jpg", tag: "Bestseller", tagCls: "" },
    { id: "monogram-tee", name: "Monogram Tee", sub: "Ivory · Oversized", price: 620, img: "img/tee-white.jpg", tag: "New", tagCls: "new" },
    { id: "regalia-cardigan", name: "Regalia Cardigan", sub: "Black · Embroidered", price: 1650, img: "img/cardigan-look.jpg", tag: "Limited", tagCls: "" },
    { id: "court-tracksuit", name: "The Court Tracksuit", sub: "Grey · Unisex set", price: 1450, img: "img/duo-grey.jpg", tag: "Set", tagCls: "" },
    { id: "ivory-reign", name: "Ivory Reign Set", sub: "Bone · Tee + Pant", price: 1290, img: "img/set-white.jpg", tag: "New", tagCls: "new" },
    { id: "crest-sweatpants", name: "Crest Sweatpants", sub: "Ivory · Wide leg", price: 790, img: "img/pants-white-detail.jpg", tag: "", tagCls: "" },
    { id: "heritage-look", name: "Heritage Polo — Full", sub: "Grey · Studio fit", price: 850, img: "img/polo-look.jpg", tag: "", tagCls: "" }
  ];

  var fmt = function (n) { return "R" + n.toLocaleString("en-ZA"); };

  var grid = document.getElementById("prodGrid");
  PRODUCTS.forEach(function (p) {
    var el = document.createElement("article");
    el.className = "card";
    el.setAttribute("data-reveal", "");
    el.innerHTML =
      '<div class="thumb">' +
        (p.tag ? '<span class="tag ' + p.tagCls + '">' + p.tag + "</span>" : "") +
        '<img src="' + p.img + '" alt="' + p.name + '" loading="lazy">' +
        '<button class="add" data-add="' + p.id + '">Add to bag — ' + fmt(p.price) + "</button>" +
      "</div>" +
      '<div class="info"><div><h3>' + p.name + '</h3><div class="sub">' + p.sub + "</div></div>" +
      '<div class="price">' + fmt(p.price) + "</div></div>";
    grid.appendChild(el);
  });

  /* ---------- CART ---------- */
  var cart = {}; // id -> qty
  var $ = function (s) { return document.querySelector(s); };
  var count = $("#cartCount"), total = $("#cartTotal"), body = $("#drawerBody");

  function find(id) { for (var i = 0; i < PRODUCTS.length; i++) if (PRODUCTS[i].id === id) return PRODUCTS[i]; }

  function render() {
    var ids = Object.keys(cart), qty = 0, sum = 0;
    ids.forEach(function (id) { qty += cart[id]; sum += cart[id] * find(id).price; });
    count.textContent = qty;
    total.textContent = fmt(sum);
    if (!ids.length) {
      body.innerHTML = '<div class="drawer-empty">Your bag is empty.<br>The court awaits.</div>';
      return;
    }
    body.innerHTML = ids.map(function (id) {
      var p = find(id);
      return '<div class="ci"><img src="' + p.img + '" alt="' + p.name + '">' +
        '<div class="cd"><h4>' + p.name + '</h4><div class="sub">' + p.sub + '</div>' +
        '<div class="qr"><button data-dec="' + id + '">−</button><span>' + cart[id] + '</span>' +
        '<button data-inc="' + id + '">+</button><button class="rm" data-rm="' + id + '">Remove</button></div></div>' +
        '<div class="cp">' + fmt(p.price * cart[id]) + "</div></div>";
    }).join("");
  }

  var toast = $("#toast"), toastT;
  function popToast(msg) {
    toast.textContent = msg; toast.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(function () { toast.classList.remove("show"); }, 1800);
  }

  function add(id) { cart[id] = (cart[id] || 0) + 1; render(); popToast("Added — " + find(id).name); }

  document.addEventListener("click", function (e) {
    var t = e.target;
    if (t.dataset.add) { add(t.dataset.add); openCart(); }
    else if (t.dataset.inc) { cart[t.dataset.inc]++; render(); }
    else if (t.dataset.dec) { var i = t.dataset.dec; cart[i]--; if (cart[i] < 1) delete cart[i]; render(); }
    else if (t.dataset.rm) { delete cart[t.dataset.rm]; render(); }
  });

  /* ---------- DRAWER ---------- */
  var drawer = $("#drawer"), overlay = $("#overlay");
  function openCart() { drawer.classList.add("open"); overlay.classList.add("open"); }
  function closeCart() { drawer.classList.remove("open"); overlay.classList.remove("open"); }
  $("#openCart").addEventListener("click", openCart);
  $("#closeCart").addEventListener("click", closeCart);
  overlay.addEventListener("click", closeCart);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") { closeCart(); closeMenu(); } });
  $("#checkout").addEventListener("click", function () {
    if (!Object.keys(cart).length) { popToast("Your bag is empty"); return; }
    popToast("Checkout coming soon — DM us on Instagram");
  });
  render();

  /* ---------- MOBILE MENU ---------- */
  var burger = $("#burger"), menu = $("#mobileMenu");
  function closeMenu() { menu.classList.remove("open"); burger.classList.remove("on"); }
  burger.addEventListener("click", function () { menu.classList.toggle("open"); });
  menu.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", closeMenu); });

  /* ---------- NAV SHRINK ---------- */
  var nav = $("#nav");
  window.addEventListener("scroll", function () {
    nav.classList.toggle("shrink", window.scrollY > 40);
  }, { passive: true });

  /* ---------- REVEAL ---------- */
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll("[data-reveal]").forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll("[data-reveal]").forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- PARALLAX + SIGNATURE ---------- */
  var pxEls = [].slice.call(document.querySelectorAll("[data-parallax]"));
  var sig = document.getElementById("sigWord");
  var ticking = false;
  function onScroll() {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () {
      var vh = window.innerHeight;
      pxEls.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.bottom > 0 && r.top < vh) {
          var speed = parseFloat(el.dataset.parallax) || 0.1;
          var offset = (r.top + r.height / 2 - vh / 2) * speed;
          var img = el.querySelector("img") || el;
          img.style.transform = "translate3d(0," + (-offset).toFixed(1) + "px,0)";
        }
      });
      if (sig) {
        var sr = sig.getBoundingClientRect();
        if (sr.bottom > 0 && sr.top < vh) {
          var p = 1 - (sr.top + sr.height) / (vh + sr.height); // 0..1
          var shift = (p - 0.5) * -window.innerWidth * 0.28;
          sig.style.transform = "translateX(" + shift.toFixed(1) + "px)";
          sig.classList.toggle("fill", p > 0.42);
        }
      }
      ticking = false;
    });
  }
  if (!reduce) { window.addEventListener("scroll", onScroll, { passive: true }); onScroll(); }

  /* ---------- NEWSLETTER ---------- */
  var form = $("#joinForm"), jmsg = $("#joinMsg");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var v = $("#joinEmail").value.trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) { jmsg.textContent = "Enter a valid email to enlist."; return; }
    jmsg.textContent = "Welcome to the Court. Watch your inbox. ✦";
    form.reset();
  });

  /* ---------- YEAR ---------- */
  $("#yr").textContent = new Date().getFullYear();

  /* ---------- PRELOADER ---------- */
  window.addEventListener("load", function () {
    setTimeout(function () { document.getElementById("preloader").classList.add("done"); }, reduce ? 100 : 1400);
  });
})();
