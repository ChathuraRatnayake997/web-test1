import { formatText } from '../utils/helpers.js';

function renderHero(section) {
  const d = section.data || {};
  const el = document.createElement('section');
  el.className = 'min-h-screen flex flex-col justify-center';
  el.innerHTML = `
    <div class="px-margin-page py-20 max-w-7xl mx-auto w-full">
      <div class="flex flex-col gap-stack-md">
        ${d.badge ? `<span class="text-label-caps font-label-caps uppercase tracking-widest text-secondary dark:text-primary">${d.badge}</span>` : ''}
        <h1 class="text-display-lg-mobile md:text-display-lg font-display-lg leading-tight tracking-tighter">
          ${d.name || ''}${d.tagline ? `<br><span class="text-secondary/60 dark:text-primary/60">${d.tagline}</span>` : ''}
        </h1>
        ${d.description ? `<p class="max-w-2xl text-body-lg font-body-lg text-on-surface-variant mt-stack-md">${d.description}</p>` : ''}
      </div>
    </div>`;
  return el;
}

function renderAbout(section) {
  const d = section.data || {};
  const focusItems = (d.focus || []).map(item =>
    `<li class="flex items-center gap-2"><span class="w-1.5 h-1.5 bg-primary rounded-full"></span>${item}</li>`
  ).join('');

  const stats = (d.stats || []).map(s =>
    `<div class="border-t border-secondary/50 dark:border-outline-variant/20 pt-stack-sm">
      <span class="text-primary text-display-lg-mobile font-bold leading-none">${s.value}</span>
      <p class="text-label-caps font-label-caps text-secondary dark:text-on-surface-variant uppercase">${s.label}</p>
    </div>`
  ).join('');

  const cards = (d.cards || []).map(c =>
    `<div class="bg-surface-container-high p-stack-md border border-secondary/20 dark:border-outline-variant/20">
      <h3 class="font-bold text-body-md mb-2 dark:text-primary">${c.title}</h3>
      <p class="text-body-md opacity-80">${c.text}</p>
    </div>`
  ).join('');

  const el = document.createElement('section');
  el.className = 'min-h-screen flex flex-col justify-center';
  el.id = section.id;
  el.innerHTML = `
    <div class="px-margin-page py-20 max-w-7xl mx-auto w-full">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-gutter-grid">
        <div class="md:col-span-4 flex flex-col gap-stack-md border-b md:border-b-0 md:border-r border-secondary/50 dark:border-outline-variant/20 pb-stack-lg md:pb-0 md:pr-gutter-grid">
          <h2 class="text-headline-sm font-headline-sm uppercase tracking-tight">${d.focus_heading || 'Focus Areas'}</h2>
          <ul class="flex flex-col gap-stack-sm text-body-md font-body-md">${focusItems}</ul>
          <div class="mt-stack-lg flex flex-col gap-stack-md">${stats}</div>
        </div>
        <div class="md:col-span-8 flex flex-col gap-stack-md">
          <h2 class="text-headline-md font-headline-md">${Array.isArray(d.heading) ? d.heading.join('<br>') : (d.heading || '')}</h2>
          ${(d.paragraphs || [d.description].filter(Boolean)).map((p, i) => `<p class="${i === 0 ? 'text-body-lg font-body-lg' : 'text-body-md font-body-md'} text-on-surface-variant">${p}</p>`).join('')}
          ${cards ? `<div class="grid grid-cols-1 sm:grid-cols-2 gap-stack-md mt-stack-md">${cards}</div>` : ''}
        </div>
      </div>
    </div>`;
  return el;
}

function renderEducation(section) {
  const d = section.data || {};
  const items = (d.items || []).map((item, i) => {
    const border = i === 0 ? '' : ' border-t border-secondary/20 dark:border-outline-variant/20 pt-gutter-grid';
    return `
      <div class="grid grid-cols-1 md:grid-cols-12 gap-stack-md${border}">
        <div class="md:col-span-3 text-label-caps font-label-caps text-primary">${item.period}</div>
        <div class="md:col-span-9">
          <h3 class="text-headline-sm font-headline-sm">${item.degree}</h3>
          <p class="text-body-md font-body-md text-secondary dark:text-primary/80 mb-2">${item.institution}</p>
          <p class="text-body-md text-on-surface-variant italic">${item.description}</p>
        </div>
      </div>`;
  }).join('');

  const el = document.createElement('section');
  el.className = 'min-h-screen flex flex-col justify-center';
  el.id = section.id;
  el.innerHTML = `
    <div class="px-margin-page py-20 max-w-7xl mx-auto w-full">
      <div class="flex flex-col md:flex-row justify-between items-baseline mb-stack-lg border-b border-secondary/30 dark:border-outline-variant/20 pb-4">
        <h2 class="text-headline-md font-headline-md">${d.heading}</h2>
      </div>
      <div class="space-y-gutter-grid">${items}</div>
    </div>`;
  return el;
}

