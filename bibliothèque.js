// js/bibliotheque.js
// Dépendances : storage.js, utils.js

// Données pré-enregistrées
const PREDEFINED_SEQUENCES = [
    { 
        id: 1, 
        name: 'Gène de l\'insuline humaine', 
        sequence: 'ATGCGTAAATGC', 
        description: 'Gène codant pour l\'insuline',
        category: 'human'
    },
    { 
        id: 2, 
        name: 'GFP', 
        sequence: 'ATGGCTAGCAAAGGAGAAGAACTTTTCACTGG', 
        description: 'Protéine fluorescente verte',
        category: 'other'
    },
    { 
        id: 3, 
        name: 'Cas9', 
        sequence: 'ATGGACAAGAAGTACTCCATTGGGCTCG', 
        description: 'Enzyme CRISPR',
        category: 'bacterial'
    }
];

// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Bibliothèque initialisée');
    
    // Récupérer les éléments DOM
    const elements = {
        favoritesList: document.getElementById('favoritesList'),
        addSequenceBtn: document.getElementById('addSequenceBtn'),
        importSequenceBtn: document.getElementById('importSequenceBtn'),
        totalSequences: document.getElementById('totalSequences'),
        totalFavorites: document.getElementById('totalFavorites'),
        totalBases: document.getElementById('totalBases'),
        modal: document.getElementById('sequenceModal'),
        closeModalBtn: document.getElementById('closeModalBtn'),
        cancelModalBtn: document.getElementById('cancelModalBtn'),
        saveSeqBtn: document.getElementById('saveSeqBtn'),
        newSeqName: document.getElementById('newSeqName'),
        newSeqDesc: document.getElementById('newSeqDesc'),
        newSeqValue: document.getElementById('newSeqValue'),
        newSeqCategory: document.getElementById('newSeqCategory'),
        modalError: document.getElementById('modalError')
    };
    
    // Vérifier que les éléments existent
    console.log('Éléments trouvés:', {
        addSequenceBtn: !!elements.addSequenceBtn,
        modal: !!elements.modal,
        favoritesList: !!elements.favoritesList
    });
    
    // Afficher les favoris
    renderFavorites(elements);
    updateStats(elements);
    
    // Bouton Nouvelle séquence
    if (elements.addSequenceBtn) {
        elements.addSequenceBtn.addEventListener('click', function() {
            console.log('🖱️ Clic sur Nouvelle séquence');
            openModal(elements);
        });
    }
    
    // Bouton Importer
    if (elements.importSequenceBtn) {
        elements.importSequenceBtn.addEventListener('click', importSequence);
    }
    
    // Fermeture du modal
    if (elements.closeModalBtn) {
        elements.closeModalBtn.addEventListener('click', function() {
            closeModal(elements);
        });
    }
    
    if (elements.cancelModalBtn) {
        elements.cancelModalBtn.addEventListener('click', function() {
            closeModal(elements);
        });
    }
    
    // Sauvegarde
    if (elements.saveSeqBtn) {
        elements.saveSeqBtn.addEventListener('click', function() {
            saveNewSequence(elements);
        });
    }
    
    // Fermer en cliquant dehors
    window.addEventListener('click', function(e) {
        if (e.target === elements.modal) {
            closeModal(elements);
        }
    });
    
    // Fonctions globales pour les boutons dynamiques
    window.loadToEditor = function(sequence) {
        try {
            validateSequence(sequence);
            localStorage.setItem('temp_sequence', sequence);
            window.location.href = 'sequenceur.html';
        } catch (error) {
            alert('❌ ' + error.message);
        }
    };
    
    window.removeFromFavorites = function(id) {
        removeFavorite(id);
        renderFavorites(elements);
        updateStats(elements);
        showNotification('❌ Favori retiré');
    };
});

// Fonction pour ouvrir le modal
function openModal(elements) {
    console.log('📋 Ouverture du modal');
    if (elements.modal) {
        // Réinitialiser le formulaire
        elements.newSeqName.value = '';
        elements.newSeqDesc.value = '';
        elements.newSeqValue.value = '';
        elements.newSeqCategory.value = 'human';
        elements.modalError.textContent = '';
        
        // Afficher le modal
        elements.modal.style.display = 'flex';
    }
}

