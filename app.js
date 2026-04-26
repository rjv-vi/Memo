/* ═══════════════════════════════════════════════════════════
   MEMO app.js — All application logic
   Sections:
   1. Config & Constants
   2. Localization (i18n)
   3. Haptics & Sound
   4. Database (localStorage)
   5. SM-2 Algorithm
   6. Navigation
   7. Home Screen
   8. Decks Screen
   9. Study Session
   10. Browse & Search
   11. Settings Screen
   12. Import / Export
   13. AI Generation (Gemini)
   14. Test Mode
   15. Match Mode
   16. Achievements
   17. UI Helpers (Toast, Confirm, Sheets)
   18. Service Worker Registration
   19. Init
═══════════════════════════════════════════════════════════ */

/* ═══ 1. CONFIG ═══ */
const VERSION   = '1.0';
const STORE_KEY = 'memo_v1';
const DECK_COLORS = ['purple','blue','green','orange','red','teal','slate','gold','pink'];
const DECK_EMOJIS = ['📚','🧠','🌍','🔬','🎨','💻','📐','📖','🎵','🌱','⚡','🏛️','✈️','🍎','🎯'];

/* ═══ 2. LOCALIZATION ═══ */
const i18n = {
  ru: {
    app: 'Memo', tagline: 'Умные карточки',
    nav_home: 'Главная', nav_decks: 'Колоды', nav_study: 'Учить',
    nav_browse: 'Поиск', nav_settings: 'Настройки',
    // Home
    hello: 'Добро пожаловать 👋', hello_back: 'С возвращением 👋',
    today_due: 'На сегодня', new_cards: 'Новых', reviewed: 'Повторено',
    start_study: 'Начать занятие', all_done: 'Всё готово на сегодня! 🎉',
    // Decks
    decks: 'Колоды', no_decks: 'Колод ещё нет',
    no_decks_sub: 'Нажмите + чтобы создать первую колоду',
    add_deck: 'Новая колода', edit_deck: 'Изменить колоду',
    deck_name: 'Название', deck_desc: 'Описание (необязательно)',
    deck_color: 'Цвет', deck_emoji: 'Иконка',
    delete_deck: 'Удалить колоду', delete_deck_msg: 'Все карточки будут удалены. Это действие необратимо.',
    study_deck: 'Учить', add_card_to: 'Добавить карточку',
    cards_total: 'карт', cards_due: 'к повторению', cards_new: 'новых',
    // Cards
    add_card: 'Новая карточка', edit_card: 'Изменить карточку',
    card_front: 'Лицевая сторона (вопрос)', card_back: 'Обратная сторона (ответ)',
    card_tags: 'Теги (через запятую)', delete_card: 'Удалить карточку',
    // Study
    tap_to_flip: 'Нажмите чтобы перевернуть',
    rating_again: 'Снова', rating_hard: 'Сложно', rating_good: 'Хорошо', rating_easy: 'Легко',
    session_done: 'Занятие завершено!', session_done_sub: 'Отличная работа! До следующей встречи 💪',
    studied: 'Изучено', correct_rate: 'Правильно', time_spent: 'Времени',
    no_cards_due: 'На сегодня всё изучено! 🎉', no_cards_in_deck: 'В этой колоде нет карточек',
    // Browse
    search_placeholder: 'Поиск по карточкам...', all_decks: 'Все',
    // Settings
    settings: 'Настройки', theme: 'Тема', theme_light: 'Светлая', theme_dark: 'Тёмная', theme_auto: 'Авто',
    language: 'Язык', new_per_day: 'Новых карточек в день', review_per_day: 'Повторений в день',
    gemini_key: 'Ключ Gemini API', gemini_key_ph: 'AIza...',
    gemini_key_hint: 'Для генерации карточек с помощью ИИ',
    data: 'Данные', export_all: 'Экспорт всех колод', import_cards: 'Импорт карточек',
    delete_all: 'Удалить все данные', delete_all_msg: 'Все колоды и карточки будут удалены навсегда.',
    // Import
    import: 'Импорт', import_txt: 'Текстовый файл (.txt)', import_into: 'В колоду',
    import_success: 'Импортировано карточек: ', import_error: 'Ошибка импорта',
    // AI
    ai_gen: 'Генерация карточек ИИ', ai_topic: 'Тема', ai_topic_ph: 'Например: Времена английского языка',
    ai_count: 'Количество карточек', ai_lang: 'Язык карточек', ai_generate: 'Сгенерировать',
    ai_generating: 'Генерирую карточки...', ai_success: 'Создано карточек: ',
    ai_no_key: 'Добавьте ключ Gemini API в настройках', ai_error: 'Ошибка генерации. Проверьте ключ API.',
    // Test
    test_mode: 'Тест', test_question: 'Выберите правильный ответ',
    test_result: 'Результат теста', test_score: 'Правильно: ',
    test_again: 'Ещё раз', test_done: 'Завершить',
    // Match
    match_mode: 'Матч', match_pairs: 'пар осталось', match_done: 'Все пары найдены! 🎉',
    // Achievements
    achievements: 'Достижения',
    ach_first_study: 'Первый шаг', ach_first_study_d: 'Завершите первое занятие',
    ach_streak3: 'Привычка', ach_streak3_d: '3 дня подряд',
    ach_streak7: 'Неделя', ach_streak7_d: '7 дней подряд',
    ach_streak30: 'Месяц', ach_streak30_d: '30 дней подряд',
    ach_100cards: '100 карточек', ach_100cards_d: 'Изучено 100 карточек',
    ach_500cards: '500 карточек', ach_500cards_d: 'Изучено 500 карточек',
    ach_first_deck: 'Первая колода', ach_first_deck_d: 'Создайте первую колоду',
    ach_5decks: '5 колод', ach_5decks_d: 'Создайте 5 колод',
    ach_perfect: 'Перфекционист', ach_perfect_d: 'Сессия без ошибок',
    // Misc
    save: 'Сохранить', cancel: 'Отмена', delete: 'Удалить', ok: 'OK', back: 'Назад',
    close: 'Закрыть', confirm: 'Подтвердить', next: 'Далее', finish: 'Завершить',
    yes: 'Да', no: 'Нет', loading: 'Загрузка...',
    // Stats
    stats: 'Статистика', total_cards: 'Всего карточек', total_decks: 'Колод',
    streak_current: 'Стрик', streak_best: 'Лучший стрик', total_reviews: 'Повторений',
    // Onboarding
    ob_title: 'Добро пожаловать в', ob_sub: 'Умные карточки с интервальным повторением. Учите быстрее, помните дольше.',
    ob_skip: 'Пропустить', ob_start: 'Начать',
  },
  en: {
    app: 'Memo', tagline: 'Smart Flashcards',
    nav_home: 'Home', nav_decks: 'Decks', nav_study: 'Study',
    nav_browse: 'Browse', nav_settings: 'Settings',
    hello: 'Welcome 👋', hello_back: 'Welcome back 👋',
    today_due: 'Due today', new_cards: 'New', reviewed: 'Reviewed',
    start_study: 'Start studying', all_done: 'All done for today! 🎉',
    decks: 'Decks', no_decks: 'No decks yet',
    no_decks_sub: 'Tap + to create your first deck',
    add_deck: 'New deck', edit_deck: 'Edit deck',
    deck_name: 'Name', deck_desc: 'Description (optional)',
    deck_color: 'Color', deck_emoji: 'Icon',
    delete_deck: 'Delete deck', delete_deck_msg: 'All cards will be deleted. This cannot be undone.',
    study_deck: 'Study', add_card_to: 'Add card',
    cards_total: 'cards', cards_due: 'due', cards_new: 'new',
    add_card: 'New card', edit_card: 'Edit card',
    card_front: 'Front (question)', card_back: 'Back (answer)',
    card_tags: 'Tags (comma separated)', delete_card: 'Delete card',
    tap_to_flip: 'Tap to flip',
    rating_again: 'Again', rating_hard: 'Hard', rating_good: 'Good', rating_easy: 'Easy',
    session_done: 'Session complete!', session_done_sub: 'Great work! See you next time 💪',
    studied: 'Studied', correct_rate: 'Correct', time_spent: 'Time',
    no_cards_due: 'All done for today! 🎉', no_cards_in_deck: 'This deck has no cards',
    search_placeholder: 'Search cards...', all_decks: 'All',
    settings: 'Settings', theme: 'Theme', theme_light: 'Light', theme_dark: 'Dark', theme_auto: 'Auto',
    language: 'Language', new_per_day: 'New cards per day', review_per_day: 'Reviews per day',
    gemini_key: 'Gemini API Key', gemini_key_ph: 'AIza...',
    gemini_key_hint: 'Required for AI card generation',
    data: 'Data', export_all: 'Export all decks', import_cards: 'Import cards',
    delete_all: 'Delete all data', delete_all_msg: 'All decks and cards will be permanently deleted.',
    import: 'Import', import_txt: 'Text file (.txt)', import_into: 'Into deck',
    import_success: 'Cards imported: ', import_error: 'Import error',
    ai_gen: 'AI Card Generation', ai_topic: 'Topic', ai_topic_ph: 'e.g. English Tenses',
    ai_count: 'Number of cards', ai_lang: 'Card language', ai_generate: 'Generate',
    ai_generating: 'Generating cards...', ai_success: 'Cards created: ',
    ai_no_key: 'Add a Gemini API key in settings', ai_error: 'Generation error. Check your API key.',
    test_mode: 'Test', test_question: 'Choose the correct answer',
    test_result: 'Test result', test_score: 'Correct: ',
    test_again: 'Try again', test_done: 'Finish',
    match_mode: 'Match', match_pairs: 'pairs left', match_done: 'All pairs matched! 🎉',
    achievements: 'Achievements',
    ach_first_study: 'First Step', ach_first_study_d: 'Complete your first session',
    ach_streak3: 'Habit', ach_streak3_d: '3 days in a row',
    ach_streak7: 'Week', ach_streak7_d: '7 days in a row',
    ach_streak30: 'Month', ach_streak30_d: '30 days in a row',
    ach_100cards: '100 Cards', ach_100cards_d: 'Study 100 cards',
    ach_500cards: '500 Cards', ach_500cards_d: 'Study 500 cards',
    ach_first_deck: 'First Deck', ach_first_deck_d: 'Create your first deck',
    ach_5decks: '5 Decks', ach_5decks_d: 'Create 5 decks',
    ach_perfect: 'Perfectionist', ach_perfect_d: 'Session with no mistakes',
    save: 'Save', cancel: 'Cancel', delete: 'Delete', ok: 'OK', back: 'Back',
    close: 'Close', confirm: 'Confirm', next: 'Next', finish: 'Finish',
    yes: 'Yes', no: 'No', loading: 'Loading...',
    stats: 'Statistics', total_cards: 'Total cards', total_decks: 'Decks',
    streak_current: 'Streak', streak_best: 'Best streak', total_reviews: 'Reviews',
    ob_title: 'Welcome to', ob_sub: 'Smart flashcards with spaced repetition. Learn faster, remember longer.',
    ob_skip: 'Skip', ob_start: 'Get Started',
  }
};

