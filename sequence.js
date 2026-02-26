// js/sequenceur.js
// État de l'application
let currentSequence = 'ATGCGTAAATGC';
let selectedPosition = 2;

// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Séquenceur initialisé');
    
    // Récupérer les éléments DOM
    const elements = {
        sequenceInput: document.getElementById('sequenceInput'),
        validateBtn: document.getElementById('validateBtn'),
        sequenceError: document.getElementById('sequenceError'),
        baseCircles: document.getElementById('baseCircles'),
        substituteBtn: document.getElementById('substituteBtn'),
        insertBtn: document.getElementById('insertBtn'),
        deleteBtn: document.getElementById('deleteBtn'),
        reverseBtn: document.getElementById('reverseBtn'),
        complementBtn: document.getElementById('complementBtn'),
        transcribeBtn: document.getElementById('transcribeBtn'),
        rnaResult: document.getElementById('rnaResult'),
        positionInput: document.getElementById('positionInput'),
        baseSelect: document.getElementById('baseSelect'),
        historyList: document.getElementById('historyList'),
        clearHistoryBtn: document.getElementById('clearHistoryBtn'),
        sequenceLength: document.getElementById('sequenceLength'),
        gcContent: document.getElementById('gcContent'),
        loadFromLibBtn: document.getElementById('loadFromLibBtn')
    };
    
    // Charger séquence temporaire
    const tempSequence = localStorage.getItem('temp_sequence');
    if (tempSequence) {
        currentSequence = tempSequence;
        localStorage.removeItem('temp_sequence');
    }
    
    // Initialiser l'affichage
    updateDisplay(elements);
    updateSequenceInfo(elements);
    loadHistory(elements);
    
    // Event Listeners
    if (elements.validateBtn) {
        elements.validateBtn.addEventListener('click', () => validateAndUpdate(elements));
    }
    
    if (elements.sequenceInput) {
        elements.sequenceInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') validateAndUpdate(elements);
        });
    }
    
    if (elements.substituteBtn) {
        elements.substituteBtn.addEventListener('click', () => mutate(elements, 'substitute'));
    }
    
    if (elements.insertBtn) {
        elements.insertBtn.addEventListener('click', () => mutate(elements, 'insert'));
    }
    
    if (elements.deleteBtn) {
        elements.deleteBtn.addEventListener('click', () => mutate(elements, 'delete'));
    }
    
    if (elements.reverseBtn) {
        elements.reverseBtn.addEventListener('click', () => reverseSequence(elements));
    }
    
    if (elements.complementBtn) {
        elements.complementBtn.addEventListener('click', () => complementSequence(elements));
    }
    
    if (elements.transcribeBtn) {
        elements.transcribeBtn.addEventListener('click', () => transcribe(elements));
    }
    
    if (elements.clearHistoryBtn) {
        elements.clearHistoryBtn.addEventListener('click', () => clearHistory(elements));
    }
    
    if (elements.loadFromLibBtn) {
        elements.loadFromLibBtn.addEventListener('click', () => {
            window.location.href = 'bibliotheque.html';
        });
    }
    
    if (elements.positionInput) {
        elements.positionInput.addEventListener('change', (e) => {
            selectedPosition = parseInt(e.target.value) || 0;
        });
    }
});

// Valider et mettre à jour
function validateAndUpdate(elements) {
    try {
        const validated = validateSequence(elements.sequenceInput.value);
        currentSequence = validated;
        elements.sequenceError.textContent = '';
        
        updateDisplay(elements);
        updateSequenceInfo(elements);
        
        if (window.LabGeniusStorage) {
            LabGeniusStorage.addToRecent(currentSequence);
            LabGeniusStorage.addToHistory('validation', currentSequence);
        }
        
        showNotification('✅ Séquence validée');
        
    } catch (error) {
        elements.sequenceError.textContent = error.message;
        showNotification(error.message, 'error');
    }
}

// Mettre à jour l'affichage
function updateDisplay(elements) {
    if (elements.sequenceInput) {
        elements.sequenceInput.value = currentSequence;
    }
    visualizeBases(elements);
}

// Visualiser les bases
function visualizeBases(elements) {
    if (!elements.baseCircles) return;
    
    elements.baseCircles.innerHTML = '';
    
    for (let i = 0; i < currentSequence.length; i++) {
        const base = currentSequence[i];
        const circle = document.createElement('div');
        circle.className = 'base-circle';
        circle.setAttribute('data-base', base);
        circle.setAttribute('data-position', i);
        circle.setAttribute('title', `Position ${i + 1}: ${base}`);
        circle.textContent = base;
        
        if (i === selectedPosition) {
            circle.style.transform = 'scale(1.2)';
            circle.style.boxShadow = '0 0 15px currentColor';
        }
        
        circle.addEventListener('click', () => {
            selectedPosition = i;
            if (elements.positionInput) {
                elements.positionInput.value = i;
            }
            visualizeBases(elements);
        });
        
        elements.baseCircles.appendChild(circle);
    }
}

