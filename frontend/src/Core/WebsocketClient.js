export class WebsocketClient {
    constructor(url = 'ws://localhost:8081') {
        this.url = url;
        this.socket = null;
    }

    connect() {
        this.socket = new WebSocket(this.url);

        this.socket.onopen = () => {
            console.log("[Neural Link] Connection Established.");
        };

        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("[Neural Link] Broadcast Received:", data);
            
            // Dispatch a custom event to the document so terminals can pick it up
            document.dispatchEvent(new CustomEvent('neural-link-message', { detail: data }));
        };

        this.socket.onclose = () => {
            console.log("[Neural Link] Connection Lost. Reconnecting in 5s...");
            setTimeout(() => this.connect(), 5000);
        };
        
        this.socket.onerror = (err) => {
            console.error("[Neural Link] Error:", err);
        };
    }

    send(payload) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            if (typeof payload === 'string') {
                this.socket.send(JSON.stringify({ action: 'broadcast', command: payload }));
            } else {
                this.socket.send(JSON.stringify(payload));
            }
        }
    }
}
