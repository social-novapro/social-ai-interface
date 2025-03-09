const { checktime } = require("../checktime");
const { fetchRequest } = require("../fetchRequest");
const { ollamaRequest } = require("../ollamaRequest");

async function summarizeThread({ headers, postID }) {
    const startTime = checktime();

    const foundThread = await fetchRequest(`posts/get/thread/${postID}`, "GET", headers);
    console.log(foundThread)

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
    foundThread.parentPosts.reverse(); // puts main post at start of array
    
    for (const foundPost of foundThread.parentPosts) {
        console.log(foundPost.postData.content.split('\n').join(' ') + ' ' + foundPost.userData.username + ' ' + foundPost.postData.timestamp)
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

        // if (foundPost.postData.replyData?.postID) {
        //     nextPostID = foundPost.postData.replyData.postID
        // } else {
        //     foundEnd = true
        // }

        // if (totalPosts > 10) {
        //     foundEnd = true
        // }
    }
    var lengthSummary = Math.floor(totalChars / totalPosts);
    if (lengthSummary > 400) lengthSummary = 400;

    var fullPromptSummary = `
        You will generate a single-paragraph summary of ${totalPosts} posts from Interact.
        The summary must be one paragraph with no bullet points, no lists, and no extra formatting.
        It must not exceed ${lengthSummary} characters (absolute max: 450).
        Do not add platform names like Discord—this is Interact.
        Only summarize key points accurately, without unnecessary details.
        Use @usernames when referring to users.
        Use they/them pronouns to stay gender-neutral.
        Do not copy and paste the posts—rephrase and summarize meaningfully.
        Do not add assumptions, opinions, or extra commentary.
        Context is allowed only if strictly necessary.
        If unable to summarize a post, write "Unable to summarize this post, not enough context provided."
        Do not just list topics—write a real summary in sentence form. Here are the posts, in order from oldest to newest:
        [
    `;

    for (const post of foundPosts.reverse()) {
        fullPromptSummary += `{'order':${totalPosts-post.index}, 'username': '${post.username}': 'content':'${post.content}'}${post.index==0 ? `]` : ','}\n`;
    };

    console.log(fullPromptSummary)

    const startTimeOllama = checktime();
    const ollamaResponse = await ollamaRequest(fullPromptSummary);
    console.log(ollamaResponse.response)
    const endTime = checktime();
    console.log(`Time to get total: ${endTime - startTime}ms, Time to get summary: ${endTime - startTimeOllama}ms`)

    const structuredResponse = {
        response: ollamaResponse.response,
        usersTotal,
        foundUsername,
        totalPosts,
        totalChars,
        lengthSummary,
        totalTime: endTime - startTime,
        ollamaTime: endTime - startTimeOllama,
        foundPosts
    }

    return structuredResponse

    // right now, only summary main post and parent posts
    // main post summerized
    // replies to post
    // replies to thread
    // parent posts (who was replying to)
}

module.exports = {summarizeThread};