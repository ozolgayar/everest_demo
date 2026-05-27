// LongreadBlock.js
// Рендер лонгрид-сцены из JSON-данных.
// Поддерживает 16 типов блоков + иконки-плитки (SVG).

const ICONS_PATH = 'shared/assets/icons/';

// Дефолтные иконки по типу/варианту блока
const DEFAULT_ICONS = {
  callout: {
    insight: 'icon-bulb',
    info: 'icon-info',
    success: 'icon-check-circle',
    default: 'icon-info',
  },
  warning: 'icon-warning',
  quote: 'icon-quote',
  'pull-quote': 'icon-quote',
  definition: 'icon-book',
  example: 'icon-pin',
  stats: 'icon-target',
  steps: 'icon-list',
};

function get(obj, key, fallback = '') {
  return (obj && obj[key] != null) ? obj[key] : fallback;
}

// Возвращает <img>-тег для иконки или пустую строку
function renderIcon(iconName, altText = '') {
  if (!iconName) return '';
  const src = `${ICONS_PATH}${iconName}.svg`;
  return `<img class="lr-icon" src="${src}" alt="${altText}" />`;
}

// Определяет иконку для блока: явно указанная > дефолт по варианту > дефолт по типу
function resolveIcon(block) {
  if (block.icon) return block.icon;
  const typeDefaults = DEFAULT_ICONS[block.type];
  if (!typeDefaults) return null;
  if (typeof typeDefaults === 'string') return typeDefaults;
  const variant = block.variant || 'default';
  return typeDefaults[variant] || typeDefaults.default || null;
}

// --- Рендеры блоков ---

function renderHeading(b) {
  const level = b.level || 2;
  return `<h${level} class="lr-heading lr-h${level}">${b.text}</h${level}>`;
}

function renderLead(b) {
  return `<p class="lr-lead">${b.text}</p>`;
}

function renderParagraph(b) {
  return `<p class="lr-paragraph">${b.text}</p>`;
}

function renderCallout(b) {
  const variant = b.variant || 'info';
  const icon = resolveIcon(b);
  const title = b.title ? `<div class="lr-callout__title">${b.title}</div>` : '';
  return `
    <div class="lr-callout lr-callout--${variant}">
      ${renderIcon(icon, variant)}
      <div class="lr-callout__body">
        ${title}
        <div class="lr-callout__text">${b.text}</div>
      </div>
    </div>`;
}

function renderWarning(b) {
  const icon = resolveIcon(b);
  const title = b.title ? `<div class="lr-warning__title">${b.title}</div>` : '';
  return `
    <div class="lr-warning">
      ${renderIcon(icon, 'warning')}
      <div class="lr-warning__body">
        ${title}
        <div class="lr-warning__text">${b.text}</div>
      </div>
    </div>`;
}

function renderQuote(b) {
  const icon = resolveIcon(b);
  const author = b.author ? `<div class="lr-quote__author">— ${b.author}</div>` : '';
  return `
    <blockquote class="lr-quote">
      ${renderIcon(icon, 'quote')}
      <div class="lr-quote__body">
        <div class="lr-quote__text">${b.text}</div>
        ${author}
      </div>
    </blockquote>`;
}

function renderPullQuote(b) {
  return `<div class="lr-pull-quote">${b.text}</div>`;
}

function renderDefinition(b) {
  const icon = resolveIcon(b);
  return `
    <div class="lr-definition">
      ${renderIcon(icon, 'definition')}
      <div class="lr-definition__body">
        <div class="lr-definition__term">${b.term}</div>
        <div class="lr-definition__meaning">${b.meaning}</div>
      </div>
    </div>`;
}

function renderExample(b) {
  const icon = resolveIcon(b);
  return `
    <div class="lr-example">
      ${renderIcon(icon, 'example')}
      <div class="lr-example__body">
        ${b.title ? `<div class="lr-example__title">${b.title}</div>` : ''}
        <div class="lr-example__text">${b.text}</div>
      </div>
    </div>`;
}

