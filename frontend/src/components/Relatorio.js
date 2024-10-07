import React, { useState } from 'react';

const ConsoleOutput = () => {
    const [messages, setMessages] = useState([]);

    const addMessage = (newMessage) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    const handleUpload = async (file) => {
        addMessage("Iniciando o upload do arquivo para o bucket S3...");

        // Simular upload para S3
        try {
            await uploadFileToS3(file);
            addMessage(`Upload do arquivo ${file.name} concluído.`);
        } catch (error) {
            addMessage("Ocorreu um erro durante o upload. Tente novamente.");
            return;
        }

        addMessage(`Iniciando o processamento OCR para o arquivo ${file.name}...`);
        
        // Simular processamento OCR
        try {
            await processOCR(file.name);
            addMessage(`Processamento OCR concluído para o arquivo ${file.name}.`);
            addMessage(`O arquivo ${file.name} foi convertido com sucesso para TXT. Faça o download agora!`);
        } catch (error) {
            addMessage(`Erro ao processar o arquivo ${file.name}. Verifique se o arquivo é um PDF válido.`);
        }
    };

    const uploadFileToS3 = (file) => {
        return new Promise((resolve) => {
            setTimeout(resolve, 2000); // Simulando um atraso de 2 segundos
        });
    };

    const processOCR = (filename) => {
        return new Promise((resolve) => {
            setTimeout(resolve, 3000); // Simulando um atraso de 3 segundos
        });
    };

    return (
        <div style={{ background: '#1e1e1e', color: '#ffffff', padding: '20px', borderRadius: '5px', height: '300px', overflowY: 'scroll' }}>
            <h3>Console Output</h3>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>{msg}</div>
                ))}
            </div>
            <button onClick={() => handleUpload({ name: 'example.pdf' })}>Iniciar Processamento</button>
        </div>
    );
};

export default ConsoleOutput;
