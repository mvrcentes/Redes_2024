import java.util.*;  

class hamming {  
    public static void main(String args[])   
    {  
          
        int  hammingCodeSize, errorPosition, cantErr;  
        int hammingCode[];  
          
        Scanner sc = new Scanner(System.in);  
        
        
        String input = mensaje.getUserInput();
        System.out.println("Mensaje codificado: " + input);




        System.out.println("Ingrese el mensaje binario ");
        String recibo = sc.nextLine(); //se recibe el input del usuario
        String[] numberStrings = recibo.split("");
        
        
        int[] arr = new int[numberStrings.length];
        
        // se usa este for para pasarlo a un array
        for (int i = 0; i < numberStrings.length; i++) {
            if (!numberStrings[i].equals(" ")) {
                arr[i] = Integer.parseInt(numberStrings[i]);
            }
        }
        
        for (int num : arr) {
            System.out.print(num + " ");
        }
        System.out.println();  
        encoder.Devolucion(arr);

        
        hammingCode = getHammingCode(arr);  
        hammingCodeSize = hammingCode.length;
      
    
         receiveData(hammingCode, hammingCodeSize - arr.length); 
        // cerrar scanner 
            sc.close(); 
    }  
     
    static int[] getHammingCode(int data[]) {  
        // declarar un array que va a guardar el hamming code para la data
        int returnData[];  
        int size;  
        // codgo para encontrar los parity bits 
        int i = 0, parityBits = 0 ,j = 0, k = 0;  
        size = data.length;  
        while(i < size) {  
             
            if(Math.pow(2, parityBits) == (i + parityBits + 1)) {  
                parityBits++;  
            }  
            else {  
                i++;  
            }  
        }  
        returnData = new int[size + parityBits];  

        // for para encontrar los bits de parity
        for(i = 1; i <= returnData.length; i++) {  
            if(Math.pow(2, j) == i) {  
              
                returnData[(i - 1)] = 2;  
                j++;  
            }  
            else {  
                returnData[(k + j)] = data[k++];  
            }  
        }  
        System.out.println("Parity bits");
        for(i = 0; i < parityBits; i++) {  
          
            returnData[((int) Math.pow(2, i)) - 1] = getParityBit(returnData, i);  
        }  
          
        return returnData;  
    }  
    
    static int getParityBit(int returnData[], int pow) {  
        
        int parityBit = 0;  
        int size = returnData.length;  
        for(int i = 0; i < size; i++) {  
            if(returnData[i] != 2) {  
                int k = (i + 1);  
                String str = Integer.toBinaryString(k);  
              
                int temp = ((Integer.parseInt(str)) / ((int) Math.pow(10, pow))) % 10;  
                if(temp == 1) {  
                    if(returnData[i] == 1) {  
                        parityBit = (parityBit + 1) % 2;  
                    }  
                }  
            }  
        }  
        
        System.out.println(parityBit);
        return parityBit;  
    }  
    
    static void receiveData(int data[], int parityBits) {  
          
        int pow;  
        int size = data.length;       
        int parityArray[] = new int[parityBits];  
        String errorLoc = new String();  
        // se buscan parity bits 
        for(pow = 0; pow < parityBits; pow++) {  
            for(int i = 0; i < size; i++) {  
                int j = i + 1;    
                String str = Integer.toBinaryString(j);  
                
                int bit = ((Integer.parseInt(str)) / ((int) Math.pow(10, pow))) % 10;  
                if(bit == 1) {  
                    if(data[i] == 1) {  
                        parityArray[pow] = (parityArray[pow] + 1) % 2;  
                    }  
                }  
            }  
            errorLoc = parityArray[pow] + errorLoc;  
        }  
        
    }  
    
}  