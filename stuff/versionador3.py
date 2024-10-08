import os
import datetime

# Caminhos dos arquivos
file_paths = [
    

    r"C:\Users\Frank Webber\Documents\GitHub\digita-liza\backend\app.py",
    r"C:\Users\Frank Webber\Documents\GitHub\digita-liza\backend\ocr_processor.py",
  
    r"C:\Users\Frank Webber\Documents\GitHub\digita-liza\frontend\src\components\DownloadText.js",
    r"C:\Users\Frank Webber\Documents\GitHub\digita-liza\frontend\src\components\OCRButton.js",
    r"C:\Users\Frank Webber\Documents\GitHub\digita-liza\frontend\src\components\PDFDetails.js",
    r"C:\Users\Frank Webber\Documents\GitHub\digita-liza\frontend\src\components\PDFList.js",
    r"C:\Users\Frank Webber\Documents\GitHub\digita-liza\frontend\src\components\Relatorio.js",
    r"C:\Users\Frank Webber\Documents\GitHub\digita-liza\frontend\src\components\UploadForm.js",
    r"C:\Users\Frank Webber\Documents\GitHub\digita-liza\frontend\src\App.js",
   
  
]

# Função para criar um nome de arquivo com timestamp
def create_versioned_filename():
    now = datetime.datetime.now()
    timestamp = now.strftime("%Y-%m-%d_%H-%M-%S")
    return f"C:\\Users\\Frank Webber\\Documents\\GitHub\\digita-liza\\stuff\\version_{timestamp}.txt"

# Função para ler o conteúdo dos arquivos e escrever no arquivo de saída
def write_to_output():
    output_file_path = create_versioned_filename()  # Gera um nome de arquivo com timestamp
    with open(output_file_path, 'w') as output_file:
        for file_path in file_paths:
            if os.path.exists(file_path):  # Verifica se o arquivo existe
                with open(file_path, 'r') as f:
                    content = f.read()
                    output_file.write(f"Conteúdo de {file_path}:\n{content}\n\n")
            else:
                output_file.write(f"Arquivo não encontrado: {file_path}\n\n")

# Executa a função
write_to_output()
