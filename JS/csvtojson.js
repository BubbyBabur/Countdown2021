const fs = require('fs');
const csv = require('csv-parser');

const TARGETFILENAME = "2020 Sucks - Local.csv"

if(!TARGETFILENAME.endsWith(".csv")) throw "Not valid .csv file!"

const BASEFILENAME = TARGETFILENAME.slice(0, TARGETFILENAME.indexOf(".csv"));
const JSONFILENAME = `${BASEFILENAME}.json`

const READPROMISE = new Promise((resolve, reject) => {

    let data = [];
    fs.createReadStream(TARGETFILENAME).pipe(csv()).on("data", (row) => {
        data.push(row);
    }).on("end", () => {
        resolve(data);
    }).on("error", (error) => {
        reject(error);
    })

});

(async () => {

    let data = await READPROMISE;

    fs.writeFileSync(JSONFILENAME, JSON.stringify(data))

})();
