document.addEventListener("DOMContentLoaded", function () {
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var selectors = [
    ".projects_wrap .project",
    ".faq_item_wrap .faq-item",
    ".services_grid .service_card_wrap",
    ".collection-list-5 .collection-item-4",
    ".collection-list-4 .collection-item-3"
  ];
  var targets = [];

  function addTargets(selector) {
    document.querySelectorAll(selector).forEach(function (element, index) {
      if (element.classList.contains("scroll-reveal-target")) {
        return;
      }

      element.classList.add("scroll-reveal-target");
      element.style.setProperty("--scroll-reveal-delay", index * 90 + "ms");
      targets.push(element);
    });
  }

  function reveal(element) {
    element.classList.add("is-visible");
  }

  function isInViewport(element) {
    var rect = element.getBoundingClientRect();
    var viewportHeight = window.innerHeight || document.documentElement.clientHeight;

    return rect.top < viewportHeight * 0.92 && rect.bottom > viewportHeight * 0.08;
  }

  selectors.forEach(addTargets);

  if (!targets.length) {
    return;
  }

  if (reducedMotion || !("IntersectionObserver" in window)) {
    targets.forEach(reveal);
    return;
  }

  document.documentElement.classList.add("scroll-reveal-ready");

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) {
          return;
        }

        reveal(entry.target);
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -8% 0px"
    }
  );

  window.requestAnimationFrame(function () {
    window.requestAnimationFrame(function () {
      targets.forEach(function (element) {
        if (isInViewport(element)) {
          reveal(element);
          return;
        }

        observer.observe(element);
      });
    });
  });
});