function renderList(b) {
  const tag = b.ordered ? 'ol' : 'ul';
  const items = (b.items || []).map(i => `<li>${i}</li>`).join('');
  return `<${tag} class="lr-list">${items}</${tag}>`;
}

function renderSteps(b) {
  const icon = resolveIcon(b);
  const items = (b.items || []).map((it, i) => `
    <li class="lr-steps__item">
      <span class="lr-steps__num">${i + 1}</span>
      <div class="lr-steps__text">
        ${it.title ? `<strong>${it.title}</strong> ` : ''}${it.text || it}
      </div>
    </li>`).join('');
  return `
    <div class="lr-steps-wrap">
      ${renderIcon(icon, 'steps')}
      <ol class="lr-steps">${items}</ol>
    </div>`;
}

function renderStats(b) {
  const icon = resolveIcon(b);
  return `
    <div class="lr-stats">
      ${renderIcon(icon, 'stats')}
      <div class="lr-stats__body">
        <div class="lr-stats__value">${b.value}</div>
        <div class="lr-stats__label">${b.label}</div>
      </div>
    </div>`;
}

function renderFormula(b) {
  return `<div class="lr-formula">${b.text}</div>`;
}

function renderComparison(b) {
  const left = b.left || {};
  const right = b.right || {};
  return `
    <div class="lr-comparison">
      <div class="lr-comparison__col lr-comparison__col--left">
        <div class="lr-comparison__title">${left.title || ''}</div>
        <div class="lr-comparison__text">${left.text || ''}</div>
      </div>
      <div class="lr-comparison__col lr-comparison__col--right">
        <div class="lr-comparison__title">${right.title || ''}</div>
        <div class="lr-comparison__text">${right.text || ''}</div>
      </div>
    </div>`;
}

function renderAccordion(b) {
  const items = (b.items || []).map(it => `
    <details class="lr-accordion__item">
      <summary>${it.q}</summary>
      <div class="lr-accordion__answer">${it.a}</div>
    </details>`).join('');
  return `<div class="lr-accordion">${items}</div>`;
}

function renderSketchbook(b) {
  return `
    <div class="lr-sketchbook">
      ${b.title ? `<div class="lr-sketchbook__title">${b.title}</div>` : ''}
      <div class="lr-sketchbook__text">${b.text}</div>
    </div>`;
}

function renderImage(b) {
  const caption = b.caption ? `<div class="lr-image__caption">${b.caption}</div>` : '';
  return `
    <figure class="lr-image">
      <img src="${b.src}" alt="${b.alt || ''}" />
      ${caption}
    </figure>`;
}

function renderDivider() {
  return `<hr class="lr-divider" />`;
}

// --- Главный диспетчер ---

const RENDERERS = {
  heading: renderHeading,
  lead: renderLead,
  paragraph: renderParagraph,
  callout: renderCallout,
  warning: renderWarning,
  quote: renderQuote,
  'pull-quote': renderPullQuote,
  definition: renderDefinition,
  example: renderExample,
  list: renderList,
  steps: renderSteps,
  stats: renderStats,
  formula: renderFormula,
  comparison: renderComparison,
  accordion: renderAccordion,
  sketchbook: renderSketchbook,
  image: renderImage,
  divider: renderDivider,
};

function renderBlock(block) {
  const renderer = RENDERERS[block.type];
  if (!renderer) {
    console.warn(`[LongreadBlock] Unknown block type: ${block.type}`);
    return '';
  }
  return renderer(block);
}

export function renderLongread(scene, container) {
  if (!scene || !Array.isArray(scene.blocks)) {
    console.error('[LongreadBlock] Invalid scene data');
    return;
  }
  const accent = scene.accentColor || 'teal';
  const bg = scene.background || 'cream';
  container.classList.add('lr-root', `lr-accent--${accent}`, `lr-bg--${bg}`);
  container.innerHTML = scene.blocks.map(renderBlock).join('\n');
}