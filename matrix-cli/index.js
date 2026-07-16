#!/usr/bin/env node

const WebSocket = require('ws');
const readline = require('readline');
const chalk = require('chalk');

const WS_URL = process.env.MATRIX_WS_URL || 'ws://localhost:8081';
let ws;
let currentChannel = 'nexus';

console.clear();
console.log(chalk.green('WAKE UP, NEO...'));
setTimeout(() => {
    console.log(chalk.green('INITIATING NATIVE MATRIX OS KERNEL V1.0'));
    connect();
}, 1000);

function connect() {
    ws = new WebSocket(WS_URL);

    ws.on('open', function open() {
        console.log(chalk.green('SECURE CONNECTION TO MOTHERBOARD ESTABLISHED.'));
        startInputLoop();
    });

    ws.on('message', function incoming(data) {
        const msg = JSON.parse(data);
        
        // Limpiamos la línea actual para imprimir el mensaje
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);

        if (msg.type === 'system') {
            console.log(chalk.bold.green(`[SYSTEM] ${msg.message}`));
        } else if (msg.type === 'chat') {
            if (msg.sender === 'SYSTEM_AI') {
                console.log(chalk.bold.magenta(`[${msg.channel}] [${msg.sender}]: ${msg.message}`));
            } else {
                console.log(chalk.cyan(`[${msg.channel}] [${msg.sender}]: ${msg.message}`));
            }
        } else if (msg.type === 'broadcast') {
            console.log(chalk.gray(`[${msg.from}]: ${msg.command}`));
        }
        
        // Volvemos a mostrar el prompt
        promptUser();
    });

    ws.on('close', function close() {
        console.log(chalk.red('\n[!] Connection lost. Operator disconnected.'));
        process.exit(1);
    });
    
    ws.on('error', function error(err) {
        console.log(chalk.red('\n[!] Could not reach the Matrix Motherboard. Check your connection.'));
        process.exit(1);
    });
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: chalk.green.bold('operator@matrix-os:~$ ')
});

function promptUser() {
    rl.setPrompt(chalk.green.bold(`operator@${currentChannel}:~$ `));
    rl.prompt(true);
}

function startInputLoop() {
    promptUser();
    rl.on('line', (line) => {
        const cmd = line.trim();
        if (cmd.toLowerCase() === 'exit') {
            ws.close();
            process.exit(0);
        }
        
        if (cmd) {
            const parts = cmd.split(' ');
            const base = parts[0].toLowerCase();
            
            if (base === 'join' && parts[1]) {
                currentChannel = parts[1];
                console.log(chalk.green(`Switched to channel [${currentChannel}]`));
            } else if (base === 'say') {
                ws.send(JSON.stringify({ 
                    action: 'say',
                    channel: currentChannel,
                    message: parts.slice(1).join(' ')
                }));
            } else if (base === 'create-channel') {
                ws.send(JSON.stringify({
                    action: 'create-channel',
                    name: parts[1] || 'default',
                    is_public: parts[2] !== 'priv',
                    password: parts[3] || null,
                    ai_key: parts[4] || null
                }));
            } else {
                ws.send(JSON.stringify({ action: 'os-cmd', command: cmd }));
            }
        }
        promptUser();
    });
}
