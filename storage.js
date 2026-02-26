// js/storage.js
const STORAGE_KEYS = {
    FAVORITES: 'labgenius_favorites'
};

// Récupérer les favoris
function getFavorites() {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.FAVORITES);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error('Erreur lecture favoris:', e);
        return [];
    }
}

// Ajouter un favori
function addFavorite(sequence, name) {
    try {
        const favorites = getFavorites();
        const newFavorite = {
            id: Date.now(),
            sequence: sequence.toUpperCase(),
            name: name || `Séquence ${favorites.length + 1}`,
            date: new Date().toISOString()
        };
        
        favorites.push(newFavorite);
        localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
        return newFavorite;
    } catch (e) {
        console.error('Erreur ajout favori:', e);
        return null;
    }
}

// Supprimer un favori
function removeFavorite(id) {
    try {
        const favorites = getFavorites().filter(f => f.id !== id);
        localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
        return true;
    } catch (e) {
        console.error('Erreur suppression favori:', e);
        return false;
    }
}
// js/storage.js
const LabGeniusStorage = (function() {
    const STORAGE_KEYS = {
        FAVORITES: 'labgenius_favorites',
        RECENT: 'labgenius_recent',
        HISTORY: 'labgenius_history'
    };
    
    function getFavorites() {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.FAVORITES);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    }
    
    function addFavorite(sequence, name) {
        try {
            const favorites = getFavorites();
            const newFavorite = {
                id: Date.now(),
                sequence: sequence.toUpperCase(),
                name: name || `Séquence ${favorites.length + 1}`,
                date: new Date().toISOString()
            };
            favorites.push(newFavorite);
            localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
            return newFavorite;
        } catch (e) {
            return null;
        }
    }
    
    function removeFavorite(id) {
        try {
            const favorites = getFavorites().filter(f => f.id !== id);
            localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
        } catch (e) {}
    }
    
    function addToRecent(sequence) {
        try {
            const recent = getRecent();
            recent.unshift({ sequence, date: new Date().toISOString() });
            if (recent.length > 10) recent.pop();
            localStorage.setItem(STORAGE_KEYS.RECENT, JSON.stringify(recent));
        } catch (e) {}
    }
    
    function getRecent() {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.RECENT);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    }
    
    function addToHistory(action, sequence) {
        try {
            const history = getHistory();
            history.unshift({
                action,
                sequence: sequence.substring(0, 20),
                date: new Date().toLocaleTimeString()
            });
            if (history.length > 20) history.pop();
            localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
        } catch (e) {}
    }
    
    function getHistory() {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    }
    
    function clearHistory() {
        localStorage.removeItem(STORAGE_KEYS.HISTORY);
    }
    
    return {
        getFavorites,
        addFavorite,
        removeFavorite,
        addToRecent,
        getRecent,
        addToHistory,
        getHistory,
        clearHistory
    };
})();

window.LabGeniusStorage = LabGeniusStorage;

// js/storage.js
// Gestion du stockage par utilisateur

// Récupérer le storage de l'utilisateur courant
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

// ========== FAVORIS ==========
function getFavorites() {
    const storage = getUserStorage();
    return storage?.favorites || [];
}

function addFavorite(sequence, name) {
    const storage = getUserStorage();
    if (!storage) return;
    
    const newFavorite = {
        id: Date.now(),
        sequence: sequence.toUpperCase(),
        name: name,
        date: new Date().toISOString()
    };
    
    storage.favorites.push(newFavorite);
    saveUserStorage(storage);
    return newFavorite;
}

function removeFavorite(id) {
    const storage = getUserStorage();
    if (!storage) return;
    
    storage.favorites = storage.favorites.filter(f => f.id !== id);
    saveUserStorage(storage);
}

// ========== RÉCENTS ==========
function addToRecent(sequence) {
    const storage = getUserStorage();
    if (!storage) return;
    
    storage.recent.unshift({
        sequence: sequence.toUpperCase(),
        date: new Date().toISOString()
    });
    
    // Garder seulement les 20 plus récents
    if (storage.recent.length > 20) storage.recent.pop();
    
    saveUserStorage(storage);
}

function getRecent() {
    const storage = getUserStorage();
    return storage?.recent || [];
}

// ========== HISTORIQUE ==========
function addToHistory(action, sequence) {
    const storage = getUserStorage();
    if (!storage) return;
    
    storage.history.unshift({
        action,
        sequence: sequence.substring(0, 20),
        date: new Date().toLocaleTimeString()
    });
    
    if (storage.history.length > 50) storage.history.pop();
    saveUserStorage(storage);
}

function getHistory() {
    const storage = getUserStorage();
    return storage?.history || [];
}

function clearHistory() {
    const storage = getUserStorage();
    if (!storage) return;
    
    storage.history = [];
    saveUserStorage(storage);
}

// ========== SYNTHÈSES ==========
function addToSynthesis(sequence, success, rate) {
    const storage = getUserStorage();
    if (!storage) return;
    
    storage.syntheses.push({
        sequence: sequence.toUpperCase(),
        success,
        rate,
        date: new Date().toISOString()
    });
    
    saveUserStorage(storage);
}

function getSyntheses() {
    const storage = getUserStorage();
    return storage?.syntheses || [];
}

// ========== PROFIL ==========
function getUserProfile() {
    const storage = getUserStorage();
    return storage?.profile || null;
}

function updateUserProfile(updates) {
    const storage = getUserStorage();
    if (!storage) return;
    
    storage.profile = { ...storage.profile, ...updates };
    saveUserStorage(storage);
}

// ========== STATISTIQUES ==========
function getUserStats() {
    const storage = getUserStorage();
    if (!storage) return {
        favorites: 0,
        syntheses: 0,
        successRate: 0
    };
    
    const syntheses = storage.syntheses || [];
    const successCount = syntheses.filter(s => s.success).length;
    const successRate = syntheses.length > 0 
        ? Math.round((successCount / syntheses.length) * 100) 
        : 0;
    
    return {
        favorites: storage.favorites?.length || 0,
        recent: storage.recent?.length || 0,
        syntheses: syntheses.length,
        successRate: successRate,
        projects: storage.projects?.length || 0
    };
}

// Récupérer l'utilisateur courant (depuis auth.js)
function getCurrentUser() {
    const user = localStorage.getItem('labgenius_current_user');
    return user ? JSON.parse(user) : null;
}

// Exporter les fonctions
window.LabGeniusStorage = {
    getFavorites,
    addFavorite,
    removeFavorite,
    addToRecent,
    getRecent,
    addToHistory,
    getHistory,
    clearHistory,
    addToSynthesis,
    getSyntheses,
    getUserProfile,
    updateUserProfile,
    getUserStats
};