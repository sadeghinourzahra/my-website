/**
 * Sticky Notes Application with Student Lessons Library & Grammar Notebooks
 * Features:
 * - Theme switcher: White, Cream, Black, Sky with Net overlay
 * - Prominent "Add" button triggering the Bootstrap Add Note Modal
 * - Full Persian (فارسی) & English language toggle with SEO metadata updates
 * - Notebooks: 'todo' (To do it), 'remember' (My remember it), 'history' (My history), 'grammar' (Grammar Notebook)
 * - Student Lessons Library with customizable 3D bookshelves ("How many shelves do you need in your library?")
 * - Dedicated Grammar Notebooks per lesson with rule formulas and practical examples
 * - Celebratory Web Audio synthesizer sounds for notes, books, and shelves
 * - Live real-time search filtering & LocalStorage persistence
 */

const STORAGE_KEY = 'sticky_notes_data_v3';
const LANG_STORAGE_KEY = 'sticky_notes_lang';
const THEME_STORAGE_KEY = 'sticky_notes_theme';
const STUDENT_LESSONS_KEY = 'sticky_student_lessons_v3';
const LIBRARY_CONFIG_KEY = 'sticky_library_config_v3';
const STUDENT_NAME_KEY = 'sticky_student_name_v3';

const COLOR_PALETTE = ['yellow', 'pink', 'blue', 'green', 'purple', 'orange'];
const BOOK_COLORS = ['blue', 'purple', 'emerald', 'amber', 'rose', 'leather'];

// State
let currentLang = localStorage.getItem(LANG_STORAGE_KEY) || 'fa';
let currentTheme = localStorage.getItem(THEME_STORAGE_KEY) || 'sky';
let currentStudentName = localStorage.getItem(STUDENT_NAME_KEY) || (currentLang === 'fa' ? 'زهرا' : 'Zahra');
let shelfCount = parseInt(localStorage.getItem(LIBRARY_CONFIG_KEY) || '3', 10);
let activeNotebookFilter = 'all'; // 'all', 'todo', 'remember', 'history', 'grammar', 'library'
let activeGrammarLessonFilter = 'all';
let searchQuery = '';
let selectedModalColor = 'yellow';
let selectedLessonColor = 'blue';
let pendingFinishNoteId = null;
let pendingDetailLessonId = null;
let modalTempShelfNumber = shelfCount;

// Bootstrap modal instances
let addNoteModalInstance = null;
let notebookModalInstance = null;
let shelfSetupModalInstance = null;
let addLessonModalInstance = null;
let lessonDetailModalInstance = null;
let editStudentModalInstance = null;
let bootstrapToastInstance = null;

