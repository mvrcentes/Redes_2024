const { client, xml } = require('@xmpp/client');

function createXmppClient(jid, password) {
    const xmppClient = client({
        service: `ws://${jid.split('@')[1]}:7070/ws/`,
        domain: jid.split('@')[1],
        username: jid.split('@')[0],
        password: password,
    });

    xmppClient.on('online', (address) => {
        console.log(`[DEBUG] Conectado como ${address.toString()}`);
    });

    xmppClient.on('stanza', (stanza) => {
        if (stanza.is('message') && stanza.attrs.type === 'chat') {
            const body = stanza.getChild('body');
            if (body) {
                const message = JSON.parse(body.text());
                console.log(`[DEBUG] Mensaje recibido de ${stanza.attrs.from}:`, message);
            }
        }
    });

    xmppClient.on('error', (err) => console.error('[ERROR] XMPP error:', err));

    xmppClient.start().catch(console.error);

    return xmppClient;
}

module.exports = createXmppClient;
