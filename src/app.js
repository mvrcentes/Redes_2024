const fs = require('fs');
const path = require('path');
const createXmppClient = require('./xmppClient');
const Flooding = require('./flooding');

// Variables de configuración
const configDirectory = path.join(__dirname, '../config');
const nodeConfigs = [
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
const topoPath = path.join(configDirectory, 'topo.txt');

// Configuración para elegir el nodo remitente y destinatario
const senderNodeId = 'I';
const recipientJID = 'jm1@alumchat.lol';

const namesData = JSON.parse(fs.readFileSync(namesPath, 'utf8'));
const topoData = JSON.parse(fs.readFileSync(topoPath, 'utf8'));

// Inicializar nodos
const nodes = {};

nodeConfigs.forEach(({ nodeId, password }) => {
    const nodeJID = namesData.config[nodeId];
    const neighbors = topoData.config[nodeId].map(neighborId => namesData.config[neighborId]);

    const xmppClient = createXmppClient(nodeJID, password);
    const flooding = new Flooding({ nodeId, jid: nodeJID }, xmppClient, neighbors);
    nodes[nodeId] = flooding;

    xmppClient.on('online', () => {
        console.log(`[DEBUG] Nodo ${nodeId} está online con JID: ${nodeJID}`);
        console.log(`[INFO] Vecinos de Nodo ${nodeId}: ${neighbors.join(', ')}\n`);
        if (nodeId === senderNodeId) {
            console.log(`[DEBUG] Nodo ${nodeId} enviando mensaje inicial a ${recipientJID}...`);
            flooding.sendChatMessage(recipientJID, `Hello from Node ${senderNodeId} to ${recipientJID.split('@')[0]}!`);
        }
    });
});
