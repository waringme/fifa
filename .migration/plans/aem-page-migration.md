# FIFA Homepage Migration Plan — `https://www.fifa.com/en`

## Overview
Migrate the FIFA homepage (`https://www.fifa.com/en`) into this AEM Edge Delivery Services project as a **full-page migration**: content structure, visual design/styling, plus header navigation and footer. This is a **crosswalk (xwalk) project** (Universal Editor authoring), so imported content will be produced as JCR content compatible with the component models already defined in the repo.

## Scope (confirmed)
- **Source:** `https://www.fifa.com/en`
- **Type:** Full page — navigation + footer + content + design
- **Project:** `fifa` site, previewOrg `waringme`, xwalk/Universal Editor project

## Approach & Sequence
The migration runs in phases. Each phase produces artifacts that feed the next.

### Phase 1 — Scope & Page Analysis
- Scrape the source page (HTML, metadata, images) into the migration workspace.
- Identify section boundaries and content sequences.
- Determine authoring decisions (default content vs. blocks) per section.
- Survey the existing block palette (repo blocks: hero, cards, carousel, columns, teaser, tabs, accordion, etc.) and map source sections to available blocks; flag any new block variants needed.

### Phase 2 — Import Infrastructure
- Generate block parsers for each identified block variant.
- Generate page transformers (cleanup, section splitting, Dynamic Media handling if applicable).
- Build the bundled import script.

### Phase 3 — Content Import
- Run the import to generate the page content into `/content` for the `fifa` site.
- Verify the imported page renders in local preview.

### Phase 4 — Navigation & Footer
- Migrate the header/navigation (desktop, mobile, and any megamenu behavior) using screenshot-driven analysis.
- Migrate the footer (sections, link groups, legal/copyright).
- Validate nav and footer structure against the original.

### Phase 5 — Design/Styling Migration
- Extract design tokens (colors, typography, spacing) from the source.
- Apply block-level and section-level CSS to match the original visual design.
- Visually verify each migrated block against the source with iterative fixes.

### Phase 6 — Full-Page Visual Critique & QA
- Compare the fully assembled page (nav + content + footer + design) against the original.
- Fix discrepancies, re-verify in preview.

## Notes & Considerations
- **fifa.com is a highly dynamic, JavaScript-heavy site** with live match data, carousels, and personalized content. The migration will capture a static snapshot of the homepage as rendered at scrape time; dynamic/live-data widgets will be represented as static content or the closest available block.
- Media handling: images will be downloaded and referenced; if the source uses a DAM/Dynamic Media pattern, transformers will account for it.
- Any source section without a matching block will require a **new block variant** — these will be surfaced during Phase 1 for confirmation before infrastructure generation.

## Checklist
- [ ] Confirm project configuration and Block Library endpoint (xwalk project, `fifa`/`waringme`)
- [ ] Scrape `https://www.fifa.com/en` (HTML, metadata, images) into migration workspace
- [ ] Identify page section boundaries and content sequences
- [ ] Run authoring analysis and map sections to existing blocks; identify new variants needed
- [ ] Create any required new block variants
- [ ] Generate block parsers for all identified variants
- [ ] Generate page transformers (cleanup, sections, media)
- [ ] Build bundled import script
- [ ] Run content import into `/content` for the `fifa` site
- [ ] Verify imported content renders in local preview
- [ ] Migrate header/navigation (desktop, mobile, megamenu) with validation
- [ ] Migrate footer with validation
- [ ] Extract design tokens from the source page
- [ ] Apply and verify block-level + section-level styling
- [ ] Run full-page visual critique against the original and fix discrepancies
- [ ] Final QA of assembled full page in preview

> Execution requires **Execute mode** — approve this plan to proceed.
