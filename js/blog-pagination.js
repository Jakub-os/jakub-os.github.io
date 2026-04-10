document.addEventListener("DOMContentLoaded", function () {
  var STORAGE_KEY = "yabi-language";
  var DEFAULT_LANGUAGE = "sk";
  var PAGE_SIZE = 6;
  var BASE_PATH = "/blogs/blog-list.html";
  var featuredWrapper = document.querySelector(".collection-list-wrapper-3");
  var featuredList = featuredWrapper ? featuredWrapper.querySelector(".collection-list-5.w-dyn-items") : null;
  var featuredSection = featuredWrapper ? featuredWrapper.closest(".section") : null;
  var articleList = document.querySelector(".collection-list-4.w-dyn-items");
  var pagination = document.querySelector(".w-pagination-wrapper.pagination-2");

  if (!articleList || !pagination) {
    return;
  }

  function getLanguage() {
    if (window.YabiLocalization && typeof window.YabiLocalization.getLanguage === "function") {
      return window.YabiLocalization.getLanguage();
    }

    try {
      return window.localStorage.getItem(STORAGE_KEY) === "en" ? "en" : DEFAULT_LANGUAGE;
    } catch (error) {
      return DEFAULT_LANGUAGE;
    }
  }

  function getDictionary(language) {
    if (!window.YabiTranslations) {
      return {};
    }

    return window.YabiTranslations[language] || window.YabiTranslations[DEFAULT_LANGUAGE] || {};
  }

  function getBlog(language) {
    return getDictionary(language).blog || { pagination: {}, featured: null, articles: [] };
  }

  function getAltTemplate(language, key, fallback) {
    var common = getDictionary(language).common || {};
    var alts = common.alts || {};
    return alts[key] || fallback || "";
  }

  function formatString(template, replacements) {
    var result = template || "";

    Object.keys(replacements || {}).forEach(function (key) {
      result = result.replace(new RegExp("\\{" + key + "\\}", "g"), replacements[key]);
    });

    return result;
  }

  function getPageUrl(page) {
    return page === 1 ? BASE_PATH : BASE_PATH + "?page=" + page;
  }

  function getRequestedPage() {
    var params = new URLSearchParams(window.location.search);
    var requestedPage = parseInt(params.get("page") || "1", 10);
    return Number.isFinite(requestedPage) ? requestedPage : 1;
  }

  function normalizePage(page, totalPages) {
    if (page < 1) {
      return 1;
    }

    if (page > totalPages) {
      return totalPages;
    }

    return page;
  }

  function syncUrl(page, requestedPage) {
    var hasPageParam = new URLSearchParams(window.location.search).has("page");

    if (requestedPage !== page || (page === 1 && hasPageParam)) {
      window.history.replaceState(null, "", getPageUrl(page));
    }
  }

  function formatDate(dateString, language) {
    var locale = language === "en" ? "en-US" : "sk-SK";

    return new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(new Date(dateString));
  }

  function renderChips(chips, isFeatured) {
    return (chips || []).map(function (chip) {
      return (
        '<div class="descriptive-chips ' + (isFeatured ? "white-chips" : "primary-chips") + '">' +
          '<div class="chips-shape ' + (isFeatured ? "white-chips-shape" : "primary-chips-shape") + '"></div>' +
          '<div class="medium-uppercase-xs">' + chip + "</div>" +
        "</div>"
      );
    }).join("");
  }

  function renderFeatured(language, featuredArticle, shouldShow) {
    var coverAlt = getAltTemplate(language, "blogCover", "Cover image for the article {title}");

    if (!featuredSection || !featuredList) {
      return;
    }

    featuredSection.style.display = shouldShow && featuredArticle ? "" : "none";

    if (!shouldShow || !featuredArticle) {
      featuredList.innerHTML = "";
      return;
    }

    featuredList.innerHTML =
      '<div role="listitem" class="collection-item-4 w-dyn-item">' +
        '<a href="' + featuredArticle.href + '" class="link-block-2 w-inline-block">' +
          '<article class="w-layout-blockcontainer container featured_article w-container">' +
            '<div class="blogpost_featured">' +
              '<p class="date_label">' + formatDate(featuredArticle.date, language) + "</p>" +
              '<h3 class="h3">' + featuredArticle.title + "</h3>" +
              '<p class="article_description">' + featuredArticle.description + "</p>" +
              '<div class="blog_chip_wrap">' + renderChips(featuredArticle.chips, true) + "</div>" +
            "</div>" +
            '<img src="' + featuredArticle.image + '" loading="lazy" width="Auto" height="Auto" alt="' + formatString(coverAlt, { title: featuredArticle.title }) + '" class="featured_article_image">' +
          "</article>" +
        "</a>" +
      "</div>";
  }

  function renderArticleCard(language, article) {
    var thumbnailAlt = getAltTemplate(language, "blogThumbnail", "Thumbnail for the article {title}");

    return (
      '<div role="listitem" class="collection-item-3 w-dyn-item">' +
        '<a data-w-id="92dd7730-b74d-3808-ffaa-a880afa9c62d" href="' + article.href + '" class="link-block-3 w-inline-block">' +
          '<div data-w-id="77189aa3-7b7b-f433-ebd0-982fbe3b04a4" style="-webkit-transform:translate3d(0, 0, 0) scale3d(null, null, null) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0);-moz-transform:translate3d(0, 0, 0) scale3d(null, null, null) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0);-ms-transform:translate3d(0, 0, 0) scale3d(null, null, null) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0);transform:translate3d(0, 0, 0) scale3d(null, null, null) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0);transform-style:preserve-3d" class="block_post_card_wrap">' +
            '<img width="Auto" height="Auto" alt="' + formatString(thumbnailAlt, { title: article.title }) + '" loading="lazy" src="' + article.image + '" class="article_image">' +
            '<div class="blogpost_card">' +
              '<p class="date_label dark">' + formatDate(article.date, language) + "</p>" +
              '<h4 class="h4">' + article.title + "</h4>" +
              '<p class="article_description dark">' + article.description + "</p>" +
              '<div class="blog_chip_wrap">' + renderChips(article.chips, false) + "</div>" +
            "</div>" +
          "</div>" +
        "</a>" +
      "</div>"
    );
  }

  function renderArticles(language, page, articles) {
    var startIndex = (page - 1) * PAGE_SIZE;
    var pageArticles = articles.slice(startIndex, startIndex + PAGE_SIZE);

    articleList.innerHTML = pageArticles.map(function (article) {
      return renderArticleCard(language, article);
    }).join("");
  }

  function renderPagination(language, page, totalPages, labels) {
    var parts = [];

    pagination.setAttribute("aria-label", labels.ariaLabel || "Blog pagination");

    if (page > 1) {
      parts.push(
        '<a href="' + getPageUrl(page - 1) + '" aria-label="' + (labels.previousAria || "Previous blog page") + '" class="w-pagination-previous previous">' +
          '<svg class="w-pagination-previous-icon" height="12px" width="12px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" transform="translate(0, 1)">' +
            '<path fill="none" stroke="currentColor" fill-rule="evenodd" d="M8 2L4 6l4 4"></path>' +
          "</svg>" +
          '<div class="link w-inline-block">' + (labels.previous || "Back") + "</div>" +
        "</a>"
      );
    }

    if (page < totalPages) {
      parts.push(
        '<a href="' + getPageUrl(page + 1) + '" aria-label="' + (labels.nextAria || "Next blog page") + '" class="w-pagination-next next">' +
          '<div class="link w-inline-block">' + (labels.next || "Next") + "</div>" +
          '<svg class="w-pagination-next-icon" height="12px" width="12px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" transform="translate(0, 1)">' +
            '<path fill="none" stroke="currentColor" fill-rule="evenodd" d="M4 2l4 4-4 4"></path>' +
          "</svg>" +
        "</a>"
      );
    }

    pagination.innerHTML = parts.join("");
  }

  function renderPage(options) {
    var language = getLanguage();
    var blog = getBlog(language);
    var articles = blog.articles || [];
    var totalPages = Math.max(1, Math.ceil(articles.length / PAGE_SIZE));
    var requestedPage = getRequestedPage();
    var currentPage = normalizePage(requestedPage, totalPages);

    if (!options || options.syncUrl !== false) {
      syncUrl(currentPage, requestedPage);
    }

    renderFeatured(language, blog.featured, currentPage === 1);
    renderArticles(language, currentPage, articles);
    renderPagination(language, currentPage, totalPages, blog.pagination || {});
  }

  renderPage();

  window.addEventListener("popstate", function () {
    renderPage({ syncUrl: false });
  });

  document.addEventListener("yabi:languagechange", function () {
    renderPage({ syncUrl: false });
  });
});
