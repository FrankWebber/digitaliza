import boto3

def process_ocr(pdf_path, result_path):
    client = boto3.client('textract')

    with open(pdf_path, 'rb') as file:
        response = client.analyze_document(
            Document={'Bytes': file.read()},
            FeatureTypes=["TABLES", "FORMS"]
        )

        blocks = response['Blocks']
        extracted_text = "\n".join([block['Text'] for block in blocks if block['BlockType'] == 'LINE'])

        # Salvar o texto extraído em um arquivo .txt no caminho de resultados
        txt_output_path = f'{result_path}.txt'
        with open(txt_output_path, 'w') as output_file:
            output_file.write(extracted_text)

        print(f'Texto extraído salvo em: {txt_output_path}')