function renderPublications(section) {
  const d = section.data || {};

  const featuredHtml = d.featured ? `
    <div class="group grid grid-cols-1 md:grid-cols-2 gap-gutter-grid mb-stack-lg p-stack-md -mx-4 bg-surface-container-low dark:bg-surface-container rounded-sm">
      <div class="overflow-hidden">
        <img class="w-full h-56 md:h-full object-cover group-hover:scale-105 transition-transform duration-700" src="${d.featured.image}" alt="${d.featured.alt}" loading="lazy">
      </div>
      <div class="flex flex-col gap-stack-sm justify-center">
        <span class="text-label-caps font-label-caps text-primary uppercase">${d.featured.badge}</span>
        <h3 class="text-headline-sm font-headline-sm group-hover:text-primary transition-colors">${d.featured.title}</h3>
        <p class="text-body-md text-on-surface-variant">${d.featured.description}</p>
        <a class="inline-flex items-center gap-2 text-primary font-bold hover:underline mt-auto" href="#">
          <span class="material-symbols-outlined text-sm">${d.featured.download.icon}</span>
          ${d.featured.download.label}
          <span class="text-label-caps font-label-caps text-on-surface-variant font-normal">${d.featured.download.info}</span>
        </a>
      </div>
    </div>` : '';

  function renderLink(link) {
    return `<a class="border border-primary dark:border-primary/50 text-primary px-3 py-1 text-label-caps font-label-caps hover:bg-primary hover:text-on-primary transition-all flex items-center gap-1" href="${link.url}">
      ${link.icon ? `<span class="material-symbols-outlined text-sm leading-none">${link.icon}</span>` : ''}${link.label}</a>`;
  }

  function renderTags(tags) {
    if (!tags || !tags.length) return '';
    return `<div class="flex flex-wrap gap-1.5 mt-1">${tags.map(t =>
      `<span class="text-label-caps font-label-caps text-secondary dark:text-primary uppercase bg-secondary-container dark:bg-surface-container-high px-2 py-0.5 text-[10px]">${t}</span>`
    ).join('')}</div>`;
  }

  const items = (d.items || []).map((item, i) => {
    const linksHtml = (item.links || []).map(renderLink).join('');
    const tagsHtml = renderTags(item.tags);
    const imgHtml = item.image
      ? `<div class="w-full h-32 md:w-40 md:h-full shrink-0 overflow-hidden rounded-sm"><img class="w-full h-full object-cover" src="${item.image}" alt="" loading="lazy"></div>`
      : '';

    return `<div class="group border-b border-secondary/50 dark:border-outline-variant/20 pb-stack-md hover:bg-surface-container-high dark:hover:bg-surface-container transition-colors p-4 -mx-4 flex flex-col md:flex-row gap-stack-md">
      ${imgHtml}
      <div class="flex-1 flex flex-col md:flex-row justify-between gap-stack-md">
        <div class="flex-1">
          <span class="text-label-caps font-label-caps text-primary uppercase mb-1 block">${item.journal}</span>
          <h3 class="text-headline-sm font-headline-sm group-hover:text-primary transition-colors">${item.title}</h3>
          <p class="text-body-md text-on-surface-variant mt-1">${item.authors}</p>
          ${item.summary ? `<p class="text-body-md text-on-surface-variant/70 text-sm mt-1">${item.summary}</p>` : ''}
          ${tagsHtml}
        </div>
        <div class="flex items-start gap-stack-sm flex-wrap shrink-0">${linksHtml}</div>
      </div>
    </div>`;
  }).join('');

  const el = document.createElement('section');
  el.className = 'min-h-screen flex flex-col justify-center';
  el.id = section.id;
  el.innerHTML = `
    <div class="px-margin-page py-20 max-w-7xl mx-auto w-full">
      <h2 class="text-headline-md font-headline-md mb-2">${Array.isArray(d.heading) ? d.heading.join('<br>') : d.heading}</h2>
      ${d.focus ? `<p class="text-body-lg font-body-lg text-on-surface-variant mb-stack-lg max-w-2xl">${d.focus}</p>` : ''}
      ${featuredHtml}
      <div class="flex flex-col">${items}</div>
      ${d.all_link ? `<div class="mt-stack-lg">
        <a class="border border-primary dark:border-primary/50 text-primary px-5 py-2 text-label-caps font-label-caps hover:bg-primary hover:text-on-primary transition-all inline-flex items-center gap-2" href="${d.all_link}">
          View Full Publication List <span class="material-symbols-outlined text-sm">north_east</span>
        </a>
      </div>` : ''}
    </div>`;
  return el;
}