// Mutations
function mutate(elements, type) {
    const position = selectedPosition;
    const base = elements.baseSelect ? elements.baseSelect.value : 'A';
    
    try {
        let newSequence;
        
        switch(type) {
            case 'substitute':
                newSequence = substitute(currentSequence, position, base);
                showNotification(`🔁 Substitution position ${position + 1} → ${base}`);
                break;
            case 'insert':
                newSequence = insert(currentSequence, position, base);
                showNotification(`➕ Insertion ${base} position ${position + 1}`);
                break;
            case 'delete':
                if (currentSequence.length <= 1) {
                    throw new Error('Impossible de supprimer la dernière base');
                }
                newSequence = delete_(currentSequence, position);
                showNotification(`➖ Suppression position ${position + 1}`);
                break;
        }
        
        currentSequence = newSequence;
        updateDisplay(elements);
        updateSequenceInfo(elements);
        
        if (window.LabGeniusStorage) {
            LabGeniusStorage.addToHistory(type, currentSequence);
        }
        
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

// Inverser la séquence
function reverseSequence(elements) {
    currentSequence = reverse(currentSequence);
    updateDisplay(elements);
    updateSequenceInfo(elements);
    showNotification('🔄 Séquence inversée');
    
    if (window.LabGeniusStorage) {
        LabGeniusStorage.addToHistory('inversion', currentSequence);
    }
}

// Complément inverse
function complementSequence(elements) {
    currentSequence = reverseComplement(currentSequence);
    updateDisplay(elements);
    updateSequenceInfo(elements);
    showNotification('🧬 Complément inverse généré');
    
    if (window.LabGeniusStorage) {
        LabGeniusStorage.addToHistory('complément', currentSequence);
    }
}

// Transcription
function transcribe(elements) {
    const rna = transcribeToRNA(currentSequence);
    if (elements.rnaResult) {
        elements.rnaResult.innerHTML = `
            <div class="rna-display">
                <span class="rna-label">ARN:</span>
                <span class="rna-sequence">${formatSequence(rna)}</span>
            </div>
        `;
    }
    showNotification('📝 Transcription effectuée');
    
    if (window.LabGeniusStorage) {
        LabGeniusStorage.addToHistory('transcription', rna);
    }
}

// Mettre à jour les infos séquence
function updateSequenceInfo(elements) {
    if (elements.sequenceLength) {
        elements.sequenceLength.textContent = currentSequence.length;
    }
    
    if (elements.gcContent) {
        elements.gcContent.textContent = gcContent(currentSequence) + '%';
    }
}

// Charger l'historique
function loadHistory(elements) {
    if (!elements.historyList) return;
    
    if (window.LabGeniusStorage) {
        const history = LabGeniusStorage.getHistory();
        
        if (history.length === 0) {
            elements.historyList.innerHTML = '<li class="empty-history">Aucun historique</li>';
            return;
        }
        
        elements.historyList.innerHTML = history.slice(0, 10).map(item => 
            `<li>[${item.date}] ${item.action}: ${item.sequence.substring(0, 15)}...</li>`
        ).join('');
    }
}

// Effacer l'historique
function clearHistory(elements) {
    if (window.LabGeniusStorage) {
        LabGeniusStorage.clearHistory();
        if (elements.historyList) {
            elements.historyList.innerHTML = '<li class="empty-history">Historique effacé</li>';
        }
        showNotification('🗑️ Historique effacé');
    }
}

// Notification
function showNotification(message, type = 'success') {
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#00d4ff'
    };
    
    const notification = document.createElement('div');
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
        font-weight: 500;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Fonctions globales (seront fournies par utils.js)
function validateSequence(seq) { return Utils.validateSequence(seq); }
function formatSequence(seq) { return Utils.formatSequence(seq); }
function transcribeToRNA(seq) { return Utils.transcribeToRNA(seq); }
function substitute(seq, pos, base) { return Utils.substitute(seq, pos, base); }
function insert(seq, pos, base) { return Utils.insert(seq, pos, base); }
function delete_(seq, pos) { return Utils.delete_(seq, pos); }
function reverse(seq) { return Utils.reverse(seq); }
function reverseComplement(seq) { return Utils.reverseComplement(seq); }
function gcContent(seq) { return Utils.gcContent(seq); }