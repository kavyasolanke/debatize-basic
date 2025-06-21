import { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  en: {
    appName: 'Debatize',
    home: 'Home',
    topics: 'Topics',
    debate: 'Debate',
    analytics: 'Analytics',
    notifications: 'Notifications',
    profile: 'Profile',
    logout: 'Logout',
    login: 'Login',
    username: 'Username',
    password: 'Password',
    send: 'Send',
    search: 'Search',
    rules: 'Rules',
    accept: 'Accept',
    cancel: 'Cancel',
    apply: 'Apply',
    language: 'Language',
    selectLanguage: 'Select Language',
    gamification: 'Gamification',
    points: 'Points',
    level: 'Level',
    upvote: 'Upvote',
    downvote: 'Downvote',
    reply: 'Reply',
    pro: 'Pro',
    con: 'Con',
    chooseSide: 'Choose Your Side',
    for: 'For',
    against: 'Against',
    debateRoom: 'Debate Room',
    onlineUsers: 'Online Users',
    messagePlaceholder: 'Type your argument...',
    charCount: 'characters',
    dayStreak: 'Day Streak',
    badges: 'Badges',
    achievements: 'Achievements',
    leaderboard: 'Leaderboard',
    overview: 'Overview',
    applyLanguage: 'Apply Language',
    cancelLanguage: 'Cancel',
    languageSettings: 'Language Settings',
    chooseLanguage: 'Choose your preferred language for Debatize',
    // Navigation
    'nav.features': 'Features',
    'nav.about': 'About',
    'nav.changeLanguage': 'Change Language',
    'nav.welcome': 'Welcome, {username}!',
    'nav.startDebating': 'Start Debating',
    'nav.logout': 'Logout',
    'nav.getStarted': 'Get Started',
    // Hero Section
    'hero.title.prefix': 'Where Logic',
    'hero.title.highlight': ' Meets Impact',
    'hero.subtitle': 'Transform chaotic discussions into structured, evidence-based debates. Drive awareness, clarity, and actionable insights through meaningful dialogue.',
    'hero.exploreTopics': 'Explore Topics',
    'hero.learnMore': 'Learn More',
    'hero.joinDebate': 'Join the Debate',
    'hero.scrollToExplore': 'Scroll to explore',
    // Login Modal
    'login.welcome': 'Welcome to Debatize',
    'login.chooseIdentity': 'Choose your anonymous identity',
    'login.chooseUsername': 'Choose Your Username',
    'login.enterUsername': 'Enter Your Username',
    'login.usernamePlaceholder': 'Enter username...',
    'login.existingUsernamePlaceholder': 'Enter existing username...',
    'login.orChooseSuggestions': 'Or choose from suggestions:',
    'login.createAccount': 'Create Account',
    'login.login': 'Login',
    'login.loading': 'Loading...',
    'login.alreadyHaveAccount': 'Already have an account?',
    'login.dontHaveAccount': "Don't have an account?",
    'login.switchToLogin': 'Switch to Login',
    'login.switchToSignup': 'Switch to Sign Up',
    // Validation Messages
    'validation.usernameMinLength': 'Username must be at least 3 characters long',
    'validation.usernameMaxLength': 'Username must be less than 20 characters',
    'validation.usernameAlphanumeric': 'Username can only contain letters and numbers',
    'validation.usernameTaken': 'Username already taken',
    'validation.userNotFound': 'User not found. Please check your username or create a new account.',
    'validation.enterUsername': 'Please enter a username',
    'validation.generalError': 'An error occurred. Please try again.',
    // Features Section
    'features.title': 'Why Choose Debatize?',
    'features.subtitle': 'Experience the future of online discussions',
    'features.structuredDebates.title': 'Structured Debates',
    'features.structuredDebates.description': 'Transform chaotic discussions into organized, evidence-based debates with clear arguments and counterpoints.',
    'features.decisionIntelligence.title': 'Decision Intelligence',
    'features.decisionIntelligence.description': 'Leverage AI-powered analysis to extract insights and identify the strongest arguments from every discussion.',
    'features.verifiedVoices.title': 'Verified Voices',
    'features.verifiedVoices.description': 'Connect with experts and verified contributors who bring credibility and depth to every debate topic.',
    'features.realImpact.title': 'Real Impact',
    'features.realImpact.description': 'Drive awareness, clarity, and actionable insights that lead to better decisions and meaningful change.',
    // Stats Section
    'stats.betterDecisions': 'Better Decisions',
    'stats.structuredDebates': 'Structured Debates',
    'stats.evidenceBased': 'Evidence-Based',
    'stats.aiPoweredAnalysis': 'AI-Powered Analysis',
    // CTA Section
    'cta.title': 'Ready to Transform Discussions?',
    'cta.subtitle': 'Join thousands of users making better decisions through structured, evidence-based debates',
    'cta.button': 'Start Structured Debating',
    // Footer
    'footer.about': 'About',
    'footer.about.description': 'Debatize is a platform for structured, evidence-based discussions that drive better decisions and meaningful change.',
    'footer.features': 'Features',
    'footer.resources': 'Resources',
    'footer.support': 'Support',
    'footer.contact': 'Contact',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.copyright': '© 2024 Debatize. All rights reserved.'
  },
  es: {
    appName: 'Debatize',
    home: 'Inicio',
    topics: 'Temas',
    debate: 'Debate',
    analytics: 'Analítica',
    notifications: 'Notificaciones',
    profile: 'Perfil',
    logout: 'Cerrar sesión',
    login: 'Iniciar sesión',
    username: 'Nombre de usuario',
    password: 'Contraseña',
    send: 'Enviar',
    search: 'Buscar',
    rules: 'Reglas',
    accept: 'Aceptar',
    cancel: 'Cancelar',
    apply: 'Aplicar',
    language: 'Idioma',
    selectLanguage: 'Seleccionar idioma',
    gamification: 'Gamificación',
    points: 'Puntos',
    level: 'Nivel',
    upvote: 'Voto positivo',
    downvote: 'Voto negativo',
    reply: 'Responder',
    pro: 'A favor',
    con: 'En contra',
    chooseSide: 'Elige tu lado',
    for: 'A favor',
    against: 'En contra',
    debateRoom: 'Sala de debate',
    onlineUsers: 'Usuarios en línea',
    messagePlaceholder: 'Escribe tu argumento...',
    charCount: 'caracteres',
    dayStreak: 'Racha de días',
    badges: 'Insignias',
    achievements: 'Logros',
    leaderboard: 'Clasificación',
    overview: 'Resumen',
    applyLanguage: 'Aplicar idioma',
    cancelLanguage: 'Cancelar',
    languageSettings: 'Configuración de idioma',
    chooseLanguage: 'Elige tu idioma preferido para Debatize',
    // ...add more keys as needed
  },
  fr: {
    appName: 'Debatize',
    home: 'Accueil',
    topics: 'Sujets',
    debate: 'Débat',
    analytics: 'Analytique',
    notifications: 'Notifications',
    profile: 'Profil',
    logout: 'Déconnexion',
    login: 'Connexion',
    username: 'Nom d'utilisateur',
    password: 'Mot de passe',
    send: 'Envoyer',
    search: 'Rechercher',
    rules: 'Règles',
    accept: 'Accepter',
    cancel: 'Annuler',
    apply: 'Appliquer',
    language: 'Langue',
    selectLanguage: 'Choisir la langue',
    gamification: 'Gamification',
    points: 'Points',
    level: 'Niveau',
    upvote: 'Vote positif',
    downvote: 'Vote négatif',
    reply: 'Répondre',
    pro: 'Pour',
    con: 'Contre',
    chooseSide: 'Choisissez votre camp',
    for: 'Pour',
    against: 'Contre',
    debateRoom: 'Salle de débat',
    onlineUsers: 'Utilisateurs en ligne',
    messagePlaceholder: 'Tapez votre argument...',
    charCount: 'caractères',
    dayStreak: 'Série de jours',
    badges: 'Badges',
    achievements: 'Réalisations',
    leaderboard: 'Classement',
    overview: 'Aperçu',
    applyLanguage: 'Appliquer la langue',
    cancelLanguage: 'Annuler',
    languageSettings: 'Paramètres de langue',
    chooseLanguage: 'Choisissez votre langue préférée pour Debatize',
    // ...add more keys as needed
  },
  de: {
    appName: 'Debatize',
    home: 'Startseite',
    topics: 'Themen',
    debate: 'Debatte',
    analytics: 'Analytik',
    notifications: 'Benachrichtigungen',
    profile: 'Profil',
    logout: 'Abmelden',
    login: 'Anmelden',
    username: 'Benutzername',
    password: 'Passwort',
    send: 'Senden',
    search: 'Suchen',
    rules: 'Regeln',
    accept: 'Akzeptieren',
    cancel: 'Abbrechen',
    apply: 'Anwenden',
    language: 'Sprache',
    selectLanguage: 'Sprache wählen',
    gamification: 'Gamification',
    points: 'Punkte',
    level: 'Level',
    upvote: 'Upvote',
    downvote: 'Downvote',
    reply: 'Antworten',
    pro: 'Pro',
    con: 'Contra',
    chooseSide: 'Wähle deine Seite',
    for: 'Für',
    against: 'Gegen',
    debateRoom: 'Debattenraum',
    onlineUsers: 'Online-Nutzer',
    messagePlaceholder: 'Gib dein Argument ein...',
    charCount: 'Zeichen',
    dayStreak: 'Tagesserie',
    badges: 'Abzeichen',
    achievements: 'Erfolge',
    leaderboard: 'Bestenliste',
    overview: 'Übersicht',
    applyLanguage: 'Sprache anwenden',
    cancelLanguage: 'Abbrechen',
    languageSettings: 'Spracheinstellungen',
    chooseLanguage: 'Wählen Sie Ihre bevorzugte Sprache für Debatize',
    // ...add more keys as needed
  },
  hi: {
    appName: 'Debatize',
    home: 'होम',
    topics: 'विषय',
    debate: 'बहस',
    analytics: 'विश्लेषण',
    notifications: 'सूचनाएं',
    profile: 'प्रोफ़ाइल',
    logout: 'लॉगआउट',
    login: 'लॉगिन',
    username: 'यूज़रनेम',
    password: 'पासवर्ड',
    send: 'भेजें',
    search: 'खोजें',
    rules: 'नियम',
    accept: 'स्वीकार करें',
    cancel: 'रद्द करें',
    apply: 'लागू करें',
    language: 'भाषा',
    selectLanguage: 'भाषा चुनें',
    gamification: 'गैमिफिकेशन',
    points: 'अंक',
    level: 'स्तर',
    upvote: 'अपवोट',
    downvote: 'डाउनवोट',
    reply: 'जवाब दें',
    pro: 'पक्ष',
    con: 'विपक्ष',
    chooseSide: 'अपना पक्ष चुनें',
    for: 'पक्ष',
    against: 'विपक्ष',
    debateRoom: 'बहस कक्ष',
    onlineUsers: 'ऑनलाइन उपयोगकर्ता',
    messagePlaceholder: 'अपना तर्क लिखें...',
    charCount: 'अक्षर',
    dayStreak: 'दिनों की श्रृंखला',
    badges: 'बैज',
    achievements: 'उपलब्धियां',
    leaderboard: 'लीडरबोर्ड',
    overview: 'सारांश',
    applyLanguage: 'भाषा लागू करें',
    cancelLanguage: 'रद्द करें',
    languageSettings: 'भाषा सेटिंग्स',
    chooseLanguage: 'Debatize के लिए अपनी पसंदीदा भाषा चुनें',
    // ...add more keys as needed
  },
  // ...add more languages as needed
};

// Create React Context for translations
const TranslationContext = createContext();

// Custom hook to use translations
export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};

// Translation Provider Component
export const TranslationProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [translations, setTranslations] = useState({});

  useEffect(() => {
    // Load saved language preference
    const savedLanguage = localStorage.getItem('debatize_language') || 'en';
    setCurrentLanguage(savedLanguage);
    
    // Load translations for the language
    const languageTranslations = getTranslations(savedLanguage);
    setTranslations(languageTranslations);
  }, []);

  const changeLanguage = (languageCode) => {
    setCurrentLanguage(languageCode);
    localStorage.setItem('debatize_language', languageCode);
    
    const languageTranslations = getTranslations(languageCode);
    setTranslations(languageTranslations);
  };

  const t = (key, params = {}) => {
    const translation = translations[key] || key;
    
    // Replace parameters in translation
    if (params && typeof params === 'object') {
      return Object.keys(params).reduce((result, paramKey) => {
        return result.replace(`{${paramKey}}`, params[paramKey]);
      }, translation);
    }
    
    return translation;
  };

  const value = {
    currentLanguage,
    changeLanguage,
    t,
    getAvailableLanguages,
    getLanguageInfo
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};

export default TranslationService; 