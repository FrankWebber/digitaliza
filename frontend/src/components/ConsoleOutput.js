import React, { useState, useEffect } from 'react';

const ConsoleOutput = ({ jobId, filename }) => {
  const [messages, setMessages] = useState([]);
  const [ocrStatus, setOcrStatus] = useState(null);

  useEffect(() => {
    if (jobId) {
      const statusInterval = setInterval(async () => {
        try {
          const response = await fetch(`http://127.0.0.1:5000/ocr-status/${jobId}`);
          if (!response.ok) {
            throw new Error('Erro ao verificar status do OCR');
          }

          const data = await response.json();
          setOcrStatus(data.status);
          addMessage(`Status do OCR: ${data.status}`);

          if (data.status === 'SUCCEEDED' || data.status === 'FAILED') {
            clearInterval(statusInterval);
          }
        } catch (error) {
          console.error('Erro ao verificar status do OCR:', error);
        }
      }, 5000); // Verifica o status a cada 5 segundos

      return () => clearInterval(statusInterval); // Limpa o intervalo ao desmontar
    }
  }, [jobId]);

  const addMessage = (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  return (
    <div style={{
      background: '#1e1e1e',
      color: '#ffffff',
      padding: '20px',
      borderRadius: '5px',
      height: '300px',
      overflowY: 'scroll',
      fontFamily: 'monospace',
    }}>
      <h3>Status do Console</h3>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      {filename && <p>Arquivo: {filename}</p>}
      {ocrStatus && <p>Status do OCR: {ocrStatus}</p>}
    </div>
  );
};

export default ConsoleOutput;
