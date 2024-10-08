import React, { useState } from 'react';

// Componente UploadForm para upload de PDF
const UploadForm = ({ onUploadSuccess, setJobId, setFilename }) => {
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        console.log('Arquivo selecionado:', selectedFile);
        setFile(selectedFile);  // Atualiza o estado com o arquivo selecionado
    };

    const handleUpload = async (event) => {
        event.preventDefault();

        if (!file) {
            alert('Por favor, selecione um arquivo para upload.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);  // Adiciona o arquivo ao FormData

        console.log('FormData pronto:', formData.get('file')); // Log para depuração

        setIsUploading(true);  // Inicia o processo de upload

        try {
            const response = await fetch('http://127.0.0.1:5000/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao fazer upload do arquivo.');
            }

            const data = await response.json();
            alert('Arquivo enviado com sucesso!');
            setJobId(data.jobId);  // Atualiza o jobId
            setFilename(file.name); // Atualiza o filename
            setFile(null);  // Limpa o arquivo selecionado após o upload
            
            // Retorna o jobId para o OCRButton
            return data.jobId;  
        } catch (error) {
            alert(`Erro ao enviar arquivo: ${error.message}`);  // Mensagem de erro
        } finally {
            setIsUploading(false);  // Finaliza o processo de upload
        }
    };

    return (
        <form onSubmit={handleUpload}>
            <input
                type="file"
                accept=".pdf"  // Limita a seleção apenas para arquivos PDF
                onChange={handleFileChange}
                disabled={isUploading}  // Desabilita o input durante o upload
            />
            <button type="submit" disabled={isUploading}>
                {isUploading ? 'Enviando...' : 'Enviar PDF'}
            </button>
        </form>
    );
};

// Componente OCRButton para processar OCR
const OCRButton = ({ file, onOCR, setTxtFilePath }) => { 
    const [jobId, setJobId] = useState(null);
    const [status, setStatus] = useState(null);

    const handleClick = async () => {
        console.log('Arquivo enviado:', file);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const startResponse = await fetch('http://127.0.0.1:5000/upload', {
                method: 'POST',
                body: formData,
            });

            if (!startResponse.ok) {
                throw new Error('Erro ao iniciar o OCR');
            }

            const { jobId: newJobId } = await startResponse.json();
            setJobId(newJobId);

            const statusInterval = setInterval(async () => {
                const statusResponse = await fetch(`http://127.0.0.1:5000/ocr-status/${newJobId}`, {
                    method: 'GET',
                });

                if (!statusResponse.ok) {
                    throw new Error('Erro ao verificar status do OCR');
                }

                const { status, txt_path } = await statusResponse.json();
                setStatus(status);

                if (txt_path) {
                    setTxtFilePath(txt_path); // Armazena o caminho do arquivo txt
                    alert(`Arquivo TXT salvo em: ${txt_path}`); // Informa o usuário sobre o caminho do arquivo
                }

                if (status === 'SUCCEEDED') {
                    clearInterval(statusInterval);  
                    onOCR(txt_path);  
                }
            }, 5000);  
        } catch (error) {
            console.error('Erro ao processar OCR:', error);
        }
    };

    return (
        <div>
            <button onClick={handleClick} disabled={!file}>
                Processar OCR
            </button>
            {status && <p>Status do OCR: {status}</p>}
        </div>
    );
};

// Exportando ambos os componentes como nomeados
export { UploadForm, OCRButton };
