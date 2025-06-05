// Syntax Highlighter ana sınıfı
class SyntaxHighlighter {
    constructor() {
        this.editor = document.getElementById('editor');
        this.highlightLayer = document.getElementById('highlightLayer');
        this.lineNumbers = document.getElementById('lineNumbers');
        this.errorList = document.getElementById('errorList');
        this.stats = document.getElementById('stats');
        this.parseTree = document.getElementById('parseTree');
        this.tokenList = document.getElementById('tokenList');
        
        this.setupEventListeners();
        this.updateHighlighting();
    }

    setupEventListeners() {
        this.editor.addEventListener('input', () => this.updateHighlighting());
        this.editor.addEventListener('scroll', () => this.syncScroll());
        window.addEventListener('resize', () => this.syncScroll());
    }

    syncScroll() {
        this.highlightLayer.scrollTop = this.editor.scrollTop;
        this.highlightLayer.scrollLeft = this.editor.scrollLeft;
    }

    updateLineNumbers(lineCount, errors) {
        const errorsByLine = new Map();
        errors.forEach(error => {
            if (!errorsByLine.has(error.line)) {
                errorsByLine.set(error.line, []);
            }
            errorsByLine.get(error.line).push(error);
        });

        let numbersHtml = '';
        for (let i = 1; i <= lineCount; i++) {
            const hasError = errorsByLine.has(i);
            numbersHtml += `<div class="line-number">
                ${i}
                ${hasError ? `<div class="error-indicator" title="${errorsByLine.get(i).map(e => e.message).join(', ')}">&times;</div>` : ''}
            </div>`;
        }
        this.lineNumbers.innerHTML = numbersHtml;
    }

    updateErrorList(lexicalErrors, syntaxErrors) {
        // Satır ve mesajı aynı olanları tekilleştir
        const seen = new Set();
        const allErrors = [...lexicalErrors, ...syntaxErrors].filter(err => {
            const key = err.line + '|' + err.message;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });

        if (allErrors.length === 0) {
            this.errorList.innerHTML = '<div style="color: #6a9955; padding: 10px;">✓ Hata bulunamadı</div>';
            return;
        }

        let errorHtml = '';
        allErrors.forEach(error => {
            errorHtml += `
                <div class="error-item">
                    <div class="error-line">Satır ${error.line}</div>
                    <div class="error-message">${error.message}</div>
                </div>
            `;
        });

        this.errorList.innerHTML = errorHtml;
    }
            
    renderParseTree(tokens) {
        // Basit blok/parantez ağacı (örnek)
        let indent = 0;
        let tree = '';
        tokens.forEach(token => {
            if (token.type === LexicalAnalyzer.TokenTypes.PUNCTUATION && ['{', '(', '['].includes(token.value)) {
                tree += '  '.repeat(indent) + token.value + '\n';
                indent++;
            } else if (token.type === LexicalAnalyzer.TokenTypes.PUNCTUATION && ['}', ')', ']'].includes(token.value)) {
                indent = Math.max(0, indent - 1);
                tree += '  '.repeat(indent) + token.value + '\n';
            } else if (token.type !== LexicalAnalyzer.TokenTypes.EOF) {
                tree += '  '.repeat(indent) + token.value + '\n';
            }
        });
        return tree;
    }

    renderTokenList(tokens) {
        return tokens
            .filter(t => t.type !== LexicalAnalyzer.TokenTypes.EOF)
            .map(t => `[${t.type}] "${t.value}" (Satır: ${t.line}, Sütun: ${t.column})`)
            .join('\n');
    }

    updateStats(tokenCount, lineCount, errorCount) {
        this.stats.textContent = `Hazır | Token sayısı: ${tokenCount} | Satır sayısı: ${lineCount} | Hata sayısı: ${errorCount}`;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    getTokenClass(token) {
        return `token-${token.type}`;
    }

    highlightTokens(tokens) {
        if (!tokens || tokens.length === 0) {
            this.highlightLayer.innerHTML = this.escapeHtml(this.editor.value);
            return;
        }

        const input = this.editor.value;
        let result = '';
        let position = 0;

        for (const token of tokens) {
            if (token.type === LexicalAnalyzer.TokenTypes.EOF) continue;

            // Token öncesi metin (whitespace)
            const tokenStart = input.indexOf(token.value, position);
            if (tokenStart > position) {
                result += this.escapeHtml(input.substring(position, tokenStart));
            }

            // Token'ı renklendir
            const tokenClass = this.getTokenClass(token);
            const tokenValue = this.escapeHtml(token.value);
            result += `<span class="${tokenClass}">${tokenValue}</span>`;

            position = tokenStart + token.value.length;
        }

        // Kalan metin
        if (position < input.length) {
            result += this.escapeHtml(input.substring(position));
        }

        this.highlightLayer.innerHTML = result;
    }

    updateHighlighting() {
        const code = this.editor.value;
        const lines = code.split('\n');
        const lineCount = lines.length;

        try {
            // Lexical analysis
            const lexer = new LexicalAnalyzer(code);
            const tokens = lexer.tokenize();
            const lexicalErrors = lexer.errors;

            // Syntax analysis
            const parser = new SyntaxAnalyzer(tokens);
            const syntaxErrors = parser.parse();

            // Update UI
            this.highlightTokens(tokens);
            this.updateLineNumbers(lineCount, [...lexicalErrors, ...syntaxErrors]);
            this.updateErrorList(lexicalErrors, syntaxErrors);
            this.updateStats(tokens.length - 1, lineCount, lexicalErrors.length + syntaxErrors.length);
            this.parseTree.textContent = this.renderParseTree(tokens);
            this.tokenList.textContent = this.renderTokenList(tokens);

        } catch (error) {
            console.error('Highlighting error:', error);
            this.highlightLayer.innerHTML = this.escapeHtml(code);
            this.updateLineNumbers(lineCount, []);
            this.updateErrorList([], []);
            this.updateStats(0, lineCount, 1);
        }

        this.syncScroll();
    }
}

// Başlat - DOM yüklendiğinde
document.addEventListener('DOMContentLoaded', () => {
    new SyntaxHighlighter();
});