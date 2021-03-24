const csvToJson = require('csvtojson');
const fs = require('fs')

const isro_observed_map = {}

const mapIsroElements = (isroElements) => {
  isroElements.map((item, id) => {
    const name = item['Source_Name']
    if(name !== '' && !isro_observed_map.hasOwnProperty(name)) {
      isro_observed_map[name] = []
      isro_observed_map[name].push(item)
    } 
    else if(name !== '') {
      isro_observed_map[name].push(item)
    }
  })
}
const storeData = (data, path) => {
  try {
    fs.writeFileSync(path, JSON.stringify(data))
  } catch (err) {
    console.error(err)
  }
}
// const readCsvStoreJson = async (energySources, isroElements, pathToJsonFile) => {
  
//   try {

//     let data = []
//     energySources.map((item, id) => {
//       item['id'] = id;
//       item['ISRO details'] = []
//       item['ISRO details count'] = 0

//       let delta = 0
//       let alpha = 0
//       for (var key in item) {
//         if(item.hasOwnProperty(key)) {
//           let value = item[key]
//           if(key === 'RA (h)')
//               delta += parseFloat(value) * 15
//           else if(key == 'RA (min)')
//               delta += parseFloat(value) / 4
//           else if(key == 'RA (sec)')
//               delta += parseFloat(value) / 240
//           else if(key == 'DE (deg)')
//               alpha += parseFloat(value)
//           else if(key == 'DE (arcmin)')
//               alpha += parseFloat(value) / 60
//         }
//       }
//       x = Math.cos(delta) * Math.cos(alpha)
//       y = Math.cos(delta) * Math.sin(alpha)
//       z = Math.sin(delta)
//       item['x'] = x
//       item['y'] = y
//       item['z'] = z

//       isroElements.map((itemO) => {
//         if(itemO['Source_Name'] === item['Observation Name'] && itemO['Source_Name'] !== "") {
//           item['ISRO details'].push(itemO)
//           item['ISRO details count']++;
//         }
//       })
//     })  
//     storeData(data, pathToJsonFile)
//     console.log('data saved successfully! filename is' + pathToJsonFile)
//   } catch (err) {
//     console.log(err)
//   }  
// }
const csvStoreJsonOptimised = async (energySources, isroElements, pathToJsonFile) => {
  
  try {

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
      let x = Math.cos(delta) * Math.cos(alpha)
      let y = Math.cos(delta) * Math.sin(alpha)
      let z = Math.sin(delta)
      item['x'] = x
      item['y'] = y
      item['z'] = z
      let obvName = item['Observation Name']
      if(obvName !== '' && isro_observed_map.hasOwnProperty(obvName)) {
        item['ISRO details'].push(...isro_observed_map[obvName])
        item['ISRO details count']++;
      }
      data.push(item)
    })
    
    storeData(data, pathToJsonFile)
    console.log('data saved successfully! navigate to -----> ' + pathToJsonFile)
  
  } catch (err) {
    console.log(err)
  }  
}

let pathToCsvFileHigh = `assets/data/High_Energy.csv`
let pathToCsvFileLow = `assets/data/Low_Energy.csv`      


let pathToCsvFileB = `assets/data/ISROObvB.csv`

let pathToJsonFileHigh = `assets/data/High_Energy.json`
let pathToJsonFileLow = `assets/data/Low_Energy.json`

const driver = async () => {

  var start, end, time;
  start = new Date().getTime();
  const isroElements = await csvToJson().fromFile(pathToCsvFileB)
  end = new Date().getTime();
  time = end - start;
  console.log('Execution time (in ms) for reading isro observed cosmic sources csv file: ' + time + ' miliseconds\n');

  start = new Date().getTime();
  const highEnergySources = await csvToJson().fromFile(pathToCsvFileHigh)
  end = new Date().getTime();
  time = end - start;
  console.log('Execution time (in ms) for reading high energy cosmic sources csv file: ' + time + ' miliseconds\n');


  start = new Date().getTime();
  const lowEnergySources = await csvToJson().fromFile(pathToCsvFileLow)
  end = new Date().getTime();
  time = end - start;
  console.log('Execution time (in ms) for reading low energy cosmic sources csv file: ' + time + ' miliseconds\n');

  start = new Date().getTime();
  mapIsroElements(isroElements)
  end = new Date().getTime();
  time = end - start;
  console.log('Execution time (in ms) for mapping data: ' + time + ' miliseconds\n');

  start = new Date().getTime();
  csvStoreJsonOptimised(highEnergySources, isroElements, pathToJsonFileHigh)
  end = new Date().getTime();
  time = end - start;
  console.log('Execution time (in ms) for processing high energy csv data (optimised code): ' + time + ' miliseconds\n');

  start = new Date().getTime();
  csvStoreJsonOptimised(lowEnergySources, isroElements, pathToJsonFileLow)
  end = new Date().getTime();
  time = end - start;
  console.log('Execution time (in ms) for processing low energy csv data (optimised code): ' + time + ' miliseconds\n');

  // start = new Date().getTime();
  // readCsvStoreJson(highEnergySources, isroElements, pathToJsonFileHigh)
  // end = new Date().getTime();
  // time = end - start;
  // console.log('Execution time (in ms) for processing high energy csv data (brute force code): ' + time + ' miliseconds\n');

  // start = new Date().getTime();
  // readCsvStoreJson(lowEnergySources, isroElements, pathToJsonFileLow)
  // end = new Date().getTime();
  // time = end - start;
  // console.log('Execution time (in ms) for processing low energy csv data (brute force code): ' + time + ' miliseconds\n');

}

driver()
 


