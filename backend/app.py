from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import os
import boto3
import traceback
from dotenv import load_dotenv

# Carregar variáveis de ambiente
load_dotenv()

# Configurar a aplicação Flask
app = Flask(__name__)
CORS(app)

# Configurar boto3 com as credenciais da AWS
s3_client = boto3.client(
    's3',
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
    region_name=os.getenv('AWS_REGION')
)

textract_client = boto3.client(
    'textract',
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
    region_name=os.getenv('AWS_REGION')
)

# Diretórios para armazenar PDFs e resultados
UPLOAD_FOLDER = os.path.join(os.getcwd(), 'pdfs')
RESULTS_FOLDER = os.path.join(os.getcwd(), 'results')

# Criar diretórios se não existirem
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(RESULTS_FOLDER, exist_ok=True)

# Nome do bucket S3
S3_BUCKET_NAME = os.getenv('S3_BUCKET_NAME')

# Lista de PDFs monitorados e seus status
pdf_files = {}

# Defina um limite para o tamanho do arquivo
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16 MB

@app.route('/upload', methods=['POST'])
def upload_pdf():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file sent'}), 400

        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400

        if file and file.filename.endswith('.pdf'):
            if file.content_length > 10 * 1024 * 1024:
                return jsonify({'error': 'File size exceeds the maximum limit of 10 MB.'}), 400
            
            filepath = os.path.join(UPLOAD_FOLDER, file.filename)
            file.save(filepath)

            # Fazer upload para S3
            try:
                s3_client.upload_file(filepath, S3_BUCKET_NAME, file.filename)
            except Exception as e:
                print(f"S3 upload error: {e}")
                return jsonify({'error': 'Error uploading to S3'}), 500

            # Processar OCR no PDF enviado
            try:
                response = textract_client.start_document_analysis(
                    DocumentLocation={
                        'S3Object': {
                            'Bucket': S3_BUCKET_NAME,
                            'Name': file.filename
                        }
                    },
                    FeatureTypes=['TABLES', 'FORMS']
                )
                job_id = response['JobId']
                pdf_files[file.filename] = {'status': 'processing', 'job_id': job_id}
            except textract_client.exceptions.DocumentTooLargeException:
                return jsonify({'error': 'The document is too large for processing. Please consider reducing the file size.'}), 400
            except Exception as e:
                print(f"OCR processing error: {e}")
                return jsonify({'error': 'Error processing OCR'}), 500

            return jsonify({'message': 'PDF uploaded and OCR started', 'file': file.filename}), 200

        return jsonify({'error': 'Invalid file type, only PDFs are accepted'}), 400

    except Exception as e:
        print(f"Error occurred in upload_pdf: {traceback.format_exc()}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/status/<filename>', methods=['GET'])
def get_status(filename):
    if filename not in pdf_files:
        return jsonify({'error': 'File not found'}), 404
    
    # Verificar status do job no Textract
    try:
        response = textract_client.get_document_analysis(JobId=pdf_files[filename]['job_id'])
        pdf_files[filename]['status'] = response['JobStatus']
    except Exception as e:
        print(f"Error checking job status: {e}")
        return jsonify({'error': 'Error checking job status'}), 500
    
    return jsonify(pdf_files[filename]), 200

@app.route('/status', methods=['GET'])
def get_all_status():
    return jsonify(pdf_files), 200

@app.route('/pdf/<filename>', methods=['GET'])
def get_pdf_data(filename):
    txt_file_path = os.path.join(RESULTS_FOLDER, f'{filename}.txt')
    if os.path.exists(txt_file_path):
        with open(txt_file_path, 'r') as file:
            return jsonify({'data': file.read()}), 200
    return jsonify({'error': 'File not found'}), 404

@app.route('/pdfs/<path:filename>', methods=['GET'])
def serve_pdf(filename):
    try:
        return send_from_directory(UPLOAD_FOLDER, filename)
    except Exception as e:
        return jsonify({'error': str(e)}), 404

if __name__ == '__main__':
    app.run(debug=True, port=5000)
