import React, { useState, useEffect } from 'react';
import PDFList from './components/PDFList';
import UploadForm from './components/UploadForm';
import PDFDetails from './components/PDFDetails';
import ConsoleOutput from './components/ConsoleOutput'; // Importa o ConsoleOutput
import './App.css';

function App() {
  const [pdfs, setPdfs] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [jobId, setJobId] = useState(null);
  const [filename, setFilename] = useState(null);
  const [txtFilePath, setTxtFilePath] = useState(null); // Para armazenar o caminho do arquivo .txt

  const fetchPDFs = async () => {
    try {
      const response = await fetch('http://localhost:5000/status');
      if (!response.ok) {
        throw new Error('Erro ao buscar o status dos PDFs');
      }
      const data = await response.json();
      const pdfList = Object.keys(data).map(key => ({ filename: key, status: data[key].status }));
      setPdfs(pdfList);
    } catch (error) {
      console.error('Error fetching PDF status:', error);
      alert("Ocorreu um erro ao buscar o status dos PDFs. Verifique se o backend está funcionando.");
    }
  };

  useEffect(() => {
    fetchPDFs();
  }, []);

  return (
    <div className="App">
      <h1>DigitalizaLaudos</h1>
      <UploadForm 
        onUploadSuccess={fetchPDFs} 
        setJobId={setJobId} 
        setFilename={setFilename} 
        setTxtFilePath={setTxtFilePath} // Não esqueça de passar isso
      />
      <PDFList pdfs={pdfs} onSelectPdf={setSelectedPdf} />
      {selectedPdf && <PDFDetails filename={selectedPdf.filename} />}
      {txtFilePath && <p>Arquivo TXT salvo em: {txtFilePath}</p>} {/* Exibe o caminho do arquivo txt */}
      <ConsoleOutput jobId={jobId} filename={filename} /> {/* Adiciona o ConsoleOutput */}
    </div>
  );
}

export default App;