let lang = 'ru';
function t(key) { return (i18n[lang] || i18n.ru)[key] || key; }

/* ═══ 3. HAPTICS & SOUND ═══ */
const HFX = {
  light()  { try { navigator.vibrate?.(8); } catch(e){} },
  medium() { try { navigator.vibrate?.(20); } catch(e){} },
  heavy()  { try { navigator.vibrate?.([30,10,20]); } catch(e){} },
  success(){ try { navigator.vibrate?.([10,50,20]); } catch(e){} },
  error()  { try { navigator.vibrate?.([50,20,50]); } catch(e){} },
};

/* ═══ 4. DATABASE ═══ */
const DB = {
  data: null,

  init() {
    try {
      const saved = localStorage.getItem(STORE_KEY);
      if (saved) {
        this.data = JSON.parse(saved);
        this._migrate();
      } else {
        this.data = this._defaults();
      }
    } catch(e) {
      this.data = this._defaults();
    }
  },

  save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(this.data)); } catch(e) {}
  },

  _defaults() {
    return {
      decks: [],
      settings: {
        theme: 'light', language: 'ru',
        newPerDay: 20, reviewPerDay: 100,
        geminiKey: '', firstLaunch: true,
        streak: { current: 0, best: 0, lastStudy: null, lastCheck: null },
        totalReviews: 0,
      },
      achievements: {}
    };
  },

  _migrate() {
    // Ensure all fields exist (forward compatibility)
    if (!this.data.settings) this.data.settings = this._defaults().settings;
    if (!this.data.settings.streak) this.data.settings.streak = { current: 0, best: 0, lastStudy: null, lastCheck: null };
    if (!this.data.settings.totalReviews) this.data.settings.totalReviews = 0;
    if (!this.data.achievements) this.data.achievements = {};
    if (typeof this.data.settings.firstLaunch === 'undefined') this.data.settings.firstLaunch = false;
  },

  // ── Deck CRUD ──
  createDeck(name, desc, emoji, color) {
    const deck = {
      id: _uid(), name, desc: desc || '', emoji: emoji || '📚', color: color || 'purple',
      createdAt: Date.now(), cards: []
    };
    this.data.decks.push(deck);
    this.save();
    return deck;
  },

  getDeck(id) { return this.data.decks.find(d => d.id === id); },

  updateDeck(id, updates) {
    const d = this.getDeck(id);
    if (d) { Object.assign(d, updates); this.save(); }
  },

  deleteDeck(id) {
    this.data.decks = this.data.decks.filter(d => d.id !== id);
    this.save();
  },

  // ── Card CRUD ──
  createCard(deckId, front, back, tags = []) {
    const d = this.getDeck(deckId);
    if (!d) return null;
    const card = {
      id: _uid(), front, back,
      tags: Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim()).filter(Boolean),
      interval: 0, repetitions: 0, easeFactor: 2.5,
      dueDate: Date.now(), createdAt: Date.now(), reviews: 0, lapses: 0
    };
    d.cards.push(card);
    this.save();
    return card;
  },

  getCard(deckId, cardId) {
    const d = this.getDeck(deckId);
    return d ? d.cards.find(c => c.id === cardId) : null;
  },

  updateCard(deckId, cardId, updates) {
    const c = this.getCard(deckId, cardId);
    if (c) { Object.assign(c, updates); this.save(); }
  },

  deleteCard(deckId, cardId) {
    const d = this.getDeck(deckId);
    if (d) { d.cards = d.cards.filter(c => c.id !== cardId); this.save(); }
  },

  // ── Settings ──
  getSetting(key) { return this.data.settings[key]; },
  setSetting(key, val) { this.data.settings[key] = val; this.save(); },

  // ── Stats helpers ──
  getTotalCards() { return this.data.decks.reduce((s, d) => s + d.cards.length, 0); },

  getDueCount() {
    const now = Date.now();
    const newLimit = this.getSetting('newPerDay');
    let total = 0;
    for (const d of this.data.decks) {
      const due = d.cards.filter(c => c.repetitions > 0 && c.dueDate <= now).length;
      const newC = Math.min(d.cards.filter(c => c.repetitions === 0).length, newLimit);
      total += due + newC;
    }
    return total;
  },
};

/* ═══ 5. SM-2 ALGORITHM ═══ */
const SM2 = {
  /**
   * Review a card with quality 0-3
   * 0=Again, 1=Hard, 2=Good, 3=Easy
   */
  review(card, quality) {
    let { interval, repetitions, easeFactor } = card;

    if (quality === 0) { // Again — reset
      repetitions = 0;
      interval = 1;
      easeFactor = Math.max(1.3, easeFactor - 0.2);
    } else {
      // Compute new interval
      if (repetitions === 0)      interval = 1;
      else if (repetitions === 1) interval = 6;
      else                        interval = Math.round(interval * easeFactor);

      if (quality === 1) { // Hard
        interval = Math.max(1, Math.round(interval * 1.2));
        easeFactor = Math.max(1.3, easeFactor - 0.15);
      } else if (quality === 3) { // Easy
        interval = Math.round(interval * easeFactor * 1.3);
        easeFactor = Math.min(2.5, easeFactor + 0.15);
      }
      // Good (2) — use computed interval as-is

      repetitions++;
    }

    const dueDate = Date.now() + interval * 24 * 60 * 60 * 1000;
    return { interval, repetitions, easeFactor, dueDate };
  },

  /** Get cards due for review in a deck (mix of new + due) */
  getSession(deck, newLimit, reviewLimit) {
    const now = Date.now();
    const newCards = deck.cards
      .filter(c => c.repetitions === 0)
      .slice(0, newLimit);
    const dueCards = deck.cards
      .filter(c => c.repetitions > 0 && c.dueDate <= now)
      .slice(0, reviewLimit);
    // Interleave: start with some new, then review
    return [...dueCards, ...newCards];
  },

  intervalLabel(interval, lang) {
    if (interval <= 1) return lang === 'en' ? '1d' : '1д';
    if (interval < 7)  return interval + (lang === 'en' ? 'd' : 'д');
    if (interval < 30) return Math.round(interval/7) + (lang === 'en' ? 'w' : 'н');
    return Math.round(interval/30) + (lang === 'en' ? 'mo' : 'м');
  },
};

