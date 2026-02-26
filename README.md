🧬 LabGenius
Simulateur de laboratoire de synthèse génétique
📋 Description du projet
LabGenius est une application web éducative permettant de simuler des manipulations génétiques en laboratoire virtuel. Développée dans le cadre d'un projet académique, cette plateforme offre une interface intuitive pour comprendre et expérimenter avec des séquences ADN.

L'application permet de :

Visualiser et éditer des séquences ADN

Simuler des mutations (substitution, insertion, suppression)

Transcrire l'ADN en ARN

Effectuer des synthèses génétiques virtuelles

Gérer une bibliothèque de séquences personnalisée

Suivre son activité via un tableau de bord personnalisé

👥 Équipe de développement
Nom	Rôle
NGOUALA Emmanuel	Développeur Front-end & Architecture
LOKO Boris	Développeur Interface & UX/UI
🚀 Fonctionnalités implémentées
🔐 Authentification & Profils
Page d'inscription avec création de compte

Page de connexion sécurisée

Profil utilisateur personnalisable

Déconnexion automatique

📊 Dashboard
Vue d'ensemble des activités

Statistiques personnelles (favoris, synthèses, taux de réussite)

Historique des actions récentes

Message de bienvenue personnalisé

🔬 Séquenceur (Éditeur de génome)
Affichage et édition de séquences ADN

Visualisation des bases sous forme de cercles colorés

Mutations : substitution, insertion, suppression

Mutations rapides : inversion, complément inverse

Transcription ADN → ARN

Historique des opérations

Validation en temps réel des séquences

⚗️ Machine de synthèse
Simulation de synthèse génétique

Barre de progression animée avec étapes détaillées

Calcul du taux de réussite basé sur la complexité

Rapport de synthèse (succès/échec)

Statistiques en temps réel (longueur, GC content, taux estimé)

📚 Bibliothèque génomique
Séquences pré-enregistrées (Insuline, GFP, Cas9, etc.)

Ajout de séquences personnalisées via formulaire

Système de favoris

Import de séquences (format texte/FASTA)

Statistiques globales (nombre de séquences, bases totales)

👤 Profil utilisateur
Informations personnelles (nom, email, institution)

Avatar avec initiales

Statistiques personnelles

Préférences (thème, notifications)

Sécurité (changement de mot de passe)

Timeline d'activité

🛠️ Technologies utilisées
Technologie	Utilisation
HTML5	Structure des pages
CSS3	Styles, responsive design
JavaScript (ES6+)	Logique applicative, interactions
LocalStorage	Stockage des données utilisateur

labgenius/
│
├── login.html              # Page de connexion
├── register.html           # Page d'inscription
├── index.html              # Dashboard principal
├── sequenceur.html         # Éditeur de génome
├── synthese.html           # Machine de synthèse
├── bibliotheque.html       # Bibliothèque génomique
├── profil.html             # Profil utilisateur
│
├── css/
│   ├── main.css            # Styles globaux
│   ├── auth.css            # Styles connexion/inscription
│   ├── dashboard.css       # Styles tableau de bord
│   ├── sequenceur.css      # Styles éditeur
│   ├── synthese.css        # Styles synthèse
│   ├── bibliotheque.css    # Styles bibliothèque
│   └── profil.css          # Styles profil
│
└── js/
    ├── auth.js             # Gestion authentification
    ├── storage.js          # Gestion localStorage par utilisateur
    ├── utils.js            # Utilitaires communs
    ├── dashboard.js        # Logique tableau de bord
    ├── sequenceur.js       # Logique éditeur
    ├── synthese.js         # Logique synthèse
    ├── bibliotheque.js     # Logique bibliothèque
    └── profil.js           # Logique profil
💻 Pages développées
1. Page d'inscription (register.html)
Formulaire complet avec :

Prénom, nom, email

Profession (étudiant, chercheur, professeur, investisseur)

Mot de passe avec confirmation

Institution (optionnel)

Validation des conditions d'utilisation

Création automatique du compte et connexion

2. Page de connexion (login.html)
Connexion avec email/mot de passe

Lien vers l'inscription

3. Dashboard (index.html)
Message de bienvenue personnalisé

Statistiques utilisateur

Activité récente

4. Séquenceur (sequenceur.html)
Éditeur de séquences ADN

Visualisation par cercles colorés

Contrôles de mutation

Transcription ARN

5. Machine de synthèse (synthese.html)
Simulation avec barre de progression

Analyse en temps réel

Rapports de synthèse

6. Bibliothèque (bibliotheque.html)
Séquences pré-enregistrées

Gestion des favoris

Import de séquences

7. Profil utilisateur (profil.html)
Informations personnelles

Statistiques

Préférences

Sécurité

🎨 Design et UX
Thème scientifique : tons bleus, effets de glow, typographie technique

Design responsive : adaptation tablette/ordinateur

Animations fluides : transitions, hover effects

Feedback visuel : notifications, barres de progression

Icônes expressives : emojis thématiques

🔒 Sécurité et stockage
Authentification : vérification des identifiants

Données isolées : chaque utilisateur a son propre espace de stockage

Validation : toutes les entrées sont contrôlées

Persistance : localStorage avec préfixe utilisateur
✨ Choix de conception
Choix	Justification
Séparation HTML/CSS/JS	Maintenance facilitée, code modulaire
Storage par utilisateur	Isolation des données, confidentialité
Validation stricte	Robustesse de l'application
Design atomique	Réutilisabilité des composants
Pas de frameworks	Contrôle total, performance
Animations CSS	Fluidité sans surcharge JS
 🧪 Tests manuels effectués
Création de compte

Connexion/déconnexion

Édition de séquences

Mutations (substitution, insertion, suppression)

Transcription ADN → ARN

Simulation de synthèse

Ajout aux favoris

Import de séquences

Modification du profil

Changement de mot de passe

Persistance des données après rechargement

🧬 LabGenius - Simulez, apprenez, innovez !
