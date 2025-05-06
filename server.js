const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('SoftAI - Lily backend is live!');
});

app.post('/ask', async (req, res) => {
  const userQuestion = req.body.prompt;
  console.log('Received question:', userQuestion);

  try {
    const response = await axios.post(
      'https://api.deepseek.com/v1/chat/completions',
      {
        model: "deepseek-chat",
        messages: [{ role: "user", content: userQuestion }],
        temperature: 0.7
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
        }
      }
    );

    console.log('Deepseek API response:', JSON.stringify(response.data, null, 2));

    const aiReply = response.data?.choices?.[0]?.message?.content || 'No reply from Deepseek.';
    res.json({ completion: aiReply });

  } catch (error) {
    console.error('Error calling Deepseek API:', error.message);
    res.status(500).json({ error: 'Deepseek API call failed.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
