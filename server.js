const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Replaces body-parser (built into Express)

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).send('SoftAI - Lily backend is live!');
});

// Chat endpoint (matches frontend expectation)
app.post('/chat', async (req, res) => {
  const userMessage = req.body.message; // Changed from 'question' to 'message'
  
  if (!userMessage) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const response = await axios.post(
      'https://api.deepseek.com/v1/chat/completions',
      {
        model: "deepseek-chat",
        messages: [{ role: "user", content: userMessage }],
        temperature: 0.7,
        max_tokens: 500 // Added for response length control
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Enhanced error handling for Deepseek response
    const aiResponse = response.data?.choices?.[0]?.message?.content 
      || "I couldn't process that request. Please try again.";
      
    res.json({ response: aiResponse }); // Matches frontend expectation

  } catch (error) {
    console.error('Deepseek API Error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: "AI service unavailable",
      details: error.response?.data?.error?.message || error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
