/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-match. Base: cards (container block).
 * Source: FIFA homepage fixtures rail (match cards).
 * Item model: image (reference), text (richtext).
 * Structure: each card = 1 row with 2 cells: [ image cell (field:image), text cell (field:text) ].
 * Each match card: competition name, stage/venue, date/time, two teams (flag + name),
 * and score or kickoff time. The card has no single hero image, so the image cell is left
 * empty (still present per the block library note) and all fixture info goes in the text cell.
 */
export default function parse(element, { document }) {
  // Each card is a match block anchoring to the match centre.
  const cards = Array.from(element.querySelectorAll('.match-block_matchBlock__lIHT-, [class*="match-block_matchBlock__"]'));

  // Empty-block guard
  if (!cards.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const clean = (s) => (s || '').replace(/\s+/g, ' ').trim();

  const cells = [];

  cards.forEach((card) => {
    const link = card.querySelector('a[href*="/match-centre/"], a[href]');
    const href = link ? link.getAttribute('href') : null;

    const competition = clean(card.querySelector('.match-block-header_competitionName__zGBZm, [class*="competitionName"]')?.textContent);
    const descr = clean(card.querySelector('.match-block-header_competitionDescr__U5zLW, [class*="competitionDescr"]')?.textContent);
    const dateTime = clean(card.querySelector('.match-block-header_matchBlockHeader__aCPtF time, [class*="matchBlockHeader"] time')?.textContent);

    // Teams (name + optional score).
    const teamEls = Array.from(card.querySelectorAll('.match-block-team_team__77lf-, [class*="match-block-team_team__"]'));
    const teams = teamEls.map((t) => {
      const name = clean(t.querySelector('.match-block-team_teamName__aE4Nl, [class*="teamName"]')?.textContent);
      const score = clean(t.querySelector('.match-team-score_score__K3bpY, [class*="match-team-score_score__"]')?.textContent);
      return { name, score };
    }).filter((t) => t.name);

    // Kickoff time / status when there is no score.
    const statusTime = clean(card.querySelector('.match-block-status_matchTime__gkWMU, [class*="matchTime__"]')?.textContent);

    // Image cell (field:image) — no single hero image for a fixture card; keep empty cell.
    const imageCell = '';

    // Text cell (field:text)
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(' field:text '));

    // Headline: teams (with score if available), linked to the match centre.
    const hasScore = teams.some((t) => t.score);
    const teamLine = teams
      .map((t) => (hasScore && t.score ? `${t.name} ${t.score}` : t.name))
      .join(hasScore ? ' - ' : ' v ');
    if (teamLine) {
      const h = document.createElement('h3');
      if (href) {
        const a = document.createElement('a');
        a.setAttribute('href', href);
        a.textContent = teamLine;
        h.appendChild(a);
      } else {
        h.textContent = teamLine;
      }
      textCell.appendChild(h);
    }

    // Competition + stage/venue.
    if (competition) {
      const p = document.createElement('p');
      p.textContent = competition;
      textCell.appendChild(p);
    }
    if (descr) {
      const p = document.createElement('p');
      p.textContent = descr;
      textCell.appendChild(p);
    }
    // Date / kickoff time (only if the match hasn't been scored).
    const timeText = [dateTime, (!hasScore ? statusTime : '')].filter(Boolean).join(' · ');
    if (timeText) {
      const p = document.createElement('p');
      p.textContent = timeText;
      textCell.appendChild(p);
    }

    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-match', cells });
  element.replaceWith(block);
}
