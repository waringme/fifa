/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-promo. Base: cards (container block).
 * Source: FIFA homepage promotional/topic tiles — each tile has an image, a label, and a link.
 * Item model: image (reference), text (richtext).
 * Structure: each tile = 1 row with 2 cells: [ image cell (field:image), text cell (field:text) ].
 * The cached source is a lazy-load skeleton; selectors target the client-rendered promo tiles
 * with generic fallbacks so live validation captures the real content.
 */
export default function parse(element, { document }) {
  const clean = (s) => (s || '').replace(/\s+/g, ' ').trim();

  // Promo tiles are anchors/items in the promo carousel.
  let tiles = Array.from(element.querySelectorAll(
    'a[class*="promoItem"], a[class*="itemBox"], a[class*="promoCard"], a[class*="topicCard"], a[href]'
  ));
  // Fallback: any anchor wrapping an image or carrying a label.
  if (!tiles.length) {
    tiles = Array.from(element.querySelectorAll('a')).filter((a) => a.querySelector('img') || clean(a.textContent));
  }
  // Keep outermost anchors only.
  tiles = tiles.filter((a) => !tiles.some((other) => other !== a && other.contains(a)));

  // Empty-block guard
  if (!tiles.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  tiles.forEach((tile) => {
    const href = tile.getAttribute('href');
    const image = tile.querySelector('img[class*="image_img"], picture img, img');
    // Label: prefer a title/label element, else the anchor's own text.
    const labelEl = tile.querySelector('[class*="itemTitle"], [class*="label"], [class*="Label"], [class*="itle"], h1, h2, h3, h4, span');
    const label = clean(labelEl ? labelEl.textContent : tile.textContent);

    // Image cell (field:image)
    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(' field:image '));
    if (image) imageCell.appendChild(image);

    // Text cell (field:text) — label as a linked line.
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(' field:text '));
    if (label) {
      if (href) {
        const a = document.createElement('a');
        a.setAttribute('href', href);
        a.textContent = label;
        const p = document.createElement('p');
        p.appendChild(a);
        textCell.appendChild(p);
      } else {
        const p = document.createElement('p');
        p.textContent = label;
        textCell.appendChild(p);
      }
    }

    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-promo', cells });
  element.replaceWith(block);
}
