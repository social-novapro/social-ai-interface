const mongoose = require('mongoose');
const { reqBool, reqNum, reqString } = require('../types');

const interactAIResponse = mongoose.Schema({
    _id: reqString,  // UUID
    current: reqBool, 
    timestamp: reqNum,

    generationType: reqString,
    response: reqString,
    foundUsername: reqString,
    totalPosts: reqNum,
    totalChars: reqNum,
    responseLength: reqNum,
    totalTime: reqNum,
    ollamaTime: reqNum,

    modelName: reqString,
    versionNumber: reqNum,
});

module.exports = mongoose.model('interact-ai-response', interactAIResponse);