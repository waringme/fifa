/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-moments. Base: cards (container block).
 * Source: FIFA homepage "FIFA World Cup Moments" rail — portrait story/clip cards,
 * each with a large image, an optional NEW badge, and a caption.
 * Item model: image (reference), text (richtext).
 * Structure: each card = 1 row with 2 cells: [ image cell (field:image), text cell (field:text) ].
 * The cached source is a lazy-load skeleton; selectors target the client-rendered clip cards
 * with generic fallbacks so live validation captures the real content.
 */
export default function parse(element, { document }) {
  const clean = (s) => (s || '').replace(/\s+/g, ' ').trim();

  // Each moment card is an anchor/cell in the storyteller clips rail.
  let cards = Array.from(element.querySelectorAll(
    'a[class*="clipCellContainer"], a[class*="clipCell"], a[class*="momentCell"], [class*="clipCellContainer"], a[href*="clips"], a[href*="stories"]'
  ));
  // Fallback: any anchor that wraps an image (portrait media card).
  if (!cards.length) {
    cards = Array.from(element.querySelectorAll('a')).filter((a) => a.querySelector('img'));
  }

  // Empty-block guard
  if (!cards.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  cards.forEach((card) => {
    // Card image (portrait background/thumbnail).
    const image = card.querySelector(
      'img[class*="Background"], img[class*="background"], img[class*="image_img"], .storyCell-WAKj5m img, picture img, img'
    );

    // NEW badge (optional).
    const badge = clean(card.querySelector('[class*="badge"], [class*="Badge"], [class*="new"], [class*="New"]')?.textContent);
    // Caption / title.
    const caption = clean(card.querySelector(
      '[class*="Title"], [class*="title"], [class*="caption"], [class*="Caption"], [class*="clipText"], [class*="storyTitle"]'
    )?.textContent);
    const href = card.getAttribute('href');

    // Image cell (field:image). imageAlt collapses into <img alt>.
    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(' field:image '));
    if (image) imageCell.appendChild(image);

    // Text cell (field:text) — optional NEW badge, then caption (linked).
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(' field:text '));
    if (badge) {
      const b = document.createElement('p');
      b.textContent = badge;
      textCell.appendChild(b);
    }
    if (caption) {
      if (href) {
        const a = document.createElement('a');
        a.setAttribute('href', href);
        a.textContent = caption;
        const p = document.createElement('p');
        p.appendChild(a);
        textCell.appendChild(p);
      } else {
        const p = document.createElement('p');
        p.textContent = caption;
        textCell.appendChild(p);
      }
    }

    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-moments', cells });
  element.replaceWith(block);
}
