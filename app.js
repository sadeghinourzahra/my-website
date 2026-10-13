/**
 * Sticky Notes Application with Bootstrap 5, Themes (White, Cream, Black, Sky)
 * Features:
 * - Theme switcher: White, Cream, Black, Sky with Net overlay
 * - Prominent "Add" button triggering the Bootstrap Add Note Modal
 * - Full Persian (فارسی) & English language toggle with SEO metadata updates
 * - Notebooks: 'todo' (To do it), 'remember' (My remember it), 'history' (My history)
 * - Finish button on notes with celebratory Web Audio synthesizer & Bootstrap modal chooser
 * - Live real-time search filtering
 * - LocalStorage persistence
 */

const STORAGE_KEY = 'sticky_notes_data_v2';
const LANG_STORAGE_KEY = 'sticky_notes_lang';
const THEME_STORAGE_KEY = 'sticky_notes_theme';
const COLOR_PALETTE = ['yellow', 'pink', 'blue', 'green', 'purple', 'orange'];

// State
let currentLang = localStorage.getItem(LANG_STORAGE_KEY) || 'fa';
let currentTheme = localStorage.getItem(THEME_STORAGE_KEY) || 'sky';
let activeNotebookFilter = 'all';
let searchQuery = '';
let selectedModalColor = 'yellow';
let pendingFinishNoteId = null;

// Bootstrap modal instances
let addNoteModalInstance = null;
let notebookModalInstance = null;
let bootstrapToastInstance = null;

