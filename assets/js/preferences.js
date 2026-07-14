/* ============================================================
   PLUS Demo Site — preferences.js
   Account tab switching + Preference Center (UCPM demo).

   INTEGRATION NOTE:
   Every control carries a data-purpose-id attribute. In a live
   integration, replace the localStorage persistence below with
   consent platform API calls (one consent transaction per save,
   mapping data-purpose-id -> collection point / purpose IDs).
   The consent-history table then renders real receipts instead
   of the seeded demo entries.

   DEMO ENVIRONMENT — NOT AFFILIATED WITH PLUS RETAIL.
   ============================================================ */
(function () {
  "use strict";

  var STORAGE_KEY = "plus-demo-preferences";
  var HISTORY_KEY = "plus-demo-consent-history";

  /* ---------- Tab switching (no page reloads) ---------- */
  var navButtons = document.querySelectorAll(".account-nav button[data-panel]");
  var panels = document.querySelectorAll(".account-panel");

  function showPanel(name) {
    panels.forEach(function (p) {
      p.classList.toggle("active", p.id === "panel-" + name);
    });
    navButtons.forEach(function (b) {
      b.setAttribute("aria-current", String(b.dataset.panel === name));
    });
  }

  navButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      showPanel(btn.dataset.panel);
    });
  });

  /* Quick links on the overview panel */
  document.querySelectorAll("[data-goto]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      showPanel(btn.dataset.goto);
    });
  });

  /* Deep link support: account.html#privacy opens that panel */
  if (location.hash) {
    var target = location.hash.replace("#", "");
    if (document.getElementById("panel-" + target)) showPanel(target);
  }

  /* ---------- Preference Center ---------- */
  var form = document.getElementById("preference-form");
  if (!form) return;

  var controls = form.querySelectorAll("[data-purpose-id]");

  var PURPOSE_LABELS = {
    "email-marketing": "Email marketing",
    "sms-marketing": "SMS marketing",
    "push-marketing": "Push notifications",
    "postal-marketing": "Postal mail",
    "personalised-offers": "Personalised offers",
    "ad-partner-sharing": "Ad partner data sharing",
    "analytics": "Analytics",
    "frequency": "Contact frequency"
  };

  /* Seeded demo entries to visualise auditability */
  var SEED_HISTORY = [
    { date: "2026-05-02", purpose: "Email marketing", decision: "Opted in", channel: "Website" },
    { date: "2026-03-18", purpose: "Personalised offers", decision: "Opted in", channel: "PLUS app" },
    { date: "2025-11-30", purpose: "SMS marketing", decision: "Opted out", channel: "Preference center" },
    { date: "2025-09-14", purpose: "Analytics", decision: "Opted in", channel: "Cookie banner" }
  ];

  function readJSON(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function writeJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      /* storage unavailable — demo continues in-memory */
    }
  }

  /* ---------- State <-> UI ---------- */
  function collectState() {
    var state = {};
    controls.forEach(function (el) {
      if (el.type === "radio") {
        if (el.checked) state[el.name] = el.value;
      } else {
        state[el.dataset.purposeId] = el.checked;
      }
    });
    return state;
  }

  function applyState(state) {
    controls.forEach(function (el) {
      if (el.type === "radio") {
        if (state[el.name] !== undefined) el.checked = el.value === state[el.name];
      } else if (state[el.dataset.purposeId] !== undefined) {
        el.checked = Boolean(state[el.dataset.purposeId]);
      }
    });
  }

  /* ---------- Consent history rendering ---------- */
  var historyBody = document.querySelector("#consent-history tbody");

  function renderHistory() {
    if (!historyBody) return;
    var entries = readJSON(HISTORY_KEY, SEED_HISTORY);
    historyBody.innerHTML = "";
    entries.slice(0, 8).forEach(function (e) {
      var tr = document.createElement("tr");
      [e.date, e.purpose, e.decision, e.channel].forEach(function (val) {
        var td = document.createElement("td");
        td.textContent = val;
        tr.appendChild(td);
      });
      historyBody.appendChild(tr);
    });
  }

  function logHistory(purpose, decision) {
    var entries = readJSON(HISTORY_KEY, SEED_HISTORY);
    entries.unshift({
      date: new Date().toISOString().slice(0, 10),
      purpose: purpose,
      decision: decision,
      channel: "Preference center"
    });
    writeJSON(HISTORY_KEY, entries.slice(0, 25));
  }

  /* ---------- Toast ---------- */
  var toast = document.getElementById("toast");
  var toastTimer;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove("show");
    }, 2600);
  }

  /* ---------- Save / Withdraw ---------- */
  var previousState = null;

  function diffAndLog(oldState, newState) {
    Object.keys(newState).forEach(function (key) {
      if (!oldState || oldState[key] !== newState[key]) {
        var label = PURPOSE_LABELS[key] || key;
        var decision;
        if (key === "frequency") {
          decision = "Set to: " + newState[key];
        } else {
          decision = newState[key] ? "Opted in" : "Opted out";
        }
        logHistory(label, decision);
      }
    });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var state = collectState();
    diffAndLog(previousState, state);
    writeJSON(STORAGE_KEY, state);
    previousState = state;
    renderHistory();
    showToast("Preferences saved ✓");
  });

  var withdrawBtn = document.getElementById("withdraw-all");
  if (withdrawBtn) {
    withdrawBtn.addEventListener("click", function () {
      controls.forEach(function (el) {
        if (el.type === "radio") {
          el.checked = el.value === "essential";
        } else {
          el.checked = false;
        }
      });
      var state = collectState();
      diffAndLog(previousState, state);
      writeJSON(STORAGE_KEY, state);
      previousState = state;
      renderHistory();
      showToast("All consent withdrawn");
    });
  }

  /* ---------- Init ---------- */
  var saved = readJSON(STORAGE_KEY, null);
  if (saved) {
    applyState(saved);
    previousState = saved;
  } else {
    previousState = collectState();
  }
  renderHistory();
})();
