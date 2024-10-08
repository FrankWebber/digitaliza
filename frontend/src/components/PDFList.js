import React from 'react';
import { OCRButton } from './OCRButton'; // Importa o OCRButton como uma exportação nomeada

const PDFList = ({ pdfs, onSelectPdf, setTxtFilePath }) => { // Inclua setTxtFilePath se necessário
  return (
    <div>
      <h2>Lista de PDFs Digitalizados</h2>
      <ul>
        {pdfs.map((pdf, index) => (
          <li key={index}>
            <p>{pdf.filename} - {pdf.status}</p>
            {/* Passa filename e outras props necessárias para o OCRButton */}
            <OCRButton 
              file={pdf.filename} // Certifique-se de que isso está correto
              onOCR={onSelectPdf} 
              setTxtFilePath={setTxtFilePath} // Inclua se for necessário
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PDFList;
