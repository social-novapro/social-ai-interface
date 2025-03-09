// async function 

const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const cors = require('cors');
const config = require('../config.json');
const PORT = config.PORT;
const app = express();
const APIv1 = require('./routes/v1/');

const { fetchRequest } = require('./utils/fetchRequest');
const { whichEnv } = require('../runMode/whichEnv');

require('dotenv').config({ path: whichEnv()})

app.use((req, res, next) => {
    console.log('----');
    console.log(req.originalUrl)
    next();
});

app.use(express.json());
app.use(express.urlencoded({extended: false}));

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.use(cors());
app.use('/v1', APIv1);

const server = http.createServer(app);
server.listen(PORT, () => console.log(`Server started on port ${PORT}!`));
