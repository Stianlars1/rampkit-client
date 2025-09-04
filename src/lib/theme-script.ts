// /src/lib/theme-script.ts
export const themeScript = `
(function() {
  function getSystemTheme() {
    if (typeof window === 'undefined') return 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  
  function resolveTheme(themeMode) {
    if (!themeMode || themeMode === 'system') {
      return getSystemTheme();
    }
    return themeMode;
  }
  
  function applyTheme(resolvedTheme) {
    const root = document.documentElement;
    const body = document.body;
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark');
    if (body) body.classList.remove('light', 'dark');
    
    // Add new theme classes
    root.classList.add(resolvedTheme);
    if (body) body.classList.add(resolvedTheme);
    
    // Set data attribute
    root.setAttribute('data-theme', resolvedTheme);
  }
  
  try {
    const savedTheme = localStorage.getItem('theme');
    const resolvedTheme = resolveTheme(savedTheme);
    applyTheme(resolvedTheme);
  } catch (e) {
    // Fallback to dark if localStorage fails
    applyTheme('dark');
  }
})();`;