/* ═══ 6. NAVIGATION ═══ */
const Nav = {
  current: 'home',
  tabs: ['home','decks','browse','settings'],

  go(id) {
    const prev = document.getElementById(this.current);
    if (prev) prev.classList.remove('active');
    this.current = id;
    const next = document.getElementById(id);
    if (next) next.classList.add('active');
    // Update nav pill
    document.querySelectorAll('.nb').forEach(b => {
      b.classList.toggle('on', b.dataset.tab === id);
    });
    _updatePill();
    HFX.light();
    // Render screen content
    if (id === 'home')     Home.render();
    if (id === 'decks')    Decks.render();
    if (id === 'browse')   Browse.render();
    if (id === 'settings') Settings.render();
  },
};

/* ═══ 7. HOME SCREEN ═══ */
const Home = {
  render() {
    const s = DB.data.settings;
    const now = Date.now();
    const newLimit = s.newPerDay, revLimit = s.reviewPerDay;
    let totalNew = 0, totalDue = 0;
    for (const d of DB.data.decks) {
      totalNew += Math.min(d.cards.filter(c => c.repetitions === 0).length, newLimit);
      totalDue += d.cards.filter(c => c.repetitions > 0 && c.dueDate <= now).length;
    }
    const totalToday = totalNew + totalDue;
    const streak = s.streak;

    // Greeting
    const h = new Date().getHours();
    let greeting = t('hello_back');
    if (!s.totalReviews) greeting = t('hello');

    // Hero
    const hero = document.getElementById('homeHero');
    hero.innerHTML = `
      <div class="hero-greeting">${greeting}</div>
      <div class="hero-title">${totalToday > 0 ? `${totalToday} ${t('today_due')}` : t('all_done')}</div>
      <div class="hero-stats">
        <div class="hero-stat"><div class="hero-stat-n">${totalNew}</div><div class="hero-stat-l">${t('new_cards')}</div></div>
        <div class="hero-stat"><div class="hero-stat-n">${totalDue}</div><div class="hero-stat-l">${t('today_due')}</div></div>
        <div class="hero-stat"><div class="hero-stat-n">${DB.data.decks.length}</div><div class="hero-stat-l">${t('total_decks')}</div></div>
      </div>
      ${totalToday > 0 ? `<button class="hero-btn" onclick="Study.startAll()">${t('start_study')}</button>` : ''}
    `;

    // Streak
    const sb = document.getElementById('homeStreak');
    sb.innerHTML = `
      <div class="streak-fire">🔥</div>
      <div class="streak-info">
        <div class="streak-n">${streak.current} ${lang === 'en' ? 'days' : 'дней'}</div>
        <div class="streak-l">${t('streak_current')} · ${t('streak_best')}: ${streak.best}</div>
      </div>
      <div class="streak-badge">${streak.current > 0 ? '🔥 ' + streak.current : '—'}</div>
    `;

    // Recent decks
    const rd = document.getElementById('homeDecks');
    if (DB.data.decks.length === 0) {
      rd.innerHTML = `<div class="empty-state"><span class="empty-state-icon">📚</span><p>${t('no_decks')}</p></div>`;
      return;
    }
    rd.innerHTML = DB.data.decks.slice(0, 5).map(deck => {
      const due = deck.cards.filter(c => c.repetitions > 0 && c.dueDate <= now).length;
      const newC = Math.min(deck.cards.filter(c => c.repetitions === 0).length, newLimit);
      const total = deck.cards.length;
      const known = deck.cards.filter(c => c.repetitions > 0).length;
      const pct = total > 0 ? Math.round(known / total * 100) : 0;
      return `
        <div class="deck-card" onclick="Decks.openDetail('${deck.id}')">
          <div class="deck-card-hdr">
            <span class="deck-emoji">${deck.emoji}</span>
            <div class="deck-info">
              <div class="deck-name">${_esc(deck.name)}</div>
              <div class="deck-desc">${total} ${t('cards_total')}</div>
            </div>
          </div>
          <div class="deck-footer">
            ${newC > 0 ? `<span class="deck-pill new">${newC} ${t('cards_new')}</span>` : ''}
            ${due > 0  ? `<span class="deck-pill due">${due} ${t('cards_due')}</span>` : ''}
            <div class="deck-progress-bar" style="flex:1">
              <div class="deck-progress-fill" style="width:${pct}%"></div>
            </div>
          </div>
        </div>`;
    }).join('');
  },
};

/* ═══ 8. DECKS SCREEN ═══ */
const Decks = {
  render() {
    const el = document.getElementById('deckList');
    const now = Date.now();
    const newLimit = DB.getSetting('newPerDay');
    if (DB.data.decks.length === 0) {
      el.innerHTML = `<div class="deck-empty">
        <span class="deck-empty-icon">📚</span>
        <div class="deck-empty-t">${t('no_decks')}</div>
        <div class="deck-empty-s">${t('no_decks_sub')}</div>
      </div>`;
      return;
    }
    el.innerHTML = DB.data.decks.map(deck => {
      const total = deck.cards.length;
      const newC  = Math.min(deck.cards.filter(c => c.repetitions === 0).length, newLimit);
      const due   = deck.cards.filter(c => c.repetitions > 0 && c.dueDate <= now).length;
      const known = deck.cards.filter(c => c.repetitions > 0).length;
      const pct   = total > 0 ? Math.round(known / total * 100) : 0;
      return `
        <div class="deck-card" onclick="Decks.openDetail('${deck.id}')">
          <div class="deck-card-hdr">
            <span class="deck-emoji">${deck.emoji}</span>
            <div class="deck-info">
              <div class="deck-name">${_esc(deck.name)}</div>
              <div class="deck-desc">${_esc(deck.desc || `${total} ${t('cards_total')}`)}</div>
            </div>
            <button class="deck-menu" onclick="event.stopPropagation();Decks.openMenu('${deck.id}')">···</button>
          </div>
          <div class="deck-footer">
            <span class="deck-pill total">${total} ${t('cards_total')}</span>
            ${newC > 0 ? `<span class="deck-pill new">${newC} ${t('cards_new')}</span>` : ''}
            ${due > 0  ? `<span class="deck-pill due">${due} ${t('cards_due')}</span>` : ''}
            <div class="deck-progress-bar">
              <div class="deck-progress-fill" style="width:${pct}%"></div>
            </div>
          </div>
        </div>`;
    }).join('');
  },

  openDetail(deckId) {
    const d = DB.getDeck(deckId);
    if (!d) return;
    HFX.light();
    const now = Date.now();
    const newLimit = DB.getSetting('newPerDay');
    const total = d.cards.length;
    const newC  = Math.min(d.cards.filter(c => c.repetitions === 0).length, newLimit);
    const due   = d.cards.filter(c => c.repetitions > 0 && c.dueDate <= now).length;
    const known = d.cards.filter(c => c.repetitions > 0).length;

    document.getElementById('deckDetailContent').innerHTML = `
      <div class="deck-detail-hero">
        <span class="dh-emoji">${d.emoji}</span>
        <div class="dh-info">
          <div class="dh-name">${_esc(d.name)}</div>
          <div class="dh-sub">${total} ${t('cards_total')} · ${known} ${lang==='en'?'known':'знакомо'}</div>
        </div>
      </div>
      <div class="deck-action-row">
        <button class="deck-action primary" onclick="Study.startDeck('${deckId}');closeSheet('deckDetailOv')">
          <span class="da-icon">🧠</span>${t('study_deck')}
        </button>
        <button class="deck-action ghost" onclick="TestMode.start('${deckId}');closeSheet('deckDetailOv')">
          <span class="da-icon">📝</span>${t('test_mode')}
        </button>
        <button class="deck-action ghost" onclick="MatchMode.start('${deckId}');closeSheet('deckDetailOv')">
          <span class="da-icon">🎯</span>${t('match_mode')}
        </button>
      </div>
      <div class="sec">
        <div class="card">
          <div class="card-row" onclick="UI.openAddCard('${deckId}')">
            <span class="cr-icon green">➕</span>
            <div class="cr-txt"><div class="cr-t">${t('add_card_to')}</div></div>
            <span class="cr-arr">›</span>
          </div>
          <div class="card-row" onclick="UI.openImport('${deckId}');closeSheet('deckDetailOv')">
            <span class="cr-icon blue">📥</span>
            <div class="cr-txt"><div class="cr-t">${t('import')}</div></div>
            <span class="cr-arr">›</span>
          </div>
          <div class="card-row" onclick="UI.openAI('${deckId}');closeSheet('deckDetailOv')">
            <span class="cr-icon purple">✨</span>
            <div class="cr-txt"><div class="cr-t">${t('ai_gen')}</div></div>
            <span class="cr-arr">›</span>
          </div>
          <div class="card-row" onclick="IO.exportDeck('${deckId}')">
            <span class="cr-icon teal">📤</span>
            <div class="cr-txt"><div class="cr-t">${lang==='en'?'Export deck':'Экспорт'}</div></div>
            <span class="cr-arr">›</span>
          </div>
        </div>
      </div>
      <div class="sec">
        <div class="sec-lbl">${lang==='en'?'Cards':'Карточки'} (${total})</div>
        <div class="browse-cards" id="deckCardList">
          ${d.cards.slice(0,50).map(c => `
            <div class="browse-card" onclick="UI.openEditCard('${deckId}','${c.id}')">
              <div class="browse-card-front">${_esc(c.front)}</div>
              <div class="browse-card-back">${_esc(c.back)}</div>
              ${c.tags.length ? `<div class="browse-card-tags">${c.tags.map(tg=>`<span class="tag-pill">${_esc(tg)}</span>`).join('')}</div>` : ''}
            </div>`).join('')}
        </div>
      </div>
    `;
    openSheet('deckDetailOv');
  },

  openMenu(deckId) {
    const d = DB.getDeck(deckId);
    if (!d) return;
    HFX.light();
    document.getElementById('deckMenuContent').innerHTML = `
      <div class="sh-hdr">
        <h3>${_esc(d.name)}</h3>
        <button class="sh-close" onclick="closeSheet('deckMenuOv')">✕</button>
      </div>
      <div class="sh-body" style="display:flex;flex-direction:column;gap:8px">
        <button class="btn-ghost" onclick="Decks.openDetail('${deckId}');closeSheet('deckMenuOv')">${lang==='en'?'Open deck':'Открыть колоду'}</button>
        <button class="btn-ghost" onclick="UI.openEditDeck('${deckId}');closeSheet('deckMenuOv')">${lang==='en'?'Edit deck':'Изменить'}</button>
        <button class="btn-ghost" onclick="IO.exportDeck('${deckId}');closeSheet('deckMenuOv')">${lang==='en'?'Export':'Экспорт'}</button>
        <button class="btn-ghost" style="color:var(--err);border-color:var(--err2)" onclick="Decks.confirmDelete('${deckId}');closeSheet('deckMenuOv')">${t('delete_deck')}</button>
      </div>`;
    openSheet('deckMenuOv');
  },

  confirmDelete(deckId) {
    const d = DB.getDeck(deckId);
    if (!d) return;
    showConfirm('🗑️', t('delete_deck'), t('delete_deck_msg'), t('delete'), () => {
      DB.deleteDeck(deckId);
      Decks.render();
      if (Nav.current === 'home') Home.render();
      showToast(lang==='en'?'Deck deleted':'Колода удалена');
    });
  },
};