// Bilingual translations dictionary
const I18N = {
  fa: {
    pageTitle: "یادداشت‌های چسبان و کتابخانه دروس دانش‌آموز | Sticky Notes & Student Library",
    seoDescription: "برنامه تابلوی یادداشت‌های چسبان و کتابخانه دروس دانش‌آموز، دفترچه گرامر، تم‌های سفید، کرم، مشکی و آسمان با پشتیبانی کامل از زبان فارسی و انگلیسی.",
    boardTitle: "یادداشت‌های چسبان",
    addBtn: "افزودن یادداشت",
    themeLabel: "رنگ پس‌زمینه:",
    searchPlaceholder: "جستجو در یادداشت‌ها و گرامر...",
    langToggle: "English",
    justNotes: "فقط یادداشت‌ها",
    showControls: "نمایش کنترل‌ها",
    tabAll: "همه یادداشت‌ها",
    tabTodo: "کارهای من",
    tabRemember: "یادآوری‌های من",
    tabHistory: "تاریخچه من",
    tabGrammar: "دفترچه گرامر",
    tabLibrary: "کتابخانه دروس",
    badgeTodo: "📋 کارهای من",
    badgeRemember: "🧠 یادآوری",
    badgeHistory: "📜 تاریخچه",
    badgeGrammar: "📖 دفترچه گرامر",
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
    grammarHint: "ثبت به عنوان نکته یا قاعده گرامری در درس",
    rememberHint: "نگه‌داری به عنوان نکته یا یادآوری مهم",
    todoHint: "نگه‌داری در لیست کارهای روزانه",
    cancel: "انصراف",
    close: "بستن",
    save: "ذخیره",
    filterAll: "نمایش تمام یادداشت‌ها",
    filterTodo: "نمایش: دفترچه کارهای من",
    filterRemember: "نمایش: دفترچه یادآوری‌ها",
    filterHistory: "نمایش: دفترچه تاریخچه",
    filterGrammar: "نمایش: دفترچه گرامر دروس",
    filterLibrary: "نمایش: کتابخانه و قفسه‌های دروس",
    deleteTitle: "حذف یادداشت",
    editHint: "کلیک برای ویرایش متن",
    toastNoteAdded: "یادداشت جدید با موفقیت روی تابلو چسبانده شد 📌",
    toastNoteFinished: "یادداشت تکمیل شد! به کدام دفترچه منتقل شود؟ 🎉",
    toastNoteMoved: "یادداشت به دفترچه جدید منتقل شد ✨",
    toastNoteDeleted: "یادداشت کنده و حذف شد 🗑️",
    toastLangChanged: "زبان به فارسی تغییر یافت 🇮🇷",
    toastThemeChanged: "تم پس‌زمینه با موفقیت تغییر کرد 🎨",
    toastLessonAdded: "درس جدید در قفسه کتابخانه چیده شد 📚",
    toastShelvesUpdated: "تعداد قفسه‌های کتابخانه با موفقیت تنظیم شد 🏛️",
    toastStudentNameUpdated: "نام دانش‌آموز بروزرسانی شد 🎓",
    toastLessonDeleted: "درس از قفسه کتابخانه برداشته شد 🗑️",
    
    // Library & Grammar specific
    libraryBannerTitle: "کتابخانه دروس دانش‌آموز",
    libraryBannerDesc: "درس‌ها و دفترچه‌های گرامر شما به صورت منظم روی قفسه‌ها قرار گرفته‌اند. روی هر کتاب کلیک کنید تا دفترچه گرامر آن باز شود.",
    shelfQuestion: "چند قفسه برای کتابخانه خود نیاز دارید؟",
    shelfQuestionPrompt: "پاسخ به سوال تعداد قفسه‌ها",
    shelfSetupTitle: "تنظیم قفسه‌های کتابخانه",
    shelfSetupDesc: "می‌توانید قفسه‌ها را متناسب با تعداد درس‌ها و دفترچه‌های گرامر خود تنظیم کنید. کتاب‌ها به زیبایی در قفسه‌ها چیده می‌شوند.",
    selectShelfCount: "تعداد قفسه‌ها را مشخص کنید:",
    shelvesWord: "قفسه چوبی / شناور",
    applyShelvesBtn: "تأیید و ساخت قفسه‌ها",
    addLessonBtn: "افزودن درس جدید",
    addGrammarNoteBtn: "نکته گرامر جدید",
    addGrammarRule: "افزودن نکته گرامر",
    filterByLesson: "فیلتر بر اساس درس:",
    allLessons: "همه درس‌ها",
    grammarDetailsTitle: "تنظیمات گرامر و درس دانش‌آموز",
    grammarBadge: "قاعده گرامری",
    forWhichLesson: "برای کدام درس؟",
    grammarTopicLabel: "عنوان مبحث گرامر:",
    grammarFormulaLabel: "فرمول یا ساختار کلیدی (اختیاری):",
    grammarExampleLabel: "مثال کاربردی (اختیاری):",
    topicPlaceholder: "مثال: زمان حال کامل (Present Perfect)",
    addLessonModalTitle: "افزودن درس جدید دانش‌آموز",
    addLessonModalSubtitle: "ساخت کتاب و دفترچه گرامر در کتابخانه",
    studentNameLabel: "نام دانش‌آموز:",
    lessonTitleLabel: "عنوان درس (فارسی یا انگلیسی):",
    subjectLabel: "موضوع / زبان:",
    placeOnShelfLabel: "قرارگیری در کدام قفسه؟",
    bookSpineColorLabel: "رنگ جلد کتاب در قفسه:",
    lessonSummaryLabel: "خلاصه مباحث درس (اختیاری):",
    saveAndPlaceOnShelf: "افزودن به قفسه کتابخانه",
    changeStudentName: "ویرایش نام دانش‌آموز",
    lessonSummaryHeading: "مباحث و توضیحات درس",
    lessonGrammarNotebookHeading: "دفترچه گرامر این درس",
    addGrammarToLesson: "افزودن گرامر جدید",
    noGrammarYet: "هنوز نکته گرامری برای این درس ثبت نشده است.",
    addFirstGrammar: "ثبت اولین نکته گرامر",
    deleteLesson: "حذف این درس از کتابخانه",
    shelfLabelWord: "قفسه",
    shelfEmptyText: "این قفسه خالی است • درسی را به این قفسه اختصاص دهید",
    bookOpenHint: "کلیک برای باز کردن دفترچه گرامر",
    formulaPrefix: "💡 فرمول:",
    examplePrefix: "✏️ مثال:"
  },
  en: {
    pageTitle: "Sticky Notes & Student Lessons Library | Grammar Notebooks",
    seoDescription: "Sticky notes bulletin board, student lesson library with 3D bookshelves, dedicated grammar notebooks per lesson, and full bilingual support.",
    boardTitle: "Sticky Notes",
    addBtn: "Add Note",
    themeLabel: "Background Color:",
    searchPlaceholder: "Search notes and grammar...",
    langToggle: "فارسی",
    justNotes: "Just Notes",
    showControls: "Show Controls",
    tabAll: "All Notes",
    tabTodo: "To do it",
    tabRemember: "My remember it",
    tabHistory: "My history",
    tabGrammar: "Grammar Notebook",
    tabLibrary: "Lessons Library",
    badgeTodo: "📋 To do it",
    badgeRemember: "🧠 Remember",
    badgeHistory: "📜 History",
    badgeGrammar: "📖 Grammar",
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
    grammarHint: "Kept as a lesson grammar rule or note",
    rememberHint: "Kept as an important reminder",
    todoHint: "Kept in daily to-do list",
    cancel: "Cancel",
    close: "Close",
    save: "Save",
    filterAll: "Showing all notes",
    filterTodo: "Showing: To do it",
    filterRemember: "Showing: My remember it",
    filterHistory: "Showing: My history",
    filterGrammar: "Showing: Lessons Grammar Notebook",
    filterLibrary: "Showing: Student Lessons Library",
    deleteTitle: "Delete note",
    editHint: "Click to edit text",
    toastNoteAdded: "New note pinned to the board! 📌",
    toastNoteFinished: "Note completed! Choose destination notebook 🎉",
    toastNoteMoved: "Note moved to selected notebook ✨",
    toastNoteDeleted: "Note peeled off and deleted 🗑️",
    toastLangChanged: "Language switched to English 🌐",
    toastThemeChanged: "Background theme updated 🎨",
    toastLessonAdded: "New lesson placed on the library shelf! 📚",
    toastShelvesUpdated: "Library shelves updated successfully! 🏛️",
    toastStudentNameUpdated: "Student name updated! 🎓",
    toastLessonDeleted: "Lesson removed from library 🗑️",

    // Library & Grammar specific
    libraryBannerTitle: "Student Lessons Library",
    libraryBannerDesc: "Your lessons and grammar notebooks are neatly organized on shelves. Click any book to open its grammar notebook.",
    shelfQuestion: "How many shelves do you need in your library?",
    shelfQuestionPrompt: "Set your library shelf count",
    shelfSetupTitle: "Configure Library Shelves",
    shelfSetupDesc: "Adjust shelves according to your lessons and grammar notebooks. Books are beautifully stacked on shelves.",
    selectShelfCount: "Select shelf count:",
    shelvesWord: "Wooden / Floating Shelves",
    applyShelvesBtn: "Apply & Build Shelves",
    addLessonBtn: "Add New Lesson",
    addGrammarNoteBtn: "New Grammar Note",
    addGrammarRule: "Add Grammar Note",
    filterByLesson: "Filter by lesson:",
    allLessons: "All Lessons",
    grammarDetailsTitle: "Student Lesson & Grammar Details",
    grammarBadge: "Grammar Rule",
    forWhichLesson: "For which lesson?",
    grammarTopicLabel: "Grammar Topic / Rule:",
    grammarFormulaLabel: "Key Formula or Structure (Optional):",
    grammarExampleLabel: "Practical Example (Optional):",
    topicPlaceholder: "Example: Present Perfect Tense",
    addLessonModalTitle: "Add New Student Lesson",
    addLessonModalSubtitle: "Create book and grammar notebook in library",
    studentNameLabel: "Student Name:",
    lessonTitleLabel: "Lesson Title (English / Persian):",
    subjectLabel: "Subject / Language:",
    placeOnShelfLabel: "Place on which shelf?",
    bookSpineColorLabel: "Book Spine Color on Shelf:",
    lessonSummaryLabel: "Lesson Summary (Optional):",
    saveAndPlaceOnShelf: "Add to Library Shelf",
    changeStudentName: "Edit Student Name",
    lessonSummaryHeading: "Lesson Topics & Description",
    lessonGrammarNotebookHeading: "Grammar Notebook for this Lesson",
    addGrammarToLesson: "Add New Grammar",
    noGrammarYet: "No grammar rules recorded for this lesson yet.",
    addFirstGrammar: "Record First Grammar Rule",
    deleteLesson: "Delete lesson from library",
    shelfLabelWord: "Shelf",
    shelfEmptyText: "This shelf is empty • Assign a lesson book here",
    bookOpenHint: "Click to open grammar notebook",
    formulaPrefix: "💡 Formula:",
    examplePrefix: "✏️ Example:"
  }
};

