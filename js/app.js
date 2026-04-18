import { db, auth, collection, doc, getDoc, onSnapshot, query, orderBy, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from './firebase-config.js';
import { seedDatabase } from './seed.js';

// ── State ─────────────────────────────────────────────────────────────────────
let S = {}; // settings
let DATA = { movies:[], characters:[], cars:[], quotes:[], news:[], paulTimeline:[], paulFilmography:[], paulQuotes:[] };
let currentPage = 'home';

// ── Auth Gate ─────────────────────────────────────────────────────────────────
onAuthStateChanged(auth, user => {
  if (user) {
    document.getElementById('auth-screen').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    loadData();
  } else {
    document.getElementById('auth-screen').classList.remove('hidden');
    document.getElementById('app').classList.add('hidden');
  }
});

// Auth form logic
const authTabLogin = document.getElementById('auth-tab-login');
const authTabRegister = document.getElementById('auth-tab-register');
const authConfirmField = document.getElementById('auth-confirm-field');
let authMode = 'login';

authTabLogin.addEventListener('click', () => {
  authMode = 'login';
  authTabLogin.classList.add('active'); authTabRegister.classList.remove('active');
  authConfirmField.classList.add('hidden');
  document.getElementById('auth-title').textContent = 'ברוך הבא';
  document.getElementById('auth-sub').textContent = 'התחבר כדי להיכנס לאתר';
  document.getElementById('auth-btn').textContent = '🔓 כניסה';
  document.getElementById('auth-error').classList.add('hidden');
});

authTabRegister.addEventListener('click', () => {
  authMode = 'register';
  authTabRegister.classList.add('active'); authTabLogin.classList.remove('active');
  authConfirmField.classList.remove('hidden');
  document.getElementById('auth-title').textContent = 'הצטרף למשפחה';
  document.getElementById('auth-sub').textContent = 'צור חשבון חדש';
  document.getElementById('auth-btn').textContent = '🚀 הצטרף';
  document.getElementById('auth-error').classList.add('hidden');
});

document.getElementById('auth-btn').addEventListener('click', handleAuth);
document.addEventListener('keydown', e => { if (e.key === 'Enter' && !document.getElementById('auth-screen').classList.contains('hidden')) handleAuth(); });

async function handleAuth() {
  const email = document.getElementById('auth-email').value.trim();
  const password = document.getElementById('auth-password').value;
  const confirm = document.getElementById('auth-confirm').value;
  const errEl = document.getElementById('auth-error');
  errEl.classList.add('hidden');

  if (authMode === 'register' && password !== confirm) { showAuthError('הסיסמאות לא תואמות'); return; }
  if (password.length < 6) { showAuthError('הסיסמה חייבת להיות לפחות 6 תווים'); return; }

  try {
    if (authMode === 'login') await signInWithEmailAndPassword(auth, email, password);
    else await createUserWithEmailAndPassword(auth, email, password);
  } catch(e) {
    if (e.code === 'auth/user-not-found' || e.code === 'auth/wrong-password' || e.code === 'auth/invalid-credential') showAuthError('אימייל או סיסמה שגויים');
    else if (e.code === 'auth/email-already-in-use') showAuthError('אימייל זה כבר רשום');
    else if (e.code === 'auth/invalid-email') showAuthError('אימייל לא תקין');
    else showAuthError('שגיאה: ' + e.message);
  }
}
function showAuthError(msg) {
  const el = document.getElementById('auth-error');
  el.textContent = msg; el.classList.remove('hidden');
}

// Logout
document.getElementById('nav-logout').addEventListener('click', () => signOut(auth));

// ── Load Data ─────────────────────────────────────────────────────────────────
function loadData() {
  onSnapshot(doc(db,'settings','general'), snap => {
    S = snap.data() || {};
    updateNav(); renderCurrentPage();
  });
  const cols = ['movies','characters','cars','quotes','news','paulTimeline','paulFilmography','paulQuotes'];
  cols.forEach(col => {
    onSnapshot(query(collection(db,col), orderBy('order')), snap => {
      DATA[col] = snap.docs.map(d => ({id:d.id,...d.data()}));
      renderCurrentPage();
    });
  });
}

function updateNav() {
  const name = (S.siteName || 'F&F HUB').split(' ');
  document.getElementById('nav-site-name').innerHTML = name[0] + '&nbsp;<span>' + (name[1]||'HUB') + '</span>';
}

// ── Router ────────────────────────────────────────────────────────────────────
function navigate(page) {
  currentPage = page;
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', a.dataset.page === page);
  });
  renderCurrentPage();
  window.scrollTo(0,0);
}

