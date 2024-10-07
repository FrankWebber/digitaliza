import os
import time
import difflib
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

# Caminhos dos arquivos
file_paths = [
    r"C:\Users\Frank Webber\Documents\GitHub\digita-liza\package.json",
    r"C:\Users\Frank Webber\Documents\GitHub\digita-liza\.gitignore",
    r"C:\Users\Frank Webber\Documents\GitHub\digita-liza\LEIAME.txt",
    r"C:\Users\Frank Webber\Documents\GitHub\digita-liza\backend\.env",
    r"C:\Users\Frank Webber\Documents\GitHub\digita-liza\backend\app.py",
    r"C:\Users\Frank Webber\Documents\GitHub\digita-liza\backend\ocr_processor.py",
    r"C:\Users\Frank Webber\Documents\GitHub\digita-liza\backend\requirements.txt",
    r"C:\Users\Frank Webber\Documents\GitHub\digita-liza\frontend\src\components\DownloadText.js",
    r"C:\Users\Frank Webber\Documents\GitHub\digita-liza\frontend\src\components\OCRButton.js",
    r"C:\Users\Frank Webber\Documents\GitHub\digita-liza\frontend\src\components\PDFDetails.js",
    r"C:\Users\Frank Webber\Documents\GitHub\digita-liza\frontend\src\components\PDFList.js",
    r"C:\Users\Frank Webber\Documents\GitHub\digita-liza\frontend\src\components\Relatorio.js",
    r"C:\Users\Frank Webber\Documents\GitHub\digita-liza\frontend\src\components\UploadForm.js",
    r"C:\Users\Frank Webber\Documents\GitHub\digita-liza\frontend\src\App.js",
    r"C:\Users\Frank Webber\Documents\GitHub\digita-liza\frontend\.gitignore",
    r"C:\Users\Frank Webber\Documents\GitHub\digita-liza\frontend\package.json"
]

# Caminho do arquivo de saída
output_file_path = r"C:\Users\Frank Webber\Documents\GitHub\digita-liza\stuff\todooprojeto.txt"

# Função para ler o conteúdo dos arquivos e escrever no arquivo de saída
def write_to_output():
    with open(output_file_path, 'w') as output_file:
        for file_path in file_paths:
            with open(file_path, 'r') as f:
                content = f.read()
                output_file.write(f"Conteúdo de {file_path}:\n{content}\n\n")

# Função para monitorar as mudanças nos arquivos
class ChangeHandler(FileSystemEventHandler):
    def on_modified(self, event):
        if event.src_path in file_paths:
            print(f"Arquivo alterado: {event.src_path}")
            self.update_output(event.src_path)

    def update_output(self, modified_file_path):
        # Lê o conteúdo atual
        with open(modified_file_path, 'r') as f:
            new_content = f.read()

        # Lê o conteúdo anterior do arquivo de saída
        with open(output_file_path, 'r') as output_file:
            previous_content = output_file.read()

        # Obtém as linhas de texto
        previous_lines = previous_content.splitlines()
        new_lines = new_content.splitlines()

        # Compara o conteúdo
        diff = difflib.unified_diff(previous_lines, new_lines, lineterm='',
                                     fromfile=modified_file_path, tofile=modified_file_path)

        # Adiciona as mudanças ao arquivo de saída
        with open(output_file_path, 'a') as output_file:
            output_file.write("\nAlterações em " + modified_file_path + ":\n")
            output_file.write('\n'.join(diff))
            output_file.write("\n\n")

# Inicializa o observador
observer = Observer()
handler = ChangeHandler()
for file_path in file_paths:
    observer.schedule(handler, os.path.dirname(file_path), recursive=False)

# Inicia o monitoramento
observer.start()
try:
    write_to_output()  # Escreve o conteúdo inicial no arquivo
    while True:
        time.sleep(1)  # Mantém o script em execução
except KeyboardInterrupt:
    observer.stop()
observer.join()
