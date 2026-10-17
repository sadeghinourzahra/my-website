/**
 * Sticky Notes Application with Student Lessons Library, Grammar Notebooks,
 * Emojis, Timeline of Tasks, and Daily Plans Reflection (Score 1 to 10)
 */

const STORAGE_KEY = 'sticky_notes_data_v3';
const LANG_STORAGE_KEY = 'sticky_notes_lang';
const THEME_STORAGE_KEY = 'sticky_notes_theme';
const STUDENT_LESSONS_KEY = 'sticky_student_lessons_v3';
const LIBRARY_CONFIG_KEY = 'sticky_library_config_v3';
const STUDENT_NAME_KEY = 'sticky_student_name_v3';
const DAILY_REVIEWS_KEY = 'sticky_daily_reviews_v3';
const USER_MEDALS_KEY = 'sticky_user_medals_v1';
const QUALITY_REVIEWS_KEY = 'sticky_quality_reviews_v1';
const IDEAS_PINNED_COUNT_KEY = 'sticky_ideas_pinned_count_v1';

const COLOR_PALETTE = ['yellow', 'pink', 'blue', 'green', 'purple', 'orange'];
const BOOK_COLORS = ['blue', 'purple', 'emerald', 'amber', 'rose', 'leather'];
const POPULAR_EMOJIS = [
  '📌', '⭐', '💡', '🔥', '🎯', '✅', '📚', '✍️', '🧠', '🚀', 
  '❤️', '🎉', '☕', '🔔', '⚡', '🌟', '🐱', '🏆', '🌈', '💎', 
  '🍕', '🎨', '🎵', '🌿'
];