// Starter Student Lessons
const STARTER_LESSONS = {
  fa: [
    {
      id: 'lesson-1',
      number: 1,
      title: 'درس ۱: زمان حال ساده و استمراری',
      subject: 'زبان انگلیسی',
      studentName: 'زهرا',
      color: 'blue',
      shelfIndex: 0,
      summary: 'بررسی فرمول‌ها، قیدهای تکرار (always, usually) و تفاوت کارهای روتین با فعالیت‌های در حال انجام.',
      createdAt: Date.now() - 3600000 * 24
    },
    {
      id: 'lesson-2',
      number: 2,
      title: 'درس ۲: گذشته ساده و افعال بی‌قاعده',
      subject: 'زبان انگلیسی',
      studentName: 'زهرا',
      color: 'purple',
      shelfIndex: 0,
      summary: 'افعال باقاعده با ed و لیست افعال بی‌قاعده رایج به همراه سوالی کردن با Did.',
      createdAt: Date.now() - 3600000 * 20
    },
    {
      id: 'lesson-3',
      number: 3,
      title: 'درس ۳: آینده با Will و Be Going To',
      subject: 'زبان انگلیسی',
      studentName: 'زهرا',
      color: 'emerald',
      shelfIndex: 1,
      summary: 'تفاوت تصمیمات آنی و برنامه‌ریزی‌های قطعی از قبل، پیش‌بینی بر اساس شواهد.',
      createdAt: Date.now() - 3600000 * 16
    },
    {
      id: 'lesson-4',
      number: 4,
      title: 'درس ۴: زمان حال کامل (ماضی نقلی)',
      subject: 'زبان انگلیسی',
      studentName: 'زهرا',
      color: 'amber',
      shelfIndex: 1,
      summary: 'فرمول Have/Has + P.P و کاربرد کلمات since, for, already, yet, just.',
      createdAt: Date.now() - 3600000 * 12
    },
    {
      id: 'lesson-5',
      number: 5,
      title: 'درس ۵: افعال مدال و کمکی',
      subject: 'زبان انگلیسی',
      studentName: 'زهرا',
      color: 'rose',
      shelfIndex: 2,
      summary: 'بیان توانایی، اجبار و توصیه با can, could, must, should و have to.',
      createdAt: Date.now() - 3600000 * 8
    }
  ],
  en: [
    {
      id: 'lesson-1',
      number: 1,
      title: 'Lesson 1: Present Simple & Continuous',
      subject: 'English Grammar',
      studentName: 'Zahra',
      color: 'blue',
      shelfIndex: 0,
      summary: 'Formulas, frequency adverbs (always, usually), and habits vs ongoing actions.',
      createdAt: Date.now() - 3600000 * 24
    },
    {
      id: 'lesson-2',
      number: 2,
      title: 'Lesson 2: Past Simple & Irregular Verbs',
      subject: 'English Grammar',
      studentName: 'Zahra',
      color: 'purple',
      shelfIndex: 0,
      summary: 'Regular verbs with -ed, common irregular verbs list, and questions with Did.',
      createdAt: Date.now() - 3600000 * 20
    },
    {
      id: 'lesson-3',
      number: 3,
      title: 'Lesson 3: Future with Will & Be Going To',
      subject: 'English Grammar',
      studentName: 'Zahra',
      color: 'emerald',
      shelfIndex: 1,
      summary: 'Spontaneous decisions vs prior plans and predictions based on evidence.',
      createdAt: Date.now() - 3600000 * 16
    },
    {
      id: 'lesson-4',
      number: 4,
      title: 'Lesson 4: Present Perfect Tense',
      subject: 'English Grammar',
      studentName: 'Zahra',
      color: 'amber',
      shelfIndex: 1,
      summary: 'Have/Has + Past Participle with since, for, already, yet, and just.',
      createdAt: Date.now() - 3600000 * 12
    },
    {
      id: 'lesson-5',
      number: 5,
      title: 'Lesson 5: Modal Auxiliaries',
      subject: 'English Grammar',
      studentName: 'Zahra',
      color: 'rose',
      shelfIndex: 2,
      summary: 'Expressing ability, obligation, and advice with can, must, should, have to.',
      createdAt: Date.now() - 3600000 * 8
    }
  ]
};

