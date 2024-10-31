from PIL import Image
import numpy as np
from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes

def load_image(image_path):
    image = Image.open(image_path)
    image = image.convert("RGBA")
    data = np.array(image)
    return data

def encrypt_image_ecb(image_bytes, key):
    cipher = AES.new(key, AES.MODE_ECB)
    encrypted_data = cipher.encrypt(image_bytes)
    return encrypted_data

def encrypt_image_cbc(image_bytes, key, iv):
    cipher = AES.new(key, AES.MODE_CBC, iv)
    encrypted_data = cipher.encrypt(image_bytes)
    return encrypted_data

def save_encrypted_image(data, filename):
    encrypted_image = Image.fromarray(data, "RGBA")
    encrypted_image.save(filename)

# Load and reshape the image
image_data = load_image('./tux.bmp')
image_bytes = image_data.tobytes()
padded_length = (len(image_bytes) + AES.block_size - 1) // AES.block_size * AES.block_size
image_bytes = image_bytes.ljust(padded_length, b'\0')

# Key and IV
key = get_random_bytes(16)  # 128-bit key for AES-128
iv = get_random_bytes(AES.block_size)  # IV for CBC mode

# Encrypt in ECB mode
ecb_encrypted = encrypt_image_ecb(image_bytes, key)
ecb_data = np.frombuffer(ecb_encrypted, dtype=np.uint8).reshape((405, 480, 4))
save_encrypted_image(ecb_data, 'encrypted_ecb.png')

# Encrypt in CBC mode
cbc_encrypted = encrypt_image_cbc(image_bytes, key, iv)
cbc_data = np.frombuffer(cbc_encrypted, dtype=np.uint8).reshape((405, 480, 4))
save_encrypted_image(cbc_data, 'encrypted_cbc.png')
