import os
import logging
import sys
import traceback
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
import boto3

# Adiciona o diretório pai ao sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from debugger import log_error  # Importa a função de log

# Diretório para armazenar logs
log_directory = os.path.join(os.getcwd(), 'logs')
os.makedirs(log_directory, exist_ok=True)  # Cria o diretório se não existir

# Configurar logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(os.path.join(log_directory, "app.log")),  # Salva logs em logs/app.log
        logging.StreamHandler()  # Também exibe logs no console
    ]
)

logger = logging.getLogger(__name__)  # Cria um logger específico para este módulo

# Carregar variáveis de ambiente
load_dotenv()

# Configurar a aplicação Flask
app = Flask(__name__)
CORS(app)  # Habilita CORS para permitir requisições de outros domínios

# Middleware para registrar erros
@app.errorhandler(Exception)
def handle_error(error):
    log_error(str(error))
    logger.error('Internal Server Error: %s', str(error))  # Loga o erro
    return jsonify({'error': 'Internal server error'}), 500

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
            logger.error("No file part in the request.")
            return jsonify({'error': 'No file sent'}), 400

        file = request.files['file']
        if file.filename == '':
            logger.error("No selected file.")
            return jsonify({'error': 'No file selected'}), 400

        # Verifica se o arquivo é um PDF
        if file and file.filename.endswith('.pdf'):
            # Verifica o tamanho do arquivo
            if file.content_length > 10 * 1024 * 1024:  # 10 MB
                logger.error('File size exceeds the maximum limit of 10 MB.')
                return jsonify({'error': 'File size exceeds the maximum limit of 10 MB.'}), 400

            filepath = os.path.join(UPLOAD_FOLDER, file.filename)
            file.save(filepath)  # Salva o arquivo localmente

            # Fazer upload para S3
            try:
                s3_client.upload_file(filepath, S3_BUCKET_NAME, file.filename)
                logger.info('File uploaded to S3 successfully: %s', file.filename)  # Log de sucesso
            except Exception as e:
                logger.error('S3 upload error: %s', str(e))
                return jsonify({'error': 'Error uploading to S3'}), 500

            # Processar OCR
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
            return jsonify({'message': 'PDF uploaded and OCR started', 'jobId': job_id}), 200

        return jsonify({'error': 'Invalid file type, only PDFs are accepted'}), 400

    except Exception as e:
        logger.error('Error occurred in upload_pdf: %s', traceback.format_exc())
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
        logger.error('Error checking job status: %s', str(e))  # Loga o erro
        return jsonify({'error': 'Error checking job status'}), 500
    
    return jsonify(pdf_files[filename]), 200

@app.route('/status', methods=['GET'])
def get_all_status():
    return jsonify(pdf_files), 200

@app.route('/pdf/<filename>', methods=['GET'])
def get_pdf_data(filename):
    txt_file_path = os.path.join(RESULTS_FOLDER, f'MEMO_N_{filename}.txt')
    if os.path.exists(txt_file_path):
        return send_from_directory(RESULTS_FOLDER, f'MEMO_N_{filename}.txt'), 200
    return jsonify({'error': 'File not found'}), 404

@app.route('/pdfs/<path:filename>', methods=['GET'])
def serve_pdf(filename):
    try:
        return send_from_directory(UPLOAD_FOLDER, filename)
    except Exception as e:
        logger.error('Error serving PDF: %s', str(e))  # Loga o erro
        return jsonify({'error': str(e)}), 404

@app.route('/log-error', methods=['POST'])
def log_test_error():
    try:
        data = request.json
        error_message = data.get('error', 'No error message provided')
        logger.error('Test Error: %s', error_message)  # Loga a mensagem de erro
        return jsonify({'message': 'Error logged successfully'}), 200
    except Exception as e:
        logger.error('Error logging test error: %s', str(e))
        return jsonify({'message': 'Failed to log error'}), 500

# Endpoint para verificar o status do OCR
@app.route('/ocr-status/<job_id>', methods=['GET'])
def check_ocr_status(job_id):
    try:
        response = textract_client.get_document_analysis(JobId=job_id)
        
        if response['JobStatus'] == 'SUCCEEDED':
            output_txt_path = os.path.join(RESULTS_FOLDER, f'MEMO_N_{job_id}.txt')
            extract_text_and_save(response, output_txt_path)

            # Cria a URL que o frontend pode usar para acessar o arquivo
            txt_file_url = f"http://127.0.0.1:5000/pdf/MEMO_N_{job_id}.txt"  # A URL correta para o arquivo

            return jsonify({'status': 'SUCCEEDED', 'results': response, 'txt_path': txt_file_url}), 200
        elif response['JobStatus'] == 'FAILED':
            return jsonify({'status': 'FAILED'}), 500
        else:
            return jsonify({'status': 'IN_PROGRESS'}), 200
    except Exception as e:
        logger.error('Erro ao verificar status do OCR: %s', str(e))
        return jsonify({'error': 'Erro ao verificar status do OCR'}), 500

def extract_text_and_save(response, output_txt_path):
    with open(output_txt_path, 'w', encoding='utf-8') as txt_file:
        for item in response.get('Blocks', []):
            if item['BlockType'] == 'LINE':
                txt_file.write(item['Text'] + '\n')

@app.route('/logs', methods=['GET'])
def get_logs():
    log_file_path = os.path.join(log_directory, 'app.log')
    try:
        with open(log_file_path, 'r') as log_file:
            logs = log_file.readlines()[-50:]  # Pega as últimas 50 linhas do log
        return jsonify({'logs': logs}), 200
    except Exception as e:
        logger.error('Error reading log file: %s', str(e))
        return jsonify({'error': 'Could not read log file'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=5000)