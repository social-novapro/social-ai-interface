const { whichEnv } = require('../../runMode/whichEnv');

require('dotenv').config({ path: whichEnv()})

async function fetchRequest(url, method="GET", headers={}, body=null, baseURL=process.env.BASE_URL) {
    var finalHeaders = {};

    for (const key in headers) {
        if (headers[key]) {
            finalHeaders[key] = headers[key];
        }
    }

    if (!finalHeaders['Content-Type']) finalHeaders['Content-Type'] = 'application/json';
    if (!finalHeaders['devToken']) finalHeaders['devToken'] = process.env.INTERACT_DEV_TOKEN;
    if (!finalHeaders['appToken']) finalHeaders['appToken'] = process.env.INTERACT_APP_TOKEN;
    if (!finalHeaders['accessToken']) finalHeaders['accessToken'] = process.env.INTERACT_ACCESS_TOKEN;
    if (!finalHeaders['userToken']) finalHeaders['userToken'] = process.env.INTERACT_USER_TOKEN;
    if (!finalHeaders['userID']) finalHeaders['userID'] = process.env.INTERACT_USER_ID;
    
    const response = await fetch(baseURL+url, {
        method,
        headers: finalHeaders,
        body: body ? JSON.stringify(body) : null
    });

    const done = await response.json();
    return done;
}


module.exports = { fetchRequest }