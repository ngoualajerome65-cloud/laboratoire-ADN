// js/synthese.js
// Machine de synthèse - LabGenius

let isSynthesizing = false;

// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Machine de synthèse initialisée');
    
    // Récupérer les éléments DOM
    const elements = {
        synthesisInput: document.getElementById('synthesisInput'),
        startBtn: document.getElementById('startSynthesisBtn'),
        validateBtn: document.getElementById('validateBtn'),
        loadFromEditorBtn: document.getElementById('loadFromEditorBtn'),
        clearBtn: document.getElementById('clearBtn'),
        newSynthesisBtn: document.getElementById('newSynthesisBtn'),
        saveToLibraryBtn: document.getElementById('saveToLibraryBtn'),
        progressSection: document.getElementById('progressSection'),
        resultSection: document.getElementById('resultSection'),
        progressBar: document.getElementById('progressBar'),
        progressStatus: document.getElementById('progressStatus'),
        synthesisReport: document.getElementById('synthesisReport'),
        synthesisError: document.getElementById('synthesisError'),
        previewLength: document.getElementById('previewLength'),
        previewGC: document.getElementById('previewGC'),
        previewRate: document.getElementById('previewRate')
    };
    
    // Charger séquence depuis l'éditeur
    const tempSequence = localStorage.getItem('temp_sequence');
    if (tempSequence && elements.synthesisInput) {
        elements.synthesisInput.value = tempSequence;
        localStorage.removeItem('temp_sequence');
        updatePreview(elements);
    }
    
    // Event Listeners
    if (elements.startBtn) {
        elements.startBtn.addEventListener('click', () => startSynthesis(elements));
    }
    
    if (elements.validateBtn) {
        elements.validateBtn.addEventListener('click', () => validateInput(elements));
    }
    
    if (elements.loadFromEditorBtn) {
        elements.loadFromEditorBtn.addEventListener('click', () => loadFromEditor(elements));
    }
    
    if (elements.clearBtn) {
        elements.clearBtn.addEventListener('click', () => clearInput(elements));
    }
    
    if (elements.newSynthesisBtn) {
        elements.newSynthesisBtn.addEventListener('click', () => resetSynthesis(elements));
    }
    
    if (elements.synthesisInput) {
        elements.synthesisInput.addEventListener('input', () => updatePreview(elements));
        elements.synthesisInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                startSynthesis(elements);
            }
        });
    }
    
    // Mise à jour initiale
    updatePreview(elements);
});

// Valider l'entrée
function validateInput(elements) {
    if (!elements.synthesisInput) return false;
    
    try {
        if (!window.Utils) {
            throw new Error('Utils non chargé');
        }
        
        const sequence = Utils.validateSequence(elements.synthesisInput.value);
        elements.synthesisError.textContent = '';
        elements.synthesisInput.classList.remove('error');
        showNotification('✅ Séquence valide');
        return true;
        
    } catch (error) {
        elements.synthesisError.textContent = error.message;
        elements.synthesisInput.classList.add('error');
        showNotification(error.message, 'error');
        return false;
    }
}

// Mettre à jour l'aperçu
function updatePreview(elements) {
    if (!elements.synthesisInput) return;
    
    const sequence = elements.synthesisInput.value.trim().toUpperCase();
    
    try {
        if (sequence.length > 0 && window.Utils) {
            Utils.validateSequence(sequence);
            
            const gc = Utils.gcContent(sequence);
            const rate = calculateSuccessRate(sequence);
            
            if (elements.previewLength) {
                elements.previewLength.textContent = sequence.length + ' bases';
            }
            
            if (elements.previewGC) {
                elements.previewGC.textContent = gc + '%';
            }
            
            if (elements.previewRate) {
                elements.previewRate.textContent = rate + '%';
            }
        }
    } catch (e) {
        // Séquence invalide, on ignore
    }
}

// Démarrer la synthèse
async function startSynthesis(elements) {
    if (isSynthesizing) return;
    
    // Valider d'abord
    if (!validateInput(elements)) return;
    
    try {
        const sequence = Utils.validateSequence(elements.synthesisInput.value);
        
        // Désactiver les boutons
        setButtonsDisabled(elements, true);
        isSynthesizing = true;
        
        // Cacher les résultats précédents
        if (elements.resultSection) {
            elements.resultSection.style.display = 'none';
        }
        
        // Afficher la progression
        if (elements.progressSection) {
            elements.progressSection.style.display = 'block';
        }
        
        // Réinitialiser la barre de progression
        if (elements.progressBar) {
            elements.progressBar.style.width = '0%';
        }
        
        if (elements.progressStatus) {
            elements.progressStatus.innerHTML = '0%<small>Analyse...</small>';
        }
        
        // Animer la progression
        await animateProgress(elements);
        
        // Calculer le résultat
        const successRate = calculateSuccessRate(sequence);
        const success = Math.random() * 100 <= successRate;
        
        // Afficher le résultat
        showResult(elements, success, successRate, sequence);
        
        // Sauvegarder dans l'historique
        if (window.LabGeniusStorage) {
            LabGeniusStorage.addToHistory('synthèse', sequence);
        }
        
    } catch (error) {
        showNotification('Erreur: ' + error.message, 'error');
    } finally {
        setButtonsDisabled(elements, false);
        isSynthesizing = false;
    }
}

