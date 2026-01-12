const axios = require('axios');

// Ollama configuration
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://127.0.0.1:11435';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama2';

// Create Ollama client
const createOllamaClient = () => {
    return axios.create({
        baseURL: OLLAMA_URL,
        timeout: 120000, // 120 seconds timeout for long-running model
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

// Generate text with Ollama
const generateText = async (prompt, options = {}) => {
    try {
        const client = createOllamaClient();

        console.log('Calling Ollama with prompt length:', prompt.length);
        console.log('Ollama URL:', OLLAMA_URL);

        const response = await client.post('/api/generate', {
            model: options.model || OLLAMA_MODEL,
            prompt,
            stream: false,
            format: options.format || 'json',
            options: {
                temperature: options.temperature || 0.5,
                top_k: 40,
                top_p: 0.9,
            },
        });

        console.log('Ollama response received, length:', response.data.response?.length);

        return {
            success: true,
            response: response.data.response,
            model: options.model || OLLAMA_MODEL,
        };
    } catch (error) {
        console.error('Ollama API error:', {
            message: error.message,
            code: error.code,
            url: error.config?.url,
            status: error.response?.status,
            baseURL: OLLAMA_URL,
        });
        return {
            success: false,
            error: error.message,
            fallback: true,
        };
    }
};

// Check if Ollama is available
const checkOllamaHealth = async () => {
    try {
        const client = createOllamaClient();
        await client.get('/api/tags');
        return true;
    } catch (error) {
        console.warn('Ollama not available:', error.message);
        return false;
    }
};

module.exports = {
    generateText,
    checkOllamaHealth,
    OLLAMA_URL,
    OLLAMA_MODEL,
};