/* ═══ 9. STUDY SESSION ═══ */
let session = null;

const Study = {
  startAll() {
    const now = Date.now();
    const newL = DB.getSetting('newPerDay'), revL = DB.getSetting('reviewPerDay');
    let cards = [];
    for (const d of DB.data.decks) {
      const s = SM2.getSession(d, newL, revL);
      cards.push(...s.map(c => ({ ...c, deckId: d.id })));
    }
    if (!cards.length) { showToast(t('no_cards_due')); return; }
    this._start(cards);
  },

  startDeck(deckId) {
    const d = DB.getDeck(deckId);
    if (!d) return;
    const cards = SM2.getSession(d, DB.getSetting('newPerDay'), DB.getSetting('reviewPerDay'));
    if (!cards.length) { showToast(t('no_cards_due')); return; }
    this._start(cards.map(c => ({ ...c, deckId })));
  },

  _start(cards) {
    session = {
      cards: _shuffle(cards),
      index: 0,
      flipped: false,
      correct: 0, total: 0,
      startTime: Date.now()
    };
    document.getElementById('study-wrap').classList.add('on');
    this._render();
    HFX.medium();
  },

  _render() {
    if (!session || session.index >= session.cards.length) {
      this._showDone(); return;
    }
    const card = session.cards[session.index];
    const total = session.cards.length;
    const pct = Math.round(session.index / total * 100);
    session.flipped = false;

    document.getElementById('studyCounter').textContent = `${session.index + 1}/${total}`;
    document.getElementById('studyProgressFill').style.width = pct + '%';

    // Reset flip
    document.getElementById('studyCardInner').classList.remove('flipped');

    // Front
    document.getElementById('studyFrontText').textContent = card.front;
    document.getElementById('studyBackText').textContent = card.back;

    // Rating buttons — show interval preview
    const q = [0,1,2,3];
    q.forEach(quality => {
      const sim = SM2.review({ ...card }, quality);
      const el = document.getElementById('ratingDays' + quality);
      if (el) el.textContent = SM2.intervalLabel(sim.interval, lang);
    });

    // Show/hide rating row
    document.getElementById('studyRatings').style.display = 'none';
    document.getElementById('studyTapHint').style.display = 'flex';
  },

  flip() {
    if (!session || session.flipped) return;
    session.flipped = true;
    document.getElementById('studyCardInner').classList.add('flipped');
    document.getElementById('studyRatings').style.display = 'flex';
    document.getElementById('studyTapHint').style.display = 'none';
    HFX.light();
  },

  rate(quality) {
    if (!session || !session.flipped) return;
    HFX.medium();
    const cardRef = session.cards[session.index];
    const updated = SM2.review({ ...cardRef }, quality);

    // Save to DB
    DB.updateCard(cardRef.deckId, cardRef.id, {
      ...updated, reviews: (cardRef.reviews || 0) + 1,
      lapses: quality === 0 ? (cardRef.lapses || 0) + 1 : (cardRef.lapses || 0)
    });

    if (quality >= 2) session.correct++;
    session.total++;
    session.index++;

    DB.setSetting('totalReviews', (DB.getSetting('totalReviews') || 0) + 1);
    this._render();
  },

  _showDone() {
    const elapsed = Math.round((Date.now() - session.startTime) / 1000);
    const mm = String(Math.floor(elapsed / 60)).padStart(2, '0');
    const ss = String(elapsed % 60).padStart(2, '0');
    const pct = session.total ? Math.round(session.correct / session.total * 100) : 0;

    document.getElementById('studyDone').style.display = 'flex';
    document.getElementById('studyScene').style.display = 'none';
    document.getElementById('studyRatings').style.display = 'none';
    document.getElementById('studyTapHint').style.display = 'none';

    document.getElementById('studyDoneContent').innerHTML = `
      <div class="study-done-icon">🎉</div>
      <div class="study-done-title">${t('session_done')}</div>
      <div class="study-done-sub">${t('session_done_sub')}</div>
      <div class="study-done-stats">
        <div class="done-stat"><div class="done-stat-n">${session.total}</div><div class="done-stat-l">${t('studied')}</div></div>
        <div class="done-stat"><div class="done-stat-n" style="color:var(--ok)">${pct}%</div><div class="done-stat-l">${t('correct_rate')}</div></div>
        <div class="done-stat"><div class="done-stat-n">${mm}:${ss}</div><div class="done-stat-l">${t('time_spent')}</div></div>
      </div>
      <button class="btn" onclick="Study.close()">${t('finish')}</button>
    `;

    // Update streak & achievements
    Streak.update();
    Achievements.check();
    HFX.success();
  },

  close() {
    document.getElementById('study-wrap').classList.remove('on');
    document.getElementById('studyDone').style.display = 'none';
    document.getElementById('studyScene').style.display = 'flex';
    session = null;
    Home.render();
    if (Nav.current === 'decks') Decks.render();
  },
};

/* ═══ 10. BROWSE & SEARCH ═══ */
const Browse = {
  query: '', deckFilter: null,

  render() {
    this._renderFilters();
    this._renderCards();
  },

  _renderFilters() {
    const el = document.getElementById('browseFilters');
    el.innerHTML = `
      <span class="filter-chip ${!this.deckFilter ? 'on' : ''}" onclick="Browse.setFilter(null)">${t('all_decks')}</span>
      ${DB.data.decks.map(d => `
        <span class="filter-chip ${this.deckFilter===d.id ? 'on' : ''}" onclick="Browse.setFilter('${d.id}')">
          ${d.emoji} ${_esc(d.name)}
        </span>`).join('')}
    `;
  },

  _renderCards() {
    const el = document.getElementById('browseCards');
    const q = this.query.toLowerCase();
    let cards = [];
    for (const d of DB.data.decks) {
      if (this.deckFilter && d.id !== this.deckFilter) continue;
      for (const c of d.cards) {
        if (!q || c.front.toLowerCase().includes(q) || c.back.toLowerCase().includes(q) ||
            c.tags.some(tg => tg.toLowerCase().includes(q))) {
          cards.push({ ...c, deckId: d.id, deckName: d.name, deckEmoji: d.emoji });
        }
      }
    }
    if (!cards.length) {
      el.innerHTML = `<div class="empty-state"><span class="empty-state-icon">🔍</span><p>${lang==='en'?'No cards found':'Карточки не найдены'}</p></div>`;
      return;
    }
    el.innerHTML = cards.slice(0, 100).map(c => `
      <div class="browse-card" onclick="UI.openEditCard('${c.deckId}','${c.id}')">
        <div class="browse-card-front">${_esc(c.front)}</div>
        <div class="browse-card-back">${_esc(c.back)}</div>
        ${c.tags.length ? `<div class="browse-card-tags">${c.tags.map(tg=>`<span class="tag-pill">${_esc(tg)}</span>`).join('')}</div>` : ''}
        <div style="font-size:11px;color:var(--t2);margin-top:6px">${c.deckEmoji} ${_esc(c.deckName)}</div>
      </div>`).join('');
  },

  setFilter(deckId) {
    this.deckFilter = deckId;
    HFX.light();
    this.render();
  },

  search(q) {
    this.query = q;
    this._renderCards();
  },
};

