// js/dashboard.js
// Dashboard - LabGenius

// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Dashboard initialisé');
    
    // Initialiser les données de démo
    initDemoData();
    
    // Récupérer les éléments DOM
    const elements = {
        projectCount: document.getElementById('projectCount'),
        sequenceCount: document.getElementById('sequenceCount'),
        synthesisCount: document.getElementById('synthesisCount'),
        favoritesCount: document.getElementById('favoritesCount'),
        recentList: document.getElementById('recentList'),
        activityList: document.getElementById('activityList')
    };
    
    // Mettre à jour les statistiques
    updateStats(elements);
    
    // Afficher les séquences récentes
    renderRecent(elements);
    
    // Afficher l'activité récente
    renderActivity(elements);
    
    // Rafraîchir toutes les 30 secondes
    setInterval(() => {
        updateStats(elements);
        renderRecent(elements);
        renderActivity(elements);
    }, 30000);
});

// Mettre à jour les statistiques
function updateStats(elements) {
    // Utiliser LabGeniusStorage s'il existe
    if (window.LabGeniusStorage) {
        const favorites = LabGeniusStorage.getFavorites();
        const recent = LabGeniusStorage.getRecent();
        const history = LabGeniusStorage.getHistory();
        
        // Compter les synthèses dans l'historique
        const syntheses = history.filter(item => item.action === 'synthèse').length;
        
        if (elements.projectCount) {
            elements.projectCount.textContent = favorites.length || '0';
        }
        
        if (elements.sequenceCount) {
            elements.sequenceCount.textContent = recent.length || '0';
        }
        
        if (elements.synthesisCount) {
            elements.synthesisCount.textContent = syntheses || '0';
        }
        
        if (elements.favoritesCount) {
            elements.favoritesCount.textContent = favorites.length || '0';
        }
    }
}

// Afficher les séquences récentes
function renderRecent(elements) {
    if (!elements.recentList) return;
    
    if (window.LabGeniusStorage) {
        const recent = LabGeniusStorage.getRecent();
        
        if (recent.length === 0) {
            elements.recentList.innerHTML = `
                <div class="empty-message">
                    Aucune séquence récente<br>
                    <small>Utilisez l'éditeur pour commencer</small>
                </div>
            `;
            return;
        }
        
        elements.recentList.innerHTML = recent.slice(0, 5).map(item => {
            const date = new Date(item.date);
            const formattedDate = date.toLocaleDateString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit'
            });
            
            return `
                <div class="sequence-item">
                    <div class="sequence-info">
                        <span class="sequence-value">${formatSequenceShort(item.sequence)}</span>
                        <span class="sequence-date">${formattedDate}</span>
                    </div>
                    <button class="btn-small" onclick="window.loadSequence('${item.sequence}')">
                        Charger
                    </button>
                </div>
            `;
        }).join('');
    }
}

// Afficher l'activité récente
function renderActivity(elements) {
    if (!elements.activityList) return;
    
    if (window.LabGeniusStorage) {
        const history = LabGeniusStorage.getHistory();
        
        if (history.length === 0) {
            elements.activityList.innerHTML = `
                <div class="empty-message">
                    Aucune activité récente
                </div>
            `;
            return;
        }
        
        elements.activityList.innerHTML = history.slice(0, 5).map(item => {
            let icon = '📝';
            if (item.action === 'synthèse') icon = '⚗️';
            if (item.action === 'validation') icon = '✓';
            if (item.action === 'substitute') icon = '🔄';
            
            return `
                <div class="activity-item">
                    <span class="activity-icon">${icon}</span>
                    <span class="activity-text">${item.action}</span>
                    <span class="activity-time">${item.date}</span>
                </div>
            `;
        }).join('');
    }
}

// Formater une séquence (version courte)
function formatSequenceShort(seq) {
    if (seq.length > 15) {
        return seq.substring(0, 12) + '...';
    }
    return seq;
}

// Fonction globale pour charger une séquence
window.loadSequence = function(sequence) {
    try {
        if (window.Utils) {
            Utils.validateSequence(sequence);
        }
        localStorage.setItem('temp_sequence', sequence);
        window.location.href = 'sequenceur.html';
    } catch (e) {
        console.error('Erreur chargement:', e);
        alert('❌ ' + e.message);
    }
};

// Initialiser les données de démo
function initDemoData() {
    if (window.LabGeniusStorage) {
        // Vérifier si des données existent déjà
        const favorites = LabGeniusStorage.getFavorites();
        
        if (favorites.length === 0) {
            // Ajouter des favoris de démo
            LabGeniusStorage.addFavorite('ATGCGTAAATGC', 'Projet Insuline');
            LabGeniusStorage.addFavorite('ATGGCTAGCAAA', 'GFP');
            LabGeniusStorage.addFavorite('ATGGACAAGAAG', 'Cas9');
            
            // Ajouter des séquences récentes
            LabGeniusStorage.addToRecent('ATGCGTAAATGC');
            LabGeniusStorage.addToRecent('ATGGCTAGCAAA');
            LabGeniusStorage.addToRecent('ATGGACAAGAAG');
            
            // Ajouter de l'historique
            LabGeniusStorage.addToHistory('validation', 'ATGCGTAAATGC');
            LabGeniusStorage.addToHistory('synthèse', 'ATGCGTAAATGC');
            LabGeniusStorage.addToHistory('synthèse', 'ATGGCTAGCAAA');
            
            console.log('✅ Données de démo initialisées');
        }
    }
}