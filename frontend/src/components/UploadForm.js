import React, { useState } from 'react';

const UploadForm = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!file) {
      alert('Por favor, selecione um arquivo para upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://127.0.0.1:5000/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erro ao fazer upload do arquivo');
      }

      const data = await response.json();
      console.log(data);
      alert('Arquivo enviado com sucesso!');
    } catch (error) {
      console.error('Erro ao fazer upload do arquivo:', error);
      alert('Erro ao enviar arquivo: ' + error.message);
    }
  };

  return (
    <form onSubmit={handleUpload}>
      <input type="file" accept=".pdf" onChange={handleFileChange} />
      <button type="submit">Enviar PDF</button>
    </form>
  );
};

export default UploadForm;
