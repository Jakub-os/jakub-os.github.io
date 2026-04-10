document.addEventListener("DOMContentLoaded", function () {
  var faqItems = Array.from(document.querySelectorAll(".faq-item"));

  if (!faqItems.length) {
    return;
  }

  function setExpanded(item, trigger, answer, isExpanded) {
    if (!trigger || !answer) {
      return;
    }

    item.classList.toggle("is-open", isExpanded);
    trigger.setAttribute("aria-expanded", String(isExpanded));
    answer.setAttribute("aria-hidden", String(!isExpanded));
    answer.style.maxHeight = isExpanded ? answer.scrollHeight + 8 + "px" : "0px";
  }

  function refreshOpenItems() {
    faqItems.forEach(function (item) {
      var trigger = item.querySelector(".faq-question");
      var answer = item.querySelector(".faq-answer");

      if (!trigger || !answer || !item.classList.contains("is-open")) {
        return;
      }

      answer.style.maxHeight = answer.scrollHeight + 8 + "px";
    });
  }

  faqItems.forEach(function (item, index) {
    var trigger = item.querySelector(".faq-question");
    var answer = item.querySelector(".faq-answer");
    var triggerId;
    var answerId;

    if (!trigger || !answer) {
      return;
    }

    triggerId = trigger.id || "faq-question-" + (index + 1);
    answerId = answer.id || "faq-answer-" + (index + 1);

    trigger.id = triggerId;
    answer.id = answerId;
    item.removeAttribute("role");
    item.removeAttribute("tabindex");
    item.removeAttribute("aria-controls");
    item.removeAttribute("aria-expanded");
    trigger.setAttribute("role", "button");
    trigger.setAttribute("tabindex", "0");
    trigger.setAttribute("aria-controls", answerId);
    trigger.setAttribute("aria-expanded", "false");
    answer.setAttribute("role", "region");
    answer.setAttribute("aria-labelledby", triggerId);
    answer.setAttribute("aria-hidden", "true");
    answer.style.maxHeight = "0px";
    item.classList.remove("is-open");

    function toggleItem() {
      setExpanded(item, trigger, answer, !item.classList.contains("is-open"));
    }

    item.addEventListener("click", function (event) {
      if (event.target.closest("a, button, input, select, textarea")) {
        return;
      }

      toggleItem();
    });

    trigger.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleItem();
      }
    });
  });

  window.addEventListener("resize", refreshOpenItems);
});
