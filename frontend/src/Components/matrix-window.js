export class MatrixWindow extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.isDragging = false;
        this.offsetX = 0;
        this.offsetY = 0;
    }

    connectedCallback() {
        const title = this.getAttribute('title') || 'UNTITLED';
        const width = this.getAttribute('width') || '400px';
        const height = this.getAttribute('height') || '300px';
        const x = this.getAttribute('x') || '50px';
        const y = this.getAttribute('y') || '50px';

        this.render(title, width, height, x, y);
        this.setupDrag();
    }

    render(title, width, height, x, y) {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    position: absolute;
                    left: ${x};
                    top: ${y};
                    width: ${width};
                    height: ${height};
                    background: rgba(3, 3, 3, 0.85);
                    border: 1px solid var(--matrix-dark-green, #008f11);
                    box-shadow: 0 0 15px rgba(0, 255, 65, 0.2);
                    display: flex;
                    flex-direction: column;
                    z-index: 100;
                    backdrop-filter: blur(5px);
                }
                .title-bar {
                    background: var(--matrix-dark-green, #008f11);
                    color: #000;
                    padding: 5px 10px;
                    font-weight: bold;
                    display: flex;
                    justify-content: space-between;
                    user-select: none;
                    cursor: move;
                }
                .controls span {
                    cursor: pointer;
                    margin-left: 10px;
                }
                .controls span:hover { color: #fff; }
                .content {
                    flex: 1;
                    padding: 10px;
                    overflow: auto;
                    color: var(--matrix-green, #00ff41);
                }
            </style>
            <div class="title-bar">
                <span class="title">[${title}]</span>
                <div class="controls">
                    <span class="close">X</span>
                </div>
            </div>
            <div class="content">
                <slot></slot>
            </div>
        `;
    }

    setupDrag() {
        const titleBar = this.shadowRoot.querySelector('.title-bar');
        const closeBtn = this.shadowRoot.querySelector('.close');

        closeBtn.addEventListener('click', () => {
            this.remove();
        });

        titleBar.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.offsetX = e.clientX - this.getBoundingClientRect().left;
            this.offsetY = e.clientY - this.getBoundingClientRect().top;
            
            // Bring to front logic could go here by communicating with OS.js
            this.style.zIndex = parseInt(this.style.zIndex || 100) + 1;
        });

        window.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                this.style.left = `${e.clientX - this.offsetX}px`;
                this.style.top = `${e.clientY - this.offsetY}px`;
            }
        });

        window.addEventListener('mouseup', () => {
            this.isDragging = false;
        });
    }
}

customElements.define('matrix-window', MatrixWindow);
