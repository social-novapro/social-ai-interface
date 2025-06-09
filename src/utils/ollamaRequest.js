const { whichEnv } = require("../../runMode/whichEnv");
const { fetchRequest } = require("./fetchRequest");
require('dotenv').config({ path: whichEnv()})

async function ollamaRequest(prompt, model="llama3.2") {
    const body = {
        model: model,
        prompt: prompt,
        stream: false,
        keep_alive: -1,
        think: false
    };

    const ollamaResponse = await fetchRequest("/api/generate", "POST", {}, body, process.env.OLLAMA_URL); 
    return ollamaResponse;
}

module.exports = { ollamaRequest }