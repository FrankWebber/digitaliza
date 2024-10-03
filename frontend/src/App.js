import React, { useState, useEffect } from 'react';
import PDFList from './components/PDFList';
import UploadForm from './components/UploadForm';  // Importar o componente UploadForm
import './App.css';

function App() {
  const [pdfs, setPdfs] = useState([]);

  useEffect(() => {
    fetch('/status')
      .then(response => response.json())
      .then(data => setPdfs(Object.keys(data).map(key => ({ filename: key, status: data[key].status }))));
  }, []);

  return (
    <div className="App">
      <h1>DigitalizaLaudos</h1>
      <UploadForm />  {/* Adicionar o formulário de upload */}
      <PDFList pdfs={pdfs} />
    </div>
  );
}

export default App;
