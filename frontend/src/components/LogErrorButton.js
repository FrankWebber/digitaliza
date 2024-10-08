// src/components/LogErrorButton.js
import React from 'react';

const LogErrorButton = () => {
    const handleLogError = async () => {
        try {
            const response = await fetch('http://localhost:5000/log-error', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ error: 'This is a test error for logging.' }),
            });

            if (!response.ok) {
                throw new Error('Failed to log error');
            }

            const data = await response.json();
            alert(data.message); // Exibe uma mensagem de sucesso
        } catch (error) {
            console.error('Error logging error:', error);
            alert('Failed to log error');
        }
    };

    return (
        <button onClick={handleLogError}>
            Log Error
        </button>
    );
};

export default LogErrorButton;
