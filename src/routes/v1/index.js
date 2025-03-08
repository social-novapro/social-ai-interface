const router = require('express').Router();
const serverStatus = require('./serverStatus');

router.use('/serverStatus', serverStatus);

module.exports = router;
