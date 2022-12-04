const fs = require("fs");
const csv = require("fast-csv");
const cliProgress = require("cli-progress");

const data = {};
const t1 = new Date().getTime();

const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

bar1.start(3084448, 0);

fs.createReadStream("./IP2LOCATION-LITE-DB3.CSV")
  .pipe(csv.parse({ headers: false }))
  .on("error", (error) => console.error(error))
  .on("data", (row) => {
    bar1.increment(1);
    const IP1 = Number(row[0]);
    const IP2 = Number(row[1]);
    const countryName = row[3];
    const regionName = row[4];
    if (countryName === "-" || regionName === "-" || isNaN(IP1) || isNaN(IP2)) {
      return;
    }
    if (!data[countryName]) {
      data[countryName] = {};
    }
    if (!data[countryName][regionName]) {
      data[countryName][regionName] = [IP1, IP2];
    } else {
      const [i1, i2] = data[countryName][regionName];
      if (IP1 < i1) {
        data[countryName][regionName][0] = IP1;
      }
      if (IP2 > i2) {
        data[countryName][regionName][1] = IP2;
      }
    }
  })
  .on("end", () => {
    bar1.stop();
    fs.writeFile("region-IP-data.json", JSON.stringify(data), function (err) {
      if (err) console.log(err);
      const t2 = new Date().getTime();
      console.log("processed in", t2 - t1, "milliseconds");
    });
  });
