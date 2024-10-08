import React, { useState, useEffect } from 'react';

const Relatorio = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Função para buscar logs do backend
  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:5000/logs'); // Endpoint que você precisa implementar no backend
      if (!response.ok) {
        throw new Error('Erro ao buscar logs do servidor');
      }
      const data = await response.json();
      setLogs(data.logs || []);
    } catch (error) {
      console.error('Erro ao buscar logs:', error);
      setLogs(['Erro ao buscar logs']);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 1000); // Atualiza os logs a cada 1 segundos
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h3>Relatório de Atividades do Backend</h3>
      {loading ? (
        <p>Carregando logs...</p>
      ) : (
        <ul>
          {logs.map((log, index) => (
            <li key={index}>{log}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Relatorio;
