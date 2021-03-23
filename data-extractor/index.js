const csvToJson = require('csvtojson');
const fs = require('fs')

const storeData = (data, path) => {
  try {
    fs.writeFileSync(path, JSON.stringify(data))
  } catch (err) {
    console.error(err)
  }
}
const readCsvStoreJson = async (pathToCsvFileA, pathToCsvFileB, pathToJsonFile) => {
  
  try {
    const isroElements = await csvToJson().fromFile(pathToCsvFileB)
    const energySources = await csvToJson().fromFile(pathToCsvFileA)

    let data = []
    energySources.map((item, id) => {
      item['id'] = id;
      item['ISRO details'] = []
      item['ISRO details count'] = 0

      let delta = 0
      let alpha = 0
      for (var key in item) {
        if(item.hasOwnProperty(key)) {
          let value = item[key]
          if(key === 'RA (h)')
              delta += parseFloat(value) * 15
          else if(key == 'RA (min)')
              delta += parseFloat(value) / 4
          else if(key == 'RA (sec)')
              delta += parseFloat(value) / 240
          else if(key == 'DE (deg)')
              alpha += parseFloat(value)
          else if(key == 'DE (arcmin)')
              alpha += parseFloat(value) / 60
        }
      }
      x = Math.cos(delta) * Math.cos(alpha)
      y = Math.cos(delta) * Math.sin(alpha)
      z = Math.sin(delta)
      item['x'] = x
      item['y'] = y
      item['z'] = z

      isroElements.map((itemO) => {
        if(itemO['Source_Name'] === item['Observation Name'] && itemO['Source_Name'] !== "") {
          item['ISRO details'].push(itemO)
          item['ISRO details count']++;
        }
      })
      data.push(item)
    })
    
    storeData(data, pathToJsonFile)
    console.log('data saved successfully!')
  
  } catch (err) {
    console.log(err)
  }  
}

let pathToCsvFileHigh = `assets/data/High_Energy.csv`
let pathToCsvFileLow = `assets/data/Low_Energy.csv`      


let pathToCsvFileB = `assets/data/ISROObvB.csv`

let pathToJsonFileHigh = `assets/data/High_Energy.json`
let pathToJsonFileLow = `assets/data/Low_Energy.json` 

readCsvStoreJson(pathToCsvFileHigh, pathToCsvFileB, pathToJsonFileHigh)
readCsvStoreJson(pathToCsvFileLow, pathToCsvFileB, pathToJsonFileLow)

