export class CodeNexus extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.rawCode = '';
        this.language = 'php';
        this.annotations = {};
    }

    connectedCallback() {
        this.rawCode = this.textContent.trim() || this.getAttribute('code') || 'echo "Hello Nexus";';
        this.language = this.getAttribute('lang') || 'php';
        this.render();
        this.setupHooks();
    }

    highlightMatrixStyle(code) {
        // Micro syntax highlighter simulando Prism pero enfocado al modo Matrix
        let highlighted = code
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/(\b(?:function|class|public|private|protected|return|if|else|for|while|echo|const|let|var|def|import|from|import|export|try|catch)\b)/g, '<span class="keyword">$1</span>')
            .replace(/(\$[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*)/g, '<span class="variable">$1</span>')
            .replace(/("[^"]*")/g, '<span class="string">$1</span>')
            .replace(/('[^']*')/g, '<span class="string">$1</span>')
            .replace(/(\b\d+\b)/g, '<span class="number">$1</span>')
            .replace(/(\/\/.*|#.*)/g, '<span class="comment">$1</span>');
            
        return highlighted;
    }

    render() {
        const lines = this.rawCode.split('\n');
        
        let codeHtml = '';
        lines.forEach((line, index) => {
            const lineNum = index + 1;
            const hlLine = this.highlightMatrixStyle(line);
            codeHtml += `
                <div class="line" data-line="${lineNum}">
                    <span class="line-num">${lineNum}</span>
                    <span class="code-content">${hlLine || ' '}</span>
                    <div class="annotation-area" id="ann-${lineNum}"></div>
                </div>
            `;
        });

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    background: rgba(5, 10, 5, 0.95);
                    border: 1px solid var(--matrix-dark-green, #008f11);
                    margin: 10px 0;
                    border-radius: 4px;
                    overflow: hidden;
                    font-family: var(--terminal-font, monospace);
                    color: #00ff41;
                    box-shadow: 0 0 15px rgba(0, 255, 65, 0.1);
                }
                .header {
                    background: #002200;
                    padding: 8px 15px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px dashed #008f11;
                }
                .title { font-weight: bold; }
                .lang-badge {
                    background: #00ff41;
                    color: #000;
                    padding: 2px 8px;
                    border-radius: 3px;
                    font-size: 0.8em;
                }
                .btn-action {
                    background: transparent;
                    color: #00ff41;
                    border: 1px solid #00ff41;
                    padding: 4px 12px;
                    cursor: pointer;
                    font-family: inherit;
                    transition: all 0.2s;
                    margin-left: 5px;
                }
                .btn-action:hover { background: #00ff41; color: #000; }
                
                .code-container { padding: 10px 0; overflow-x: auto; }
                
                .line {
                    display: flex;
                    flex-direction: column;
                    padding: 2px 0;
                }
                .line:hover { background: rgba(0, 255, 65, 0.1); }
                
                .line-wrapper { display: flex; }
                
                .line-num {
                    min-width: 30px;
                    text-align: right;
                    padding-right: 15px;
                    color: #008f11;
                    user-select: none;
                    cursor: cell;
                }
                .line-num:hover { color: #fff; text-shadow: 0 0 5px #00ff41; }
                
                .code-content { flex: 1; white-space: pre; }
                
                /* Syntax Colors */
                .keyword { color: #ff0055; text-shadow: 0 0 5px #ff0055; }
                .variable { color: #00ffff; }
                .string { color: #ffff00; }
                .number { color: #ff8800; }
                .comment { color: #008f11; font-style: italic; }
                
                .annotation-area {
                    margin-left: 45px;
                    font-size: 0.85em;
                }
                .annotation-note {
                    background: rgba(0, 50, 0, 0.8);
                    border-left: 2px solid #00ffff;
                    padding: 5px;
                    margin-top: 5px;
                    color: #00ffff;
                }
                .annotation-input {
                    background: transparent;
                    border: 1px dashed #008f11;
                    color: #00ff41;
                    width: 80%;
                    font-family: inherit;
                    padding: 5px;
                    margin-top: 5px;
                    outline: none;
                }
                
                .output-pane {
                    display: none;
                    background: #000;
                    border-top: 1px solid #008f11;
                    padding: 10px;
                    color: #88ff88;
                }
            </style>
            
            <div class="header">
                <div>
                    <span class="title">NEXUS BLOCK</span>
                    <span class="lang-badge">${this.language.toUpperCase()}</span>
                </div>
                <div>
                    <button class="btn-action" id="copy-btn">COPY</button>
                    <button class="btn-action" id="compile-btn">COMPILE</button>
                </div>
            </div>
            
            <div class="code-container">
                ${codeHtml}
            </div>
            
            <div class="output-pane" id="output-pane"></div>
        `;
    }

    setupHooks() {
        const btn = this.shadowRoot.getElementById('compile-btn');
        const copyBtn = this.shadowRoot.getElementById('copy-btn');
        const output = this.shadowRoot.getElementById('output-pane');
        
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(this.rawCode);
            copyBtn.textContent = 'COPIED!';
            setTimeout(() => copyBtn.textContent = 'COPY', 2000);
        });

        btn.addEventListener('click', () => {
            output.style.display = 'block';
            output.innerHTML = 'Connecting to Motherboard Compiler...<br>';
            
            // Simula petición REST al CQRS Backend
            setTimeout(() => {
                output.innerHTML += '<span style="color:#00ffff;">[Container Spin Up] OK</span><br>';
                output.innerHTML += '<span style="color:#00ffff;">[Executing Payload]</span><br>';
                output.innerHTML += '...<br>';
                output.innerHTML += 'Output: Process exited with 0.<br>';
            }, 800);
        });

        // Lógica de Anotaciones Line-by-Line
        const lines = this.shadowRoot.querySelectorAll('.line-num');
        lines.forEach(lineNode => {
            lineNode.addEventListener('click', (e) => {
                const lineParent = e.target.closest('.line');
                const lineNum = lineParent.getAttribute('data-line');
                const area = this.shadowRoot.getElementById(`ann-${lineNum}`);
                
                // Si ya hay un input abierto, lo ignoramos
                if(area.querySelector('input')) return;

                const input = document.createElement('input');
                input.className = 'annotation-input';
                input.placeholder = `Add commit note to line ${lineNum}... (Press Enter)`;
                input.autofocus = true;
                
                input.addEventListener('keydown', (ev) => {
                    if (ev.key === 'Enter' && input.value.trim()) {
                        this.addAnnotation(lineNum, 'operator', input.value.trim());
                        input.remove();
                        
                        // Notificar por websockets
                        document.dispatchEvent(new CustomEvent('terminal-command', { 
                            detail: { tokens: ['annotate', lineNum, input.value.trim()] } 
                        }));
                    } else if (ev.key === 'Escape') {
                        input.remove();
                    }
                });

                area.appendChild(input);
                input.focus();
            });
        });
    }

    addAnnotation(lineNum, author, text) {
        const area = this.shadowRoot.getElementById(`ann-${lineNum}`);
        const note = document.createElement('div');
        note.className = 'annotation-note';
        note.innerHTML = `<strong>@${author}</strong>: ${text}`;
        
        // Efecto cuántico de llegada
        note.animate([
            { opacity: 0, transform: 'translateX(-10px)', textShadow: '0 0 20px #00ffff' },
            { opacity: 1, transform: 'none', textShadow: 'none' }
        ], { duration: 500, easing: 'ease-out' });
        
        area.appendChild(note);
    }
}

customElements.define('code-nexus', CodeNexus);
