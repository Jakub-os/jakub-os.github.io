(function () {
  var homepageHref = "/index.html";
  var mobileBreakpoint = window.matchMedia("(max-width: 991px)");
  var root = document.documentElement;
  var body = document.body;
  var languageStorageKey = "yabi-language";
  var navContent = {
    sk: {
      links: {
        about: "O N\u00c1S",
        projects: "PROJEKTY",
        services: "SLU\u017dBY",
        blog: "BLOG",
        contact: "KONTAKT"
      },
      a11y: {
        mainNavigation: "Hlavn\u00e1 navig\u00e1cia",
        openMenu: "Otvori\u0165 menu",
        closeMenu: "Zavrie\u0165 menu",
        languageSwitcher: "Prep\u00edna\u010d jazyka",
        homeLogo: "Prejs\u0165 na domovsk\u00fa str\u00e1nku"
      }
    },
    en: {
      links: {
        about: "ABOUT US",
        projects: "PROJECTS",
        services: "SERVICES",
        blog: "BLOG",
        contact: "CONTACT"
      },
      a11y: {
        mainNavigation: "Main navigation",
        openMenu: "Open menu",
        closeMenu: "Close menu",
        languageSwitcher: "Language switcher",
        homeLogo: "Go to homepage"
      }
    }
  };
  var navLinks = [
    { key: "about", href: "o-nas.html" },
    { key: "projects", href: "projekty.html" },
    { key: "services", href: "sluzby.html" },
    { key: "blog", href: "blogs/blog-list.html" }
  ];
  var articleSidebarThumbnails = {
    "creating-blogs": "../images/articles/creating-blogs/creating-blogs-thumbnail.jpg",
    "design-systemin-webflow": "../images/articles/design-system-in-webflow/design-system-in-webflow-thumbnail.jpg",
    "forms-crm": "../images/articles/forms-crm/forms-crm-thumbnail.jpg",
    "hero-section": "../images/articles/hero-section/hero-section-thumbnail.jpg",
    "increasing-conversion": "../images/articles/increasing-conversion/zvysovanie-konverzie-thumbnail.jpg",
    "landing-page": "../images/articles/landing-page/landing-page-thumbnail.jpg",
    "live-launch": "../images/articles/live-launch/live-launch-thumbnail.jpg",
    "measuring-web-success": "../images/articles/measuring-web-success/measuring-web-success-thumbnail.png",
    "performance-optimalization": "../images/articles/performance-optimization/performance-optimalization-thumbnail.jpg",
    "seo-webflow": "../images/articles/seo-webflow/seo-webflow-thumbnail.jpg",
    "start-web-project": "../images/articles/start-web-project/start-web-project-thumbnail.jpg",
    "web-accessibility": "../images/articles/web-accessibility/web-accessibility-thumbnail.jpg",
    "web-ai-chatbot": "../images/articles/web-ai-chatbot/web-ai-chatbot-thumbnail.jpg",
    "webdesign-dictionary": "../images/articles/webdesign-dictionary/webdesign-dictionary-thumbnail.jpg",
    "webflow-animation": "../images/articles/webflow-animation/webflow-animation-thumbnail.jpg",
    "webflow-cms": "../images/articles/webflow-cms/webflow-cms-thumbnail.jpg",
    "webflow-no-code": "../images/articles/webflow-no-code/webflow-no-code-thumbnail.jpg",
    "web-locale": "../images/articles/web-locale/web-locale-thumbnail.jpg",
    "web-maitenence": "../images/articles/website-maintenance/web-maitenence-thumbnail.jpg",
    "web-redesign": "../images/articles/web-redesign/web-redesign-thumbnail.jpg",
    "wordpress-to-webflow": "../images/articles/wordpress-to-webflow/wordpress-to-webflow-thumbnail.jpg"
  };
  var footerSocialLinks = [
    {
      href: "https://www.instagram.com/studio_yabi/",
      label: "Instagram"
    },
    {
      href: "https://www.behance.net/yabi_studio",
      label: "Behance"
    }
  ];
  var articlePageMetadata = {
    "forms-crm": {
      chips: ["Pokročilý", "Automatizácia", "Development"]
    },
    "landing-page": {
      chips: ["Začiatočníci", "Copy", "Konverzie"]
    },
    "live-launch": {
      chips: ["Začiatočníci", "Webflow", "Launch"]
    },
    "web-accessibility": {
      chips: ["Začiatočníci", "Prístupnosť", "UX"]
    },
    "web-locale": {
      chips: ["Pokročilý", "Lokalizácia", "SEO"]
    },
    "webdesign-dictionary": {
      chips: ["Slovník", "Webdizajn"]
    }
  };
  var featuredProjectLinks = {
    "Devio Website": "/featured-projects/devio-website.html",
    "Lumi App": "/featured-projects/lumi-app.html",
    "Pathfinder App": "/featured-projects/pathfinder-app.html"
  };
  var heroHeadingDelayStep = 35;

  function createHeroHeadingSeparator() {
    var separator = document.createElement("span");

    separator.className = "hero-heading-separator";
    separator.textContent = " ";

    return separator;
  }

  function setScrollLock(isLocked) {
    root.classList.toggle("mobile-nav-open", isLocked);
    body.classList.toggle("mobile-nav-open", isLocked);
  }

  function upgradeNavigation() {
    document.querySelectorAll(".nav_container").forEach(function (nav, index) {
      var language = getActiveNavigationLanguage();
      var activeRouteKey = getActiveNavRouteKey();
      var siteHeader = nav.closest(".nav_section");
      var navRoot;

      if (nav.dataset.yabiNavUpgraded === "true") {
        syncNavigationLanguage(nav, language);
        syncNavigationActiveState(nav, activeRouteKey);
        return;
      }

      nav.dataset.yabiNavUpgraded = "true";
      nav.innerHTML = buildNavigationMarkup(index, language, activeRouteKey);
      navRoot = nav.querySelector(".yabi-nav");

      if (!navRoot) {
        return;
      }

      nav.classList.add("yabi-nav-shell");
      nav.style.display = "inline-flex";
      nav.style.width = "fit-content";
      nav.style.maxWidth = "100%";
      nav.style.margin = "0 auto";
      nav.style.padding = "0";
      nav.style.border = "0";
      nav.style.background = "transparent";
      nav.style.boxShadow = "none";
      nav.style.backdropFilter = "none";
      nav.style.webkitBackdropFilter = "none";

      if (siteHeader) {
        siteHeader.classList.add("yabi-nav-section");
      }

      initializeUpgradedNavigation(nav, navRoot, siteHeader);
      syncNavigationLanguage(nav, language);
      syncNavigationActiveState(nav, activeRouteKey);
    });

    document.addEventListener("yabi:languagechange", function (event) {
      var nextLanguage = event && event.detail ? event.detail.language : getActiveNavigationLanguage();
      syncAllNavigation(nextLanguage);
    });

    window.setTimeout(function () {
      syncAllNavigation(getActiveNavigationLanguage());
    }, 0);
  }

  function syncAllNavigation(language) {
    var activeRouteKey = getActiveNavRouteKey();

    document.querySelectorAll(".nav_container[data-yabi-nav-upgraded='true']").forEach(function (nav) {
      syncNavigationLanguage(nav, language);
      syncNavigationActiveState(nav, activeRouteKey);
    });
  }

  function getActiveNavigationLanguage() {
    var storedLanguage = "sk";

    if (window.YabiLocalization && typeof window.YabiLocalization.getLanguage === "function") {
      storedLanguage = window.YabiLocalization.getLanguage();
    } else {
      try {
        storedLanguage = window.localStorage.getItem(languageStorageKey) || "sk";
      } catch (error) {
        storedLanguage = "sk";
      }
    }

    return storedLanguage === "en" ? "en" : "sk";
  }

  function getActiveNavRouteKey() {
    var path = normalizeSitePath(window.location.pathname || "/");
    var segments = path.split("/").filter(Boolean);
    var lastSegment = segments.slice(-1)[0] || "";

    if (!segments.length || path === "/" || lastSegment === "index.html") {
      return "home";
    }

    if (lastSegment === "o-nas.html") {
      return "about";
    }

    if (lastSegment === "projekty.html" || segments[0] === "featured-projects") {
      return "projects";
    }

    if (lastSegment === "sluzby.html") {
      return "services";
    }

    if (lastSegment === "kontaktujte-nas.html") {
      return "contact";
    }

    if (lastSegment === "blog-list.html" || segments[0] === "articles") {
      return "blog";
    }

    return "";
  }

  function normalizeSitePath(path) {
    return path.replace(/\\/g, "/").replace(/\/+/g, "/");
  }

  function getRelativePrefix() {
    var path = normalizeSitePath(window.location.pathname || "/");
    var segments = path.split("/").filter(Boolean);

    if (!segments.length || path === "/" || segments[segments.length - 1] === "index.html") {
      return "";
    }

    segments.pop();

    return segments.length ? new Array(segments.length + 1).join("../") : "";
  }

  function resolveSitePath(relativePath) {
    return getRelativePrefix() + relativePath.replace(/^\/+/, "");
  }

  function getNavigationCopy(language) {
    return navContent[language === "en" ? "en" : "sk"];
  }

  function buildNavigationMarkup(index, language, activeRouteKey) {
    var copy = getNavigationCopy(language);
    var panelId = "yabi-nav-panel-" + (index + 1);
    var homeHref = resolveSitePath("index.html");
    var visualHref = resolveSitePath("kontaktujte-nas.html");
    var visualImageSrc = encodeURI(resolveSitePath("Yabi-nav/images/Image Container.png"));
    var visualIsCurrent = activeRouteKey === "contact";

    return [
      '<div class="yabi-nav" data-yabi-nav-root>',
      '  <div class="yabi-nav__bar">',
      '    <a class="yabi-nav__home-link" href="' + homeHref + '" aria-label="' + copy.a11y.homeLogo + '">',
      getBrandMarkSvg(),
      "    </a>",
      '    <button class="yabi-nav__toggle" type="button" aria-controls="' + panelId + '" aria-expanded="false" aria-label="' + copy.a11y.openMenu + '">',
      getToggleIconsSvg(),
      "    </button>",
      "  </div>",
      '  <section class="yabi-nav__panel" id="' + panelId + '" aria-label="' + copy.a11y.mainNavigation + '" aria-hidden="true">',
      '    <div class="yabi-nav__layout">',
      '      <div class="yabi-nav__main">',
      '        <div class="yabi-nav__links">',
      navLinks.map(function (link) {
        var isCurrent = link.key === activeRouteKey;

        return [
          '          <a class="yabi-nav__text-link' + (isCurrent ? " is-current" : "") + '" href="' + resolveSitePath(link.href) + '"' + (isCurrent ? ' aria-current="page"' : "") + ' data-close-menu data-nav-key="' + link.key + '">',
          '            <span data-yabi-nav-label="' + link.key + '">' + copy.links[link.key] + "</span>",
          "          </a>"
        ].join("");
      }).join(""),
      '          <div class="language_switcher yabi-nav__language" aria-label="' + copy.a11y.languageSwitcher + '">',
      '            <button type="button" class="language_switch_link yabi-nav__language-button" data-language="sk">SK</button>',
      '            <span class="yabi-nav__language-separator" aria-hidden="true">/</span>',
      '            <button type="button" class="language_switch_link yabi-nav__language-button" data-language="en">EN</button>',
      "          </div>",
      "        </div>",
      '        <a class="yabi-nav__visual' + (visualIsCurrent ? " is-current" : "") + '" href="' + visualHref + '"' + (visualIsCurrent ? ' aria-current="page"' : "") + ' data-close-menu data-nav-key="contact">',
      '          <img src="' + visualImageSrc + '" alt="" loading="lazy">',
      '          <span class="yabi-nav__visual-label" data-yabi-nav-label="contact">' + copy.links.contact + "</span>",
      "        </a>",
      "      </div>",
      '      <div class="yabi-nav__footer">',
      "        <p>YABI Studio</p>",
      "        <p>" + new Date().getFullYear() + "</p>",
      "      </div>",
      "    </div>",
      "  </section>",
      "</div>"
    ].join("");
  }

  function syncNavigationLanguage(nav, language) {
    var copy = getNavigationCopy(language);
    var navRoot = nav.querySelector("[data-yabi-nav-root]");
    var toggleButton;
    var navPanel;
    var homeLink;
    var languageSwitcher;

    if (!navRoot) {
      return;
    }

    toggleButton = navRoot.querySelector(".yabi-nav__toggle");
    navPanel = navRoot.querySelector(".yabi-nav__panel");
    homeLink = navRoot.querySelector(".yabi-nav__home-link");
    languageSwitcher = navRoot.querySelector(".language_switcher");

    nav.setAttribute("aria-label", copy.a11y.mainNavigation);

    if (navPanel) {
      navPanel.setAttribute("aria-label", copy.a11y.mainNavigation);
    }

    if (homeLink) {
      homeLink.setAttribute("aria-label", copy.a11y.homeLogo);
    }

    if (languageSwitcher) {
      languageSwitcher.setAttribute("aria-label", copy.a11y.languageSwitcher);
    }

    if (toggleButton) {
      toggleButton.setAttribute(
        "aria-label",
        navRoot.classList.contains("is-open") ? copy.a11y.closeMenu : copy.a11y.openMenu
      );
    }

    navRoot.querySelectorAll("[data-yabi-nav-label]").forEach(function (label) {
      var key = label.getAttribute("data-yabi-nav-label");

      if (copy.links[key]) {
        label.textContent = copy.links[key];
      }
    });

    navRoot.querySelectorAll(".language_switch_link").forEach(function (button) {
      var isActive = button.getAttribute("data-language") === language;

      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  }

  function syncNavigationActiveState(nav, activeRouteKey) {
    var navRoot = nav.querySelector("[data-yabi-nav-root]");

    if (!navRoot) {
      return;
    }

    navRoot.querySelectorAll("[data-nav-key]").forEach(function (link) {
      var isCurrent = link.getAttribute("data-nav-key") === activeRouteKey;

      link.classList.toggle("is-current", isCurrent);

      if (isCurrent) {
        link.setAttribute("aria-current", "page");
        return;
      }

      link.removeAttribute("aria-current");
    });
  }

  function initializeUpgradedNavigation(nav, navRoot, siteHeader) {
    var toggleButton = navRoot.querySelector(".yabi-nav__toggle");
    var navPanel = navRoot.querySelector(".yabi-nav__panel");
    var closeTargets = navRoot.querySelectorAll("[data-close-menu]");
    var lastScrollY = window.scrollY;
    var ticking = false;
    var motionClassTimer = null;
    var navMotionDuration = 460;

    if (!toggleButton) {
      return;
    }

    function isMenuOpen() {
      return navRoot.classList.contains("is-open");
    }

    function playMotionState(stateClassName) {
      if (motionClassTimer) {
        window.clearTimeout(motionClassTimer);
      }

      navRoot.classList.remove("is-opening", "is-closing");
      navRoot.classList.add("is-transitioning", stateClassName);

      motionClassTimer = window.setTimeout(function () {
        navRoot.classList.remove("is-transitioning", "is-opening", "is-closing");
        motionClassTimer = null;
      }, navMotionDuration);
    }

    function setExpandedState(isExpanded) {
      var copy = getNavigationCopy(getActiveNavigationLanguage());

      navRoot.classList.toggle("is-open", isExpanded);
      toggleButton.setAttribute("aria-expanded", String(isExpanded));
      toggleButton.setAttribute("aria-label", isExpanded ? copy.a11y.closeMenu : copy.a11y.openMenu);

      if (navPanel) {
        navPanel.setAttribute("aria-hidden", String(!isExpanded));

        if ("inert" in navPanel) {
          navPanel.inert = !isExpanded;
        }
      }

      setScrollLock(isExpanded);

      if (siteHeader) {
        siteHeader.classList.remove("is-hidden");
      }
    }

    function openMenu() {
      if (isMenuOpen()) {
        return;
      }

      playMotionState("is-opening");
      setExpandedState(true);
    }

    function closeMenu(shouldReturnFocus) {
      if (!isMenuOpen()) {
        return;
      }

      playMotionState("is-closing");
      setExpandedState(false);

      if (shouldReturnFocus) {
        toggleButton.focus();
      }
    }

    function updateHeaderVisibility() {
      var currentScrollY = window.scrollY;
      var scrolledDown = currentScrollY > lastScrollY;
      var passedThreshold = currentScrollY > 120;

      if (siteHeader) {
        siteHeader.classList.toggle("is-hidden", !isMenuOpen() && scrolledDown && passedThreshold);
      }

      lastScrollY = currentScrollY;
      ticking = false;
    }

    function handleScroll() {
      if (ticking) {
        return;
      }

      ticking = true;
      window.requestAnimationFrame(updateHeaderVisibility);
    }

    toggleButton.addEventListener("click", function () {
      if (isMenuOpen()) {
        closeMenu(true);
        return;
      }

      openMenu();
    });

    closeTargets.forEach(function (target) {
      target.addEventListener("click", function () {
        closeMenu(false);
      });
    });

    document.addEventListener("click", function (event) {
      if (!isMenuOpen() || nav.contains(event.target)) {
        return;
      }

      closeMenu(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeMenu(true);
      }
    });

    window.addEventListener("scroll", handleScroll, { passive: true });
    setExpandedState(false);
  }

  function getBrandMarkSvg() {
    return [
      '<svg class="yabi-nav__brand-mark" viewBox="0 0 46 44" aria-hidden="true" focusable="false">',
      '  <path d="M0 13.6353V3.27308C0 2.75205 0.3546 2.29864 0.8591 2.17392L9.6439 0.00355503C9.7183 -0.015095 9.7904 0.042025 9.7904 0.118955V6.8888L0 13.6353Z" transform="translate(23.658 1.954)"></path>',
      '  <path d="M12.4981 0.230293L6.249 4.53605L0 8.8418V3.0872L12.397 0.00416487C12.533 -0.0296378 12.6144 0.151031 12.4981 0.231458V0.230293Z" transform="translate(33.446 0)"></path>',
      '  <path d="M33.446 14.7439V0.12484C33.446 0.0245996 33.3332 -0.0348505 33.2507 0.0222595L0.0544279 22.8973C-0.0595088 22.9765 0.0207119 23.1549 0.154413 23.1211L33.3507 14.8639C33.4065 14.8499 33.4448 14.7998 33.4448 14.7427L33.446 14.7439Z" transform="translate(0 8.954)"></path>',
      '  <path d="M29.1341 0L0.183704 20.01C0.0918539 20.0729 -0.0278959 19.9843 0.00582414 19.8782L4.32495 6.1707L29.1341 0Z" transform="translate(4.315 23.795)"></path>',
      '  <path d="M0 6.0017L3.4251 16.8593L8.6824 0L0 6.0017Z" transform="translate(19.927 27.139)"></path>',
      '  <path d="M9.723 4.8408L1.5788 0L0 5.0634H4.8313H9.6625C9.7834 5.0634 9.8276 4.9025 9.723 4.8408Z" transform="translate(23.35 38.936)"></path>',
      '  <path class="yabi-nav__brand-dot" d="M1.3219 2.65059C2.052 2.65059 2.6438 2.05723 2.6438 1.32529C2.6438 0.59335 2.052 0 1.3219 0C0.591899 0 0 0.59335 0 1.32529C0 2.05723 0.591899 2.65059 1.3219 2.65059Z" transform="translate(27.076 6.266)"></path>',
      "</svg>"
    ].join("");
  }

  function getToggleIconsSvg() {
    return [
      '<svg class="yabi-nav__toggle-icon yabi-nav__toggle-icon--menu" viewBox="0 0 26 26" aria-hidden="true" focusable="false">',
      '  <path d="M26 5V7H0V5H26Z"></path>',
      '  <path d="M26 12V14H0V12H26Z"></path>',
      '  <path d="M26 19V21H0V19H26Z"></path>',
      "</svg>",
      '<svg class="yabi-nav__toggle-icon yabi-nav__toggle-icon--close" viewBox="0 0 26 26" aria-hidden="true" focusable="false">',
      '  <path d="M22.8995 21.4853L21.4853 22.8995L3.10051 4.51472L4.51472 3.10051L22.8995 21.4853Z"></path>',
      '  <path d="M21.4853 3.10051L22.8995 4.51472L4.51472 22.8995L3.10051 21.4853L21.4853 3.10051Z"></path>',
      "</svg>"
    ].join("");
  }

  normalizeInlineSvgIds();
  disableInactiveLanguageSwitchers();
  normalizeEmbeddedBrandLinks();
  improveFormAccessibility();
  initializeFormEnhancements();
  addCardAriaLabels();
  upgradeNavigation();

  document.querySelectorAll(".nav_container").forEach(function (nav, index) {
    var menu = nav.querySelector(".menu_mobile");
    var openButton = nav.querySelector(".link-3");
    var closeButton = nav.querySelector(".close_div");
    var mobileLogo = nav.querySelector(".menu_mobile .image-4");

    if (!menu || !openButton || !closeButton) {
      return;
    }

    nav.setAttribute("aria-label", "Hlavná navigácia");

    var menuId = menu.id || "mobile-menu-" + (index + 1);
    menu.id = menuId;
    openButton.setAttribute("aria-label", "Otvoriť menu");
    openButton.setAttribute("aria-controls", menuId);
    openButton.setAttribute("aria-expanded", "false");
    openButton.setAttribute("aria-haspopup", "dialog");
    closeButton.setAttribute("aria-label", "Zavrieť menu");
    menu.setAttribute("aria-hidden", "true");
    menu.setAttribute("aria-modal", "true");
    menu.setAttribute("role", "dialog");

    if ("inert" in menu) {
      menu.inert = true;
    }

    function syncState(isOpen) {
      menu.classList.toggle("is-open", isOpen);
      openButton.setAttribute("aria-expanded", String(isOpen));
      menu.setAttribute("aria-hidden", String(!isOpen));

      if ("inert" in menu) {
        menu.inert = !isOpen;
      }

      setScrollLock(isOpen);
    }

    function openMenu() {
      if (!mobileBreakpoint.matches) {
        return;
      }

      syncState(true);
      closeButton.focus();
    }

    function closeMenu(returnFocus) {
      var wasOpen = menu.classList.contains("is-open");
      syncState(false);

      if (returnFocus && wasOpen) {
        openButton.focus();
      }
    }

    openButton.addEventListener("click", function (event) {
      if (!mobileBreakpoint.matches) {
        return;
      }

      event.preventDefault();
      openMenu();
    });

    openButton.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openMenu();
      }
    });

    closeButton.addEventListener("click", function (event) {
      event.preventDefault();
      closeMenu(true);
    });

    closeButton.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        closeMenu(true);
      }
    });

    menu.querySelectorAll(".menu-item").forEach(function (link) {
      link.addEventListener("click", function () {
        closeMenu(false);
      });
    });

    if (mobileLogo) {
      mobileLogo.style.cursor = "pointer";
      mobileLogo.tabIndex = 0;
      mobileLogo.setAttribute("role", "link");
      mobileLogo.setAttribute("aria-label", "Prejst na domovsku stranku");
      mobileLogo.addEventListener("click", function () {
        window.location.href = homepageHref;
      });
      mobileLogo.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          window.location.href = homepageHref;
        }
      });
    }

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeMenu(true);
      }
    });

    function handleBreakpointChange(event) {
      if (!event.matches) {
        closeMenu(false);
      }
    }

    if (typeof mobileBreakpoint.addEventListener === "function") {
      mobileBreakpoint.addEventListener("change", handleBreakpointChange);
    } else {
      mobileBreakpoint.addListener(handleBreakpointChange);
    }
  });

  normalizeFooterBrandBlocks();
  repairArticleSidebars();
  normalizeArticlePages();
  normalizeFeaturedProjectLinks();
  enhanceHeroHeadings();

  function getDirectChildByClass(parent, className) {
    var index;

    for (index = 0; index < parent.children.length; index += 1) {
      if (parent.children[index].classList.contains(className)) {
        return parent.children[index];
      }
    }

    return null;
  }

  function normalizeInlineSvgIds() {
    document.querySelectorAll("svg").forEach(function (svg, svgIndex) {
      var idMap = {};
      var idKeys;

      svg.querySelectorAll("[id]").forEach(function (element) {
        var originalId = element.id;
        var uniqueId = originalId + "-svg-" + (svgIndex + 1);

        idMap[originalId] = uniqueId;
        element.id = uniqueId;
      });

      idKeys = Object.keys(idMap);

      if (!idKeys.length) {
        return;
      }

      svg.querySelectorAll("*").forEach(function (element) {
        Array.prototype.slice.call(element.attributes || []).forEach(function (attribute) {
          var updatedValue = attribute.value;

          idKeys.forEach(function (originalId) {
            var uniqueId = idMap[originalId];

            updatedValue = updatedValue.split("url(#" + originalId + ")").join("url(#" + uniqueId + ")");

            if (updatedValue === "#" + originalId) {
              updatedValue = "#" + uniqueId;
            }
          });

          if (updatedValue !== attribute.value) {
            element.setAttribute(attribute.name, updatedValue);
          }
        });
      });
    });
  }

  function disableInactiveLanguageSwitchers() {
    document.querySelectorAll(".language_switcher").forEach(function (switcher) {
      switcher.setAttribute("aria-label", "Prepínač jazyka zatiaľ nie je aktívny");

      switcher.querySelectorAll(".language_switch_link").forEach(function (button) {
        button.setAttribute("disabled", "");
        button.setAttribute("aria-disabled", "true");
        button.tabIndex = -1;
      });
    });
  }

  function normalizeEmbeddedBrandLinks() {
    document.querySelectorAll(".nav_logo .yabi-logo, .footer_card .yabi-logo").forEach(function (logo) {
      var replacement;

      if (logo.tagName.toLowerCase() !== "a") {
        return;
      }

      replacement = document.createElement("span");
      replacement.className = logo.className;
      replacement.setAttribute("aria-hidden", "true");
      replacement.innerHTML = logo.innerHTML;
      logo.replaceWith(replacement);
    });

    document.querySelectorAll(".footer_card .social_link_wrap > a[href='#']").forEach(function (link) {
      var replacement = document.createElement("div");

      replacement.className = link.className;
      replacement.setAttribute("aria-hidden", "true");

      while (link.firstChild) {
        replacement.appendChild(link.firstChild);
      }

      link.replaceWith(replacement);
    });

    document.querySelectorAll(".footer_card .ig-logo, .footer_card .be-logo").forEach(function (icon) {
      var replacement;

      if (icon.tagName.toLowerCase() !== "a") {
        return;
      }

      replacement = document.createElement("span");
      replacement.className = icon.className;
      replacement.setAttribute("aria-hidden", "true");
      replacement.innerHTML = icon.innerHTML;
      icon.replaceWith(replacement);
    });
  }

  function improveFormAccessibility() {
    document.querySelectorAll(".newsletter_form input[type='email']").forEach(function (input) {
      input.setAttribute("autocomplete", "email");
      input.setAttribute("inputmode", "email");

      if (!input.hasAttribute("aria-label")) {
        input.setAttribute("aria-label", "E-mailová adresa");
      }
    });

    document.querySelectorAll(".w-form-done > div").forEach(function (message) {
      if (message.textContent.trim() === "Thank you! Your submission has been received!") {
        message.textContent = "Ďakujeme. Vaša správa bola úspešne odoslaná.";
      }
    });

    document.querySelectorAll(".w-form-fail > div").forEach(function (message) {
      if (message.textContent.trim() === "Oops! Something went wrong while submitting the form.") {
        message.textContent = "Odoslanie sa nepodarilo. Skúste to prosím znova.";
      }
    });

    document.querySelectorAll("#name").forEach(function (input) {
      input.setAttribute("autocomplete", "name");
    });

    document.querySelectorAll("#email").forEach(function (input) {
      input.setAttribute("autocomplete", "email");
      input.setAttribute("inputmode", "email");
    });

    document.querySelectorAll("textarea[name='field']").forEach(function (textarea) {
      if (!textarea.hasAttribute("aria-label")) {
        textarea.setAttribute("aria-label", "Správa");
      }
    });
  }

  function initializeFormEnhancements() {
    // Form submission is handled in js/form-handler.js.
  }

  function getFormUi(form) {
    var wrapper = form.closest(".w-form");

    return {
      form: form,
      wrapper: wrapper,
      success: wrapper ? wrapper.querySelector(".w-form-done") : null,
      error: wrapper ? wrapper.querySelector(".w-form-fail") : null,
      submitButton: form.querySelector("input[type='submit'], button[type='submit']")
    };
  }

  function setSubmitButtonState(ui, isSubmitting) {
    var button = ui.submitButton;
    var waitLabel;
    var currentLabel;

    if (!button) {
      return;
    }

    button.disabled = isSubmitting;
    button.setAttribute("aria-disabled", String(isSubmitting));

    if (isSubmitting) {
      currentLabel = button.tagName.toLowerCase() === "input" ? button.value : button.textContent;
      button.dataset.submitLabel = currentLabel;
    }

    waitLabel = isSubmitting
      ? (button.getAttribute("data-wait") || button.dataset.submitLabel || "")
      : (button.dataset.submitLabel || (button.tagName.toLowerCase() === "input" ? button.value : button.textContent));

    if (button.tagName.toLowerCase() === "input") {
      button.value = waitLabel;
      return;
    }

    button.textContent = waitLabel;
  }

  function hideFormError(ui) {
    if (ui.error) {
      ui.error.style.display = "none";
    }
  }

  function showFormError(ui) {
    ui.form.style.display = "";

    if (ui.success) {
      ui.success.style.display = "none";
    }

    if (ui.error) {
      ui.error.style.display = "block";
    }
  }

  function showFormSuccess(ui) {
    setSubmitButtonState(ui, false);
    ui.form.dataset.isSubmitting = "false";
    ui.form.style.display = "none";

    if (ui.error) {
      ui.error.style.display = "none";
    }

    if (ui.success) {
      ui.success.style.display = "block";
    }
  }

  function addCardAriaLabels() {
    document.querySelectorAll(".project").forEach(function (project) {
      var title = project.querySelector(".project_card_title .h4");
      var ctaLink = project.querySelector(".project_catd_cta_wrap a.primary_button");

      if (!title || !ctaLink) {
        return;
      }

      ctaLink.setAttribute("aria-label", "Viac o projekte " + title.textContent.trim());
    });

    document.querySelectorAll(".projects_wrapper > .primary_button.primary-white").forEach(function (link) {
      link.setAttribute("aria-label", "Zobraziť všetky projekty");
    });

    document.querySelectorAll(".secondary_button_white").forEach(function (link) {
      link.setAttribute("aria-label", "Späť na stránku projektov");
    });

    document.querySelectorAll(".secondary_button-2.secondary_dark").forEach(function (link) {
      link.setAttribute("aria-label", "Späť na prehľad blogových článkov");
    });
  }

  function normalizeFooterBrandBlocks() {
    document.querySelectorAll(".footer_card").forEach(function (footerCard) {
      var brandBlock = getDirectChildByClass(footerCard, "div-block-5");
      var footerLinks;
      var logoEmbed;
      var socialSource;
      var socialEmbeds;
      var logoContainer;
      var socialWrap;

      if (!brandBlock) {
        return;
      }

      footerLinks = getDirectChildByClass(brandBlock, "footer_link_wrap");

      if (footerLinks) {
        footerCard.appendChild(footerLinks);
      }

      logoEmbed = brandBlock.querySelector(".logo_text_with_hover.w-embed .yabi-logo");
      logoEmbed = logoEmbed ? logoEmbed.closest(".logo_text_with_hover.w-embed") : null;
      socialSource = brandBlock.querySelector(".social_link_wrap");

      if (!logoEmbed || !socialSource) {
        return;
      }

      socialEmbeds = Array.prototype.slice.call(
        socialSource.querySelectorAll(".logo_text_with_hover.w-embed")
      );

      logoContainer = document.createElement("div");
      var logoLink = document.createElement("a");
      logoLink.className = "w-inline-block";
      logoLink.setAttribute("href", homepageHref);
      logoLink.setAttribute("aria-label", "YABI Studio homepage");
      logoLink.appendChild(logoEmbed);
      logoContainer.appendChild(logoLink);

      socialWrap = document.createElement("div");
      socialWrap.className = "social_link_wrap";
      socialEmbeds.forEach(function (embed, index) {
        var socialLinkData = footerSocialLinks[index];
        var socialLink;

        if (!socialLinkData) {
          socialWrap.appendChild(embed);
          return;
        }

        socialLink = document.createElement("a");
        socialLink.className = "w-inline-block";
        socialLink.setAttribute("href", socialLinkData.href);
        socialLink.setAttribute("target", "_blank");
        socialLink.setAttribute("rel", "noopener noreferrer");
        socialLink.setAttribute("aria-label", socialLinkData.label);
        socialLink.appendChild(embed);
        socialWrap.appendChild(socialLink);
      });

      brandBlock.innerHTML = "";
      brandBlock.appendChild(logoContainer);
      brandBlock.appendChild(socialWrap);
    });
  }

  function repairArticleSidebars() {
    document.querySelectorAll(".featured_articles_wrap-2 .collection-item-5.w-dyn-item").forEach(function (item) {
      var link = item.querySelector(".link-block-4.w-inline-block");

      if (!link) {
        item.remove();
        return;
      }

      var href = link.getAttribute("href") || "";
      var slugMatch = href.match(/\/articles\/([^/.]+)\.html$/);
      var slug = slugMatch ? slugMatch[1] : "";
      var thumbnail = articleSidebarThumbnails[slug];
      var cardWrap = link.querySelector(".block_post_card_wrap");
      var title = link.querySelector(".h4");

      if (!thumbnail || !cardWrap) {
        return;
      }

      var image = cardWrap.querySelector(".article_image");

      if (!image) {
        image = document.createElement("img");
      }

      image.setAttribute("width", "Auto");
      image.setAttribute("height", "Auto");
      image.setAttribute("loading", "lazy");
      image.setAttribute("src", thumbnail);
      image.setAttribute("alt", title ? title.textContent.trim() : "Nahlad k clanku");
      image.className = "article_image";

      if (cardWrap.firstElementChild !== image) {
        cardWrap.insertBefore(image, cardWrap.firstChild);
      }
    });
  }

  function normalizeArticlePages() {
    if (document.documentElement.getAttribute("data-wf-collection") !== "69ba91bd06ecfcb282e9a151") {
      return;
    }

    var slug = document.documentElement.getAttribute("data-wf-item-slug");
    var metadata = articlePageMetadata[slug];
    var chipWrap = document.querySelector(".container.article .blog_chip_wrap");

    if (!metadata || !metadata.chips || !metadata.chips.length || !chipWrap) {
      return;
    }

    chipWrap.innerHTML = "";
    metadata.chips.forEach(function (chipLabel) {
      chipWrap.appendChild(createArticleChip(chipLabel));
    });
  }

  function createArticleChip(label) {
    var chip = document.createElement("div");
    var shape = document.createElement("div");
    var text = document.createElement("div");

    chip.className = "descriptive-chips white-chips";
    shape.className = "chips-shape white-chips-shape";
    text.className = "medium-uppercase-xs";
    text.textContent = label;

    chip.appendChild(shape);
    chip.appendChild(text);

    return chip;
  }

  function normalizeFeaturedProjectLinks() {
    if (document.documentElement.getAttribute("data-wf-collection") !== "69b51dacfba8d4e617046c0a") {
      return;
    }

    document.querySelectorAll(".projects_wrapper").forEach(function (wrapper) {
      var allProjectsLink = wrapper.querySelector(":scope > .primary_button.primary-white");

      if (allProjectsLink) {
        allProjectsLink.setAttribute("href", "/projekty.html");
      }

      wrapper.querySelectorAll(".project").forEach(function (project) {
        var title = project.querySelector(".project_card_title .h4");
        var ctaLink = project.querySelector(".project_catd_cta_wrap a.primary_button");
        var targetHref;

        if (!title || !ctaLink) {
          return;
        }

        targetHref = featuredProjectLinks[title.textContent.trim()];

        if (!targetHref) {
          return;
        }

        ctaLink.setAttribute("href", targetHref);
      });
    });
  }

  function enhanceHeroHeadings() {
    document.querySelectorAll(".hero_title h1, .hero_title-2 h1").forEach(function (heading) {
      var isRebuildingFromPlainText = heading.classList.contains("hero-heading-stagger") && !heading.querySelector(".hero-heading-word");
      var headingText;
      var words;
      var wordNodes = [];
      var fragment;

      if (heading.classList.contains("hero-heading-stagger") && heading.querySelector(".hero-heading-word")) {
        applyHeroHeadingTiming(heading);
        return;
      }

      if (isRebuildingFromPlainText) {
        heading.classList.remove("hero-heading-stagger");
      }

      headingText = heading.textContent.replace(/\s+/g, " ").trim();

      if (headingText) {
        heading.setAttribute("data-hero-heading-original", headingText);
      }

      words = headingText ? headingText.split(" ") : [];

      if (!words.length) {
        return;
      }

      heading.textContent = "";
      fragment = document.createDocumentFragment();

      words.forEach(function (word, index) {
        var wordSpan = document.createElement("span");

        if (index > 0) {
          fragment.appendChild(createHeroHeadingSeparator());
        }

        wordSpan.className = "hero-heading-word";
        wordSpan.textContent = word;
        fragment.appendChild(wordSpan);
        wordNodes.push(wordSpan);
      });

      heading.appendChild(fragment);
      wrapHeroHeadingWordsByLine(heading, wordNodes);
      heading.classList.add("hero-heading-stagger");
      applyHeroHeadingTiming(heading);
    });
  }

  function wrapHeroHeadingWordsByLine(heading, wordNodes) {
    var lines = [];
    var currentLine = [];
    var previousTop;
    var fragment = document.createDocumentFragment();

    wordNodes.forEach(function (wordNode) {
      var currentTop = Math.round(wordNode.getBoundingClientRect().top);

      if (typeof previousTop === "number" && Math.abs(currentTop - previousTop) > 1) {
        lines.push(currentLine);
        currentLine = [];
      }

      currentLine.push(wordNode);
      previousTop = currentTop;
    });

    if (currentLine.length) {
      lines.push(currentLine);
    }

    heading.textContent = "";

    lines.forEach(function (lineWords) {
      var line = document.createElement("span");

      line.className = "hero-heading-line";
      lineWords.forEach(function (wordNode, index) {
        if (index > 0) {
          line.appendChild(createHeroHeadingSeparator());
        }

        line.appendChild(wordNode);
      });

      fragment.appendChild(line);
    });

    heading.appendChild(fragment);
  }

  function applyHeroHeadingTiming(heading) {
    heading.querySelectorAll(".hero-heading-word").forEach(function (word, index) {
      word.style.setProperty("--hero-word-delay", index * heroHeadingDelayStep + "ms");
    });
  }

  window.YabiHeroHeadings = {
    refresh: enhanceHeroHeadings
  };
})();
