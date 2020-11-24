const cars = Array.from(require('./scrapeurls.json')),
    axios = require('axios'),
    cheerio = require('cheerio'),
    fs = require('fs');

//console.log(urls);

const dataOut = [];

const carIter = cars[Symbol.iterator]();
let count = 0;

getCarData();

function minuteStall() {
    return new Promise((res) => {
        setTimeout(res, 2000);
    });
}

function getCarData() {
    const next = carIter.next();
    const car = next.value;
    if (!next.done) {
        const {make = '', model = '', url = ''} = car;

        console.log(count, 'send req', url);
        const reqChain = axios.get(url).then(response => {
            const $ = cheerio.load(response.data);
            const $img = $('#dsp_SmallCarImage img');
            const alt = $img.attr('alt');
            const modelIdx = alt.toLowerCase().indexOf(model.toLowerCase());
            const modelLen = model.length;
            const trim = alt.substring(modelIdx + modelLen).trim();
            const properModel = alt.substring(modelIdx, modelIdx + modelLen).trim();

            return axios.post('https://www.autobytel.com/api/new-cars/configurator-dsp-summary', {
                SeriesID: $('#SeriesIDintVal').val(),
                Acode: $('#AcodeVal').val()
            }).then(apiRes => {

                const $data = cheerio.load(apiRes.data);
                const priceTxt = $data('.table-condensed tr').eq(1).find('td').eq(2).text().replace(/\D/g, '');
                const imgUrl = 'http:' + $data('#dsp_LargeCarImage img').attr('src');
                count += 1;

                dataOut.push({
                    make,
                    model: properModel,
                    price: parseInt(priceTxt),
                    trim,
                    images: {
                        showcase: imgUrl
                    }
                });
            });

        }).catch(err => {
            console.error('Failed for url:', url);
        });

        Promise.all([reqChain, minuteStall()]).finally(getCarData);

    } else {

        fs.writeFile('./sampledata.json', JSON.stringify(dataOut), (err) => {
            if(err) throw err;
            console.log('wrote file.')
        });
    }

}