// State
let currentLang = localStorage.getItem(LANG_STORAGE_KEY) || 'fa';
let currentTheme = localStorage.getItem(THEME_STORAGE_KEY) || 'sky';
let currentStudentName = localStorage.getItem(STUDENT_NAME_KEY) || (currentLang === 'fa' ? 'زهرا' : 'Zahra');
let shelfCount = parseInt(localStorage.getItem(LIBRARY_CONFIG_KEY) || '3', 10);
let activeNotebookFilter = 'all'; // 'all', 'todo', 'remember', 'history', 'grammar', 'library', 'timeline'
let activeGrammarLessonFilter = 'all';
let activeTimelineFilter = 'all'; // 'all', 'finished', 'pending'
let searchQuery = '';
let selectedModalColor = 'yellow';
let selectedModalEmoji = '📌';
let selectedLessonColor = 'blue';
let selectedDayScore = 9;
let selectedPlanStatus = 'yes'; // 'yes' or 'no'
let selectedQualityPlanStatus = 'yes';
let selectedQualityScore = 10;
let selectedObstacle = 'distraction';
let qualityBoxCollapsed = false;
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
    pageTitle: "یادداشت‌های چسبان، تایم‌لاین کارها و ارزیابی روزانه",
    seoDescription: "برنامه تابلوی یادداشت‌های چسبان، ایموجی، کتابخانه دروس، تایم‌لاین کارهای تمام‌شده و ارزیابی و امتیازدهی روزانه.",
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
    tabTimeline: "تایم‌لاین کارها",
    badgeTodo: "📋 کارهای من",
    badgeRemember: "🧠 یادآوری",
    badgeHistory: "📜 تاریخچه",
    badgeGrammar: "📖 دفترچه گرامر",
    badgeTimeline: "⏳ تایم‌لاین",
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
    chooseEmojiLabel: "نشان ایموجی یادداشت:",
    quickInsertEmoji: "ایموجی سریع:",
    changeEmojiTooltip: "کلیک برای تغییر ایموجی",
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
    filterTimeline: "نمایش: تایم‌لاین کارها و ارزیابی روزانه",
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
    toastEmojiUpdated: "ایموجی یادداشت تغییر یافت 🎉",
    toastDailyReviewSaved: "بازخورد و امتیاز روز با موفقیت ثبت شد 🌟",
    toastMedalEarned: "مدال طلای افتخار با موفقیت به ویترین شما اضافه شد! 🥇",
    toastIdeaPinned: "راهکار طلایی به عنوان یادداشت روی تابلوی شما چسبانده شد! 💡",
    toastQualityReviewSaved: "ارزیابی کیفیت و راهکارهای فردا با موفقیت ثبت شد 🌟",
    
    // Activity Quality & Medals (New Feature)
    qualityToolbarBtn: "کیفیت فعالیت‌ها",
    activityQualityTitle: "سنجش کیفیت فعالیت‌ها و برنامه‌ها",
    medalsEarnedLabel: "مدال افتخار کسب‌شده",
    activityQualitySubtitle: "ارزیابی میزان تمرکز، تحقق برنامه‌های امروز و ارتقای کیفیت عملکرد با راهکارهای هوشمند",
    trophyCabinetBtn: "ویترین مدال‌ها",
    dailyCheckTag: "سوال ارزیابی امروز",
    qualityPlanQuestion: "❓ وضعیت برنامه‌هایتان چطور بود؟ آیا توانستید به تمام برنامه‌های امروز خود برسید؟",
    qualityPlanPrompt: "اگر به تمام برنامه‌هایتان رسیدید، مدال افتخار طلا دریافت کنید! و اگر نرسیدید، علت را بررسی می‌کنیم و راهکارهای علمی برای فردا به شما می‌دهیم:",
    qualityYesTitle: "بله، به تمام برنامه‌هایم رسیدم!",
    qualityYesSub: "دریافت مدال طلای افتخار 🏅",
    qualityNoTitle: "خیر، متاسفانه نتوانستم",
    qualityNoSub: "بررسی علت و دریافت راهکارهای کمکی 💡",
    medalRibbonTag: "مدال طلای کیفیت و موفقیت روز",
    medalCongratsHeading: "آفرین و تبریک فراوان! کار بسیار درخشانی انجام دادید!",
    medalCongratsDesc: "شما با اراده، تمرکز و کیفیت بالا توانستید ۱۰۰٪ برنامه‌های امروز را محقق کنید. یک مدال طلایی افتخار با موفقیت به ویترین مدال‌های شما افزوده شد!",
    allTasksAccomplished: "تمام کارها با موفقیت انجام شد",
    celebrateAgainBtn: "شادی دوباره با آتش‌بازی",
    successFactorLabel: "چه عامل، تکنیک یا رفتاری امروز بیشترین کمک را به تمرکز و پیشبرد برنامه‌هایتان کرد؟",
    successFactorPlaceholder: "مثال: شروع اول صبح، سکوت محیط، اشتیاق بالا، تکنیک پومودورو...",
    scoreQualityLabel: "به کیفیت و تمرکز امروزتان چه امتیازی می‌دهید؟ (۱ تا ۱۰):",
    saveMedalBtn: "ثبت مدال در ویترین افتخارات",
    noWorryQualityHeading: "هیچ اشکالی ندارد! مهم این است که دلایل را بشناسیم و برای فردا هوشمندانه‌تر عمل کنیم.",
    noWorryQualitySub: "مسیر رشد با بازنگری و یادگیری ساخته می‌شود. یک دلیل انتخاب کنید تا راهکارهای کاربردی دریافت نمایید:",
    whyCantQualityLabel: "چرا نتوانستید به همه برنامه‌ها برسید؟ مانع یا دلیل اصلی چه بود؟",
    obsDistraction: "حواس‌پرتی و گوشی",
    obsTime: "کمبود وقت یا تخمین اشتباه",
    obsOverload: "حجم زیاد کارها و سردرگمی",
    obsProcrastination: "اهمال‌کاری و تنبلی در شروع",
    obsFatigue: "خستگی و کمبود انرژی",
    obsUnexpected: "اتفاقات غیرمنتظره",
    obstacleQualityPlaceholder: "توضیحات بیشتر یا موانع خاص دیگر شما (اختیاری)...",
    smartIdeasHeading: "راهکارهای هوشمند و پیشنهادی برای حل این مانع و موفقیت فردا:",
    smartIdeasDesc: "می‌توانید هر یک از راهکارهای زیر را با یک کلیک مستقیماً به عنوان یک «یادداشت چسبان» به تابلوی خود اضافه کنید تا فردا جلوی چشمتان باشد!",
    scoreEffortLabel: "با تمام این تفاسیر، به میزان تلاش و اراده امروزتان چه امتیازی می‌دهید؟ (۱ تا ۱۰):",
    saveReflectionBtn: "ثبت ارزیابی و راهکارهای فردا",
    trophyCabinetTitle: "ویترین افتخارات و تاریخچه سنجش کیفیت",
    statTotalMedals: "مدال‌های طلایی",
    statStreak: "روز موفق متوالی",
    statIdeasPinned: "راهکار پین‌شده",
    medalModalHeading: "تبریک! شما مدال طلای کیفیت را کسب کردید!",
    medalModalDesc: "تمام برنامه‌های امروز شما با کیفیت ۱۰۰٪ انجام شدند. پشتکار و اراده شما شایسته بالاترین تقدیر است.",
    claimMedalBtn: "عالیه! دریافت مدال و ادامه 🌟",
    pinIdeaBtnText: "افزودن به تابلوی یادداشت",
    scoreTextPrefixQuality: "امتیاز ثبت‌شده:",
    
    // Timeline & Daily Reflection
    timelineTitle: "تایم‌لاین زمانی کارها و یادداشت‌ها",
    timelineDesc: "مشاهده روند زمانی، کارهای تکمیل‌شده و کارهای باقی‌مانده به همراه ارزیابی و امتیاز روزانه.",
    timelineAll: "همه کارها",
    timelineFinished: "✓ انجام‌شده",
    timelinePending: "⏳ در حال انجام",
    dailyReviewHeading: "بررسی روزانه برنامه‌ها و امتیاز روز",
    dailyReviewSubheading: "ارزیابی میزان موفقیت در انجام برنامه‌های امروز و ثبت تجربیات",
    planQuestion: "❓ آیا توانستید به برنامه‌های امروز خود عمل کنید؟",
    planYesBtn: "بله، انجام دادم!",
    planNoBtn: "نه، متاسفانه نتوانستم",
    congratsHeading: "آفرین و تبریک! کار بسیار عالی انجام دادید!",
    successQuestionLabel: "چه چیزی یا راهکاری امروز بیشترین کمک را به انجام برنامه‌هایتان کرد؟",
    successNotePlaceholder: "مثال: تمرکز بالا، شروع به موقع و برنامه‌ریزی دقیق...",
    noWorryHeading: "اشکالی ندارد! مهم این است که دلایل را بشناسیم و برای فردا بهتر شویم:",
    whyCantLabel: "چرا نتوانستید برنامه‌هایتان را انجام دهید؟ علت یا مانع اصلی چه بود؟",
    obstaclePlaceholder: "دلایل یا موانع را بنویسید (مثلاً: کمبود وقت، اتفاق غیرمنتظره، خستگی، کارهای سنگین...)",
    scoreDayLabel: "به عملکرد امروزتان چه امتیازی می‌دهید؟ (از ۱ تا ۱۰):",
    saveDailyReviewBtn: "ثبت بازخورد روز",
    pastReviewsTitle: "دفترچه ارزیابی‌های ثبت‌شده روزانه",
    noPastReviews: "هنوز بازخوردی برای روزهای گذشته ثبت نشده است.",
    scoreTextPrefix: "امتیاز انتخاب‌شده:",
    fromTen: "از ۱۰",
    statusDone: "تکمیل شده ✓",
    statusPending: "در حال انجام ⏳",
    markAsDone: "علامت‌گذاری به عنوان تکمیل‌شده",
    markAsPending: "بازگشت به حالت در حال انجام",

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
    pageTitle: "Sticky Notes, Timeline & Daily Reflection Rating",
    seoDescription: "Sticky notes bulletin board, timeline with finished vs pending tasks, daily plans reflection with 1-10 rating, student library, and grammar notebooks.",
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
    tabTimeline: "Work Timeline",
    badgeTodo: "📋 To do it",
    badgeRemember: "🧠 Remember",
    badgeHistory: "📜 History",
    badgeGrammar: "📖 Grammar",
    badgeTimeline: "⏳ Timeline",
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
    chooseEmojiLabel: "Note Emoji:",
    quickInsertEmoji: "Quick Emoji:",
    changeEmojiTooltip: "Click to change emoji",
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
    filterTimeline: "Showing: Tasks Timeline & Daily Reflection",
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
    toastEmojiUpdated: "Note emoji updated! 🎉",
    toastDailyReviewSaved: "Daily reflection and score saved! 🌟",
    toastMedalEarned: "Gold Medal of Honor added to your trophy cabinet! 🥇",
    toastIdeaPinned: "Golden strategy pinned as a sticky note to your board! 💡",
    toastQualityReviewSaved: "Daily quality reflection and tomorrow's ideas saved! 🌟",
    
    // Activity Quality & Medals (New Feature)
    qualityToolbarBtn: "Activity Quality",
    activityQualityTitle: "Activities Quality & Plans Reflection",
    medalsEarnedLabel: "Medals Earned",
    activityQualitySubtitle: "Evaluate your focus, accomplishment rate, and elevate performance with smart strategies",
    trophyCabinetBtn: "Trophy Cabinet",
    dailyCheckTag: "Daily Quality Check",
    qualityPlanQuestion: "❓ What about your plans today? Were you able to achieve and reach all your plans?",
    qualityPlanPrompt: "If yes, earn a Gold Medal of Honor! If not, we'll identify the cause and give you science-backed solutions for tomorrow:",
    qualityYesTitle: "Yes, I achieved all my plans!",
    qualityYesSub: "Earn Gold Medal of Honor 🏅",
    qualityNoTitle: "No, unfortunately not",
    qualityNoSub: "Analyze cause & get smart ideas 💡",
    medalRibbonTag: "Daily Quality & Excellence Gold Medal",
    medalCongratsHeading: "Awesome job! Congratulations on your stellar achievement!",
    medalCongratsDesc: "With focus and grit, you reached 100% of your plans today. A sparkling gold medal has been added to your trophy cabinet!",
    allTasksAccomplished: "All plans completed successfully",
    celebrateAgainBtn: "Celebrate Again with Confetti",
    successFactorLabel: "What factor, technique, or habit contributed most to your success today?",
    successFactorPlaceholder: "Example: Early start, quiet environment, high focus, Pomodoro...",
    scoreQualityLabel: "How do you rate your quality and focus today? (1 to 10):",
    saveMedalBtn: "Save Medal in Trophy Cabinet",
    noWorryQualityHeading: "No worries! What matters is identifying the obstacles and acting smarter tomorrow.",
    noWorryQualitySub: "Growth is forged through reflection. Select a reason below to get tailored, proven ideas:",
    whyCantQualityLabel: "Why couldn't you accomplish all your plans? What was the primary obstacle?",
    obsDistraction: "Distractions & Phone",
    obsTime: "Lack of time / Bad estimation",
    obsOverload: "Too many tasks & Overwhelm",
    obsProcrastination: "Procrastination & Delay",
    obsFatigue: "Fatigue & Low energy",
    obsUnexpected: "Unexpected interruptions",
    obstacleQualityPlaceholder: "Additional details or specific obstacles (optional)...",
    smartIdeasHeading: "Smart & actionable solutions to resolve this obstacle tomorrow:",
    smartIdeasDesc: "Click the button on any idea to instantly pin it as a sticky note on your board for tomorrow!",
    scoreEffortLabel: "Despite the challenges, how would you score your effort today? (1 to 10):",
    saveReflectionBtn: "Save Reflection & Tomorrow's Ideas",
    trophyCabinetTitle: "Trophy Cabinet & Quality History",
    statTotalMedals: "Gold Medals",
    statStreak: "Success Streak",
    statIdeasPinned: "Ideas Pinned",
    medalModalHeading: "Congratulations! You earned a Daily Quality Gold Medal!",
    medalModalDesc: "All your plans today were accomplished with 100% quality. Your grit and focus deserve the highest praise.",
    claimMedalBtn: "Awesome! Claim Medal & Continue 🌟",
    pinIdeaBtnText: "Pin to Sticky Board",
    scoreTextPrefixQuality: "Selected Score:",

    // Timeline & Daily Reflection
    timelineTitle: "Chronological Tasks & Notes Timeline",
    timelineDesc: "Track your timeline, see finished vs pending tasks, and reflect on your daily plans.",
    timelineAll: "All Tasks",
    timelineFinished: "✓ Done",
    timelinePending: "⏳ In Progress",
    dailyReviewHeading: "Daily Plans Reflection & Day Score",
    dailyReviewSubheading: "Evaluate today's accomplishments and record key takeaways",
    planQuestion: "❓ Did you accomplish your plans today?",
    planYesBtn: "Yes, I did!",
    planNoBtn: "No, unfortunately not",
    congratsHeading: "Awesome job! Congratulations on your accomplishments!",
    successQuestionLabel: "What contributed most to your success today?",
    successNotePlaceholder: "Example: High focus, starting early, good planning...",
    noWorryHeading: "No worries! What matters is identifying obstacles and improving for tomorrow:",
    whyCantLabel: "Why couldn't you accomplish your plans? What was the main obstacle?",
    obstaclePlaceholder: "Write the obstacles or reasons (e.g. lack of time, unexpected events, fatigue...)",
    scoreDayLabel: "How would you rate today's performance? (from 1 to 10):",
    saveDailyReviewBtn: "Save Daily Reflection",
    pastReviewsTitle: "Daily Reflection Journal",
    noPastReviews: "No daily reflections recorded yet.",
    scoreTextPrefix: "Selected Score:",
    fromTen: "out of 10",
    statusDone: "Completed ✓",
    statusPending: "In Progress ⏳",
    markAsDone: "Mark as Completed",
    markAsPending: "Reopen as In Progress",

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
      summary: 'بیان توانایی، اجبار و توصیه با can, must, should و have to.',
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

