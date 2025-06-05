/*
EBNF ile temel JavaScript grameri bu şekilde:

program      = { statement } ;
statement    = varDecl | funcDecl | exprStmt ;
varDecl      = ("let" | "const" | "var") identifier "=" expression ";" ;
funcDecl     = "function" identifier "(" [ identifier { "," identifier } ] ")" block ;
exprStmt     = expression ";" ;
block        = "{" { statement } "}" ;
expression   = identifier | number | string | expression operator expression ;
identifier   = letter { letter | digit | "_" | "$" } ;
number       = digit { digit } ;
string       = '"' { any } '"' | "'" { any } "'" ;
operator     = "+" | "-" | "*" | "/" | "%" | "==" | "!=" | ... ;
*/

// Token sınıfı
class Token {
    constructor(type, value, line, column) {
        this.type = type;
        this.value = value;
        this.line = line;
        this.column = column;
    }
}

// Lexical Analyzer
class LexicalAnalyzer {
    constructor(input) {
        this.input = input;
        this.position = 0;
        this.line = 1;
        this.column = 1;
        this.tokens = [];
        this.errors = [];
    }
 //token turlerini yazıyoruz bunları kontrol edicez cunku
    static TokenTypes = {
        KEYWORD: 'keyword',
        IDENTIFIER: 'identifier',
        NUMBER: 'number',
        STRING: 'string',
        OPERATOR: 'operator',
        PUNCTUATION: 'punctuation',
        COMMENT: 'comment',
        FUNCTION: 'function',
        EOF: 'eof',
        ERROR: 'error'
    };
    static Keywords = new Set([
        'function', 'let', 'const', 'var', 'if', 'else', 'for', 'while', 
        'return', 'true', 'false', 'null', 'undefined', 'class', 'extends',
        'import', 'export', 'default', 'try', 'catch', 'finally', 'throw',
        'new', 'this', 'super', 'static', 'async', 'await', 'typeof', 'console'
    ]);

    static Operators = new Set([
        '+', '-', '*', '/', '%', '=', '==', '===', '!=', '!==',
        '<', '>', '<=', '>=', '&&', '||', '!', '++', '--', '+=', '-=',
        '*=', '/=', '%=', '?', ':', '=>'
    ]);

    peek(offset = 0) {
        const pos = this.position + offset;
        return pos < this.input.length ? this.input[pos] : '\0';
    }

    advance() {
        if (this.position < this.input.length) {
            if (this.input[this.position] === '\n') {
                this.line++;
                this.column = 1;
            } else {
                this.column++;
            }
            this.position++;
        }
    }

    skipWhitespace() {
        while (this.position < this.input.length && /\s/.test(this.peek())) {
            this.advance();
        }
    }

    readString(quote) {
        const startColumn = this.column;
        const startLine = this.line;
        let value = quote;
        this.advance(); // Skip opening quote
        
        let closed = false;
        while (this.position < this.input.length) {
            if (this.peek() === quote) {
                value += this.peek();
                this.advance(); // Skip closing quote
                closed = true;
                break;
            }
            if (this.peek() === '\n') {
                // Satır sonuna kadar string kapatılmadıysa hata!
                break;
            }
            if (this.peek() === '\\') {
                value += this.peek();
                this.advance();
                if (this.position < this.input.length) {
                    value += this.peek();
                    this.advance();
                }
            } else {
                value += this.peek();
                this.advance();
            }
        }
        
        if (closed) {
            return new Token(LexicalAnalyzer.TokenTypes.STRING, value, startLine, startColumn);
        } else {
            this.errors.push({
                line: startLine,
                message: 'Unterminated string literal'
            });
            return new Token(LexicalAnalyzer.TokenTypes.ERROR, value, startLine, startColumn);
        }
    }

    readNumber() {
        const startColumn = this.column;
        let value = '';
        let hasDot = false;
        
        while (this.position < this.input.length && 
               (/\d/.test(this.peek()) || (this.peek() === '.' && !hasDot))) {
            if (this.peek() === '.') hasDot = true;
            value += this.peek();
            this.advance();
        }
        
        return new Token(LexicalAnalyzer.TokenTypes.NUMBER, value, this.line, startColumn);
    }

