export class MatrixOS {
    constructor() {
        this.windows = [];
        this.desktop = document.getElementById('os-container');
    }

    init() {
        console.log("[Matrix OS] Kernel Initialized");
        
        // Registrar componentes si no lo están ya
        if (!customElements.get('matrix-window')) {
            import('../Components/matrix-window.js');
        }
        if (!customElements.get('matrix-terminal')) {
            import('../Components/matrix-terminal.js');
        }

        // Crear la terminal maestra (Fondo)
        const masterTerminal = document.createElement('matrix-terminal');
        this.desktop.appendChild(masterTerminal);

        // Escuchar comandos globales
        masterTerminal.addEventListener('terminal-command', (e) => {
            this.handleGlobalCommand(e.detail.tokens);
        });

        // Escuchar despliegues desde mapas espaciales
        document.addEventListener('deploy-lab', (e) => {
            const node = e.detail.node;
            this.createWindow(`LAB: ${node.label}`, `<ephemeral-lab target="${node.label}"></ephemeral-lab>`, '600px', '400px');
        });
    }

    handleGlobalCommand(tokens) {
        const cmd = tokens[0].toLowerCase();
        
        if (cmd === 'open') {
            const target = tokens[1] || 'unknown';
            this.createWindow(`VIEW: ${target.toUpperCase()}`, `<p>Loading module ${target}...</p>`);
        }
        
        if (cmd === 'join') {
            const channel = tokens[1];
            if(channel) {
                this.createWindow(`CHANNEL [${channel.toUpperCase()}]`, `<matrix-terminal></matrix-terminal>`);
            }
        }

        if (cmd === 'map' || cmd === 'constellation') {
            this.createWindow(`SPATIAL NAV`, `<matrix-constellation></matrix-constellation>`, '500px', '400px');
        }

        if (cmd === 'post-code') {
            const defaultCode = `<?php\n\nclass CyberMatrix {\n  public function hack() {\n    echo "Firewall breached!";\n  }\n}\n`;
            this.createWindow(`CODE NEXUS`, `<code-nexus lang="php">${defaultCode}</code-nexus>`, '600px', '400px');
        }

        if (cmd === 'switch-shell') {
            const role = tokens[1] || 'dev';
            if (role === 'security') {
                document.documentElement.style.setProperty('--matrix-green', '#ff003c');
                document.documentElement.style.setProperty('--matrix-dark-green', '#8a0020');
                this.createWindow(`SYSTEM`, `<p style="color:#ff003c">Switched to Security Shell (Red Team)</p>`, '300px', '200px');
            } else {
                document.documentElement.style.setProperty('--matrix-green', '#00ff41');
                document.documentElement.style.setProperty('--matrix-dark-green', '#008f11');
                this.createWindow(`SYSTEM`, `<p>Switched to Developer Shell</p>`, '300px', '200px');
            }
        }
    }

    createWindow(title, contentHTML, width = '400px', height = '300px') {
        const win = document.createElement('matrix-window');
        win.setAttribute('title', title);
        win.setAttribute('width', width);
        win.setAttribute('height', height);
        
        // Offset aleatorio para que no caigan exactamente encima
        const offset = (this.windows.length * 20) + 50;
        win.setAttribute('x', `${offset}px`);
        win.setAttribute('y', `${offset}px`);
        
        win.innerHTML = contentHTML;
        this.desktop.appendChild(win);
        this.windows.push(win);
    }
}
