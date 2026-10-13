/**
 * Sticky Notes Application with Sky & Web Net Theme
 * Features:
 * - Persian (فارسی) & English language toggle with RTL/LTR support
 * - Notebooks: 'todo' (To do it), 'remember' (My remember it), 'history' (My history)
 * - Finish button on notes with celebratory sound & notebook chooser modal
 * - Sky & Web Net visual atmosphere
 * - LocalStorage persistence
 */

const STORAGE_KEY = 'sticky_notes_data_v2';
const LANG_STORAGE_KEY = 'sticky_notes_lang';
const COLOR_PALETTE = ['yellow', 'pink', 'blue', 'green', 'purple', 'orange'];

// State
let currentLang = localStorage.getItem(LANG_STORAGE_KEY) || 'fa';
let activeNotebookFilter = 'all';
let currentColorIndex = 0;
let selectedColor = 'yellow';
let pendingFinishNoteId = null;

// Translations dictionary
const I18N = {
  fa: {
    pageTitle: "یادداشت‌های چسبان | Sticky Notes",
    boardTitle: "یادداشت‌های چسبان",
    inputPlaceholder: "یک یادداشت بنویسید و اینتر بزنید...",
    addBtn: "افزودن",
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
    emptyDesc: "یک یادداشت جدید بنویسید یا یادداشتی را به این دفترچه منتقل کنید.",
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
    editHint: "کلیک برای ویرایش متن"
  },
  en: {
    pageTitle: "Sticky Notes Board",
    boardTitle: "Sticky Notes",
    inputPlaceholder: "Write a sticky note and press Enter...",
    addBtn: "Add",
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
    emptyDesc: "Write a new note or move a note into this notebook.",
    modalTitle: "Finish & Choose Notebook",
    modalDesc: "Congrats! Note finished. Which notebook would you like to keep it in?",
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
    editHint: "Click to edit text"
  }
};

