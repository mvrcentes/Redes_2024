const fs = require('fs');
const path = require('path');
const readline = require('readline');
const uuid = require('uuid');
const initializeXmppClient = require('./xmppClient');
const FloodingAlgorithm = require('./flooding');
const LinkStateRouting = require('./lsr');

// Ruta de configuración
const configDirectory = path.join(__dirname, '../config');
const namesPath = path.join(configDirectory, 'names_og.txt');
const topologyPath = path.join(configDirectory, 'topo_og.txt');

// Cargar datos de configuración
const namesData = JSON.parse(fs.readFileSync(namesPath, 'utf8'));
const topologyData = JSON.parse(fs.readFileSync(topologyPath, 'utf8'));

// Crear interfaz de readline para solicitar inputs del usuario
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// Función para pedir el JID y la contraseña
async function getUserCredentials() {
    return new Promise((resolve) => {
        rl.question('Enter your JID (user@alumchat.lol): ', (jid) => {
            rl.question('Enter your password: ', (password) => {
                resolve({ jid, password });
            });
        });
    });
}

// Función para mostrar el menú y procesar las opciones
async function showMenu(node, algorithmInstance) {
    console.log('\n--- Menu ---');
    console.log('1. Send a message');
    console.log('2. Show network topology');
    console.log('3. Show routing table');
    console.log('4. Exit');
    
    rl.question('Choose an option: ', async (option) => {
        switch (option) {
            case '1':
                rl.question('Enter recipient JID: ', (recipientJid) => {
                    rl.question('Enter message: ', (message) => {
                        algorithmInstance.forwardMessage({
                            id: uuid.v4(),
                            type: 'chat',
                            from: node.jid,
                            to: recipientJid,
                            payload: message,
                            hops: 0,
                            headers: [],
                        });
                        // console.log(`Message sent to ${recipientJid}`);
                        showMenu(node, algorithmInstance);
                    });
                });
                break;
            case '2':
                console.log('\n--- Network Topology ---');
                console.log(JSON.stringify(topologyData, null, 2));
                showMenu(node, algorithmInstance);
                break;
            case '3':
                console.log('\n--- Routing Table ---');
                console.log(algorithmInstance.routingTable);
                showMenu(node, algorithmInstance);
                break;
            case '4':
                console.log('Exiting...');
                rl.close();
                process.exit(0);
                break;
            default:
                console.log('Invalid option. Please choose again.');
                showMenu(node, algorithmInstance);
                break;
        }
    });
}

// Función principal
async function main() {
    const { jid, password } = await getUserCredentials();
    
    // Asumiendo que el nodeId es la parte local del JID (antes del @)
    const nodeId = Object.keys(namesData.config).find(key => namesData.config[key] === jid);
    
    if (!nodeId) {
        console.error('JID not found in the names configuration file.');
        process.exit(1);
    }

    const neighbors = topologyData.config[nodeId];

    if (!neighbors) {
        console.error('Topology configuration not found for this node.');
        process.exit(1);
    }

    const neighborJids = neighbors.map(neighborId => namesData.config[neighborId]);

    // Calcular los costos para cada vecino
    const costs = {};
    neighbors.forEach((neighborId) => {
        costs[namesData.config[neighborId]] = 1; // Asumiendo que todos los enlaces tienen un costo de 1
    });

    const xmppClient = initializeXmppClient(jid, password);

    // Elegir el algoritmo (Flooding o LSR)
    const algorithm = 'lsr'; // Puedes cambiar a 'flooding' si lo prefieres
    let algorithmInstance;

    if (algorithm === 'lsr') {
        algorithmInstance = new LinkStateRouting({ nodeId, jid }, xmppClient, neighborJids, costs);
    } else {
        algorithmInstance = new FloodingAlgorithm({ nodeId, jid }, xmppClient, neighborJids);
    }

    xmppClient.on('error', err => {
        console.error('Connection error:', err);
        if (xmppClient.status !== 'offline') {
            xmppClient.stop().then(() => {
                console.log('Client stopped, retrying connection...');
                xmppClient.start().catch(err => {
                    console.error('Failed to reconnect:', err);
                    process.exit(1);
                });
            });
        }
    });
    
    xmppClient.on('online', () => {
        console.log(`[ONLINE] Node ${nodeId} is online with JID: ${jid}`);
        console.log(`[NEIGHBORS] Node ${nodeId} neighbors: ${neighborJids.join(', ')}\n`);

        // Esperar a que se complete el cálculo de la tabla de enrutamiento
        setTimeout(() => {
            showMenu({ nodeId, jid }, algorithmInstance);
        }, 5000);  // Esperar 5 segundos antes de mostrar el menú
    });

    xmppClient.on('offline', () => {
        console.log('Client is offline.');
    });
    
    // Intentar conectar solo si el cliente está offline
    if (xmppClient.status === 'offline') {
        xmppClient.start().catch(err => {
            console.error('Failed to connect:', err);
            process.exit(1);
        });
    } else {
        console.error('Client is not offline, cannot start connection.');
    }
}

main();
