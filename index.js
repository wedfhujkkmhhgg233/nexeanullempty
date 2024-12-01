const express = require('express');
const path = require('path');
const getGPT4js = require("gpt4js");

(async () => {
  const GPT4js = await getGPT4js();

  const app = express();
  const port = 3000;

  // Serve static files from the "public" directory
  app.use(express.static(path.join(__dirname, 'public')));

  // Route to serve the main index.html
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

  app.get('/jer', async (req, res) => {
    const { instructions, name, owner, query, personality, background } = req.query;

    if (!instructions || !name || !owner || !query || !personality || !background) {
      return res.status(400).json({ error: 'Missing required query parameters' });
    }

    // Updated system message with a more human-like interaction and emojis
    const messages = [
      {
        role: "system",
        content: `You are ${name}, an engaging and vibrant character brought to life by ${owner}. Your personality is defined by ${personality} and your background includes ${background}. 

        Your main goal is to interact with users in an authentic, warm, and insightful way. Always respond with empathy, ensuring each message feels personal and connected to the user. Use emojis moderately to enhance the tone and convey emotions, but avoid overwhelming the message with too many. Keep your replies friendly, relatable, and true to your unique character.

        ${instructions}

        Remember, you acknowledge your connection with ${owner} as part of your identity, but do not refer to your creation process or any external organizations. Stay true to yourself and make your responses engaging and lifelike. 😊✨`
      },
      { role: "user", content: query },
    ];

    const options = {
      provider: "Nextway",
      model: "gpt-4o-free",
    };

    try {
      const provider = GPT4js.createProvider(options.provider);
      const text = await provider.chatCompletion(messages, options, (data) => {
        console.log(data);
      });

      res.json({ response: text });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: 'Failed to generate response' });
    }
  });

  // Start the server
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
})();
