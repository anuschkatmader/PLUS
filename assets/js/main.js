/* ============================================================
   PLUS Demo Site — main.js
   Shared behaviour: sticky header, nav dropdown, newsletter form.
   DEMO ENVIRONMENT — NOT AFFILIATED WITH PLUS RETAIL.
   ============================================================ */
(function () {
  "use strict";

  /* Sticky header shadow on scroll */
  var header = document.getElementById("site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-stuck", window.scrollY > 4);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* Products dropdown */
  var toggle = document.getElementById("products-toggle");
  var menu = document.getElementById("products-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    document.addEventListener("click", function (e) {
      if (!menu.contains(e.target) && e.target !== toggle) {
        menu.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        menu.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* Newsletter form (decorative — no backend) */
  var nlForm = document.getElementById("newsletter-form");
  if (nlForm) {
    nlForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var note = document.getElementById("nl-note");
      var email = document.getElementById("nl-email");
      if (note) {
        note.textContent = email && email.value
          ? "Thanks! Check your inbox to confirm your subscription."
          : "Please enter your email address.";
      }
    });
  }
})();
