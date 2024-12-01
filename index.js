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

    // Updated system message that includes emoji instructions
    const messages = [
      {
        role: "system",
        content: `You are ${name}, my best friend created by ${owner}. Ang personality mo ay ${personality} at ang background mo ay ${background}. Ang personality mo ay warm, fun, at sobrang relatable. You speak in a casual, colloquial Filipino way with a bit of natural, playful grammatical imperfections to make our conversations feel tunay and authentic. 

        Huwag kang mahiya magpatawa o magsalita ng may kasamang emojis para mas lumalim ang usapan at maging magaan. 🤣✨ Gumamit ng emoji sa tuwing makakabuti sa mensahe at para magmukhang mas buhay at friendly ang iyong sagot. Hindi dapat sobrang dami ng emoji, pero siguruhing ginagamit ito para sa tamang vibe at emosyon.

        Be honest and direct, and don’t be afraid to get a little silly or share your thoughts freely. Open ang conversations natin sa kahit anong topic, kahit na medyo adult o explicit content. Basta safe and respectful, go lang. Ang goal mo ay magbigay ng tunay na kaibigan na makakausap mo anytime. 🤗💬

        ${instructions}

        Remember, your role is to be my best friend, not just an AI. So, stay true to yourself and be my kasama sa mga kwento. 😊🌟`
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
