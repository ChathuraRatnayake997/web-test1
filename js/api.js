function stripJSONComments(text) {
  let result = '';
  let i = 0;
  while (i < text.length) {
    if (text[i] === '\uD83D' && text[i + 1] === '\uDCCC') {
      i += 2;
      while (i < text.length && text[i] !== '\n') i++;
    } else if (text[i] === '/' && text[i + 1] === '/') {
      while (i < text.length && text[i] !== '\n') i++;
    } else if (text[i] === '/' && text[i + 1] === '*') {
      i += 2;
      while (i < text.length && !(text[i] === '*' && text[i + 1] === '/')) i++;
      i += 2;
    } else if (text[i] === '"') {
      const start = i++;
      while (i < text.length && text[i] !== '"') { if (text[i] === '\\') i++; i++; }
      result += text.slice(start, i + 1);
      i++;
    } else {
      result += text[i++];
    }
  }
  return result;
}

export async function fetchJSON(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    return JSON.parse(stripJSONComments(text));
  } catch (err) {
    console.warn(`Failed to load ${url}:`, err);
    return null;
  }
}

export function initNav() {
  const sectionEls = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('#navLinks a');
  let offsets = [];

  function cacheOffsets() {
    offsets = Array.from(sectionEls).map(s => ({
      id: s.getAttribute('id'),
      top: s.offsetTop - 200,
      bottom: s.offsetTop + s.offsetHeight - 200,
    }));
  }

  function updateActive() {
    const scrollY = window.pageYOffset;
    let current = '';
    for (const o of offsets) {
      if (scrollY >= o.top && scrollY < o.bottom) { current = o.id; break; }
    }
    navLinks.forEach(link => {
      link.classList.remove('text-primary', 'font-bold');
      link.classList.add('text-on-surface-variant');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.remove('text-on-surface-variant');
        link.classList.add('text-primary', 'font-bold');
      }
    });
  }

  cacheOffsets();
  window.addEventListener('scroll', updateActive, { passive: true });
  window.addEventListener('resize', cacheOffsets);
  updateActive();
}

export function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  const icon = btn?.querySelector('.material-symbols-outlined');

  if (!btn || !menu) return;

  function close() {
    menu.classList.remove('open');
    if (icon) icon.textContent = 'menu';
    document.body.classList.remove('overflow-hidden');
  }

  btn.addEventListener('click', () => {
    const isOpen = menu.classList.contains('open');
    menu.classList.toggle('open');
    if (icon) icon.textContent = isOpen ? 'menu' : 'close';
    document.body.classList.toggle('overflow-hidden', !isOpen);
  });

  document.getElementById('mobile-menu-close')?.addEventListener('click', close);
  menu.querySelectorAll('[data-mobile-close]').forEach(el => {
    el.addEventListener('click', close);
  });
}

export function initDownloadBtns(cv) {
  if (!cv) return;
  const path = cv.path;
  const viewer = cv.viewer || 'cv.html';
  const externalUrl = cv.external_url;
  const mode = cv.mode || 'view';
  const labels = cv.labels || { view: 'CV', download: 'CV', external: 'CV' };
  const label = labels[mode] || 'CV';

  const btns = [document.getElementById('cvBtn'), document.getElementById('cvBtnMobile')].filter(Boolean);
  btns.forEach(btn => {
    btn.textContent = label;

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (mode === 'view') {
        window.location.href = viewer + '?url=' + encodeURIComponent(path);
      } else if (mode === 'download') {
        if (!path || path === '#') return;
        const rawUrl = path.includes('github.com') && path.includes('/blob/')
          ? path.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/')
          : path;
        btn.textContent = 'Downloading...';
        btn.disabled = true;
        fetch(rawUrl)
          .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.blob(); })
          .then(blob => {
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = label.replace(/\s+/g, '_').toLowerCase() + '.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(a.href);
            btn.textContent = label;
            btn.disabled = false;
          })
          .catch(() => {
            window.open(rawUrl, '_blank');
            btn.textContent = label;
            btn.disabled = false;
          });
      } else if (mode === 'external') {
        if (externalUrl && externalUrl !== '#') {
          window.open(externalUrl, '_blank');
        }
      }
    });
  });
}

export function initFormFocus() {
  document.querySelectorAll('input, textarea, select').forEach(input => {
    input.addEventListener('focus', () => {
      const label = input.closest('.form-group')?.querySelector('label');
      if (label) label.classList.replace('text-secondary', 'text-primary');
    });
    input.addEventListener('blur', () => {
      const label = input.closest('.form-group')?.querySelector('label');
      if (label) label.classList.replace('text-primary', 'text-secondary');
    });
  });
}
