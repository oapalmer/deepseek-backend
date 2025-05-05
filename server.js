const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('SoftAI Backend is working!');
});

app.post('/ask', async (req, res) => {
  const userQuestion = req.body.prompt;

  try {
    const response = await axios.post(
      'https://api.deepseek.com/v1/chat/completions',
      {
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: userQuestion }],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer sk-26597fba1c774f96ab32fefc89c442b3',
        },
      }
    );

    const aiReply = response.data.choices[0].message.content;
    res.json({ reply: aiReply });
  } catch (error) {
    console.error('Error calling Deepseek API:', error.message);
    res.status(500).json({ error: 'Deepseek API failed.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
