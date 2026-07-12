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