document.querySelectorAll('[data-page]').forEach(el => {
  el.addEventListener('click', e => { e.preventDefault(); navigate(el.dataset.page); });
});

function renderCurrentPage() {
  const main = document.getElementById('main-content');
  switch(currentPage) {
    case 'home': main.innerHTML = renderHome(); break;
    case 'movies': main.innerHTML = renderMovies(); break;
    case 'characters': main.innerHTML = renderCharacters(); break;
    case 'cars': main.innerHTML = renderCars(); break;
    case 'quotes': main.innerHTML = renderQuotes(); break;
    case 'news': main.innerHTML = renderNews(); break;
    case 'paul-walker': main.innerHTML = renderPaulWalker(); break;
  }
}

// ── Renderers ─────────────────────────────────────────────────────────────────
function navHTML() {
  return `<nav class="nav">
    <a href="#" data-page="home" class="nav-logo">
      <div class="nav-logo-icon">🔥</div>
      <span id="nav-site-name">${S.siteName||'F&F HUB'}</span>
    </a>
    <div class="nav-links">
      <a href="#" data-page="movies">MOVIES</a>
      <a href="#" data-page="characters">CHARACTERS</a>
      <a href="#" data-page="cars">CARS</a>
      <a href="#" data-page="quotes">QUOTES</a>
      <a href="#" data-page="news">NEWS</a>
      <a href="#" data-page="paul-walker">PAUL WALKER</a>
    </div>
    <div class="nav-right">
      <a href="admin.html" class="nav-btn">⚙️ ADMIN</a>
      <button id="nav-logout" class="nav-btn">🚪 יציאה</button>
    </div>
  </nav>`;
}

function footerHTML() {
  return `<div class="footer-wrap">
    <div class="footer">
      <div class="footer-grid">
        <div>
          <div class="footer-logo"><div class="nav-logo-icon" style="width:28px;height:28px;font-size:14px">🔥</div>${S.siteName||'F&F HUB'}</div>
          <p class="footer-desc">${S.footerDesc||''}</p>
        </div>
        <div>
          <div class="footer-sec-title">Explore</div>
          <div class="footer-links">
            <a href="#" data-page="movies">🎬 Movies</a>
            <a href="#" data-page="cars">🚗 Cars</a>
            <a href="#" data-page="news">📰 News</a>
          </div>
        </div>
        <div>
          <div class="footer-sec-title">&nbsp;</div>
          <div class="footer-links">
            <a href="#" data-page="characters">👥 Characters</a>
            <a href="#" data-page="quotes">💬 Quotes</a>
            <a href="#" data-page="paul-walker">❤️ Paul Walker</a>
          </div>
        </div>
        <div>
          <div class="footer-sec-title">"</div>
          <div class="footer-quote-card">
            <div class="footer-quote-text">${S.footerQuote||''}</div>
            <div class="footer-quote-author">${S.footerQuoteAuthor||''}</div>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <span>${S.footerCredit||''}</span>
        <span>Made with ❤️ for every fan</span>
      </div>
    </div>
  </div>`;
}

