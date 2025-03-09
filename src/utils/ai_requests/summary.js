const interactAISummary = require("../../schemas/interactAISummary");
const { checktime } = require("../checktime");
const { fetchRequest } = require("../fetchRequest");
const { ollamaRequest } = require("../ollamaRequest");
const { summary } = require("./prompts.json");
const { v4: UUIDv4 } = require('uuid');

async function summarizeThread({ headers, postID }) {
    const startTime = checktime();
    const foundThread = await fetchRequest(`posts/get/thread/${postID}`, "GET", headers);

    const foundPosts = []
    var totalChars = 0;
    // will need to actually know who is replying
    var foundUsername = null;

    // how many users in conversation
    var usersTotal = {};

    var totalPosts = 0;

    // push first post
    foundThread.parentPosts.reverse();
    foundThread.parentPosts.push(foundThread.post);
    foundThread.parentPosts.reverse(); 
    //^^ puts main post at start of array
    
    for (const foundPost of foundThread.parentPosts) {
        foundPosts.push({
            username: `@${foundPost.userData.username}`,
            postID: foundPost.userData._id,
            index: totalPosts,
            content: foundPost.postData.content
        })

        if (usersTotal[foundPost.userData.username]) {
            usersTotal[foundPost.userData.username]++
        } else {
            usersTotal[foundPost.userData.username] = 1;
        }

        if (!foundUsername && foundPost.userData._id == headers.userID) {
            foundUsername = foundPost.userData.username;
        }

        totalPosts++;
        totalChars += foundPost.postData.content.length;
    }

    if (foundUsername == null) {
        const foundUser = await fetchRequest(`users/get/${headers.userID}`, "GET");
        foundUsername = foundUser.userData.username;
    }

    var lengthSummary = Math.floor(totalChars / totalPosts);
    if (lengthSummary > 400) lengthSummary = 400;

    const dataUse = {
        totalPosts,
        totalChars
    }

    var fullPromptSummary = summary.prompt.join('\n');
    for (const replacement in summary.replacements) {
        for (var i=0; i<replacement.occurrences; i++) {
            fullPromptSummary = fullPromptSummary.replace(`{${replacement.key}}`, dataUse[replacement.key]);
        }
    }

    for (const post of foundPosts.reverse()) {
        fullPromptSummary += `{'order':${totalPosts-post.index}, 'username': '${post.username}': 'content':'${post.content}'}${post.index==0 ? `]` : ','}\n`;
    };


    const startTimeOllama = checktime();
    const ollamaResponse = await ollamaRequest(fullPromptSummary, summary.model);
    const endTime = checktime();
    console.log(`Time to get total: ${endTime - startTime}ms, Time to get summary: ${endTime - startTimeOllama}ms`)

    if (ollamaResponse.error) {
        return { error: ollamaResponse.error };
    }

    const structuredResponse = {
        response: ollamaResponse.response,
        // usersTotal,
        foundUsername,
        totalPosts,
        totalChars,
        lengthSummary,
        totalTime: endTime - startTime,
        ollamaTime: endTime - startTimeOllama,
        modelName: summary.model,
        versionNumber: summary.version
    }

    try {
        await interactAISummary.create({
            _id: UUIDv4(),
            current: true,
            timestamp: checktime(),
            ...structuredResponse,
        })
    } catch (error) {
        console.log(error)
    }

    return structuredResponse

    // right now, only summary main post and parent posts
    // main post summerized
    // replies to post
    // replies to thread
    // parent posts (who was replying to)
}

module.exports = {summarizeThread};