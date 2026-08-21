// public.js
// Ye script sabhi public (user-side) pages me include hai.
// Admin panel me jo bhi edit/upload hota hai, wahi yahan se fetch hoke dikhta hai.

// Live server pe deploy karte waqt yahi line badal dena, jaise:
// const API_BASE = 'http://103.21.58.193:5000';
const API_BASE = 'http://localhost:5000';

function imgUrl(p) {
  if (!p) return '';
  return API_BASE + p;
}

// Basic HTML escape - DB se aaya text safely dikhane ke liye
function esc(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function fmtDate(d) {
  if (!d) return '';
  const dt = new Date(d);
  if (isNaN(dt)) return '';
  return dt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ---------------- SITE SETTINGS (hero, stats, about, footer) ----------------
async function loadSettings() {
  try {
    const s = await fetch(API_BASE + '/api/settings').then(r => r.json());

    setText('dynHeroTitle', s.hero_title);
    setText('dynHeroLead', s.hero_lead);
    setText('dynQuoteText', '\u201C' + (s.quote_text || '') + '\u201D');
    setText('dynQuoteAuthor', '\u2014 ' + (s.quote_author || ''));

    for (let i = 1; i <= 4; i++) {
      setText('dynStat' + i + 'Num', s['stat' + i + '_num']);
      setText('dynStat' + i + 'Label', s['stat' + i + '_label']);
    }

    setText('dynAboutHeading', s.about_heading);
    setText('dynAboutDesc', s.about_desc);

    // Footer (all pages)
    setText('dynAddress', s.address);
    setText('dynEmail', s.email);
    setText('dynPhone', s.phone);
    // Contact page's own info box
    setText('dynAddress2', s.address);
    setText('dynEmail2', s.email);
    setText('dynPhone2', s.phone);

    setLink('dynFacebook', s.facebook_url);
    setLink('dynTwitter', s.twitter_url);
    setLink('dynInstagram', s.instagram_url);
  } catch (err) {
    console.error('Settings load nahi hui:', err);
  }
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el && value !== undefined && value !== null && value !== '') el.textContent = value;
}
function setLink(id, url) {
  const el = document.getElementById(id);
  if (el && url) el.href = url;
}

// ---------------- BOARD MEMBERS ----------------
function boardCardHTML(m) {
  const initials = (m.name || '').split(' ').filter(Boolean).map(w => w[0]).join('').substring(0, 2).toUpperCase();
  const photoImg = m.photo
    ? `<img src="${imgUrl(m.photo)}" alt="${esc(m.name)}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;">`
    : '';
  return `
    <div class="board-card">
      <div class="board-photo" data-initials="${m.photo ? '' : initials}">${photoImg}</div>
      <h4>${esc(m.name)}</h4>
      <div class="role">${esc(m.role)}</div>
    </div>`;
}

async function loadBoard() {
  const previewEl = document.getElementById('dynBoardPreview'); // index.html (4 tak)
  const fullEl = document.getElementById('dynBoardFull');       // board.html (sab)
  if (!previewEl && !fullEl) return;
  try {
    const members = await fetch(API_BASE + '/api/board').then(r => r.json());
    if (previewEl) previewEl.innerHTML = members.slice(0, 4).map(boardCardHTML).join('');
    if (fullEl) fullEl.innerHTML = members.map(boardCardHTML).join('');
  } catch (err) {
    console.error('Board load nahi hui:', err);
  }
}

// ---------------- GALLERY ----------------
function galleryItemHTML(g) {
  return `
    <div class="gallery-item ${esc(g.tint || 'tint-navy')}" data-category="${esc(g.category || '')}">
      <img src="${imgUrl(g.image)}" alt="${esc(g.caption)}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0;">
      <span class="cap">${esc(g.caption)}</span>
    </div>`;
}

async function loadGallery() {
  const stripEl = document.getElementById('dynGalleryStrip'); // index.html (4 tak)
  const fullEl = document.getElementById('dynGalleryFull');   // gallery.html (sab)
  if (!stripEl && !fullEl) return;
  try {
    const items = await fetch(API_BASE + '/api/gallery').then(r => r.json());
    if (stripEl) stripEl.innerHTML = items.slice(0, 4).map(galleryItemHTML).join('');
    if (fullEl) fullEl.innerHTML = items.map(galleryItemHTML).join('');
  } catch (err) {
    console.error('Gallery load nahi hui:', err);
  }
}

// ---------------- NEWS ----------------
async function loadNews() {
  const previewEl = document.getElementById('dynNewsPreview'); // index.html (3 tak)
  const fullEl = document.getElementById('dynNewsFull');       // news.html (sab)
  if (!previewEl && !fullEl) return;
  try {
    const items = await fetch(API_BASE + '/api/news').then(r => r.json());

    if (previewEl) {
      previewEl.innerHTML = items.slice(0, 3).map(n => `
        <a class="news-row" href="news.html">
          <div class="news-date">${fmtDate(n.news_date)}</div>
          <h4>${esc(n.title)}</h4>
          <div class="news-arrow">&rarr;</div>
        </a>`).join('');
    }

    if (fullEl) {
      fullEl.innerHTML = items.map(n => `
        <div class="news-full-row">
          <div class="news-date">${fmtDate(n.news_date)}</div>
          <div>
            <h3>${esc(n.title)}</h3>
            <p>${esc(n.content)}</p>
          </div>
        </div>`).join('');
    }
  } catch (err) {
    console.error('News load nahi hui:', err);
  }
}

// ---------------- PROGRAMS ----------------
async function loadPrograms() {
  const containers = document.querySelectorAll('.dyn-programs');
  if (!containers.length) return;
  try {
    const items = await fetch(API_BASE + '/api/programs').then(r => r.json());
    const html = items.map(p => `
      <div class="program-row reveal in">
        <div class="alt">${esc(p.stage)}</div>
        <div class="program-marker"></div>
        <div class="program-body">
          <h3>${esc(p.title)}</h3>
          <p>${esc(p.description)}</p>
        </div>
      </div>`).join('');
    containers.forEach(el => { el.innerHTML = html; });
  } catch (err) {
    console.error('Programs load nahi hui:', err);
  }
}

// ---------------- RUN ----------------
loadSettings();
loadBoard();
loadGallery();
loadNews();
loadPrograms();