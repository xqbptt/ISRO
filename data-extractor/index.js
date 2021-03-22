const csvToJson = require('csvtojson');
const fs = require('fs')

const storeData = (data, path) => {
  try {
    fs.writeFileSync(path, JSON.stringify(data))
  } catch (err) {
    console.error(err)
  }
}
const readCsvStoreJson = (pathToCsvFile, pathToJsonFile) => {
  csvToJson().fromFile(pathToCsvFile)
      .then(users => {
          let data = []
          users.map((item, id) => {
              item['id'] = id
              data.push(item)
          })
          storeData(data, pathToJsonFile)
          console.log("data saved successfully!")
      })
      .catch(err => {
          console.log(err)
      })
}

let pathToCsvFileHigh = `assets/data/High_Energy.csv`
let pathToCsvFileLow = `assets/data/Low_Energy.csv`      

let pathToJsonFileHigh = `assets/data/High_Energy.json`
let pathToJsonFileLow = `assets/data/Low_Energy.json` 

readCsvStoreJson(pathToCsvFileHigh, pathToJsonFileHigh)
readCsvStoreJson(pathToCsvFileLow, pathToJsonFileLow)

