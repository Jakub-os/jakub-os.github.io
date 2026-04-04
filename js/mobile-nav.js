document.addEventListener("DOMContentLoaded", function () {
  var homepageHref = "/index.html";
  var mobileBreakpoint = window.matchMedia("(max-width: 991px)");
  var root = document.documentElement;
  var body = document.body;
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

  normalizeInlineSvgIds();
  disableInactiveLanguageSwitchers();
  normalizeEmbeddedBrandLinks();
  improveFormAccessibility();
  initializeFormEnhancements();
  addCardAriaLabels();

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
      logoContainer.appendChild(logoEmbed);

      socialWrap = document.createElement("div");
      socialWrap.className = "social_link_wrap";
      socialEmbeds.forEach(function (embed) {
        socialWrap.appendChild(embed);
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
});
