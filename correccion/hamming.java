import java.util.Scanner;

class hamming {  
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        // Solicitar entrada del usuario
        System.out.println("Ingrese el mensaje binario:");
        String recibo = sc.nextLine().replace(" ", "");
        int[] arr = recibo.chars().map(c -> c - '0').toArray();

        // Procesar datos con Encoder
        encoder.process(arr);

        sc.close();
    }
    
}  