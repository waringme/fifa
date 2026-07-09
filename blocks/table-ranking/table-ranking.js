/*
 * Table Ranking Block (variant of table)
 * Renders FIFA-style ranking rows as cards: rank, movement, team (flag + name), points.
 * The authored table has 4 columns per row: rank | movement | team | points.
 * Fully-empty authored rows act as separators between distinct rankings and are dropped.
 */

import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * @param {Element} block
 */
export default async function decorate(block) {
  const table = document.createElement('table');
  const tbody = document.createElement('tbody');

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    // Drop fully-empty separator rows (all cells blank).
    const isEmpty = cells.every((c) => c.textContent.trim() === '' && !c.querySelector('img'));
    if (isEmpty) return;

    const tr = document.createElement('tr');
    moveInstrumentation(row, tr);

    cells.forEach((cell, ci) => {
      const td = document.createElement('td');
      td.className = `table-ranking-col${ci + 1}`;
      td.innerHTML = cell.innerHTML;
      tr.append(td);
    });
    tbody.append(tr);
  });

  table.append(tbody);
  block.replaceChildren(table);
}
