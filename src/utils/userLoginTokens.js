const { fetchRequest } = require('./fetchRequest')

require('dotenv').config({ path: './env/prod.env' })


async function login() {
    const headers = {
        'username': process.env.INTERACT_USERNAME,
        'password': process.env.INTERACT_PASSWORD,
    }

    const userData = await fetchRequest('auth/userLogin', "GET", headers);

    console.log(userData)
    
}

module.exports = { login }