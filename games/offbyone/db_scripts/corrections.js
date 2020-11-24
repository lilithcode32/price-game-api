const sampleData = Array.from(require('./sampledata.json'));
const scrapeData = require('./scrapeurls.json');
const fs = require('fs');

const byImgStub = {};

/*sample
  {
    "make"  : "Nissan",
    "model" : "2020 Nissa",
    "price" : 23240,
    "trim"  : "n Rogue Sport S 4dr Front-wheel Drive",
    "images": {
      "showcase": "http://img.autobytel.com/2020/nissan/rogue-sport/2-800-oemexteriorfront1300-93581.JPG"
    }
  },
 */

/*scrape
  {
    "make" : "Nissan",
    "model": "370z",
    "url"  : "https://www.autobytel.com/nissan/370z/2020/configurator/"
  },

 */

//"http://img.autobytel.com/2020/nissan/rogue-sport/2-800-oemexteriorfront1300-93581.JPG

let subset = sampleData;

for(let car of subset){
    const {make, model, trim, images} = car;
    let testStr = model + ' ' +  trim;
    let result = /http:\/\/img\.autobytel.com\/2020\/[^\/]+\/([^\/]*)+\//g.exec(images.showcase)
    if(result){
        let urlModel = result[1].replace(/-/g,' ');
        let modelIdx = testStr.replace(/-/g,' ').toLowerCase().indexOf(urlModel);
        if(modelIdx === -1) {
            testStr = model + trim;
            modelIdx = testStr.replace(/-/g,' ').toLowerCase().indexOf(urlModel);
            if(modelIdx === -1){
                console.error(make, '|', model,'|', trim);
                continue;
            }
        }
        let realModel = testStr.substring(modelIdx, modelIdx + urlModel.length);
        let realTrim = testStr.substring(modelIdx + urlModel.length);
        car.model = realModel.trim();
        car.trim = realTrim.trim();
    }
}

fs.writeFile('./sampledata2.json', JSON.stringify(sampleData), (err) => {
    if(err) throw err;
    console.log('wrote file.')
});
