// import { Coordinates, CalculationMethod, PrayerTimes, Madhab } from "adhan";
// const coordinates = new Coordinates(40.0082868, 32.8422953);
// const params = CalculationMethod.Turkey();
// const date = new Date();
// const prayerTimes = new PrayerTimes(coordinates, date, params);

// console.log(prayerTimes);
const fs = require("fs");
const csv = require("fast-csv");

const data = {};
let cntCoord = 0;
const t1 = new Date().getTime();

fs.createReadStream("./IP2LOCATION-LITE-DB5.IPV6.CSV")
  .pipe(csv.parse({ headers: false }))
  .on("error", (error) => console.error(error))
  .on("data", (row) => {
    const countryCode = row[2];
    const countryName = row[3];
    const regionName = row[4];
    const cityName = row[5];
    const lat = row[6];
    const lng = row[7];
    if (countryCode === "-" || countryName === "-" || regionName === "-") {
      return;
    }
    if (!data[countryName]) {
      data[countryName] = { code: countryCode, regions: {} };
    }
    if (!data[countryName].regions[regionName]) {
      data[countryName].regions[regionName] = {};
    }
    if (!data[countryName].regions[regionName][cityName]) {
      data[countryName].regions[regionName][cityName] = [
        Number(lat),
        Number(lng),
      ];
      cntCoord++;
    }
  })
  .on("end", () => {
    console.log("coordinate count: ", cntCoord);
    fs.writeFile("countryData.json", JSON.stringify(data), function (err) {
      if (err) console.log(err);
      const t2 = new Date().getTime();
      console.log("processed in", t2 - t1, "milliseconds");
    });
  });
