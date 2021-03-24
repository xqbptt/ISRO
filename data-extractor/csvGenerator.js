const fs = require('fs')
const { Parser } = require('json2csv');
const jsonFile = require('../assets/data/High_Energy.json')

const fieldsSource = ['Observation Name','Name','ISRO Observed','X-ray type','RA (h)','RA (min)','RA (sec)','DE (deg)','DE (arcmin)','DE (arcsec)','Galactic Longitude (deg)','Galactic Lattitude (deg)','Observation Type','Position Accuracy (arcsec)','V (mag)','B - V (mag)','U - B (mag)','E(B - V) (mag)','Average Flux (mag)','Range','Orbital Period (d)','Pulse Period (s)','Spectral Type','Other Name 1','Other Name 2','Title 1','URL 1','Title 2','URL 2'];
const fieldsISRO = ['Serial Number', 'Observation_Timestamp', 'Proposal_ID', 'Target_ID', 'RA', 'Dec', 'Observation_ID', 'Prime_Instrument']

var index = 10;

const pathToFile = './assets/data/'
try {
  let jsonObject1 = jsonFile[index]

  const parser = new Parser({quote: '', fields: fieldsSource});
  const csvSource = parser.parse(jsonObject1);
  fs.writeFile(pathToFile + 'downloadSource.csv', csvSource, (err) => {
    if (err)
      console.log(err);
    else
      console.log("Source file written successfully\n");

  });

  if(jsonObject1['ISRO details count']) {
    const parser2 = new Parser({quote: '', fields: fieldsISRO});
    let jsonObject2 = jsonObject1['ISRO details']
    const csvIsro = parser2.parse(jsonObject2)
    fs.writeFile(pathToFile + 'downloadIsro.csv', csvIsro, (err) => {
        if (err)
          console.log(err);
        else {
          console.log("ISRO file written successfully\n");
        }
    });      
  }  

} catch (err) {
  console.error(err);
}