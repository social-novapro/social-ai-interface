const router = require('express').Router();
const { suggestionPost } = require('../../../utils/ai_requests/suggestion');
const { reqToHeaders } = require('../../../utils/reqToHeaders');


// POST /suggestion
// suggestion based on own profile, or on content already started
router.post('/', async (req, res) => {
    console.log(req.body)
    const headers = reqToHeaders(req);
    const suggestion = await suggestionPost({ headers, content: req.body.content?? null });

    if (suggestion.error) {
        return res.status(400).send({ error: suggestion });
    }

    return res.status(200).send(suggestion);    
})

// POST /suggestion/:postID
// suggestion based on reply to a post, and (optional) on reply already started
router.post('/:postID', async (req, res) => {
    const headers = reqToHeaders(req);
    const suggestion = await suggestionPost({ headers, postID: req.params.postID, content: req.body.content?? null });

    if (suggestion.error) {
        return res.status(400).send({ error: suggestion });
    }

    return res.status(200).send(suggestion);    
})

module.exports = router;