// Bilingual translations dictionary
const I18N = {
  fa: {
    pageTitle: "یادداشت‌های چسبان | Sticky Notes Board - برنامه مدیریت کارها و یادداشت",
    seoDescription: "برنامه تابلوی یادداشت‌های چسبان آنلاین با تم‌های سفید، کرم، مشکی و آسمان، پشتیبانی کامل از زبان فارسی و انگلیسی، دسته‌بندی در دفترچه‌های کارهای من (To do it)، یادآوری‌ها (Remember) و تاریخچه (History) با ذخیره‌سازی خودکار.",
    boardTitle: "یادداشت‌های چسبان",
    addBtn: "افزودن یادداشت",
    themeLabel: "رنگ پس‌زمینه:",
    searchPlaceholder: "جستجو در یادداشت‌ها...",
    langToggle: "English",
    justNotes: "فقط یادداشت‌ها",
    showControls: "نمایش کنترل‌ها",
    tabAll: "همه یادداشت‌ها",
    tabTodo: "کارهای من",
    tabRemember: "یادآوری‌های من",
    tabHistory: "تاریخچه من",
    badgeTodo: "📋 کارهای من",
    badgeRemember: "🧠 یادآوری",
    badgeHistory: "📜 تاریخچه",
    finishBtn: "تکمیل",
    undoFinishBtn: "بازگشت",
    finishedStamp: "تکمیل شد ✓",
    noteSingular: "یادداشت",
    notePlural: "یادداشت",
    emptyTitle: "هیچ یادداشتی در این بخش نیست!",
    emptyDesc: "روی دکمه «افزودن یادداشت» کلیک کنید یا یادداشتی را به این دفترچه منتقل نمایید.",
    addNoteModalTitle: "افزودن یادداشت چسبان جدید",
    noteContentLabel: "متن یادداشت:",
    modalTextareaPlaceholder: "متن یادداشت خود را اینجا بنویسید...",
    shortcutHint: "کلید میانبر: فشردن Ctrl + Enter برای ثبت سریع",
    chooseNotebookLabel: "انتخاب دفترچه:",
    chooseColorLabel: "رنگ برگه یادداشت:",
    modalTitle: "تکمیل و انتقال به دفترچه",
    modalDesc: "تبریک! یادداشت تکمیل شد. می‌خواهید در کدام دفترچه ذخیره شود؟",
    recommended: "پیشنهادی",
    historyHint: "ثبت در تاریخچه و آرشیو کارهای انجام‌شده",
    rememberHint: "نگه‌داری به عنوان نکته یا یادآوری مهم",
    todoHint: "نگه‌داری در لیست کارهای روزانه",
    cancel: "انصراف",
    filterAll: "نمایش تمام یادداشت‌ها",
    filterTodo: "نمایش: دفترچه کارهای من",
    filterRemember: "نمایش: دفترچه یادآوری‌ها",
    filterHistory: "نمایش: دفترچه تاریخچه",
    deleteTitle: "حذف یادداشت",
    editHint: "کلیک برای ویرایش متن",
    toastNoteAdded: "یادداشت جدید با موفقیت روی تابلو چسبانده شد 📌",
    toastNoteFinished: "یادداشت تکمیل شد! به کدام دفترچه منتقل شود؟ 🎉",
    toastNoteMoved: "یادداشت به دفترچه جدید منتقل شد ✨",
    toastNoteDeleted: "یادداشت کنده و حذف شد 🗑️",
    toastLangChanged: "زبان به فارسی تغییر یافت 🇮🇷",
    toastThemeChanged: "تم پس‌زمینه با موفقیت تغییر کرد 🎨"
  },
  en: {
    pageTitle: "Sticky Notes Board | Task & Sticky Notes Organizer",
    seoDescription: "Realistic sticky notes bulletin board with White, Cream, Black, and Sky themes, Bootstrap 5, Persian and English language support, and notebooks for To do it, Remember, and History.",
    boardTitle: "Sticky Notes",
    addBtn: "Add Note",
    themeLabel: "Background Color:",
    searchPlaceholder: "Search notes...",
    langToggle: "فارسی",
    justNotes: "Just Notes",
    showControls: "Show Controls",
    tabAll: "All Notes",
    tabTodo: "To do it",
    tabRemember: "My remember it",
    tabHistory: "My history",
    badgeTodo: "📋 To do it",
    badgeRemember: "🧠 Remember",
    badgeHistory: "📜 History",
    finishBtn: "Finish",
    undoFinishBtn: "Reopen",
    finishedStamp: "DONE ✓",
    noteSingular: "note",
    notePlural: "notes",
    emptyTitle: "No notes in this notebook!",
    emptyDesc: "Click the 'Add Note' button to create a new sticky note or move a note here.",
    addNoteModalTitle: "Add New Sticky Note",
    noteContentLabel: "Note Content:",
    modalTextareaPlaceholder: "Type your note here...",
    shortcutHint: "Shortcut: Press Ctrl + Enter to quickly save",
    chooseNotebookLabel: "Choose Notebook:",
    chooseColorLabel: "Note Color:",
    modalTitle: "Finish & Choose Notebook",
    modalDesc: "Congratulations! Note finished. Which notebook would you like to keep it in?",
    recommended: "Recommended",
    historyHint: "Saved in history & finished archive",
    rememberHint: "Kept as an important reminder",
    todoHint: "Kept in daily to-do list",
    cancel: "Cancel",
    filterAll: "Showing all notes",
    filterTodo: "Showing: To do it",
    filterRemember: "Showing: My remember it",
    filterHistory: "Showing: My history",
    deleteTitle: "Delete note",
    editHint: "Click to edit text",
    toastNoteAdded: "New note pinned to the board! 📌",
    toastNoteFinished: "Note completed! Choose destination notebook 🎉",
    toastNoteMoved: "Note moved to selected notebook ✨",
    toastNoteDeleted: "Note peeled off and deleted 🗑️",
    toastLangChanged: "Language switched to English 🌐",
    toastThemeChanged: "Background theme updated 🎨"
  }
};

