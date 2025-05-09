const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  console.log('Health check received');
  res.status(200).send('SoftAI - Lily backend is live!');
});

// Chat endpoint
app.post('/chat', async (req, res) => {
  try {
    const userMessage = req.body.message;
    console.log('Received message:', userMessage);

    const response = await axios.post(
      'https://api.deepseek.com/v1/chat/completions',
      {
        model: "deepseek-chat",
        messages: [{ role: "user", content: userMessage }],
        temperature: 0.7,
        max_tokens: 500
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const aiResponse = response.data?.choices?.[0]?.message?.content 
      || "Response unavailable.";
    res.json({ response: aiResponse });

  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: "Internal server error",
      details: error.response?.data?.error?.message || error.message 
    });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