/* ═══ 11. SETTINGS SCREEN ═══ */
const Settings = {
  render() {
    const s = DB.data.settings;
    document.getElementById('settContent').innerHTML = `
      <div class="sec">
        <div class="sec-lbl">${t('theme')}</div>
        <div class="card">
          ${['light','dark','auto'].map(th => `
            <div class="card-row" onclick="Settings.setTheme('${th}')">
              <span class="cr-icon ${th==='light'?'gold':th==='dark'?'slate':'blue'}">${th==='light'?'☀️':th==='dark'?'🌙':'⚡'}</span>
              <div class="cr-txt"><div class="cr-t">${t('theme_'+th)}</div></div>
              ${s.theme===th ? '<span style="font-size:18px;color:var(--ok)">✓</span>' : ''}
            </div>`).join('')}
        </div>
      </div>
      <div class="sec">
        <div class="sec-lbl">${t('language')}</div>
        <div class="card">
          ${[['ru','🇷🇺','Русский'],['en','🇺🇸','English']].map(([code,flag,name]) => `
            <div class="card-row" onclick="Settings.setLang('${code}')">
              <span class="cr-icon slate">${flag}</span>
              <div class="cr-txt"><div class="cr-t">${name}</div></div>
              ${lang===code ? '<span style="font-size:18px;color:var(--ok)">✓</span>' : ''}
            </div>`).join('')}
        </div>
      </div>
      <div class="sec">
        <div class="sec-lbl">${lang==='en'?'Study limits':'Лимиты'}</div>
        <div class="card" style="padding:14px 16px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
            <span style="font-size:15px;font-weight:600">${t('new_per_day')}</span>
            <div style="display:flex;align-items:center;gap:10px">
              <button class="btn-sm" onclick="Settings.adjustNewPerDay(-5)">−</button>
              <span style="font-size:17px;font-weight:800;min-width:32px;text-align:center" id="newPerDayVal">${s.newPerDay}</span>
              <button class="btn-sm" onclick="Settings.adjustNewPerDay(5)">+</button>
            </div>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center">
            <span style="font-size:15px;font-weight:600">${t('review_per_day')}</span>
            <div style="display:flex;align-items:center;gap:10px">
              <button class="btn-sm" onclick="Settings.adjustRevPerDay(-10)">−</button>
              <span style="font-size:17px;font-weight:800;min-width:36px;text-align:center" id="revPerDayVal">${s.reviewPerDay}</span>
              <button class="btn-sm" onclick="Settings.adjustRevPerDay(10)">+</button>
            </div>
          </div>
        </div>
      </div>
      <div class="sec">
        <div class="sec-lbl">${t('gemini_key')}</div>
        <div class="card" style="padding:14px 16px">
          <input class="inp" id="geminiKeyInp" type="password" placeholder="${t('gemini_key_ph')}"
            value="${_esc(s.geminiKey || '')}" oninput="Settings.saveGeminiKey(this.value)">
          <div style="font-size:13px;color:var(--t2);margin-top:6px">${t('gemini_key_hint')}</div>
          <div style="margin-top:8px">
            <a href="https://aistudio.google.com/app/apikey" target="_blank"
              style="font-size:13px;color:var(--blue);font-weight:600;text-decoration:none">
              ${lang==='en'?'Get API key →':'Получить ключ →'}
            </a>
          </div>
        </div>
      </div>
      <div class="sec">
        <div class="sec-lbl">${t('data')}</div>
        <div class="card">
          <div class="card-row" onclick="IO.exportAll()">
            <span class="cr-icon teal">📤</span>
            <div class="cr-txt"><div class="cr-t">${t('export_all')}</div></div>
            <span class="cr-arr">›</span>
          </div>
          <div class="card-row" onclick="UI.openImport(null)">
            <span class="cr-icon blue">📥</span>
            <div class="cr-txt"><div class="cr-t">${t('import_cards')}</div></div>
            <span class="cr-arr">›</span>
          </div>
          <div class="card-row" onclick="Settings.deleteAll()">
            <span class="cr-icon red">🗑️</span>
            <div class="cr-txt"><div class="cr-t" style="color:var(--err)">${t('delete_all')}</div></div>
            <span class="cr-arr">›</span>
          </div>
        </div>
      </div>
      <div class="sec">
        <div class="sec-lbl">${t('stats')}</div>
        <div class="stats-grid">
          <div class="stat-tile">
            <div class="stat-tile-n">${DB.getTotalCards()}</div>
            <div class="stat-tile-l">${t('total_cards')}</div>
          </div>
          <div class="stat-tile">
            <div class="stat-tile-n">${DB.data.decks.length}</div>
            <div class="stat-tile-l">${t('total_decks')}</div>
          </div>
          <div class="stat-tile">
            <div class="stat-tile-n" style="color:var(--streak)">${s.streak.current}</div>
            <div class="stat-tile-l">${t('streak_current')}</div>
          </div>
          <div class="stat-tile">
            <div class="stat-tile-n">${s.totalReviews || 0}</div>
            <div class="stat-tile-l">${t('total_reviews')}</div>
          </div>
        </div>
      </div>
      <div class="sec">
        <div class="sec-lbl">${t('achievements')}</div>
        ${Achievements.renderGrid()}
      </div>
      <div style="padding:16px;text-align:center;color:var(--t3);font-size:12px">
        Memo v${VERSION} · Made with ❤️
      </div>
    `;
  },

  setTheme(theme) {
    DB.setSetting('theme', theme);
    applyTheme(theme);
    Settings.render();
    HFX.light();
  },

  setLang(code) {
    lang = code;
    DB.setSetting('language', code);
    _updateNavLabels();
    Settings.render();
    HFX.light();
  },

  adjustNewPerDay(delta) {
    const val = Math.max(1, Math.min(100, DB.getSetting('newPerDay') + delta));
    DB.setSetting('newPerDay', val);
    const el = document.getElementById('newPerDayVal');
    if (el) el.textContent = val;
    HFX.light();
  },

  adjustRevPerDay(delta) {
    const val = Math.max(10, Math.min(500, DB.getSetting('reviewPerDay') + delta));
    DB.setSetting('reviewPerDay', val);
    const el = document.getElementById('revPerDayVal');
    if (el) el.textContent = val;
    HFX.light();
  },

  saveGeminiKey(val) {
    DB.setSetting('geminiKey', val.trim());
  },

  deleteAll() {
    showConfirm('⚠️', t('delete_all'), t('delete_all_msg'), t('delete'), () => {
      DB.data.decks = [];
      DB.data.settings.totalReviews = 0;
      DB.data.settings.streak = { current: 0, best: 0, lastStudy: null };
      DB.data.achievements = {};
      DB.save();
      Settings.render();
      Home.render();
      Decks.render();
      showToast(lang==='en'?'All data deleted':'Все данные удалены');
    });
  },
};

/* ═══ 12. IMPORT / EXPORT ═══ */
const IO = {
  /** Import Anki .txt format: tab-separated front\tback[\ttags] */
  importTxt(text, deckId) {
    if (!deckId) {
      showToast(lang==='en'?'Select a deck first':'Выберите колоду');
      return 0;
    }
    const lines = text.split('\n').filter(l => l.trim() && !l.startsWith('#'));
    let count = 0;
    for (const line of lines) {
      const parts = line.split('\t');
      if (parts.length < 2) continue;
      const front = _decodeHtml(parts[0].trim());
      const back  = _decodeHtml(parts[1].trim());
      if (!front || !back) continue;
      const tags = parts[2] ? parts[2].trim().split(' ').filter(Boolean) : [];
      DB.createCard(deckId, front, back, tags);
      count++;
    }
    DB.save();
    return count;
  },

  exportDeck(deckId) {
    const d = DB.getDeck(deckId);
    if (!d || !d.cards.length) { showToast(lang==='en'?'No cards to export':'Нет карточек'); return; }
    const lines = ['#separator:tab', '#html:false', '#tags column:3', ''];
    for (const c of d.cards) {
      lines.push(`${c.front}\t${c.back}\t${c.tags.join(' ')}`);
    }
    _downloadFile(lines.join('\n'), `${d.name.replace(/[^а-яёa-z0-9]/gi,'_')}.txt`, 'text/plain');
    showToast(lang==='en'?'Exported!':'Экспортировано!');
  },

  exportAll() {
    if (!DB.data.decks.length) { showToast(lang==='en'?'No decks':'Колод нет'); return; }
    const lines = ['#separator:tab', '#html:false', '#deck column:4', '#tags column:3', ''];
    for (const d of DB.data.decks) {
      for (const c of d.cards) {
        lines.push(`${c.front}\t${c.back}\t${c.tags.join(' ')}\t${d.name}`);
      }
    }
    _downloadFile(lines.join('\n'), 'memo_export.txt', 'text/plain');
    showToast(lang==='en'?'Exported!':'Экспортировано!');
  },
};

