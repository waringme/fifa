/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-promo.js
  function parse(element, { document }) {
    const image = element.querySelector('.cwc-fan-qualified-embed-logo img, img[alt*="Logo"], img');
    const heading = element.querySelector('.cwc-fan-qualified-embed-title, h1, h2, [class*="title"]');
    const description = element.querySelector('.cwc-fan-qualified-embed-text, p, [class*="text"]');
    const cta = element.querySelector("a.cwc-fan-qualified-cta, a[href]");
    if (!heading && !description && !cta && !image) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(" field:image "));
    if (image) imageCell.appendChild(image);
    cells.push([imageCell]);
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(" field:text "));
    if (heading) textCell.appendChild(heading);
    if (description) textCell.appendChild(description);
    if (cta) {
      cta.querySelectorAll("img").forEach((img) => img.remove());
      const ctaWrapper = document.createElement("p");
      ctaWrapper.appendChild(cta);
      textCell.appendChild(ctaWrapper);
    }
    cells.push([textCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-promo", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-stories.js
  function parse2(element, { document }) {
    const stories = Array.from(element.querySelectorAll('a.storyCellContainer-x7\\+6pO, a[class*="storyCellContainer"]'));
    if (!stories.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    stories.forEach((story) => {
      const image = story.querySelector('img.roundBackground-TOOOIv, img[class*="roundBackground"], .storyCell-WAKj5m img, img');
      const title = story.querySelector('.storyTitle-OMQgdD, [class*="storyTitle"]');
      const href = story.getAttribute("href");
      const imageCell = document.createDocumentFragment();
      imageCell.appendChild(document.createComment(" field:media_image "));
      if (image) imageCell.appendChild(image);
      const textCell = document.createDocumentFragment();
      textCell.appendChild(document.createComment(" field:content_text "));
      if (title) {
        const captionText = title.textContent.trim();
        if (href && captionText) {
          const link = document.createElement("a");
          link.setAttribute("href", href);
          link.textContent = captionText;
          const p = document.createElement("p");
          p.appendChild(link);
          textCell.appendChild(p);
        } else if (captionText) {
          textCell.appendChild(title);
        }
      }
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-stories", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-spotlight.js
  function parse3(element, { document }) {
    const slides = Array.from(element.querySelectorAll('.hero-match-card_wrapper__CKXxR, [class*="hero-match-card_wrapper"]'));
    if (!slides.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    slides.forEach((slide) => {
      const image = slide.querySelector('.hero-match-card_image__r3rRi img, [class*="hero-match-card_image"] img, .image_img__pNjkh, img[class*="image_img"]');
      const eyebrow = slide.querySelector('.hero-match-card-text_roofline__kfRu4, [class*="roofline"]');
      const titleLink = slide.querySelector('.hero-match-card-text_titleLink__ykeyY, a[class*="titleLink"]');
      const description = slide.querySelector('.hero-match-card-text_description__rMF3v, p[class*="description"]');
      const cta = slide.querySelector('.hero-cta_cta__rC4Ew, a[class*="hero-cta_cta"]');
      const imageCell = document.createDocumentFragment();
      imageCell.appendChild(document.createComment(" field:media_image "));
      if (image) imageCell.appendChild(image);
      const textCell = document.createDocumentFragment();
      textCell.appendChild(document.createComment(" field:content_text "));
      if (eyebrow) {
        const ey = document.createElement("p");
        ey.textContent = eyebrow.textContent.trim();
        textCell.appendChild(ey);
      }
      if (titleLink) {
        const href = titleLink.getAttribute("href");
        const headingSource = titleLink.querySelector("span[title], .d-md-none, span span") || titleLink;
        const headingText = headingSource.textContent.replace(/\s+/g, " ").trim();
        const h = document.createElement("h3");
        if (href) {
          const a = document.createElement("a");
          a.setAttribute("href", href);
          a.textContent = headingText;
          h.appendChild(a);
        } else {
          h.textContent = headingText;
        }
        textCell.appendChild(h);
      }
      if (description) {
        const descText = description.textContent.replace(/\s+/g, " ").trim();
        const half = descText.slice(0, Math.ceil(descText.length / 2));
        const finalText = descText === half + half ? half : descText;
        const p = document.createElement("p");
        p.textContent = finalText;
        textCell.appendChild(p);
      }
      if (cta) {
        const href = cta.getAttribute("href");
        const ctaText = cta.textContent.replace(/\s+/g, " ").trim();
        if (href && ctaText) {
          const a = document.createElement("a");
          a.setAttribute("href", href);
          a.textContent = ctaText;
          const p = document.createElement("p");
          p.appendChild(a);
          textCell.appendChild(p);
        }
      }
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-spotlight", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-match.js
  function parse4(element, { document }) {
    const cards = Array.from(element.querySelectorAll('.match-block_matchBlock__lIHT-, [class*="match-block_matchBlock__"]'));
    if (!cards.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const clean = (s) => (s || "").replace(/\s+/g, " ").trim();
    const cells = [];
    cards.forEach((card) => {
      var _a, _b, _c, _d;
      const link = card.querySelector('a[href*="/match-centre/"], a[href]');
      const href = link ? link.getAttribute("href") : null;
      const competition = clean((_a = card.querySelector('.match-block-header_competitionName__zGBZm, [class*="competitionName"]')) == null ? void 0 : _a.textContent);
      const descr = clean((_b = card.querySelector('.match-block-header_competitionDescr__U5zLW, [class*="competitionDescr"]')) == null ? void 0 : _b.textContent);
      const dateTime = clean((_c = card.querySelector('.match-block-header_matchBlockHeader__aCPtF time, [class*="matchBlockHeader"] time')) == null ? void 0 : _c.textContent);
      const teamEls = Array.from(card.querySelectorAll('.match-block-team_team__77lf-, [class*="match-block-team_team__"]'));
      const teams = teamEls.map((t) => {
        var _a2, _b2;
        const name = clean((_a2 = t.querySelector('.match-block-team_teamName__aE4Nl, [class*="teamName"]')) == null ? void 0 : _a2.textContent);
        const score = clean((_b2 = t.querySelector('.match-team-score_score__K3bpY, [class*="match-team-score_score__"]')) == null ? void 0 : _b2.textContent);
        return { name, score };
      }).filter((t) => t.name);
      const statusTime = clean((_d = card.querySelector('.match-block-status_matchTime__gkWMU, [class*="matchTime__"]')) == null ? void 0 : _d.textContent);
      const imageCell = "";
      const textCell = document.createDocumentFragment();
      textCell.appendChild(document.createComment(" field:text "));
      const hasScore = teams.some((t) => t.score);
      const teamLine = teams.map((t) => hasScore && t.score ? `${t.name} ${t.score}` : t.name).join(hasScore ? " - " : " v ");
      if (teamLine) {
        const h = document.createElement("h3");
        if (href) {
          const a = document.createElement("a");
          a.setAttribute("href", href);
          a.textContent = teamLine;
          h.appendChild(a);
        } else {
          h.textContent = teamLine;
        }
        textCell.appendChild(h);
      }
      if (competition) {
        const p = document.createElement("p");
        p.textContent = competition;
        textCell.appendChild(p);
      }
      if (descr) {
        const p = document.createElement("p");
        p.textContent = descr;
        textCell.appendChild(p);
      }
      const timeText = [dateTime, !hasScore ? statusTime : ""].filter(Boolean).join(" \xB7 ");
      if (timeText) {
        const p = document.createElement("p");
        p.textContent = timeText;
        textCell.appendChild(p);
      }
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-match", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-moments.js
  function parse5(element, { document }) {
    const clean = (s) => (s || "").replace(/\s+/g, " ").trim();
    let cards = Array.from(element.querySelectorAll(
      'a[class*="clipCellContainer"], a[class*="clipCell"], a[class*="momentCell"], [class*="clipCellContainer"], a[href*="clips"], a[href*="stories"]'
    ));
    if (!cards.length) {
      cards = Array.from(element.querySelectorAll("a")).filter((a) => a.querySelector("img"));
    }
    if (!cards.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    cards.forEach((card) => {
      var _a, _b;
      const image = card.querySelector(
        'img[class*="Background"], img[class*="background"], img[class*="image_img"], .storyCell-WAKj5m img, picture img, img'
      );
      const badge = clean((_a = card.querySelector('[class*="badge"], [class*="Badge"], [class*="new"], [class*="New"]')) == null ? void 0 : _a.textContent);
      const caption = clean((_b = card.querySelector(
        '[class*="Title"], [class*="title"], [class*="caption"], [class*="Caption"], [class*="clipText"], [class*="storyTitle"]'
      )) == null ? void 0 : _b.textContent);
      const href = card.getAttribute("href");
      const imageCell = document.createDocumentFragment();
      imageCell.appendChild(document.createComment(" field:image "));
      if (image) imageCell.appendChild(image);
      const textCell = document.createDocumentFragment();
      textCell.appendChild(document.createComment(" field:text "));
      if (badge) {
        const b = document.createElement("p");
        b.textContent = badge;
        textCell.appendChild(b);
      }
      if (caption) {
        if (href) {
          const a = document.createElement("a");
          a.setAttribute("href", href);
          a.textContent = caption;
          const p = document.createElement("p");
          p.appendChild(a);
          textCell.appendChild(p);
        } else {
          const p = document.createElement("p");
          p.textContent = caption;
          textCell.appendChild(p);
        }
      }
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-moments", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-news.js
  function parse6(element, { document }) {
    const clean = (s) => (s || "").replace(/\s+/g, " ").trim();
    let articles = Array.from(element.querySelectorAll(
      'a[class*="newsCard"], a[class*="newsInline"], a[class*="smallCard"], a[href*="/articles/"], a[href*="/news/"]'
    ));
    if (!articles.length) {
      articles = Array.from(element.querySelectorAll("a")).filter((a) => clean(a.textContent) || a.querySelector("img"));
    }
    articles = articles.filter((a) => !articles.some((other) => other !== a && other.contains(a)));
    if (!articles.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    articles.forEach((article) => {
      var _a;
      const href = article.getAttribute("href");
      const image = article.querySelector('img[class*="image_img"], picture img, img');
      const headingEl = article.querySelector('h1, h2, h3, h4, [class*="itle"]');
      const roofline = clean((_a = article.querySelector('[class*="roofline"], [class*="Roofline"], [class*="eyebrow"]')) == null ? void 0 : _a.textContent);
      const headingText = clean(headingEl ? headingEl.textContent : article.textContent);
      const imageCell = document.createDocumentFragment();
      imageCell.appendChild(document.createComment(" field:image "));
      if (image) imageCell.appendChild(image);
      const textCell = document.createDocumentFragment();
      textCell.appendChild(document.createComment(" field:text "));
      if (roofline && roofline !== headingText) {
        const p = document.createElement("p");
        p.textContent = roofline;
        textCell.appendChild(p);
      }
      if (headingText) {
        const h = document.createElement("h3");
        if (href) {
          const a = document.createElement("a");
          a.setAttribute("href", href);
          a.textContent = headingText;
          h.appendChild(a);
        } else {
          h.textContent = headingText;
        }
        textCell.appendChild(h);
      }
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-news", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-promo.js
  function parse7(element, { document }) {
    const clean = (s) => (s || "").replace(/\s+/g, " ").trim();
    let tiles = Array.from(element.querySelectorAll(
      'a[class*="promoItem"], a[class*="itemBox"], a[class*="promoCard"], a[class*="topicCard"], a[href]'
    ));
    if (!tiles.length) {
      tiles = Array.from(element.querySelectorAll("a")).filter((a) => a.querySelector("img") || clean(a.textContent));
    }
    tiles = tiles.filter((a) => !tiles.some((other) => other !== a && other.contains(a)));
    if (!tiles.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    tiles.forEach((tile) => {
      const href = tile.getAttribute("href");
      const image = tile.querySelector('img[class*="image_img"], picture img, img');
      const labelEl = tile.querySelector('[class*="itemTitle"], [class*="label"], [class*="Label"], [class*="itle"], h1, h2, h3, h4, span');
      const label = clean(labelEl ? labelEl.textContent : tile.textContent);
      const imageCell = document.createDocumentFragment();
      imageCell.appendChild(document.createComment(" field:image "));
      if (image) imageCell.appendChild(image);
      const textCell = document.createDocumentFragment();
      textCell.appendChild(document.createComment(" field:text "));
      if (label) {
        if (href) {
          const a = document.createElement("a");
          a.setAttribute("href", href);
          a.textContent = label;
          const p = document.createElement("p");
          p.appendChild(a);
          textCell.appendChild(p);
        } else {
          const p = document.createElement("p");
          p.textContent = label;
          textCell.appendChild(p);
        }
      }
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-promo", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/embed-external.js
  function parse8(element, { document }) {
    const iframe = element.querySelector("iframe[src]");
    const dataEl = element.querySelector("[data-src], [data-url], [data-embed-url], [data-embed]");
    const link = element.querySelector('a[href^="http"], a[href]');
    let uri = "";
    if (iframe) uri = iframe.getAttribute("src");
    else if (dataEl) uri = dataEl.getAttribute("data-src") || dataEl.getAttribute("data-url") || dataEl.getAttribute("data-embed-url") || dataEl.getAttribute("data-embed");
    else if (link) uri = link.getAttribute("href");
    const image = element.querySelector('img[class*="image_img"], picture img, img');
    if (!uri && !image) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cell = document.createDocumentFragment();
    if (image) {
      cell.appendChild(document.createComment(" field:embed_placeholder "));
      cell.appendChild(image);
    }
    if (uri) {
      cell.appendChild(document.createComment(" field:embed_uri "));
      const a = document.createElement("a");
      a.setAttribute("href", uri);
      a.textContent = uri;
      cell.appendChild(a);
    }
    const cells = [[cell]];
    const block = WebImporter.Blocks.createBlock(document, { name: "embed-external", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-banner.js
  function parse9(element, { document }) {
    const clean = (s) => (s || "").replace(/\s+/g, " ").trim();
    const image = element.querySelector(
      'img[class*="background"], img[class*="Background"], img[class*="banner"], img[class*="image_img"], picture img, img'
    );
    const heading = element.querySelector('h1, h2, h3, [class*="itle"], [class*="headline"], [class*="Headline"]');
    const copy = element.querySelector('p[class*="description"], p[class*="copy"], p[class*="body"], p[class*="text"], p');
    const cta = element.querySelector('a[class*="btn"], a[class*="cta"], a[class*="Cta"], a[class*="button"], a[href]');
    if (!image && !heading && !copy && !cta) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(" field:image "));
    if (image) imageCell.appendChild(image);
    cells.push([imageCell]);
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(" field:text "));
    if (heading) {
      const h = document.createElement("h2");
      h.textContent = clean(heading.textContent);
      textCell.appendChild(h);
    }
    if (copy) {
      const copyText = clean(copy.textContent);
      if (copyText && (!heading || copyText !== clean(heading.textContent))) {
        const p = document.createElement("p");
        p.textContent = copyText;
        textCell.appendChild(p);
      }
    }
    if (cta) {
      const href = cta.getAttribute("href");
      const ctaText = clean(cta.textContent);
      if (href && ctaText) {
        const a = document.createElement("a");
        a.setAttribute("href", href);
        a.textContent = ctaText;
        const p = document.createElement("p");
        p.appendChild(a);
        textCell.appendChild(p);
      }
    }
    cells.push([textCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/table-ranking.js
  function parse10(element, { document }) {
    const clean = (s) => (s || "").replace(/\s+/g, " ").trim();
    let rows = Array.from(element.querySelectorAll(
      '[class*="tableRow"], [class*="rankingRow"], [class*="rankRow"], tr, li[class*="row"]'
    ));
    rows = rows.filter((r) => clean(r.textContent) || r.querySelector("img"));
    if (!rows.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const FIELDS = ["column1text", "column2text", "column3text", "column4text"];
    const buildRow = (rank, movement, teamFlag, teamName, points) => {
      const values = [rank, movement, null, points];
      const rankCell = makeTextCell(FIELDS[0], rank);
      const moveCell = makeTextCell(FIELDS[1], movement);
      const teamCell = document.createDocumentFragment();
      let teamHasContent = false;
      if (teamFlag || teamName) {
        teamCell.appendChild(document.createComment(` field:${FIELDS[2]} `));
        if (teamFlag) {
          teamCell.appendChild(teamFlag);
          teamHasContent = true;
        }
        if (teamName) {
          const span = document.createElement("span");
          span.textContent = teamName;
          teamCell.appendChild(span);
          teamHasContent = true;
        }
      }
      const teamCellFinal = teamHasContent ? teamCell : "";
      const pointsCell = makeTextCell(FIELDS[3], points);
      return [rankCell, moveCell, teamCellFinal, pointsCell];
    };
    function makeTextCell(field, text) {
      if (!text) return "";
      const frag = document.createDocumentFragment();
      frag.appendChild(document.createComment(` field:${field} `));
      const span = document.createElement("span");
      span.textContent = text;
      frag.appendChild(span);
      return frag;
    }
    const cells = [];
    rows.forEach((row) => {
      var _a, _b, _c, _d;
      const rank = clean((_a = row.querySelector('[class*="rank"], [class*="Rank"], [class*="position"], [class*="Position"]')) == null ? void 0 : _a.textContent);
      const movement = clean((_b = row.querySelector('[class*="movement"], [class*="Movement"], [class*="change"], [class*="Change"], [class*="trend"]')) == null ? void 0 : _b.textContent);
      const teamFlag = row.querySelector('img[class*="flag"], img[class*="Flag"], img[class*="image_img"], picture img, img');
      const teamName = clean((_c = row.querySelector('[class*="teamName"], [class*="TeamName"], [class*="team"], [class*="Team"], [class*="name"]')) == null ? void 0 : _c.textContent);
      const points = clean((_d = row.querySelector('[class*="point"], [class*="Point"], [class*="score"], [class*="Score"]')) == null ? void 0 : _d.textContent);
      cells.push(buildRow(rank, movement, teamFlag, teamName, points));
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "table-ranking", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/fifa-cleanup.js
  var TransformHook = {
    beforeTransform: "beforeTransform",
    afterTransform: "afterTransform"
  };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        // Promotional pop-up overlay (Netflix WC26 game) - cleaned.html line 3
        '[class*="pop-up_blurBackground"]',
        // OneTrust cookie consent banner
        "#onetrust-consent-sdk",
        "#onetrust-banner-sdk",
        // Ad slot skeleton loaders - cleaned.html: ad-skeleton-section_section__WwE2G
        '[class*="ad-skeleton-section"]',
        // Lazy-load skeleton placeholders - cleaned.html: box-skeleton_box__x-ik2
        '[class*="box-skeleton"]',
        // Storyteller player modal overlay (opens on story tap)
        "#storyteller-player-stories"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header",
        "nav",
        '[class*="global-menu_globalMenu"]',
        // Footer chrome (download-app / copyright / logos) - not authorable page content
        '[class*="footer-skeleton-section"]',
        "footer",
        // Leftover non-authorable elements
        "iframe",
        "link",
        "noscript",
        "source"
      ]);
      element.querySelectorAll("*").forEach((el) => {
        el.removeAttribute("onclick");
        el.removeAttribute("data-track");
        el.removeAttribute("data-testid");
      });
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "hero-promo": parse,
    "carousel-stories": parse2,
    "carousel-spotlight": parse3,
    "cards-match": parse4,
    "cards-moments": parse5,
    "cards-news": parse6,
    "cards-promo": parse7,
    "embed-external": parse8,
    "hero-banner": parse9,
    "table-ranking": parse10
  };
  var transformers = [
    transform
  ];
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "FIFA homepage - hero preview carousel, spotlight/news cards, story rail, and content sections",
    urls: [
      "https://www.fifa.com/en"
    ],
    blocks: [
      { name: "hero-promo", instances: ["main > div > div:nth-of-type(1)"] },
      { name: "carousel-stories", instances: ["main > div > div:nth-of-type(2)"] },
      { name: "carousel-spotlight", instances: ["main > div > div:nth-of-type(3)"], section: "dark" },
      { name: "cards-match", instances: ["main > div > div:nth-of-type(5)"] },
      { name: "cards-moments", instances: ["main > div > div:nth-of-type(6)"] },
      { name: "cards-news", instances: ["main > div > div:nth-of-type(7)", "main > div > div:nth-of-type(15)"] },
      { name: "cards-promo", instances: ["main > div > div:nth-of-type(8)", "main > div > div:nth-of-type(16)"] },
      { name: "embed-external", instances: ["main > div > div:nth-of-type(9)"] },
      { name: "hero-banner", instances: ["main > div > div:nth-of-type(11)", "main > div > div:nth-of-type(13)"] },
      { name: "table-ranking", instances: ["main > div > div:nth-of-type(14)"] }
    ],
    sections: [
      {
        id: "section-3",
        name: "Hero Spotlight + Preview Carousel",
        selector: "main > div > div:nth-of-type(3)",
        style: "dark",
        blocks: ["carousel-spotlight"],
        defaultContent: []
      }
    ]
  };
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    /**
     * Runs in the browser before transform. FIFA's homepage lazy-loads
     * below-the-fold sections (Top stories, Experience, hero banners, World
     * Rankings, Inside FIFA, What FIFA does) only after they scroll into view.
     * Scroll the full page and wait for skeleton loaders to resolve so those
     * sections are hydrated before parsing.
     */
    onLoad: (_0) => __async(void 0, [_0], function* ({ document }) {
      const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
      const step = Math.round((window.innerHeight || 900) * 0.8);
      const maxScrolls = 60;
      for (let i = 0; i < maxScrolls; i += 1) {
        window.scrollTo(0, step * i);
        yield sleep(350);
        if (step * i > document.body.scrollHeight) break;
      }
      window.scrollTo(0, document.body.scrollHeight);
      yield sleep(1500);
      for (let i = 0; i < 20; i += 1) {
        if (!document.querySelector('[class*="skeleton"]')) break;
        yield sleep(500);
      }
      window.scrollTo(0, 0);
      yield sleep(500);
      document.querySelectorAll("img").forEach((img) => {
        if ((!img.getAttribute("src") || img.getAttribute("src").trim() === "") && img.currentSrc) {
          img.setAttribute("src", img.currentSrc);
        }
      });
    }),
    transform: (payload) => {
      const {
        document,
        url,
        html,
        params
      } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
