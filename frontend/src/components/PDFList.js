import React from 'react';
import OCRButton from './OCRButton'; // Importa o OCRButton para cada PDF

const PDFList = ({ pdfs, onSelectPdf }) => {
  return (
    <div>
      <h2>Lista de PDFs Digitalizados</h2>
      <ul>
        {pdfs.map((pdf, index) => (
          <li key={index}>
            <p>{pdf.filename} - {pdf.status}</p>
            <OCRButton filename={pdf.filename} onOCR={onSelectPdf} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PDFList;