// Default starter notes
const STARTER_NOTES = {
  fa: [
    {
      id: 'starter-fa-1',
      text: "✨ به تابلوی یادداشت‌های چسبان خوش آمدید!\nمی‌توانید رنگ پس‌زمینه را به سفید، کرم، مشکی یا آسمانی تغییر دهید.",
      color: 'blue',
      notebook: 'todo',
      isFinished: false,
      rotation: -1.8,
      createdAt: Date.now() - 3600000 * 2
    },
    {
      id: 'starter-fa-2',
      text: "📋 کارهای من:\n• بررسی طراحی وبسایت با بوت‌استرپ ۵\n• تست رنگ‌های پس‌زمینه (سفید، کرم، مشکی) 🎨\n• جلسه تیمی ساعت ۴",
      color: 'yellow',
      notebook: 'todo',
      isFinished: false,
      rotation: 1.5,
      createdAt: Date.now() - 3600000 * 4
    },
    {
      id: 'starter-fa-3',
      text: "🧠 یادآوری مهم:\nبا زدن دکمه «تکمیل» روی هر یادداشت، پنجره انتخاب دفترچه باز شده و می‌توانید آن را به تاریخچه منتقل کنید!",
      color: 'pink',
      notebook: 'remember',
      isFinished: false,
      rotation: -1.2,
      createdAt: Date.now() - 3600000 * 6
    },
    {
      id: 'starter-fa-4',
      text: "📜 سابقه کارها:\nانتخاب رنگ پس‌زمینه (سفید، کرم، مشکی) و دکمه جدید افزودن یادداشت پیاده‌سازی شد.",
      color: 'green',
      notebook: 'history',
      isFinished: true,
      finishedAt: Date.now() - 3600000 * 1,
      rotation: 2.2,
      createdAt: Date.now() - 3600000 * 10
    }
  ],
  en: [
    {
      id: 'starter-en-1',
      text: "✨ Welcome to Sticky Notes Board!\nSwitch background colors between White, Cream, Black, and Sky anytime.",
      color: 'blue',
      notebook: 'todo',
      isFinished: false,
      rotation: -1.8,
      createdAt: Date.now() - 3600000 * 2
    },
    {
      id: 'starter-en-2',
      text: "📋 To do it:\n• Test White, Cream & Black themes 🎨\n• Review Bootstrap 5 UI responsiveness\n• Team sync at 4 PM",
      color: 'yellow',
      notebook: 'todo',
      isFinished: false,
      rotation: 1.5,
      createdAt: Date.now() - 3600000 * 4
    },
    {
      id: 'starter-en-3',
      text: "🧠 My remember it:\nClick the 'Finish' button to mark any note done and select its notebook destination!",
      color: 'pink',
      notebook: 'remember',
      isFinished: false,
      rotation: -1.2,
      createdAt: Date.now() - 3600000 * 6
    },
    {
      id: 'starter-en-4',
      text: "📜 My history:\nTheme switcher and prominent Add button features added successfully.",
      color: 'green',
      notebook: 'history',
      isFinished: true,
      finishedAt: Date.now() - 3600000 * 1,
      rotation: 2.2,
      createdAt: Date.now() - 3600000 * 10
    }
  ]
};

// DOM References
const addBtn = document.getElementById('add-btn');
const notesGrid = document.getElementById('notes-grid');
const noteCountBadge = document.getElementById('note-count-badge');
const toggleViewBtn = document.getElementById('toggle-view-btn');
const langToggleBtn = document.getElementById('lang-toggle-btn');
const langLabel = document.getElementById('lang-label');
const toolbar = document.getElementById('toolbar');
const emptyState = document.getElementById('empty-state');
const tabButtons = document.querySelectorAll('#notebook-tabs-group .nav-link');
const filterText = document.getElementById('filter-text');
const searchInput = document.getElementById('search-input');
const bootstrapCssLink = document.getElementById('bootstrap-css');
const themeDotButtons = document.querySelectorAll('.btn-theme-dot');