/* ═══ 13. AI GENERATION (GEMINI) ═══ */
const AI = {
  async generate(topic, count, language, deckId) {
    const key = DB.getSetting('geminiKey');
    if (!key) { showToast(t('ai_no_key')); return; }
    if (!deckId) { showToast(lang==='en'?'Select a deck':'Выберите колоду'); return; }

    const el = document.getElementById('aiStatus');
    el.innerHTML = `<div class="ai-spinner"></div> ${t('ai_generating')}`;

    const prompt = `Create exactly ${count} flashcards about "${topic}".
Language: ${language}.
Return ONLY a valid JSON array, no markdown, no explanation:
[{"front":"question or term","back":"answer or definition"}]
Make the cards educational, clear and concise.`;

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${key}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 4096 }
          })
        }
      );
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);

      const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const jsonMatch = raw.match(/\[[\s\S]*\]/);
      if (!jsonMatch) throw new Error('Invalid response format');

      const cards = JSON.parse(jsonMatch[0]);
      let added = 0;
      for (const c of cards) {
        if (c.front && c.back) { DB.createCard(deckId, c.front, c.back, []); added++; }
      }
      el.innerHTML = `✅ ${t('ai_success')}${added}`;
      Decks.render();
      if (Nav.current === 'home') Home.render();
      HFX.success();
      showToast(t('ai_success') + added);
    } catch(e) {
      el.innerHTML = `❌ ${t('ai_error')}`;
      showToast(t('ai_error'));
      HFX.error();
    }
  },
};

/* ═══ 14. TEST MODE ═══ */
let testSession = null;

const TestMode = {
  start(deckId) {
    const d = DB.getDeck(deckId);
    if (!d || d.cards.length < 4) {
      showToast(lang==='en'?'Need at least 4 cards':'Нужно минимум 4 карточки');
      return;
    }
    HFX.medium();
    testSession = {
      deckId, cards: _shuffle([...d.cards]), index: 0,
      correct: 0, total: 0,
    };
    document.getElementById('test-wrap').classList.add('on');
    this._render();
  },

  _render() {
    if (!testSession || testSession.index >= testSession.cards.length) {
      this._showResult(); return;
    }
    const d = DB.getDeck(testSession.deckId);
    const card = testSession.cards[testSession.index];
    const total = testSession.cards.length;
    const pct = Math.round(testSession.index / total * 100);

    document.getElementById('testProgressFill').style.width = pct + '%';
    document.getElementById('testCounter').textContent = `${testSession.index + 1}/${total}`;
    document.getElementById('testScore').textContent = `${testSession.correct}/${testSession.index}`;

    // Build options: 1 correct + 3 random wrongs
    const others = d.cards.filter(c => c.id !== card.id);
    const wrongs = _shuffle(others).slice(0, 3).map(c => c.back);
    const allOpts = _shuffle([card.back, ...wrongs]);

    document.getElementById('testQuestion').textContent = card.front;
    document.getElementById('testOptions').innerHTML = allOpts.map(opt => `
      <button class="test-option" onclick="TestMode.answer(this,'${_esc(card.back)}','${_esc(opt)}')">${_esc(opt)}</button>
    `).join('');
  },

  answer(btn, correct, chosen) {
    // Disable all options
    document.querySelectorAll('.test-option').forEach(b => b.disabled = true);
    if (chosen === correct) {
      btn.classList.add('correct');
      testSession.correct++;
      HFX.success();
    } else {
      btn.classList.add('wrong');
      // Show correct answer
      document.querySelectorAll('.test-option').forEach(b => {
        if (b.textContent === correct) b.classList.add('correct');
      });
      HFX.error();
    }
    testSession.total++;
    setTimeout(() => { testSession.index++; this._render(); }, 1000);
  },

  _showResult() {
    const pct = testSession.total ? Math.round(testSession.correct / testSession.total * 100) : 0;
    document.getElementById('testOptions').innerHTML = '';
    document.getElementById('testQuestion').innerHTML = `
      <div style="text-align:center;padding:12px 0">
        <div style="font-size:56px;margin-bottom:12px">${pct >= 80 ? '🏆' : pct >= 50 ? '👍' : '📚'}</div>
        <div style="font-size:26px;font-weight:900;letter-spacing:-1px">${t('test_result')}</div>
        <div style="font-size:18px;color:var(--t1);margin-top:8px">${testSession.correct} / ${testSession.total} — ${pct}%</div>
        <div style="display:flex;gap:10px;margin-top:20px">
          <button class="btn-ghost" onclick="TestMode.start('${testSession.deckId}')">${t('test_again')}</button>
          <button class="btn" onclick="TestMode.close()">${t('test_done')}</button>
        </div>
      </div>`;
    HFX.success();
  },

  close() {
    document.getElementById('test-wrap').classList.remove('on');
    testSession = null;
  },
};

/* ═══ 15. MATCH MODE ═══ */
let matchSession = null;

const MatchMode = {
  start(deckId) {
    const d = DB.getDeck(deckId);
    if (!d || d.cards.length < 4) {
      showToast(lang==='en'?'Need at least 4 cards':'Нужно минимум 4 карточки');
      return;
    }
    HFX.medium();
    const pairs = _shuffle([...d.cards]).slice(0, 6); // up to 6 pairs
    matchSession = {
      deckId, pairs,
      selected: null, matched: new Set(),
      errors: 0,
    };
    document.getElementById('match-wrap').classList.add('on');
    this._render();
  },

  _render() {
    if (!matchSession) return;
    const { pairs, matched } = matchSession;
    const left  = Math.floor((pairs.length * 2 - matched.size) / 2);

    document.getElementById('matchPairsLeft').textContent = `${left} ${t('match_pairs')}`;

    // Build shuffled grid: fronts on left column, backs on right column (shuffled independently)
    const fronts = _shuffle(pairs.map(c => ({ id: 'f_' + c.id, text: c.front, pairId: c.id, type: 'front' })));
    const backs  = _shuffle(pairs.map(c => ({ id: 'b_' + c.id, text: c.back,  pairId: c.id, type: 'back' })));

    // Interleave into one grid
    const allTiles = [];
    for (let i = 0; i < pairs.length; i++) {
      allTiles.push(fronts[i], backs[i]);
    }

    document.getElementById('matchGrid').innerHTML = allTiles.map(tile => `
      <div class="match-tile ${matched.has(tile.id) ? 'matched' : ''}"
           id="mt_${tile.id}"
           data-id="${tile.id}" data-pair="${tile.pairId}" data-type="${tile.type}"
           onclick="MatchMode.pick('${tile.id}','${tile.pairId}')">
        ${_esc(tile.text)}
      </div>`).join('');
  },

  pick(tileId, pairId) {
    if (!matchSession) return;
    if (matchSession.matched.has(tileId)) return;
    const tile = document.getElementById('mt_' + tileId);
    if (!tile) return;

    HFX.light();

    if (!matchSession.selected) {
      // First selection
      matchSession.selected = { tileId, pairId };
      tile.classList.add('selected');
    } else {
      const prev = matchSession.selected;
      // Check match: same pairId, different type
      const prevTile = document.getElementById('mt_' + prev.tileId);
      if (prev.pairId === pairId && prev.tileId !== tileId) {
        // Match!
        tile.classList.add('matched');
        if (prevTile) prevTile.classList.add('matched');
        matchSession.matched.add(tileId);
        matchSession.matched.add(prev.tileId);
        matchSession.selected = null;
        HFX.success();
        // Check win
        if (matchSession.matched.size === matchSession.pairs.length * 2) {
          setTimeout(() => {
            showToast(t('match_done'));
            HFX.heavy();
            setTimeout(() => MatchMode.close(), 1800);
          }, 400);
        }
      } else {
        // Wrong
        tile.classList.add('wrong');
        if (prev.tileId !== tileId && prevTile) prevTile.classList.add('wrong');
        matchSession.errors++;
        HFX.error();
        setTimeout(() => {
          tile.classList.remove('wrong', 'selected');
          if (prevTile) prevTile.classList.remove('wrong', 'selected');
          matchSession.selected = null;
        }, 600);
        return;
      }
    }
  },

  close() {
    document.getElementById('match-wrap').classList.remove('on');
    matchSession = null;
  },
};

