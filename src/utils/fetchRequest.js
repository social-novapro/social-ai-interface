require('dotenv').config({ path: './env/prod.env' })

async function fetchRequest(url, method="GET", headers={}, body=null, baseURL=process.env.BASE_URL) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
    headers['devtoken'] = process.env.INTERACT_DEV_TOKEN;
    headers['apptoken'] = process.env.INTERACT_APP_TOKEN;

    headers['accesstoken'] = headers['accesstoken'] || process.env.INTERACT_ACCESS_TOKEN;
    headers['usertoken'] = headers['usertoken'] || process.env.INTERACT_USER_TOKEN;
    headers['userid'] = headers['userid'] || process.env.INTERACT_USER_ID;

    const response = await fetch(baseURL+url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null
    });

    const done = await response.json();
    return done;
}


module.exports = { fetchRequest }