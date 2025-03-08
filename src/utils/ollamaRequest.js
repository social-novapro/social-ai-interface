const { fetchRequest } = require("./fetchRequest");
require('dotenv').config({ path: whichEnv()})

async function ollamaRequest(prompt) {
    const body = {
        model: "llama3.2",
        prompt: prompt,
        stream: false
    };

    const ollamaResponse = await fetchRequest("/api/generate", "POST", {}, body, process.env.OLLAMA_URL); 
    return ollamaResponse;
}

// curl http://localhost:11434/api/generate -d '{
//   "model": "llama3.2",
//   "prompt": "Why is the sky blue?",
//   "stream": false
// }

module.exports = { ollamaRequest }