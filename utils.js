// js/utils.js
const VALID_BASES = ['A', 'T', 'C', 'G'];

function validateSequence(sequence) {
    if (!sequence || sequence.length === 0) {
        throw new Error('La séquence ne peut pas être vide');
    }
    
    const upperSeq = sequence.toUpperCase().replace(/\s/g, '');
    
    for (let i = 0; i < upperSeq.length; i++) {
        if (!VALID_BASES.includes(upperSeq[i])) {
            throw new Error(`Base invalide: ${upperSeq[i]}. Utilisez A,T,G,C uniquement`);
        }
    }
    
    return upperSeq;
}

function formatSequence(sequence) {
    if (!sequence) return '';
    return sequence.match(/.{1,3}/g)?.join('-') || sequence;
}
// js/utils.js
const Utils = (function() {
    const VALID_BASES = ['A', 'T', 'C', 'G'];
    
    function validateSequence(sequence) {
        if (!sequence || sequence.length === 0) {
            throw new Error('La séquence ne peut pas être vide');
        }
        
        const upperSeq = sequence.toUpperCase().replace(/\s/g, '');
        
        for (let i = 0; i < upperSeq.length; i++) {
            if (!VALID_BASES.includes(upperSeq[i])) {
                throw new Error(`Base invalide à la position ${i + 1}: '${upperSeq[i]}'. Utilisez A,T,G,C uniquement`);
            }
        }
        
        return upperSeq;
    }
    
    function formatSequence(sequence) {
        if (!sequence) return '';
        return sequence.match(/.{1,3}/g)?.join('-') || sequence;
    }
    
    function transcribeToRNA(dna) {
        const map = { 'A': 'A', 'T': 'U', 'C': 'C', 'G': 'G' };
        let result = '';
        for (let base of dna) {
            result += map[base];
        }
        return result;
    }
    
    function substitute(sequence, position, newBase) {
        if (position < 0 || position >= sequence.length) {
            throw new Error('Position invalide');
        }
        validateSequence(newBase);
        
        const bases = sequence.split('');
        bases[position] = newBase;
        return bases.join('');
    }
    
    function insert(sequence, position, base) {
        if (position < 0 || position > sequence.length) {
            throw new Error('Position invalide');
        }
        validateSequence(base);
        
        const bases = sequence.split('');
        bases.splice(position, 0, base);
        return bases.join('');
    }
    
    function delete_(sequence, position) {
        if (position < 0 || position >= sequence.length) {
            throw new Error('Position invalide');
        }
        
        const bases = sequence.split('');
        bases.splice(position, 1);
        return bases.join('');
    }
    
    function reverse(sequence) {
        return sequence.split('').reverse().join('');
    }
    
    function reverseComplement(sequence) {
        const complement = { 'A': 'T', 'T': 'A', 'C': 'G', 'G': 'C' };
        return sequence.split('').reverse().map(b => complement[b]).join('');
    }
    
    function gcContent(sequence) {
        const gc = sequence.split('').filter(b => b === 'G' || b === 'C').length;
        return (gc / sequence.length * 100).toFixed(1);
    }
    
    return {
        validateSequence,
        formatSequence,
        transcribeToRNA,
        substitute,
        insert,
        delete_,
        reverse,
        reverseComplement,
        gcContent
    };
})();

// Rendre disponible globalement
window.Utils = Utils;