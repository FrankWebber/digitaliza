from flask import Flask, jsonify, request
from ocr_processor import process_ocr
import os
import boto3
from flask_cors import CORS  # Importa o CORS

app = Flask(__name__)
CORS(app)  # Habilita o CORS para todas as rotas

# Diretório para armazenar PDFs
UPLOAD_FOLDER = os.path.join(os.getcwd(), '../pdfs')
RESULTS_FOLDER = os.path.join(os.getcwd(), '../results')

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

if not os.path.exists(RESULTS_FOLDER):
    os.makedirs(RESULTS_FOLDER)

# Bucket S3
S3_BUCKET_NAME = 'bucketparaocrlaudos'  # Substitua pelo nome do seu bucket S3

# Lista de PDFs monitorados e seus status
pdf_files = {}

@app.route('/upload', methods=['POST'])
def upload_pdf():
    if 'file' not in request.files:
        return jsonify({'error': 'Nenhum arquivo enviado'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'Nenhum arquivo selecionado'}), 400

    if file and file.filename.endswith('.pdf'):
        filepath = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(filepath)

        # Enviar para o bucket S3
        s3_client = boto3.client('s3')
        s3_client.upload_file(filepath, S3_BUCKET_NAME, file.filename)

        # Processar OCR no PDF do S3
        process_ocr(file.filename)  # Passar o nome do arquivo para o processamento OCR
        return jsonify({'message': 'PDF enviado e OCR iniciado', 'file': file.filename}), 200

    return jsonify({'error': 'Arquivo inválido'}), 400

@app.route('/status', methods=['GET'])
def get_status():
    return jsonify(pdf_files), 200

@app.route('/pdf/<filename>', methods=['GET'])
def get_pdf_data(filename):
    if filename in pdf_files:
        txt_file_path = os.path.join(RESULTS_FOLDER, f'{filename}.txt')
        if os.path.exists(txt_file_path):
            with open(txt_file_path, 'r') as file:
                data = file.read()
            return jsonify({'file': filename, 'data': data}), 200
        return jsonify({'error': 'Arquivo .txt não encontrado'}), 404
    return jsonify({'error': 'Arquivo não encontrado'}), 404

if __name__ == '__main__':
    app.run(debug=True)
