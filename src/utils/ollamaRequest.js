const { fetchRequest } = require("./fetchRequest");

async function ollamaRequest(prompt) {
    const body = {
        model: "llama3.2",
        prompt: prompt,
        stream: false
    };

    const ollamaResponse = await fetchRequest("/api/generate", "POST", {}, body, "http://localhost:11434"); 
    return ollamaResponse;
}

// curl http://localhost:11434/api/generate -d '{
//   "model": "llama3.2",
//   "prompt": "Why is the sky blue?",
//   "stream": false
// }

module.exports = { ollamaRequest }