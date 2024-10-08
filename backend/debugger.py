import os
from datetime import datetime

def log_error(error_message):
    # Cria um nome de arquivo baseado na data e hora atual
    timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    filename = f"liz_{timestamp}.txt"  # Nome do arquivo

    # Diretório para salvar os logs
    log_directory = os.path.join(os.getcwd(), 'logs')
    os.makedirs(log_directory, exist_ok=True)  # Cria o diretório se não existir

    # Caminho completo do arquivo de log
    log_file_path = os.path.join(log_directory, filename)

    # Abre o arquivo para escrita
    with open(log_file_path, 'w') as file:
        file.write(f"Error logged at {timestamp}\n")
        file.write(f"Error message: {error_message}\n")
        file.write("Possible solutions:\n")
        file.write("1. Check if the server is running.\n")
        file.write("2. Ensure that the API endpoint is correct.\n")
        file.write("3. Check for CORS issues if using a different domain.\n")
        file.write("4. Verify the request payload and headers.\n")
        file.write("5. Consult the server logs for more details.\n")
