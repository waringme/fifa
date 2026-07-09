/*
 * Hero Promo Block (FIFA top promo banner)
 * Restructures the authored two-row table (logo row + text row) into a single
 * horizontal banner: logo | text (heading + paragraph) | CTA pill.
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 2) return;

  const logoCell = rows[0].querySelector(':scope > div') || rows[0];
  const textCell = rows[1].querySelector(':scope > div') || rows[1];

  // Logo
  const logo = document.createElement('div');
  logo.className = 'hero-promo-logo';
  const picture = logoCell.querySelector('picture, img');
  if (picture) logo.append(picture);

  // Text (heading + supporting paragraph, excluding the CTA)
  const text = document.createElement('div');
  text.className = 'hero-promo-text';

  // CTA (the button-container / standalone link)
  const cta = document.createElement('div');
  cta.className = 'hero-promo-cta';
  const buttonContainer = textCell.querySelector('.button-container');
  const link = textCell.querySelector('a');

  [...textCell.children].forEach((node) => {
    if (node === buttonContainer || (link && node.contains(link))) return;
    text.append(node);
  });
  if (buttonContainer) cta.append(buttonContainer);
  else if (link) cta.append(link);

  block.textContent = '';
  block.append(logo, text, cta);
}
