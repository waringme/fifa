/* eslint-disable */
/* global WebImporter */
/**
 * Parser for table-ranking. Base: table (container block).
 * Source: FIFA homepage world-ranking tables (rank, movement, team flag+name, points).
 * Item model: table-ranking-col-4 → column1text..column4text (richtext).
 * Structure: 1st row = block name; each subsequent row = 1 ranking row with 4 cells:
 *   [ column1text (rank), column2text (movement), column3text (team flag+name), column4text (points) ].
 * All rows have the same 4 cells; each content cell carries a <!-- field:columnNtext --> hint.
 * The cached source is a lazy-load skeleton; selectors target the client-rendered ranking rows
 * with generic fallbacks so live validation captures the real content.
 */
export default function parse(element, { document }) {
  const clean = (s) => (s || '').replace(/\s+/g, ' ').trim();

  // Each ranking entry is a table row in the world-ranking widget.
  let rows = Array.from(element.querySelectorAll(
    '[class*="tableRow"], [class*="rankingRow"], [class*="rankRow"], tr, li[class*="row"]'
  ));
  // Drop header rows / empty skeleton placeholders that carry no data.
  rows = rows.filter((r) => clean(r.textContent) || r.querySelector('img'));

  // Empty-block guard
  if (!rows.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const FIELDS = ['column1text', 'column2text', 'column3text', 'column4text'];

  // Build a 4-cell row: rank, movement, team (flag + name), points.
  const buildRow = (rank, movement, teamFlag, teamName, points) => {
    const values = [rank, movement, null /* team handled below */, points];

    const rankCell = makeTextCell(FIELDS[0], rank);
    const moveCell = makeTextCell(FIELDS[1], movement);

    // Team cell: flag image + name.
    const teamCell = document.createDocumentFragment();
    let teamHasContent = false;
    if (teamFlag || teamName) {
      teamCell.appendChild(document.createComment(` field:${FIELDS[2]} `));
      if (teamFlag) { teamCell.appendChild(teamFlag); teamHasContent = true; }
      if (teamName) {
        const span = document.createElement('span');
        span.textContent = teamName;
        teamCell.appendChild(span);
        teamHasContent = true;
      }
    }
    const teamCellFinal = teamHasContent ? teamCell : '';

    const pointsCell = makeTextCell(FIELDS[3], points);

    return [rankCell, moveCell, teamCellFinal, pointsCell];
  };

  function makeTextCell(field, text) {
    if (!text) return '';
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(` field:${field} `));
    const span = document.createElement('span');
    span.textContent = text;
    frag.appendChild(span);
    return frag;
  }

  const cells = [];

  rows.forEach((row) => {
    const rank = clean(row.querySelector('[class*="rank"], [class*="Rank"], [class*="position"], [class*="Position"]')?.textContent);
    const movement = clean(row.querySelector('[class*="movement"], [class*="Movement"], [class*="change"], [class*="Change"], [class*="trend"]')?.textContent);
    const teamFlag = row.querySelector('img[class*="flag"], img[class*="Flag"], img[class*="image_img"], picture img, img');
    const teamName = clean(row.querySelector('[class*="teamName"], [class*="TeamName"], [class*="team"], [class*="Team"], [class*="name"]')?.textContent);
    const points = clean(row.querySelector('[class*="point"], [class*="Point"], [class*="score"], [class*="Score"]')?.textContent);

    cells.push(buildRow(rank, movement, teamFlag, teamName, points));
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'table-ranking', cells });
  element.replaceWith(block);
}