// Fonction pour fermer le modal
function closeModal(elements) {
    console.log('Fermeture du modal');
    if (elements.modal) {
        elements.modal.style.display = 'none';
    }
}

// Fonction pour sauvegarder une nouvelle séquence
function saveNewSequence(elements) {
    const name = elements.newSeqName.value.trim();
    const sequence = elements.newSeqValue.value.trim().toUpperCase();
    
    // Validation
    if (!name) {
        elements.modalError.textContent = 'Veuillez entrer un nom';
        return;
    }
    
    if (!sequence) {
        elements.modalError.textContent = 'Veuillez entrer une séquence';
        return;
    }
    
    try {
        validateSequence(sequence);
        
        // Ajouter aux favoris
        addFavorite(sequence, name);
        
        // Fermer le modal
        closeModal(elements);
        
        // Re-rendre
        renderFavorites(elements);
        updateStats(elements);
        
        // Notification
        showNotification(`✅ "${name}" ajouté aux favoris`);
        
    } catch (error) {
        elements.modalError.textContent = error.message;
    }
}

// Fonction pour afficher les favoris
function renderFavorites(elements) {
    if (!elements.favoritesList) return;
    
    const favorites = getFavorites();
    
    if (favorites.length === 0) {
        elements.favoritesList.innerHTML = `
            <div class="empty-message">
                ⭐ Aucun favori<br>
                <small>Cliquez sur "Nouvelle séquence" pour commencer</small>
            </div>
        `;
        return;
    }
    
    elements.favoritesList.innerHTML = favorites.map(fav => `
        <div class="sequence-card" data-id="${fav.id}">
            <div class="card-header">
                <h3>${fav.name}</h3>
                <span class="card-category">⭐ Favori</span>
            </div>
            <div class="card-sequence">${formatSequence(fav.sequence)}</div>
            <div class="card-meta">
                <span>🧬 ${fav.sequence.length} bases</span>
                <span>📅 ${new Date(fav.date).toLocaleDateString()}</span>
            </div>
            <div class="card-actions">
                <button class="btn-load" onclick="window.loadToEditor('${fav.sequence}')">
                    📋 Charger
                </button>
                <button class="btn-remove" onclick="window.removeFromFavorites(${fav.id})">
                    ❌ Retirer
                </button>
            </div>
        </div>
    `).join('');
}

// Fonction pour mettre à jour les statistiques
function updateStats(elements) {
    const favorites = getFavorites();
    const totalBases = favorites.reduce((acc, fav) => acc + fav.sequence.length, 0);
    
    if (elements.totalSequences) {
        elements.totalSequences.textContent = PREDEFINED_SEQUENCES.length + favorites.length;
    }
    
    if (elements.totalFavorites) {
        elements.totalFavorites.textContent = favorites.length;
    }
    
    if (elements.totalBases) {
        elements.totalBases.textContent = totalBases;
    }
}

// Fonction d'import
function importSequence() {
    const sequence = prompt("Collez votre séquence ADN (A,T,G,C uniquement):");
    if (sequence) {
        try {
            validateSequence(sequence);
            document.getElementById('newSeqValue').value = sequence.toUpperCase();
            openModal({
                modal: document.getElementById('sequenceModal'),
                newSeqName: document.getElementById('newSeqName'),
                newSeqDesc: document.getElementById('newSeqDesc'),
                newSeqValue: document.getElementById('newSeqValue'),
                newSeqCategory: document.getElementById('newSeqCategory'),
                modalError: document.getElementById('modalError')
            });
        } catch (error) {
            alert('❌ ' + error.message);
        }
    }
}

// Fonction de notification
function showNotification(message, type = 'success') {
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#00d4ff'
    };
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.backgroundColor = colors[type];
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type]};
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        z-index: 10000;
        animation: slideIn 0.3s;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}