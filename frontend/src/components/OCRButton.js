import React from 'react';

const OCRButton = ({ filename, onOCR }) => {
  const handleClick = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/pdf/${filename}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Erro ao solicitar OCR');
      }

      const data = await response.json();
      console.log(data);
      onOCR(data); // Chama a função onOCR passada como prop
    } catch (error) {
      console.error('Erro ao processar OCR:', error);
    }
  };

  return (
    <button onClick={handleClick}>
      Processar OCR
    </button>
  );
};

export default OCRButton;
