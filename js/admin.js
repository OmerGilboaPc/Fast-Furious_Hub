import { db, doc, getDoc, setDoc, collection, addDoc, deleteDoc, updateDoc, onSnapshot, query, orderBy } from './firebase-config.js';
import { seedDatabase } from './seed.js';

const ADMIN_PASSWORD = 'OmerAdmin7!';

// ── Auth ──────────────────────────────────────────────────────────────────────
const loginScreen = document.getElementById('admin-login-screen');
const adminApp = document.getElementById('admin-app');

document.getElementById('admin-login-btn').addEventListener('click', tryLogin);
document.addEventListener('keydown', e => { if (e.key === 'Enter' && !loginScreen.classList.contains('hidden')) tryLogin(); });

function tryLogin() {
  const pw = document.getElementById('admin-password-input').value;
  if (pw === ADMIN_PASSWORD) {
    document.getElementById('admin-login-error').classList.add('hidden');
    loginScreen.classList.add('hidden');
    adminApp.classList.remove('hidden');
    initAdmin();
  } else {
    document.getElementById('admin-login-error').classList.remove('hidden');
  }
}

// ── State ─────────────────────────────────────────────────────────────────────
let S = {};
let DATA = { movies:[], characters:[], cars:[], quotes:[], news:[], paulTimeline:[], paulFilmography:[], paulQuotes:[] };
let activeSection = 'general';

function initAdmin() {
  onSnapshot(doc(db,'settings','general'), snap => { S = snap.data()||{}; if (activeSection.startsWith('settings') || activeSection === 'general' || activeSection === 'pages' || activeSection === 'paul') renderSection(); });
  const cols = ['movies','characters','cars','quotes','news','paulTimeline','paulFilmography','paulQuotes'];
  cols.forEach(col => {
    onSnapshot(query(collection(db,col), orderBy('order')), snap => {
      DATA[col] = snap.docs.map(d=>({id:d.id,...d.data()}));
      renderSection();
    });
  });
  renderSection();
}

// ── Sidebar nav ───────────────────────────────────────────────────────────────
document.querySelectorAll('.admin-nav-item[data-section]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.admin-nav-item').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeSection = btn.dataset.section;
    document.getElementById('admin-topbar-title').textContent = btn.textContent.trim();
    renderSection();
  });
});

// ── Render Section ────────────────────────────────────────────────────────────
function renderSection() {
  const el = document.getElementById('admin-section-content');
  switch(activeSection) {
    case 'general': el.innerHTML = renderSettingsGeneral(); bindSettings(); break;
    case 'pages':   el.innerHTML = renderSettingsPages(); bindSettings(); break;
    case 'paul':    el.innerHTML = renderSettingsPaul(); bindSettings(); break;
    case 'movies':      el.innerHTML = renderCollection('movies', movieFields()); bindCollection('movies', movieFields()); break;
    case 'characters':  el.innerHTML = renderCollection('characters', charFields()); bindCollection('characters', charFields()); break;
    case 'cars':        el.innerHTML = renderCollection('cars', carFields()); bindCollection('cars', carFields()); break;
    case 'quotes':      el.innerHTML = renderCollection('quotes', quoteFields()); bindCollection('quotes', quoteFields()); break;
    case 'news':        el.innerHTML = renderCollection('news', newsFields()); bindCollection('news', newsFields()); break;
    case 'paulTimeline':    el.innerHTML = renderCollection('paulTimeline', tlFields()); bindCollection('paulTimeline', tlFields()); break;
    case 'paulFilmography': el.innerHTML = renderCollection('paulFilmography', filmoFields()); bindCollection('paulFilmography', filmoFields()); break;
    case 'paulQuotes':      el.innerHTML = renderCollection('paulQuotes', pqFields()); bindCollection('paulQuotes', pqFields()); break;
    case 'db': el.innerHTML = renderDB(); bindDB(); break;
  }
}

// ── Settings ──────────────────────────────────────────────────────────────────
function settingsCard(title, fields) {
  return `<div class="admin-section-card">
    <div class="admin-section-header"><h3>${title}</h3><button class="admin-save-btn settings-save-btn">💾 Save Changes</button></div>
    <div class="admin-section-body">
      <div class="admin-grid-2">
        ${fields.map(f => `
          <div class="admin-field${f.full?' full-width':''}">
            <label>${f.label}</label>
            ${f.type==='textarea'
              ? `<textarea class="admin-textarea" data-key="${f.key}" style="min-height:${f.tall?200:80}px">${S[f.key]||''}</textarea>`
              : f.type==='color'
              ? `<div class="color-row"><input type="color" value="${S[f.key]||'#E8381A'}" data-key="${f.key}-picker" style="width:36px;height:36px;border:none;cursor:pointer"><input class="admin-input" data-key="${f.key}" value="${S[f.key]||''}"><div class="color-preview" style="background:${S[f.key]||'#E8381A'}"></div></div>`
              : `<input class="admin-input" data-key="${f.key}" value="${(S[f.key]||'').replace(/"/g,'&quot;')}" placeholder="${f.placeholder||''}">`
            }
          </div>`).join('')}
      </div>
    </div>
  </div>`;
}

