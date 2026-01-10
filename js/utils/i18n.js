// Internationalization Service
export const i18n = {
    currentLang: localStorage.getItem('mymanager_lang') || 'fr',
    
    translations: {
        fr: {
            // Navigation
            'nav.dashboard': 'Tableau de bord',
            'nav.games': 'Jeux',
            'nav.players': 'Joueurs',
            'nav.platforms': 'Plateformes',
            'nav.genres': 'Genres',
            'nav.orders': 'Commandes',
            'nav.logout': 'Déconnexion',
            
            // Login
            'login.username': 'Nom d\'utilisateur',
            'login.password': 'Mot de passe',
            'login.submit': 'Se connecter',
            'login.error': 'Identifiants incorrects',
            
            // Common
            'common.add': 'Ajouter',
            'common.edit': 'Modifier',
            'common.delete': 'Supprimer',
            'common.save': 'Enregistrer',
            'common.cancel': 'Annuler',
            'common.search': 'Rechercher',
            'common.filter': 'Filtrer',
            'common.export': 'Exporter',
            'common.exportCSV': 'Exporter en CSV',
            'common.exportPDF': 'Exporter en PDF',
            'common.details': 'Détails',
            'common.actions': 'Actions',
            'common.confirm': 'Confirmer',
            'common.confirmDelete': 'Êtes-vous sûr de vouloir supprimer cet élément ?',
            'common.noData': 'Aucune donnée disponible',
            'common.loading': 'Chargement...',
            'common.total': 'Total',
            
            // Dashboard
            'dashboard.title': 'Tableau de bord',
            'dashboard.totalGames': 'Total Jeux',
            'dashboard.totalPlayers': 'Total Joueurs',
            'dashboard.totalPlatforms': 'Total Plateformes',
            'dashboard.totalOrders': 'Total Commandes',
            'dashboard.totalRevenue': 'Revenus Totaux',
            'dashboard.gamesPerGenre': 'Jeux par Genre',
            'dashboard.gamesPerPlatform': 'Jeux par Plateforme',
            'dashboard.ordersOverTime': 'Commandes dans le Temps',
            'dashboard.topGames': 'Top Jeux par Ventes',
            'dashboard.playerActivity': 'Activité des Joueurs',
            
            // Games
            'games.title': 'Gestion des Jeux',
            'games.add': 'Ajouter un Jeu',
            'games.name': 'Nom',
            'games.genre': 'Genre',
            'games.platform': 'Plateforme',
            'games.price': 'Prix',
            'games.releaseDate': 'Date de Sortie',
            'games.rating': 'Note',
            'games.description': 'Description',
            
            // Players
            'players.title': 'Gestion des Joueurs',
            'players.add': 'Ajouter un Joueur',
            'players.name': 'Nom',
            'players.email': 'Email',
            'players.age': 'Âge',
            'players.country': 'Pays',
            'players.favoriteGenre': 'Genre Préféré',
            
            // Platforms
            'platforms.title': 'Gestion des Plateformes',
            'platforms.add': 'Ajouter une Plateforme',
            'platforms.name': 'Nom',
            'platforms.company': 'Entreprise',
            'platforms.releaseYear': 'Année de Sortie',
            
            // Genres
            'genres.title': 'Gestion des Genres',
            'genres.add': 'Ajouter un Genre',
            'genres.name': 'Nom',
            'genres.description': 'Description',
            
            // Orders
            'orders.title': 'Gestion des Commandes',
            'orders.add': 'Ajouter une Commande',
            'orders.player': 'Joueur',
            'orders.game': 'Jeu',
            'orders.date': 'Date',
            'orders.amount': 'Montant',
            'orders.status': 'Statut'
        },
        
        en: {
            // Navigation
            'nav.dashboard': 'Dashboard',
            'nav.games': 'Games',
            'nav.players': 'Players',
            'nav.platforms': 'Platforms',
            'nav.genres': 'Genres',
            'nav.orders': 'Orders',
            'nav.logout': 'Logout',
            
            // Login
            'login.username': 'Username',
            'login.password': 'Password',
            'login.submit': 'Login',
            'login.error': 'Invalid credentials',
            
            // Common
            'common.add': 'Add',
            'common.edit': 'Edit',
            'common.delete': 'Delete',
            'common.save': 'Save',
            'common.cancel': 'Cancel',
            'common.search': 'Search',
            'common.filter': 'Filter',
            'common.export': 'Export',
            'common.exportCSV': 'Export CSV',
            'common.exportPDF': 'Export PDF',
            'common.details': 'Details',
            'common.actions': 'Actions',
            'common.confirm': 'Confirm',
            'common.confirmDelete': 'Are you sure you want to delete this item?',
            'common.noData': 'No data available',
            'common.loading': 'Loading...',
            'common.total': 'Total',
            
            // Dashboard
            'dashboard.title': 'Dashboard',
            'dashboard.totalGames': 'Total Games',
            'dashboard.totalPlayers': 'Total Players',
            'dashboard.totalPlatforms': 'Total Platforms',
            'dashboard.totalOrders': 'Total Orders',
            'dashboard.totalRevenue': 'Total Revenue',
            'dashboard.gamesPerGenre': 'Games per Genre',
            'dashboard.gamesPerPlatform': 'Games per Platform',
            'dashboard.ordersOverTime': 'Orders Over Time',
            'dashboard.topGames': 'Top Games by Sales',
            'dashboard.playerActivity': 'Player Activity',
            
            // Games
            'games.title': 'Games Management',
            'games.add': 'Add Game',
            'games.name': 'Name',
            'games.genre': 'Genre',
            'games.platform': 'Platform',
            'games.price': 'Price',
            'games.releaseDate': 'Release Date',
            'games.rating': 'Rating',
            'games.description': 'Description',
            
            // Players
            'players.title': 'Players Management',
            'players.add': 'Add Player',
            'players.name': 'Name',
            'players.email': 'Email',
            'players.age': 'Age',
            'players.country': 'Country',
            'players.favoriteGenre': 'Favorite Genre',
            
            // Platforms
            'platforms.title': 'Platforms Management',
            'platforms.add': 'Add Platform',
            'platforms.name': 'Name',
            'platforms.company': 'Company',
            'platforms.releaseYear': 'Release Year',
            
            // Genres
            'genres.title': 'Genres Management',
            'genres.add': 'Add Genre',
            'genres.name': 'Name',
            'genres.description': 'Description',
            
            // Orders
            'orders.title': 'Orders Management',
            'orders.add': 'Add Order',
            'orders.player': 'Player',
            'orders.game': 'Game',
            'orders.date': 'Date',
            'orders.amount': 'Amount',
            'orders.status': 'Status'
        },
        
        ar: {
            // Navigation
            'nav.dashboard': 'لوحة التحكم',
            'nav.games': 'الألعاب',
            'nav.players': 'اللاعبون',
            'nav.platforms': 'المنصات',
            'nav.genres': 'الأنواع',
            'nav.orders': 'الطلبات',
            'nav.logout': 'تسجيل الخروج',
            
            // Login
            'login.username': 'اسم المستخدم',
            'login.password': 'كلمة المرور',
            'login.submit': 'تسجيل الدخول',
            'login.error': 'بيانات اعتماد غير صحيحة',
            
            // Common
            'common.add': 'إضافة',
            'common.edit': 'تعديل',
            'common.delete': 'حذف',
            'common.save': 'حفظ',
            'common.cancel': 'إلغاء',
            'common.search': 'بحث',
            'common.filter': 'تصفية',
            'common.export': 'تصدير',
            'common.exportCSV': 'تصدير CSV',
            'common.exportPDF': 'تصدير PDF',
            'common.details': 'التفاصيل',
            'common.actions': 'الإجراءات',
            'common.confirm': 'تأكيد',
            'common.confirmDelete': 'هل أنت متأكد من حذف هذا العنصر؟',
            'common.noData': 'لا توجد بيانات متاحة',
            'common.loading': 'جاري التحميل...',
            'common.total': 'المجموع',
            
            // Dashboard
            'dashboard.title': 'لوحة التحكم',
            'dashboard.totalGames': 'إجمالي الألعاب',
            'dashboard.totalPlayers': 'إجمالي اللاعبين',
            'dashboard.totalPlatforms': 'إجمالي المنصات',
            'dashboard.totalOrders': 'إجمالي الطلبات',
            'dashboard.totalRevenue': 'إجمالي الإيرادات',
            'dashboard.gamesPerGenre': 'الألعاب حسب النوع',
            'dashboard.gamesPerPlatform': 'الألعاب حسب المنصة',
            'dashboard.ordersOverTime': 'الطلبات مع مرور الوقت',
            'dashboard.topGames': 'أفضل الألعاب حسب المبيعات',
            'dashboard.playerActivity': 'نشاط اللاعبين',
            
            // Games
            'games.title': 'إدارة الألعاب',
            'games.add': 'إضافة لعبة',
            'games.name': 'الاسم',
            'games.genre': 'النوع',
            'games.platform': 'المنصة',
            'games.price': 'السعر',
            'games.releaseDate': 'تاريخ الإصدار',
            'games.rating': 'التقييم',
            'games.description': 'الوصف',
            
            // Players
            'players.title': 'إدارة اللاعبين',
            'players.add': 'إضافة لاعب',
            'players.name': 'الاسم',
            'players.email': 'البريد الإلكتروني',
            'players.age': 'العمر',
            'players.country': 'البلد',
            'players.favoriteGenre': 'النوع المفضل',
            
            // Platforms
            'platforms.title': 'إدارة المنصات',
            'platforms.add': 'إضافة منصة',
            'platforms.name': 'الاسم',
            'platforms.company': 'الشركة',
            'platforms.releaseYear': 'سنة الإصدار',
            
            // Genres
            'genres.title': 'إدارة الأنواع',
            'genres.add': 'إضافة نوع',
            'genres.name': 'الاسم',
            'genres.description': 'الوصف',
            
            // Orders
            'orders.title': 'إدارة الطلبات',
            'orders.add': 'إضافة طلب',
            'orders.player': 'اللاعب',
            'orders.game': 'اللعبة',
            'orders.date': 'التاريخ',
            'orders.amount': 'المبلغ',
            'orders.status': 'الحالة'
        }
    },
    
    setLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('mymanager_lang', lang);
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        
        if (this.onLanguageChangeCallback) {
            this.onLanguageChangeCallback(lang);
        }
    },
    
    t(key) {
        return this.translations[this.currentLang]?.[key] || key;
    },
    
    updatePage() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            el.textContent = this.t(key);
        });
    },
    
    onLanguageChange(callback) {
        this.onLanguageChangeCallback = callback;
    }
};

// Initialize language on load
const savedLang = localStorage.getItem('mymanager_lang') || 'fr';
i18n.setLanguage(savedLang);

