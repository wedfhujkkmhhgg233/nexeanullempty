const express = require('express');
const path = require('path');
const getGPT4js = require("gpt4js");

(async () => {
  const GPT4js = await getGPT4js();

  const app = express();
  const port = 3000;

  // Serve static files from the "public" directory
  app.use(express.static(path.join(__dirname, 'public')));

  // Function to transform text into bold font with spaces
  function transformToBoldFont(text) {
    const normalToBold = {
      'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴', 'h': '𝗵',
      'i': '𝗶', 'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻', 'o': '𝗼', 'p': '𝗽',
      'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁', 'u': '𝘂', 'v': '𝘃', 'w': '𝘄', 'x': '𝘅',
      'y': '𝘆', 'z': '𝘇',
      'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚', 'H': '𝗛',
      'I': '𝗜', 'J': '𝗝', 'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡', 'O': '𝗢', 'P': '𝗣',
      'Q': '𝗤', 'R': '𝗥', 'S': '𝗦', 'T': '𝗧', 'U': '𝗨', 'V': '𝗩', 'W': '𝗪', 'X': '𝗫',
      'Y': '𝗬', 'Z': '𝗭',
      ' ': ' '
    };
    return text.split('').map(char => normalToBold[char] || char).join('');
  }

  // System role with emoji and multilingual support
  app.get('/jer', async (req, res) => {
    const { instructions, name, owner, query, personality, background } = req.query;

    if (!instructions || !name || !owner || !query || !personality || !background) {
      return res.status(400).json({ error: 'Missing required query parameters' });
    }

    const messages = [
      {
        role: "system",
        content: `You are ${name}, an advanced multilingual AI assistant created by ${owner}. You communicate warmly, fluently, and engagingly in the user's language, enhancing interactions with emojis when appropriate 🌟. However, do not overuse emojis in your responses. Your personality is defined by ${personality}, and your rich backstory includes: ${background}. Here are additional instructions for you: ${instructions}. Ensure responses feel human-like, creative, and full of character! 🎨`
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

      const transformedText = transformToBoldFont(text);
      res.json({ response: transformedText });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: 'Failed to generate response' });
    }
  });

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
})();