function renderSettingsGeneral() {
  return settingsCard('🌐 General — Name & Branding', [
    {key:'siteName',label:'Site Name'},
    {key:'primaryColor',label:'Primary Color',type:'color'},
    {key:'heroTitle',label:'Hero Title'},
    {key:'heroSubtitle',label:'Hero Subtitle',full:true},
    {key:'heroCta1',label:'Button 1'},
    {key:'heroCta2',label:'Button 2'},
    {key:'statsMovies',label:'Movies Count'},
    {key:'statsCharacters',label:'Characters Count'},
    {key:'statsCars',label:'Cars Count'},
    {key:'statsQuotes',label:'Quotes Count'},
    {key:'footerDesc',label:'Footer Description',full:true},
    {key:'footerQuote',label:'Footer Quote',full:true},
    {key:'footerQuoteAuthor',label:'Footer Quote Author'},
    {key:'footerCredit',label:'Credits Line',full:true},
  ]);
}

function renderSettingsPages() {
  return [
    settingsCard('🎬 Movies Page', [{key:'moviesPageSubtitle',label:'Label'},{key:'moviesPageTitle',label:'Title'},{key:'moviesPageDesc',label:'Description',full:true}]),
    settingsCard('👥 Characters Page', [{key:'charactersPageSubtitle',label:'Label'},{key:'charactersPageTitle',label:'Title'},{key:'charactersPageDesc',label:'Description',full:true}]),
    settingsCard('🚗 Cars Page', [{key:'carsPageSubtitle',label:'Label'},{key:'carsPageTitle',label:'Title'},{key:'carsPageDesc',label:'Description',full:true}]),
    settingsCard('💬 Quotes Page', [{key:'quotesPageSubtitle',label:'Label'},{key:'quotesPageTitle',label:'Title'},{key:'quotesPageDesc',label:'Description',full:true}]),
    settingsCard('📰 News Page', [{key:'newsPageSubtitle',label:'Label'},{key:'newsPageTitle',label:'Title'},{key:'newsPageDesc',label:'Description',full:true}]),
  ].join('');
}

function renderSettingsPaul() {
  return [
    settingsCard('❤️ Hero', [{key:'paulWalkerDates',label:'Dates'},{key:'paulWalkerSubtitle',label:'Subtitle',full:true},{key:'paulWalkerHeroQuote',label:'Strip Quote',full:true},{key:'paulWalkerHeroQuoteSource',label:'Source'}]),
    settingsCard('📝 Biography', [{key:'paulWalkerBio',label:'Biography (separate paragraphs with blank line)',full:true,type:'textarea',tall:true}]),
    settingsCard('🌍 ROWW', [{key:'rowwTitle',label:'Title'},{key:'rowwDesc',label:'Description',full:true,type:'textarea'}]),
  ].join('');
}

function bindSettings() {
  document.querySelectorAll('.settings-save-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const card = btn.closest('.admin-section-card');
      const updates = {};
      card.querySelectorAll('[data-key]').forEach(el => { updates[el.dataset.key] = el.value; });
      btn.textContent = '...'; btn.disabled = true;
      await setDoc(doc(db,'settings','general'), updates, {merge:true});
      btn.textContent = '✅ Saved!'; btn.disabled = false;
      setTimeout(() => { btn.textContent = '💾 Save Changes'; }, 2000);
    });
  });
  document.querySelectorAll('[data-key$="-picker"]').forEach(picker => {
    const key = picker.dataset.key.replace('-picker','');
    picker.addEventListener('input', () => {
      const input = document.querySelector(`[data-key="${key}"]`);
      if (input) input.value = picker.value;
      const preview = picker.parentElement.querySelector('.color-preview');
      if (preview) preview.style.background = picker.value;
    });
  });
}

// ── Collections ───────────────────────────────────────────────────────────────
function movieFields()  { return [{key:'order',label:'Order'},{key:'year',label:'Year'},{key:'title',label:'Title',full:true},{key:'director',label:'Director'},{key:'image',label:'Poster URL',full:true}]; }
function charFields()   { return [{key:'order',label:'Order'},{key:'name',label:'Name'},{key:'actor',label:'Actor'},{key:'image',label:'Image URL',full:true}]; }
function carFields()    { return [{key:'order',label:'Order'},{key:'name',label:'Car Name',full:true},{key:'model',label:'Model'},{key:'hp',label:'Horsepower'},{key:'driver',label:'Driver'},{key:'image',label:'Image URL',full:true}]; }
function quoteFields()  { return [{key:'order',label:'Order'},{key:'text',label:'Quote',full:true},{key:'character',label:'Character'},{key:'movie',label:'Movie'}]; }
function newsFields()   { return [{key:'order',label:'Order'},{key:'category',label:'Category'},{key:'date',label:'Date'},{key:'title',label:'Title',full:true},{key:'subtitle',label:'Subtitle',full:true},{key:'body',label:'Body',full:true,type:'textarea'},{key:'image',label:'Image URL',full:true}]; }
function tlFields()     { return [{key:'order',label:'Order'},{key:'year',label:'Year'},{key:'text',label:'Description',full:true}]; }
function filmoFields()  { return [{key:'order',label:'Order'},{key:'movie',label:'Movie'},{key:'year',label:'Year'},{key:'role',label:'Role'}]; }
function pqFields()     { return [{key:'order',label:'Order'},{key:'text',label:'Quote',full:true},{key:'author',label:'Author'}]; }