// Add Note Modal DOM References
const addNoteModalEl = document.getElementById('addNoteModal');
const modalNoteTextarea = document.getElementById('modal-note-textarea');
const modalNotebookSelect = document.getElementById('modal-notebook-select');
const modalSubmitAddBtn = document.getElementById('modal-submit-add-btn');
const modalSwatches = document.querySelectorAll('.modal-swatch');

// Finish Note Modal DOM References
const notebookModalEl = document.getElementById('notebookBootstrapModal');
const choiceItems = document.querySelectorAll('.choice-item');

// Toast DOM
const toastElement = document.getElementById('actionToast');
const toastMessage = document.getElementById('toastMessage');
const toastIcon = document.getElementById('toastIcon');

/**
 * Web Audio API Sound Synthesizer
 */
function playSound(type) {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    const now = ctx.currentTime;

    if (type === 'add') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (type === 'finish') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(587.33, now);
      osc.frequency.setValueAtTime(880, now + 0.08);
      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc.start(now);
      osc.stop(now + 0.28);
    } else if (type === 'delete') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.14);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      osc.start(now);
      osc.stop(now + 0.14);
    } else if (type === 'error') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, now);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.start(now);
      osc.stop(now + 0.18);
    }
  } catch (e) {
    // Autoplay fallback
  }
}

/**
 * Bootstrap Toast
 */
function showToast(msg, icon = '✨') {
  if (toastElement && window.bootstrap) {
    if (!bootstrapToastInstance) {
      bootstrapToastInstance = new bootstrap.Toast(toastElement, { delay: 3000 });
    }
    if (toastMessage) toastMessage.textContent = msg;
    if (toastIcon) toastIcon.textContent = icon;
    bootstrapToastInstance.show();
  }
}

/**
 * Storage Helpers
 */
