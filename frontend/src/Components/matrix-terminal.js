export class MatrixTerminal extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.worker = new Worker(new URL('../Workers/data-worker.js', import.meta.url));
        this.worker.onmessage = this.handleWorkerMessage.bind(this);
        this.history = [];
        this.historyIndex = -1;
        this.copilotChatMode = false;
    }

    connectedCallback() {
        this.render();
        this.inputElement = this.shadowRoot.querySelector('#cmd-input');
        this.outputElement = this.shadowRoot.querySelector('#terminal-output');
        this.inputLine = this.shadowRoot.querySelector('#terminal-input-line');
        this.currentChannel = 'nexus';
        
        this.setupEvents();
        this.startBootSequence();
        
        // Listen for global chat broadcasts
        document.addEventListener('neural-link-message', (e) => {
            const data = e.detail;
            if (data.type === 'chat' && data.channel === this.currentChannel) {
                this.printOutput(`[${data.sender}] ${data.message}`, 'chat-msg');
            } else if (data.type === 'system') {
                this.printOutput(`[SYSTEM] ${data.message}`, 'system');
            }
        });

        // Listen for copilot chat activation
        document.addEventListener('open-copilot-chat', () => {
            this.enableCopilotChatMode();
        });

        // Listen for copilot responses
        document.addEventListener('copilot-response', (e) => {
            if (this.copilotChatMode) {
                this.printOutput(`[COPILOT] ${e.detail.response}`, 'copilot-msg');
            }
        });
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    color: var(--matrix-green, #00ff41);
                    font-family: var(--terminal-font, 'Share Tech Mono', monospace);
                    text-shadow: 0 0 5px var(--matrix-green), 0 0 10px var(--matrix-dark-green);
                }
                #terminal-output {
                    flex: 1;
                    overflow-y: auto;
                    margin-bottom: 10px;
                    white-space: pre-wrap;
                    word-break: break-all;
                }
                .log-line { margin: 2px 0; }
                .system { color: #88ff88; }
                .error { color: #ff3333; text-shadow: 0 0 5px #ff0000; }
                .chat-msg { color: #00ffff; text-shadow: 0 0 5px #00aaaa; }
                .copilot-msg { color: #ff00ff; text-shadow: 0 0 5px #ff00ff; }
                .user-msg { color: #ffff00; text-shadow: 0 0 5px #aaaa00; }
                #terminal-input-line { display: flex; align-items: center; }
                .prompt { margin-right: 10px; font-weight: bold; }
                .copilot-prompt { 
                    margin-right: 10px; 
                    font-weight: bold; 
                    color: #ff00ff;
                    text-shadow: 0 0 5px #ff00ff;
                }
                #cmd-input {
                    background: transparent; border: none; outline: none;
                    color: inherit; font-family: inherit; font-size: 1rem;
                    flex: 1; text-shadow: inherit; caret-color: transparent;
                }
                .cursor {
                    width: 10px; height: 1.2rem; background-color: var(--matrix-green);
                    animation: blink 1s step-end infinite; display: inline-block; margin-left: 2px;
                }
                @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
                
                /* Custom Scrollbar in Shadow DOM */
                ::-webkit-scrollbar { width: 8px; }
                ::-webkit-scrollbar-track { background: rgba(0, 255, 65, 0.1); }
                ::-webkit-scrollbar-thumb { background: #008f11; }
            </style>
            <div id="terminal-output"></div>
            <div id="terminal-input-line" style="display: none;">
                <span class="prompt">operator@matrix-os:~$</span>
                <input type="text" id="cmd-input" autocomplete="off" spellcheck="false" autofocus>
                <div class="cursor"></div>
            </div>
        `;
    }

    setupEvents() {
        this.inputElement.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const cmd = this.inputElement.value.trim();
                if (cmd) {
                    this.history.push(cmd);
                    this.historyIndex = this.history.length;
                    this.printEcho(cmd);
                    // Usar el worker para parsear (simulación asíncrona)
                    this.worker.postMessage({ action: 'PARSE_COMMAND', payload: cmd });
                }
                this.inputElement.value = '';
                this.scrollToBottom();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (this.historyIndex > 0) {
                    this.historyIndex--;
                    this.inputElement.value = this.history[this.historyIndex];
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (this.historyIndex < this.history.length - 1) {
                    this.historyIndex++;
                    this.inputElement.value = this.history[this.historyIndex];
                } else {
                    this.historyIndex = this.history.length;
                    this.inputElement.value = '';
                }
            }
        });

        // Mantener focus
        this.addEventListener('click', () => this.inputElement.focus());
    }

    handleWorkerMessage(e) {
        const { action, result } = e.data;
        if (action === 'COMMAND_PARSED') {
            this.processCommand(result.tokens);
        }
    }

    printEcho(cmd) {
        const el = document.createElement('div');
        el.className = 'log-line';
        el.innerHTML = `<span class="prompt">operator@matrix-os:~$</span> ${cmd}`;
        this.outputElement.appendChild(el);
    }

    printOutput(text, className = '') {
        const el = document.createElement('div');
        el.className = `log-line ${className}`;
        el.textContent = text;
        this.outputElement.appendChild(el);
        this.scrollToBottom();
    }

    scrollToBottom() {
        this.outputElement.scrollTop = this.outputElement.scrollHeight;
    }

    processCommand(tokens) {
        // Si estamos en modo chat con copilot, manejar diferente
        if (this.copilotChatMode) {
            const message = tokens.join(' ');
            
            // Comandos especiales para salir del chat
            if (message.toLowerCase() === 'exit' || message.toLowerCase() === 'quit' || message.toLowerCase() === 'bye') {
                this.disableCopilotChatMode();
                return;
            }
            
            // Mostrar mensaje del usuario
            this.printOutput(`[YOU] ${message}`, 'user-msg');
            
            // Enviar mensaje al copilot
            document.dispatchEvent(new CustomEvent('copilot-message', { detail: { message }}));
            return;
        }

        const base = tokens[0].toLowerCase();
        let dispatched = false;

        switch(base) {
            case 'help': 
                this.printOutput("AVAILABLE KERNEL COMMANDS:", 'system');
                this.printOutput("  help                                - View this manual");
                this.printOutput("  clear                               - Clear terminal buffer");
                this.printOutput("  map                                 - Open spatial graph navigation");
                this.printOutput("  constellation                       - Same as map");
                this.printOutput("  post-code                           - Spawn a collaborative Code Nexus snippet");
                this.printOutput("  join <channel>                      - Switch to a specific channel");
                this.printOutput("  say <msg>                           - Broadcast message to current channel");
                this.printOutput("  create-channel <name> <pub|priv> [pwd] [aiKey] - Create a channel");
                this.printOutput("  switch-shell <role>                 - Change identity (e.g., security)");
                this.printOutput("  copilot                             - Open AI chat interface");
                break;
            case 'clear': 
                this.outputElement.innerHTML = ''; 
                break;
            case 'join':
                if (tokens[1]) {
                    this.currentChannel = tokens[1];
                    this.printOutput(`Switched to channel [${this.currentChannel}]`, 'system');
                }
                break;
            case 'say':
                const msg = tokens.slice(1).join(' ');
                this.dispatchEvent(new CustomEvent('terminal-command', { detail: { 
                    action: 'say',
                    channel: this.currentChannel,
                    message: msg
                }}));
                dispatched = true;
                break;
            case 'create-channel':
                this.dispatchEvent(new CustomEvent('terminal-command', { detail: { 
                    action: 'create-channel',
                    name: tokens[1] || 'default',
                    is_public: (tokens[2] !== 'priv'),
                    password: tokens[3] || null,
                    ai_key: tokens[4] || null
                }}));
                dispatched = true;
                break;
            case 'copilot':
                this.enableCopilotChatMode();
                break;
            case 'map':
            case 'constellation':
            case 'post-code':
            case 'switch-shell':
                // These are handled by OS.js natively
                break;
            default: 
                this.printOutput(`[-] Command not found: ${base}`, 'error');
        }
        
        // Dispatch custom event for OS to hook into (e.g., opening a window)
        if (!dispatched) {
            this.dispatchEvent(new CustomEvent('terminal-command', { detail: { action: 'os-cmd', tokens }}));
        }
    }

    async startBootSequence() {
        const bootSequence = [
            "WAKE UP, NEO...",
            "INITIATING MATRIX OS KERNEL V5.0.2050",
            "LOADING NEURAL DRIVERS........ [OK]"
        ];
        
        for (let line of bootSequence) {
            await new Promise(r => setTimeout(r, Math.random() * 400 + 200));
            this.printOutput(line, 'system');
        }
        this.inputLine.style.display = 'flex';
        this.inputElement.focus();
    }

    enableCopilotChatMode() {
        this.copilotChatMode = true;
        this.printOutput("", 'system');
        this.printOutput("═══════════════════════════════════════", 'system');
        this.printOutput("   NEURAL LINK CHAT INTERFACE ACTIVE", 'copilot-msg');
        this.printOutput("═══════════════════════════════════════", 'system');
        this.printOutput("Type 'exit', 'quit', or 'bye' to return to normal mode.", 'system');
        this.printOutput("", 'system');
        
        // Cambiar el prompt
        const promptElement = this.shadowRoot.querySelector('.prompt');
        if (promptElement) {
            promptElement.textContent = 'copilot@matrix-os:~$';
            promptElement.classList.remove('prompt');
            promptElement.classList.add('copilot-prompt');
        }
        
        this.inputElement.focus();
    }

    disableCopilotChatMode() {
        this.copilotChatMode = false;
        this.printOutput("", 'system');
        this.printOutput("Neural link chat interface closed. Returning to normal mode.", 'system');
        this.printOutput("", 'system');
        
        // Restaurar el prompt original
        const promptElement = this.shadowRoot.querySelector('.copilot-prompt');
        if (promptElement) {
            promptElement.textContent = 'operator@matrix-os:~$';
            promptElement.classList.remove('copilot-prompt');
            promptElement.classList.add('prompt');
        }
        
        this.inputElement.focus();
    }
}

customElements.define('matrix-terminal', MatrixTerminal);
