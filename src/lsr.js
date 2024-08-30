const { xml } = require('@xmpp/client');
const uuid = require('uuid');
const MinHeap = require("heap");

class LinkStateRouting {
    constructor(node, xmppClient, neighbors, costs) {
        this.node = node;                                   // Identificador del nodo
        this.xmppClient = xmppClient;                       // Cliente XMPP para manejar la comunicación
        this.neighbors = neighbors;                         // Lista de vecinos del nodo
        this.costs = costs;                                 // Costos de los enlaces a los vecinos
        this.routingTable = {};                             // Tabla de enrutamiento
        this.linkStateDB = { [this.node.jid]: this.costs }; // Base de datos de estado de enlace
        this.receivedMessages = new Set();                  // Conjunto de mensajes recibidos para evitar procesar duplicados
        this.sequenceNumber = 0;                            // Número de secuencia para los mensajes de estado de enlace

        // Event listener para cuando el nodo se conecta
        this.xmppClient.on('online', async () => {
            console.log(`[DEBUG] Nodo ${this.node.nodeId} enviando presencia.`);
            await this.xmppClient.send(xml('presence')); // Enviar presencia al conectarse
            await this.shareLinkState(); // Compartir el estado de enlace con los vecinos
        });

        // Event listener para manejar mensajes recibidos
        this.xmppClient.on('stanza', this.handleStanza.bind(this));
    }

    // Manejar mensajes recibidos (stanza)
    handleStanza(stanza) {
        if (stanza.is('message') && stanza.attrs.type === 'chat') {
            const body = stanza.getChild('body');
            if (body) {
                const message = JSON.parse(body.text()); // Parsear el mensaje
                console.log(`[DEBUG] Nodo ${this.node.nodeId} recibió un mensaje de ${stanza.attrs.from}:`, message);
                this.handleMessage(message, stanza.attrs.from); // Procesar el mensaje
            }
        }
    }

    // Procesar el mensaje recibido
    handleMessage(message, from) {
        if (message.type === 'info') {
            this.floodMessage(message, from); // Propagar el mensaje de estado de enlace a los vecinos
        } else if (message.to === this.node.jid) {
            console.log(`[DEBUG] Mensaje entregado a ${this.node.nodeId}: ${message.payload}`); // Mensaje entregado al destinatario final
        } else {
            console.log(`[DEBUG] Nodo ${this.node.nodeId} reenviando mensaje al siguiente salto`);
            this.forwardMessage(message); // Reenviar el mensaje al siguiente salto
        }
    }

    // Compartir el estado de enlace con los vecinos
    async shareLinkState() {
        this.sequenceNumber += 1; // Incrementar el número de secuencia

        const message = {
            id: uuid.v4(), // Generar un ID único para el mensaje
            type: 'info',
            from: this.node.jid,
            to: 'all',
            hops: 0,
            headers: [],
            payload: JSON.stringify(this.costs), // Incluir los costos de los enlaces en el mensaje
        };

        for (const neighbor of this.neighbors) {
            console.log(`[DEBUG] Nodo ${this.node.nodeId} enviando estado de enlace a ${neighbor}`);
            await this.sendMessage(message, neighbor); // Enviar el mensaje a cada vecino
        }
    }

    // Propagar el mensaje de estado de enlace a los vecinos
    floodMessage(message, from) {
        if (this.receivedMessages.has(message.id)) {
            console.log(`[DEBUG] Nodo ${this.node.nodeId} ya ha procesado el mensaje: ${message.id}`);
            return; // Ignorar si el mensaje ya fue procesado
        }
        this.receivedMessages.add(message.id); // Marcar el mensaje como procesado

        const costs = JSON.parse(message.payload);
        this.updateLinkStateDB(message.from, costs); // Actualizar la base de datos de estado de enlace

        for (const neighbor of this.neighbors) {
            if (neighbor !== from) {
                console.log(`[DEBUG] Nodo ${this.node.nodeId} reenviando estado de enlace a ${neighbor}`);
                this.sendMessage(message, neighbor); // Reenviar el mensaje a los vecinos
            }
        }

        this.computeRoutingTable(); // Recalcular la tabla de enrutamiento
    }

    // Actualizar la base de datos de estado de enlace
    updateLinkStateDB(sourceJid, costs) {
        this.linkStateDB[sourceJid] = costs; // Actualizar los costos para el nodo fuente
        console.log(`[INFO] Nodo ${this.node.nodeId} actualizó su base de datos de estado de enlace para ${sourceJid}`);
    }

    // Enviar un mensaje a un destinatario específico
    async sendMessage(message, recipient) {
        const stanza = xml(
            'message',
            { to: recipient, from: this.node.jid, type: 'chat' },
            xml('body', {}, JSON.stringify(message)) // Incluir el mensaje en el cuerpo del chat
        );
        console.log(`[DEBUG] Nodo ${this.node.nodeId} enviando un mensaje a ${recipient}`);
        await this.xmppClient.send(stanza); // Enviar el mensaje a través del cliente XMPP
    }

    // Calcular la tabla de enrutamiento usando el algoritmo de Dijkstra
    computeRoutingTable() {
        console.log(`[DEBUG] Nodo ${this.node.nodeId} computando su tabla de enrutamiento...`);
        this.routingTable = {};

        const distances = {};
        const previous = {};
        const nodes = new MinHeap((a, b) => distances[a] - distances[b]); // Min-Heap para seleccionar el nodo con la menor distancia

        // Inicializar distancias
        for (const node in this.linkStateDB) {
            distances[node] = node === this.node.jid ? 0 : Infinity; // Distancia a sí mismo es 0, a otros nodos es infinito
            previous[node] = null;
            nodes.push(node); // Añadir el nodo al heap
        }

        while (!nodes.empty()) {
            const minNode = nodes.pop(); // Extraer el nodo con la menor distancia

            // Actualizar distancias a los vecinos
            const neighbors = this.linkStateDB[minNode] || {};
            for (const neighbor in neighbors) {
                const alt = distances[minNode] + neighbors[neighbor];
                if (alt < distances[neighbor]) {
                    distances[neighbor] = alt; // Actualizar la distancia si se encuentra un camino más corto
                    previous[neighbor] = minNode;
                    nodes.push(neighbor); // Reinsertar el vecino con la nueva distancia
                }
            }
        }

        // Construir la tabla de enrutamiento
        for (const node in distances) {
            if (node !== this.node.jid) {
                let path = [];
                let current = node;
                while (current !== null) {
                    path.unshift(current); // Construir el camino desde el nodo destino hacia atrás
                    current = previous[current];
                }
                if (path.length > 1) {
                    this.routingTable[node] = [path[1], distances[node]]; // Establecer el siguiente salto y la distancia
                }
            }
        }
        console.log(`[DEBUG] Nodo ${this.node.nodeId} terminó de computar su tabla de enrutamiento.`);
    }

    // Reenviar un mensaje al siguiente salto
    forwardMessage(message) {
        const nextHop = this.getNextHop(message.to);
        if (nextHop) {
            message.hops += 1;
            message.headers.push({ via: this.node.jid });
            this.sendMessage(message, nextHop); // Enviar el mensaje al siguiente nodo en la ruta
        } else {
            console.log(`[ERROR] Nodo ${this.node.nodeId} no tiene ruta a ${message.to}`);
        }
    }

    // Obtener el siguiente salto en la ruta hacia el destino
    getNextHop(destination) {
        const route = this.routingTable[destination];
        return route ? route[0] : null; // Devolver el siguiente nodo en la ruta o null si no existe
    }
}

module.exports = LinkStateRouting;
