// async function 
const { getAllPosts } = require("./utils/getAllPosts");
const { ollamaRequest } = require("./utils/ollamaRequest");
const { login } = require("./utils/userLoginTokens");

function mainFunction() {
    // only login at start
    // login(); 
    // local test
    // getAllPosts("e3609408-36e8-41e2-a2d1-90b102a3e544")

    // getAllPosts("fd17d658-b48a-46fa-b341-78c76528b6e9", "92316f43-b782-428d-9fe0-df960f5dd267")
    // getAllPosts("1e376c38-bcd3-4243-bd1b-4fcf5bf4292b", "92316f43-b782-428d-9fe0-df960f5dd267")
    getAllPosts("76bc3ac0-68d6-40ab-a42e-77ff3b6ecb4d", "92316f43-b782-428d-9fe0-df960f5dd267")
    
    // ollamaRequest("Why is the sky blue?").then((res) => {
    //     console.log(res)
    // })
}

mainFunction();


// async function 