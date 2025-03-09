const router = require('express').Router();
const { summarizeThread } = require('../../../utils/ai_requests/summary');
const { reqToHeaders } = require('../../../utils/reqToHeaders');

router.get('/:postID', async (req, res) => {
    console.log('GET /summary/:postID');
    const headers = reqToHeaders(req);
    const summerized = await summarizeThread({ headers, postID: req.params.postID });

    if (summerized.error) {
        return res.status(400).send({ error: summerized });
    }

    return res.status(200).send(summerized);    
})

module.exports = router;
