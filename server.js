// Add this function  
async function getRealTime(location = "Europe/London") {  
  try {  
    const response = await axios.get(`https://worldtimeapi.org/api/timezone/${location}`);  
    const { datetime, timezone } = response.data;  
    return new Date(datetime).toLocaleTimeString("en-GB", { timeZone: location });  
  } catch (error) {  
    return null;  
  }  
}  

// Modify the /chat endpoint  
app.post('/chat', async (req, res) => {  
  const { message } = req.body;  

  // Detect time questions  
  if (message.toLowerCase().includes("time in")) {  
    const location = message.match(/time in (.+)/i)?.[1] || "Europe/London";  
    const currentTime = await getRealTime(location.replace(/ /g, "_"));  
    if (currentTime) {  
      return res.json({  
        response: `⏰ Current time in ${location}: ${currentTime} (${location} timezone)`  
      });  
    }  
  }  

  // Fallback to Hugging Face for other questions  
  // ... rest of your existing code ...  
});  