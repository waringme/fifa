/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-stories. Base: carousel (container block).
 * Source: FIFA homepage storyteller rail (circular story thumbnails).
 * Item model: media_image (reference), media_imageAlt (collapsed), content_text (richtext).
 * Structure: 1st row = block name; each subsequent row = 1 slide with 2 cells:
 *   [ image cell (field:media_image), text cell (field:content_text) ].
 */
export default function parse(element, { document }) {
  // Each story is an anchor cell containing a thumbnail image and a caption title.
  const stories = Array.from(element.querySelectorAll('a.storyCellContainer-x7\\+6pO, a[class*="storyCellContainer"]'));

  // Empty-block guard
  if (!stories.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  stories.forEach((story) => {
    // Thumbnail image (round background). media_imageAlt collapses into <img alt>.
    const image = story.querySelector('img.roundBackground-TOOOIv, img[class*="roundBackground"], .storyCell-WAKj5m img, img');
    // Caption title.
    const title = story.querySelector('.storyTitle-OMQgdD, [class*="storyTitle"]');
    const href = story.getAttribute('href');

    // Image cell (field:media_image)
    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(' field:media_image '));
    if (image) imageCell.appendChild(image);

    // Text cell (field:content_text) — caption as a linked heading/text.
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(' field:content_text '));
    if (title) {
      const captionText = title.textContent.trim();
      if (href && captionText) {
        const link = document.createElement('a');
        link.setAttribute('href', href);
        link.textContent = captionText;
        const p = document.createElement('p');
        p.appendChild(link);
        textCell.appendChild(p);
      } else if (captionText) {
        textCell.appendChild(title);
      }
    }

    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-stories', cells });
  element.replaceWith(block);
}
