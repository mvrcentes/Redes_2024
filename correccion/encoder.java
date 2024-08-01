import java.util.Arrays;

public class encoder {

    public static int calculateParityBits(int dataLength) {
        int m = 1;
        while ((dataLength + m + 1) > Math.pow(2, m)) {
            m++;
        }
        return m;
    }

    public static int calculateParity(int[] data, int parityBitPosition) {
        int xorResult = 0;
        for (int i = 0; i < data.length; i++) {
            if (((i + 1) & (1 << parityBitPosition)) != 0) {
                xorResult ^= data[i];
            }
        }
        return xorResult;
    }

    public static int[] encodeData(int[] data) {
        int m = calculateParityBits(data.length);
        int[] encodedData = new int[data.length + m];

        // inicializar los parity bits con -1
        for (int i = 0; i < m; i++) {
            encodedData[(int) Math.pow(2, i) - 1] = -1;
        }

        int dataIndex = 0;
        for (int i = 0; i < encodedData.length; i++) {
            if (isPowerOfTwo(i + 1)) {
                continue;
            }
            encodedData[i] = data[dataIndex];
            dataIndex++;
        }

        // llenar bits de paridad
        for (int i = 0; i < m; i++) {
            int parityBitIndex = (int) Math.pow(2, i) - 1;
            int parity = calculateParity(encodedData, i);
            encodedData[parityBitIndex] = parity;
        }

        return encodedData;
    }

    public static boolean isPowerOfTwo(int number) {
        return (number & (number - 1)) == 0;
    }

    public static String process(int[] info) {
        int[] encodedData = encodeData(info);

        // Simular transmisión introduciendo un error
        encodedData[2] = 0; // Introducir un error arbitrario para la demostración

        // Decodificar datos recibidos y corregir errores
        int[] decodedData = new int[info.length];
        int m = calculateParityBits(decodedData.length);

        for (int i = 0; i < decodedData.length; i++) {
            if (!isPowerOfTwo(i + 1)) {
                decodedData[i] = encodedData[i];
            }
        }

        // Mostrar los resultados
        System.out.println("Input Data: " + Arrays.toString(info));
        System.out.println("Encoded Data: " + Arrays.toString(encodedData));
        System.out.println("Decoded Data: " + Arrays.toString(decodedData));

        return "________";
    }
}
