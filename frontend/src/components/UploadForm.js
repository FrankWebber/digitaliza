import React, { useState } from 'react';

const UploadForm = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (!file) {
      alert('Por favor, selecione um arquivo PDF.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    fetch('/upload', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        alert(data.message || data.error);
        setFile(null); // Limpar o campo de arquivo após o upload
      })
      .catch(error => {
        console.error('Erro ao fazer upload do arquivo:', error);
      });
  };

  return (
    <div>
      <h2>Fazer Upload de PDF</h2>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <button onClick={handleUpload}>Enviar PDF</button>
    </div>
  );
};

export default UploadForm;
