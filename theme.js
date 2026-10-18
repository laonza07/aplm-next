// Resolve the saved appearance before CSS paints; storage may be unavailable.
(() => {
  const root = document.documentElement;
  const system = window.matchMedia('(prefers-color-scheme: dark)');
  let preference = null;
  try {
    const stored = localStorage.getItem('aplm-next-theme');
    if (stored === 'light' || stored === 'dark') preference = stored;
  } catch { /* Appearance still works when storage is blocked. */ }
  function apply(theme) {
    root.dataset.theme = theme;
    const button = document.querySelector('.theme-toggle');
    if (button) {
      const dark = theme === 'dark';
      button.setAttribute('aria-pressed', String(dark));
      button.setAttribute('aria-label', dark ? 'เปิดโหมดสว่าง' : 'เปิดโหมดมืด');
      button.querySelector('.theme-label').textContent = dark ? 'มืด' : 'สว่าง';
    }
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0a172a' : '#ffffff');
  }
  apply(preference || (system.matches ? 'dark' : 'light'));
  document.addEventListener('DOMContentLoaded', () => {
    apply(root.dataset.theme);
    document.querySelector('.theme-toggle')?.addEventListener('click', () => {
      preference = root.dataset.theme === 'dark' ? 'light' : 'dark';
      apply(preference);
      try { localStorage.setItem('aplm-next-theme', preference); } catch { /* Session-only choice. */ }
    });
  });
  system.addEventListener('change', event => { if (!preference) apply(event.matches ? 'dark' : 'light'); });
  addEventListener('storage', event => {
    if (event.key !== 'aplm-next-theme' && event.key !== null) return;
    preference = event.newValue === 'light' || event.newValue === 'dark' ? event.newValue : null;
    apply(preference || (system.matches ? 'dark' : 'light'));
  });
})();
