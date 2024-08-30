const { xml } = require('@xmpp/client');

class FloodingAlgorithm {
    constructor(node, xmppClient, neighbors) {
        this.node = node;
        this.xmppClient = xmppClient;
        this.neighbors = neighbors;
        this.seenMessages = new Set();
        this.attemptedRoutes = [];

        this.xmppClient.on('online', async () => {
            console.log(`[ONLINE] Node ${this.node.nodeId} is sending presence.`);
            await this.xmppClient.send(xml('presence'));
        });

        this.xmppClient.on('stanza', this.processIncomingStanza.bind(this));
    }

    processIncomingStanza(stanza) {
        if (stanza.is('message') && stanza.attrs.type === 'chat') {
            const body = stanza.getChild('body');
            if (body) {
                const receivedMessage = JSON.parse(body.text());
                console.log(`[MESSAGE RECEIVED] Node ${this.node.nodeId} received from ${stanza.attrs.from}:`, receivedMessage);
                this.processMessage(receivedMessage, stanza.attrs.from);
            }
        }
    }

    processMessage(message, sender) {
        const messageId = `${message.type}-${message.from}-${message.to}-${message.payload}`;
        if (this.seenMessages.has(messageId)) {
            console.log(`[INFO] Node ${this.node.nodeId} has already seen this message: ${messageId}`);
            return;
        }
        this.seenMessages.add(messageId);

        // Save the attempted route
        this.attemptedRoutes.push({
            from: this.node.jid,
            to: message.to,
            hops: message.hops || 0,
            payload: message.payload,
        });

        if (message.to === this.node.jid) {
            console.log(`[DELIVERED] Message delivered to ${this.node.nodeId}: ${message.payload}`);
            this.logShortestRoute();
        } else {
            console.log(`[FORWARDING] Node ${this.node.nodeId} is forwarding message to neighbors, except ${sender}`);
            this.forwardMessage(message, sender);
        }
    }

    forwardMessage(message, sender) {
        const newMessage = {
            ...message,
            hops: (message.hops || 0) + 1,
        };

        this.neighbors.forEach((neighborJid) => {
            if (neighborJid !== sender) {
                console.log(`[FORWARDING] Node ${this.node.nodeId} is sending message to ${neighborJid}`);
                this.sendXmppMessage(newMessage, neighborJid);
            }
        });
    }

    async sendXmppMessage(message, recipient) {
        const stanza = xml(
            'message',
            { to: recipient, from: this.node.jid, type: 'chat' },
            xml('body', {}, JSON.stringify(message))
        );
        console.log(`[SENDING] Node ${this.node.nodeId} is sending message to ${recipient}`);
        await this.xmppClient.send(stanza);
    }

    sendInitialChatMessage(recipient, content) {
        const message = {
            type: 'message',
            from: this.node.jid,
            to: recipient,
            hops: 0,
            payload: content,
        };

        console.log(`[INITIAL MESSAGE] Node ${this.node.nodeId} is creating and sending initial message to ${recipient}`);
        this.processMessage(message, this.node.jid);
    }

    logShortestRoute() {
        if (this.attemptedRoutes.length > 0) {
            const shortestRoute = this.attemptedRoutes.reduce((best, current) =>
                best.hops <= current.hops ? best : current
            );
            console.log(`[INFO] Shortest route found: ${shortestRoute.from} -> ${shortestRoute.to} [hops: ${shortestRoute.hops}]`);
        }
    }
}

module.exports = FloodingAlgorithm;
