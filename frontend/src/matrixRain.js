export function initMatrixRain(canvas) {
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Caracteres de la matrix (Katakana + Latín + Números)
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ'.split('');

    const fontSize = 16;
    const columns = canvas.width / fontSize;

    // Array para almacenar la coordenada Y de cada gota (columna)
    const drops = [];
    for (let x = 0; x < columns; x++) {
        drops[x] = 1;
    }

    function draw() {
        // Fondo semi-transparente para dar el efecto de rastro
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#0F0'; // Verde Matrix
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < drops.length; i++) {
            // Un caracter aleatorio
            const text = chars[Math.floor(Math.random() * chars.length)];

            // Dibujar el caracter
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            // Reiniciar gota de forma aleatoria al llegar al fondo
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }

            drops[i]++;
        }
    }

    // Animación de 30 FPS para dar esa vibra fluida pero old school
    setInterval(draw, 33);

    // Ajustar resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}
