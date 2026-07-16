// Web Worker para tareas intensivas (Data parsing, ASCII transformation)

self.addEventListener('message', function(e) {
    const { action, payload } = e.data;

    switch(action) {
        case 'PARSE_COMMAND':
            // Simular un parseo complejo de sintaxis para el copiloto
            const result = processHeavyCommand(payload);
            self.postMessage({ action: 'COMMAND_PARSED', result });
            break;
            
        case 'CONVERT_TO_HEX':
            const hex = stringToHex(payload);
            self.postMessage({ action: 'HEX_CONVERTED', result: hex });
            break;
    }
});

function processHeavyCommand(command) {
    // Aquí iría el lexer/parser avanzado
    // Por ahora simulamos retardo
    let i = 0; while(i < 1000000) i++; 
    return { cmd: command, valid: true, tokens: command.split(' ') };
}

function stringToHex(str) {
    let hex = '';
    for(let i=0; i<str.length; i++) {
        hex += '' + str.charCodeAt(i).toString(16);
    }
    return hex;
}
