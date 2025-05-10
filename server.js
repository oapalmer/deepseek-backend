const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Hugging Face model (lightweight for African internet speeds)
const HF_MODEL = "HuggingFaceH4/zephyr-7b-beta";

// Configure CORS for your frontend
app.use(cors({ origin: "https://softai-lily-frontend.onrender.com" }));
app.use(express.json());

// Track usage (replace with database later)
const usageDB = new Map();

// Chat endpoint
app.post('/chat', async (req, res) => {
  const { message, clientId = "default" } = req.body;

  try {
    // Free tier: 1000 messages/client/month
    const usage = usageDB.get(clientId) || 0;
    if (usage >= 1000) {
      return res.json({ 
        response: "🔄 Upgrade plan for more messages (only $1/month)" 
      });
    }

    // Call Hugging Face API
    const hfResponse = await axios.post(
      `https://api-inference.huggingface.co/models/${HF_MODEL}`,
      {
        inputs: `<|user|>${message}</s><|assistant|>`,
        parameters: { max_new_tokens: 150, temperature: 0.7 }
      },
      { headers: { Authorization: `Bearer ${process.env.HF_API_KEY}` } }
    );

    // Update usage
    usageDB.set(clientId, usage + 1);

    // Clean response
    const aiResponse = hfResponse.data[0]?.generated_text
      .split("<|assistant|>")[1]
      .replace(/<\/?s>/g, "")
      .trim();

    res.json({ response: aiResponse });

  } catch (error) {
    console.error("Hugging Face Error:", error.response?.data || error.message);
    res.json({
      response: "🌍 Our African servers are busy. Try again in 10 seconds!"
    });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server ready for African businesses on port ${PORT}`);
});