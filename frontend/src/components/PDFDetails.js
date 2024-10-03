import React, { useState } from 'react';

const PDFDetails = ({ filename }) => {
  const [data, setData] = useState(null);

  const fetchData = () => {
    fetch(`/pdf/${filename}`)
      .then(response => response.json())
      .then(data => {
        if (data.data) {
          setData(data.data);
        } else {
          setData("Nenhum texto extraído encontrado.");
        }
      });
  };

  return (
    <div>
      <button onClick={fetchData}>Ver OCR</button>
      {data && <pre>{data}</pre>}
    </div>
  );
}

export default PDFDetails;
