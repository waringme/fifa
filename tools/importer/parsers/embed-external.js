/* eslint-disable */
/* global WebImporter */
/**
 * Parser for embed-external. Base: embed.
 * Source: FIFA homepage external integration / interactive widget section.
 * Model fields (all share the `embed_` prefix → grouped into ONE cell):
 *   embed_placeholder (reference image), embed_placeholderAlt (collapsed), embed_uri (URL text).
 * Structure: 1 column. Single content cell = optional placeholder image (above) + embed URI link.
 * The cached source is a lazy-load skeleton; selectors target the client-rendered embed
 * (iframe / external link) with generic fallbacks so live validation captures the real URI.
 */
export default function parse(element, { document }) {
  // Locate the embed source URI: iframe, then external anchor, then data attributes.
  const iframe = element.querySelector('iframe[src]');
  const dataEl = element.querySelector('[data-src], [data-url], [data-embed-url], [data-embed]');
  const link = element.querySelector('a[href^="http"], a[href]');

  let uri = '';
  if (iframe) uri = iframe.getAttribute('src');
  else if (dataEl) uri = dataEl.getAttribute('data-src') || dataEl.getAttribute('data-url') || dataEl.getAttribute('data-embed-url') || dataEl.getAttribute('data-embed');
  else if (link) uri = link.getAttribute('href');

  // Optional placeholder/poster image.
  const image = element.querySelector('img[class*="image_img"], picture img, img');

  // Empty-block guard
  if (!uri && !image) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Single grouped `embed_` cell: placeholder image (above) then URI link.
  const cell = document.createDocumentFragment();
  if (image) {
    cell.appendChild(document.createComment(' field:embed_placeholder '));
    cell.appendChild(image);
  }
  if (uri) {
    cell.appendChild(document.createComment(' field:embed_uri '));
    const a = document.createElement('a');
    a.setAttribute('href', uri);
    a.textContent = uri;
    cell.appendChild(a);
  }

  const cells = [[cell]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'embed-external', cells });
  element.replaceWith(block);
}