function renderCollection(colName, fields) {
  const items = DATA[colName] || [];
  return `<div class="admin-section-card">
    <div class="admin-section-header"><h3>${colName}</h3></div>
    <div class="admin-section-body">
      <div id="items-list">
        ${items.map(item => renderItemCard(item, fields, colName)).join('')}
      </div>
      <button class="admin-add-btn" id="add-new-btn">➕ Add Item</button>
      <div id="new-item-form" class="hidden admin-item-card new-item" style="margin-top:12px">
        <div style="font-family:var(--font-display);font-weight:700;font-size:13px;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:12px">➕ New Item</div>
        <div class="admin-grid-2">
          ${fields.map(f=>`<div class="admin-field${f.full?' full-width':''}"><label>${f.label}</label>${f.type==='textarea'?`<textarea class="admin-textarea" data-newkey="${f.key}"></textarea>`:`<input class="admin-input" data-newkey="${f.key}" value="">`}</div>`).join('')}
        </div>
        <div class="admin-item-actions">
          <button class="admin-cancel-btn" id="cancel-new-btn">Cancel</button>
          <button class="admin-save-btn" id="confirm-new-btn">✅ Add</button>
        </div>
      </div>
    </div>
  </div>`;
}

function renderItemCard(item, fields, colName) {
  return `<div class="admin-item-card" data-id="${item.id}" data-col="${colName}">
    <div class="admin-grid-2">
      ${fields.map(f=>`<div class="admin-field${f.full?' full-width':''}"><label>${f.label}</label>${f.type==='textarea'?`<textarea class="admin-textarea" data-field="${f.key}">${item[f.key]||''}</textarea>`:`<input class="admin-input" data-field="${f.key}" value="${(item[f.key]||'').toString().replace(/"/g,'&quot;')}">`}</div>`).join('')}
    </div>
    <div class="admin-item-actions">
      <button class="admin-delete-btn item-delete-btn">🗑 Delete</button>
      <button class="admin-save-btn item-save-btn">💾 Save</button>
    </div>
  </div>`;
}

function bindCollection(colName, fields) {
  document.querySelectorAll('.item-save-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const card = btn.closest('.admin-item-card');
      const id = card.dataset.id;
      const updates = {};
      card.querySelectorAll('[data-field]').forEach(el => { updates[el.dataset.field] = el.value; });
      btn.textContent = '...'; btn.disabled = true;
      await updateDoc(doc(db, colName, id), updates);
      btn.textContent = '✅'; btn.disabled = false;
      setTimeout(() => { btn.textContent = '💾 Save'; }, 1500);
    });
  });
  document.querySelectorAll('.item-delete-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (!confirm('Delete this item?')) return;
      const id = btn.closest('.admin-item-card').dataset.id;
      await deleteDoc(doc(db, colName, id));
    });
  });
  document.getElementById('add-new-btn').addEventListener('click', () => {
    document.getElementById('new-item-form').classList.remove('hidden');
    document.getElementById('add-new-btn').classList.add('hidden');
  });
  document.getElementById('cancel-new-btn').addEventListener('click', () => {
    document.getElementById('new-item-form').classList.add('hidden');
    document.getElementById('add-new-btn').classList.remove('hidden');
  });
  document.getElementById('confirm-new-btn').addEventListener('click', async () => {
    const newData = { order: (DATA[colName]?.length||0) + 1 };
    document.querySelectorAll('[data-newkey]').forEach(el => { newData[el.dataset.newkey] = el.value; });
    await addDoc(collection(db, colName), newData);
  });
}

// ── DB Tools ──────────────────────────────────────────────────────────────────
function renderDB() {
  return `<div class="admin-section-card">
    <div class="admin-section-header"><h3>🔧 Database Tools</h3></div>
    <div class="admin-section-body">
      <p style="font-size:14px;color:var(--gray-600);margin-bottom:16px">Click below to seed Firebase with all default content — movies, characters, cars, quotes and more.</p>
      <div id="db-status"></div>
      <button class="admin-save-btn" id="seed-btn" style="background:#1a1a2e">🌱 Seed Database with Default Content</button>
    </div>
  </div>`;
}
function bindDB() {
  document.getElementById('seed-btn').addEventListener('click', async () => {
    if (!confirm('This will fill Firebase with default content. Continue?')) return;
    const statusEl = document.getElementById('db-status');
    statusEl.innerHTML = '<div class="admin-success">Seeding...</div>';
    try {
      await seedDatabase();
      statusEl.innerHTML = '<div class="admin-success">✅ Database seeded successfully!</div>';
    } catch(e) {
      statusEl.innerHTML = `<div class="admin-error">❌ Error: ${e.message}</div>`;
    }
  });
}
