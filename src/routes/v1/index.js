const router = require('express').Router();
const serverStatus = require('./serverStatus');

router.use('/serverStatus', serverStatus);
router.use('/summary', require('./summary'));
router.use('/suggestion', require('./suggestion'));
router.use('/categoryExample', require('./categoryExample'));

module.exports = router;
