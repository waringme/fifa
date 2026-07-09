/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroPromoParser from './parsers/hero-promo.js';
import carouselStoriesParser from './parsers/carousel-stories.js';
import carouselSpotlightParser from './parsers/carousel-spotlight.js';
import cardsMatchParser from './parsers/cards-match.js';
import cardsMomentsParser from './parsers/cards-moments.js';
import cardsNewsParser from './parsers/cards-news.js';
import cardsPromoParser from './parsers/cards-promo.js';
import embedExternalParser from './parsers/embed-external.js';
import heroBannerParser from './parsers/hero-banner.js';
import tableRankingParser from './parsers/table-ranking.js';

// TRANSFORMER IMPORTS
import fifaCleanupTransformer from './transformers/fifa-cleanup.js';

// PARSER REGISTRY
const parsers = {
  'hero-promo': heroPromoParser,
  'carousel-stories': carouselStoriesParser,
  'carousel-spotlight': carouselSpotlightParser,
  'cards-match': cardsMatchParser,
  'cards-moments': cardsMomentsParser,
  'cards-news': cardsNewsParser,
  'cards-promo': cardsPromoParser,
  'embed-external': embedExternalParser,
  'hero-banner': heroBannerParser,
  'table-ranking': tableRankingParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  fifaCleanupTransformer,
];

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'FIFA homepage - hero preview carousel, spotlight/news cards, story rail, and content sections',
  urls: [
    'https://www.fifa.com/en',
  ],
  blocks: [
    { name: 'hero-promo', instances: ['main > div > div:nth-of-type(1)'] },
    { name: 'carousel-stories', instances: ['main > div > div:nth-of-type(2)'] },
    { name: 'carousel-spotlight', instances: ['main > div > div:nth-of-type(3)'], section: 'dark' },
    { name: 'cards-match', instances: ['main > div > div:nth-of-type(5)'] },
    { name: 'cards-moments', instances: ['main > div > div:nth-of-type(6)'] },
    { name: 'cards-news', instances: ['main > div > div:nth-of-type(7)', 'main > div > div:nth-of-type(15)'] },
    { name: 'cards-promo', instances: ['main > div > div:nth-of-type(8)', 'main > div > div:nth-of-type(16)'] },
    { name: 'embed-external', instances: ['main > div > div:nth-of-type(9)'] },
    { name: 'hero-banner', instances: ['main > div > div:nth-of-type(11)', 'main > div > div:nth-of-type(13)'] },
    { name: 'table-ranking', instances: ['main > div > div:nth-of-type(14)'] },
  ],
  sections: [
    {
      id: 'section-3',
      name: 'Hero Spotlight + Preview Carousel',
      selector: 'main > div > div:nth-of-type(3)',
      style: 'dark',
      blocks: ['carousel-spotlight'],
      defaultContent: [],
    },
  ],
};

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  /**
   * Runs in the browser before transform. FIFA's homepage lazy-loads
   * below-the-fold sections (Top stories, Experience, hero banners, World
   * Rankings, Inside FIFA, What FIFA does) only after they scroll into view.
   * Scroll the full page and wait for skeleton loaders to resolve so those
   * sections are hydrated before parsing.
   */
  onLoad: async ({ document }) => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const step = Math.round((window.innerHeight || 900) * 0.8);
    const maxScrolls = 60;
    for (let i = 0; i < maxScrolls; i += 1) {
      window.scrollTo(0, step * i);
      // eslint-disable-next-line no-await-in-loop
      await sleep(350);
      if (step * i > document.body.scrollHeight) break;
    }
    window.scrollTo(0, document.body.scrollHeight);
    await sleep(1500);
    // Wait until skeleton placeholders are gone (or timeout)
    for (let i = 0; i < 20; i += 1) {
      if (!document.querySelector('[class*="skeleton"]')) break;
      // eslint-disable-next-line no-await-in-loop
      await sleep(500);
    }
    window.scrollTo(0, 0);
    await sleep(500);
    // FIFA images use srcset with an empty src attribute; the browser resolves
    // the displayed URL into img.currentSrc. Copy it into src so parsers and the
    // markdown conversion capture the image (empty-src imgs are dropped).
    document.querySelectorAll('img').forEach((img) => {
      if ((!img.getAttribute('src') || img.getAttribute('src').trim() === '') && img.currentSrc) {
        img.setAttribute('src', img.currentSrc);
      }
    });
  },

  transform: (payload) => {
    const {
      document, url, html, params,
    } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return; // Already replaced by earlier parser
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
