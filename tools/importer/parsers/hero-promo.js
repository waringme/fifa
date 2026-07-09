/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-promo. Base: hero.
 * Source: FIFA homepage (fan-qualified embed / promo banner).
 * Model fields: image (reference), imageAlt (collapsed), text (richtext).
 * Structure: 1 column. Row 2 = image, Row 3 = text (heading + subheading + CTA).
 */
export default function parse(element, { document }) {
  // INPUT EXTRACTION (validated against source.html)
  // Logo/background image
  const image = element.querySelector('.cwc-fan-qualified-embed-logo img, img[alt*="Logo"], img');
  // Heading (H2 title)
  const heading = element.querySelector('.cwc-fan-qualified-embed-title, h1, h2, [class*="title"]');
  // One-line description paragraph
  const description = element.querySelector('.cwc-fan-qualified-embed-text, p, [class*="text"]');
  // Single CTA link
  const cta = element.querySelector('a.cwc-fan-qualified-cta, a[href]');

  // Empty-block guard
  if (!heading && !description && !cta && !image) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row 2: image cell (field:image). imageAlt is collapsed into the <img alt> attr.
  const imageCell = document.createDocumentFragment();
  imageCell.appendChild(document.createComment(' field:image '));
  if (image) imageCell.appendChild(image);
  cells.push([imageCell]);

  // Row 3: text cell (field:text) — heading + subheading + CTA as richtext.
  const textCell = document.createDocumentFragment();
  textCell.appendChild(document.createComment(' field:text '));
  if (heading) textCell.appendChild(heading);
  if (description) textCell.appendChild(description);
  if (cta) {
    // Strip inner icon img from the CTA so only the link text/label remains
    cta.querySelectorAll('img').forEach((img) => img.remove());
    const ctaWrapper = document.createElement('p');
    ctaWrapper.appendChild(cta);
    textCell.appendChild(ctaWrapper);
  }
  cells.push([textCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-promo', cells });
  element.replaceWith(block);
}
