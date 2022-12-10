const fs = require("fs");
const csv = require("fast-csv");
const cliProgress = require("cli-progress");

const data = {};
let cntCoord = 0;
const t1 = new Date().getTime();

const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

const eng2tr = {
  Istanbul: "İstanbul",
  Izmir: "İzmir",
  Kahramanmaras: "Kahramanmaraş",
  Kutahya: "Kütahya",
  Canakkale: "Çanakkale",
  Nigde: "Niğde",
  Diyarbakir: "Diyarbakır",
  Sanliurfa: "Şanlıurfa",
  Sirnak: "Şırnak",
  Aydin: "Aydın",
  Mugla: "Muğla",
  Elazig: "Elazığ",
  Nevsehir: "Nevşehir",
  Duzce: "Düzce",
  Corum: "Çorum",
  Gumushane: "Gümüşhane",
  Eskisehir: "Eskişehir",
  Tekirdag: "Tekirdağ",
  Agri: "Ağrı",
  Kirikkale: "Kırıkkale",
  Adiyaman: "Adıyaman",
  Usak: "Uşak",
  Balikesir: "Balıkesir",
  Bingol: "Bingöl",
  Karabuk: "Karabük",
  Cankiri: "Çankırı",
  Bartin: "Bartın",
  Kirsehir: "Kırşehir",
  Kirklareli: "Kırklareli",
  Mus: "Muş",
  Igdir: "Iğdır",
};

bar1.start(4969097, 0);

fs.createReadStream("./IP2LOCATION-LITE-DB5.IPV6.CSV")
  .pipe(csv.parse({ headers: false }))
  .on("error", (error) => console.error(error))
  .on("data", (row) => {
    bar1.increment(1);
    const countryCode = row[2];
    const countryName = row[3];
    let regionName = row[4];
    let cityName = row[5];
    const lat = row[6];
    const lng = row[7];
    if (countryCode === "-" || countryName === "-" || regionName === "-") {
      return;
    }
    if (eng2tr[regionName]) {
      regionName = eng2tr[regionName];
    }
    if (eng2tr[cityName]) {
      cityName = eng2tr[cityName];
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
    bar1.stop();
    console.log("coordinate count: ", cntCoord);
    fs.writeFile("countryData.json", JSON.stringify(data), function (err) {
      if (err) console.log(err);
      const t2 = new Date().getTime();
      console.log("processed in", t2 - t1, "milliseconds");
    });
  });
