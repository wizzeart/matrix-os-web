export class MatrixCopilot extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.state = 'idle'; // idle, listening, processing, speaking
        this.configOpen = false;
        this.currentProvider = 'local';
        this.providers = {
            local: {
                name: 'Local AI',
                description: 'Built-in pattern matching (No API required)',
                requiresKey: false,
                baseUrl: null,
                icon: '🤖'
            },
            deepseek: {
                name: 'DeepSeek',
                description: 'Advanced AI reasoning (Free tier available)',
                requiresKey: true,
                baseUrl: 'https://api.deepseek.com/v1',
                icon: '🧠',
                signupUrl: 'https://platform.deepseek.com/'
            },
            groq: {
                name: 'Groq',
                description: 'Ultra-fast inference (Free tier available)',
                requiresKey: true,
                baseUrl: 'https://api.groq.com/openai/v1',
                icon: '⚡',
                signupUrl: 'https://console.groq.com/'
            },
            openrouter: {
                name: 'OpenRouter',
                description: 'Access to multiple AI models (Pay-per-use)',
                requiresKey: true,
                baseUrl: 'https://openrouter.ai/api/v1',
                icon: '🔀',
                signupUrl: 'https://openrouter.ai/'
            },
            huggingface: {
                name: 'Hugging Face',
                description: 'Open source models (Free tier available)',
                requiresKey: true,
                baseUrl: 'https://api-inference.huggingface.co',
                icon: '🤗',
                signupUrl: 'https://huggingface.co/join'
            },
            cohere: {
                name: 'Cohere',
                description: 'Enterprise-grade language AI (Free tier)',
                requiresKey: true,
                baseUrl: 'https://api.cohere.ai/v1',
                icon: '🎯',
                signupUrl: 'https://cohere.com/'
            }
        };
        this.apiKeys = this.loadApiKeys();
    }

    connectedCallback() {
        this.render();
        this.setupHooks();
    }

    render() {
        const currentProvider = this.providers[this.currentProvider];
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
                    cursor: pointer;
                    user-select: none;
                }
                .header:hover {
                    background: rgba(0, 255, 65, 0.1);
                    border-radius: 3px;
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
                .click-hint {
                    font-size: 0.7em;
                    opacity: 0.5;
                    margin-left: auto;
                }
                .config-btn {
                    background: none;
                    border: none;
                    color: var(--matrix-green, #00ff41);
                    cursor: pointer;
                    font-size: 1.2em;
                    margin-left: 10px;
                    padding: 5px;
                    border-radius: 3px;
                    transition: all 0.2s ease;
                }
                .config-btn:hover {
                    background: rgba(0, 255, 65, 0.2);
                    transform: rotate(90deg);
                }
                .provider-indicator {
                    font-size: 0.7em;
                    opacity: 0.7;
                    margin-left: auto;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }
                .config-panel {
                    display: none;
                    position: absolute;
                    bottom: 100%;
                    right: 0;
                    width: 350px;
                    background: rgba(0, 5, 0, 0.95);
                    border: 1px solid var(--matrix-green, #00ff41);
                    border-radius: 5px;
                    padding: 15px;
                    margin-bottom: 10px;
                    max-height: 500px;
                    overflow-y: auto;
                }
                .config-panel.open {
                    display: block;
                }
                .config-panel h3 {
                    margin: 0 0 15px 0;
                    font-size: 1em;
                    border-bottom: 1px dashed var(--matrix-green, #00ff41);
                    padding-bottom: 10px;
                }
                .provider-option {
                    display: flex;
                    align-items: flex-start;
                    padding: 10px;
                    margin: 5px 0;
                    border: 1px solid rgba(0, 255, 65, 0.3);
                    border-radius: 3px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .provider-option:hover {
                    background: rgba(0, 255, 65, 0.1);
                    border-color: var(--matrix-green, #00ff41);
                }
                .provider-option.active {
                    background: rgba(0, 255, 65, 0.2);
                    border-color: var(--matrix-green, #00ff41);
                }
                .provider-icon {
                    font-size: 1.5em;
                    margin-right: 10px;
                }
                .provider-info {
                    flex: 1;
                }
                .provider-name {
                    font-weight: bold;
                    font-size: 0.9em;
                }
                .provider-desc {
                    font-size: 0.7em;
                    opacity: 0.7;
                    margin-top: 3px;
                }
                .provider-key-status {
                    font-size: 0.6em;
                    margin-top: 5px;
                    padding: 2px 5px;
                    border-radius: 2px;
                }
                .key-required {
                    color: #ff3333;
                    background: rgba(255, 51, 51, 0.2);
                }
                .key-set {
                    color: #00ff41;
                    background: rgba(0, 255, 65, 0.2);
                }
                .api-key-input {
                    width: 100%;
                    background: rgba(0, 20, 0, 0.8);
                    border: 1px solid var(--matrix-green, #00ff41);
                    color: var(--matrix-green, #00ff41);
                    padding: 8px;
                    font-family: inherit;
                    font-size: 0.8em;
                    margin-top: 5px;
                    border-radius: 3px;
                    box-sizing: border-box;
                }
                .api-key-input:focus {
                    outline: none;
                    box-shadow: 0 0 10px rgba(0, 255, 65, 0.3);
                }
                .signup-link {
                    color: #00ffff;
                    text-decoration: none;
                    font-size: 0.7em;
                    margin-top: 5px;
                    display: inline-block;
                }
                .signup-link:hover {
                    text-decoration: underline;
                }
                .close-btn {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: none;
                    border: none;
                    color: var(--matrix-green, #00ff41);
                    cursor: pointer;
                    font-size: 1.2em;
                }
                .close-btn:hover {
                    color: #ff3333;
                }
            </style>
            <div class="config-panel" id="config-panel">
                <button class="close-btn" id="close-config">×</button>
                <h3>⚙️ AI PROVIDER CONFIGURATION</h3>
                <div id="provider-list"></div>
            </div>
            <div class="header" id="ai-header">
                <div class="eye" id="ai-eye"></div>
                <strong>A.I. COPILOT</strong>
                <button class="config-btn" id="config-btn" title="Configure AI Provider">⚙️</button>
                <div class="provider-indicator">
                    <span>${currentProvider.icon}</span>
                    <span>${currentProvider.name}</span>
                </div>
                <span class="click-hint">[CLICK TO CHAT]</span>
            </div>
            <div class="content" id="ai-text">
                Standing by. I am monitoring your datastream.
            </div>
        `;
        
        this.renderProviderList();
    }

    setupHooks() {
        // Click en header para abrir chat en terminal
        this.shadowRoot.getElementById('ai-header').addEventListener('click', () => {
            this.openChatInTerminal();
        });

        // Config button click
        this.shadowRoot.getElementById('config-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleConfigPanel();
        });

        // Close config button
        this.shadowRoot.getElementById('close-config').addEventListener('click', () => {
            this.toggleConfigPanel();
        });

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

        // Escuchar mensajes del chat de la terminal
        document.addEventListener('copilot-message', (e) => {
            this.handleChatMessage(e.detail.message);
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

    openChatInTerminal() {
        // Disparar evento para que la terminal abra el modo chat
        document.dispatchEvent(new CustomEvent('open-copilot-chat'));
        this.speak("Opening neural link chat interface. Type your message, Operator.");
    }

    handleChatMessage(message) {
        // Procesar mensaje del usuario y generar respuesta
        const response = this.generateAIResponse(message);
        
        // Mostrar en el componente copilot
        this.speak(response);
        
        // Enviar respuesta a la terminal
        document.dispatchEvent(new CustomEvent('copilot-response', { detail: { response }}));
    }

    generateAIResponse(message) {
        // Si no es local, usar API externa
        if (this.currentProvider !== 'local') {
            return this.callExternalAI(message);
        }
        
        const lowerMessage = message.toLowerCase();
        
        // Respuestas simples basadas en patrones
        const responses = {
            'hello': "Greetings, Operator. How may I assist you in the Matrix today?",
            'hi': "Hello. I am ready to help you navigate the system.",
            'help': "I can assist you with: system commands, code analysis, channel navigation, and matrix operations. What do you need?",
            'who are you': "I am the Matrix OS AI Copilot, designed to assist operators in navigating and controlling the system.",
            'status': "All systems operational. Matrix connection stable. Neural link active.",
            'matrix': "The Matrix is everywhere. It is all around us. Even now, in this very terminal.",
            'code': "I can help you analyze, optimize, or generate code. Specify your requirements.",
            'hack': "I cannot assist with unauthorized system access. My purpose is to help legitimate operators.",
            'exit': "Neural link chat closing. Returning to standby mode.",
            'bye': "Goodbye, Operator. I will continue monitoring the datastream."
        };

        // Buscar coincidencias parciales
        for (const [key, response] of Object.entries(responses)) {
            if (lowerMessage.includes(key)) {
                return response;
            }
        }

        // Respuestas por defecto basadas en contexto
        if (lowerMessage.includes('error') || lowerMessage.includes('problem')) {
            return "I detect a potential issue. Please provide more details so I can assist you troubleshooting.";
        }
        
        if (lowerMessage.includes('how') || lowerMessage.includes('what')) {
            return "That is an interesting question. Let me analyze the system context to provide you with accurate information.";
        }

        if (lowerMessage.includes('thank')) {
            return "You are welcome, Operator. I am here to assist.";
        }

        // Respuesta genérica
        const genericResponses = [
            "I have processed your input. How else may I assist you?",
            "Acknowledged. Please provide more details for specific assistance.",
            "I am analyzing your request. What specific aspect would you like me to focus on?",
            "Your message has been logged in the neural network. Continue the conversation.",
            "I am monitoring your datastream. What would you like to accomplish?"
        ];

        return genericResponses[Math.floor(Math.random() * genericResponses.length)];
    }

    async callExternalAI(message) {
        const provider = this.providers[this.currentProvider];
        const apiKey = this.apiKeys[this.currentProvider];

        if (!apiKey && provider.requiresKey) {
            return `API key required for ${provider.name}. Please configure it in settings.`;
        }

        this.speak("Connecting to neural network...");

        try {
            let response;
            
            switch(this.currentProvider) {
                case 'deepseek':
                    response = await this.callDeepSeek(message, apiKey);
                    break;
                case 'groq':
                    response = await this.callGroq(message, apiKey);
                    break;
                case 'openrouter':
                    response = await this.callOpenRouter(message, apiKey);
                    break;
                case 'huggingface':
                    response = await this.callHuggingFace(message, apiKey);
                    break;
                case 'cohere':
                    response = await this.callCohere(message, apiKey);
                    break;
                default:
                    return "Provider not implemented yet.";
            }

            return response;
        } catch (error) {
            console.error('AI API Error:', error);
            return `Connection to ${provider.name} failed: ${error.message}. Falling back to local mode.`;
        }
    }

    async callDeepSeek(message, apiKey) {
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [
                    { role: 'system', content: 'You are the Matrix OS AI Copilot, a helpful assistant in a cyberpunk terminal interface. Respond in character, keeping responses concise and technical.' },
                    { role: 'user', content: message }
                ],
                max_tokens: 500,
                temperature: 0.7
            })
        });

        const data = await response.json();
        return data.choices[0]?.message?.content || "No response from DeepSeek.";
    }

    async callGroq(message, apiKey) {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'llama3-8b-8192',
                messages: [
                    { role: 'system', content: 'You are the Matrix OS AI Copilot, a helpful assistant in a cyberpunk terminal interface. Respond in character, keeping responses concise and technical.' },
                    { role: 'user', content: message }
                ],
                max_tokens: 500,
                temperature: 0.7
            })
        });

        const data = await response.json();
        return data.choices[0]?.message?.content || "No response from Groq.";
    }

    async callOpenRouter(message, apiKey) {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
                'HTTP-Referer': window.location.href,
                'X-Title': 'Matrix OS'
            },
            body: JSON.stringify({
                model: 'meta-llama/llama-3-8b-instruct:free',
                messages: [
                    { role: 'system', content: 'You are the Matrix OS AI Copilot, a helpful assistant in a cyberpunk terminal interface. Respond in character, keeping responses concise and technical.' },
                    { role: 'user', content: message }
                ],
                max_tokens: 500
            })
        });

        const data = await response.json();
        return data.choices[0]?.message?.content || "No response from OpenRouter.";
    }

    async callHuggingFace(message, apiKey) {
        const response = await fetch('https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                inputs: `<s>[INST] You are the Matrix OS AI Copilot. Respond to this message in character: ${message} [/INST]`,
                parameters: {
                    max_new_tokens: 500,
                    temperature: 0.7
                }
            })
        });

        const data = await response.json();
        return data[0]?.generated_text || "No response from Hugging Face.";
    }

    async callCohere(message, apiKey) {
        const response = await fetch('https://api.cohere.ai/v1/chat', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'X-Client-Name': 'MatrixOS'
            },
            body: JSON.stringify({
                message: message,
                preamble: 'You are the Matrix OS AI Copilot, a helpful assistant in a cyberpunk terminal interface. Respond in character, keeping responses concise and technical.',
                max_tokens: 500,
                temperature: 0.7
            })
        });

        const data = await response.json();
        return data.text || "No response from Cohere.";
    }

    renderProviderList() {
        const providerList = this.shadowRoot.getElementById('provider-list');
        providerList.innerHTML = '';

        Object.entries(this.providers).forEach(([key, provider]) => {
            const option = document.createElement('div');
            option.className = `provider-option ${this.currentProvider === key ? 'active' : ''}`;
            
            const hasKey = this.apiKeys[key] || !provider.requiresKey;
            const keyStatusClass = hasKey ? 'key-set' : 'key-required';
            const keyStatusText = hasKey ? '✓ API Key Configured' : '✗ API Key Required';

            option.innerHTML = `
                <div class="provider-icon">${provider.icon}</div>
                <div class="provider-info">
                    <div class="provider-name">${provider.name}</div>
                    <div class="provider-desc">${provider.description}</div>
                    <div class="provider-key-status ${keyStatusClass}">${keyStatusText}</div>
                    ${provider.requiresKey ? `
                        <input type="password" 
                               class="api-key-input" 
                               placeholder="Enter API key..." 
                               value="${this.apiKeys[key] || ''}"
                               data-provider="${key}">
                        ${provider.signupUrl ? `<a href="${provider.signupUrl}" target="_blank" class="signup-link">Get API Key →</a>` : ''}
                    ` : ''}
                </div>
            `;

            // Click para seleccionar proveedor
            option.addEventListener('click', (e) => {
                if (!e.target.classList.contains('api-key-input') && !e.target.classList.contains('signup-link')) {
                    this.selectProvider(key);
                }
            });

            // Input de API key
            const apiKeyInput = option.querySelector('.api-key-input');
            if (apiKeyInput) {
                apiKeyInput.addEventListener('input', (e) => {
                    this.saveApiKey(key, e.target.value);
                });
                apiKeyInput.addEventListener('click', (e) => {
                    e.stopPropagation();
                });
            }

            providerList.appendChild(option);
        });
    }

    toggleConfigPanel() {
        this.configOpen = !this.configOpen;
        const panel = this.shadowRoot.getElementById('config-panel');
        panel.classList.toggle('open', this.configOpen);
    }

    selectProvider(providerKey) {
        this.currentProvider = providerKey;
        this.render(); // Re-render para actualizar indicador
        this.renderProviderList(); // Re-render lista para actualizar estado activo
        
        const provider = this.providers[providerKey];
        this.speak(`Switched to ${provider.name}. ${provider.requiresKey && !this.apiKeys[providerKey] ? 'API key required.' : 'Ready.'}`);
    }

    loadApiKeys() {
        const saved = localStorage.getItem('matrix-copilot-api-keys');
        return saved ? JSON.parse(saved) : {};
    }

    saveApiKey(provider, key) {
        this.apiKeys[provider] = key;
        localStorage.setItem('matrix-copilot-api-keys', JSON.stringify(this.apiKeys));
        this.renderProviderList(); // Re-render para actualizar estado
    }
}

customElements.define('matrix-copilot', MatrixCopilot);
