const { whichEnv } = require('../../runMode/whichEnv');
const { fetchRequest } = require('./fetchRequest')

require('dotenv').config({ path: whichEnv()})

async function login() {
    const headers = {
        'username': process.env.INTERACT_USERNAME,
        'password': process.env.INTERACT_PASSWORD,
    }

    const userData = await fetchRequest('auth/userLogin', "GET", headers);
    
}

module.exports = { login }