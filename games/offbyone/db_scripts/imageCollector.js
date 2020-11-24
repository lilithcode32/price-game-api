const axios = require('axios');

const fs = require('fs');

const getConnection = require('./getConnection');
getConnection.then(async client => {
    const carColl = client.db("price-game-db").collection("cars");
    const cars = await carColl.find({},{id:1, images:1}).toArray();

    for(let {images, id} of cars){
        await getit(images.showcase, id);
    }

    client.close();
});

async function getit(url, id){
    const resp = await axios.get(url, {responseType:'stream'})
    return new Promise((rs) => {
        const outStrm = fs.createWriteStream(`./images/car_image_${id}.jpg`);
        console.log('writing image', id);

        resp.data.on('data', data => outStrm.write(data));

        resp.data.on('end', () => {
            outStrm.close();
            rs();
        })
    });
}

