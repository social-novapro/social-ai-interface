const { checktime } = require("./checktime");
const { fetchRequest } = require("./fetchRequest");
const { ollamaRequest } = require("./ollamaRequest");

async function getAllPosts(postID, userID) {
    const startTime = checktime();
    /*
    {
        username,
        postID,
        index,
        content
    }
    */
    const foundPosts = []
    // get a post (specifc ID of post)
    var foundEnd = false;
    var totalPosts = 0;
    var totalChars = 0;

    var nextPostID = postID

    // will need to actually know who is replying
    var foundUsername = null;

    // how many users in conversation
    var usersTotal = {};
    // get all posts in a conversation
    while (!foundEnd) {
        const foundPost = await getPost(nextPostID);
        // console.log(foundPost)
        if (!foundPost) {
            break;
        }

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

        if (!foundUsername && foundPost.userData._id == userID) {
            foundUsername = foundPost.userData.username;
        }

        totalPosts++;
        totalChars += foundPost.postData.content.length;

        if (foundPost.postData.replyData?.postID) {
            nextPostID = foundPost.postData.replyData.postID
        } else {
            foundEnd = true
        }

        if (totalPosts > 10) {
            foundEnd = true
        }
    }

    // console.log(foundPosts)

    var lengthSummary = Math.floor(totalChars / totalPosts);
    if (lengthSummary > 400) lengthSummary = 400;

    var fullPromptSummary = `You will create a summary of ${totalPosts} on the social media platform Interact.\t
You will summarize the converstation between ${usersTotal.length}. 
Summary should remain to around ${lengthSummary} characters, in one paragraph. 
Make sure it does not surpass 512 characters.
You will use the usernames, and keep the @ symbol. 
Do not include any extra information other than your summary.
Write the summary in 3rd person. 
All pronouns must be neutral, as their and they.
Take your time and make sure the summary is accurate.
Make sure to include all relevant details.
This summary will be for someone who is not part of the conversation.
You will not include any personal opinions.
You will not include any personal information.
You will not include any information that is not in the conversation.
You will not include any information that is not relevant to the conversation.
You may give more context if needed.
You will not imagine any information.
You must understand the order of the posts they are in.
Posts provided are in the order of old to new.
You will not hold any bias.
You will summarize the following posts: [`;
    for (const post of foundPosts.reverse()) {
        fullPromptSummary += `{'order':${totalPosts-post.index}, 'username': '${post.username}': 'content':'${post.content}'},\n`;
    };
    fullPromptSummary += `]`;

    console.log(fullPromptSummary)



    const startTimeOllama = checktime();
    const ollamaResponse = await ollamaRequest(fullPromptSummary);
    console.log(ollamaResponse.response)
    const endTime = checktime();
    console.log(`Time to get total: ${endTime - startTime}ms, Time to get summary: ${endTime - startTimeOllama}ms`)

    return foundPosts
}

// async function getUser
async function getPost(postID) {
    // get a post (specifc ID of post)
    // const foundPost = await fetchRequest(`posts/get/full/${postID}`, "GET");
    const foundPost = await fetchRequest(`posts/get/${postID}`, "GET");
    const foundUser = await fetchRequest(`users/get/${foundPost.userID}`, "GET");

    return {
        postData: foundPost,
        userData: foundUser.userData
    }
}

module.exports = { getAllPosts }