function renderHome() {
  const titleWords = (S.heroTitle||'FAST AND FURIOUS').split(' ');
  const redWords = ['AND','FURIOUS','&'];
  const titleHTML = titleWords.map(w => `<div class="${redWords.includes(w)?'red':''}">${w}</div>`).join('');
  const q0 = DATA.quotes[0];

  return `
    <div class="hero">
      <div class="hero-bg"></div>
      <div class="hero-content">
        <div class="hero-label">🔥 Fan Hub</div>
        <div class="hero-title">${titleHTML}</div>
        <p class="hero-desc">${S.heroSubtitle||''}</p>
        <div class="hero-btns">
          <a href="#" data-page="movies" class="btn-primary">▶ ${S.heroCta1||'EXPLORE MOVIES'}</a>
          <a href="#" data-page="cars" class="btn-ghost">▷ ${S.heroCta2||'THE RIDES'}</a>
        </div>
      </div>
    </div>
    <div class="stats-bar">
      <div><div class="stat-number">${S.statsMovies||DATA.movies.length}</div><div class="stat-label">Movies</div></div>
      <div><div class="stat-number">${S.statsCharacters||DATA.characters.length}</div><div class="stat-label">Characters</div></div>
      <div><div class="stat-number">${S.statsCars||DATA.cars.length}</div><div class="stat-label">Legendary Rides</div></div>
      <div><div class="stat-number">${S.statsQuotes||DATA.quotes.length}</div><div class="stat-label">Iconic Quotes</div></div>
    </div>
    <div class="section">
      <div class="section-header">
        <div><div class="section-label">Featured Movies</div><div class="section-title">The Saga</div></div>
        <a href="#" data-page="movies" class="view-all">View All ↗</a>
      </div>
      <div class="movies-grid">
        ${DATA.movies.slice(0,5).map(m=>`<div class="movie-card"><img src="${m.image}" alt="${m.title}" loading="lazy"><div class="movie-card-overlay"><div class="movie-card-title">${m.title}</div><div class="movie-card-dir">${m.director}</div></div><div class="movie-card-year">${m.year}</div></div>`).join('')}
      </div>
    </div>
    ${q0 ? `<div class="quote-banner"><span class="quote-banner-icon">▌</span><span class="quote-banner-text">${q0.text.replace(/"/g,'')}</span><span class="quote-banner-author">— ${q0.character} · ${q0.movie}</span></div>` : ''}
    <div class="section">
      <div class="section-header">
        <div><div class="section-label">The Garage</div><div class="section-title">Legendary Rides</div></div>
        <a href="#" data-page="cars" class="view-all">View All ↗</a>
      </div>
      <div class="cars-grid">
        ${DATA.cars.slice(0,3).map(c=>`<div class="car-card"><img src="${c.image}" alt="${c.name}" class="car-card-img" loading="lazy"><div class="car-card-header"><div class="car-card-name">${c.name}</div><div class="car-card-hp">⚡ ${c.hp}</div></div><div class="car-card-model">${c.model}</div><div class="car-card-driver">${c.driver}</div></div>`).join('')}
      </div>
    </div>
    <div class="section">
      <div class="section-header">
        <div><div class="section-label">Characters</div><div class="section-title">The Family</div></div>
        <a href="#" data-page="characters" class="view-all">View All ↗</a>
      </div>
      <div class="chars-grid">
        ${DATA.characters.slice(0,4).map(c=>`<div class="char-card"><img src="${c.image}" alt="${c.name}" loading="lazy"><div class="char-card-info"><div class="char-card-name">${c.name}</div><div class="char-card-actor">${c.actor}</div></div></div>`).join('')}
      </div>
    </div>
    <div class="section">
      <div class="section-header">
        <div><div class="section-label">Quotes</div><div class="section-title">Words That Stuck</div></div>
        <a href="#" data-page="quotes" class="view-all">View All ↗</a>
      </div>
      <div class="quotes-grid">
        ${DATA.quotes.slice(0,2).map(q=>`<div class="quote-card"><div class="quote-card-bg">"</div><div class="quote-card-text">${q.text}</div><div class="quote-card-footer"><div class="quote-card-line"></div><span class="quote-card-char">${q.character}</span><span class="quote-card-movie">· ${q.movie}</span></div></div>`).join('')}
      </div>
    </div>
    <div class="section">
      <div class="section-header">
        <div><div class="section-label">Latest</div><div class="section-title">News & Updates</div></div>
        <a href="#" data-page="news" class="view-all">All News ↗</a>
      </div>
      <div class="cars-grid">
        ${DATA.news.slice(0,3).map(n=>`<div><img src="${n.image}" alt="${n.title}" class="car-card-img" loading="lazy"><div class="car-card-driver" style="margin-bottom:4px">${n.category}</div><div class="car-card-name" style="font-size:14px;margin-bottom:4px">${n.title}</div><div class="car-card-model">${n.subtitle}</div></div>`).join('')}
      </div>
    </div>
    <div class="section" style="padding-top:0">
      <div class="pw-tribute-card">
        <div class="pw-tribute-icon">❤️</div>
        <div>
          <div class="pw-tribute-label">In Memoriam</div>
          <div class="pw-tribute-title">PAUL WALKER TRIBUTE</div>
          <div class="pw-tribute-desc">A dedicated section celebrating the life, legacy, and unforgettable performances of Paul Walker.</div>
        </div>
        <a href="#" data-page="paul-walker" class="pw-tribute-link">Visit Tribute →</a>
      </div>
    </div>
    ${footerHTML()}`;
}

function renderMovies() {
  return `
    <div class="page-header">
      <div class="page-header-label">${S.moviesPageSubtitle||'THE FRANCHISE'}</div>
      <h1>${S.moviesPageTitle||'MOVIES'}</h1>
      <p>${S.moviesPageDesc||''}</p>
      <div class="page-header-divider"></div>
    </div>
    <div class="container">
      <div class="movies-grid" style="grid-template-columns:repeat(5,1fr)">
        ${DATA.movies.map(m=>`<div class="movie-card"><img src="${m.image}" alt="${m.title}" loading="lazy"><div class="movie-card-overlay"><div class="movie-card-title">${m.title}</div><div class="movie-card-dir">${m.director}</div></div><div class="movie-card-year">${m.year}</div></div>`).join('')}
      </div>
    </div>
    ${footerHTML()}`;
}

function renderCharacters() {
  return `
    <div class="page-header">
      <div class="page-header-label">${S.charactersPageSubtitle||'THE CREW'}</div>
      <h1>${S.charactersPageTitle||'CHARACTERS'}</h1>
      <p>${S.charactersPageDesc||''}</p>
      <div class="page-header-divider"></div>
    </div>
    <div class="container">
      <div class="chars-grid" style="grid-template-columns:repeat(4,1fr)">
        ${DATA.characters.map(c=>`<div class="char-card"><img src="${c.image}" alt="${c.name}" loading="lazy"><div class="char-card-info"><div class="char-card-name">${c.name}</div><div class="char-card-actor">${c.actor}</div></div></div>`).join('')}
      </div>
    </div>
    ${footerHTML()}`;
}

function renderCars() {
  return `
    <div class="page-header">
      <div class="page-header-label">${S.carsPageSubtitle||'THE GARAGE'}</div>
      <h1>${S.carsPageTitle||'LEGENDARY RIDES'}</h1>
      <p>${S.carsPageDesc||''}</p>
      <div class="page-header-divider"></div>
    </div>
    <div class="container">
      <div class="cars-grid">
        ${DATA.cars.map(c=>`<div class="car-card"><img src="${c.image}" alt="${c.name}" class="car-card-img" loading="lazy"><div class="car-card-header"><div class="car-card-name">${c.name}</div><div class="car-card-hp">⚡ ${c.hp}</div></div><div class="car-card-model">${c.model}</div><div class="car-card-driver">${c.driver}</div></div>`).join('')}
      </div>
    </div>
    ${footerHTML()}`;
}

function renderQuotes() {
  return `
    <div class="page-header">
      <div class="page-header-label">${S.quotesPageSubtitle||'WORDS TO LIVE BY'}</div>
      <h1>${S.quotesPageTitle||'ICONIC QUOTES'}</h1>
      <p>${S.quotesPageDesc||''}</p>
      <div class="page-header-divider"></div>
    </div>
    <div class="container">
      <div class="quotes-grid">
        ${DATA.quotes.map(q=>`<div class="quote-card"><div class="quote-card-bg">"</div><div class="quote-card-text">${q.text}</div><div class="quote-card-footer"><div class="quote-card-line"></div><span class="quote-card-char">${q.character}</span><span class="quote-card-movie">· ${q.movie}</span></div></div>`).join('')}
      </div>
    </div>
    ${footerHTML()}`;
}

function renderNews() {
  return `
    <div class="page-header">
      <div class="page-header-label">${S.newsPageSubtitle||'LATEST DROP'}</div>
      <h1>${S.newsPageTitle||'NEWS & EVENTS'}</h1>
      <p>${S.newsPageDesc||''}</p>
      <div class="page-header-divider"></div>
    </div>
    <div class="container">
      <div class="news-list">
        ${DATA.news.map(n=>`<div class="news-item"><img src="${n.image}" alt="${n.title}" class="news-item-img" loading="lazy"><div><div class="news-item-cat">${n.category} · ${n.date}</div><div class="news-item-title">${n.title}</div><div class="news-item-sub">${n.subtitle}</div><div class="news-item-body">${n.body}</div></div></div>`).join('')}
      </div>
    </div>
    ${footerHTML()}`;
}

function renderPaulWalker() {
  return `
    <div class="pw-hero">
      <div class="pw-hero-bg" style="background-image:url('https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=800&q=80')"></div>
      <div class="pw-hero-content">
        <div class="pw-badge">❤️ In Memoriam</div>
        <div class="pw-name1">PAUL</div>
        <div class="pw-name2">WALKER</div>
        <div class="pw-dates">${S.paulWalkerDates||''}</div>
        <div class="pw-subtitle">${S.paulWalkerSubtitle||''}</div>
      </div>
    </div>
    <div class="pw-quote-strip">
      <div class="pw-quote-strip-text">${S.paulWalkerHeroQuote||''}</div>
      <div class="pw-quote-strip-src">${S.paulWalkerHeroQuoteSource||''}</div>
    </div>
    <div class="section">
      <div class="pw-two-col">
        <div>
          <div class="section-label">The Man</div>
          <div class="section-title" style="font-size:28px;margin-bottom:16px">MORE THAN A MOVIE STAR</div>
          ${(S.paulWalkerBio||'').split('\n\n').map(p=>`<p style="font-size:14px;color:var(--gray-600);line-height:1.7;margin-bottom:16px">${p}</p>`).join('')}
        </div>
        <div>
          <div class="section-label" style="margin-bottom:16px">His Legacy</div>
          ${DATA.paulQuotes.map(q=>`<div style="margin-bottom:24px"><div style="font-family:var(--font-display);font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:0.03em;line-height:1.4;margin-bottom:6px">${q.text}</div><div style="font-family:var(--font-display);font-size:11px;font-weight:700;letter-spacing:0.1em;color:var(--red);text-transform:uppercase">${q.author}</div></div>`).join('')}
        </div>
      </div>
    </div>
    <div class="section" style="padding-top:0">
      <div class="section-label">Timeline</div>
      <div class="section-title" style="margin-bottom:32px">A LIFE REMEMBERED</div>
      <div class="timeline">
        ${DATA.paulTimeline.map(t=>`<div class="tl-item"><div class="tl-dot"><div class="tl-dot-inner"></div></div><div><div class="tl-year">${t.year}</div><div class="tl-text">${t.text}</div></div></div>`).join('')}
      </div>
    </div>
    <div class="section" style="padding-top:0">
      <div class="section-label">Filmography</div>
      <div class="section-title" style="margin-bottom:24px">FAST SAGA APPEARANCES</div>
      <div class="filmo-grid">
        ${DATA.paulFilmography.map(f=>`<div class="filmo-item"><div class="filmo-icon">🎬</div><div><div class="filmo-title">${f.movie}</div><div class="filmo-year">${f.year}</div><div class="filmo-role">${f.role}</div></div></div>`).join('')}
      </div>
    </div>
    <div class="section" style="padding-top:0;text-align:center;padding-bottom:64px">
      <div style="font-size:32px;margin-bottom:12px">❤️</div>
      <div class="section-title">${S.rowwTitle||'REACH OUT WORLDWIDE'}</div>
      <p style="font-size:14px;color:var(--gray-600);max-width:480px;margin:12px auto 24px;line-height:1.6">${S.rowwDesc||''}</p>
    </div>
    ${footerHTML()}`;
}

// Re-bind nav after each render
document.getElementById('main-content').addEventListener('click', e => {
  const a = e.target.closest('[data-page]');
  if (a) { e.preventDefault(); navigate(a.dataset.page); }
});

// Re-bind logout after render
document.getElementById('main-content').addEventListener('click', e => {
  if (e.target.id === 'nav-logout') signOut(auth);
});
