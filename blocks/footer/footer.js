import { getMetadata } from '../../scripts/aem.js';

const SOCIAL_ICONS = {
  twitter: '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M18.9 2H22l-7.5 8.6L23 22h-6.7l-5.2-6.8L5.1 22H2l8-9.2L1.3 2H8l4.7 6.2L18.9 2Zm-2.4 18h1.8L7.6 3.9H5.7L16.5 20Z"/></svg>',
  facebook: '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.3v7A10 10 0 0 0 22 12Z"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>',
  youtube: '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M23 12s0-3.2-.4-4.7a2.5 2.5 0 0 0-1.8-1.8C19.3 5 12 5 12 5s-7.3 0-8.8.4a2.5 2.5 0 0 0-1.8 1.8C1 8.8 1 12 1 12s0 3.2.4 4.7a2.5 2.5 0 0 0 1.8 1.8C4.7 19 12 19 12 19s7.3 0 8.8-.4a2.5 2.5 0 0 0 1.8-1.8C23 15.2 23 12 23 12ZM9.8 15.3V8.7l5.7 3.3-5.7 3.3Z"/></svg>',
  tiktok: '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M16.5 2h-3v13.3a2.7 2.7 0 1 1-2.7-2.7c.3 0 .5 0 .8.1V9.6a5.9 5.9 0 1 0 4.9 5.8V8.9a6.8 6.8 0 0 0 4 1.3V7.1a3.8 3.8 0 0 1-3.9-3.8V2Z"/></svg>',
};

function socialKey(href) {
  const h = (href || '').toLowerCase();
  if (h.includes('twitter') || h.includes('x.com')) return 'twitter';
  if (h.includes('facebook')) return 'facebook';
  if (h.includes('instagram')) return 'instagram';
  if (h.includes('youtube')) return 'youtube';
  if (h.includes('tiktok')) return 'tiktok';
  return null;
}

export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';

  let resp = await fetch('/content/footer.plain.html');
  if (!resp.ok) resp = await fetch(`${footerPath}.plain.html`);
  if (!resp.ok) return;

  const html = await resp.text();
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  const sections = [...tmp.children];
  const logoSource = sections[0];
  const socialSource = sections[1];
  const legalSource = sections[2];

  block.textContent = '';
  const footer = document.createElement('div');
  footer.className = 'footer-inner';

  // top row: logo + social
  const top = document.createElement('div');
  top.className = 'footer-top';

  const logoWrap = document.createElement('div');
  logoWrap.className = 'footer-logo';
  if (logoSource) {
    const link = logoSource.querySelector('a');
    if (link) {
      const clone = link.cloneNode(true);
      const img = clone.querySelector('img');
      if (img) { img.removeAttribute('width'); img.removeAttribute('height'); }
      logoWrap.append(clone);
    }
  }

  const social = document.createElement('ul');
  social.className = 'footer-social';
  if (socialSource) {
    socialSource.querySelectorAll('a').forEach((a) => {
      const li = document.createElement('li');
      const link = document.createElement('a');
      link.href = a.getAttribute('href');
      link.setAttribute('aria-label', a.textContent.trim());
      link.rel = 'noopener';
      link.target = '_blank';
      const key = socialKey(link.href);
      link.innerHTML = key ? SOCIAL_ICONS[key] : a.textContent.trim();
      li.append(link);
      social.append(li);
    });
  }

  top.append(logoWrap, social);

  // bottom row: legal links + copyright
  const bottom = document.createElement('div');
  bottom.className = 'footer-bottom';
  const legal = document.createElement('ul');
  legal.className = 'footer-legal';
  let copyright = '';
  if (legalSource) {
    legalSource.querySelectorAll('a').forEach((a) => {
      const li = document.createElement('li');
      li.append(a.cloneNode(true));
      legal.append(li);
    });
    const p = legalSource.querySelector('p');
    if (p) copyright = p.textContent.trim();
  }
  const copy = document.createElement('p');
  copy.className = 'footer-copyright';
  copy.textContent = copyright;
  bottom.append(legal, copy);

  footer.append(top, bottom);
  block.append(footer);
}
