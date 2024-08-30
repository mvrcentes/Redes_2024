const { client, xml } = require('@xmpp/client');

function initializeXmppClient(jid, password) {
    const xmppClient = client({
        service: `ws://${jid.split('@')[1]}:7070/ws/`,
        domain: jid.split('@')[1],
        username: jid.split('@')[0],
        password: password,
    });

    xmppClient.on('online', (address) => {
        console.log(`[ONLINE] Connected as: ${address.toString()}`);
    });

    xmppClient.on('stanza', (stanza) => {
        if (stanza.is('message') && stanza.attrs.type === 'chat') {
            const body = stanza.getChild('body');
            if (body) {
                const messageContent = JSON.parse(body.text());
                console.log(`[MESSAGE RECEIVED] From: ${stanza.attrs.from}`, messageContent);
            }
        }
    });

    xmppClient.on('error', (error) => console.error('[ERROR] XMPP Error:', error));

    xmppClient.start().catch(console.error);

    return xmppClient;
}

module.exports = initializeXmppClient;
