require('./getConnection').then(async client => {
    const carData = Array.from(require('./sampledata2.json'));

    const collection = client.db("price-game-db").collection("cars");
    await collection.deleteMany({});

    console.log("neat!")
    for(let [idx, car] of carData.entries()){
        car.id = idx + 1;
    }
    await collection.insertMany(carData);
    console.log("neater!")


    return client.close();
})

