/**
 * Sticky Notes Application
 * Implements Prompts 1-5 + Default pre-populated notes so opening the link shows sticky notes immediately.
 */

const STORAGE_KEY = 'sticky_notes_data';
const COLOR_PALETTE = ['yellow', 'pink', 'blue', 'green', 'purple', 'orange'];
let currentColorIndex = 0;
let selectedColor = 'yellow';

// Default starter notes to display immediately when opening the page for the first time
const STARTER_NOTES = [
  {
    id: 'starter-1',
    text: "✨ Welcome to Sticky Notes!\nPin your ideas, to-do lists, and reminders right here on the board.",
    color: 'yellow',
    rotation: -2,
    createdAt: Date.now() - 3600000 * 2
  },
  {
    id: 'starter-2',
    text: "🛒 Quick Tasks:\n• Review project designs\n• Grab fresh coffee ☕\n• Call the team at 4 PM",
    color: 'pink',
    rotation: 1.8,
    createdAt: Date.now() - 3600000 * 5
  },
  {
    id: 'starter-3',
    text: "💡 Inspiring Thought:\nGreat ideas start with a simple sticky note pinned to the board!",
    color: 'blue',
    rotation: -1.4,
    createdAt: Date.now() - 3600000 * 8
  },
  {
    id: 'starter-4',
    text: "📌 Pro-Tip:\nClick the 'X' button in the top right to peel off and remove any note.",
    color: 'green',
    rotation: 2.1,
    createdAt: Date.now() - 3600000 * 12
  }
];

// DOM Elements
const noteInput = document.getElementById('note-input');
const addBtn = document.getElementById('add-btn');
const notesGrid = document.getElementById('notes-grid');
const noteCountBadge = document.getElementById('note-count-badge');
const colorSwatches = document.querySelectorAll('.swatch');
const toggleViewBtn = document.getElementById('toggle-view-btn');
const toolbar = document.getElementById('toolbar');

/**
 * Web Audio API Sound Effects
 */
function playSound(type) {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    const now = audioCtx.currentTime;

    if (type === 'add') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(460, now);
      osc.frequency.exponentialRampToValueAtTime(920, now + 0.12);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (type === 'delete') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.14);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      osc.start(now);
      osc.stop(now + 0.14);
    } else if (type === 'error') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, now);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.start(now);
      osc.stop(now + 0.18);
    }
  } catch (e) {
    // Autoplay policy fallback
  }
}

/**
 * Prompt 3: Data Persistence Helpers
 * Retrieves saved notes or initializes with starter notes if first time
 */
function getSavedNotes() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    // First time opening: seed with starter notes so user immediately sees notes!
    localStorage.setItem(STORAGE_KEY, JSON.stringify(STARTER_NOTES));
    return [...STARTER_NOTES];
  }
  try {
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

function saveNotes(notes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  updateStats(notes.length);
}

function updateStats(count) {
  if (noteCountBadge) {
    noteCountBadge.textContent = `${count} ${count === 1 ? 'note' : 'notes'}`;
  }
}

function formatTime(timestamp) {
  const d = new Date(timestamp);
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Prompt 1, 2, 4: Create note DOM element
 */
function createNoteElement(note) {
  const noteEl = document.createElement('div');
  noteEl.className = `sticky-note note-${note.color}`;
  noteEl.id = `note-${note.id}`;
  noteEl.style.setProperty('--rotation', `${note.rotation || 0}deg`);

  // 3D Push-Pin
  const pin = document.createElement('div');
  pin.className = 'sticky-pin';
  noteEl.appendChild(pin);

  // Prompt 4: Small 'X' button to delete note
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-btn';
  deleteBtn.innerHTML = '&times;';
  deleteBtn.title = 'Delete note';
  deleteBtn.setAttribute('aria-label', 'Delete note');
  deleteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    deleteNote(note.id, noteEl);
  });
  noteEl.appendChild(deleteBtn);

  // Note text body
  const bodyEl = document.createElement('div');
  bodyEl.className = 'note-body';
  bodyEl.textContent = note.text;
  bodyEl.contentEditable = 'true';
  bodyEl.title = 'Click to edit text';

  // Save changes on blur
  bodyEl.addEventListener('blur', () => {
    const newText = bodyEl.textContent.trim();
    if (newText) {
      updateNoteText(note.id, newText);
    }
  });
  noteEl.appendChild(bodyEl);

  // Note footer
  const footerEl = document.createElement('div');
  footerEl.className = 'note-footer';
  footerEl.innerHTML = `<span>📌 Note</span><span>${formatTime(note.createdAt)}</span>`;
  noteEl.appendChild(footerEl);

  return noteEl;
}

/**
 * Prompt 2 & 5: Add a new sticky note
 */
function handleAddNote() {
  const text = noteInput.value.trim();

  // Prompt 5: Prevent empty note and trigger shake animation
  if (!text) {
    triggerShakeAnimation();
    playSound('error');
    noteInput.focus();
    return;
  }

  const color = selectedColor || COLOR_PALETTE[currentColorIndex % COLOR_PALETTE.length];
  currentColorIndex++;
  const randomRotation = (Math.random() * 5 - 2.5).toFixed(1);

  const newNote = {
    id: Date.now().toString(),
    text: text,
    color: color,
    rotation: parseFloat(randomRotation),
    createdAt: Date.now()
  };

  // Save to LocalStorage (Prompt 3)
  const notes = getSavedNotes();
  notes.unshift(newNote);
  saveNotes(notes);

  // Prepend to DOM (Prompt 2)
  const noteEl = createNoteElement(newNote);
  notesGrid.prepend(noteEl);

  // Prompt 2: Clear input field
  noteInput.value = '';
  noteInput.focus();
  playSound('add');
}

/**
 * Prompt 4: Delete note from DOM and LocalStorage
 */
function deleteNote(id, noteElement) {
  noteElement.classList.add('tear-off');
  playSound('delete');

  setTimeout(() => {
    noteElement.remove();
    const notes = getSavedNotes().filter(n => n.id !== id);
    saveNotes(notes);
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
 * Prompt 5: Shake Animation on empty input
 */
function triggerShakeAnimation() {
  noteInput.classList.remove('shake');
  addBtn.classList.remove('shake');

  // Reflow
  void noteInput.offsetWidth;

  noteInput.classList.add('shake');
  addBtn.classList.add('shake');

  setTimeout(() => {
    noteInput.classList.remove('shake');
    addBtn.classList.remove('shake');
  }, 450);
}

/**
 * Swatch selection
 */
colorSwatches.forEach(swatch => {
  swatch.addEventListener('click', () => {
    colorSwatches.forEach(s => s.classList.remove('active'));
    swatch.classList.add('active');
    selectedColor = swatch.dataset.color;
  });
});

/**
 * Toggle Toolbar to view just notes
 */
if (toggleViewBtn) {
  let isMinimized = false;
  toggleViewBtn.addEventListener('click', () => {
    isMinimized = !isMinimized;
    toolbar.classList.toggle('minimized', isMinimized);
    toggleViewBtn.querySelector('.btn-text').textContent = isMinimized ? 'Show Controls' : 'Just Notes';
  });
}

// Event Listeners
addBtn.addEventListener('click', handleAddNote);

noteInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    handleAddNote();
  }
});

/**
 * Prompt 3: Load and render notes on page start
 */
function init() {
  const notes = getSavedNotes();
  notesGrid.innerHTML = '';

  notes.forEach(note => {
    const noteEl = createNoteElement(note);
    notesGrid.appendChild(noteEl);
  });

  updateStats(notes.length);
}

document.addEventListener('DOMContentLoaded', init);
