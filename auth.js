// js/auth.js
const USERS_KEY = 'labgenius_users';
const CURRENT_USER_KEY = 'labgenius_current_user';

// Initialisation selon la page
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop();
    
    // Pages protégées (nécessitent connexion)
    const protectedPages = ['index.html', 'sequenceur.html', 'synthese.html', 'bibliotheque.html', 'profil.html'];
    
    if (protectedPages.includes(currentPage)) {
        // Vérifier si l'utilisateur est connecté
        const currentUser = getCurrentUser();
        if (!currentUser) {
            window.location.href = 'login.html';
            return;
        }
        
        // Initialiser le storage de l'utilisateur
        initUserStorage(currentUser);
    }
    
    // Configuration selon la page
    if (currentPage === 'login.html') {
        setupLoginPage();
    } else if (currentPage === 'register.html') {
        setupRegisterPage();
    }
});

// Configuration de la page de connexion
function setupLoginPage() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
}

// Configuration de la page d'inscription
function setupRegisterPage() {
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
}

// Gestion de la connexion
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Récupérer les utilisateurs
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    
    // Chercher l'utilisateur
    const user = users.find(u => u.email === email && u.password === hashPassword(password));
    
    if (user) {
        // Connexion réussie
        const userData = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            institution: user.institution
        };
        
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));
        
        // Rediriger vers le dashboard
        window.location.href = 'index.html';
    } else {
        showMessage('Email ou mot de passe incorrect', 'error');
    }
}

// Gestion de l'inscription
function handleRegister(e) {
    e.preventDefault();
    
    const firstName = document.getElementById('registerFirstName').value;
    const lastName = document.getElementById('registerLastName').value;
    const email = document.getElementById('registerEmail').value;
    const role = document.getElementById('registerRole').value;
    const password = document.getElementById('registerPassword').value;
    const confirm = document.getElementById('registerConfirm').value;
    const institution = document.getElementById('registerInstitution').value;
    const acceptTerms = document.getElementById('acceptTerms').checked;
    
    // Validations
    if (!firstName || !lastName || !email || !role || !password || !confirm) {
        showMessage('Veuillez remplir tous les champs obligatoires', 'error');
        return;
    }
    
    if (!acceptTerms) {
        showMessage('Vous devez accepter les conditions d\'utilisation', 'error');
        return;
    }
    
    if (password !== confirm) {
        showMessage('Les mots de passe ne correspondent pas', 'error');
        return;
    }
    
    if (password.length < 6) {
        showMessage('Le mot de passe doit contenir au moins 6 caractères', 'error');
        return;
    }
    
    // Récupérer les utilisateurs
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    
    // Vérifier si l'email existe déjà
    if (users.some(u => u.email === email)) {
        showMessage('Cet email est déjà utilisé', 'error');
        return;
    }
    
    // Créer le nouvel utilisateur
    const newUser = {
        id: generateUserId(),
        firstName: firstName,
        lastName: lastName,
        email: email,
        role: role,
        institution: institution || '',
        password: hashPassword(password),
        createdAt: new Date().toISOString()
    };
    
    // Sauvegarder l'utilisateur
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    // Créer l'espace de stockage pour l'utilisateur
    createUserStorage(newUser);
    
    // Connecter automatiquement
    const userData = {
        id: newUser.id,
        firstName: firstName,
        lastName: lastName,
        email: email,
        role: role,
        institution: institution
    };
    
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));
    
    showMessage('Compte créé avec succès ! Redirection...', 'success');
    
    // Rediriger vers le dashboard
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

// Créer l'espace de stockage pour un nouvel utilisateur
function createUserStorage(user) {
    const storageKey = `user_${user.id}`;
    const userStorage = {
        profile: {
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            role: user.role,
            institution: user.institution || '',
            createdAt: user.createdAt,
            preferences: {
                theme: 'dark',
                notifications: true
            }
        },
        favorites: [],
        recent: [],
        history: [],
        projects: [],
        syntheses: []
    };
    
    localStorage.setItem(storageKey, JSON.stringify(userStorage));
}

// Initialiser le storage pour un utilisateur existant
function initUserStorage(user) {
    const storageKey = `user_${user.id}`;
    
    // Vérifier si le storage existe
    if (!localStorage.getItem(storageKey)) {
        createUserStorage(user);
    }
}

// Récupérer l'utilisateur courant
function getCurrentUser() {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
}

// Récupérer le storage d'un utilisateur
function getUserStorage() {
    const user = getCurrentUser();
    if (!user) return null;
    
    const storageKey = `user_${user.id}`;
    const data = localStorage.getItem(storageKey);
    return data ? JSON.parse(data) : null;
}

// Sauvegarder dans le storage utilisateur
function saveUserStorage(data) {
    const user = getCurrentUser();
    if (!user) return;
    
    const storageKey = `user_${user.id}`;
    localStorage.setItem(storageKey, JSON.stringify(data));
}

// Générer un ID utilisateur unique
function generateUserId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Hashage simple (démo uniquement)
function hashPassword(password) {
    return btoa(password);
}

// Afficher un message
function showMessage(text, type) {
    const message = document.createElement('div');
    message.className = `auth-message ${type}`;
    message.textContent = text;
    
    const form = document.querySelector('.auth-form');
    if (form) {
        form.insertBefore(message, form.firstChild);
        
        setTimeout(() => {
            message.remove();
        }, 3000);
    }
}

// Toggle password visibility
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    if (input) {
        input.type = input.type === 'password' ? 'text' : 'password';
    }
}

// Exposer les fonctions globales
window.togglePassword = togglePassword;