function renderProjects(section) {
  const d = section.data || {};
  const items = (d.items || []).map(item =>
    `<div class="bg-secondary-container dark:bg-surface-container border border-secondary/20 dark:border-outline-variant/20 flex flex-col group hover:bg-surface-container-highest dark:hover:bg-surface-container-highest transition-colors overflow-hidden">
      <img class="w-full h-48 object-cover" src="${item.image}" alt="${item.alt}" loading="lazy">
      <div class="bg-surface-container-high hover:bg-secondary-container dark:hover:bg-secondary-container transition-colors p-stack-md flex flex-col gap-stack-sm flex-1">
        <div class="flex items-center justify-between gap-2">
          <h3 class="font-bold text-body-md dark:text-primary">${item.title}</h3>
          <span class="text-label-caps font-label-caps text-primary uppercase border border-primary/30 px-2 py-0.5 whitespace-nowrap">${item.status}</span>
        </div>
        <p class="text-body-md opacity-80 flex-1">${item.description}</p>
        <a class="text-label-caps font-label-caps text-primary hover:underline mt-auto" href="${item.url}">Learn more</a>
      </div>
    </div>`
  ).join('');

  const el = document.createElement('section');
  el.className = 'min-h-screen flex flex-col justify-center';
  el.id = section.id;
  el.innerHTML = `
    <div class="px-margin-page py-20 max-w-7xl mx-auto w-full">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-stack-lg gap-stack-md">
        <div>
          <h2 class="text-headline-md font-headline-md">${d.heading}</h2>
          <p class="text-body-lg font-body-lg text-on-surface-variant mt-stack-sm max-w-2xl">${d.description}</p>
        </div>
        ${d.view_all ? `<a class="border border-primary dark:border-primary/50 text-primary px-5 py-2 text-label-caps font-label-caps hover:bg-primary hover:text-on-primary transition-all inline-flex items-center gap-2 shrink-0" href="${d.view_all.url}">${d.view_all.label} <span class="material-symbols-outlined text-sm">arrow_outward</span></a>` : ''}
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-stack-md">${items}</div>
    </div>`;
  return el;
}

function renderContact(section) {
  const d = section.data || {};
  const formFields = (d.fields || []).map(f => {
    const name = f.name || f.label.toLowerCase().replace(/\s+/g, '_');
    if (f.type === 'textarea') {
      return `<div class="form-group flex flex-col gap-1">
        <label class="text-label-caps font-label-caps text-secondary dark:text-on-surface-variant uppercase" for="${name}">${f.label}</label>
        <textarea id="${name}" name="${name}" class="bg-transparent border-0 border-b border-outline dark:border-outline-variant/20 focus:ring-0 focus:border-primary transition-all py-2 text-body-md resize-none" placeholder="${f.placeholder}" rows="4" required></textarea>
      </div>`;
    }
    return `<div class="form-group flex flex-col gap-1">
      <label class="text-label-caps font-label-caps text-secondary dark:text-on-surface-variant uppercase" for="${name}">${f.label}</label>
      <input id="${name}" name="${name}" class="bg-transparent border-0 border-b border-outline dark:border-outline-variant/20 focus:ring-0 focus:border-primary transition-all py-2 text-body-md" placeholder="${f.placeholder}" type="${f.type}" required>
    </div>`;
  }).join('');

  const el = document.createElement('section');
  el.className = 'min-h-screen flex flex-col justify-center';
  el.id = section.id;
  el.innerHTML = `
    <div class="px-margin-page py-20 max-w-7xl mx-auto w-full">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-section-gap">
        <div>
          <h2 class="text-display-lg-mobile font-display-lg mb-stack-md">${d.heading || 'Get in touch'}</h2>
          <p class="text-body-lg font-body-lg text-on-surface-variant mb-stack-lg">${d.message || ''}</p>
          <div class="space-y-stack-sm">
            <p class="text-body-md font-bold">${d.email || ''}</p>
            ${Array.isArray(d.address) ? d.address.map(a => `<p class="text-body-md text-secondary dark:text-on-surface-variant">${a}</p>`).join('') : `<p class="text-body-md text-secondary dark:text-on-surface-variant">${d.address || ''}</p>`}
          </div>
        </div>
        <form id="contactForm" class="flex flex-col gap-stack-md">${formFields}
          <button class="mt-stack-md bg-primary text-on-primary py-stack-md font-bold uppercase tracking-widest hover:opacity-90 transition-opacity" type="submit">${d.button || 'Send'}</button>
        </form>
      </div>
    </div>`;
  return el;
}

export const renderers = {
  hero: renderHero,
  about: renderAbout,
  education: renderEducation,
  publications: renderPublications,
  projects: renderProjects,
  contact: renderContact
};
