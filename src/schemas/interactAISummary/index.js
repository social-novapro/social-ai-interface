const mongoose = require('mongoose');
const { reqBool, reqNum, reqString } = require('../types');

const interactAISummary = mongoose.Schema({
    _id: reqString,  // UUID
    current: reqBool, 
    timestamp: reqNum,

    response: reqString,
    foundUsername: reqString,
    totalPosts: reqNum,
    totalChars: reqNum,
    lengthSummary: reqNum,
    totalTime: reqNum,
    ollamaTime: reqNum,

    modelName: reqString,
    versionNumber: reqNum,
});

module.exports = mongoose.model('interact-ai-summary', interactAISummary);