export function setTheme(theme) {
  const isDark = theme === 'dark';
  document.documentElement.classList.toggle('dark', isDark);
  document.querySelectorAll('.theme-toggle').forEach(el => {
    el.textContent = isDark ? 'light_mode' : 'dark_mode';
  });
  localStorage.setItem('theme', theme);
}

export function getPreferredTheme() {
  const stored = localStorage.getItem('theme');
  if (stored) return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function formatText(t) {
  if (!t) return '';
  return t
    .replace(/`([^`]+)`/g, '<code class="text-primary font-mono text-sm">$1</code>')
    .replace(/\*\*(.+?) \* (.+?)\*\*/g, '<a href="$2" target="_blank" class="underline hover:text-primary transition-colors">$1</a>');
}
