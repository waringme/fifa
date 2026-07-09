/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: FIFA (fifa.com) site-wide cleanup.
 *
 * Removes non-authorable site chrome and transient/noise elements from the
 * fifa.com React SPA before and after block parsing. All selectors below were
 * verified against migration-work/cleaned.html (the captured DOM). fifa.com
 * uses CSS-module hashed class names (e.g. `pop-up_blurBackground__V8BYH`), so
 * substring `[class*="..."]` selectors are used to match the stable module
 * prefix while ignoring the volatile hash suffix.
 */
const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform',
};

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Transient overlays / consent / lazy-skeletons / story modal that block or
    // pollute block parsing. From migration-work/page-structure.json excludedNoise
    // and verified in cleaned.html.
    WebImporter.DOMUtils.remove(element, [
      // Promotional pop-up overlay (Netflix WC26 game) - cleaned.html line 3
      '[class*="pop-up_blurBackground"]',
      // OneTrust cookie consent banner
      '#onetrust-consent-sdk',
      '#onetrust-banner-sdk',
      // Ad slot skeleton loaders - cleaned.html: ad-skeleton-section_section__WwE2G
      '[class*="ad-skeleton-section"]',
      // Lazy-load skeleton placeholders - cleaned.html: box-skeleton_box__x-ik2
      '[class*="box-skeleton"]',
      // Storyteller player modal overlay (opens on story tap)
      '#storyteller-player-stories',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Non-authorable site chrome (header/nav/footer) plus leftover embed/link
    // noise. Header/nav verified in cleaned.html (global-menu_globalMenu, nav
    // elements); footer is rendered as footer-skeleton-section_container.
    WebImporter.DOMUtils.remove(element, [
      'header',
      'nav',
      '[class*="global-menu_globalMenu"]',
      // Footer chrome (download-app / copyright / logos) - not authorable page content
      '[class*="footer-skeleton-section"]',
      'footer',
      // Leftover non-authorable elements
      'iframe',
      'link',
      'noscript',
      'source',
    ]);

    // Strip tracking / analytics attributes left on any element.
    element.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('onclick');
      el.removeAttribute('data-track');
      el.removeAttribute('data-testid');
    });
  }
}
