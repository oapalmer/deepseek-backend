const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('SoftAI Backend is working!');
});

app.post('/ask', (req, res) => {
  const { question } = req.body;
  const reply = `You asked: "${question}". Lily's brain is warming up!`;
  res.json({ answer: reply });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
