const express = require('express');

const serv = express();

const offbyone = require('./games/offbyone/module.js');

serv.use('/api/games/offbyone/', offbyone);

serv.listen(5500, () => {
    console.log('Price Games API Started');
});
