import React, { useState } from 'react';

function UploadForm({ onUploadSuccess, setFilename, setTxtFilePath }) {
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

<<<<<<< HEAD
    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];  // Captura o primeiro arquivo selecionado
        console.log('Arquivo selecionado:', selectedFile);  // Log para depuração
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
            setFilename(file.name); // Atualiza o filename
            setFile(null);  // Limpa o arquivo selecionado após o upload
            
            // Verifica o status do OCR automaticamente
            const statusResponse = await fetch(`http://127.0.0.1:5000/ocr-status/${data.jobId}`, {
                method: 'GET',
            });

            if (statusResponse.ok) {
                const { txt_path } = await statusResponse.json();
                if (txt_path) {
                    setTxtFilePath(txt_path); // Armazena o caminho do arquivo txt
                }
                console.log(`Arquivo TXT salvo em: ${txt_path}`); // Log do caminho do arquivo
            }

            // Chama a função de sucesso
            if (onUploadSuccess) {
                onUploadSuccess();  // Atualiza a lista de PDFs após o upload
            }
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
}
=======
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0]; // Pega o arquivo selecionado
    if (selectedFile && selectedFile.type !== 'application/pdf') {
      alert('Por favor, selecione um arquivo PDF válido.');
      setFile(null);
      return;
    }
    setFile(selectedFile);
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Previne o comportamento padrão do formulário

    if (!file) {
      alert('Por favor, selecione um arquivo PDF.');
      return; // Não prossegue se não houver arquivo
    }

    const formData = new FormData();
    formData.append('file', file); // Adiciona o arquivo ao FormData

    try {
      const response = await fetch('http://localhost:5000/upload', { // URL do seu backend Flask
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erro ao fazer upload do arquivo');
      }

      const data = await response.json(); // Espera a resposta JSON
      alert(data.message || data.error); // Exibe a mensagem de sucesso ou erro
      setFile(null); // Limpa o campo de arquivo após o upload
    } catch (error) {
      console.error('Erro ao fazer upload do arquivo:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Fazer Upload de PDF</h2>
      <input type="file" accept=".pdf" onChange={handleFileChange} required />
      <button type="submit">Enviar PDF</button>
    </form>
  );
};
>>>>>>> 6d679a4 (Atualizações no backend e frontend, incluindo ajustes no processamento OCR e upload de PDFs)

export default UploadForm;
