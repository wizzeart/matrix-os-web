export class MatrixConstellation extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.nodes = [];
        this.edges = [];
    }

    connectedCallback() {
        this.render();
        this.canvas = this.shadowRoot.getElementById('star-map');
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        this.animate = this.animate.bind(this);
        this.animate();
        this.setupInteractivity();
        
        // Solicitar canales al conectarse
        document.dispatchEvent(new CustomEvent('terminal-command', { detail: { action: 'get-channels' }}));
        
        document.addEventListener('neural-link-message', (e) => {
            const data = e.detail;
            if (data.type === 'channel-list') {
                this.updateNodesFromDB(data.channels);
            }
        });
    }

    updateNodesFromDB(channels) {
        this.nodes = [];
        this.edges = [];
        const w = this.offsetWidth || 500;
        const h = this.offsetHeight || 400;

        channels.forEach((ch, idx) => {
            // Random position in the map
            const ox = 50 + Math.random() * (w - 100);
            const oy = 50 + Math.random() * (h - 100);
            
            this.nodes.push({
                id: ch.name,
                originX: ox, originY: oy, x: ox, y: oy,
                radius: ch.password_hash ? 8 : (ch.ai_linked ? 12 : 10),
                label: '#' + ch.name.toUpperCase(),
                phase: Math.random()*10,
                isProtected: !!ch.password_hash,
                isAI: !!ch.ai_linked
            });
            
            if (idx > 0) {
                // Link randomly to a previous node
                const prev = Math.floor(Math.random() * idx);
                this.edges.push({ from: channels[prev].name, to: ch.name });
            }
        });
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 5, 0, 0.95);
                    position: relative;
                }
                canvas {
                    display: block;
                    width: 100%;
                    height: 100%;
                    cursor: crosshair;
                }
                .tooltip {
                    position: absolute;
                    background: rgba(0, 255, 65, 0.2);
                    border: 1px solid #00ff41;
                    color: #00ff41;
                    padding: 5px;
                    font-family: monospace;
                    pointer-events: none;
                    display: none;
                    box-shadow: 0 0 10px rgba(0, 255, 65, 0.5);
                }
            </style>
            <canvas id="star-map"></canvas>
            <div id="tooltip" class="tooltip"></div>
        `;
    }

    resize() {
        this.canvas.width = this.offsetWidth || 500;
        this.canvas.height = this.offsetHeight || 400;
    }

    animate() {
        // Update physics
        const time = Date.now() * 0.001;
        this.nodes.forEach(node => {
            node.x = node.originX + Math.sin(time + node.phase) * 5;
            node.y = node.originY + Math.cos(time + node.phase * 0.5) * 5;
        });
        
        this.drawMap();
        requestAnimationFrame(this.animate);
    }

    drawMap() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw edges
        this.ctx.strokeStyle = 'rgba(0, 255, 65, 0.3)';
        this.ctx.lineWidth = 1;
        this.edges.forEach(edge => {
            const from = this.nodes.find(n => n.id === edge.from);
            const to = this.nodes.find(n => n.id === edge.to);
            if(from && to) {
                this.ctx.beginPath();
                this.ctx.moveTo(from.x, from.y);
                this.ctx.lineTo(to.x, to.y);
                this.ctx.stroke();
            }
        });

        // Nodos
        this.nodes.forEach(node => {
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            
            if (node.isAI) {
                this.ctx.fillStyle = '#ff00ff'; // Magenta for AI
                this.ctx.shadowColor = '#ff00ff';
            } else if (node.isProtected) {
                this.ctx.fillStyle = '#ff8800'; // Orange for protected
                this.ctx.shadowColor = '#ff8800';
            } else {
                this.ctx.fillStyle = '#00ff41'; // Green for normal
                this.ctx.shadowColor = '#00ff41';
            }
            
            this.ctx.shadowBlur = 10;
            this.ctx.fill();

            // Etiqueta
            this.ctx.fillStyle = '#fff';
            this.ctx.shadowBlur = 0;
            this.ctx.font = '10px monospace';
            this.ctx.fillText(node.label, node.x + node.radius + 5, node.y + 3);
        });
    }

    setupInteractivity() {
        const tooltip = this.shadowRoot.getElementById('tooltip');

        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            let hovered = false;
            this.nodes.forEach(node => {
                const dist = Math.hypot(node.x - mouseX, node.y - mouseY);
                if (dist < node.radius * 2) {
                    hovered = true;
                    tooltip.style.display = 'block';
                    tooltip.style.left = `${mouseX + 15}px`;
                    tooltip.style.top = `${mouseY + 15}px`;
                    tooltip.innerHTML = `TARGET: ${node.label}<br>OP_COUNT: ${Math.floor(Math.random()*100)}<br>CLICK TO DEPLOY LAB`;
                    this.canvas.style.cursor = 'pointer';
                }
            });

            if (!hovered) {
                tooltip.style.display = 'none';
                this.canvas.style.cursor = 'crosshair';
            }
        });

        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            this.nodes.forEach(node => {
                const dist = Math.hypot(node.x - mouseX, node.y - mouseY);
                if (dist < node.radius * 2) {
                    // Emit event to open Ephemeral Lab
                    this.dispatchEvent(new CustomEvent('deploy-lab', {
                        detail: { node: node },
                        bubbles: true,
                        composed: true
                    }));
                }
            });
        });
    }
}

customElements.define('matrix-constellation', MatrixConstellation);
