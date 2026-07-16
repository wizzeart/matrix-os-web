import { initMatrixRain } from './matrixRain.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializar la lluvia Matrix en el Canvas de fondo
    initMatrixRain(document.getElementById('matrix-bg'));

    // 2. Lógica de Boot Sequence de la Terminal
    const output = document.getElementById('terminal-output');
    const inputLine = document.getElementById('terminal-input-line');
    const input = document.getElementById('cmd-input');

    const bootSequence = [
        "WAKE UP, NEO...",
        "INITIATING MATRIX OS KERNEL V5.0.2050",
        "LOADING NEURAL DRIVERS........ [OK]",
        "ESTABLISHING SECURE CONNECTION TO THE MOTHERBOARD........ [OK]",
        "CONNECTING...",
        "AUTHENTICATING...",
        "ACCESS GRANTED.",
        "WELCOME BACK, OPERATOR."
    ];

    let delay = 0;
    
    function printLine(text, className = 'system') {
        return new Promise(resolve => {
            setTimeout(() => {
                const el = document.createElement('div');
                el.className = `log-line ${className}`;
                el.textContent = text;
                output.appendChild(el);
                window.scrollTo(0, document.body.scrollHeight);
                
                // Audio effect placeholder
                // playMechanicalKeystrokeSound();

                resolve();
            }, Math.random() * 400 + 200); // Retraso aleatorio simulando carga
        });
    }

    async function startBoot() {
        for (let i = 0; i < bootSequence.length; i++) {
            await printLine(bootSequence[i], i === 0 ? 'system glitch' : 'system');
        }
        
        setTimeout(() => {
            inputLine.style.display = 'flex';
            input.focus();
        }, 500);
    }

    startBoot();

    // 3. Command Handler
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const cmd = input.value.trim();
            if (cmd) {
                // Echo del comando
                const cmdEcho = document.createElement('div');
                cmdEcho.className = 'log-line';
                cmdEcho.innerHTML = `<span class="prompt">operator@matrix-os:~$</span> ${cmd}`;
                output.appendChild(cmdEcho);

                // Procesar comando
                processCommand(cmd);
            }
            input.value = '';
            window.scrollTo(0, document.body.scrollHeight);
        }
    });

    function processCommand(cmd) {
        const parts = cmd.toLowerCase().split(' ');
        const base = parts[0];

        switch(base) {
            case 'help':
                printOutput("Available commands: join, msg, search, open, upload, matrix, binary, who, users, status, history, notifications, clear");
                break;
            case 'clear':
                output.innerHTML = '';
                break;
            case 'join':
                if(parts[1]) {
                    printOutput(`[+] Encrypting connection to channel: ${parts[1]}...`);
                    printOutput(`[+] Connected to node [${parts[1].toUpperCase()}]. 12 operators online.`);
                } else {
                    printOutput("[-] Error: Syntax is 'join <channel>'", "error");
                }
                break;
            case 'matrix':
                if(parts[1] === 'on') {
                    document.getElementById('matrix-bg').style.opacity = '1';
                    printOutput("Matrix visualizer overloaded.");
                } else if(parts[1] === 'off') {
                    document.getElementById('matrix-bg').style.opacity = '0.1';
                    printOutput("Matrix visualizer restored.");
                }
                break;
            case 'who':
                printOutput(`
USER: operator
RANK: Architect Level 7
XP: 45,920
SKILLS: [PHP, WebGL, Cybersecurity, AI]
STATUS: ONLINE
                `);
                break;
            case 'binary':
                printOutput("01001101 01000001 01010100 01010010 01011001 01011000");
                break;
            default:
                printOutput(`[-] Command not found: ${base}. Type 'help' to see available modules.`, "error");
        }
    }

    function printOutput(text, className = '') {
        const el = document.createElement('div');
        el.className = `log-line ${className}`;
        el.textContent = text;
        output.appendChild(el);
    }

    // Mantener focus en input al hacer click en cualquier lado
    document.addEventListener('click', () => {
        input.focus();
    });
});
