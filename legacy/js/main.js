// Scales the cover wordmark so PORTFOLIO spans the card edge-to-edge
// at any viewport width, once the display font has loaded.
(function () {
  var mark = document.querySelector(".wordmark");
  var line = document.querySelector(".w-line");
  if (!mark || !line) return;

  function fit() {
    var available = mark.parentElement.clientWidth;
    if (!available) return;
    mark.style.fontSize = "100px";
    var measured = line.getBoundingClientRect().width;
    if (measured) mark.style.fontSize = (100 * available) / measured + "px";
  }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(fit);
  }
  window.addEventListener("load", fit);
  window.addEventListener("resize", fit);
})();

// Scroll-triggered reveals. Elements with .reveal fade/slide in once,
// staggered via their inline --d custom property.
(function () {
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var targets = document.querySelectorAll(".reveal");

  if (reduced || !("IntersectionObserver" in window)) {
    targets.forEach(function (el) { el.classList.add("in"); });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  targets.forEach(function (el) { observer.observe(el); });
})();

// Lightbox: clicking a gallery image opens it full size, uncropped.
(function () {
  var box = document.getElementById("lightbox");
  if (!box) return;
  var img = box.querySelector("img");

  function close() {
    box.hidden = true;
    img.src = "";
    document.body.style.overflow = "";
  }

  document.querySelectorAll(".project-gallery figure").forEach(function (fig) {
    fig.addEventListener("click", function () {
      var source = fig.querySelector("img");
      img.src = source.src;
      img.alt = source.alt;
      box.hidden = false;
      document.body.style.overflow = "hidden";
    });
  });

  box.addEventListener("click", close);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !box.hidden) close();
  });
})();
