// require('dotenv').config({ path: 'secret.env' })
const { current } = require('../config.json')
require('dotenv').config({ path: `env/${current=="prod" ? "prod" : "dev" }.env` });

const requiredEnvs = [
    "BASE_URL",
    "INTERACT_USERNAME",
    "INTERACT_PASSWORD",
    "INTERACT_APP_TOKEN",
    "INTERACT_DEV_TOKEN",
    "INTERACT_ACCESS_TOKEN",
    "INTERACT_USER_TOKEN",
    "INTERACT_USER_ID"
]

function verifyEnvs() {
    for (const env of requiredEnvs) {
        const foundEnv = process.env[env]
        if (!foundEnv) {
            console.log(`Missing key : ${env}`)
            throw `Required key was not found`
        };

        console.log(`---\nKey ${env} was found.`)
    }
}

verifyEnvs()