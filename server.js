const express = require('express');
const app = express();
const port = 3000;

// Respond to root GET request
app.get('/', (req, res) => {
  res.send('SoftAI Backend is working!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
