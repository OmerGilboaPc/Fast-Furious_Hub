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
    <div class="admin-section-header"><h3>${title}</h3><button class="admin-save-btn settings-save-btn">💾 שמור שינויים</button></div>
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
  return settingsCard('🌐 כללי — שם ומיתוג', [
    {key:'siteName',label:'שם האתר'},
    {key:'primaryColor',label:'צבע ראשי',type:'color'},
    {key:'heroTitle',label:'כותרת Hero'},
    {key:'heroSubtitle',label:'תת-כותרת Hero',full:true},
    {key:'heroCta1',label:'כפתור 1'},
    {key:'heroCta2',label:'כפתור 2'},
    {key:'statsMovies',label:'מספר סרטים'},
    {key:'statsCharacters',label:'מספר דמויות'},
    {key:'statsCars',label:'מספר רכבים'},
    {key:'statsQuotes',label:'מספר ציטוטים'},
    {key:'footerDesc',label:'תיאור Footer',full:true},
    {key:'footerQuote',label:'ציטוט Footer',full:true},
    {key:'footerQuoteAuthor',label:'מחבר ציטוט Footer'},
    {key:'footerCredit',label:'שורת קרדיטים',full:true},
  ]);
}

function renderSettingsPages() {
  return [
    settingsCard('🎬 עמוד סרטים', [{key:'moviesPageSubtitle',label:'תווית'},{key:'moviesPageTitle',label:'כותרת'},{key:'moviesPageDesc',label:'תיאור',full:true}]),
    settingsCard('👥 עמוד דמויות', [{key:'charactersPageSubtitle',label:'תווית'},{key:'charactersPageTitle',label:'כותרת'},{key:'charactersPageDesc',label:'תיאור',full:true}]),
    settingsCard('🚗 עמוד רכבים', [{key:'carsPageSubtitle',label:'תווית'},{key:'carsPageTitle',label:'כותרת'},{key:'carsPageDesc',label:'תיאור',full:true}]),
    settingsCard('💬 עמוד ציטוטים', [{key:'quotesPageSubtitle',label:'תווית'},{key:'quotesPageTitle',label:'כותרת'},{key:'quotesPageDesc',label:'תיאור',full:true}]),
    settingsCard('📰 עמוד חדשות', [{key:'newsPageSubtitle',label:'תווית'},{key:'newsPageTitle',label:'כותרת'},{key:'newsPageDesc',label:'תיאור',full:true}]),
  ].join('');
}

function renderSettingsPaul() {
  return [
    settingsCard('❤️ Hero', [{key:'paulWalkerDates',label:'תאריכים'},{key:'paulWalkerSubtitle',label:'תת-כותרת',full:true},{key:'paulWalkerHeroQuote',label:'ציטוט פס',full:true},{key:'paulWalkerHeroQuoteSource',label:'מקור'}]),
    settingsCard('📝 ביוגרפיה', [{key:'paulWalkerBio',label:'ביוגרפיה (הפרד פסקאות בשורה ריקה)',full:true,type:'textarea',tall:true}]),
    settingsCard('🌍 ROWW', [{key:'rowwTitle',label:'כותרת'},{key:'rowwDesc',label:'תיאור',full:true,type:'textarea'}]),
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
      btn.textContent = '✅ נשמר!'; btn.disabled = false;
      setTimeout(() => { btn.textContent = '💾 שמור שינויים'; }, 2000);
    });
  });
  // Color pickers
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
function movieFields()  { return [{key:'order',label:'סדר'},{key:'year',label:'שנה'},{key:'title',label:'כותרת',full:true},{key:'director',label:'במאי'},{key:'image',label:'URL פוסטר',full:true}]; }
function charFields()   { return [{key:'order',label:'סדר'},{key:'name',label:'שם'},{key:'actor',label:'שחקן'},{key:'image',label:'URL תמונה',full:true}]; }
function carFields()    { return [{key:'order',label:'סדר'},{key:'name',label:'שם הרכב',full:true},{key:'model',label:'מודל'},{key:'hp',label:'כוח סוס'},{key:'driver',label:'נהג'},{key:'image',label:'URL תמונה',full:true}]; }
function quoteFields()  { return [{key:'order',label:'סדר'},{key:'text',label:'ציטוט',full:true},{key:'character',label:'דמות'},{key:'movie',label:'סרט'}]; }
function newsFields()   { return [{key:'order',label:'סדר'},{key:'category',label:'קטגוריה'},{key:'date',label:'תאריך'},{key:'title',label:'כותרת',full:true},{key:'subtitle',label:'תת-כותרת',full:true},{key:'body',label:'גוף',full:true,type:'textarea'},{key:'image',label:'URL תמונה',full:true}]; }
function tlFields()     { return [{key:'order',label:'סדר'},{key:'year',label:'שנה'},{key:'text',label:'תיאור',full:true}]; }
function filmoFields()  { return [{key:'order',label:'סדר'},{key:'movie',label:'סרט'},{key:'year',label:'שנה'},{key:'role',label:'תפקיד'}]; }
function pqFields()     { return [{key:'order',label:'סדר'},{key:'text',label:'ציטוט',full:true},{key:'author',label:'מחבר'}]; }

