export class MatrixCopilot extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.state = 'idle'; // idle, listening, processing, speaking
    }

    connectedCallback() {
        this.render();
        this.setupHooks();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    width: 300px;
                    background: rgba(0, 10, 0, 0.9);
                    border: 1px solid var(--matrix-green, #00ff41);
                    border-radius: 5px;
                    padding: 15px;
                    color: var(--matrix-green, #00ff41);
                    font-family: var(--terminal-font, 'Share Tech Mono', monospace);
                    z-index: 9999;
                    box-shadow: 0 0 20px rgba(0, 255, 65, 0.2);
                    transition: all 0.3s ease;
                }
                .header {
                    display: flex;
                    align-items: center;
                    margin-bottom: 10px;
                    border-bottom: 1px dashed var(--matrix-green, #00ff41);
                    padding-bottom: 5px;
                }
                .eye {
                    width: 15px;
                    height: 15px;
                    background: var(--matrix-green, #00ff41);
                    border-radius: 50%;
                    margin-right: 10px;
                    box-shadow: 0 0 10px var(--matrix-green, #00ff41);
                    animation: pulse 2s infinite alternate;
                }
                @keyframes pulse {
                    0% { transform: scale(0.8); opacity: 0.5; }
                    100% { transform: scale(1.2); opacity: 1; }
                }
                .content {
                    font-size: 0.9em;
                    min-height: 40px;
                }
                .thinking {
                    font-style: italic;
                    opacity: 0.7;
                }
            </style>
            <div class="header">
                <div class="eye" id="ai-eye"></div>
                <strong>A.I. COPILOT</strong>
            </div>
            <div class="content" id="ai-text">
                Standing by. I am monitoring your datastream.
            </div>
        `;
    }

    setupHooks() {
        // Escuchar cada tecla del OS para reaccionar o predecir
        document.addEventListener('keydown', (e) => {
            // Animamos el ojo para indicar que la IA nos está mirando
            const eye = this.shadowRoot.getElementById('ai-eye');
            eye.style.animation = 'none';
            eye.style.transform = 'scale(1.5)';
            eye.style.background = '#fff';
            
            clearTimeout(this.resetTimer);
            this.resetTimer = setTimeout(() => {
                eye.style.animation = 'pulse 2s infinite alternate';
                eye.style.background = 'var(--matrix-green, #00ff41)';
            }, 500);
        });

        // Escuchar comandos ejecutados para dar feedback
        document.addEventListener('terminal-command', (e) => {
            const cmd = e.detail.tokens[0].toLowerCase();
            this.speak(this.getSuggestionFor(cmd));
        });
    }

    speak(text) {
        const textContainer = this.shadowRoot.getElementById('ai-text');
        textContainer.innerHTML = '';
        let i = 0;
        
        // Efecto maquina de escribir para la IA
        const typeWriter = setInterval(() => {
            textContainer.innerHTML += text.charAt(i);
            i++;
            if(i >= text.length) clearInterval(typeWriter);
        }, 30);
    }

    getSuggestionFor(cmd) {
        const memory = {
            'join': "Analyzing channel telemetry. Would you like me to summarize the current topic before you speak?",
            'upload': "File detected. Attempting to convert to binary matrix representation...",
            'who': "Retrieving Operator's neural profile from the Motherboard.",
            'switch-shell': "WARNING: Ghost identity transition initiated. Modifying GUI parameters."
        };
        
        return memory[cmd] || `Command '${cmd}' logged. Awaiting further input.`;
    }
}

customElements.define('matrix-copilot', MatrixCopilot);
