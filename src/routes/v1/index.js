const router = require('express').Router();
const serverStatus = require('./serverStatus');

router.use('/serverStatus', serverStatus);
router.use('/summary', require('./summary'));

module.exports = router;
