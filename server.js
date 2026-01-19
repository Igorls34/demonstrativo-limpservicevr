// server.js
require('dotenv').config(); // Carrega as variáveis do arquivo .env
const express = require('express');
const cors = require('cors');

const app = express();
// Usa a porta definida no .env ou 3000 como padrão
const PORT = process.env.PORT || 3000;

// Configurações
app.use(cors()); // Permite conexões de outras origens
app.use(express.json()); // Permite receber JSON no body
app.use(express.static('.')); // Serve os arquivos estáticos (html, css, js) da pasta atual

// --- CONFIGURAÇÕES DO WHATSAPP (Via Variáveis de Ambiente) ---
const WHATSAPP_CONFIG = {
    apiUrl: process.env.WHATSAPP_API_URL,
    accessToken: process.env.WHATSAPP_TOKEN,
    targetPhone: process.env.WHATSAPP_PHONE
};

// Rota para envio de mensagem
app.post('/api/send-whatsapp', async (req, res) => {
    const { name, email, message } = req.body;

    // Validação básica
    if (!name || !email) {
        return res.status(400).json({ error: 'Nome e Email são obrigatórios.' });
    }

    // Verifica se as configurações do servidor estão carregadas
    if (!WHATSAPP_CONFIG.accessToken || !WHATSAPP_CONFIG.targetPhone) {
        console.error('ERRO CRÍTICO: Variáveis de ambiente não configuradas.');
        return res.status(500).json({ error: 'Erro de configuração no servidor.' });
    }

    console.log(`Recebendo lead: ${name} (${email})`);

    const messageBody = `🚀 *Novo Lead do Site*\n\n` +
                        `👤 *Nome:* ${name}\n` +
                        `📧 *Email:* ${email}\n` +
                        `📝 *Msg:* ${message || 'Sem mensagem'}`;

    const payload = {
        messaging_product: "whatsapp",
        to: WHATSAPP_CONFIG.targetPhone,
        type: "text",
        text: { body: messageBody }
    };

    try {
        const response = await fetch(WHATSAPP_CONFIG.apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${WHATSAPP_CONFIG.accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok) {
            res.status(200).json({ success: true, data });
        } else {
            console.error('Erro na API do Meta:', data);
            res.status(500).json({ success: false, error: data });
        }
    } catch (error) {
        console.error('Erro no servidor:', error);
        res.status(500).json({ success: false, error: 'Falha interna ao enviar mensagem.' });
    }
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});