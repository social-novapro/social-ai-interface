const router = require('express').Router();
const { generateExamples } = require('../../../utils/ai_requests/categoryExample');
const { reqToHeaders } = require('../../../utils/reqToHeaders');

// POST /suggestion
// suggestion based on own profile, or on content already started
router.post('/:categoryName', async (req, res) => {
    const headers = reqToHeaders(req);
    const suggestion = await generateExamples(req.params.categoryName);

    if (suggestion.error) {
        return res.status(400).send({ error: suggestion });
    }

    return res.status(200).send(suggestion);    
})

router.get('/version', async (req, res) => {
    return res.status(200).send({version: require('../../../utils/ai_requests/prompts.json').categoryExample.version});
});

module.exports = router;
