import React, { useState } from 'react';

function UploadForm({ onUploadSuccess }) {
  const [file, setFile] = useState(null);  // Estado para armazenar o arquivo selecionado
  const [isUploading, setIsUploading] = useState(false);  // Estado para controlar o status de upload

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);  // Atualiza o estado com o arquivo selecionado
  };

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!file) {
      alert('Por favor, selecione um arquivo para upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setIsUploading(true);  // Inicia o processo de upload (mostrar indicador, desabilitar botão, etc.)

    try {
      const response = await fetch('http://127.0.0.1:5000/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao fazer upload do arquivo.');
      }

      alert('Arquivo enviado com sucesso!');
      setFile(null);  // Limpa o arquivo selecionado após o upload
      if (onUploadSuccess) {
        onUploadSuccess();  // Atualiza a lista de PDFs após o upload
      }
    } catch (error) {
      alert(`Erro ao enviar arquivo: ${error.message}`);
    } finally {
      setIsUploading(false);  // Finaliza o processo de upload (remover indicador, habilitar botão, etc.)
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

export default UploadForm;
