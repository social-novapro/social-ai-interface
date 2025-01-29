// async function 

const { getAllPosts } = require("./utils/getAllPosts");
const { login } = require("./utils/userLoginTokens");

function mainFunction() {
    // only login at start
    // login(); 
    // local test
    // getAllPosts("e3609408-36e8-41e2-a2d1-90b102a3e544")

    // getAllPosts("fd17d658-b48a-46fa-b341-78c76528b6e9", "92316f43-b782-428d-9fe0-df960f5dd267")
    getAllPosts("895f2c2a-b37c-4070-8c5f-07f23ac469f2", "92316f43-b782-428d-9fe0-df960f5dd267")
}

mainFunction();


// async function 