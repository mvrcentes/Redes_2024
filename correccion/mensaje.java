import java.util.*;  
public class mensaje {
    // Clase para recibir el mensaje del usuario y asi codificarlo
    public static String getUserInput() {
        Scanner sc = new Scanner(System.in);
        System.out.print("Ingrese el mensaje que enviara: ");
        String userInput = sc.nextLine();
        
        String binaryASCII = stringToBinaryASCII(userInput);
        return binaryASCII;
    }

    public static String stringToBinaryASCII(String input) {
        StringBuilder binaryBuilder = new StringBuilder();
        
        for (char c : input.toCharArray()) {
            int asciiValue = (int) c;
            String binaryString = String.format("%08d", Integer.parseInt(Integer.toBinaryString(asciiValue)));
            binaryBuilder.append(binaryString).append(" ");
        }
        
        return binaryBuilder.toString().trim();
    }
}