// Starter notes in both languages
const STARTER_NOTES = {
  fa: [
    {
      id: 'starter-fa-1',
      text: "✨ به تابلوی یادداشت‌های چسبان خوش آمدید!\nایده‌ها و برنامه‌های روزانه خود را در میان آسمان ثبت کنید.",
      color: 'blue',
      notebook: 'todo',
      isFinished: false,
      rotation: -1.8,
      createdAt: Date.now() - 3600000 * 2
    },
    {
      id: 'starter-fa-2',
      text: "📋 کارهای من:\n• بررسی طراحی وبسایت\n• قهوه تازه بنوش ☕\n• تماس با تیم ساعت ۴",
      color: 'yellow',
      notebook: 'todo',
      isFinished: false,
      rotation: 1.5,
      createdAt: Date.now() - 3600000 * 4
    },
    {
      id: 'starter-fa-3',
      text: "🧠 یادآوری مهم:\nبا دکمه «تکمیل» روی هر یادداشت می‌توانید آن را به دفترچه تاریخچه (My History) منتقل کنید!",
      color: 'pink',
      notebook: 'remember',
      isFinished: false,
      rotation: -1.2,
      createdAt: Date.now() - 3600000 * 6
    },
    {
      id: 'starter-fa-4',
      text: "📜 سابقه کارها:\nطراحی اولیه تخته یادداشت انجام شد و آماده استفاده است.",
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
      text: "✨ Welcome to Sticky Notes!\nPin your ideas, to-dos, and reminders against the sky grid.",
      color: 'blue',
      notebook: 'todo',
      isFinished: false,
      rotation: -1.8,
      createdAt: Date.now() - 3600000 * 2
    },
    {
      id: 'starter-en-2',
      text: "📋 To do it:\n• Review project design\n• Grab fresh coffee ☕\n• Sync with team at 4 PM",
      color: 'yellow',
      notebook: 'todo',
      isFinished: false,
      rotation: 1.5,
      createdAt: Date.now() - 3600000 * 4
    },
    {
      id: 'starter-en-3',
      text: "🧠 My remember it:\nClick the 'Finish' button on any note to mark it done and organize into notebooks!",
      color: 'pink',
      notebook: 'remember',
      isFinished: false,
      rotation: -1.2,
      createdAt: Date.now() - 3600000 * 6
    },
    {
      id: 'starter-en-4',
      text: "📜 My history:\nInitial sticky notes layout has been successfully created.",
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
const noteInput = document.getElementById('note-input');
const notebookSelect = document.getElementById('notebook-select');
const addBtn = document.getElementById('add-btn');
const notesGrid = document.getElementById('notes-grid');
const noteCountBadge = document.getElementById('note-count-badge');
const colorSwatches = document.querySelectorAll('.swatch');
const toggleViewBtn = document.getElementById('toggle-view-btn');
const langToggleBtn = document.getElementById('lang-toggle-btn');
const langLabel = document.getElementById('lang-label');
const toolbar = document.getElementById('toolbar');
const emptyState = document.getElementById('empty-state');
const tabButtons = document.querySelectorAll('.tab-btn');
const filterText = document.getElementById('filter-text');

// Modal DOM References
const notebookModal = document.getElementById('notebook-modal');
const modalCloseBtn = document.getElementById('modal-close-btn');
const modalCancelBtn = document.getElementById('modal-cancel-btn');
const choiceItems = document.querySelectorAll('.choice-item');

/**
 * Sound synthesis using Web Audio API
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
      // Celebratory chord/two-tone chime
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.setValueAtTime(880, now + 0.08); // A5
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
 * Storage helpers
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
 * Update notebook counters and badges
 */
function updateCounts() {
  const notes = getSavedNotes();
  const t = I18N[currentLang];

  const total = notes.length;
  const todoCount = notes.filter(n => n.notebook === 'todo').length;
  const rememberCount = notes.filter(n => n.notebook === 'remember').length;
  const historyCount = notes.filter(n => n.notebook === 'history').length;

  // Header total badge
  const countUnit = total === 1 ? t.noteSingular : t.notePlural;
  const displayTotal = currentLang === 'fa' ? toPersianDigits(total) : total;
  if (noteCountBadge) {
    noteCountBadge.textContent = `${displayTotal} ${countUnit}`;
  }

  // Tab counters
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

/**
 * Get notebook display text
 */
function getNotebookBadgeText(notebook) {
  const t = I18N[currentLang];
  if (notebook === 'todo') return t.badgeTodo;
  if (notebook === 'remember') return t.badgeRemember;
  if (notebook === 'history') return t.badgeHistory;
  return t.badgeTodo;
}

/**
 * Render single Note element
 */
function createNoteElement(note) {
  const t = I18N[currentLang];
  const noteEl = document.createElement('div');
  noteEl.className = `sticky-note note-${note.color} ${note.isFinished ? 'is-finished' : ''}`;
  noteEl.id = `note-${note.id}`;
  noteEl.style.setProperty('--rotation', `${note.rotation || 0}deg`);

  // Realistic Push-Pin
  const pin = document.createElement('div');
  pin.className = 'sticky-pin';
  noteEl.appendChild(pin);

  // Note Header with Notebook badge and action buttons
  const headerActions = document.createElement('div');
  headerActions.className = 'note-header-actions';

  // Notebook category badge (clickable to switch notebook directly)
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

  // Delete peel button
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

  // Footer with date
  const footerEl = document.createElement('div');
  footerEl.className = 'note-footer';
  const notebookName = getNotebookBadgeText(note.notebook || 'todo');
  footerEl.innerHTML = `<span>${notebookName}</span><span>${formatTime(note.createdAt)}</span>`;
  noteEl.appendChild(footerEl);

  return noteEl;
}

/**
 * Handle adding new sticky note
 */
function handleAddNote() {
  const text = noteInput.value.trim();

  if (!text) {
    triggerShakeAnimation();
    playSound('error');
    noteInput.focus();
    return;
  }

  const color = selectedColor || COLOR_PALETTE[currentColorIndex % COLOR_PALETTE.length];
  currentColorIndex++;
  const randomRotation = (Math.random() * 5 - 2.5).toFixed(1);
  const selectedNotebook = notebookSelect ? notebookSelect.value : 'todo';

  const newNote = {
    id: Date.now().toString(),
    text: text,
    color: color,
    notebook: selectedNotebook,
    isFinished: false,
    rotation: parseFloat(randomRotation),
    createdAt: Date.now()
  };

  const notes = getSavedNotes();
  notes.unshift(newNote);
  saveNotes(notes);

  // Reset input
  noteInput.value = '';
  noteInput.focus();
  playSound('add');

  // Re-render board with filter applied
  renderNotes();
}

/**
 * Finish note handler:
 * Marks note finished, triggers sound effect, and opens the Notebook choice modal
 * so the user can choose which notebook (e.g. My History, Remember, To Do) to keep it in!
 */
function handleFinishNote(id, noteEl) {
  const notes = getSavedNotes();
  const note = notes.find(n => n.id === id);
  if (!note) return;

  if (!note.isFinished) {
    // Mark as finished and open Notebook modal
    note.isFinished = true;
    note.finishedAt = Date.now();
    // Default recommendation: move to history
    playSound('finish');
    saveNotes(notes);
    renderNotes();

    // Open modal so user can choose or confirm notebook
    openNotebookModal(id);
  } else {
    // Reopen note
    note.isFinished = false;
    saveNotes(notes);
    playSound('add');
    renderNotes();
  }
}

/**
 * Modal: Open notebook picker
 */
function openNotebookModal(noteId) {
  pendingFinishNoteId = noteId;
  notebookModal.classList.remove('hidden');
}

function closeNotebookModal() {
  pendingFinishNoteId = null;
  notebookModal.classList.add('hidden');
}

/**
 * Move note to chosen notebook
 */
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
    renderNotes();
  }
  closeNotebookModal();
}

/**
 * Delete note
 */
function deleteNote(id, noteElement) {
  noteElement.classList.add('tear-off');
  playSound('delete');

  setTimeout(() => {
    noteElement.remove();
    const notes = getSavedNotes().filter(n => n.id !== id);
    saveNotes(notes);
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
 * Shake animation on empty input
 */
function triggerShakeAnimation() {
  noteInput.classList.remove('shake');
  addBtn.classList.remove('shake');
  void noteInput.offsetWidth;
  noteInput.classList.add('shake');
  addBtn.classList.add('shake');
  setTimeout(() => {
    noteInput.classList.remove('shake');
    addBtn.classList.remove('shake');
  }, 450);
}

/**
 * Render notes matching active notebook filter
 */
function renderNotes() {
  const notes = getSavedNotes();
  notesGrid.innerHTML = '';

  let filtered = notes;
  if (activeNotebookFilter !== 'all') {
    filtered = notes.filter(n => n.notebook === activeNotebookFilter);
  }

  if (filtered.length === 0) {
    emptyState.classList.remove('hidden');
  } else {
    emptyState.classList.add('hidden');
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

  if (filterText) {
    filterText.textContent = msg;
  }
}

/**
 * Language switcher
 */
function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem(LANG_STORAGE_KEY, lang);

  const isRtl = lang === 'fa';
  document.documentElement.lang = lang;
  document.documentElement.dir = isRtl ? 'rtl' : 'ltr';

  const t = I18N[lang];
  document.title = t.pageTitle;

  // Update DOM elements with data-i18n attributes
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (t[key]) el.textContent = t[key];
  });

  // Update placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    if (t[key]) el.placeholder = t[key];
  });

  // Language button label
  if (langLabel) {
    langLabel.textContent = t.langToggle;
  }

  // Update notebook dropdown in toolbar
  if (notebookSelect) {
    notebookSelect.innerHTML = `
      <option value="todo">${t.badgeTodo}</option>
      <option value="remember">${t.badgeRemember}</option>
      <option value="history">${t.badgeHistory}</option>
    `;
  }

  // Check if first-time starter notes exist in previous language
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
  // Add Note
  addBtn.addEventListener('click', handleAddNote);
  noteInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddNote();
    }
  });

  // Swatches
  colorSwatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      colorSwatches.forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');
      selectedColor = swatch.dataset.color;
    });
  });

  // Language Toggle
  langToggleBtn.addEventListener('click', () => {
    const nextLang = currentLang === 'fa' ? 'en' : 'fa';
    setLanguage(nextLang);
  });

  // Notebook Tabs Filter
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
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

  // Modal interactions
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeNotebookModal);
  if (modalCancelBtn) modalCancelBtn.addEventListener('click', closeNotebookModal);
  if (notebookModal) {
    notebookModal.addEventListener('click', (e) => {
      if (e.target === notebookModal) closeNotebookModal();
    });
  }

  choiceItems.forEach(item => {
    item.addEventListener('click', () => {
      const choice = item.dataset.choice;
      assignNotebook(choice);
    });
  });
}

function init() {
  setupEventListeners();
  setLanguage(currentLang);
}

document.addEventListener('DOMContentLoaded', init);
