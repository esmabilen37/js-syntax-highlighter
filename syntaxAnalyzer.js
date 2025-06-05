class SyntaxAnalyzer {
    constructor(tokens) {
        this.tokens = tokens;
        this.position = 0;
        this.errors = [];
    }

    parse() {
        this.errors = [];
        this.checkBasicSyntax();
        this.checkSemicolonErrors(); 
        return this.errors;
    }

    checkBasicSyntax() {
        const stack = [];
        const brackets = {'(': ')', '[': ']', '{': '}'};
        
        for (const token of this.tokens) {
            if (token.type === LexicalAnalyzer.TokenTypes.PUNCTUATION) {
                if ('([{'.includes(token.value)) {
                    stack.push({token: token, expected: brackets[token.value]});
                } else if (')]}'.includes(token.value)) {
                    if (stack.length === 0) {
                        this.errors.push({
                            line: token.line,
                            message: `Unexpected closing ${token.value}`
                        });
                    } else {
                        const last = stack.pop();
                        if (last.expected !== token.value) {
                            this.errors.push({
                                line: token.line,
                                message: `Expected ${last.expected} but found ${token.value}`
                            });
                        }
                    }
                }
            }
        }
        
        // Kapanmamış parantezler
        while (stack.length > 0) {
            const unclosed = stack.pop();
            this.errors.push({
                line: unclosed.token.line,
                message: `Unclosed ${unclosed.token.value}`
            });
        }
    }

    checkSemicolonErrors() {
        for (let i = 0; i < this.tokens.length - 1; i++) {
            const token = this.tokens[i];
            if (
                (token.type === LexicalAnalyzer.TokenTypes.KEYWORD &&
                 ['let', 'const', 'var', 'return'].includes(token.value))
                ||
                (token.type === LexicalAnalyzer.TokenTypes.IDENTIFIER)
            ) {
                // Satırda blok başlıyor mu? (aynı satırda { var mı)
                let hasBlockStart = false;
                let j = i + 1;
                while (j < this.tokens.length && this.tokens[j].line === token.line) {
                    const t = this.tokens[j];
                    if (t.type === LexicalAnalyzer.TokenTypes.PUNCTUATION && t.value === '{') {
                        hasBlockStart = true;
                        break;
                    }
                    j++;
                }
                if (hasBlockStart) continue; // Blok başlıyorsa ; bekleme

                // Satırın sonunda noktalı virgül var mı?
                let foundSemicolon = false;
                j = i + 1;
                while (j < this.tokens.length) {
                    const t = this.tokens[j];
                    if (t.type === LexicalAnalyzer.TokenTypes.PUNCTUATION && t.value === ';') {
                        foundSemicolon = true;
                        break;
                    }
                    if (t.type === LexicalAnalyzer.TokenTypes.PUNCTUATION && (t.value === '{' || t.value === '}')) break;
                    if (t.line !== token.line) break;
                    j++;
                }
                if (!foundSemicolon) {
                    this.errors.push({
                        line: token.line,
                        message: `Missing semicolon (;) at end of statement`
                    });
                }
            }
        }
    }
}