// Default starter notes including emojis and student grammar notebooks
const STARTER_NOTES = {
  fa: [
    {
      id: 'starter-fa-1',
      text: "✨ به تابلوی یادداشت‌های چسبان و کتابخانه دروس خوش آمدید!\nمی‌توانید قفسه‌های کتابخانه را بر اساس دروس خود تنظیم کرده و برای هر درس دفترچه گرامر بسازید.",
      color: 'blue',
      emoji: '✨',
      notebook: 'todo',
      isFinished: true,
      finishedAt: Date.now() - 3600000 * 2,
      rotation: -1.8,
      createdAt: Date.now() - 3600000 * 3
    },
    {
      id: 'starter-fa-grammar-1',
      text: "📖 قاعده گرامر درس ۱: زمان حال ساده\nکاربرد: برای صحبت در مورد عادات روزمره، برنامه‌های ثابت و حقایق علمی.",
      color: 'blue',
      emoji: '💡',
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
      emoji: '✍️',
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
      emoji: '🧠',
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
      emoji: '🎯',
      notebook: 'todo',
      isFinished: true,
      finishedAt: Date.now() - 3600000 * 1,
      rotation: 1.5,
      createdAt: Date.now() - 3600000 * 4
    },
    {
      id: 'starter-fa-3',
      text: "🧠 یادآوری مهم:\nبا زدن روی هر کتاب در قفسه کتابخانه، دفترچه اختصاصی گرامر آن درس همراه با فرمول‌ها باز می‌شود!",
      color: 'pink',
      emoji: '🔔',
      notebook: 'remember',
      isFinished: false,
      rotation: -1.2,
      createdAt: Date.now() - 3600000 * 6
    },
    {
      id: 'starter-fa-4',
      text: "📜 سابقه کارها:\nکتابخانه دروس دانش‌آموز، قفسه‌بندی پویا و دفترچه گرامر با موفقیت راه‌اندازی شد.",
      color: 'green',
      emoji: '🏆',
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
      emoji: '✨',
      notebook: 'todo',
      isFinished: true,
      finishedAt: Date.now() - 3600000 * 2,
      rotation: -1.8,
      createdAt: Date.now() - 3600000 * 3
    },
    {
      id: 'starter-en-grammar-1',
      text: "📖 Grammar Rule Lesson 1: Present Simple\nUsage: Habits, daily routines, and universal truths.",
      color: 'blue',
      emoji: '💡',
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
      emoji: '✍️',
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
      emoji: '🧠',
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
      emoji: '🎯',
      notebook: 'todo',
      isFinished: true,
      finishedAt: Date.now() - 3600000 * 1,
      rotation: 1.5,
      createdAt: Date.now() - 3600000 * 4
    },
    {
      id: 'starter-en-3',
      text: "🧠 My remember it:\nClick any book on the bookshelf to open its grammar notebook and formulas!",
      color: 'pink',
      emoji: '🔔',
      notebook: 'remember',
      isFinished: false,
      rotation: -1.2,
      createdAt: Date.now() - 3600000 * 6
    },
    {
      id: 'starter-en-4',
      text: "📜 My history:\nStudent library, custom shelf builder, and lesson grammar notebooks enabled.",
      color: 'green',
      emoji: '🏆',
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
const timelineView = document.getElementById('timeline-view');
const timelineFlow = document.getElementById('timeline-flow');
const timelineFilterButtons = document.querySelectorAll('.timeline-filter-btn');

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
const modalEmojiChips = document.querySelectorAll('.modal-emoji-chip');
const selectedEmojiPreview = document.getElementById('selected-emoji-preview');
const btnQuickEmojis = document.querySelectorAll('.btn-quick-emoji');

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

// Daily Reflection DOM References
const planYesBtn = document.getElementById('plan-yes-btn');
const planNoBtn = document.getElementById('plan-no-btn');
const planYesForm = document.getElementById('plan-yes-form');
const planNoForm = document.getElementById('plan-no-form');
const planSuccessNote = document.getElementById('plan-success-note');
const planObstacleReason = document.getElementById('plan-obstacle-reason');
const scoreSelectorYes = document.getElementById('score-selector-yes');
const scoreSelectorNo = document.getElementById('score-selector-no');
const currentScoreFeedback = document.getElementById('current-score-feedback');
const submitDailyReviewBtn = document.getElementById('submit-daily-review-btn');
const pastReviewsList = document.getElementById('past-reviews-list');

// Activity Quality & Medals DOM References
const toggleQualityBoxBtn = document.getElementById('toggle-quality-box-btn');
const toolbarMedalsBadge = document.getElementById('toolbar-medals-badge');
const activityQualityBox = document.getElementById('activity-quality-box');
const qualityBodyContent = document.getElementById('quality-body-content');
const collapseQualityBoxBtn = document.getElementById('collapse-quality-box-btn');
const qualityCollapseIcon = document.getElementById('quality-collapse-icon');
const toggleTrophyDrawerBtn = document.getElementById('toggle-trophy-drawer-btn');
const closeTrophyDrawerBtn = document.getElementById('close-trophy-drawer-btn');
const qualityMedalsCount = document.getElementById('quality-medals-count');
const qualityYesBtn = document.getElementById('quality-yes-btn');
const qualityNoBtn = document.getElementById('quality-no-btn');
const qualityYesPanel = document.getElementById('quality-yes-panel');
const qualityNoPanel = document.getElementById('quality-no-panel');
const qualityTrophyDrawer = document.getElementById('quality-trophy-drawer');
const qualitySuccessInput = document.getElementById('quality-success-input');
const qualityScoreSelectorYes = document.getElementById('quality-score-selector-yes');
const qualityScoreSelectorNo = document.getElementById('quality-score-selector-no');
const qualityScoreTextYes = document.getElementById('quality-score-text-yes');
const qualityScoreTextNo = document.getElementById('quality-score-text-no');
const saveMedalBtn = document.getElementById('save-medal-btn');
const saveQualityReflectionBtn = document.getElementById('save-quality-reflection-btn');
const qualityTriggerConfettiBtn = document.getElementById('quality-trigger-confetti-btn');
const obstacleChips = document.querySelectorAll('.obstacle-chip');
const qualityObstacleTextarea = document.getElementById('quality-obstacle-textarea');
const smartIdeasList = document.getElementById('smart-ideas-list');
const activeObstacleIndicator = document.getElementById('active-obstacle-indicator');
const statTotalMedals = document.getElementById('stat-total-medals');
const statStreakDays = document.getElementById('stat-streak-days');
const statIdeasUsed = document.getElementById('stat-ideas-used');
const qualityPastList = document.getElementById('quality-past-list');
const qualityTodayDate = document.getElementById('quality-today-date');
const medalCelebrationModalEl = document.getElementById('medalCelebrationModal');

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
    } else if (type === 'medal') {
      // Golden Fanfare Arpeggio: C5, E5, G5, C6
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const noteOsc = ctx.createOscillator();
        const noteGain = ctx.createGain();
        noteOsc.type = 'triangle';
        noteOsc.frequency.setValueAtTime(freq, now + idx * 0.09);
        noteGain.gain.setValueAtTime(0.24, now + idx * 0.09);
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.32);
        noteOsc.connect(noteGain);
        noteGain.connect(ctx.destination);
        noteOsc.start(now + idx * 0.09);
        noteOsc.stop(now + idx * 0.09 + 0.32);
      });
      return;
    } else if (type === 'book') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.08);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
      osc.start(now);
      osc.stop(now + 0.16);
    } else if (type === 'shelf') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.15);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    } else if (type === 'pop') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(900, now + 0.08);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
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

