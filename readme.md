# Geo Data Generator

run `node index.js` to generate geo-location data inside `countryData.json`

Processes IP2LOCATION-LITE-DB5.IPV6.CSV file (.gitignored since it is too large) from https://lite.ip2location.com/database/db5-ip-country-region-city-latitude-longitude

generates data like

```
{
    "United States of America": {
        "code":"US",
        "regions": { "California": { "Los Angeles" :[34.052859,-118.24357], "San Jose":[37.33939,-121.89496] } }
    },
    ...
}
```

This site or product includes IP2Location LITE data available from <a href="https://lite.ip2location.com">https://lite.ip2location.com</a>.
