const fs = require('fs');
const path = require('path');
const initializeXmppClient = require('./xmppClient');
const FloodingAlgorithm = require('./flooding');
const LinkStateRouting = require('./lsr');

// Variables de configuración
const configDirectory = path.join(__dirname, '../config');
const nodeConfigurations = [
    { nodeId: 'A', password: 'jm1' },
    { nodeId: 'B', password: 'jm2' },
    { nodeId: 'C', password: 'jm3' },
    { nodeId: 'D', password: 'jm4' },
    { nodeId: 'E', password: 'jm5' },
    { nodeId: 'F', password: 'jm6' },
    { nodeId: 'G', password: 'jm7' },
    { nodeId: 'H', password: 'jm8' },
    { nodeId: 'I', password: 'jm9' },
];

const namesPath = path.join(configDirectory, 'names.txt');
const topologyPath = path.join(configDirectory, 'topo.txt');

// Configurar nodo emisor y receptor
const senderNodeId = 'I';
const recipientJid = 'jm1@alumchat.lol';

// Seleccionar algoritmo
const algorithm = 'lsr'; // flooding/lsr

const namesData = JSON.parse(fs.readFileSync(namesPath, 'utf8'));
const topologyData = JSON.parse(fs.readFileSync(topologyPath, 'utf8'));

// Inicializar nodos
const nodes = {};

nodeConfigurations.forEach(({ nodeId, password }) => {
    const nodeJid = namesData.config[nodeId];
    const neighbors = topologyData.config[nodeId].map(neighborId => namesData.config[neighborId]);

    // Calcular los costos para cada vecino
    const costs = {};
    topologyData.config[nodeId].forEach((neighborId) => {
        costs[namesData.config[neighborId]] = 1; // Asumiendo que todos los enlaces tienen un costo de 1
    });

    const xmppClient = initializeXmppClient(nodeJid, password);
    let algorithmInstance;

    // Instanciar el algoritmo a utilizar
    if (algorithm === 'lsr') {
        algorithmInstance = new LinkStateRouting({ nodeId, jid: nodeJid }, xmppClient, neighbors, costs);
    } else {
        algorithmInstance = new FloodingAlgorithm({ nodeId, jid: nodeJid }, xmppClient, neighbors);
    }

    nodes[nodeId] = algorithmInstance;

    xmppClient.on('online', () => {
        console.log(`[ONLINE] Node ${nodeId} is online with JID: ${nodeJid}`);
        console.log(`[NEIGHBORS] Node ${nodeId} neighbors: ${neighbors.join(', ')}\n`);
        if (nodeId === senderNodeId) {
            console.log(`[INITIAL MESSAGE] Node ${nodeId} is sending initial message to ${recipientJid}...`);
            if (algorithm === 'lsr') {
                algorithmInstance.forwardMessage({
                    id: uuid.v4(),
                    type: 'chat',
                    from: nodeJid,
                    to: recipientJid,
                    payload: `Hello from Node ${senderNodeId} to ${recipientJid.split('@')[0]}!`,
                    hops: 0,
                    headers: [],
                });
            } else {
                algorithmInstance.sendInitialChatMessage(recipientJid, `Hello from Node ${senderNodeId} to ${recipientJid.split('@')[0]}!`);
            }
        }
    });
});
