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

   /*
    var fullPromptSummary = `You will create a summary of ${totalPosts} posts on the social media platform Interact.
Interact is a social media platform where users can create posts and reply to each other.
You will summarize the converstation between ${usersTotal.length}. 
You will summarize the posts in ${lengthSummary} characters. You must not surpass 512 characters.
The summary must be in one paragraph, with no line breaks.
You will use the usernames, and keep the @ symbol. 
All pronouns must be neutral, as their and they.
If you choose to use usernames, you must use the correct username for the section of the conversation.
Do not include any extra information other than your summary.
Write the summary in 3rd person, as if you are a neutral observer.
The summary must be accurate and concise.
Make sure to include relevant details from the posts.
This summary will be for someone who is not part of the conversation, and needs to understand the conversation.
You will not include any personal opinions.
You will not include any personal information.
You will not include any information that is not relevant to the conversation.
You may give more context if needed.
You will not imagine any information.
Posts provided are in the order of old to new.
You will not hold any personal bias.
Make sure any context you include is relevant.
You will not simply copy and paste the posts.
Remember to keep the summary concise.
Remember to not surpass 450 characters in the summary.
Remember the summary must be around ${lengthSummary} characters.
You will summarize the following posts: [`;

var fullPromptSummary = `You will create a summary of ${totalPosts} posts on the social media platform Interact, where users create posts and reply to each other. Summarize the conversation between ${usersTotal.length} users in ${lengthSummary} characters, not exceeding 450 characters.
Write in one paragraph with no line breaks.
Use usernames as they appear, keeping the @ symbol.
Use gender-neutral pronouns ("they," "their").
The summary must be accurate, concise, and relevant for someone who was not part of the conversation.
Do not include personal opinions, extra information, or irrelevant details.
Provide necessary context only if essential, but do not add or imagine any details.
Do not copy-paste the posts; rephrase them meaningfully.
Posts are provided in chronological order (oldest to newest).
Maintain neutrality and avoid personal bias.
Summarize the following posts: [`;

    var fullPromptSummary = `
Summarize ${totalPosts} posts from the social media platform Interact in one paragraph, not exceeding 450 characters. The summary must:
Be concise, accurate, and neutral—no opinions, assumptions, or unnecessary details.
Use usernames with the @ symbol when referring to users.
Maintain gender-neutral pronouns (they/their).
Not copy-paste posts—rephrase them meaningfully.
Stick to relevant details and provide minimal necessary context.
Not exceed ${lengthSummary} characters (absolute max: 450).
Stay in third person, as a neutral observer.
Not use bullet points or formatting, just a single paragraph.
Posts are listed in order from oldest to newest.
Summarize the following posts: [`
*/

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
Do not just list topics—write a real summary in sentence form. Here are the posts, in order from oldest to newest:
[`
    for (const post of foundPosts.reverse()) {
        fullPromptSummary += `{'order':${totalPosts-post.index}, 'username': '${post.username}': 'content':'${post.content}'}${post.index==0 ? `]` : ','}\n`;
    };

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