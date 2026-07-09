/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-banner. Base: hero.
 * Source: FIFA homepage full-bleed promotional banner (background image, headline, copy, CTA).
 * Model fields: image (reference), imageAlt (collapsed), text (richtext).
 * Structure: 1 column. Row 2 = background image (field:image), Row 3 = text (field:text).
 * The cached source is a lazy-load skeleton; selectors target the client-rendered banner
 * with generic fallbacks so live validation captures the real content.
 */
export default function parse(element, { document }) {
  const clean = (s) => (s || '').replace(/\s+/g, ' ').trim();

  // Background / banner image.
  const image = element.querySelector(
    'img[class*="background"], img[class*="Background"], img[class*="banner"], img[class*="image_img"], picture img, img'
  );

  // Headline, copy, CTA (generic + banner-oriented fallbacks).
  const heading = element.querySelector('h1, h2, h3, [class*="itle"], [class*="headline"], [class*="Headline"]');
  const copy = element.querySelector('p[class*="description"], p[class*="copy"], p[class*="body"], p[class*="text"], p');
  const cta = element.querySelector('a[class*="btn"], a[class*="cta"], a[class*="Cta"], a[class*="button"], a[href]');

  // Empty-block guard
  if (!image && !heading && !copy && !cta) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row 2: image cell (field:image). imageAlt collapses into the <img alt>.
  const imageCell = document.createDocumentFragment();
  imageCell.appendChild(document.createComment(' field:image '));
  if (image) imageCell.appendChild(image);
  cells.push([imageCell]);

  // Row 3: text cell (field:text) — headline + copy + CTA.
  const textCell = document.createDocumentFragment();
  textCell.appendChild(document.createComment(' field:text '));
  if (heading) {
    const h = document.createElement('h2');
    h.textContent = clean(heading.textContent);
    textCell.appendChild(h);
  }
  if (copy) {
    const copyText = clean(copy.textContent);
    if (copyText && (!heading || copyText !== clean(heading.textContent))) {
      const p = document.createElement('p');
      p.textContent = copyText;
      textCell.appendChild(p);
    }
  }
  if (cta) {
    const href = cta.getAttribute('href');
    const ctaText = clean(cta.textContent);
    if (href && ctaText) {
      const a = document.createElement('a');
      a.setAttribute('href', href);
      a.textContent = ctaText;
      const p = document.createElement('p');
      p.appendChild(a);
      textCell.appendChild(p);
    }
  }
  cells.push([textCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-banner', cells });
  element.replaceWith(block);
}
