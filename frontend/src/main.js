import { initMatrixRain } from './matrixRain.js';
import { MatrixOS } from './Core/OS.js';
import { WebsocketClient } from './Core/WebsocketClient.js';
import { WebGLEngine } from './Graphics/Shaders.js';
import './Components/matrix-copilot.js';
import './Components/matrix-constellation.js';
import './Components/ephemeral-lab.js';
import './Components/code-nexus.js';

// Registrar Service Worker para caché offline
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration.scope);
            })
            .catch(err => {
                console.log('SW registration failed: ', err);
            });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializar la lluvia Matrix en el Canvas
    initMatrixRain(document.getElementById('matrix-bg'));

    // 2. Limpiar el HTML (ahora usamos Web Components)
    const osContainer = document.getElementById('os-container');
    osContainer.innerHTML = ''; 

    // 3. Iniciar el OS y el Window Manager
    const os = new MatrixOS();
    os.init();

    // 4. Iniciar Neural Link (WebSockets)
    const ws = new WebsocketClient('ws://localhost:8081');
    ws.connect();
    
    // 5. Iniciar Motor Gráfico WebGL
    const webgl = new WebGLEngine(document.getElementById('matrix-bg'));
    webgl.init();

    // 6. Instanciar la IA Copiloto en el OS
    const copilot = document.createElement('matrix-copilot');
    document.body.appendChild(copilot);

    // Integración opcional: cuando una terminal dispara un comando, enviarlo por WS
    document.addEventListener('terminal-command', (e) => {
        if (e.detail.action && e.detail.action !== 'os-cmd') {
            ws.send(e.detail);
        } else if (e.detail.tokens) {
            ws.send(e.detail.tokens.join(' '));
            
            // Reacción visual extra para ciertos comandos
            if (e.detail.tokens[0] === 'hack') {
                webgl.applyGlitchEffect();
            }
        }
    });
});