function getSavedNotes() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    const starters = STARTER_NOTES[currentLang] || STARTER_NOTES.fa;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(starters));
    return [...starters];
  }
  try {
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

function saveNotes(notes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  updateCounts();
}

/**
 * Theme Manager: White, Cream, Black, Sky
 */
function setTheme(theme) {
  currentTheme = theme;
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  document.documentElement.setAttribute('data-bg-theme', theme);

  // Sync theme dot buttons
  themeDotButtons.forEach(btn => {
    if (btn.dataset.theme === theme) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Adjust Bootstrap theme attribute for dark contrast
  if (theme === 'black') {
    document.documentElement.setAttribute('data-bs-theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-bs-theme', 'light');
  }
}

/**
 * Notebook Counters and Badges
 */
function updateCounts() {
  const notes = getSavedNotes();
  const t = I18N[currentLang];

  const total = notes.length;
  const todoCount = notes.filter(n => n.notebook === 'todo').length;
  const rememberCount = notes.filter(n => n.notebook === 'remember').length;
  const historyCount = notes.filter(n => n.notebook === 'history').length;

  const countUnit = total === 1 ? t.noteSingular : t.notePlural;
  const displayTotal = currentLang === 'fa' ? toPersianDigits(total) : total;
  if (noteCountBadge) {
    noteCountBadge.textContent = `${displayTotal} ${countUnit}`;
  }

  const setTabCount = (id, count) => {
    const el = document.getElementById(id);
    if (el) el.textContent = currentLang === 'fa' ? toPersianDigits(count) : count;
  };

  setTabCount('count-all', total);
  setTabCount('count-todo', todoCount);
  setTabCount('count-remember', rememberCount);
  setTabCount('count-history', historyCount);
}

function toPersianDigits(num) {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return num.toString().replace(/\d/g, d => persianDigits[d]);
}

function formatTime(timestamp) {
  const d = new Date(timestamp);
  const locale = currentLang === 'fa' ? 'fa-IR' : 'en-US';
  return d.toLocaleDateString(locale, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function getNotebookBadgeText(notebook) {
  const t = I18N[currentLang];
  if (notebook === 'todo') return t.badgeTodo;
  if (notebook === 'remember') return t.badgeRemember;
  if (notebook === 'history') return t.badgeHistory;
  return t.badgeTodo;
}

/**
 * Create Note Element DOM
 */
function createNoteElement(note) {
  const t = I18N[currentLang];
  const noteEl = document.createElement('div');
  noteEl.className = `sticky-note note-${note.color} ${note.isFinished ? 'is-finished' : ''}`;
  noteEl.id = `note-${note.id}`;
  noteEl.style.setProperty('--rotation', `${note.rotation || 0}deg`);

  // 3D Push-Pin
  const pin = document.createElement('div');
  pin.className = 'sticky-pin';
  noteEl.appendChild(pin);

  // Header Actions
  const headerActions = document.createElement('div');
  headerActions.className = 'note-header-actions';

  // Notebook category badge (Click to change notebook via modal)
  const notebookBadge = document.createElement('span');
  notebookBadge.className = 'note-notebook-badge';
  notebookBadge.textContent = getNotebookBadgeText(note.notebook || 'todo');
  notebookBadge.title = currentLang === 'fa' ? 'کلیک برای تغییر دفترچه' : 'Click to change notebook';
  notebookBadge.addEventListener('click', (e) => {
    e.stopPropagation();
    openNotebookModal(note.id);
  });
  headerActions.appendChild(notebookBadge);

  // Buttons group (Finish + Delete)
  const buttonsGroup = document.createElement('div');
  buttonsGroup.className = 'note-buttons-group';

  // Finish Button
  const finishBtn = document.createElement('button');
  finishBtn.className = 'finish-btn';
  finishBtn.type = 'button';
  finishBtn.innerHTML = note.isFinished ? `<span>↩</span> <span>${t.undoFinishBtn}</span>` : `<span>✓</span> <span>${t.finishBtn}</span>`;
  finishBtn.title = note.isFinished ? t.undoFinishBtn : t.finishBtn;
  finishBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    handleFinishNote(note.id, noteEl);
  });
  buttonsGroup.appendChild(finishBtn);

  // Delete button
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-btn';
  deleteBtn.innerHTML = '&times;';
  deleteBtn.title = t.deleteTitle;
  deleteBtn.setAttribute('aria-label', t.deleteTitle);
  deleteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    deleteNote(note.id, noteEl);
  });
  buttonsGroup.appendChild(deleteBtn);

  headerActions.appendChild(buttonsGroup);
  noteEl.appendChild(headerActions);

  // Note text body
  const bodyEl = document.createElement('div');
  bodyEl.className = 'note-body';
  bodyEl.textContent = note.text;
  bodyEl.contentEditable = 'true';
  bodyEl.title = t.editHint;
  bodyEl.addEventListener('blur', () => {
    const newText = bodyEl.textContent.trim();
    if (newText) {
      updateNoteText(note.id, newText);
    }
  });
  noteEl.appendChild(bodyEl);

  // Finished stamp if completed
  if (note.isFinished) {
    const stamp = document.createElement('div');
    stamp.className = 'finished-stamp';
    stamp.textContent = t.finishedStamp;
    noteEl.appendChild(stamp);
  }

  // Footer with notebook and time
  const footerEl = document.createElement('div');
  footerEl.className = 'note-footer';
  const notebookName = getNotebookBadgeText(note.notebook || 'todo');
  footerEl.innerHTML = `<span>${notebookName}</span><span>${formatTime(note.createdAt)}</span>`;
  noteEl.appendChild(footerEl);

  return noteEl;
}

/**
 * Open the Add Note Modal
 */
function openAddNoteModal() {
  if (addNoteModalEl && window.bootstrap) {
    if (!addNoteModalInstance) {
      addNoteModalInstance = new bootstrap.Modal(addNoteModalEl);
    }
    modalNoteTextarea.value = '';
    addNoteModalInstance.show();
    setTimeout(() => {
      modalNoteTextarea.focus();
    }, 250);
  }
}

/**
 * Submit note from modal
 */
function submitNoteFromModal() {
  const text = modalNoteTextarea.value.trim();

  if (!text) {
    modalNoteTextarea.classList.add('is-invalid');
    playSound('error');
    modalNoteTextarea.focus();
    setTimeout(() => {
      modalNoteTextarea.classList.remove('is-invalid');
    }, 1200);
    return;
  }

  const selectedNotebook = modalNotebookSelect ? modalNotebookSelect.value : 'todo';
  const randomRotation = (Math.random() * 5 - 2.5).toFixed(1);

  const newNote = {
    id: Date.now().toString(),
    text: text,
    color: selectedModalColor,
    notebook: selectedNotebook,
    isFinished: false,
    rotation: parseFloat(randomRotation),
    createdAt: Date.now()
  };

  const notes = getSavedNotes();
  notes.unshift(newNote);
  saveNotes(notes);

  if (addNoteModalInstance) {
    addNoteModalInstance.hide();
  }

  playSound('add');
  showToast(I18N[currentLang].toastNoteAdded, '📌');
  renderNotes();
}

/**
 * Finish Note Action
 */
function handleFinishNote(id, noteEl) {
  const notes = getSavedNotes();
  const note = notes.find(n => n.id === id);
  if (!note) return;

  if (!note.isFinished) {
    note.isFinished = true;
    note.finishedAt = Date.now();
    playSound('finish');
    saveNotes(notes);
    renderNotes();

    showToast(I18N[currentLang].toastNoteFinished, '🎉');
    openNotebookModal(id);
  } else {
    note.isFinished = false;
    saveNotes(notes);
    playSound('add');
    renderNotes();
  }
}

/**
 * Destination Notebook Modal
 */
function openNotebookModal(noteId) {
  pendingFinishNoteId = noteId;
  if (notebookModalEl && window.bootstrap) {
    if (!notebookModalInstance) {
      notebookModalInstance = new bootstrap.Modal(notebookModalEl);
    }
    notebookModalInstance.show();
  }
}

function closeNotebookModal() {
  if (notebookModalInstance) {
    notebookModalInstance.hide();
  }
  pendingFinishNoteId = null;
}

function assignNotebook(chosenNotebook) {
  if (!pendingFinishNoteId) {
    closeNotebookModal();
    return;
  }

  const notes = getSavedNotes();
  const note = notes.find(n => n.id === pendingFinishNoteId);
  if (note) {
    note.notebook = chosenNotebook;
    saveNotes(notes);
    playSound('add');
    showToast(I18N[currentLang].toastNoteMoved, '✨');
    renderNotes();
  }
  closeNotebookModal();
}

/**
 * Delete Note
 */
function deleteNote(id, noteElement) {
  noteElement.classList.add('tear-off');
  playSound('delete');

  setTimeout(() => {
    noteElement.remove();
    const notes = getSavedNotes().filter(n => n.id !== id);
    saveNotes(notes);
    showToast(I18N[currentLang].toastNoteDeleted, '🗑️');
    renderNotes();
  }, 280);
}

function updateNoteText(id, newText) {
  const notes = getSavedNotes();
  const note = notes.find(n => n.id === id);
  if (note && note.text !== newText) {
    note.text = newText;
    saveNotes(notes);
  }
}

/**
 * Render notes matching active notebook filter and search query
 */
function renderNotes() {
  const notes = getSavedNotes();
  notesGrid.innerHTML = '';

  let filtered = notes;

  if (activeNotebookFilter !== 'all') {
    filtered = filtered.filter(n => n.notebook === activeNotebookFilter);
  }

  if (searchQuery.trim()) {
    const q = searchQuery.trim().toLowerCase();
    filtered = filtered.filter(n => n.text.toLowerCase().includes(q));
  }

  if (filtered.length === 0) {
    emptyState.classList.remove('d-none');
  } else {
    emptyState.classList.add('d-none');
    filtered.forEach(note => {
      const noteEl = createNoteElement(note);
      notesGrid.appendChild(noteEl);
    });
  }

  updateFilterText();
  updateCounts();
}

function updateFilterText() {
  const t = I18N[currentLang];
  let msg = t.filterAll;
  if (activeNotebookFilter === 'todo') msg = t.filterTodo;
  else if (activeNotebookFilter === 'remember') msg = t.filterRemember;
  else if (activeNotebookFilter === 'history') msg = t.filterHistory;

  if (searchQuery.trim()) {
    msg += ` (${currentLang === 'fa' ? 'جستجو' : 'Search'}: "${searchQuery}")`;
  }

  if (filterText) {
    filterText.textContent = msg;
  }
}

/**
 * Language switcher with dynamic Bootstrap RTL / LTR swap and SEO updates
 */
function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem(LANG_STORAGE_KEY, lang);

  const isRtl = lang === 'fa';
  document.documentElement.lang = lang;
  document.documentElement.dir = isRtl ? 'rtl' : 'ltr';

  if (bootstrapCssLink) {
    bootstrapCssLink.href = isRtl 
      ? 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.rtl.min.css'
      : 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css';
  }

  const t = I18N[lang];
  document.title = t.pageTitle;

  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', t.seoDescription);

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (t[key]) el.textContent = t[key];
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    if (t[key]) el.placeholder = t[key];
  });

  if (langLabel) {
    langLabel.textContent = t.langToggle;
  }

  if (modalNotebookSelect) {
    modalNotebookSelect.innerHTML = `
      <option value="todo">${t.badgeTodo}</option>
      <option value="remember">${t.badgeRemember}</option>
      <option value="history">${t.badgeHistory}</option>
    `;
  }

  const notes = getSavedNotes();
  if (notes.length === 0) {
    const starters = STARTER_NOTES[lang] || STARTER_NOTES.fa;
    saveNotes(starters);
  }

  renderNotes();
}

