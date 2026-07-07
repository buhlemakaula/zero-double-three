/* ============================================================
   Space Bar — interactions + 3D scroll scene (three.js r128)
   ============================================================ */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Age gate ---------- */
  var gate = document.getElementById("age-gate");
  var KEY = "sb_age_ok";
  try {
    if (localStorage.getItem(KEY) === "1") gate.classList.add("hidden");
  } catch (e) {}
  var yes = document.getElementById("age-yes");
  if (yes) {
    yes.addEventListener("click", function () {
      gate.classList.add("hidden");
      try { localStorage.setItem(KEY, "1"); } catch (e) {}
    });
  }

  /* ---------- Year ---------- */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  /* ---------- Header scroll state ---------- */
  var header = document.getElementById("site-header");
  function onScrollHeader() {
    if (window.scrollY > 40) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  }
  onScrollHeader();
  window.addEventListener("scroll", onScrollHeader, { passive: true });

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el, i) {
      el.style.transitionDelay = (Math.min(i % 4, 3) * 0.08) + "s";
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Count-up stats ---------- */
  var counters = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        var target = parseInt(el.getAttribute("data-count"), 10);
        var suffix = el.getAttribute("data-suffix") || "";
        var dur = 1400, start = null;
        function step(ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(eased * target) + suffix;
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        cio.unobserve(el);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ============================================================
     3D scene: starfield + ringed planet, scroll driven
     ============================================================ */
  var canvas = document.getElementById("scene");
  if (!canvas || typeof THREE === "undefined" || reduceMotion) return;

  var renderer, scene, camera, planet, ring, stars, glow;
  var targetScroll = 0, currentScroll = 0;
  var mouseX = 0, mouseY = 0;
  var W = window.innerWidth, H = window.innerHeight;

  function init() {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 100);
    camera.position.set(0, 0, 9);

    // Lights
    scene.add(new THREE.AmbientLight(0x2a3550, 1.1));
    var key = new THREE.DirectionalLight(0x9fc0ff, 1.4);
    key.position.set(-4, 3, 5);
    scene.add(key);
    var rim = new THREE.DirectionalLight(0x7fb069, 0.7);
    rim.position.set(5, -2, -3);
    scene.add(rim);

    // Planet
    var planetGeo = new THREE.SphereGeometry(2.1, 64, 64);
    var planetMat = new THREE.MeshStandardMaterial({
      color: 0x2f4a7a, roughness: 0.55, metalness: 0.25,
      emissive: 0x101a30, emissiveIntensity: 0.6
    });
    planet = new THREE.Mesh(planetGeo, planetMat);
    planet.position.set(3.2, 0.4, 0);
    scene.add(planet);

    // Glow halo
    var glowGeo = new THREE.SphereGeometry(2.35, 32, 32);
    var glowMat = new THREE.MeshBasicMaterial({ color: 0x4a7fd6, transparent: true, opacity: 0.10, side: THREE.BackSide });
    glow = new THREE.Mesh(glowGeo, glowMat);
    planet.add(glow);

    // Ring
    var ringGeo = new THREE.RingGeometry(2.9, 4.2, 96);
    var ringMat = new THREE.MeshBasicMaterial({ color: 0x6f9dea, transparent: true, opacity: 0.35, side: THREE.DoubleSide });
    ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -1.15;
    ring.rotation.y = 0.25;
    planet.add(ring);

    // Starfield
    var starCount = 1400;
    var pos = new Float32Array(starCount * 3);
    for (var i = 0; i < starCount; i++) {
      var r = 14 + Math.random() * 26;
      var t = Math.random() * Math.PI * 2;
      var ph = Math.acos(2 * Math.random() - 1);
      pos[i * 3]     = r * Math.sin(ph) * Math.cos(t);
      pos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(t);
      pos[i * 3 + 2] = r * Math.cos(ph) - 10;
    }
    var starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    var starMat = new THREE.PointsMaterial({ color: 0xcdd8f0, size: 0.06, transparent: true, opacity: 0.9, sizeAttenuation: true });
    stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", function () { targetScroll = window.scrollY; }, { passive: true });
    window.addEventListener("mousemove", function (e) {
      mouseX = (e.clientX / W - 0.5);
      mouseY = (e.clientY / H - 0.5);
    }, { passive: true });

    animate();
  }

  function onResize() {
    W = window.innerWidth; H = window.innerHeight;
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
    renderer.setSize(W, H);
  }

  function animate() {
    requestAnimationFrame(animate);
    currentScroll += (targetScroll - currentScroll) * 0.06;
    var docH = Math.max(document.body.scrollHeight - window.innerHeight, 1);
    var prog = currentScroll / docH; // 0..1

    // Idle rotation
    planet.rotation.y += 0.0025;

    // Scroll-driven journey: planet drifts across & scales, ring tilts
    planet.position.x = 3.2 - prog * 6.4;      // right -> left
    planet.position.y = 0.4 - Math.sin(prog * Math.PI) * 1.6;
    var s = 1 - prog * 0.35 + Math.sin(prog * Math.PI) * 0.15;
    planet.scale.setScalar(Math.max(s, 0.4));
    ring.rotation.z = prog * 1.2;
    ring.material.opacity = 0.35 + Math.sin(prog * Math.PI) * 0.25;

    // Camera parallax from mouse
    camera.position.x += (mouseX * 1.4 - camera.position.x) * 0.04;
    camera.position.y += (-mouseY * 1.0 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);

    // Starfield slow spin + depth from scroll
    stars.rotation.y += 0.0004;
    stars.rotation.x = prog * 0.3;
    stars.position.z = 2 + prog * 4;

    renderer.render(scene, camera);
  }

  init();
})();
