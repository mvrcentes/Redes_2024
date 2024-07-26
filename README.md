# Redes_2024

$ docker run -d \
    --name some_tigase \
    -v /home/tigase/etc/:/home/tigase/tigase-server/etc/ \
    -v /home/tigase/certs/:/home/tigase/tigase-server/certs/ \
    -v /home/tigase/data/:/home/tigase/tigase-server/data/ \
    -e 'DB_ROOT_USER=root' \
    -e 'DB_ROOT_PASS=root-password' \
    -p 5222:5222 \
    -p 5280:5280 \
    -p 5290:5290 \
    -p 8080:8080 \
    tigase/tigase-xmpp-server



docker run -d \
    --name some_tigase \
    -v /Users/mvrcentes/Library/CloudStorage/OneDrive-UVG/Documentos/Semestre_8/Redes/Redes_2024/etc/:/home/tigase/tigase-server/etc/ \
    -v /Users/mvrcentes/Library/CloudStorage/OneDrive-UVG/Documentos/Semestre_8/Redes/Redes_2024/certs/:/home/tigase/tigase-server/certs/ \
    -v /Users/mvrcentes/Library/CloudStorage/OneDrive-UVG/Documentos/Semestre_8/Redes/Redes_2024/data/:/home/tigase/tigase-server/data/ \
    -e 'DB_ROOT_USER=root' \
    -e 'DB_ROOT_PASS=root-root' \
    -p 5222:5222 \
    -p 5280:5280 \
    -p 5290:5290 \
    -p 8080:8080 \
    tigase/tigase-xmpp-server