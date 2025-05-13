const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const HF_MODEL = "HuggingFaceH4/zephyr-7b-beta";

// African client CORS setup
app.use(cors({ 
  origin: ["https://softai-lily-frontend.onrender.com", "http://localhost:3000"]
}));
app.use(express.json());

// Simple usage tracking
const usageDB = new Map();

// Health check for Render
app.get('/', (req, res) => {
  res.send('🌍 SoftAI Backend for African Businesses is LIVE!');
});

// African time function
async function getAfricanTime(location = "Africa/Lagos") {
  try {
    const formattedLocation = location.replace(/ /g, "_").replace(/\b\w/g, l => l.toUpperCase());
    const response = await axios.get(`https://worldtimeapi.org/api/timezone/Africa/${formattedLocation}`);
    const { datetime, timezone } = response.data;
    return {
      time: new Date(datetime).toLocaleTimeString("en-GB", { timeZone: `Africa/${formattedLocation}` }),
      zone: timezone.split("/")[1].replace(/_/g, " ")
    };
  } catch (error) {
    console.error("Time API Error:", error.message);
    return null;
  }
}

// Chat endpoint
app.post('/chat', async (req, res) => {
  const { message, clientId = "default-africa" } = req.body;
  
  try {
    // Usage tracking
    const usage = usageDB.get(clientId) || 0;
    if (usage >= 1000) {
      return res.json({ 
        response: "🔄 Upgrade your plan for more messages (Only 1000 Naira/month)" 
      });
    }

    // African time check
    if (/time in (?!.*england|.*london)/i.test(message.toLowerCase())) {
      const locationMatch = message.match(/time in (.+?)(\?|$)/i);
      const location = locationMatch ? locationMatch[1].replace(/[^a-zA-Z ]/g, "") : "Lagos";
      
      const timeData = await getAfricanTime(location);
      if (timeData) {
        usageDB.set(clientId, usage + 1);
        return res.json({
          response: `⏰ **African Time Check**\n${location}: ${timeData.time}\nZone: ${timeData.zone}`
        });
      }
    }

    // Hugging Face call
    const hfResponse = await axios.post(
      `https://api-inference.huggingface.co/models/${HF_MODEL}`,
      {
        inputs: `[INST] You are Lily, AI assistant for African businesses. Current year: 2024. ${message} [/INST]`,
        parameters: {
          max_new_tokens: 250,
          temperature: 0.7,
          return_full_text: false
        }
      },
      { headers: { Authorization: `Bearer ${process.env.HF_API_KEY}` } }
    );

    // Process response
    const rawResponse = hfResponse.data[0]?.generated_text || "";
    const cleanResponse = rawResponse
      .replace(/<\/?s>/g, "")
      .replace(/\[INST\].*\[\/INST\]/g, "")
      .trim();

    usageDB.set(clientId, usage + 1);
    res.json({ 
      response: `🌍 ${cleanResponse} (Powered by African AI)` 
    });

  } catch (error) {
    console.error("API Error:", error.message);
    res.json({
      response: "🌐 Our African servers are busy. Try again in 10 seconds!"
    });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🌍 Server running on port ${PORT} - Ready for African businesses!`);
});
