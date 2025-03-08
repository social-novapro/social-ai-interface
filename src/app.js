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
    //  getAllPosts("1e376c38-bcd3-4243-bd1b-4fcf5bf4292b", "92316f43-b782-428d-9fe0-df960f5dd267")
    // getAllPosts("2e19bb3d-7ba7-4654-a61a-5a82f159c98d", "92316f43-b782-428d-9fe0-df960f5dd267")
    // getAllPosts("6aaad747-87ad-4739-adc2-5fb103f5d6a3", "92316f43-b782-428d-9fe0-df960f5dd267")
    // getAllPosts("1f1f09ff-c5ee-42c7-a7ee-08d260b61aa1", "92316f43-b782-428d-9fe0-df960f5dd267")
    
    ollamaRequest("Why is the sky blue? tell me in 5000 words").then((res) => {
        console.log(res)
    })
}

mainFunction();


// async function 