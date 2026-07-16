export class EphemeralLab extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const target = this.getAttribute('target') || 'UNKNOWN';
        this.render(target);
        this.setupHooks();
    }

    render(target) {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                    height: 100%;
                    background: #000;
                    color: var(--matrix-green, #00ff41);
                    font-family: var(--terminal-font, 'Share Tech Mono', monospace);
                }
                .toolbar {
                    background: var(--matrix-dark-green, #008f11);
                    color: #000;
                    padding: 5px;
                    display: flex;
                    justify-content: space-between;
                    font-weight: bold;
                }
                .editor {
                    flex: 1;
                    display: flex;
                }
                .line-numbers {
                    width: 30px;
                    background: #030303;
                    border-right: 1px solid #008f11;
                    text-align: right;
                    padding: 5px;
                    color: #008f11;
                    user-select: none;
                }
                textarea {
                    flex: 1;
                    background: transparent;
                    border: none;
                    color: inherit;
                    font-family: inherit;
                    font-size: 1rem;
                    padding: 5px;
                    resize: none;
                    outline: none;
                    line-height: 1.2;
                }
                .console {
                    height: 100px;
                    background: #050505;
                    border-top: 1px dashed #008f11;
                    padding: 5px;
                    overflow-y: auto;
                    font-size: 0.9em;
                }
                .btn {
                    background: #000;
                    color: #00ff41;
                    border: 1px solid #000;
                    cursor: pointer;
                    font-family: inherit;
                    font-weight: bold;
                }
                .btn:hover {
                    background: #00ff41;
                    color: #000;
                }
            </style>
            <div class="toolbar">
                <span>[EPHEMERAL LAB] TARGET: ${target}</span>
                <button class="btn" id="exec-btn">EXECUTE :wq</button>
            </div>
            <div class="editor">
                <div class="line-numbers">1<br>2<br>3<br>4<br>5</div>
                <textarea id="code-area" spellcheck="false"><?php
// Matrix Volatile Sandbox
// Environment: Isolated

echo "Hello from the Ephemeral Space.";
?></textarea>
            </div>
            <div class="console" id="lab-output">
                Waiting for execution trigger...
            </div>
        `;
    }

    setupHooks() {
        const btn = this.shadowRoot.getElementById('exec-btn');
        const output = this.shadowRoot.getElementById('lab-output');
        const code = this.shadowRoot.getElementById('code-area');

        btn.addEventListener('click', () => {
            output.innerHTML += '<br>[SYSTEM] Compiling quantum payload...';
            
            // Simular el retraso del Backend encolando el Job de Sandbox
            setTimeout(() => {
                output.innerHTML += '<br>[VM-0X99] ' + Math.random().toString(36).substr(2, 9) + ' Execution successful.';
                output.scrollTop = output.scrollHeight;
            }, 1000);
        });

        // Simular line numbers updates en el textarea
        code.addEventListener('input', () => {
            const lines = code.value.split('\n').length;
            const lineNums = Array.from({length: lines}, (_, i) => i + 1).join('<br>');
            this.shadowRoot.querySelector('.line-numbers').innerHTML = lineNums;
        });
    }
}

customElements.define('ephemeral-lab', EphemeralLab);
