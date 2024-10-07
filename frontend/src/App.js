import React, { useState, useEffect } from 'react'; 
import PDFList from './components/PDFList';         // Importa o componente para listar PDFs
import UploadForm from './components/UploadForm';     // Importa o componente de upload de arquivos
import PDFDetails from './components/PDFDetails';     // Importa o componente para mostrar detalhes do PDF
import DownloadText from './components/DownloadText'; // Importa o componente para download de texto (se aplicável)
import OCRButton from './components/OCRButton';       // Importa o componente para realizar OCR (se aplicável)
import Relatorio from './components/Relatorio';       // Importa o componente para gerar relatórios (se aplicável)
import './App.css';                                   // Importa os estilos

function App() {
  const [pdfs, setPdfs] = useState([]);              // Estado para armazenar a lista de PDFs
  const [selectedPdf, setSelectedPdf] = useState(null); // Estado para armazenar o PDF selecionado

  // Função para buscar a lista de PDFs
  const fetchPDFs = async () => {
    try {
      const response = await fetch('http://localhost:5000/status'); // Faz a requisição ao backend
      if (!response.ok) {
        throw new Error('Erro ao buscar o status dos PDFs'); // Lida com erros de resposta
      }
      const data = await response.json();
      // Transforma a resposta em uma lista de objetos com filename e status
      const pdfList = Object.keys(data).map(key => ({ filename: key, status: data[key].status }));
      setPdfs(pdfList); // Atualiza o estado com a lista de PDFs
    } catch (error) {
      console.error('Error fetching PDF status:', error); // Loga o erro no console
    }
  };

  // useEffect para buscar os PDFs ao carregar o componente
  useEffect(() => {
    fetchPDFs(); // Chama a função fetchPDFs ao montar o componente
  }, []); // O array vazio faz com que o fetch ocorra apenas uma vez, ao montar o componente

  return (
    <div className="App">
      <h1>DigitalizaLaudos</h1> // Título do aplicativo
      <UploadForm onUploadSuccess={fetchPDFs} /> {/* Formulário de upload */}
      <PDFList pdfs={pdfs} onSelectPdf={setSelectedPdf} /> {/* Lista de PDFs */}
      {selectedPdf && (  // Exibe os detalhes do PDF selecionado
        <PDFDetails filename={selectedPdf.filename} />
      )}
      {/* Se você estiver utilizando DownloadText, OCRButton ou Relatorio, adicione-os aqui */}
      {/* <DownloadText /> */}
      {/* <OCRButton /> */}
      {/* <Relatorio /> */}
    </div>
  );
}

export default App;
