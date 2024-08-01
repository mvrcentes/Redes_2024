import java.io.*;
import java.net.Socket;
import java.util.Random;
import java.util.Scanner;

public class HammingFletcherClient {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String serverHost = "localhost";
        int serverPort = 0;

        while (true) {
            System.out.println("Seleccione el método de codificación:");
            System.out.println("1: Hamming");
            System.out.println("2: Fletcher");
            System.out.println("0: Salir");
            int choice = scanner.nextInt();
            scanner.nextLine(); // Consumir el salto de línea

            if (choice == 0) {
                System.out.println("Saliendo...");
                break;
            }

            if (choice != 1 && choice != 2) {
                System.out.println("Opción inválida. Intente de nuevo.");
                continue;
            }

            if (choice == 1) {
                serverPort = 12346;
            } else if (choice == 2) {
                serverPort = 12347;
            }

            while (true) {
                System.out.println("Seleccione una opción:");
                System.out.println("1: Enviar mensaje");
                System.out.println("2: Regresar");
                int action = scanner.nextInt();
                scanner.nextLine(); // Consumir el salto de línea

                if (action == 2) {
                    break;
                } else if (action != 1) {
                    System.out.println("Opción inválida. Intente de nuevo.");
                    continue;
                }

                System.out.println("Ingrese un mensaje:");
                String message = scanner.nextLine();

                System.out.println("Ingresar tasa de error (0.01):");
                double errorRate = scanner.nextDouble();
                scanner.nextLine(); // Consumir el salto de línea

                String binaryMessage = textToBinary(message);
                String encodedMessage;

                if (choice == 1) {
                    encodedMessage = encodeHamming(binaryMessage);
                    System.out.println("Mensaje codificado usando Hamming: " + encodedMessage);
                } else {
                    encodedMessage = binaryMessage + fletcherChecksum(binaryMessage);
                    System.out.println("Mensaje codificado usando Fletcher: " + encodedMessage);
                }

                String noisyMessage = applyNoise(encodedMessage, errorRate);

                try (Socket socket = new Socket(serverHost, serverPort);
                     PrintWriter out = new PrintWriter(socket.getOutputStream(), true);
                     BufferedReader in = new BufferedReader(new InputStreamReader(socket.getInputStream()))) {

                    out.println(noisyMessage);
                    
                    String decodedMessage = in.readLine();
                    System.out.println("Mensaje decodificado: " + decodedMessage);
                    
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
        scanner.close();
    }

    public static String textToBinary(String text) {
        StringBuilder binary = new StringBuilder();
        for (char character : text.toCharArray()) {
            binary.append(
                String.format("%8s", Integer.toBinaryString(character))
                      .replaceAll(" ", "0")
            );
        }
        return binary.toString();
    }

    public static String encodeHamming(String message) {
        int m = message.length();
        int r = 0;
        
        while (Math.pow(2, r) < (m + r + 1)) {
            r++;
        }   
        int[] hammingCode = new int[m + r];
        int j = 0, k = 0;

        for (int i = 1; i <= hammingCode.length; i++) {
            if (Math.pow(2, k) == i) {
                hammingCode[hammingCode.length - i] = 0;
                k++;
            } else {
                hammingCode[hammingCode.length - i] = message.charAt(j) - '0';
                j++;
            }
        }

        for (int i = 0; i < r; i++) {
            int parityPos = (int) Math.pow(2, i);
            int parity = 0;
            for (int j2 = 1; j2 <= hammingCode.length; j2++) {
                if (((j2 >> i) & 1) == 1) {
                    parity ^= hammingCode[hammingCode.length - j2];
                }
            }
            hammingCode[hammingCode.length - parityPos] = parity;
        }

        StringBuilder encodedMessage = new StringBuilder();
        for (int bit : hammingCode) {
            encodedMessage.append(bit);
        }
        return encodedMessage.toString();
    }

    public static String fletcherChecksum(String message) {
        int sum1 = 0, sum2 = 0;
        for (int i = 0; i < message.length(); i++) {
            int val = message.charAt(i) - '0';
            sum1 = (sum1 + val) % 255;
            sum2 = (sum2 + sum1) % 255;
        }
        return String.format("%08d", Integer.parseInt(Integer.toBinaryString(sum1))) + 
               String.format("%08d", Integer.parseInt(Integer.toBinaryString(sum2)));
    }

    public static String applyNoise(String message, double errorRate) {
        StringBuilder noisyMessage = new StringBuilder(message);
        Random random = new Random();
        for (int i = 0; i < noisyMessage.length(); i++) {
            if (random.nextDouble() < errorRate) {
                noisyMessage.setCharAt(i, noisyMessage.charAt(i) == '0' ? '1' : '0');
            }
        }
        return noisyMessage.toString();
    }
}