// Animer la progression
function animateProgress(elements) {
    return new Promise((resolve) => {
        let progress = 0;
        const steps = [0, 25, 50, 75, 90, 100];
        const messages = [
            'Analyse de la séquence...',
            'Préparation de la synthèse...',
            'Synthèse en cours...',
            'Vérification...',
            'Finalisation...',
            'Terminé !'
        ];
        
        let stepIndex = 0;
        
        const interval = setInterval(() => {
            if (stepIndex < steps.length) {
                progress = steps[stepIndex];
                
                if (elements.progressBar) {
                    elements.progressBar.style.width = progress + '%';
                }
                
                if (elements.progressStatus) {
                    elements.progressStatus.innerHTML = `${progress}%<small>${messages[stepIndex]}</small>`;
                }
                
                stepIndex++;
            } else {
                clearInterval(interval);
                resolve();
            }
        }, 600);
    });
}

// Afficher le résultat
function showResult(elements, success, rate, sequence) {
    if (!elements.resultSection || !elements.synthesisReport) return;
    
    elements.resultSection.style.display = 'block';
    if (elements.progressSection) {
        elements.progressSection.style.display = 'none';
    }
    
    const status = success ? '✅ SYNTHÈSE RÉUSSIE' : '❌ SYNTHÈSE ÉCHOUÉE';
    const color = success ? '#22c55e' : '#ef4444';
    const message = success 
        ? 'La séquence a été synthétisée avec succès.'
        : 'La synthèse a échoué. Les séquences plus courtes ont plus de chances de réussir.';
    
    elements.synthesisReport.innerHTML = `
        <div style="text-align: center;">
            <div style="color: ${color}; font-size: 2rem; font-weight: bold; margin-bottom: 1rem;">
                ${status}
            </div>
            
            <div class="result-details">
                <div class="result-stat">
                    <div style="font-size: 1.5rem; color: #00d4ff;">${rate}%</div>
                    <div>Taux de réussite</div>
                </div>
                <div class="result-stat">
                    <div style="font-size: 1.5rem; color: #00d4ff;">${sequence.length}</div>
                    <div>Bases</div>
                </div>
                <div class="result-stat">
                    <div style="font-size: 1.5rem; color: #00d4ff;">${Utils.gcContent(sequence)}%</div>
                    <div>GC Content</div>
                </div>
            </div>
            
            <div class="sequence-display">
                ${Utils.formatSequence(sequence)}
            </div>
            
            <p style="color: #94a3b8; margin: 1rem 0;">${message}</p>
        </div>
    `;
    
    // Afficher le bouton de sauvegarde si succès
    if (success && elements.saveToLibraryBtn) {
        elements.saveToLibraryBtn.style.display = 'inline-flex';
        elements.saveToLibraryBtn.onclick = () => {
            localStorage.setItem('temp_sequence', sequence);
            window.location.href = 'bibliotheque.html';
        };
    }
}

// Charger depuis l'éditeur
function loadFromEditor(elements) {
    const examples = [
        'ATGCGTAAATGC',
        'ATGGCTAGCAAA',
        'ATGGACAAGAAG',
        'ATGACCATGATT'
    ];
    
    const randomSeq = examples[Math.floor(Math.random() * examples.length)];
    
    if (elements.synthesisInput) {
        elements.synthesisInput.value = randomSeq;
        updatePreview(elements);
        showNotification('📋 Séquence chargée');
    }
}

// Effacer l'entrée
function clearInput(elements) {
    if (elements.synthesisInput) {
        elements.synthesisInput.value = '';
        updatePreview(elements);
        if (elements.synthesisError) {
            elements.synthesisError.textContent = '';
        }
        if (elements.resultSection) {
            elements.resultSection.style.display = 'none';
        }
    }
}

// Réinitialiser la synthèse
function resetSynthesis(elements) {
    if (elements.resultSection) {
        elements.resultSection.style.display = 'none';
    }
    if (elements.synthesisInput) {
        elements.synthesisInput.value = 'ATGCGTAAATGC';
        updatePreview(elements);
    }
}

// Activer/désactiver les boutons
function setButtonsDisabled(elements, disabled) {
    if (elements.startBtn) elements.startBtn.disabled = disabled;
    if (elements.validateBtn) elements.validateBtn.disabled = disabled;
    if (elements.loadFromEditorBtn) elements.loadFromEditorBtn.disabled = disabled;
    if (elements.clearBtn) elements.clearBtn.disabled = disabled;
}

// Calculer le taux de réussite
function calculateSuccessRate(sequence) {
    const length = sequence.length;
    // Plus la séquence est longue, plus le taux diminue
    return Math.max(30, Math.min(98, 100 - length));
}

// Afficher une notification
function showNotification(message, type = 'success') {
    const colors = {
        success: '#22c55e',
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

// Ajouter l'animation si elle n'existe pas
if (!document.getElementById('notification-style')) {
    const style = document.createElement('style');
    style.id = 'notification-style';
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}