👥 Équipe de développement
Ce projet a été réalisé en collaboration par :
* Ichrak Mandour 
* Yasmine Sedik
  
🎮 MyManager – Video Games Edition
MyManager – Video Games Edition est une application Web Backoffice permettant la gestion complète de données liées aux jeux vidéo.
Elle est développée en HTML5, CSS3 et JavaScript Vanilla, sans framework moderne ni backend, et repose entièrement sur le stockage côté client.

🎯 Présentation du projet
MyManager est un panneau d’administration professionnel conçu pour gérer plusieurs entités (jeux, joueurs, plateformes, genres, commandes) avec des fonctionnalités CRUD complètes, un tableau de bord analytique et une prise en charge multilingue.

L’objectif principal est de démontrer la maîtrise du JavaScript natif, de l’architecture front-end modulaire et de la manipulation de données côté client.

✨ Fonctionnalités
🔐 Authentification
Système de connexion simple avec identifiants statiques :

Login : admin

Mot de passe : admin

Gestion de session via localStorage

Redirection automatique vers la page de connexion si l’utilisateur n’est pas authentifié

🌍 Internationalisation (i18n)
Support de 3 langues :

🇫🇷 Français

🇬🇧 Anglais

🇲🇦 Arabe

Changement de langue dynamique

Persistance de la langue sélectionnée via localStorage

Support du RTL pour la langue arabe

📊 Tableau de bord (Dashboard)
Cartes KPI :

Nombre total de jeux

Joueurs

Plateformes

Commandes

Revenus

Graphiques interactifs (Chart.js) :

Jeux par genre (Bar chart)

Jeux par plateforme (Pie chart)

Commandes dans le temps (Line chart)

Top jeux par ventes (Horizontal bar)

Activité des joueurs (Line chart)

🎮 Gestion des entités (CRUD)
Games : gestion des jeux vidéo

Players : gestion des profils joueurs

Platforms : gestion des plateformes de jeux

Genres : gestion des genres

Orders : gestion des commandes

Fonctionnalités CRUD
✅ Création (formulaires modaux avec validation)

✅ Lecture (tableaux avec tri, recherche et pagination)

✅ Mise à jour (formulaires pré-remplis)

✅ Suppression (confirmation obligatoire)

✅ Vue détaillée avec export PDF

📤 Exports
Export CSV : export des tableaux de données

Export PDF : export des détails d’une entité (via jsPDF)

🎨 UI / UX
Interface moderne et professionnelle

Design responsive (Desktop / Tablette / Mobile)

Sidebar de navigation

Navbar avec sélecteur de langue et déconnexion

Bootstrap 5 + CSS personnalisé

Icônes via Font Awesome

🧭 Routage
Routage côté client basé sur le hash (#)

Chargement dynamique des vues

Support des paramètres d’URL

🛠️ Stack technique
HTML5

CSS3 (Custom + Bootstrap 5)

JavaScript Vanilla (ES6+)

Chart.js – graphiques

jsPDF – export PDF

Lodash – fonctions utilitaires

Font Awesome – icônes

🔧 Gestion et génération des données
🎮 Jeux (Games)
Les données des jeux sont initialisées via une API publique.

Lors du premier chargement :

Les données récupérées depuis l’API sont stockées dans le localStorage.

Les opérations CRUD sont ensuite effectuées localement.

👤 Joueurs (Players)
Les données des joueurs sont générées dynamiquement via faker.js (version navigateur).

Les données simulées sont ensuite sauvegardées dans le localStorage.

💾 Stockage
Toutes les données suivantes sont stockées dans le localStorage :

Session d’authentification

Données des entités (Games, Players, Platforms, Genres, Orders)

Préférences utilisateur (langue)

⚠️ La suppression des données du navigateur réinitialise l’application.

🚀 Démarrage du projet
Prérequis
Un navigateur web moderne (Chrome, Firefox, Edge, Safari)

Un serveur local (recommandé)

Installation
Cloner ou télécharger le projet

Ouvrir le dossier dans un éditeur de code

Lancer l’application :

Option 1 : Serveur local (recommandé)

Utilisateur : admin

Mot de passe : admin

📁 Structure du projet
Projet_js_mymanager/
├── index.html
├── styles/
│   └── main.css
├── js/
│   ├── app.js
│   ├── services/
│   ├── views/
│   ├── components/
│   └──utils/
├── READ-ME

🐛 Dépannage
Graphiques non affichés

Vérifier que Chart.js est bien chargé

Problèmes de routage

Vérifier les erreurs dans la console
<img width="775" height="623" alt="image" src="https://github.com/user-attachments/assets/d5a63dd0-224c-4d21-bcf1-cc1707745105" />


Export PDF / CSV

Vérifier le chargement de jsPDF


