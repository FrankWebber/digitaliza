import React from 'react';

const DownloadText = ({ text, filename }) => {
  const downloadFile = () => {
    const blob = new Blob([text], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.txt`;
    link.click();
  };

  return (
    <div>
      <button onClick={downloadFile} disabled={!text}>
        Baixar Texto Extraído
      </button>
    </div>
  );
};

export default DownloadText;
