/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-news. Base: cards (container block).
 * Source: FIFA homepage editorial news grid — a lead article (image + headline/desc)
 * plus a list of secondary article links.
 * Item model: image (reference), text (richtext).
 * Structure: each article = 1 row with 2 cells: [ image cell (field:image), text cell (field:text) ].
 * The cached source is a lazy-load skeleton; selectors target the client-rendered news cards
 * with generic fallbacks so live validation captures the real content.
 */
export default function parse(element, { document }) {
  const clean = (s) => (s || '').replace(/\s+/g, ' ').trim();

  // News articles are anchors linking to /articles/ (lead card + inline/secondary items).
  let articles = Array.from(element.querySelectorAll(
    'a[class*="newsCard"], a[class*="newsInline"], a[class*="smallCard"], a[href*="/articles/"], a[href*="/news/"]'
  ));
  // Fallback: any anchor with meaningful text.
  if (!articles.length) {
    articles = Array.from(element.querySelectorAll('a')).filter((a) => clean(a.textContent) || a.querySelector('img'));
  }

  // De-duplicate anchors that are nested inside one another (keep outermost).
  articles = articles.filter((a) => !articles.some((other) => other !== a && other.contains(a)));

  // Empty-block guard
  if (!articles.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  articles.forEach((article) => {
    const href = article.getAttribute('href');
    const image = article.querySelector('img[class*="image_img"], picture img, img');

    // Headline: prefer a heading, else the roofline/title text, else the anchor text.
    const headingEl = article.querySelector('h1, h2, h3, h4, [class*="itle"]');
    const roofline = clean(article.querySelector('[class*="roofline"], [class*="Roofline"], [class*="eyebrow"]')?.textContent);
    const headingText = clean(headingEl ? headingEl.textContent : article.textContent);

    // Image cell (field:image)
    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(' field:image '));
    if (image) imageCell.appendChild(image);

    // Text cell (field:text) — optional roofline, then linked headline.
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(' field:text '));
    if (roofline && roofline !== headingText) {
      const p = document.createElement('p');
      p.textContent = roofline;
      textCell.appendChild(p);
    }
    if (headingText) {
      const h = document.createElement('h3');
      if (href) {
        const a = document.createElement('a');
        a.setAttribute('href', href);
        a.textContent = headingText;
        h.appendChild(a);
      } else {
        h.textContent = headingText;
      }
      textCell.appendChild(h);
    }

    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-news', cells });
  element.replaceWith(block);
}
