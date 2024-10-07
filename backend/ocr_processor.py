import boto3
import time
from dotenv import load_dotenv
import os

# Carrega as variáveis do arquivo .env
load_dotenv()

# Acessando as variáveis de ambiente
AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
AWS_REGION = os.getenv('AWS_REGION')
S3_BUCKET_NAME = os.getenv('S3_BUCKET_NAME')

# Inicializa o cliente do Textract
textract = boto3.client('textract', aws_access_key_id=AWS_ACCESS_KEY_ID, 
                         aws_secret_access_key=AWS_SECRET_ACCESS_KEY, 
                         region_name=AWS_REGION)

def process_document(bucket_name, document_name):
    # Inicia o processamento do documento
    response = textract.start_document_text_detection(
        DocumentLocation={'S3Object': {'Bucket': bucket_name, 'Name': document_name}}
    )

    # Salvar o JobId para verificar o status do processamento
    job_id = response['JobId']
    
    # Aguardar até que o Textract conclua o processamento
    while True:
        response = textract.get_document_text_detection(JobId=job_id)
        
        if 'JobStatus' in response and response['JobStatus'] in ['SUCCEEDED', 'FAILED']:
            break
        
        print("Aguardando...")  # Mensagem de status
        time.sleep(5)  # Aguardar 5 segundos entre as verificações
    
    return response

def extract_text_and_save(response, output_txt_path):
    with open(output_txt_path, 'w', encoding='utf-8') as txt_file:
        for item in response.get('Blocks', []):
            if item['BlockType'] == 'LINE':
                txt_file.write(item['Text'] + '\n')

def check_ocr_status(job_id):
    textract = boto3.client('textract', aws_access_key_id=AWS_ACCESS_KEY_ID, 
                             aws_secret_access_key=AWS_SECRET_ACCESS_KEY, 
                             region_name=AWS_REGION)

    # Chama a API para verificar o status do trabalho
    response = textract.get_document_analysis(JobId=job_id)

    # Lógica para tratar os diferentes estados do job
    if response['JobStatus'] == 'SUCCEEDED':
        return response
    elif response['JobStatus'] in ['FAILED', 'PARTIAL_SUCCESS']:
        raise Exception(f"O processamento falhou com o status: {response['JobStatus']}")
    else:
        return None  # Retorna None se o job ainda está em processamento

# Uso da função
if __name__ == "__main__":
    # Defina o nome do bucket e o arquivo PDF que foi enviado
    bucket_name = S3_BUCKET_NAME  # Obtém o nome do bucket do arquivo .env
    uploaded_pdf = 'example.pdf'  # Nome do arquivo PDF que foi enviado

    # Processa o documento
    response = process_document(bucket_name, uploaded_pdf)

    # Salvar texto extraído
    output_txt_path = r"C:\Users\Frank Webber\Documents\GitHub\digita-liza\results\resultado.txt"
    extract_text_and_save(response, output_txt_path)

    print("Texto extraído salvo em:", output_txt_path)
