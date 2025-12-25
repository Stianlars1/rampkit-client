// Inline script to prevent hydration flash for color history
// Runs before React hydrates to set initial color from localStorage or URL
export const colorHistoryScript = `
(function() {
  try {
    var d = document.documentElement.dataset;

    // First check URL params (highest priority for shared links)
    var params = new URLSearchParams(window.location.search);
    var urlHex = params.get('hex');
    if (urlHex) {
      d.initialHex = '#' + urlHex.replace('#', '').toUpperCase();
      d.initialScheme = params.get('scheme') || 'analogous';
      d.initialHarmonized = params.has('harmonized') ? '1' : '0';
      d.initialPure = params.has('pure') ? '1' : '0';
      // URL uses 1-indexed for humans, convert to 0-indexed
      var colorParam = params.get('color');
      d.initialColorIndex = colorParam ? String(parseInt(colorParam, 10) - 1) : '0';
      d.hasInitialParams = '1';
      return;
    }

    // Then check localStorage history (restore last used color)
    var stored = localStorage.getItem('rampkit_color_history');
    if (stored) {
      var history = JSON.parse(stored);
      if (history && history[0]) {
        var item = history[0];
        d.initialHex = item.inputHex;
        d.initialScheme = item.scheme || 'analogous';
        d.initialHarmonized = item.harmonized ? '1' : '0';
        d.initialPure = item.pureColorTheory ? '1' : '0';
        d.initialColorIndex = String(item.harmonyColorIndex || 0);
        d.hasInitialParams = '1';
      }
    }
  } catch (e) {}
})();`;
