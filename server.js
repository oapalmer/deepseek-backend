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
          'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        },
      }
    );

    console.log('Deepseek API response:', response.data);

    // Try to extract message content safely
    const aiReply = response.data.choices?.[0]?.message?.content || 'Lily had no reply.';

    res.json({ reply: aiReply });
  } catch (error) {
    console.error('Error calling Deepseek API:', error.message);
    res.status(500).json({ error: 'Deepseek API failed.' });
  }
});
