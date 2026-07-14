/* DEMO third-party advertising tag (simulated).
   Exists purely to demonstrate CMP script re-categorisation and
   auto-blocking. Once the CMP is installed, change the script tag in
   index.html to type="text/plain" with the advertising/targeting
   category class so it only executes with consent. */
(function () {
  console.info("[demo-ads] Advertising tag executed — audience pixel fired (simulated).");
  window.__demoAdsLoaded = true;
})();
