import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-moments-card-image';
      } else {
        div.className = 'cards-moments-card-body';
        // Tag the "NEW" badge and the caption so they can be positioned
        // independently as overlays (top-right badge, bottom-left caption).
        [...div.children].forEach((p) => {
          const text = (p.textContent || '').trim().toLowerCase();
          if (text === 'new') p.className = 'cards-moments-badge';
          else if (p.textContent.trim()) p.className = 'cards-moments-caption';
        });
      }
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    // Only optimise same-origin assets. External absolute URLs (e.g. the
    // storyteller CDN) must be kept as-is so they are not rewritten to a
    // broken local path.
    let external = false;
    try {
      external = new URL(img.src, window.location.href).origin !== window.location.origin;
    } catch (e) {
      external = false;
    }
    if (external) return;
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
  block.textContent = '';
  block.append(ul);
}
