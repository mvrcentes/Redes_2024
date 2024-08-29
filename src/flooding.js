const { xml } = require('@xmpp/client');

class Flooding {
    constructor(node, xmppClient, neighbors) {
        this.node = node;
        this.xmppClient = xmppClient;
        this.neighbors = neighbors;
        this.messagesSeen = new Set();
        this.routesTried = [];

        this.xmppClient.on('online', async () => {
            console.log(`[DEBUG] Nodo ${this.node.nodeId} enviando presencia.`);
            await this.xmppClient.send(xml('presence'));
        });

        this.xmppClient.on('stanza', this.handleStanza.bind(this));
    }

    handleStanza(stanza) {
        if (stanza.is('message') && stanza.attrs.type === 'chat') {
            const body = stanza.getChild('body');
            if (body) {
                const message = JSON.parse(body.text());
                console.log(`[DEBUG] Nodo ${this.node.nodeId} recibió mensaje de ${stanza.attrs.from}:`, message);
                this.handleMessage(message, stanza.attrs.from);
            }
        }
    }

    handleMessage(message, from) {
        const messageId = `${message.type}-${message.from}-${message.to}-${message.payload}`;
        if (this.messagesSeen.has(messageId)) {
            console.log(`[DEBUG] Nodo ${this.node.nodeId} ya ha visto este mensaje: ${messageId}`);
            return;
        }
        this.messagesSeen.add(messageId);

        // Guardar la ruta probada
        this.routesTried.push({
            from: this.node.jid,
            to: message.to,
            hops: message.hops || 0,
            payload: message.payload,
        });

        if (message.to === this.node.jid) {
            console.log(`[DEBUG] Mensaje entregado a ${this.node.nodeId}: ${message.payload}`);
            this.printBestRoute();
        } else {
            console.log(`[DEBUG] Nodo ${this.node.nodeId} reenviando mensaje a sus vecinos, excepto ${from}`);
            this.floodMessage(message, from);
        }
    }

    floodMessage(message, from) {
        const forwardedMessage = {
            ...message,
            hops: (message.hops || 0) + 1,
        };

        this.neighbors.forEach((neighborJid) => {
            if (neighborJid !== from) {
                console.log(`[DEBUG] Nodo ${this.node.nodeId} reenviando mensaje a ${neighborJid}`);
                this.sendMessage(forwardedMessage, neighborJid);
            }
        });
    }

    async sendMessage(message, recipient) {
        const stanza = xml(
            'message',
            { to: recipient, from: this.node.jid, type: 'chat' },
            xml('body', {}, JSON.stringify(message))
        );
        console.log(`[DEBUG] Nodo ${this.node.nodeId} enviando mensaje a ${recipient}`);
        await this.xmppClient.send(stanza);
    }

    sendChatMessage(to, payload) {
        const message = {
            type: 'message',
            from: this.node.jid,
            to: to,
            hops: 0,
            payload: payload,
        };

        console.log(`[DEBUG] Nodo ${this.node.nodeId} creando y enviando mensaje a ${to}`);
        this.handleMessage(message, this.node.jid);
    }

    printBestRoute() {
        if (this.routesTried.length > 0) {
            const bestRoute = this.routesTried.reduce((best, current) => 
                best.hops <= current.hops ? best : current
            );
            console.log(`[INFO] Ruta más corta encontrada: ${bestRoute.from} -> ${bestRoute.to} [hops: ${bestRoute.hops}]`);
        }
    }
}

module.exports = Flooding;