// Default starter notes including student grammar notebooks
const STARTER_NOTES = {
  fa: [
    {
      id: 'starter-fa-1',
      text: "✨ به تابلوی یادداشت‌های چسبان و کتابخانه دروس خوش آمدید!\nمی‌توانید قفسه‌های کتابخانه را بر اساس دروس خود تنظیم کرده و برای هر درس دفترچه گرامر بسازید.",
      color: 'blue',
      notebook: 'todo',
      isFinished: false,
      rotation: -1.8,
      createdAt: Date.now() - 3600000 * 2
    },
    {
      id: 'starter-fa-grammar-1',
      text: "📖 قاعده گرامر درس ۱: زمان حال ساده\nکاربرد: برای صحبت در مورد عادات روزمره، برنامه‌های ثابت و حقایق علمی.",
      color: 'blue',
      notebook: 'grammar',
      lessonId: 'lesson-1',
      grammarTopic: 'زمان حال ساده (Present Simple)',
      grammarFormula: 'Subject + Verb(s/es) + Object',
      grammarExample: 'She teaches English at high school every morning.',
      isFinished: false,
      rotation: -1.2,
      createdAt: Date.now() - 3600000 * 5
    },
    {
      id: 'starter-fa-grammar-2',
      text: "📖 قاعده گرامر درس ۲: گذشته ساده با افعال بی‌قاعده\nنکته: در جملات منفی و سوالی فعل به شکل ساده بازمی‌گردد.",
      color: 'purple',
      notebook: 'grammar',
      lessonId: 'lesson-2',
      grammarTopic: 'گذشته ساده با Did',
      grammarFormula: 'Did + Subject + Base Verb ?',
      grammarExample: 'Did you finish your English assignment yesterday?',
      isFinished: false,
      rotation: 1.4,
      createdAt: Date.now() - 3600000 * 3
    },
    {
      id: 'starter-fa-grammar-3',
      text: "📖 قاعده گرامر درس ۴: زمان حال کامل با Since و For\nکلمات کلیدی: already, yet, since (مبدأ زمان), for (طول زمان).",
      color: 'yellow',
      notebook: 'grammar',
      lessonId: 'lesson-4',
      grammarTopic: 'حال کامل با Since و For',
      grammarFormula: 'Subject + have/has + P.P + since/for',
      grammarExample: 'I have studied English for three years.',
      isFinished: false,
      rotation: -0.8,
      createdAt: Date.now() - 3600000 * 1
    },
    {
      id: 'starter-fa-2',
      text: "📋 کارهای من:\n• بررسی قفسه‌های کتابخانه دروس 📚\n• مرور دفترچه گرامر درس ۴\n• تست تم‌های پس‌زمینه (سفید، کرم، مشکی، آسمانی)",
      color: 'yellow',
      notebook: 'todo',
      isFinished: false,
      rotation: 1.5,
      createdAt: Date.now() - 3600000 * 4
    },
    {
      id: 'starter-fa-3',
      text: "🧠 یادآوری مهم:\nبا زدن روی هر کتاب در قفسه کتابخانه، دفترچه اختصاصی گرامر آن درس همراه با فرمول‌ها باز می‌شود!",
      color: 'pink',
      notebook: 'remember',
      isFinished: false,
      rotation: -1.2,
      createdAt: Date.now() - 3600000 * 6
    },
    {
      id: 'starter-fa-4',
      text: "📜 سابقه کارها:\nکتابخانه دروس دانش‌آموز، قفسه‌بندی پویا و دفترچه گرامر با موفقیت راه‌اندازی شد.",
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
      text: "✨ Welcome to Sticky Notes & Student Lessons Library!\nOrganize your library with custom shelves and build grammar notebooks for your lessons.",
      color: 'blue',
      notebook: 'todo',
      isFinished: false,
      rotation: -1.8,
      createdAt: Date.now() - 3600000 * 2
    },
    {
      id: 'starter-en-grammar-1',
      text: "📖 Grammar Rule Lesson 1: Present Simple\nUsage: Habits, daily routines, and universal truths.",
      color: 'blue',
      notebook: 'grammar',
      lessonId: 'lesson-1',
      grammarTopic: 'Present Simple Tense',
      grammarFormula: 'Subject + Verb(s/es) + Object',
      grammarExample: 'She teaches English at high school every morning.',
      isFinished: false,
      rotation: -1.2,
      createdAt: Date.now() - 3600000 * 5
    },
    {
      id: 'starter-en-grammar-2',
      text: "📖 Grammar Rule Lesson 2: Past Simple with Irregular Verbs\nNote: In negative sentences and questions, use base verb after Did.",
      color: 'purple',
      notebook: 'grammar',
      lessonId: 'lesson-2',
      grammarTopic: 'Past Simple with Did',
      grammarFormula: 'Did + Subject + Base Verb ?',
      grammarExample: 'Did you finish your English assignment yesterday?',
      isFinished: false,
      rotation: 1.4,
      createdAt: Date.now() - 3600000 * 3
    },
    {
      id: 'starter-en-grammar-3',
      text: "📖 Grammar Rule Lesson 4: Present Perfect with Since & For\nKey signal words: already, yet, since (starting point), for (duration).",
      color: 'yellow',
      notebook: 'grammar',
      lessonId: 'lesson-4',
      grammarTopic: 'Present Perfect Tense',
      grammarFormula: 'Subject + have/has + P.P + since/for',
      grammarExample: 'I have studied English for three years.',
      isFinished: false,
      rotation: -0.8,
      createdAt: Date.now() - 3600000 * 1
    },
    {
      id: 'starter-en-2',
      text: "📋 To do it:\n• Check student lessons library shelves 📚\n• Review Lesson 4 grammar notebook\n• Test White, Cream, Black, and Sky themes",
      color: 'yellow',
      notebook: 'todo',
      isFinished: false,
      rotation: 1.5,
      createdAt: Date.now() - 3600000 * 4
    },
    {
      id: 'starter-en-3',
      text: "🧠 My remember it:\nClick any book on the bookshelf to open its grammar notebook and formulas!",
      color: 'pink',
      notebook: 'remember',
      isFinished: false,
      rotation: -1.2,
      createdAt: Date.now() - 3600000 * 6
    },
    {
      id: 'starter-en-4',
      text: "📜 My history:\nStudent library, custom shelf builder, and lesson grammar notebooks enabled.",
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
const libraryView = document.getElementById('library-view');
const grammarFilterBar = document.getElementById('grammar-filter-bar');
const grammarLessonChips = document.getElementById('grammar-lesson-chips');
const quickAddGrammarFromBar = document.getElementById('quick-add-grammar-from-bar');
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
const modalSwatches = document.querySelectorAll('#addNoteModal .modal-swatch');
const grammarFieldsContainer = document.getElementById('grammar-fields-container');
const modalLessonSelect = document.getElementById('modal-lesson-select');
const modalGrammarTopic = document.getElementById('modal-grammar-topic');
const modalGrammarFormula = document.getElementById('modal-grammar-formula');
const modalGrammarExample = document.getElementById('modal-grammar-example');

// Finish Note Modal DOM References
const notebookModalEl = document.getElementById('notebookBootstrapModal');
const choiceItems = document.querySelectorAll('.choice-item');

// Toast DOM
const toastElement = document.getElementById('actionToast');
const toastMessage = document.getElementById('toastMessage');
const toastIcon = document.getElementById('toastIcon');

// Library & Shelf DOM References
const studentNameDisplay = document.getElementById('student-name-display');
const studentNameText = document.getElementById('student-name-text');
const shelfQuickButtons = document.querySelectorAll('.shelf-btn');
const openShelfModalBtn = document.getElementById('open-shelf-modal-btn');
const addLessonBtn = document.getElementById('add-lesson-btn');
const quickAddGrammarBtn = document.getElementById('quick-add-grammar-btn');
const bookshelvesContainer = document.getElementById('bookshelves-container');

// Shelf Setup Modal DOM
const shelfSetupModalEl = document.getElementById('shelfSetupModal');
const shelfModalNumber = document.getElementById('shelf-modal-number');
const shelfDecrementBtn = document.getElementById('shelf-decrement-btn');
const shelfIncrementBtn = document.getElementById('shelf-increment-btn');
const modalShelfChips = document.querySelectorAll('.modal-shelf-chip');
const saveShelvesBtn = document.getElementById('save-shelves-btn');

// Add Lesson Modal DOM
const addLessonModalEl = document.getElementById('addLessonModal');
const lessonStudentName = document.getElementById('lesson-student-name');
const lessonTitleInput = document.getElementById('lesson-title-input');
const lessonSubjectInput = document.getElementById('lesson-subject-input');
const lessonShelfSelect = document.getElementById('lesson-shelf-select');
const lessonColorPalette = document.getElementById('lesson-color-palette');
const lessonSummaryInput = document.getElementById('lesson-summary-input');
const submitCreateLessonBtn = document.getElementById('submit-create-lesson-btn');

// Lesson Detail Modal DOM
const lessonDetailModalEl = document.getElementById('lessonDetailModal');
const detailBookIcon = document.getElementById('detail-book-icon');
const detailLessonTitle = document.getElementById('lessonDetailModalLabel');
const detailStudentBadge = document.getElementById('detail-student-badge');
const detailShelfBadge = document.getElementById('detail-shelf-badge');
const detailGrammarCountBadge = document.getElementById('detail-grammar-count-badge');
const detailLessonSummary = document.getElementById('detail-lesson-summary');
const detailAddGrammarBtn = document.getElementById('detail-add-grammar-btn');
const detailGrammarList = document.getElementById('detail-grammar-list');
const detailGrammarEmpty = document.getElementById('detail-grammar-empty');
const detailEmptyAddBtn = document.getElementById('detail-empty-add-btn');
const detailDeleteLessonBtn = document.getElementById('detail-delete-lesson-btn');

// Edit Student Modal DOM
const editStudentModalEl = document.getElementById('editStudentModal');
const studentNameInputField = document.getElementById('student-name-input-field');
const saveStudentNameBtn = document.getElementById('save-student-name-btn');

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
    } else if (type === 'book') {
      // Soft page turn / book thud
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.08);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
      osc.start(now);
      osc.stop(now + 0.16);
    } else if (type === 'shelf') {
      // Harmonic chord for shelf creation
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.15);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
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
 * Storage Helpers for Notes, Lessons & Library
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

function getSavedLessons() {
  const data = localStorage.getItem(STUDENT_LESSONS_KEY);
  if (!data) {
    const starters = STARTER_LESSONS[currentLang] || STARTER_LESSONS.fa;
    localStorage.setItem(STUDENT_LESSONS_KEY, JSON.stringify(starters));
    return [...starters];
  }
  try {
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

function saveLessons(lessons) {
  localStorage.setItem(STUDENT_LESSONS_KEY, JSON.stringify(lessons));
  populateLessonDropdowns();
  updateCounts();
}

function setStudentName(name) {
  currentStudentName = name;
  localStorage.setItem(STUDENT_NAME_KEY, name);
  if (studentNameText) studentNameText.textContent = name;
  if (lessonStudentName) lessonStudentName.value = name;
  if (studentNameInputField) studentNameInputField.value = name;
}

/**
 * Theme Manager: White, Cream, Black, Sky
 */
function setTheme(theme) {
  currentTheme = theme;
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  document.documentElement.setAttribute('data-bg-theme', theme);

  themeDotButtons.forEach(btn => {
    if (btn.dataset.theme === theme) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  if (theme === 'black') {
    document.documentElement.setAttribute('data-bs-theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-bs-theme', 'light');
  }
}

/**
 * Counters and Badges
 */
function updateCounts() {
  const notes = getSavedNotes();
  const lessons = getSavedLessons();
  const t = I18N[currentLang];

  const total = notes.length;
  const todoCount = notes.filter(n => n.notebook === 'todo').length;
  const rememberCount = notes.filter(n => n.notebook === 'remember').length;
  const historyCount = notes.filter(n => n.notebook === 'history').length;
  const grammarCount = notes.filter(n => n.notebook === 'grammar').length;
  const libraryCount = lessons.length;

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
  setTabCount('count-grammar', grammarCount);
  setTabCount('count-library', libraryCount);
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
  if (notebook === 'grammar') return t.badgeGrammar;
  return t.badgeTodo;
}

/**
 * Create Note Element DOM
 */
function createNoteElement(note) {
  const t = I18N[currentLang];
  const isGrammar = note.notebook === 'grammar';
  const noteEl = document.createElement('div');
  noteEl.className = `sticky-note note-${note.color} ${isGrammar ? 'note-grammar' : ''} ${note.isFinished ? 'is-finished' : ''}`;
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

  // If this note belongs to a student lesson or is a grammar rule, display lesson tag
  if (note.lessonId) {
    const lessons = getSavedLessons();
    const lesson = lessons.find(l => l.id === note.lessonId);
    if (lesson) {
      const lessonTag = document.createElement('div');
      lessonTag.className = 'grammar-rule-badge my-1';
      lessonTag.innerHTML = `<span>📖</span> <span>${lesson.title}</span>`;
      noteEl.appendChild(lessonTag);
    }
  }

  // Grammar Topic badge if present
  if (note.grammarTopic) {
    const topicTag = document.createElement('div');
    topicTag.className = 'fw-bold small text-primary mb-1';
    topicTag.textContent = note.grammarTopic;
    noteEl.appendChild(topicTag);
  }

  // Grammar Formula box if present
  if (note.grammarFormula) {
    const formulaBox = document.createElement('div');
    formulaBox.className = 'grammar-formula-box';
    formulaBox.textContent = `${t.formulaPrefix} ${note.grammarFormula}`;
    noteEl.appendChild(formulaBox);
  }

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

  // Grammar Example if present
  if (note.grammarExample) {
    const exampleEl = document.createElement('div');
    exampleEl.className = 'small text-muted fst-italic mt-2 pt-1 border-top';
    exampleEl.textContent = `${t.examplePrefix} ${note.grammarExample}`;
    noteEl.appendChild(exampleEl);
  }

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
function openAddNoteModal(prefillNotebook = null, prefillLessonId = null) {
  if (addNoteModalEl && window.bootstrap) {
    if (!addNoteModalInstance) {
      addNoteModalInstance = new bootstrap.Modal(addNoteModalEl);
    }
    modalNoteTextarea.value = '';
    if (modalGrammarTopic) modalGrammarTopic.value = '';
    if (modalGrammarFormula) modalGrammarFormula.value = '';
    if (modalGrammarExample) modalGrammarExample.value = '';

    populateLessonDropdowns();

    if (prefillNotebook && modalNotebookSelect) {
      modalNotebookSelect.value = prefillNotebook;
    }
    if (prefillLessonId && modalLessonSelect) {
      modalLessonSelect.value = prefillLessonId;
    }

    toggleGrammarFieldsVisibility();

    addNoteModalInstance.show();
    setTimeout(() => {
      modalNoteTextarea.focus();
    }, 250);
  }
}

function toggleGrammarFieldsVisibility() {
  const isGrammar = modalNotebookSelect && modalNotebookSelect.value === 'grammar';
  if (grammarFieldsContainer) {
    grammarFieldsContainer.classList.toggle('d-none', !isGrammar);
  }
}

/**
 * Submit note from modal
 */
function submitNoteFromModal() {
  const text = modalNoteTextarea.value.trim();

  if (!text) {
    modalNoteTextarea.classList.add('is-invalid', 'shake');
    if (modalSubmitAddBtn) modalSubmitAddBtn.classList.add('shake');
    playSound('error');
    modalNoteTextarea.focus();
    setTimeout(() => {
      modalNoteTextarea.classList.remove('is-invalid', 'shake');
      if (modalSubmitAddBtn) modalSubmitAddBtn.classList.remove('shake');
    }, 450);
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

  // If in Grammar Notebook, capture extra lesson and grammar attributes
  if (selectedNotebook === 'grammar') {
    newNote.lessonId = modalLessonSelect ? modalLessonSelect.value : null;
    newNote.grammarTopic = modalGrammarTopic ? modalGrammarTopic.value.trim() : '';
    newNote.grammarFormula = modalGrammarFormula ? modalGrammarFormula.value.trim() : '';
    newNote.grammarExample = modalGrammarExample ? modalGrammarExample.value.trim() : '';
  }

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
 * Populate Lesson Dropdowns & Shelf Selectors
 */
function populateLessonDropdowns() {
  const lessons = getSavedLessons();
  if (modalLessonSelect) {
    modalLessonSelect.innerHTML = '';
    lessons.forEach(l => {
      const opt = document.createElement('option');
      opt.value = l.id;
      opt.textContent = `${l.title} (${l.studentName || currentStudentName})`;
      modalLessonSelect.appendChild(opt);
    });
  }

  if (lessonShelfSelect) {
    lessonShelfSelect.innerHTML = '';
    const t = I18N[currentLang];
    for (let i = 0; i < shelfCount; i++) {
      const opt = document.createElement('option');
      opt.value = i;
      opt.textContent = `${t.shelfLabelWord} ${currentLang === 'fa' ? toPersianDigits(i + 1) : i + 1}`;
      lessonShelfSelect.appendChild(opt);
    }
  }
}

/**
 * Render Grammar Lesson Filter Chips (shown when Grammar Notebook is selected)
 */
function renderGrammarLessonChips() {
  if (!grammarLessonChips) return;
  const lessons = getSavedLessons();
  const t = I18N[currentLang];
  grammarLessonChips.innerHTML = '';

  // "All Lessons" Chip
  const allChip = document.createElement('button');
  allChip.type = 'button';
  allChip.className = `grammar-chip ${activeGrammarLessonFilter === 'all' ? 'active' : ''}`;
  allChip.textContent = `✨ ${t.allLessons}`;
  allChip.addEventListener('click', () => {
    activeGrammarLessonFilter = 'all';
    renderGrammarLessonChips();
    renderNotes();
  });
  grammarLessonChips.appendChild(allChip);

  // Per-Lesson Chips
  lessons.forEach(lesson => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = `grammar-chip ${activeGrammarLessonFilter === lesson.id ? 'active' : ''}`;
    chip.textContent = `📘 ${lesson.title}`;
    chip.addEventListener('click', () => {
      activeGrammarLessonFilter = lesson.id;
      renderGrammarLessonChips();
      renderNotes();
    });
    grammarLessonChips.appendChild(chip);
  });
}

/**
 * Render Notes matching active notebook filter and search query
 */
function renderNotes() {
  // If Library tab is active, display the Library view and hide sticky notes
  if (activeNotebookFilter === 'library') {
    notesGrid.classList.add('d-none');
    grammarFilterBar.classList.add('d-none');
    libraryView.classList.remove('d-none');
    emptyState.classList.add('d-none');
    renderLibrary();
    updateFilterText();
    updateCounts();
    return;
  }

  // Sticky notes view
  libraryView.classList.add('d-none');
  notesGrid.classList.remove('d-none');

  if (activeNotebookFilter === 'grammar') {
    grammarFilterBar.classList.remove('d-none');
    renderGrammarLessonChips();
  } else {
    grammarFilterBar.classList.add('d-none');
  }

  const notes = getSavedNotes();
  notesGrid.innerHTML = '';

  let filtered = notes;

  if (activeNotebookFilter !== 'all') {
    filtered = filtered.filter(n => n.notebook === activeNotebookFilter);
  }

  if (activeNotebookFilter === 'grammar' && activeGrammarLessonFilter !== 'all') {
    filtered = filtered.filter(n => n.lessonId === activeGrammarLessonFilter);
  }

  if (searchQuery.trim()) {
    const q = searchQuery.trim().toLowerCase();
    filtered = filtered.filter(n => {
      const matchText = n.text && n.text.toLowerCase().includes(q);
      const matchTopic = n.grammarTopic && n.grammarTopic.toLowerCase().includes(q);
      const matchFormula = n.grammarFormula && n.grammarFormula.toLowerCase().includes(q);
      return matchText || matchTopic || matchFormula;
    });
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

/**
 * Render the 3D Bookshelf Library ("How many shelves do you need in your library?")
 */
function renderLibrary() {
  if (!bookshelvesContainer) return;
  bookshelvesContainer.innerHTML = '';
  const lessons = getSavedLessons();
  const notes = getSavedNotes();
  const t = I18N[currentLang];

  // Update quick shelf buttons active state
  shelfQuickButtons.forEach(btn => {
    const num = parseInt(btn.dataset.shelves, 10);
    btn.classList.toggle('active', num === shelfCount);
  });

  if (studentNameText) studentNameText.textContent = currentStudentName;

  // Render each shelf unit according to shelfCount
  for (let shelfIndex = 0; shelfIndex < shelfCount; shelfIndex++) {
    const shelfUnit = document.createElement('div');
    shelfUnit.className = 'shelf-unit shadow-sm';
    shelfUnit.dataset.shelfIndex = shelfIndex;

    const displayShelfNum = currentLang === 'fa' ? toPersianDigits(shelfIndex + 1) : shelfIndex + 1;

    // Shelf Header
    const shelfHeader = document.createElement('div');
    shelfHeader.className = 'shelf-unit-header d-flex justify-content-between align-items-center';

    const shelfBooks = lessons.filter(l => (l.shelfIndex ?? (l.number % shelfCount)) === shelfIndex);
    const bookCountText = currentLang === 'fa' 
      ? `${toPersianDigits(shelfBooks.length)} کتاب / دفترچه`
      : `${shelfBooks.length} books / notebooks`;

    shelfHeader.innerHTML = `
      <span class="fw-bold small d-flex align-items-center gap-2">
        <span>📚</span>
        <span>${t.shelfLabelWord} ${displayShelfNum}</span>
      </span>
      <span class="text-muted small">${bookCountText}</span>
    `;
    shelfUnit.appendChild(shelfHeader);

    // Shelf Books Row
    const booksRow = document.createElement('div');
    booksRow.className = 'shelf-books-row';

    if (shelfBooks.length === 0) {
      const emptyHint = document.createElement('div');
      emptyHint.className = 'empty-shelf-hint';
      emptyHint.textContent = t.shelfEmptyText;
      booksRow.appendChild(emptyHint);
    } else {
      shelfBooks.forEach((lesson, idx) => {
        const bookEl = document.createElement('div');
        const sizeClass = ['size-sm', 'size-md', 'size-lg'][idx % 3];
        const colorClass = `book-color-${lesson.color || 'blue'}`;
        bookEl.className = `shelf-book ${sizeClass} ${colorClass}`;
        bookEl.title = `${lesson.title} - ${t.bookOpenHint}`;

        // Grammar count for this lesson
        const lessonGrammarCount = notes.filter(n => n.notebook === 'grammar' && n.lessonId === lesson.id).length;
        const displayGrammarCount = currentLang === 'fa' ? toPersianDigits(lessonGrammarCount) : lessonGrammarCount;

        bookEl.innerHTML = `
          <div class="book-spine-gold-line"></div>
          <div class="small fw-bold opacity-75">${displayShelfNum}</div>
          <div class="book-spine-title">${lesson.title}</div>
          <div class="book-spine-gold-line"></div>
          <div class="small" style="font-size: 0.65rem;">📖 ${displayGrammarCount}</div>
          <div class="book-ribbon ${idx % 2 === 0 ? 'gold' : 'blue'}"></div>
        `;

        bookEl.addEventListener('click', () => {
          playSound('book');
          openLessonDetailModal(lesson.id);
        });

        booksRow.appendChild(bookEl);
      });
    }

    shelfUnit.appendChild(booksRow);

    // Realistic Shelf Plank Ledge
    const plank = document.createElement('div');
    plank.className = 'shelf-plank';
    shelfUnit.appendChild(plank);

    bookshelvesContainer.appendChild(shelfUnit);
  }
}

/**
 * Open Lesson & Grammar Reader Detail Modal
 */
function openLessonDetailModal(lessonId) {
  pendingDetailLessonId = lessonId;
  const lessons = getSavedLessons();
  const lesson = lessons.find(l => l.id === lessonId);
  if (!lesson) return;

  const notes = getSavedNotes();
  const grammarNotes = notes.filter(n => n.notebook === 'grammar' && n.lessonId === lessonId);
  const t = I18N[currentLang];

  if (detailLessonTitle) detailLessonTitle.textContent = lesson.title;
  if (detailStudentBadge) detailStudentBadge.textContent = `🎓 ${lesson.studentName || currentStudentName}`;
  if (detailShelfBadge) detailShelfBadge.textContent = `${t.shelfLabelWord} ${(lesson.shelfIndex || 0) + 1}`;
  if (detailGrammarCountBadge) {
    const countDisplay = currentLang === 'fa' ? toPersianDigits(grammarNotes.length) : grammarNotes.length;
    detailGrammarCountBadge.textContent = `${countDisplay} ${t.badgeGrammar}`;
  }
  if (detailLessonSummary) detailLessonSummary.textContent = lesson.summary || t.lessonSummaryHeading;

  // Render grammar notes inside detail modal
  if (detailGrammarList) {
    detailGrammarList.innerHTML = '';
    if (grammarNotes.length === 0) {
      if (detailGrammarEmpty) detailGrammarEmpty.classList.remove('d-none');
    } else {
      if (detailGrammarEmpty) detailGrammarEmpty.classList.add('d-none');
      grammarNotes.forEach(gn => {
        const card = document.createElement('div');
        card.className = 'grammar-rule-card';
        card.innerHTML = `
          <div class="d-flex justify-content-between align-items-center mb-1">
            <strong class="text-primary small">${gn.grammarTopic || t.grammarBadge}</strong>
            <span class="badge bg-secondary-subtle text-secondary small">${formatTime(gn.createdAt)}</span>
          </div>
          ${gn.grammarFormula ? `<div class="grammar-formula-box mb-2">${t.formulaPrefix} ${gn.grammarFormula}</div>` : ''}
          <div class="small mb-1">${gn.text}</div>
          ${gn.grammarExample ? `<div class="small text-muted fst-italic pt-1 border-top">${t.examplePrefix} ${gn.grammarExample}</div>` : ''}
        `;
        detailGrammarList.appendChild(card);
      });
    }
  }

  if (lessonDetailModalEl && window.bootstrap) {
    if (!lessonDetailModalInstance) {
      lessonDetailModalInstance = new bootstrap.Modal(lessonDetailModalEl);
    }
    lessonDetailModalInstance.show();
  }
}

/**
 * Configure Shelves Action
 */
function setShelfCount(num) {
  shelfCount = Math.max(1, Math.min(8, num));
  localStorage.setItem(LIBRARY_CONFIG_KEY, shelfCount.toString());
  playSound('shelf');
  populateLessonDropdowns();
  showToast(I18N[currentLang].toastShelvesUpdated, '🏛️');
  if (activeNotebookFilter === 'library') {
    renderLibrary();
  }
}

/**
 * Update Filter Text
 */
function updateFilterText() {
  const t = I18N[currentLang];
  let msg = t.filterAll;
  if (activeNotebookFilter === 'todo') msg = t.filterTodo;
  else if (activeNotebookFilter === 'remember') msg = t.filterRemember;
  else if (activeNotebookFilter === 'history') msg = t.filterHistory;
  else if (activeNotebookFilter === 'grammar') msg = t.filterGrammar;
  else if (activeNotebookFilter === 'library') msg = t.filterLibrary;

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
      <option value="grammar">${t.badgeGrammar}</option>
    `;
  }

  populateLessonDropdowns();
  renderNotes();
}

/**
 * Event Listeners & Initialization
 */
function setupEventListeners() {
  // Add Note Button opens Modal
  addBtn.addEventListener('click', () => openAddNoteModal());

  // Notebook selector change inside modal toggles grammar fields
  if (modalNotebookSelect) {
    modalNotebookSelect.addEventListener('change', toggleGrammarFieldsVisibility);
  }

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

  // Quick Shelf Selector Buttons ("How many shelves do you need?")
  shelfQuickButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const num = parseInt(btn.dataset.shelves, 10);
      setShelfCount(num);
    });
  });

  // Open Shelf Setup Modal
  if (openShelfModalBtn) {
    openShelfModalBtn.addEventListener('click', () => {
      modalTempShelfNumber = shelfCount;
      if (shelfModalNumber) shelfModalNumber.textContent = currentLang === 'fa' ? toPersianDigits(modalTempShelfNumber) : modalTempShelfNumber;
      modalShelfChips.forEach(c => {
        c.classList.toggle('active', parseInt(c.dataset.num, 10) === modalTempShelfNumber);
      });
      if (shelfSetupModalEl && window.bootstrap) {
        if (!shelfSetupModalInstance) shelfSetupModalInstance = new bootstrap.Modal(shelfSetupModalEl);
        shelfSetupModalInstance.show();
      }
    });
  }

  // Shelf Setup Stepper & Chips
  if (shelfDecrementBtn) {
    shelfDecrementBtn.addEventListener('click', () => {
      if (modalTempShelfNumber > 1) {
        modalTempShelfNumber--;
        if (shelfModalNumber) shelfModalNumber.textContent = currentLang === 'fa' ? toPersianDigits(modalTempShelfNumber) : modalTempShelfNumber;
      }
    });
  }

  if (shelfIncrementBtn) {
    shelfIncrementBtn.addEventListener('click', () => {
      if (modalTempShelfNumber < 8) {
        modalTempShelfNumber++;
        if (shelfModalNumber) shelfModalNumber.textContent = currentLang === 'fa' ? toPersianDigits(modalTempShelfNumber) : modalTempShelfNumber;
      }
    });
  }

  modalShelfChips.forEach(chip => {
    chip.addEventListener('click', () => {
      modalShelfChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      modalTempShelfNumber = parseInt(chip.dataset.num, 10);
      if (shelfModalNumber) shelfModalNumber.textContent = currentLang === 'fa' ? toPersianDigits(modalTempShelfNumber) : modalTempShelfNumber;
    });
  });

  if (saveShelvesBtn) {
    saveShelvesBtn.addEventListener('click', () => {
      setShelfCount(modalTempShelfNumber);
      if (shelfSetupModalInstance) shelfSetupModalInstance.hide();
    });
  }

  // Add Lesson Button
  if (addLessonBtn) {
    addLessonBtn.addEventListener('click', () => {
      populateLessonDropdowns();
      if (lessonTitleInput) lessonTitleInput.value = '';
      if (lessonSummaryInput) lessonSummaryInput.value = '';
      if (lessonStudentName) lessonStudentName.value = currentStudentName;
      if (addLessonModalEl && window.bootstrap) {
        if (!addLessonModalInstance) addLessonModalInstance = new bootstrap.Modal(addLessonModalEl);
        addLessonModalInstance.show();
      }
    });
  }

  // Lesson Color Swatches
  if (lessonColorPalette) {
    lessonColorPalette.querySelectorAll('.modal-swatch').forEach(sw => {
      sw.addEventListener('click', () => {
        lessonColorPalette.querySelectorAll('.modal-swatch').forEach(s => s.classList.remove('active'));
        sw.classList.add('active');
        selectedLessonColor = sw.dataset.color;
      });
    });
  }

  // Submit Create Lesson
  if (submitCreateLessonBtn) {
    submitCreateLessonBtn.addEventListener('click', () => {
      const title = lessonTitleInput ? lessonTitleInput.value.trim() : '';
      if (!title) {
        lessonTitleInput.classList.add('is-invalid', 'shake');
        playSound('error');
        setTimeout(() => lessonTitleInput.classList.remove('is-invalid', 'shake'), 450);
        return;
      }

      const lessons = getSavedLessons();
      const newLesson = {
        id: `lesson-${Date.now()}`,
        number: lessons.length + 1,
        title: title,
        subject: lessonSubjectInput ? lessonSubjectInput.value.trim() : 'English',
        studentName: lessonStudentName ? lessonStudentName.value.trim() : currentStudentName,
        color: selectedLessonColor,
        shelfIndex: lessonShelfSelect ? parseInt(lessonShelfSelect.value, 10) : 0,
        summary: lessonSummaryInput ? lessonSummaryInput.value.trim() : '',
        createdAt: Date.now()
      };

      lessons.push(newLesson);
      saveLessons(lessons);

      if (addLessonModalInstance) addLessonModalInstance.hide();
      playSound('shelf');
      showToast(I18N[currentLang].toastLessonAdded, '📚');

      if (activeNotebookFilter === 'library') {
        renderLibrary();
      } else {
        renderNotes();
      }
    });
  }

  // Quick Add Grammar buttons
  const triggerAddGrammar = (lessonId = null) => {
    openAddNoteModal('grammar', lessonId);
  };

  if (quickAddGrammarBtn) quickAddGrammarBtn.addEventListener('click', () => triggerAddGrammar());
  if (quickAddGrammarFromBar) quickAddGrammarFromBar.addEventListener('click', () => triggerAddGrammar(activeGrammarLessonFilter !== 'all' ? activeGrammarLessonFilter : null));

  if (detailAddGrammarBtn) {
    detailAddGrammarBtn.addEventListener('click', () => {
      if (lessonDetailModalInstance) lessonDetailModalInstance.hide();
      triggerAddGrammar(pendingDetailLessonId);
    });
  }

  if (detailEmptyAddBtn) {
    detailEmptyAddBtn.addEventListener('click', () => {
      if (lessonDetailModalInstance) lessonDetailModalInstance.hide();
      triggerAddGrammar(pendingDetailLessonId);
    });
  }

  // Delete Lesson Button in detail modal
  if (detailDeleteLessonBtn) {
    detailDeleteLessonBtn.addEventListener('click', () => {
      if (!pendingDetailLessonId) return;
      const lessons = getSavedLessons().filter(l => l.id !== pendingDetailLessonId);
      saveLessons(lessons);
      if (lessonDetailModalInstance) lessonDetailModalInstance.hide();
      playSound('delete');
      showToast(I18N[currentLang].toastLessonDeleted, '🗑️');
      if (activeNotebookFilter === 'library') {
        renderLibrary();
      }
    });
  }

  // Student Name Edit
  if (studentNameDisplay) {
    studentNameDisplay.addEventListener('click', () => {
      if (studentNameInputField) studentNameInputField.value = currentStudentName;
      if (editStudentModalEl && window.bootstrap) {
        if (!editStudentModalInstance) editStudentModalInstance = new bootstrap.Modal(editStudentModalEl);
        editStudentModalInstance.show();
      }
    });
  }

  if (saveStudentNameBtn) {
    saveStudentNameBtn.addEventListener('click', () => {
      const newName = studentNameInputField ? studentNameInputField.value.trim() : '';
      if (newName) {
        setStudentName(newName);
        showToast(I18N[currentLang].toastStudentNameUpdated, '🎓');
      }
      if (editStudentModalInstance) editStudentModalInstance.hide();
    });
  }
}

function init() {
  setupEventListeners();
  setTheme(currentTheme);
  setLanguage(currentLang);
  setStudentName(currentStudentName);
}

document.addEventListener('DOMContentLoaded', init);
