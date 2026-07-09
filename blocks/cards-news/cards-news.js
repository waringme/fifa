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
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-news-card-image';
      else div.className = 'cards-news-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  /* "Top stories" editorial layout: first card is the lead (large),
     the remaining cards stack in a secondary list beside it. */
  const items = [...ul.children];
  if (items.length > 1) {
    items[0].classList.add('cards-news-lead');
    const list = document.createElement('li');
    list.className = 'cards-news-secondary';
    const innerUl = document.createElement('ul');
    items.slice(1).forEach((li) => innerUl.append(li));
    list.append(innerUl);
    ul.append(list);
  }

  block.textContent = '';
  block.append(ul);
}