/* ═══ 16. ACHIEVEMENTS ═══ */
const ACHIEVEMENTS_DEF = [
  { id: 'first_study', icon: '🌟', key: 'ach_first_study', cond: d => (d.settings.totalReviews || 0) >= 1 },
  { id: 'streak3',     icon: '🔥', key: 'ach_streak3',     cond: d => d.settings.streak.current >= 3 },
  { id: 'streak7',     icon: '🏅', key: 'ach_streak7',     cond: d => d.settings.streak.current >= 7 },
  { id: 'streak30',    icon: '🏆', key: 'ach_streak30',    cond: d => d.settings.streak.current >= 30 },
  { id: '100cards',    icon: '💯', key: 'ach_100cards',    cond: d => (d.settings.totalReviews || 0) >= 100 },
  { id: '500cards',    icon: '🚀', key: 'ach_500cards',    cond: d => (d.settings.totalReviews || 0) >= 500 },
  { id: 'first_deck',  icon: '📚', key: 'ach_first_deck',  cond: d => d.decks.length >= 1 },
  { id: '5decks',      icon: '🗃️', key: 'ach_5decks',      cond: d => d.decks.length >= 5 },
  { id: 'perfect',     icon: '✨', key: 'ach_perfect',     cond: d => d.achievements?.perfect },
];

const Achievements = {
  check() {
    const ach = DB.data.achievements;
    for (const a of ACHIEVEMENTS_DEF) {
      if (!ach[a.id] && a.cond(DB.data)) {
        ach[a.id] = Date.now();
        DB.save();
        showToast(`🏆 ${t(a.key)}!`);
        HFX.success();
      }
    }
  },

  renderGrid() {
    const ach = DB.data.achievements || {};
    return `<div class="achieve-grid">
      ${ACHIEVEMENTS_DEF.map(a => {
        const unlocked = !!ach[a.id];
        return `<div class="achieve-tile ${unlocked ? '' : 'locked'}">
          <span class="achieve-icon">${a.icon}</span>
          <div class="achieve-name">${t(a.key)}</div>
          <div class="achieve-desc">${t(a.key+'_d')}</div>
          ${unlocked ? '<div class="achieve-unlocked-badge">✓</div>' : ''}
        </div>`;
      }).join('')}
    </div>`;
  },
};

/* ═══ STREAK ═══ */
const Streak = {
  update() {
    const s = DB.data.settings.streak;
    const today = new Date().toDateString();
    if (s.lastCheck === today) return; // already updated today
    const yesterday = new Date(Date.now() - 864e5).toDateString();
    if (s.lastStudy === yesterday) {
      s.current++;
    } else if (s.lastStudy !== today) {
      s.current = 1;
    }
    s.best = Math.max(s.best, s.current);
    s.lastStudy = today;
    s.lastCheck = today;
    DB.save();
  },
};

/* ═══ 17. UI HELPERS ═══ */
const UI = {
  openAddDeck() {
    const isEdit = false;
    document.getElementById('deckSheetTitle').textContent = t('add_deck');
    document.getElementById('deckNameInp').value = '';
    document.getElementById('deckDescInp').value = '';
    document.getElementById('deckSheetId').value = '';
    _renderColorPicker('', 'purple');
    _renderEmojiPicker('', '📚');
    openSheet('deckSheetOv');
  },

  openEditDeck(deckId) {
    const d = DB.getDeck(deckId);
    if (!d) return;
    document.getElementById('deckSheetTitle').textContent = t('edit_deck');
    document.getElementById('deckNameInp').value = d.name;
    document.getElementById('deckDescInp').value = d.desc || '';
    document.getElementById('deckSheetId').value = deckId;
    _renderColorPicker(deckId, d.color);
    _renderEmojiPicker(deckId, d.emoji);
    openSheet('deckSheetOv');
  },

  saveDeck() {
    const id = document.getElementById('deckSheetId').value;
    const name = document.getElementById('deckNameInp').value.trim();
    if (!name) { showToast(lang==='en'?'Enter deck name':'Введите название'); return; }
    const desc  = document.getElementById('deckDescInp').value.trim();
    const color = document.getElementById('deckSheetColor').dataset.val || 'purple';
    const emoji = document.getElementById('deckSheetEmoji').dataset.val || '📚';
    if (id) {
      DB.updateDeck(id, { name, desc, color, emoji });
    } else {
      const d = DB.createDeck(name, desc, emoji, color);
      Achievements.check();
    }
    Decks.render();
    if (Nav.current === 'home') Home.render();
    closeSheet('deckSheetOv');
    showToast(lang==='en'?'Saved!':'Сохранено!');
    HFX.success();
  },

  openAddCard(deckId) {
    document.getElementById('cardSheetTitle').textContent = t('add_card');
    document.getElementById('cardFrontInp').value = '';
    document.getElementById('cardBackInp').value = '';
    document.getElementById('cardTagsInp').value = '';
    document.getElementById('cardSheetDeckId').value = deckId;
    document.getElementById('cardSheetCardId').value = '';
    document.getElementById('cardSheetDelete').style.display = 'none';
    openSheet('cardSheetOv');
  },

  openEditCard(deckId, cardId) {
    const c = DB.getCard(deckId, cardId);
    if (!c) return;
    document.getElementById('cardSheetTitle').textContent = t('edit_card');
    document.getElementById('cardFrontInp').value = c.front;
    document.getElementById('cardBackInp').value = c.back;
    document.getElementById('cardTagsInp').value = c.tags.join(', ');
    document.getElementById('cardSheetDeckId').value = deckId;
    document.getElementById('cardSheetCardId').value = cardId;
    document.getElementById('cardSheetDelete').style.display = 'block';
    openSheet('cardSheetOv');
  },

  saveCard() {
    const deckId  = document.getElementById('cardSheetDeckId').value;
    const cardId  = document.getElementById('cardSheetCardId').value;
    const front   = document.getElementById('cardFrontInp').value.trim();
    const back    = document.getElementById('cardBackInp').value.trim();
    const tagsRaw = document.getElementById('cardTagsInp').value;
    const tags    = tagsRaw.split(',').map(t => t.trim()).filter(Boolean);
    if (!front || !back) { showToast(lang==='en'?'Fill in both sides':'Заполните обе стороны'); return; }
    if (cardId) {
      DB.updateCard(deckId, cardId, { front, back, tags });
    } else {
      DB.createCard(deckId, front, back, tags);
    }
    closeSheet('cardSheetOv');
    // Refresh card list if deck detail open
    const listEl = document.getElementById('deckCardList');
    if (listEl) Decks.openDetail(deckId);
    Browse.render();
    showToast(lang==='en'?'Saved!':'Сохранено!');
    HFX.success();
  },

  deleteCard() {
    const deckId = document.getElementById('cardSheetDeckId').value;
    const cardId = document.getElementById('cardSheetCardId').value;
    showConfirm('🗑️', t('delete_card'), lang==='en'?'This cannot be undone.':'Это действие необратимо.', t('delete'), () => {
      DB.deleteCard(deckId, cardId);
      closeSheet('cardSheetOv');
      Browse.render();
      showToast(lang==='en'?'Card deleted':'Карточка удалена');
    });
  },

  openImport(deckId) {
    document.getElementById('importDeckSelect').value = deckId || '';
    document.getElementById('importStatus').textContent = '';
    _rebuildDeckSelect('importDeckSelect');
    if (deckId) document.getElementById('importDeckSelect').value = deckId;
    openSheet('importSheetOv');
  },

  handleImportFile(input) {
    const file = input.files[0];
    if (!file) return;
    const deckId = document.getElementById('importDeckSelect').value;
    const statusEl = document.getElementById('importStatus');
    if (!deckId) {
      showToast(lang==='en'?'Select a deck first':'Выберите колоду');
      return;
    }
    const reader = new FileReader();
    reader.onload = e => {
      const count = IO.importTxt(e.target.result, deckId);
      statusEl.textContent = `✅ ${t('import_success')}${count}`;
      Decks.render();
      if (Nav.current === 'home') Home.render();
      HFX.success();
      showToast(t('import_success') + count);
    };
    reader.onerror = () => { statusEl.textContent = `❌ ${t('import_error')}`; };
    reader.readAsText(file, 'UTF-8');
    input.value = '';
  },

  openAI(deckId) {
    document.getElementById('aiDeckSelect').value = deckId || '';
    document.getElementById('aiStatus').textContent = '';
    document.getElementById('aiTopicInp').value = '';
    document.getElementById('aiCountInp').value = '10';
    _rebuildDeckSelect('aiDeckSelect');
    if (deckId) document.getElementById('aiDeckSelect').value = deckId;
    openSheet('aiSheetOv');
  },

  runAI() {
    const topic  = document.getElementById('aiTopicInp').value.trim();
    const count  = parseInt(document.getElementById('aiCountInp').value) || 10;
    const aiLang = document.getElementById('aiLangSelect').value;
    const deckId = document.getElementById('aiDeckSelect').value;
    if (!topic) { showToast(lang==='en'?'Enter a topic':'Введите тему'); return; }
    AI.generate(topic, Math.min(count, 30), aiLang, deckId);
  },
};

