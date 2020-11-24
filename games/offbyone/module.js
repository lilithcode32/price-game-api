const {Router} = require('express');
const path = require('path');

const game = Router();
const {s3root} =  require('dotenv').config({path:path.resolve(process.cwd(),'./games/offbyone/s3.env')}).parsed;

// const mockData = {
//     make: "Honda",
//     model: "Civic",
//     year: 2020,
//     trim: 'CT',
//     price: 21565.00,
//     images: {
//         front: "/nothing.png",
//         side: "/nothing.png",
//         showcase: "/nothing.png"
//     }
// }

const carsData = {};

(async function(){
    const connection = require('./db_scripts/getConnection');
    const client = await connection;

    carsData.collection = client.db("price-game-db").collection("cars");
    carsData.count = await carsData.collection.countDocuments({});
})();

game.get('/car', async (req, res, next) => {

    const id = Math.ceil(carsData.count * Math.random());

    const car = await carsData.collection.findOne({id});
    car.images.showcase = `${s3root}images/car_image_${id}.jpg`;

    res.status(200).send(JSON.stringify(car));

    next();
})


/*
GET http://localhost:5500/api/games/offbyone/car
returns application/json
see mockdata
 */


module.exports = game;
