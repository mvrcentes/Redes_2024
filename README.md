# Laboratorio 3 - Redes 2024

### Integrantes:
- **Alejandro Ortega** - Carnet: 18248
- **Marco Ramírez** - Carnet: 21032
- **Josué Morales** - Carnet: 21116

## Descripción del Proyecto

Este laboratorio implementa un algoritmo de flooding y un algoritmo de Link State Routing sobre una red de nodos utilizando el protocolo XMPP para la transmisión de mensajes. Cada nodo en la red actúa como un cliente XMPP que se comunica con sus vecinos configurados, propagando mensajes a través de la red y registrando la ruta más corta que un mensaje toma desde su origen hasta su destino.

## Estructura del Proyecto

El proyecto está organizado en los siguientes archivos principales:

- **src/app.js**: Punto de entrada principal que inicializa los nodos y configura la red.
- **src/xmppClient.js**: Módulo que maneja la creación y configuración de clientes XMPP para cada nodo.
- **src/flooding.js**: Implementación del algoritmo de flooding, que maneja el envío y recepción de mensajes, así como el registro de rutas probadas.
- **config/names.txt**: Archivo JSON que contiene el mapeo de nombres de nodos a JIDs.
- **config/topology.txt**: Archivo JSON que define la topología de la red, especificando las conexiones entre los nodos.

## Instrucciones de Uso

### 1. Instalación de Dependencias
Antes de ejecutar el proyecto, asegúrate de tener instaladas las dependencias necesarias con el comando:

```bash
npm install
```

### 2. Configuración
Asegúrate de que los archivos de configuración `names.txt` y `topology.txt` estén correctamente ubicados en la carpeta `config/`. Estos archivos deben contener las configuraciones necesarias para los nodos y la topología de la red.

### 3. Ejecución
Para ejecutar el laboratorio, puede utilizar los siguientes scripts:

Ejecutar el laboratorio con los valores por defecto:
```bash
npm run start
```
Ejecutar el laboratorio con el algoritmo de flooding:
```bash
npm run start-flooding
```
Ejecutar el laboratorio con el algoritmo LSR:
```bash
npm run start-lsr
```
Alternativamente, puede ejecutar el programa principal de la siguiente manera:
```bash
node src/app.js
```

El programa cuenta con el argumento `--algorithm` con el cual puede establecer el algoritmo a utilizar entre `lsr` y `flooding`. En caso de no recibir ningun argumento, se utilizará `lsr` por defecto.

Uso:
```bash
node src/app.js --algorithm lsr
```
```bash
node src/app.js --algorithm flooding
```

El programa solicitará un JID (user@alumchat.lol) y una contraseña para conectarse al servidor, después de conectarse so mostrará un menú con las opciones disponibles. A través de este menú podrá consultar la topología de la red, ver la tabla de enrutamiento (si aplica), enviar mensajes a otros usuarios mediante su JID y salir del programa.

### 4. Logs
Durante la ejecución, se generarán logs que proporcionan información detallada sobre las operaciones de cada nodo, incluyendo:
- Conexión de nodos.
- Envío y recepción de mensajes.
- Rutas probadas y la ruta más corta encontrada.

## Ejemplo de Salida

```bash
[DEBUG] Nodo A está online con JID: jm1@alumchat.lol
[INFO] Vecinos de Nodo A: jm2@alumchat.lol, jm9@alumchat.lol, jm3@alumchat.lol

[DEBUG] Nodo A enviando mensaje inicial a jm9@alumchat.lol...
[DEBUG] Nodo A creando y enviando mensaje a jm9@alumchat.lol
[INFO] Ruta más corta encontrada: jm1@alumchat.lol -> jm9@alumchat.lol [hops: 1]
```

Este ejemplo muestra cómo un nodo se conecta y propaga un mensaje a través de la red, registrando la ruta más corta que encontró.

## Consideraciones

- Asegúrate de que todos los nodos definidos en `topo.txt` y `names.txt` estén correctamente configurados para evitar errores de conexión.
- La propagación de mensajes puede generar mensajes duplicados, pero el algoritmo está diseñado para manejar estos casos eficientemente, evitando loops y mensajes redundantes.
