const interactAIResponse = require("../../schemas/interactAIResponse");
const { checktime } = require("../checktime");
const { fetchRequest } = require("../fetchRequest");
const { ollamaRequest } = require("../ollamaRequest");
const { suggestion } = require("./prompts.json");
const { v4: UUIDv4 } = require('uuid');

async function suggestionPost({ headers, postID, content }) {
    const startTime = checktime();
    // postID = based on post
    // content = based on content
    // both = based on both

    // if postID, get post and replies
    const threadPosts = postID ? await fetchRequest(`posts/get/thread/${postID}`, "GET", headers) : null;
    const userPosts = await fetchRequest(`users/get/userPosts/u/${headers.userID}`, "GET", headers);

    var promptType = 0
    var promptDataUse = {
        userPosts: [],
        threadPosts: [],
        startedContent: content ? `\'${content}\'` : null,
        replyContent: postID ? threadPosts.post.postData.content : null,
        userPostsAmount: 0,
        totalPosts: 0,
        maxLength: 250,
    }

    for (const post of userPosts.posts) {
        // promptDataUse.userPosts.push(post.postData)
        promptDataUse.userPosts.push({
            username: `@${post.userData.username}`,
            postID: post.userData._id,
            index: promptDataUse.userPostsAmount,
            content: post.postData.content
        })
        promptDataUse.userPostsAmount++;
    }

    var foundPosts = [];
    var totalChars = 0;
    var totalPosts = 0;
    var foundUsername = userPosts.posts[0].userData.username;
    var usersTotal = {};
    var totalPosts = 0;

    // id 1, 2
    if (!postID) {
        if (!content || content?.length == 0) {
            promptType = 1;
        }
        else {
            promptType = 2;
        }
    }
    // id: 3, 4
    if (postID && threadPosts) {
        threadPosts.parentPosts.reverse();
        threadPosts.parentPosts.push(threadPosts.post);
        threadPosts.parentPosts.reverse(); 
        //^^ puts main post at start of array

        for (const foundPost of threadPosts.parentPosts) {
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

        if (!content || content?.length == 0) {
            promptType = 3;
        }
        else {
            promptType = 4;
        }

        promptDataUse.maxLength = totalChars / totalPosts;
        promptDataUse.totalPosts = totalPosts;
        promptDataUse.totalChars = totalChars;
        promptDataUse.threadPosts = foundPosts;
    }

    const myPrompt = generateSuggestionPrompt({ dataUse: promptDataUse, typeSuggestion: promptType });
    
    const startTimeOllama = checktime();
    const ollamaResponse = await ollamaRequest(myPrompt, suggestion.model);
    const endTime = checktime();
    console.log(`Time to get total: ${endTime - startTime}ms, Time to get suggestion: ${endTime - startTimeOllama}ms`)

    if (ollamaResponse.error) {
        return { error: ollamaResponse.error };
    }

    const structuredResponse = {
        response: ollamaResponse.response,
        // usersTotal,
        generationType: "suggestion",
        foundUsername,
        totalPosts,
        totalChars,
        responseLength: ollamaResponse.response.length,
        totalTime: endTime - startTime,
        ollamaTime: endTime - startTimeOllama,
        modelName: suggestion.model,
        versionNumber: suggestion.version,
        typeSuggestion: promptType,
    }

    try {
        await interactAIResponse.create({
            _id: UUIDv4(),
            current: true,
            timestamp: checktime(),
            ...structuredResponse,
        })
    } catch (error) {
        console.log(error)
    }

    return structuredResponse;
}

function generateSuggestionPrompt({ dataUse, typeSuggestion }) {
    var fullPrompt = [];
    var finalPromptArr = [];
    const promptType = suggestion.promptTypes[typeSuggestion - 1];

    for (const extra of promptType.extraPrompt) {
        fullPrompt.push(extra);
    }

    fullPrompt = [...fullPrompt, ...suggestion.prompt];

    for (var prompt of fullPrompt) {
        if (prompt.startsWith(":")) {
            var neededSub = false;
            // var needName = prompt.split(":")[1];
            for (const need of promptType.needs) {
                if (prompt.startsWith(`:${need}:`)) {
                    neededSub = true;
                    prompt = prompt.replace(`:${need}:`, "");
                    break;
                }
            }
            if (neededSub) {
                finalPromptArr.push(prompt);
            }
        } else {
            finalPromptArr.push(prompt);
        }
    }

    var fullPromptSuggestion = finalPromptArr.join('\n');

    for (const replacement of suggestion.replacements) {
        if (replacement.key == "threadPosts" || replacement.key == "userPosts") {
            var usingTotal = replacement.key == "threadPosts" ? dataUse.totalPosts : dataUse.userPostsAmount;
            var postsPrompt = [];

            for (const post of replacement.key == "threadPosts" ? dataUse.threadPosts.reverse() : dataUse.userPosts.reverse()) {
                postsPrompt.push({
                    order: usingTotal - post.index,
                    username: post.username,
                    content: post.content
                });
            }
            const postsPromptString = JSON.stringify(postsPrompt);
            fullPromptSuggestion = fullPromptSuggestion.replace(new RegExp(`{${replacement.key}}`, 'g'), postsPromptString);
        } else {
            fullPromptSuggestion = fullPromptSuggestion.replace(new RegExp(`{${replacement.key}}`, 'g'), dataUse[replacement.key]);
        }
    }

    return fullPromptSuggestion;
}

module.exports = { suggestionPost };