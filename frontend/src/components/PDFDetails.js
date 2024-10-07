import React, { useState } from 'react';

const PDFDetails = ({ filename }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/pdf/${filename}`);
      const result = await response.json();
      if (result.data) {
        setData(result.data);
      } else {
        setData("Nenhum texto extraído encontrado.");
      }
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      setData("Erro ao buscar dados.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={fetchData} disabled={loading}>
        {loading ? 'Carregando...' : 'Ver OCR'}
      </button>
      {data && <pre>{data}</pre>}
    </div>
  );
};

export default PDFDetails;