function renderCollection(colName, fields) {
  const items = DATA[colName] || [];
  return `<div class="admin-section-card">
    <div class="admin-section-header"><h3>${colName}</h3></div>
    <div class="admin-section-body">
      <div id="items-list">
        ${items.map(item => renderItemCard(item, fields, colName)).join('')}
      </div>
      <button class="admin-add-btn" id="add-new-btn">➕ הוסף פריט</button>
      <div id="new-item-form" class="hidden admin-item-card new-item" style="margin-top:12px">
        <div style="font-family:var(--font-display);font-weight:700;font-size:13px;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:12px">➕ פריט חדש</div>
        <div class="admin-grid-2">
          ${fields.map(f=>`<div class="admin-field${f.full?' full-width':''}"><label>${f.label}</label>${f.type==='textarea'?`<textarea class="admin-textarea" data-newkey="${f.key}"></textarea>`:`<input class="admin-input" data-newkey="${f.key}" value="">`}</div>`).join('')}
        </div>
        <div class="admin-item-actions">
          <button class="admin-cancel-btn" id="cancel-new-btn">ביטול</button>
          <button class="admin-save-btn" id="confirm-new-btn">✅ הוסף</button>
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
      <button class="admin-delete-btn item-delete-btn">🗑 מחק</button>
      <button class="admin-save-btn item-save-btn">💾 שמור</button>
    </div>
  </div>`;
}

function bindCollection(colName, fields) {
  // Save existing
  document.querySelectorAll('.item-save-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const card = btn.closest('.admin-item-card');
      const id = card.dataset.id;
      const updates = {};
      card.querySelectorAll('[data-field]').forEach(el => { updates[el.dataset.field] = el.value; });
      btn.textContent = '...'; btn.disabled = true;
      await updateDoc(doc(db, colName, id), updates);
      btn.textContent = '✅'; btn.disabled = false;
      setTimeout(() => { btn.textContent = '💾 שמור'; }, 1500);
    });
  });
  // Delete
  document.querySelectorAll('.item-delete-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (!confirm('למחוק?')) return;
      const id = btn.closest('.admin-item-card').dataset.id;
      await deleteDoc(doc(db, colName, id));
    });
  });
  // Add new
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
    <div class="admin-section-header"><h3>🔧 כלי דאטאבייס</h3></div>
    <div class="admin-section-body">
      <p style="font-size:14px;color:var(--gray-600);margin-bottom:16px">לחץ למטה כדי למלא את Firebase בכל התוכן המקורי — סרטים, דמויות, רכבים, ציטוטים ועוד.</p>
      <div id="db-status"></div>
      <button class="admin-save-btn" id="seed-btn" style="background:#1a1a2e">🌱 מלא דאטאבייס בתוכן התחלתי</button>
    </div>
  </div>`;
}
function bindDB() {
  document.getElementById('seed-btn').addEventListener('click', async () => {
    if (!confirm('זה ימלא את Firebase בתוכן ברירת המחדל. להמשיך?')) return;
    const statusEl = document.getElementById('db-status');
    statusEl.innerHTML = '<div class="admin-success">ממלא...</div>';
    try {
      await seedDatabase();
      statusEl.innerHTML = '<div class="admin-success">✅ הדאטאבייס מולא בהצלחה!</div>';
    } catch(e) {
      statusEl.innerHTML = `<div class="admin-error">❌ שגיאה: ${e.message}</div>`;
    }
  });
}
