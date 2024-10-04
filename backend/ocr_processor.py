import boto3

def process_ocr(pdf_filename):
    s3_client = boto3.client('s3')
    bucket_name = 'bucketparaocrlaudos'  # Nome do bucket S3

    # Extrair o conteúdo do PDF do S3
    response = s3_client.get_object(Bucket=bucket_name, Key=pdf_filename)
    pdf_bytes = response['Body'].read()

    client = boto3.client('textract')
    
    response = client.analyze_document(
        Document={'Bytes': pdf_bytes},
        FeatureTypes=["TABLES", "FORMS"]
    )

    blocks = response['Blocks']
    extracted_text = "\n".join([block['Text'] for block in blocks if block['BlockType'] == 'LINE'])

    # Salvar o texto extraído em um arquivo .txt no caminho de resultados
    txt_output_path = f'../results/{pdf_filename}.txt'
    with open(txt_output_path, 'w') as output_file:
        output_file.write(extracted_text)

    print(f'Texto extraído salvo em: {txt_output_path}')
