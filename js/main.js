import { setTheme, getPreferredTheme } from './utils/helpers.js';
import { fetchJSON, initNav, initMobileMenu, initFormFocus, initDownloadBtns } from './api.js';
import { renderers } from './components/renderers.js';

setTheme(getPreferredTheme());

fetchJSON('data/site.json').then(siteData => {
  const files = siteData?.sections || [];
  return Promise.all(files.map(f => fetchJSON('data/' + f)))
    .then(sectionData => ({ ...siteData, sections: sectionData.filter(Boolean) }));
}).then(data => {

    if (data.google_analytics_id) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function(){dataLayer.push(arguments);};
      gtag('js', new Date());
      gtag('config', data.google_analytics_id);
      const s = document.createElement('script');
      s.async = true;
      s.src = 'https://www.googletagmanager.com/gtag/js?id=' + data.google_analytics_id;
      document.head.appendChild(s);
    }

    const brand = document.getElementById('brandName');
    if (brand && data.name) brand.textContent = data.name;

    const footerBrand = document.getElementById('footerBrand');
    if (footerBrand && data.name) footerBrand.textContent = data.name;

    if (data.title) document.title = data.title;

    const favicon = document.getElementById('favicon');
    if (favicon && data.favicon) favicon.href = data.favicon;

    const navContainer = document.getElementById('navLinks');
    const mobileContainer = document.getElementById('mobileNavLinks');
    const app = document.getElementById('app');

    let navIndex = 0;
    let renderIndex = 0;
    data.sections.forEach(s => {
      if (!s || s.enabled === false) return;

      if (s.navigation && s.navigation.show && navContainer && mobileContainer) {
        const a = document.createElement('a');
        a.href = '#' + s.id;
        a.className = 'text-on-surface-variant hover:text-primary transition-colors text-body-md font-body-md';
        a.textContent = s.navigation.label;
        navContainer.appendChild(a);

        const row = document.createElement('div');
        row.className = 'menu-row';
        row.style.setProperty('--row-hover-color',
          navIndex % 2 === 0 ? 'rgb(var(--color-primary))' : 'rgb(var(--color-secondary))');
        const ma = document.createElement('a');
        ma.href = '#' + s.id;
        ma.setAttribute('data-mobile-close', '');
        ma.textContent = s.navigation.label;
        row.appendChild(ma);
        mobileContainer.appendChild(row);
        navIndex++;
      }

      if (app) {
        const renderer = renderers[s.type];
        if (renderer) {
          const el = renderer(s);
          el.id = s.id;
          if (renderIndex % 2 === 1) el.classList.add('bg-surface-container-low');
          app.appendChild(el);
          renderIndex++;
        }
      }
    });

    if (data.footer) {
      const footerTagline = document.getElementById('footerTagline');
      if (footerTagline && data.footer.tagline) footerTagline.textContent = data.footer.tagline;

      const footerLinks = document.getElementById('footerLinks');
      if (footerLinks && data.footer.links) {
        data.footer.links.forEach(link => {
          const a = document.createElement('a');
          a.href = link.url;
          a.className = 'text-on-surface-variant hover:text-primary transition-colors text-label-caps font-label-caps';
          a.textContent = link.label;
          footerLinks.appendChild(a);
        });
      }

      document.querySelector('footer').style.visibility = 'visible';
    }

    initNav();
    initMobileMenu();
    initDownloadBtns(data.cv);

    document.querySelectorAll('.theme-toggle').forEach(el => {
      el.addEventListener('click', () => {
        const isDark = document.documentElement.classList.contains('dark');
        setTheme(isDark ? 'light' : 'dark');
      });
    });

    setTimeout(() => {
      initFormFocus();

      const contactSection = data.sections.find(s => s.type === 'contact');
      if (contactSection?.emailjs) {
        emailjs.init(contactSection.emailjs.public_key);
        document.getElementById('contactForm')?.addEventListener('submit', function(e) {
          e.preventDefault();
          const btn = this.querySelector('button[type="submit"]');
          const orig = btn.textContent;
          btn.textContent = 'Sending...';
          btn.disabled = true;
          emailjs.sendForm(contactSection.emailjs.service_id, contactSection.emailjs.template_id, this)
            .then(() => {
              btn.textContent = 'Sent!';
              this.reset();
              setTimeout(() => { btn.textContent = orig; btn.disabled = false; }, 3000);
            })
            .catch(() => {
              btn.textContent = 'Failed — try again';
              btn.disabled = false;
              setTimeout(() => { btn.textContent = orig; }, 3000);
            });
        });
      }
    }, 100);
})
.catch(err => console.error('Data load error:', err));
