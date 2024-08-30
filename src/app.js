const fs = require('fs');
const path = require('path');
const initializeXmppClient = require('./xmppClient');
const FloodingAlgorithm = require('./flooding');

// Configuration variables
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

// Configure sender and recipient nodes
const senderNodeId = 'I';
const recipientJid = 'jm1@alumchat.lol';

const namesData = JSON.parse(fs.readFileSync(namesPath, 'utf8'));
const topologyData = JSON.parse(fs.readFileSync(topologyPath, 'utf8'));

// Initialize nodes
const nodes = {};

nodeConfigurations.forEach(({ nodeId, password }) => {
    const nodeJid = namesData.config[nodeId];
    const neighbors = topologyData.config[nodeId].map(neighborId => namesData.config[neighborId]);

    const xmppClient = initializeXmppClient(nodeJid, password);
    const floodingAlgorithm = new FloodingAlgorithm({ nodeId, jid: nodeJid }, xmppClient, neighbors);
    nodes[nodeId] = floodingAlgorithm;

    xmppClient.on('online', () => {
        console.log(`[ONLINE] Node ${nodeId} is online with JID: ${nodeJid}`);
        console.log(`[NEIGHBORS] Node ${nodeId} neighbors: ${neighbors.join(', ')}\n`);
        if (nodeId === senderNodeId) {
            console.log(`[INITIAL MESSAGE] Node ${nodeId} is sending initial message to ${recipientJid}...`);
            floodingAlgorithm.sendInitialChatMessage(recipientJid, `Hello from Node ${senderNodeId} to ${recipientJid.split('@')[0]}!`);
        }
    });
});
