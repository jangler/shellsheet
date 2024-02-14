import { render } from "preact";

type LogLevel = 'info' | 'error';

type Message = {
    level: LogLevel,
    text: string,
    expires: number,
}

// Time in milliseconds it takes a message to be removed.
const ttl = 5000;

let messages: Message[] = [];

export function renderMessages() {
    render(<>
        {messages.map(msg => (
            <li class={msg.level}>{msg.text}</li>
        ))}
    </>, document.getElementById('messages'));
}

function checkExpiry() {
    const now = Date.now();
    messages = messages.filter(m => m.expires > now);
    renderMessages();
}

function pushMessage(level: LogLevel, text: string) {
    messages.push({
        level: level,
        text: text,
        expires: Date.now() + ttl,
    });
    renderMessages();
    setTimeout(checkExpiry, ttl);
}

export function info(text: string) {
    pushMessage('info', text);
}

export function error(text: string) {
    pushMessage('error', text);
}