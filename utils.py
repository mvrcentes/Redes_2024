# utils.py
# Funciones auxiliares
import json

def load_config(file_path):
    """
    Loads the JSON configuration from a file.
    
    Args:
        file_path (str): Path to the JSON file.
    
    Returns:
        dict: The configuration data.
    """
    with open(file_path, 'r') as f:
        config = json.load(f)
    return config

