const express = require('express');  
const cors = require('cors');  
const axios = require('axios');  
require('dotenv').config();  

const app = express();  
const PORT = process.env.PORT || 3000;  

// Allow requests ONLY from your frontend URL  
app.use(cors({ origin: 'https://softai-lily-frontend.onrender.com' }));  
app.use(express.json());  

// Health check  
app.get('/', (req, res) => {  
  res.send('Backend is live!');  
});  

// Chat endpoint  
app.post('/chat', async (req, res) => {  
  const { message } = req.body;  
  console.log('User message:', message);  

  try {  
    const response = await axios.post(  
      'https://api.deepseek.com/v1/chat/completions',  
      {  
        model: "deepseek-chat",  
        messages: [{ role: "user", content: message }],  
        temperature: 0.7  
      },  
      {  
        headers: {  
          'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,  
          'Content-Type': 'application/json'  
        }  
      }  
    );  

    const aiResponse = response.data.choices[0].message.content;  
    res.json({ response: aiResponse });  

  } catch (error) {  
    console.error('Deepseek API Error:', error.response?.data || error.message);  
    res.status(500).json({ error: "AI service unavailable" });  
  }  
});  

// Start server  
app.listen(PORT, '0.0.0.0', () => {  
  console.log(`Server running on port ${PORT}`);  
});  