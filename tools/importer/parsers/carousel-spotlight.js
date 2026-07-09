/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-spotlight. Base: carousel (container block).
 * Source: FIFA homepage hero spotlight carousel (featured article slides).
 * Item model: media_image (reference), media_imageAlt (collapsed), content_text (richtext).
 * Structure: 1st row = block name; each subsequent row = 1 slide with 2 cells:
 *   [ image cell (field:media_image), text cell (field:content_text) ].
 * Each slide: eyebrow (roofline), headline, description, CTA, image.
 */
export default function parse(element, { document }) {
  // Main spotlight slides are the match-card wrappers.
  // (The .hero-preview-item elements are nav thumbnails and are intentionally excluded.)
  const slides = Array.from(element.querySelectorAll('.hero-match-card_wrapper__CKXxR, [class*="hero-match-card_wrapper"]'));

  // Empty-block guard
  if (!slides.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  slides.forEach((slide) => {
    // Image (media_image). imageAlt collapses into the <img alt>.
    const image = slide.querySelector('.hero-match-card_image__r3rRi img, [class*="hero-match-card_image"] img, .image_img__pNjkh, img[class*="image_img"]');

    // Text content pieces.
    const eyebrow = slide.querySelector('.hero-match-card-text_roofline__kfRu4, [class*="roofline"]');
    const titleLink = slide.querySelector('.hero-match-card-text_titleLink__ykeyY, a[class*="titleLink"]');
    const description = slide.querySelector('.hero-match-card-text_description__rMF3v, p[class*="description"]');
    const cta = slide.querySelector('.hero-cta_cta__rC4Ew, a[class*="hero-cta_cta"]');

    // Image cell (field:media_image)
    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(' field:media_image '));
    if (image) imageCell.appendChild(image);

    // Text cell (field:content_text)
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(' field:content_text '));

    // Eyebrow as a paragraph.
    if (eyebrow) {
      const ey = document.createElement('p');
      ey.textContent = eyebrow.textContent.trim();
      textCell.appendChild(ey);
    }
    // Headline as a linked heading.
    if (titleLink) {
      const href = titleLink.getAttribute('href');
      // The heading duplicates its copy across responsive spans (d-md-none / d-md-block).
      // Take the innermost single span so the text is not doubled.
      const headingSource = titleLink.querySelector('span[title], .d-md-none, span span') || titleLink;
      const headingText = headingSource.textContent.replace(/\s+/g, ' ').trim();
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
    // Description as a paragraph (dedupe the responsive-duplicated text).
    if (description) {
      const descText = description.textContent.replace(/\s+/g, ' ').trim();
      // Source duplicates the copy for mobile/desktop; take the first half if doubled.
      const half = descText.slice(0, Math.ceil(descText.length / 2));
      const finalText = (descText === (half + half)) ? half : descText;
      const p = document.createElement('p');
      p.textContent = finalText;
      textCell.appendChild(p);
    }
    // CTA as a linked paragraph.
    if (cta) {
      const href = cta.getAttribute('href');
      const ctaText = cta.textContent.replace(/\s+/g, ' ').trim();
      if (href && ctaText) {
        const a = document.createElement('a');
        a.setAttribute('href', href);
        a.textContent = ctaText;
        const p = document.createElement('p');
        p.appendChild(a);
        textCell.appendChild(p);
      }
    }

    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-spotlight', cells });
  element.replaceWith(block);
}