/**
 * Event Listeners & Initialization
 */
function setupEventListeners() {
  // Add Note Button opens Modal
  addBtn.addEventListener('click', openAddNoteModal);

  // Submit note from modal
  modalSubmitAddBtn.addEventListener('click', submitNoteFromModal);

  // Ctrl + Enter shortcut inside modal textarea
  modalNoteTextarea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      submitNoteFromModal();
    }
  });

  // Modal color swatch selection
  modalSwatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      modalSwatches.forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');
      selectedModalColor = swatch.dataset.color;
    });
  });

  // Background Theme Switcher (White, Cream, Black, Sky)
  themeDotButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.dataset.theme;
      setTheme(theme);
      showToast(I18N[currentLang].toastThemeChanged, '🎨');
    });
  });

  // Live Search Input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderNotes();
    });
  }

  // Language Toggle
  langToggleBtn.addEventListener('click', () => {
    const nextLang = currentLang === 'fa' ? 'en' : 'fa';
    setLanguage(nextLang);
    showToast(I18N[nextLang].toastLangChanged, '🌐');
  });

  // Notebook Tabs Filter
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      activeNotebookFilter = btn.dataset.notebook;
      renderNotes();
    });
  });

  // Toggle View
  if (toggleViewBtn) {
    let isMinimized = false;
    toggleViewBtn.addEventListener('click', () => {
      isMinimized = !isMinimized;
      toolbar.classList.toggle('minimized', isMinimized);
      const t = I18N[currentLang];
      toggleViewBtn.querySelector('.btn-text').textContent = isMinimized ? t.showControls : t.justNotes;
    });
  }

  // Choice items in destination modal
  choiceItems.forEach(item => {
    item.addEventListener('click', () => {
      const choice = item.dataset.choice;
      assignNotebook(choice);
    });
  });
}

function init() {
  setupEventListeners();
  setTheme(currentTheme);
  setLanguage(currentLang);
}

document.addEventListener('DOMContentLoaded', init);
