python3 main.py \
    --jid ram21032@alumchat.lol \
    --password ram21032 \
    --name Node1 \
    --neighbors ram21032-test@alumchat.lol,1 cen21032@alumchat.lol,1 \
    --dest cen21032@alumchat.lol \
    --payload "Hola, este es un mensaje de Flooding desde Node1"


python3 main.py \
    --jid ram21032-test@alumchat.lol \
    --password ram21032 \
    --name Node2 \
    --neighbors ram21032@alumchat.lol,1 cen21032@alumchat.lol,1


python3 main.py \
    --jid cen21032@alumchat.lol \
    --password cen21032 \
    --name Node3 \
    --neighbors ram21032@alumchat.lol,1 ram21032-test@alumchat.lol,1


 python main.py --jid ram21032@alumchat.lol/resource1 --password ram21032 --name A --topo topo1-x-random-test.json --names names1-x-random-test.json --payload "Hello, this is a test message"

 python main.py --jid ram21032-test@alumchat.lol/resource1 --password ram21032 --name A --topo topo1-x-random-test.json --names names1-x-random-test.json --payload "Hello, this is a test message"

python main.py --jid cen21032@alumchat.lol/resource1 --password cen21032 --name A --topo topo1-x-random-test.json --names names1-x-random-test.json --payload "Hello, this is a test message"