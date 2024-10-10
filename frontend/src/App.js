import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
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
=======
import PDFList from './components/PDFList';  // Import the PDFList component
import UploadForm from './components/UploadForm';  // Import the UploadForm component
import './App.css';  // Import CSS styles

function App() {
  const [pdfs, setPdfs] = useState([]);  // State for storing the list of PDFs
  const [loading, setLoading] = useState(true);  // State for loading status
  const [error, setError] = useState(null);  // State for error messages

  useEffect(() => {
    const fetchPDFStatus = async () => {
      try {
        const response = await fetch('/status');  // Fetch PDF status from the backend
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);  // Handle HTTP errors
        }
        const data = await response.json();  // Parse the JSON response
        // Map the data to the desired format
        const pdfList = Object.keys(data).map(key => ({
          filename: key,
          status: data[key].status,
        }));
        setPdfs(pdfList);  // Update the PDF state
      } catch (error) {
        setError(error.message);  // Update the error state
      } finally {
        setLoading(false);  // Set loading to false
      }
    };

    fetchPDFStatus();  // Call the function to fetch PDF status
  }, []);  // The effect runs only once when the component mounts
>>>>>>> 6d679a4 (Atualizações no backend e frontend, incluindo ajustes no processamento OCR e upload de PDFs)

  return (
    <div className="App">
      <h1>DigitalizaLaudos</h1>
<<<<<<< HEAD
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
=======
      <UploadForm />  {/* Render the upload form */}
      {loading && <p>Loading...</p>}  {/* Show loading message */}
      {error && <p>Error fetching data: {error}</p>}  {/* Show error message */}
      <PDFList pdfs={pdfs} />  {/* Render the PDF list */}
>>>>>>> 6d679a4 (Atualizações no backend e frontend, incluindo ajustes no processamento OCR e upload de PDFs)
    </div>
  );
}

export default App;  // Export the App component
