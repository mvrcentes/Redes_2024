# Redes_2024

[PDF](https://github.com/mvrcentes/Redes_2024/blob/Lab-2_2/Entregables/Laboratorio_No2.pdf)

## Cliente - Servidor

![](https://github.com/mvrcentes/Redes_2024/blob/Lab-2_2/images/test.gif)

## Cliente - Hamming 

1. Compilar el cliente
```bash
javac HammingFletcherClient.java
```

2. Correr el cliente 
```bash
java HammingFletcherClient
```

3. Correr el servidor 
```bash
python3 hammingServer.py
```

![](https://github.com/mvrcentes/Redes_2024/blob/Lab-2_2/images/hamming.gif)

### Prueba 1

* Mensaje: mundo
* Cadena binaria: 10000101000110110111101110000110111001
* Probabilidad de error: 0.01

![](https://github.com/mvrcentes/Redes_2024/blob/Lab-2_2/images/hola-hamming.png)

### Prueba 2

* Mensaje: mundo
* Cadena binaria: 1111011000100101001110110101011110101100111011
* Probabilidad de error: 0.03

![](https://github.com/mvrcentes/Redes_2024/blob/Lab-2_2/images/mundo-hamming.png)


### Prueba 3

* Mensaje: mundo
* Cadena binaria: 1111011000100101001110110101011110101100111011
* Probabilidad de error: 0.07

![](https://github.com/mvrcentes/Redes_2024/blob/Lab-2_2/images/error-hamming.png)

## Cliente - Fletcher

1. Compilar el cliente
```bash
javac HammingFletcherClient.java
```

2. Correr el cliente 
```bash
java HammingFletcherClient
```

3. Correr el servidor 
```bash
python3 detectionFletcher.py
```

![](https://github.com/mvrcentes/Redes_2024/blob/Lab-2_2/images/fletcher.gif)

### Prueba 1

* Mensaje: hola
* Cadena binaria: 011010000110111101101100011000010001000000010011
* Probabilidad de error: 0.01

![](https://github.com/mvrcentes/Redes_2024/blob/Lab-2_2/images/hola-fletcher.png)


### Prueba 2

* Mensaje: mundo
* Cadena binaria: 01101101011101010110111001100100011011110001100011101001
* Probabilidad de error: 0.03

![](https://github.com/mvrcentes/Redes_2024/blob/Lab-2_2/images/error-fletcher.png)

### Prueba 3

* Mensaje: mundo
* Cadena binaria: 01101101011101010110111001100100011011110001100011101001
* Probabilidad de error: 0.01

![](https://github.com/mvrcentes/Redes_2024/blob/Lab-2_2/images/mundo-fletcher.png)
