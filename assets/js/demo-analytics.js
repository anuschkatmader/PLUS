/* DEMO third-party analytics tag (simulated).
   Exists purely to demonstrate CMP script re-categorisation and
   auto-blocking. Once the CMP is installed, change the script tag in
   index.html to type="text/plain" with the analytics category class so
   it only executes with consent. */
(function () {
  console.info("[demo-analytics] Analytics tag executed — page view tracked (simulated).");
  window.__demoAnalyticsLoaded = true;
})();
