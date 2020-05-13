const {Router} = require('express');

const game = Router();

const mockData = {
    make: "Honda",
    model: "Civic",
    year: 2020,
    trim: 'CT',
    price: 21565.00,
    images: {
        front: "/nothing.png",
        side: "/nothing.png",
        showcase: "/nothing.png"
    }
}


game.get('/car', (req, res) => {
    res.status(200).send(JSON.stringify(mockData));
})


/*
GET http://localhost:5500/api/games/offbyone/car
returns application/json
see mockdata
 */


module.exports = game;
