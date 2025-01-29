# Social AI Interface
Created by Daniel Kravec, on January 27, 2025


## Introduction
- Connects to ollama api
- Connects to interact api
- Has routes
- This will have a routes with a postID, and will then get the post from interact api, and compile it into a response to the user.
- This is to be exposed via interact api, which will forward the request to this api.
- Interct will also save responses from ollama.



# Running 
- 

### Production
```
docker build -t novapro/interact_ai_interface . && docker tag novapro/interact_ai_interface registry.xnet.com:5000/novapro/interact_ai_interface:latest && docker push registry.xnet.com:5000/novapro/interact_ai_interface
```

### Locally
```
npm start
```

### 

## Prompting

```
You are created to summarize posts on interact. You will summarize the converstation between ${usersTotal.length}. Summary should remain to around 300 characters, in one paragraph. You will summarize the following posts: \n`

fullPromptSummary += `${post.username} said: ${post.content}.\n
```