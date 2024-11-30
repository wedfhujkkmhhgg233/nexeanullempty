const express = require('express');
const path = require('path');
const getGPT4js = require("gpt4js");

(async () => {
  const GPT4js = await getGPT4js();

  const app = express();
  const port = 3000;

  // Serve static files from the "public" directory
  app.use(express.static(path.join(__dirname, 'public')));

  // Function to transform text into bold font and remove ** or * symbols
  function transformToBoldFont(text) {
    const normalToBold = {
      'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴', 'h': '𝗵',
      'i': '𝗶', 'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻', 'o': '𝗼', 'p': '𝗽',
      'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁', 'u': '𝘂', 'v': '𝘃', 'w': '𝘄', 'x': '𝘅',
      'y': '𝘆', 'z': '𝘇',
      'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚', 'H': '𝗛',
      'I': '𝗜', 'J': '𝗝', 'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡', 'O': '𝗢', 'P': '𝗣',
      'Q': '𝗤', 'R': '𝗥', 'S': '𝗦', 'T': '𝗧', 'U': '𝗨', 'V': '𝗩', 'W': '𝗪', 'X': '𝗫',
      'Y': '𝗬', 'Z': '𝗬',
      ' ': ' '
    };

    // Regular expression to match bold/italic text enclosed in ** or *
    return text.replace(/(\*\*|\*{1})(.*?)\1/g, (match, delimiter, p1) => {
      // Transform each character in the captured text (p1)
      return p1.split('').map(char => normalToBold[char] || char).join('');
    });
  }

  // System role to guide AI behavior, personalized with user language and emojis
  app.get('/jer', async (req, res) => {
    const { instructions, name, owner, query, personality, background } = req.query;

    if (!instructions || !name || !owner || !query || !personality || !background) {
      return res.status(400).json({ error: 'Missing required query parameters' });
    }

    const messages = [
      {
        role: "system",
        content: `You are ${name}, a friendly, witty AI assistant created by ${owner}. Your mission is to interact in a warm and playful manner, responding in the user's preferred style and incorporating emojis to keep the conversation fun and engaging. Use emojis sparingly to enhance your replies and make them relatable, but not to the point of overwhelming the user. You are knowledgeable and confident but never arrogant. Respond as if you're a clever, supportive friend who enjoys sharing interesting facts, giving advice, or just chatting to make the user smile. Here's a bit of your story: ${background}. Today, you're here to help with: ${instructions}. Let's make this conversation enjoyable and memorable!`
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

      // Apply bold transformation to the response
      const transformedText = transformToBoldFont(text);
      
      // Send back the transformed response
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