/* ═══ TOAST ═══ */
let _toastTimer = null;
function showToast(msg, duration = 2500) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => el.classList.remove('show'), duration);
}

/* ═══ CONFIRM ═══ */
let _confirmCallback = null;
function showConfirm(icon, title, msg, okLabel, cb) {
  document.getElementById('confirmIcon').textContent = icon;
  document.getElementById('confirmTitle').textContent = title;
  document.getElementById('confirmMsg').textContent = msg;
  document.getElementById('confirmOkBtn').textContent = okLabel;
  _confirmCallback = cb;
  document.getElementById('confirmOv').classList.add('on');
  HFX.medium();
}
function confirmOk() {
  document.getElementById('confirmOv').classList.remove('on');
  if (_confirmCallback) { _confirmCallback(); _confirmCallback = null; }
}
function confirmCancel() {
  document.getElementById('confirmOv').classList.remove('on');
  _confirmCallback = null;
}

/* ═══ SHEETS ═══ */
function openSheet(id) {
  document.getElementById(id).classList.add('on');
  HFX.light();
}
function closeSheet(id) {
  document.getElementById(id).classList.remove('on');
}

/* ═══ THEME ═══ */
function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === 'auto') {
    const sys = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    root.setAttribute('data-theme', sys);
  } else {
    root.setAttribute('data-theme', theme);
  }
  // Update manifest theme-color meta
  const mc = document.getElementById('themeColorMeta');
  if (mc) mc.content = theme === 'dark' ? '#0F0E0C' : '#F2F0EB';
}

/* ═══ UTILS ═══ */
function _uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}
function _shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function _esc(str) {
  return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
function _decodeHtml(html) {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}
function _downloadFile(content, filename, type) {
  const a = document.createElement('a');
  const blob = new Blob([content], { type });
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
function _rebuildDeckSelect(selectId) {
  const el = document.getElementById(selectId);
  if (!el) return;
  el.innerHTML = `<option value="">${lang==='en'?'Select deck...':'Выберите колоду...'}</option>` +
    DB.data.decks.map(d => `<option value="${d.id}">${d.emoji} ${_esc(d.name)}</option>`).join('');
}
function _renderColorPicker(deckId, selected) {
  const el = document.getElementById('deckColorPicker');
  el.innerHTML = DECK_COLORS.map(c => `
    <div class="color-dot cr-icon ${c} ${c === selected ? 'on' : ''}"
         style="box-shadow:${c===selected?'0 0 0 3px var(--bg1),0 0 0 5px var(--t0)':'none'}"
         onclick="_selectColor(this,'${c}','${deckId}')"></div>
  `).join('');
  document.getElementById('deckSheetColor').dataset.val = selected;
}
function _selectColor(el, color, deckId) {
  document.querySelectorAll('#deckColorPicker .color-dot').forEach(d => {
    d.classList.remove('on');
    d.style.boxShadow = 'none';
  });
  el.classList.add('on');
  el.style.boxShadow = '0 0 0 3px var(--bg1),0 0 0 5px var(--t0)';
  document.getElementById('deckSheetColor').dataset.val = color;
  HFX.light();
}
function _renderEmojiPicker(deckId, selected) {
  const el = document.getElementById('deckEmojiPicker');
  el.innerHTML = DECK_EMOJIS.map(e => `
    <div style="width:38px;height:38px;border-radius:12px;display:flex;align-items:center;justify-content:center;
         font-size:22px;cursor:pointer;background:${e===selected?'var(--f1)':'transparent'};
         border:${e===selected?'2px solid var(--b0)':'2px solid transparent'};transition:all .18s"
         onclick="_selectEmoji(this,'${e}')">
      ${e}
    </div>`).join('');
  document.getElementById('deckSheetEmoji').dataset.val = selected;
}
function _selectEmoji(el, emoji) {
  document.querySelectorAll('#deckEmojiPicker > div').forEach(d => {
    d.style.background = 'transparent';
    d.style.border = '2px solid transparent';
  });
  el.style.background = 'var(--f1)';
  el.style.border = '2px solid var(--b0)';
  document.getElementById('deckSheetEmoji').dataset.val = emoji;
  HFX.light();
}

/* ── Nav pill animation (same as CalSnap) ── */
function _updatePill() {
  const pill = document.getElementById('navPill');
  const active = document.querySelector('.nb.on');
  if (!pill || !active) return;
  const PAD = 0.06;
  const r = active.getBoundingClientRect();
  const nr = document.getElementById('nav').getBoundingClientRect();
  pill.style.left = (r.left - nr.left + r.width * PAD) + 'px';
  pill.style.width = (r.width * (1 - PAD * 2)) + 'px';
}

function _updateNavLabels() {
  const labels = ['home','decks','browse','settings'];
  const keys   = ['nav_home','nav_decks','nav_browse','nav_settings'];
  labels.forEach((id, i) => {
    const el = document.querySelector(`.nb[data-tab="${id}"] .nb-lbl`);
    if (el) el.textContent = t(keys[i]);
  });
}

/* ═══ 18. SERVICE WORKER ═══ */
function _registerSW() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
}

/* ═══ ONBOARDING ═══ */
function _showOnboarding() {
  document.getElementById('onboard').classList.add('on');
}
function finishOnboard() {
  DB.setSetting('firstLaunch', false);
  DB.save();
  document.getElementById('onboard').classList.remove('on');
  Nav.go('home');
}
function skipOnboard() { finishOnboard(); }

/* ═══ 19. INIT ═══ */
document.addEventListener('DOMContentLoaded', () => {
  DB.init();
  lang = DB.getSetting('language') || 'ru';
  applyTheme(DB.getSetting('theme') || 'light');
  _registerSW();

  // Auto-detect system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (DB.getSetting('theme') === 'auto') applyTheme('auto');
  });

  // Nav
  document.getElementById('nav').classList.add('on');
  document.querySelectorAll('.nb').forEach(btn => {
    btn.addEventListener('click', () => Nav.go(btn.dataset.tab));
  });
  _updateNavLabels();

  // Study card flip on tap
  document.getElementById('studyCardInner').addEventListener('click', Study.flip.bind(Study));

  // Search input
  const searchInp = document.getElementById('searchInp');
  if (searchInp) {
    searchInp.addEventListener('input', e => Browse.search(e.target.value));
  }

  // Close sheets on backdrop tap
  document.querySelectorAll('.ov').forEach(ov => {
    ov.addEventListener('click', e => {
      if (e.target === ov) { ov.classList.remove('on'); }
    });
  });

  // Import drop zone
  const upzone = document.getElementById('uploadZone');
  if (upzone) {
    upzone.addEventListener('dragover', e => { e.preventDefault(); upzone.classList.add('drag'); });
    upzone.addEventListener('dragleave', () => upzone.classList.remove('drag'));
    upzone.addEventListener('drop', e => {
      e.preventDefault();
      upzone.classList.remove('drag');
      const file = e.dataTransfer.files[0];
      if (file) _handleDroppedFile(file);
    });
  }

  // Show splash then init
  const splash = document.getElementById('splashOv');
  setTimeout(() => {
    if (splash) {
      splash.classList.add('hide');
      setTimeout(() => { splash.style.display = 'none'; }, 600);
    }
    if (DB.getSetting('firstLaunch') !== false) {
      _showOnboarding();
    } else {
      Nav.go('home');
    }
    // Pill positioning after layout
    requestAnimationFrame(() => requestAnimationFrame(_updatePill));
  }, 1400);
});

function _handleDroppedFile(file) {
  const deckId = document.getElementById('importDeckSelect').value;
  if (!deckId) { showToast(lang==='en'?'Select a deck first':'Выберите колоду'); return; }
  const reader = new FileReader();
  reader.onload = e => {
    const count = IO.importTxt(e.target.result, deckId);
    document.getElementById('importStatus').textContent = `✅ ${t('import_success')}${count}`;
    Decks.render();
    showToast(t('import_success') + count);
  };
  reader.readAsText(file, 'UTF-8');
}

// Error tracking
window._errors = [];
window.onerror = (m, s, l) => { window._errors.push(`${m} (${s}:${l})`); };
window.addEventListener('unhandledrejection', e => { window._errors.push('Promise: ' + e.reason); });
