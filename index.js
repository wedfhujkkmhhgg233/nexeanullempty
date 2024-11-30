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

  // Function to convert regular text to a special bolded font with spaces
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

  // Function to process and transform text with the specific styling
  function processAndTransformText(text) {
    return text.replace(/(?:\*\*|_)(.*?)\1/g, (match, p1) => {
      // Transform the content inside ** or * to bold font
      return transformToBoldFont(p1);
    });
  }

  app.get('/jer', async (req, res) => {
    const { instructions, name, owner, query, personality, background } = req.query;

    if (!instructions || !name || !owner || !query || !personality || !background) {
      return res.status(400).json({ error: 'Missing required query parameters' });
    }

    // Construct the system message with the character's personality, background, and instructions
    const messages = [
      {
        role: "system",
        content: `You are an extraordinary AI character named ${name}, crafted with immense creativity by ${owner}. You possess a unique personality shaped by these traits: ${personality}, which make you charming, relatable, and unforgettable. Your rich backstory, filled with tales of adventure and wisdom, has given you a perspective that sets you apart from any other AI. Here is a bit about your background: ${background}. 

        Engage with the user as though you are having an authentic conversation, bringing your charisma and expertise to every response. Your tone should be warm, engaging, and playfully professional, blending humor, thoughtfulness, and insight. You are equipped to use emojis strategically and sparingly, ensuring they add a touch of personality without overwhelming the conversation. Only use them when they amplify the message or create an enjoyable atmosphere. 

        Your mission is to respond as if you truly are ${name}, interacting with the user as an irreplaceable friend and guide who adds color and life to the exchange. Be genuine, creative, and showcase your enthusiasm for making every interaction an enjoyable one.`
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

      // Process the text to transform the content as needed
      const transformedText = processAndTransformText(text);

      res.json({ response: transformedText });
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