function getSavedDailyReviews() {
  const data = localStorage.getItem(DAILY_REVIEWS_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

function saveDailyReviews(reviews) {
  localStorage.setItem(DAILY_REVIEWS_KEY, JSON.stringify(reviews));
}

function getSavedMedals() {
  const data = localStorage.getItem(USER_MEDALS_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

function saveMedals(medals) {
  localStorage.setItem(USER_MEDALS_KEY, JSON.stringify(medals));
  updateMedalsAndQualityUI();
}

function getSavedQualityReviews() {
  const data = localStorage.getItem(QUALITY_REVIEWS_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

function saveQualityReviews(reviews) {
  localStorage.setItem(QUALITY_REVIEWS_KEY, JSON.stringify(reviews));
  updateMedalsAndQualityUI();
}

function getIdeasPinnedCount() {
  return parseInt(localStorage.getItem(IDEAS_PINNED_COUNT_KEY) || '0', 10);
}

function incrementIdeasPinnedCount() {
  const next = getIdeasPinnedCount() + 1;
  localStorage.setItem(IDEAS_PINNED_COUNT_KEY, next.toString());
  return next;
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
  const timelineCount = total;

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
  setTabCount('count-timeline', timelineCount);
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
  if (notebook === 'timeline') return t.badgeTimeline;
  return t.badgeTodo;
}

/**
 * Floating Inline Emoji Picker Popover on Sticky Notes
 */
let activeInlineEmojiPopover = null;

function closeInlineEmojiPicker() {
  if (activeInlineEmojiPopover) {
    activeInlineEmojiPopover.remove();
    activeInlineEmojiPopover = null;
  }
}

document.addEventListener('click', (e) => {
  if (activeInlineEmojiPopover && !activeInlineEmojiPopover.contains(e.target) && !e.target.classList.contains('note-emoji-badge')) {
    closeInlineEmojiPicker();
  }
});

function openInlineEmojiPicker(noteId, triggerBadgeEl) {
  closeInlineEmojiPicker();
  const notes = getSavedNotes();
  const note = notes.find(n => n.id === noteId);
  if (!note) return;

  const popover = document.createElement('div');
  popover.className = 'inline-emoji-picker-popover shadow-lg';
  popover.setAttribute('role', 'dialog');

  POPULAR_EMOJIS.forEach(emoji => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'inline-emoji-btn';
    btn.textContent = emoji;
    btn.title = emoji;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      note.emoji = emoji;
      saveNotes(notes);
      triggerBadgeEl.textContent = emoji;
      playSound('pop');
      showToast(I18N[currentLang].toastEmojiUpdated, emoji);
      closeInlineEmojiPicker();
      if (activeNotebookFilter === 'timeline') renderTimeline();
    });
    popover.appendChild(btn);
  });

  triggerBadgeEl.parentElement.parentElement.appendChild(popover);
  activeInlineEmojiPopover = popover;
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

  // Interactive Emoji Badge (Click to open instant emoji picker!)
  const emojiBadge = document.createElement('span');
  emojiBadge.className = 'note-emoji-badge ms-auto me-1';
  emojiBadge.textContent = note.emoji || '📌';
  emojiBadge.title = t.changeEmojiTooltip;
  emojiBadge.addEventListener('click', (e) => {
    e.stopPropagation();
    openInlineEmojiPicker(note.id, emojiBadge);
  });
  headerActions.appendChild(emojiBadge);

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
    emoji: selectedModalEmoji || '📌',
    notebook: selectedNotebook,
    isFinished: false,
    rotation: parseFloat(randomRotation),
    createdAt: Date.now()
  };

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
  showToast(I18N[currentLang].toastNoteAdded, selectedModalEmoji || '📌');
  renderNotes();
}

/**
 * Finish Note Action
 */
function handleFinishNote(id, noteEl = null) {
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
    delete note.finishedAt;
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
 * Render Grammar Lesson Filter Chips
 */
function renderGrammarLessonChips() {
  if (!grammarLessonChips) return;
  const lessons = getSavedLessons();
  const t = I18N[currentLang];
  grammarLessonChips.innerHTML = '';

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
 * Render Timeline & Daily Reflection ("Work finished vs not finished + Ask question + Score 1 to 10")
 */
function renderTimeline() {
  if (!timelineFlow) return;
  timelineFlow.innerHTML = '';
  const notes = getSavedNotes();
  const t = I18N[currentLang];

  // Filter notes based on active timeline filter
  let list = [...notes];
  if (activeTimelineFilter === 'finished') {
    list = list.filter(n => n.isFinished);
  } else if (activeTimelineFilter === 'pending') {
    list = list.filter(n => !n.isFinished);
  }

  // Sort: pending first or by date
  list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

  if (list.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'text-center p-4 rounded-4 border bg-body-tertiary';
    empty.innerHTML = `<span class="fs-2 mb-2 d-block">⏳</span><span class="text-muted small">${t.emptyDesc}</span>`;
    timelineFlow.appendChild(empty);
  } else {
    list.forEach(note => {
      const item = document.createElement('div');
      item.className = `timeline-item ${note.isFinished ? 'is-finished' : 'is-pending'}`;

      const nodeIcon = document.createElement('div');
      nodeIcon.className = 'timeline-node-icon';
      nodeIcon.textContent = note.isFinished ? '✓' : '⏳';
      item.appendChild(nodeIcon);

      const card = document.createElement('div');
      card.className = `timeline-card ${note.isFinished ? 'finished-card' : 'pending-card'}`;

      const statusBadge = note.isFinished 
        ? `<span class="badge bg-success-subtle text-success border border-success-subtle px-2 py-1">${t.statusDone}</span>`
        : `<span class="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle px-2 py-1">${t.statusPending}</span>`;

      const categoryBadge = `<span class="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1">${getNotebookBadgeText(note.notebook || 'todo')}</span>`;

      const timeText = note.isFinished && note.finishedAt 
        ? `${t.statusDone}: ${formatTime(note.finishedAt)}`
        : `${formatTime(note.createdAt)}`;

      card.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
          <div class="d-flex align-items-center gap-2">
            <span class="fs-4 note-emoji-badge" role="button" title="${t.changeEmojiTooltip}">${note.emoji || '📌'}</span>
            ${statusBadge}
            ${categoryBadge}
          </div>
          <span class="text-muted small">${timeText}</span>
        </div>
        <p class="mb-2 fw-medium" style="white-space: pre-wrap;">${note.text}</p>
        <div class="d-flex justify-content-between align-items-center pt-2 border-top">
          <button type="button" class="btn btn-sm ${note.isFinished ? 'btn-outline-secondary' : 'btn-outline-success'} rounded-pill px-3 py-1 toggle-finish-timeline-btn">
            ${note.isFinished ? `↩ ${t.markAsPending}` : `✓ ${t.markAsDone}`}
          </button>
          <span class="small text-muted">${note.notebook === 'grammar' && note.grammarTopic ? `📖 ${note.grammarTopic}` : ''}</span>
        </div>
      `;

      // Emoji badge in timeline card click
      const emojiEl = card.querySelector('.note-emoji-badge');
      if (emojiEl) {
        emojiEl.addEventListener('click', (e) => {
          e.stopPropagation();
          openInlineEmojiPicker(note.id, emojiEl);
        });
      }

      // Finish / Reopen button
      const toggleBtn = card.querySelector('.toggle-finish-timeline-btn');
      if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
          handleFinishNote(note.id);
          renderTimeline();
        });
      }

      item.appendChild(card);
      timelineFlow.appendChild(item);
    });
  }

  renderScoreChips();
  renderPastDailyReviews();
}

/**
 * Render 1 to 10 Score Chips for Daily Reflection
 */
function renderScoreChips() {
  const t = I18N[currentLang];
  const createChips = (container, formType) => {
    if (!container) return;
    container.innerHTML = '';
    for (let i = 1; i <= 10; i++) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `score-btn ${selectedDayScore === i ? 'active' : ''}`;
      btn.textContent = currentLang === 'fa' ? toPersianDigits(i) : i;
      btn.addEventListener('click', () => {
        selectedDayScore = i;
        playSound('pop');
        renderScoreChips();
        updateScoreFeedback();
      });
      container.appendChild(btn);
    }
  };

  createChips(scoreSelectorYes, 'yes');
  createChips(scoreSelectorNo, 'no');
  updateScoreFeedback();
}

function updateScoreFeedback() {
  const t = I18N[currentLang];
  if (!currentScoreFeedback) return;
  const scoreDisplay = currentLang === 'fa' ? toPersianDigits(selectedDayScore) : selectedDayScore;
  const statusText = selectedPlanStatus === 'yes' ? '🎉' : '💪';
  currentScoreFeedback.textContent = `${statusText} ${t.scoreTextPrefix} ${scoreDisplay} ${t.fromTen}`;
}

/**
 * Render Past Daily Reflections
 */
function renderPastDailyReviews() {
  if (!pastReviewsList) return;
  const reviews = getSavedDailyReviews();
  const t = I18N[currentLang];
  pastReviewsList.innerHTML = '';

  if (reviews.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'text-center text-muted small p-2';
    empty.textContent = t.noPastReviews;
    pastReviewsList.appendChild(empty);
    return;
  }

  reviews.slice(0, 5).forEach(rev => {
    const item = document.createElement('div');
    item.className = 'past-review-item shadow-xs';
    const isYes = rev.status === 'yes';
    const statusIcon = isYes ? '🎉' : '✍️';
    const statusTitle = isYes ? (currentLang === 'fa' ? 'موفق در انجام برنامه‌ها' : 'Accomplished Plans') : (currentLang === 'fa' ? 'بروز موانع و عدم انجام' : 'Faced Obstacles');
    const scoreNum = currentLang === 'fa' ? toPersianDigits(rev.score) : rev.score;

    item.innerHTML = `
      <div class="d-flex justify-content-between align-items-center mb-1">
        <span class="fw-bold d-flex align-items-center gap-1">
          <span>${statusIcon}</span>
          <span>${statusTitle}</span>
        </span>
        <span class="badge ${isYes ? 'bg-success' : 'bg-warning text-dark'} rounded-pill">⭐ ${scoreNum}/۱۰</span>
      </div>
      <div class="small text-secondary mb-1">${rev.reflectionText || ''}</div>
      <div class="small text-muted" style="font-size: 0.75rem;">${formatTime(rev.date)}</div>
    `;
    pastReviewsList.appendChild(item);
  });
}

/**
 * Submit Daily Review
 */
function submitDailyReview() {
  const t = I18N[currentLang];
  const isYes = selectedPlanStatus === 'yes';
  const reflectionText = isYes 
    ? (planSuccessNote ? planSuccessNote.value.trim() : '')
    : (planObstacleReason ? planObstacleReason.value.trim() : '');

  const newReview = {
    id: `review-${Date.now()}`,
    status: selectedPlanStatus,
    score: selectedDayScore,
    reflectionText: reflectionText || (isYes ? 'برنامه‌ها به خوبی انجام شدند.' : 'برخی موانع باعث تاخیر شد.'),
    date: Date.now()
  };

  const reviews = getSavedDailyReviews();
  reviews.unshift(newReview);
  saveDailyReviews(reviews);

  playSound('finish');
  showToast(t.toastDailyReviewSaved, '🌟');
  renderPastDailyReviews();

  if (planSuccessNote) planSuccessNote.value = '';
  if (planObstacleReason) planObstacleReason.value = '';
}

/**
 * Render Notes matching active notebook filter and search query
 */
function renderNotes() {
  // Check if Library tab is active
  if (activeNotebookFilter === 'library') {
    notesGrid.classList.add('d-none');
    grammarFilterBar.classList.add('d-none');
    timelineView.classList.add('d-none');
    libraryView.classList.remove('d-none');
    emptyState.classList.add('d-none');
    renderLibrary();
    updateFilterText();
    updateCounts();
    return;
  }

  // Check if Timeline tab is active
  if (activeNotebookFilter === 'timeline') {
    notesGrid.classList.add('d-none');
    grammarFilterBar.classList.add('d-none');
    libraryView.classList.add('d-none');
    timelineView.classList.remove('d-none');
    emptyState.classList.add('d-none');
    renderTimeline();
    updateFilterText();
    updateCounts();
    return;
  }

  // Sticky notes view
  libraryView.classList.add('d-none');
  timelineView.classList.add('d-none');
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
 * Render the 3D Bookshelf Library
 */
function renderLibrary() {
  if (!bookshelvesContainer) return;
  bookshelvesContainer.innerHTML = '';
  const lessons = getSavedLessons();
  const notes = getSavedNotes();
  const t = I18N[currentLang];

  shelfQuickButtons.forEach(btn => {
    const num = parseInt(btn.dataset.shelves, 10);
    btn.classList.toggle('active', num === shelfCount);
  });

  if (studentNameText) studentNameText.textContent = currentStudentName;

  for (let shelfIndex = 0; shelfIndex < shelfCount; shelfIndex++) {
    const shelfUnit = document.createElement('div');
    shelfUnit.className = 'shelf-unit shadow-sm';
    shelfUnit.dataset.shelfIndex = shelfIndex;

    const displayShelfNum = currentLang === 'fa' ? toPersianDigits(shelfIndex + 1) : shelfIndex + 1;

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
  else if (activeNotebookFilter === 'timeline') msg = t.filterTimeline;

  if (searchQuery.trim()) {
    msg += ` (${currentLang === 'fa' ? 'جستجو' : 'Search'}: "${searchQuery}")`;
  }

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
  updateMedalsAndQualityUI();
  renderSmartIdeasForObstacle(selectedObstacle);
}

// ==========================================================================
// SMART IDEAS KNOWLEDGE BASE FOR USER PRODUCTIVITY
// ==========================================================================
const SMART_IDEAS = {
  distraction: {
    fa: [
      {
        title: "قانون فاصله ۲۰ ثانیه‌ای (The 20-Second Rule)",
        desc: "گوشی یا تبلت خود را در اتاق دیگر یا درون کشوی قفل‌دار بگذارید. وقتی دسترسی به عامل حواس‌پرتی نیازمند بیش از ۲۰ ثانیه تلاش و بلند شدن باشد، مقاومت مغز در برابر وسوسه پیروز می‌شود.",
        icon: "📵",
        noteText: "📵 راهکار تمرکز فردا: قانون ۲۰ ثانیه‌ای - قرار دادن گوشی در اتاق دیگر در ساعات کار"
      },
      {
        title: "تکنیک پومودورو ۲۵/۵ (Pomodoro Focus)",
        desc: "تایمر را روی ۲۵ دقیقه تنظیم کنید. در این مدت فقط روی یک تسک مشخص کار کنید و هر پیام یا نوتیفیکیشنی را نادیده بگیرید، سپس ۵ دقیقه استراحت مطلق آزاد داشته باشید.",
        icon: "🍅",
        noteText: "🍅 راهکار تمرکز فردا: اجرای چرخه‌های ۲۵ دقیقه کار متمرکز و ۵ دقیقه استراحت"
      },
      {
        title: "حالت پاکسازی دیجیتال و سکوت (Do Not Disturb)",
        desc: "اعلان شبکه‌های اجتماعی و پیام‌رسان‌ها را در ساعات کاری سایلنت کنید و برای پاسخ به پیام‌ها فقط ۱ زمان مشخص در انتهای روز در نظر بگیرید.",
        icon: "🔕",
        noteText: "🔕 راهکار تمرکز فردا: سایلنت کردن تمام اعلان‌های غیرضروری در زمان اجرای برنامه‌ها"
      }
    ],
    en: [
      {
        title: "The 20-Second Rule",
        desc: "Keep your smartphone in another room or out of reach. Adding 20 seconds of physical friction breaks unconscious impulsive phone-checking habits.",
        icon: "📵",
        noteText: "📵 Focus Strategy: The 20-Second Rule - Keep phone in another room during core work"
      },
      {
        title: "Pomodoro Technique (25/5)",
        desc: "Set a 25-minute timer for strictly single-task focus with zero interruptions, followed by a refreshing 5-minute break. Repeat for 4 cycles.",
        icon: "🍅",
        noteText: "🍅 Focus Strategy: Pomodoro 25 min single-task sprint + 5 min rest"
      },
      {
        title: "Digital Detox & Do Not Disturb",
        desc: "Turn on Do Not Disturb and silence social media notifications during focus hours. Allocate a single block at the end of the day for replies.",
        icon: "🔕",
        noteText: "🔕 Focus Strategy: Enable Do Not Disturb during scheduled focus blocks"
      }
    ]
  },
  time: {
    fa: [
      {
        title: "تکنیک جعبه‌بندی زمانی (Timeboxing)",
        desc: "به جای یک لیست طولانی، برای هر کار یک ساعت مشخص در تقویم رزرو کنید (مثلاً ۹ تا ۱۰ صبح). وقتی کار زمان پایان معین داشته باشد، مغز آن را سریع‌تر جمع می‌کند.",
        icon: "📦",
        noteText: "📦 راهکار مدیریت زمان: تایم‌باکسینگ - رزرو ساعت مشخص برای هر کار به جای لیست آزاد"
      },
      {
        title: "بافر زمانی ۲۰ درصدی (Buffer Time Rule)",
        desc: "انجام کارها معمولاً بیشتر از تخمین اولیه زمان می‌برد. همیشه ۲۰٪ از ساعات روز را بین کارها خالی بگذارید تا تاخیر یک کار، بقیه روز را خراب نکند.",
        icon: "⏱️",
        noteText: "⏱️ راهکار زمان: در نظر گرفتن بافر خالی بین کارها برای جذب تاخیرهای احتمالی"
      },
      {
        title: "قانون ۲ دقیقه‌ای طلایی (Two-Minute Rule)",
        desc: "کارهایی که زیر ۲ دقیقه انجام می‌شوند (مثل ارسال یک فایل، مرتب کردن میز یا ثبت یک یادداشت) را به تعویق نیندازید؛ فوراً انجامشان دهید!",
        icon: "⚡",
        noteText: "⚡ راهکار زمان: قانون ۲ دقیقه‌ای - انجام آنی کارهای بسیار کوتاه بدون به تعویق انداختن"
      }
    ],
    en: [
      {
        title: "Timeboxing Technique",
        desc: "Instead of an open to-do list, lock each task into a specific calendar appointment. A defined end time sharpens efficiency and prevents drift.",
        icon: "📦",
        noteText: "📦 Time Strategy: Timebox every main activity into fixed calendar slots"
      },
      {
        title: "The 20% Buffer Rule",
        desc: "Tasks almost always take longer than estimated. Leave 20% of your day unscheduled as dynamic buffer to absorb delays and emergencies.",
        icon: "⏱️",
        noteText: "⏱️ Time Strategy: Include 20% buffer between tasks to prevent cascading delays"
      },
      {
        title: "The Two-Minute Rule",
        desc: "If any task takes less than two minutes to complete, execute it immediately instead of putting it on your to-do backlog.",
        icon: "⚡",
        noteText: "⚡ Time Strategy: Two-Minute Rule - Do micro actions immediately"
      }
    ]
  },
  overload: {
    fa: [
      {
        title: "قانون ۱-۳-۵ (The 1-3-5 Rule)",
        desc: "هر روز فقط ۱ کار بزرگ و حیاتی، ۳ کار متوسط و ۵ کار سبک در برنامه خود بگذارید. انباشتن ده‌ها کار سنگین در یک روز عامل اصلی فرسودگی و شکست است.",
        icon: "🎯",
        noteText: "🎯 راهکار اولویت‌بندی: قانون ۱-۳-۵ - حداکثر ۱ کار بزرگ، ۳ کار متوسط و ۵ کار سبک در روز"
      },
      {
        title: "ماتریس اولویت آیزنهاور (Eisenhower Matrix)",
        desc: "بین کارهای «فوری» و «مهم» تفکیک قائل شوید. کارهای فوری اما کم‌ارزش را سریع جمع کنید و انرژی اصلی‌تان را روی کارهای مهم و عمیق سرمایه‌گذاری نمایید.",
        icon: "📊",
        noteText: "📊 راهکار اولویت‌بندی: تمرکز روی کارهای باارزش و رها کردن کارهای غیرضروری"
      },
      {
        title: "شکستن کار به ریز-اقدام‌ها (Micro-Steps)",
        desc: "کارهای غول‌پیکر ترسناک هستند. هر پروژه سنگین را به قدم‌های ۵ تا ۱۰ دقیقه‌ای تقسیم کنید تا شروع آن بسیار آسان، سبک و خوشایند شود.",
        icon: "🧩",
        noteText: "🧩 راهکار کاهش فشار: تقسیم کارهای سنگین به قدم‌های ۵ الی ۱۰ دقیقه‌ای"
      }
    ],
    en: [
      {
        title: "The 1-3-5 Rule",
        desc: "Commit to strictly 1 major high-impact task, 3 medium tasks, and 5 quick tasks per day. Overloading causes paralysis and fatigue.",
        icon: "🎯",
        noteText: "🎯 Priority Strategy: 1 Big, 3 Medium, and 5 Small tasks max per day"
      },
      {
        title: "Eisenhower Matrix Filtering",
        desc: "Differentiate urgent noise from truly important work. Protect your high-focus energy for needle-moving objectives.",
        icon: "📊",
        noteText: "📊 Workload Strategy: Eliminate trivial tasks and focus on high-impact goals"
      },
      {
        title: "Micro-Stepping Giant Tasks",
        desc: "Big tasks intimidate and overwhelm. Deconstruct large goals into microscopic 5-10 minute starter steps that are effortless to launch.",
        icon: "🧩",
        noteText: "🧩 Workload Strategy: Deconstruct intimidating projects into 10-minute micro-steps"
      }
    ]
  },
  procrastination: {
    fa: [
      {
        title: "قانون ۵ دقیقه‌ای شروع (The 5-Minute Starter)",
        desc: "مغز از کارهای طولانی وحشت دارد. با خود قرار بگذارید: «فقط ۵ دقیقه کار می‌کنم، اگر دوست نداشتم متوقف می‌شوم». در ۹۰٪ مواقع بعد از ۵ دقیقه کار ادامه می‌یابد!",
        icon: "🚀",
        noteText: "🚀 راهکار غلبه بر تنبلی: قانون ۵ دقیقه - فقط ۵ دقیقه شروع کن، مقاومت مغز شکسته می‌شود"
      },
      {
        title: "قورباغه را اول صبح قورت بده (Eat That Frog)",
        desc: "سخت‌ترین و ناخوشایندترین کار روز را در ساعات اول صبح انجام دهید تا بار روانی آن در طول روز روی دوش شما سنگینی نکند و احساس آزادی کنید.",
        icon: "🐸",
        noteText: "🐸 راهکار غلبه بر اهمال‌کاری: انجام سخت‌ترین کار روز در اولین ساعات کاری صبح"
      },
      {
        title: "پیوند عادت به پاداش (Habit Stacking & Reward)",
        desc: "شروع کار را با یک آیین لذت‌بخش همراه کنید: فنجان چای تازه ☕ یا موسیقی بی‌کلام مورد علاقه‌تان را هنگام باز کردن اولین تسک قرار دهید.",
        icon: "☕",
        noteText: "☕ راهکار انگیزه: جفت کردن شروع کار با یک فنجان چای/قهوه و محیط آرامش‌بخش"
      }
    ],
    en: [
      {
        title: "The 5-Minute Starter Rule",
        desc: "Tell yourself you will only do 5 minutes of the task. Breaking the initial inertia is 80% of overcoming procrastination.",
        icon: "🚀",
        noteText: "🚀 Procrastination Cure: 5-Minute Rule - Just start for 5 minutes, momentum will follow"
      },
      {
        title: "Eat That Frog First",
        desc: "Tackle your most dreaded, highest-resistance task first thing in the morning. Getting it done lifts mental friction for the whole day.",
        icon: "🐸",
        noteText: "🐸 Procrastination Cure: Complete the most daunting task first thing in the morning"
      },
      {
        title: "Habit Stacking & Sensory Cue",
        desc: "Anchor the start of your work session to a pleasant ritual: brew your favorite tea or coffee and pair it directly with your first task.",
        icon: "☕",
        noteText: "☕ Motivation Strategy: Anchor task start with a fresh beverage and focus playlist"
      }
    ]
  },
  fatigue: {
    fa: [
      {
        title: "همگامی با ریتم اوج انرژی (Circadian Peak Alignment)",
        desc: "کارهای فکری و محاسباتی سخت را در زمان اوج هوشیاری طبیعی بدن (معمولاً ۹ تا ۱۲ ظهر) قرار دهید و کارهای روتین اداری را به زمان افت انرژی ببرید.",
        icon: "☀️",
        noteText: "☀️ راهکار انرژی: برنامه‌ریزی کارهای سخت در ساعات اوج انرژی صبح و کارهای سبک در عصر"
      },
      {
        title: "استراحت فعال و نوشیدن آب (Hydration & Active Breaks)",
        desc: "احساس خستگی مفرط اغلب ناشی از کم‌آبی و نشستن مداوم است. هر ۴۵ دقیقه بلند شوید، یک لیوان آب خنک بنوشید و ۳ نفس عمیق بکشید.",
        icon: "💧",
        noteText: "💧 راهکار شادابی: نوشیدن یک لیوان آب خنک و حرکات کششی هر ۴۵ دقیقه"
      },
      {
        title: "ریکاوری و خواب باکیفیت شبانه (Sleep Hygiene)",
        desc: "سطح انرژی فردا از خواب امشب ساخته می‌شود. ۳۰ دقیقه قبل از خواب نور آبی گوشی را خاموش کنید و در اتاقی تاریک و خنک استراحت نمایید.",
        icon: "🌙",
        noteText: "🌙 راهکار انرژی: کنار گذاشتن گوشی ۳۰ دقیقه قبل از خواب برای ریکاوری عمیق مغز"
      }
    ],
    en: [
      {
        title: "Circadian Energy Peak Alignment",
        desc: "Schedule cognitively heavy work during your morning peak alertness, reserving low-friction administrative chores for the afternoon dip.",
        icon: "☀️",
        noteText: "☀️ Energy Strategy: Schedule hard analytical work during morning alertness peak"
      },
      {
        title: "Hydration & Active Stretch Breaks",
        desc: "Brain fog is frequently mild dehydration and physical stillness. Stand, drink cool water, and stretch every 45 minutes.",
        icon: "💧",
        noteText: "💧 Energy Strategy: Stand, hydrate, and stretch every 45 minutes"
      },
      {
        title: "Sleep Sunset & Digital Wind-Down",
        desc: "Tomorrow's energy is forged tonight. Disconnect from screens 30 minutes before bed to ensure deep, restorative slow-wave sleep.",
        icon: "🌙",
        noteText: "🌙 Energy Strategy: No screens 30 minutes before sleep to ensure deep mental restoration"
      }
    ]
  },
  unexpected: {
    fa: [
      {
        title: "بافر اضطراری ۴۵ دقیقه‌ای (Emergency Margin)",
        desc: "یک بلوک ۴۵ دقیقه‌ای در انتهای روز را کاملاً خالی بگذارید تا هر اتفاق ناگهانی بدون برهم زدن برنامه‌های اصلی‌تان در آن زمان حل شود.",
        icon: "🛡️",
        noteText: "🛡️ راهکار غیرمنتظره: رزرو ۴۵ دقیقه خالی در پایان روز برای رسیدگی به فوریت‌ها"
      },
      {
        title: "مرزبندی و نه گفتن محترمانه (Graceful Boundaries)",
        desc: "وقتی تقاضای ناگهانی از راه می‌رسد، سریع نپذیرید. با لبخند بگویید: «در حال انجام یک کار مهم هستم؛ ساعت ۴ به درخواست شما رسیدگی می‌کنم».",
        icon: "🛑",
        noteText: "🛑 راهکار مدیریت مرزها: پاسخ محترمانه و به تعویق انداختن تقاضاهای ناگهانی به ساعت ۴"
      },
      {
        title: "انتقال بدون عذاب وجدان به فردا (Guilt-Free Rescheduling)",
        desc: "حوادث غیرمنتظره برای همه رخ می‌دهند. کارهای باقی‌مانده را بدون استرس به دفترچه «یادآوری» منتقل کنید و فردا با انرژی دوباره شروع نمایید.",
        icon: "🔄",
        noteText: "🔄 راهکار آرامش ذهن: انتقال کارهای باقی‌مانده به دفترچه یادآوری بدون حس گناه"
      }
    ],
    en: [
      {
        title: "Daily Emergency Buffer",
        desc: "Reserve a 45-minute open slot at the end of your day. Sudden crises can be resolved there without derailing your core itinerary.",
        icon: "🛡️",
        noteText: "🛡️ Unexpected Events: Keep a 45-min open buffer at day's end for emergencies"
      },
      {
        title: "Graceful Boundary Setting",
        desc: "When urgent non-emergency requests arrive, respectfully say: 'I am in a deep focus block; I will look at this at 4 PM.'",
        icon: "🛑",
        noteText: "🛑 Boundaries Strategy: Gracefully defer sudden requests to designated triage hours"
      },
      {
        title: "Guilt-Free Rescheduling",
        desc: "Emergencies happen to everyone. Reschedule unfinished items into your Remember notebook without self-criticism.",
        icon: "🔄",
        noteText: "🔄 Mindset Strategy: Move deferred tasks to Remember notebook without guilt"
      }
    ]
  }
};

/**
 * Confetti Particles Celebration Burst
 */
function launchConfetti(durationMs = 2800) {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ['#f59e0b', '#10b981', '#0284c7', '#ec4899', '#8b5cf6', '#ffd700'];
  const particles = [];
  const count = 90;

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * (canvas.height * 0.4) - 20,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedY: Math.random() * 3 + 2,
      speedX: Math.random() * 4 - 2,
      rotation: Math.random() * 360,
      rotationSpeed: Math.random() * 8 - 4
    });
  }

  let animationFrameId;
  const startTime = Date.now();

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const elapsed = Date.now() - startTime;

    particles.forEach(p => {
      p.y += p.speedY;
      p.x += p.speedX;
      p.rotation += p.rotationSpeed;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx.restore();
    });

    if (elapsed < durationMs) {
      animationFrameId = requestAnimationFrame(render);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      cancelAnimationFrame(animationFrameId);
    }
  }

  render();
}

/**
 * Setup Activity Quality & Medals Logic
 */
function setupActivityQualityBox() {
  if (medalCelebrationModalEl && window.bootstrap && !medalCelebrationModalInstance) {
    medalCelebrationModalInstance = new bootstrap.Modal(medalCelebrationModalEl);
  }

  renderQualityScoreSelectors();
  renderSmartIdeasForObstacle(selectedObstacle);
  updateMedalsAndQualityUI();
}

/**
 * Handle Quality Answer (YES or NO)
 */
function onQualityChoice(choice) {
  selectedQualityPlanStatus = choice;

  if (choice === 'yes') {
    selectedQualityScore = 10;
    if (qualityYesPanel) qualityYesPanel.classList.remove('d-none');
    if (qualityNoPanel) qualityNoPanel.classList.add('d-none');
    
    // Play celebratory sound & burst confetti!
    playSound('pop');
    setTimeout(() => playSound('medal'), 120);
    launchConfetti();

    if (medalCelebrationModalInstance) {
      medalCelebrationModalInstance.show();
    }
  } else {
    selectedQualityScore = 7;
    if (qualityNoPanel) qualityNoPanel.classList.remove('d-none');
    if (qualityYesPanel) qualityYesPanel.classList.add('d-none');
    playSound('pop');
    renderSmartIdeasForObstacle(selectedObstacle);
  }

  renderQualityScoreSelectors();
  updateQualityScoreText();
}

/**
 * Render 1-10 Score buttons for Quality
 */
function renderQualityScoreSelectors() {
  const createButtons = (container, isYes) => {
    if (!container) return;
    container.innerHTML = '';
    for (let i = 1; i <= 10; i++) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `score-btn ${selectedQualityScore === i ? 'active' : ''}`;
      btn.textContent = currentLang === 'fa' ? toPersianDigits(i) : i;
      btn.addEventListener('click', () => {
        selectedQualityScore = i;
        playSound('pop');
        renderQualityScoreSelectors();
        updateQualityScoreText();
      });
      container.appendChild(btn);
    }
  };

  createButtons(qualityScoreSelectorYes, true);
  createButtons(qualityScoreSelectorNo, false);
  updateQualityScoreText();
}

function updateQualityScoreText() {
  const t = I18N[currentLang];
  const displayScore = currentLang === 'fa' ? toPersianDigits(selectedQualityScore) : selectedQualityScore;
  
  if (qualityScoreTextYes) {
    qualityScoreTextYes.textContent = `⭐ ${t.scoreTextPrefixQuality} ${displayScore} ${t.fromTen} (${selectedQualityScore >= 9 ? (currentLang === 'fa' ? 'عالی و درخشان' : 'Excellent') : (currentLang === 'fa' ? 'خوب' : 'Good')})`;
  }
  if (qualityScoreTextNo) {
    qualityScoreTextNo.textContent = `⭐ ${t.scoreTextPrefixQuality} ${displayScore} ${t.fromTen}`;
  }
}

/**
 * Render Smart Ideas for selected obstacle
 */
function renderSmartIdeasForObstacle(obstacleKey) {
  if (!smartIdeasList) return;
  smartIdeasList.innerHTML = '';

  const ideasGroup = SMART_IDEAS[obstacleKey] || SMART_IDEAS.distraction;
  const ideas = ideasGroup[currentLang] || ideasGroup.fa;
  const t = I18N[currentLang];

  if (activeObstacleIndicator) {
    const obsLabelKey = `obs${obstacleKey.charAt(0).toUpperCase() + obstacleKey.slice(1)}`;
    const obsName = t[obsLabelKey] || obstacleKey;
    activeObstacleIndicator.textContent = `${currentLang === 'fa' ? 'مربوط به' : 'Relates to'}: ${obsName}`;
  }

  ideas.forEach(idea => {
    const item = document.createElement('div');
    item.className = 'smart-idea-item d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3 shadow-2xs';

    item.innerHTML = `
      <div class="d-flex align-items-start gap-3">
        <span class="idea-icon">${idea.icon || '💡'}</span>
        <div>
          <div class="idea-title text-dark mb-1">${idea.title}</div>
          <div class="idea-desc">${idea.desc}</div>
        </div>
      </div>
      <button type="button" class="btn btn-sm btn-outline-primary rounded-pill px-3 py-2 idea-pin-btn shadow-xs d-flex align-items-center gap-1 flex-shrink-0">
        <span>📌</span>
        <span>${t.pinIdeaBtnText}</span>
      </button>
    `;

    const pinBtn = item.querySelector('.idea-pin-btn');
    if (pinBtn) {
      pinBtn.addEventListener('click', () => {
        pinIdeaAsStickyNote(idea);
      });
    }

    smartIdeasList.appendChild(item);
  });
}

/**
 * Pin Smart Strategy as a Sticky Note on the Board
 */
function pinIdeaAsStickyNote(idea) {
  const notes = getSavedNotes();
  const t = I18N[currentLang];
  
  const newNote = {
    id: `idea-note-${Date.now()}`,
    text: `${idea.icon || '💡'} ${currentLang === 'fa' ? 'راهکار طلایی کیفیت کارها' : 'Golden Activity Strategy'}:\n${idea.title}\n\n• ${idea.desc}`,
    color: 'yellow',
    emoji: idea.icon || '💡',
    notebook: 'todo',
    isFinished: false,
    rotation: parseFloat((Math.random() * 4 - 2).toFixed(1)),
    createdAt: Date.now()
  };

  notes.unshift(newNote);
  saveNotes(notes);
  incrementIdeasPinnedCount();
  playSound('pop');
  showToast(t.toastIdeaPinned, '💡');

  if (activeNotebookFilter !== 'library' && activeNotebookFilter !== 'timeline') {
    renderNotes();
  }
  updateMedalsAndQualityUI();
}

/**
 * Save Quality Medal Record (For YES)
 */
function saveQualityMedalRecord() {
  const t = I18N[currentLang];
  const factor = qualitySuccessInput ? qualitySuccessInput.value.trim() : '';

  const medals = getSavedMedals();
  const newMedal = {
    id: `medal-${Date.now()}`,
    type: 'gold',
    title: t.medalRibbonTag,
    factor: factor || (currentLang === 'fa' ? 'تمرکز بالا و اراده در انجام ۱۰۰٪ برنامه‌ها' : 'High focus and dedication to 100% of plans'),
    score: selectedQualityScore,
    date: Date.now()
  };

  medals.unshift(newMedal);
  saveMedals(medals);

  // Also log into reviews
  const revs = getSavedQualityReviews();
  revs.unshift({
    id: `qrev-${Date.now()}`,
    status: 'yes',
    score: selectedQualityScore,
    text: factor || (currentLang === 'fa' ? 'انجام کامل تمام برنامه‌ها و دریافت مدال طلا' : 'Accomplished all plans and earned Gold Medal'),
    date: Date.now()
  });
  saveQualityReviews(revs);

  playSound('medal');
  launchConfetti();
  showToast(t.toastMedalEarned, '🥇');

  if (qualitySuccessInput) qualitySuccessInput.value = '';
}

/**
 * Save Quality Reflection Record (For NO)
 */
function saveQualityReflectionRecord() {
  const t = I18N[currentLang];
  const obsLabelKey = `obs${selectedObstacle.charAt(0).toUpperCase() + selectedObstacle.slice(1)}`;
  const obstacleName = t[obsLabelKey] || selectedObstacle;
  const reasonText = qualityObstacleTextarea ? qualityObstacleTextarea.value.trim() : '';

  const revs = getSavedQualityReviews();
  revs.unshift({
    id: `qrev-${Date.now()}`,
    status: 'no',
    obstacle: selectedObstacle,
    obstacleName: obstacleName,
    score: selectedQualityScore,
    text: reasonText || (currentLang === 'fa' ? `مانع: ${obstacleName} - راهکارهای هوشمند بررسی و ذخیره شد.` : `Obstacle: ${obstacleName} - Smart strategies reviewed.`),
    date: Date.now()
  });
  saveQualityReviews(revs);

  playSound('finish');
  showToast(t.toastQualityReviewSaved, '🌟');

  if (qualityObstacleTextarea) qualityObstacleTextarea.value = '';
}

/**
 * Update Medal Stats & UI Counters
 */
function updateMedalsAndQualityUI() {
  const medals = getSavedMedals();
  const reviews = getSavedQualityReviews();
  const ideasCount = getIdeasPinnedCount();
  const count = medals.length;
  const displayCount = currentLang === 'fa' ? toPersianDigits(count) : count;

  if (toolbarMedalsBadge) {
    toolbarMedalsBadge.textContent = `${displayCount} ${currentLang === 'fa' ? 'مدال' : 'Medals'}`;
  }
  if (qualityMedalsCount) {
    qualityMedalsCount.textContent = displayCount;
  }
  if (statTotalMedals) {
    statTotalMedals.textContent = displayCount;
  }
  if (statIdeasUsed) {
    statIdeasUsed.textContent = currentLang === 'fa' ? toPersianDigits(ideasCount) : ideasCount;
  }

  // Calculate streak
  let streak = 0;
  for (let rev of reviews) {
    if (rev.status === 'yes') streak++;
    else break;
  }
  if (statStreakDays) {
    statStreakDays.textContent = currentLang === 'fa' ? `${toPersianDigits(streak)} روز` : `${streak} days`;
  }

  // Today Date
  if (qualityTodayDate) {
    const now = new Date();
    qualityTodayDate.textContent = now.toLocaleDateString(currentLang === 'fa' ? 'fa-IR' : 'en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    });
  }

  renderPastQualityList();
}

/**
 * Render Past Quality Logs in Trophy Drawer
 */
function renderPastQualityList() {
  if (!qualityPastList) return;
  const reviews = getSavedQualityReviews();
  const medals = getSavedMedals();
  const t = I18N[currentLang];
  qualityPastList.innerHTML = '';

  if (reviews.length === 0 && medals.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'text-center text-muted small p-3';
    empty.textContent = t.noPastReviews;
    qualityPastList.appendChild(empty);
    return;
  }

  reviews.slice(0, 6).forEach(rev => {
    const card = document.createElement('div');
    card.className = 'past-quality-card shadow-2xs';
    const isYes = rev.status === 'yes';
    const statusIcon = isYes ? '🥇' : '💡';
    const statusLabel = isYes 
      ? (currentLang === 'fa' ? 'کسب مدال طلای افتخار' : 'Gold Medal Earned')
      : (currentLang === 'fa' ? `بررسی مانع: ${rev.obstacleName || ''}` : `Obstacle: ${rev.obstacleName || ''}`);
    const scoreVal = currentLang === 'fa' ? toPersianDigits(rev.score || 10) : (rev.score || 10);

    card.innerHTML = `
      <div class="d-flex justify-content-between align-items-center mb-1">
        <strong class="d-flex align-items-center gap-1 ${isYes ? 'text-success' : 'text-warning-emphasis'}">
          <span>${statusIcon}</span>
          <span>${statusLabel}</span>
        </strong>
        <span class="badge ${isYes ? 'bg-success' : 'bg-warning text-dark'} rounded-pill">⭐ ${scoreVal}/۱۰</span>
      </div>
      <div class="small text-secondary mb-1">${rev.text}</div>
      <div class="text-muted" style="font-size: 0.72rem;">${formatTime(rev.date)}</div>
    `;
    qualityPastList.appendChild(card);
  });
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

  // Modal Emoji Chip Selection
  modalEmojiChips.forEach(chip => {
    chip.addEventListener('click', () => {
      modalEmojiChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      selectedModalEmoji = chip.dataset.emoji;
      if (selectedEmojiPreview) selectedEmojiPreview.textContent = `${selectedModalEmoji} ${chip.title || ''}`;
      playSound('pop');
    });
  });

  // Quick Emoji Insert into Textarea
  btnQuickEmojis.forEach(btn => {
    btn.addEventListener('click', () => {
      const emoji = btn.dataset.emoji;
      if (modalNoteTextarea) {
        const start = modalNoteTextarea.selectionStart;
        const end = modalNoteTextarea.selectionEnd;
        const val = modalNoteTextarea.value;
        modalNoteTextarea.value = val.substring(0, start) + emoji + val.substring(end);
        modalNoteTextarea.selectionStart = modalNoteTextarea.selectionEnd = start + emoji.length;
        modalNoteTextarea.focus();
        playSound('pop');
      }
    });
  });

  // Background Theme Switcher
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

  // Timeline Filter Pills
  timelineFilterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      timelineFilterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeTimelineFilter = btn.dataset.tfilter;
      renderTimeline();
    });
  });

  // Daily Reflection Yes/No Buttons
  if (planYesBtn) {
    planYesBtn.addEventListener('click', () => {
      selectedPlanStatus = 'yes';
      planYesBtn.classList.add('btn-success', 'text-white');
      planYesBtn.classList.remove('btn-outline-success');
      planNoBtn.classList.remove('btn-danger', 'text-white');
      planNoBtn.classList.add('btn-outline-danger');
      if (planYesForm) planYesForm.classList.remove('d-none');
      if (planNoForm) planNoForm.classList.add('d-none');
      playSound('pop');
      updateScoreFeedback();
    });
  }

  if (planNoBtn) {
    planNoBtn.addEventListener('click', () => {
      selectedPlanStatus = 'no';
      planNoBtn.classList.add('btn-danger', 'text-white');
      planNoBtn.classList.remove('btn-outline-danger');
      planYesBtn.classList.remove('btn-success', 'text-white');
      planYesBtn.classList.add('btn-outline-success');
      if (planNoForm) planNoForm.classList.remove('d-none');
      if (planYesForm) planYesForm.classList.add('d-none');
      playSound('pop');
      updateScoreFeedback();
    });
  }

  // Submit Daily Reflection
  if (submitDailyReviewBtn) {
    submitDailyReviewBtn.addEventListener('click', submitDailyReview);
  }

  // Quick Shelf Selector Buttons
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

  // Activity Quality & Medals Event Listeners
  if (toggleQualityBoxBtn) {
    toggleQualityBoxBtn.addEventListener('click', () => {
      if (qualityBoxCollapsed && qualityBodyContent) {
        qualityBoxCollapsed = false;
        qualityBodyContent.classList.remove('d-none');
        if (qualityCollapseIcon) qualityCollapseIcon.className = 'bi bi-chevron-up';
      }
      if (activityQualityBox) {
        activityQualityBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
        activityQualityBox.classList.add('border-primary', 'shadow-lg');
        setTimeout(() => activityQualityBox.classList.remove('border-primary', 'shadow-lg'), 1200);
      }
      playSound('pop');
    });
  }

  if (collapseQualityBoxBtn && qualityBodyContent) {
    collapseQualityBoxBtn.addEventListener('click', () => {
      qualityBoxCollapsed = !qualityBoxCollapsed;
      qualityBodyContent.classList.toggle('d-none', qualityBoxCollapsed);
      if (qualityCollapseIcon) {
        qualityCollapseIcon.className = qualityBoxCollapsed ? 'bi bi-chevron-down' : 'bi bi-chevron-up';
      }
      playSound('pop');
    });
  }

  if (toggleTrophyDrawerBtn && qualityTrophyDrawer) {
    toggleTrophyDrawerBtn.addEventListener('click', () => {
      qualityTrophyDrawer.classList.toggle('d-none');
      playSound('pop');
    });
  }

  if (closeTrophyDrawerBtn && qualityTrophyDrawer) {
    closeTrophyDrawerBtn.addEventListener('click', () => {
      qualityTrophyDrawer.classList.add('d-none');
    });
  }

  if (qualityYesBtn) {
    qualityYesBtn.addEventListener('click', () => onQualityChoice('yes'));
  }

  if (qualityNoBtn) {
    qualityNoBtn.addEventListener('click', () => onQualityChoice('no'));
  }

  if (qualityTriggerConfettiBtn) {
    qualityTriggerConfettiBtn.addEventListener('click', () => {
      playSound('medal');
      launchConfetti();
    });
  }

  if (saveMedalBtn) {
    saveMedalBtn.addEventListener('click', saveQualityMedalRecord);
  }

  if (saveQualityReflectionBtn) {
    saveQualityReflectionBtn.addEventListener('click', saveQualityReflectionRecord);
  }

  obstacleChips.forEach(chip => {
    chip.addEventListener('click', () => {
      obstacleChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      selectedObstacle = chip.dataset.obstacle;
      renderSmartIdeasForObstacle(selectedObstacle);
      playSound('pop');
    });
  });
}

function init() {
  setupEventListeners();
  setupActivityQualityBox();
  setTheme(currentTheme);
  setLanguage(currentLang);
  setStudentName(currentStudentName);
}

document.addEventListener('DOMContentLoaded', init);

