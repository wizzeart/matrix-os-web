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
            </style>
            <div class="header" id="ai-header">
                <div class="eye" id="ai-eye"></div>
                <strong>A.I. COPILOT</strong>
                <span class="click-hint">[CLICK TO CHAT]</span>
            </div>
            <div class="content" id="ai-text">
                Standing by. I am monitoring your datastream.
            </div>
        `;
    }

    setupHooks() {
        // Click en header para abrir chat en terminal
        this.shadowRoot.getElementById('ai-header').addEventListener('click', () => {
            this.openChatInTerminal();
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
}

customElements.define('matrix-copilot', MatrixCopilot);
