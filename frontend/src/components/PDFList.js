import React from 'react';
import PDFDetails from './PDFDetails';

const PDFList = ({ pdfs }) => {
  return (
    <div>
      <h2>Lista de PDFs Digitalizados</h2>
      <ul>
        {pdfs.map((pdf, index) => (
          <li key={index}>
            <p>{pdf.filename} - {pdf.status}</p>
            <PDFDetails filename={pdf.filename} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PDFList;