    readIdentifier() {
        const startColumn = this.column;
        let value = '';
        
        while (this.position < this.input.length && 
               /[a-zA-Z0-9_$]/.test(this.peek())) {
            value += this.peek();
            this.advance();
        }
        
        let type = LexicalAnalyzer.Keywords.has(value) ? 
            LexicalAnalyzer.TokenTypes.KEYWORD : 
            LexicalAnalyzer.TokenTypes.IDENTIFIER;

        
        if (
            type === LexicalAnalyzer.TokenTypes.IDENTIFIER &&
            value.length > 2 // çok kısa kelimeleri kontrol etme
        ) {
            for (const kw of LexicalAnalyzer.Keywords) {
                if (
                    kw.length === value.length &&
                    this.levenshteinDistance(value, kw) === 1 // 1 harf hatası
                ) {
                    this.errors.push({
                        line: this.line,
                        message: `"${value}" yanlış yazılmış olabilir. Belki "${kw}" demek istediniz?`
                    });
                    break;
                }
            }
        }

        return new Token(type, value, this.line, startColumn);
    }

    levenshteinDistance(a, b) {
        const dp = Array(a.length + 1).fill(null).map(() =>
            Array(b.length + 1).fill(0)
        );
        for (let i = 0; i <= a.length; i++) dp[i][0] = i;
        for (let j = 0; j <= b.length; j++) dp[0][j] = j;
        for (let i = 1; i <= a.length; i++) {
            for (let j = 1; j <= b.length; j++) {
                if (a[i - 1] === b[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    dp[i][j] = 1 + Math.min(
                        dp[i - 1][j],    // silme
                        dp[i][j - 1],    // ekleme
                        dp[i - 1][j - 1] // değiştirme
                    );
                }
            }
        }
        return dp[a.length][b.length];
    }

    readComment() {
        const startColumn = this.column;
        let value = '';
        
        if (this.peek() === '/' && this.peek(1) === '/') {
            // Single line comment
            while (this.position < this.input.length && this.peek() !== '\n') {
                value += this.peek();
                this.advance();
            }
        } else if (this.peek() === '/' && this.peek(1) === '*') {
            // Multi line comment
            value += this.peek();
            this.advance();
            value += this.peek();
            this.advance();
            
            while (this.position < this.input.length - 1) {
                if (this.peek() === '*' && this.peek(1) === '/') {
                    value += this.peek();
                    this.advance();
                    value += this.peek();
                    this.advance();
                    break;
                }
                value += this.peek();
                this.advance();
            }
        }
        
        return new Token(LexicalAnalyzer.TokenTypes.COMMENT, value, this.line, startColumn);
    }

    readOperator() {
        const startColumn = this.column;
        let value = '';
        
        // İki karakterli operatörler
        const twoChar = this.peek() + this.peek(1);
        if (LexicalAnalyzer.Operators.has(twoChar)) {
            value = twoChar;
            this.advance();
            this.advance();
        } else if (LexicalAnalyzer.Operators.has(this.peek())) {
            value = this.peek();
            this.advance();
        }
        
        return new Token(LexicalAnalyzer.TokenTypes.OPERATOR, value, this.line, startColumn);
    }

    tokenize() {
        this.tokens = [];
        this.errors = [];
        this.position = 0;
        this.line = 1;
        this.column = 1;
        
        while (this.position < this.input.length) {
            this.skipWhitespace();
            
            if (this.position >= this.input.length) break;
            
            const ch = this.peek();
            
            if (ch === '"' || ch === "'" || ch === '`') {
                this.tokens.push(this.readString(ch));
            } else if (/\d/.test(ch)) {
                this.tokens.push(this.readNumber());
            } else if (/[a-zA-Z_$]/.test(ch)) {
                this.tokens.push(this.readIdentifier());
            } else if (ch === '/' && (this.peek(1) === '/' || this.peek(1) === '*')) {
                this.tokens.push(this.readComment());
            } else if ('(){}[];,.'.includes(ch)) {
                this.tokens.push(new Token(LexicalAnalyzer.TokenTypes.PUNCTUATION, ch, this.line, this.column));
                this.advance();
            } else if (LexicalAnalyzer.Operators.has(ch) || LexicalAnalyzer.Operators.has(ch + this.peek(1))) {
                this.tokens.push(this.readOperator());
            } else {
                this.errors.push({
                    line: this.line,
                    message: `Unexpected character: '${ch}'`
                });
                this.tokens.push(new Token(LexicalAnalyzer.TokenTypes.ERROR, ch, this.line, this.column));
                this.advance();
            }
        }
        
        this.tokens.push(new Token(LexicalAnalyzer.TokenTypes.EOF, '', this.line, this.column));
        return this.tokens;
    }
}
