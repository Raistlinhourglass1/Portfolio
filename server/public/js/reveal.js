// Fades/lifts .reveal elements into place as they scroll into view.
// Progressive enhancement: elements are only hidden via the .reveal class
// once JS confirms IntersectionObserver support, so nothing breaks or stays
// invisible if this script fails to load.
(function () {
  var els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  // No IntersectionObserver support: just show everything immediately
  // rather than leaving it hidden under the .js scroll-reveal styles.
  if (!('IntersectionObserver' in window)) {
    els.forEach(function (el) {
      el.classList.add('in');
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  els.forEach(function (el) {
    observer.observe(el);
  });
})();
