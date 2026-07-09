import { getMetadata } from '../../scripts/aem.js';

const MOBILE_QUERY = window.matchMedia('(max-width: 899px)');

const ICONS = {
  search: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"></circle><line x1="21" y1="21" x2="16.5" y2="16.5"></line></svg>',
  account: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"></circle><path d="M4 20c0-4 4-6 8-6s8 2 8 6"></path></svg>',
  globe: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18"></path></svg>',
  chevron: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>',
};

function closeMobileNav(nav) {
  nav.classList.remove('is-open');
  document.body.classList.remove('nav-open');
  const burger = nav.querySelector('.nav-burger');
  if (burger) burger.setAttribute('aria-expanded', 'false');
}

function openMobileNav(nav) {
  nav.classList.add('is-open');
  document.body.classList.add('nav-open');
  const burger = nav.querySelector('.nav-burger');
  if (burger) burger.setAttribute('aria-expanded', 'true');
}

export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';

  let resp = await fetch('/content/nav.plain.html');
  if (!resp.ok) resp = await fetch(`${navPath}.plain.html`);
  if (!resp.ok) return;

  const html = await resp.text();
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  const sections = [...tmp.children];
  const eyebrowSource = sections[0];
  const mainSource = sections[1];

  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';

  // ---- Eyebrow (utility) bar ----
  const eyebrow = document.createElement('div');
  eyebrow.className = 'nav-eyebrow';
  const eyebrowInner = document.createElement('div');
  eyebrowInner.className = 'nav-eyebrow-inner';
  const utilityLinks = document.createElement('ul');
  utilityLinks.className = 'nav-utility-links';
  if (eyebrowSource) {
    eyebrowSource.querySelectorAll('a').forEach((link) => {
      const li = document.createElement('li');
      li.append(link.cloneNode(true));
      utilityLinks.append(li);
    });
  }
  const langBtn = document.createElement('button');
  langBtn.type = 'button';
  langBtn.className = 'nav-lang';
  langBtn.setAttribute('aria-label', 'Selected language: English');
  langBtn.innerHTML = `${ICONS.globe}<span>EN</span>${ICONS.chevron}`;
  eyebrowInner.append(utilityLinks, langBtn);
  eyebrow.append(eyebrowInner);

  // ---- Main navigation bar ----
  const bar = document.createElement('div');
  bar.className = 'nav-bar';
  const barInner = document.createElement('div');
  barInner.className = 'nav-bar-inner';

  // hamburger (mobile)
  const burger = document.createElement('button');
  burger.type = 'button';
  burger.className = 'nav-burger';
  burger.setAttribute('aria-label', 'Open Hamburger Menu');
  burger.setAttribute('aria-expanded', 'false');
  burger.innerHTML = '<span class="nav-burger-icon"></span>';

  // logo
  const logoWrap = document.createElement('a');
  logoWrap.className = 'nav-logo';
  logoWrap.href = '/en/home';
  const srcLogo = mainSource && mainSource.querySelector('img');
  if (srcLogo) {
    const logoImg = srcLogo.cloneNode(true);
    logoImg.removeAttribute('width');
    logoImg.removeAttribute('height');
    logoWrap.append(logoImg);
  } else {
    logoWrap.textContent = 'FIFA';
  }

  // primary nav links
  const menu = document.createElement('ul');
  menu.className = 'nav-menu';
  if (mainSource) {
    mainSource.querySelectorAll('ul > li').forEach((li) => {
      const srcAnchor = li.querySelector('a');
      if (!srcAnchor) return;
      const item = document.createElement('li');
      item.append(srcAnchor.cloneNode(true));
      menu.append(item);
    });
  }

  // tools (search + account)
  const tools = document.createElement('div');
  tools.className = 'nav-tools';
  const searchLink = document.createElement('a');
  searchLink.className = 'nav-tool nav-search';
  searchLink.href = '/en?searchOverlay=1';
  searchLink.setAttribute('aria-label', 'Search');
  searchLink.innerHTML = ICONS.search;
  const accountBtn = document.createElement('button');
  accountBtn.type = 'button';
  accountBtn.className = 'nav-tool nav-account';
  accountBtn.setAttribute('aria-label', 'My Account');
  accountBtn.innerHTML = ICONS.account;
  tools.append(searchLink, accountBtn);

  barInner.append(burger, logoWrap, menu, tools);
  bar.append(barInner);

  nav.append(eyebrow, bar);
  block.append(nav);

  // ---- Interactions ----
  burger.addEventListener('click', () => {
    if (nav.classList.contains('is-open')) closeMobileNav(nav);
    else openMobileNav(nav);
  });

  document.addEventListener('keydown', (e) => {
    if (e.code === 'Escape') closeMobileNav(nav);
  });

  // Reset state when crossing breakpoints
  MOBILE_QUERY.addEventListener('change', () => {
    if (!MOBILE_QUERY.matches) closeMobileNav(nav);
  });
}
