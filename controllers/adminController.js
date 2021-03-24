const dirname = require("../dirname");
const multer = require("multer");
const path = require("path");
const csvToJson = require("csvtojson");
const fs = require("fs");
const util = require("util");
const writeFilePromise = util.promisify(fs.writeFile);

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let dir = dirname.dirpath + "/assets/data/";
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    if (file.fieldname === "fileOne") {
      cb(null, "lowEnergyA" + path.extname(file.originalname));
    } else if (file.fieldname === "fileTwo") {
      cb(null, "highEnergyA" + path.extname(file.originalname));
    } else {
      cb(null, "isroObvB" + path.extname(file.originalname));
    }
  },
});

exports.upload = multer({ storage: storage }).fields([
  { name: "fileOne", maxCount: 1 },
  { name: "fileTwo", maxCount: 1 },
  { name: "fileThree", maxCount: 1 },
]);

exports.csvUploadController = async (req, res) => {
  const isro_observed_map = {};

  const mapIsroElements = (isroElements) => {
    isroElements.map((item, id) => {
      const name = item["Source_Name"];
      if (name !== "" && !isro_observed_map.hasOwnProperty(name)) {
        isro_observed_map[name] = [];
        isro_observed_map[name].push(item);
      } else if (name !== "") {
        isro_observed_map[name].push(item);
      }
    });
  };
  const storeData = (data, path) => {
    try {
      fs.writeFileSync(path, JSON.stringify(data));
    } catch (err) {
      console.error(err);
    }
  };

  const csvStoreJsonOptimised = async (energySources, pathToJsonFile) => {
    try {
      let data = [];
      energySources.map((item, id) => {
        item["id"] = id;
        item["ISRO details"] = [];
        item["ISRO details count"] = 0;

        let delta = 0;
        let alpha = 0;
        for (var key in item) {
          if (item.hasOwnProperty(key)) {
            let value = item[key];
            if (key === "RA (h)") delta += parseFloat(value) * 15;
            else if (key == "RA (min)") delta += parseFloat(value) / 4;
            else if (key == "RA (sec)") delta += parseFloat(value) / 240;
            else if (key == "DE (deg)") alpha += parseFloat(value);
            else if (key == "DE (arcmin)") alpha += parseFloat(value) / 60;
          }
        }
        let x = Math.cos(delta) * Math.cos(alpha);
        let y = Math.cos(delta) * Math.sin(alpha);
        let z = Math.sin(delta);
        item["x"] = x;
        item["y"] = y;
        item["z"] = z;
        let obvName = item["Observation Name"];
        if (obvName !== "" && isro_observed_map.hasOwnProperty(obvName)) {
          item["ISRO details"].push(...isro_observed_map[obvName]);
          item["ISRO details count"]++;
        }
        data.push(item);
      });

      storeData(data, pathToJsonFile);
      console.log(
        "data saved successfully! navigate to -----> " + pathToJsonFile
      );
    } catch (err) {
      console.log(err);
    }
  };

  let pathToCsvFileHigh = `${dirname.dirpath}/assets/data/highEnergyA.csv`;
  let pathToCsvFileLow = `${dirname.dirpath}/assets/data/lowEnergyA.csv`;

  let pathToCsvFileB = `${dirname.dirpath}/assets/data/isroObvB.csv`;

  let pathToJsonFileHigh = `${dirname.dirpath}/assets/data/highEnergy.json`;
  let pathToJsonFileLow = `${dirname.dirpath}/assets/data/lowEnergy.json`;

  const driver = async () => {
    var start, end, time;
    start = new Date().getTime();
    const isroElements = await csvToJson().fromFile(pathToCsvFileB);
    end = new Date().getTime();
    time = end - start;
    console.log(
      "Execution time (in ms) for reading isro observed cosmic sources csv file: " +
        time +
        " miliseconds\n"
    );

    start = new Date().getTime();
    const highEnergySources = await csvToJson().fromFile(pathToCsvFileHigh);
    end = new Date().getTime();
    time = end - start;
    console.log(
      "Execution time (in ms) for reading high energy cosmic sources csv file: " +
        time +
        " miliseconds\n"
    );

    start = new Date().getTime();
    const lowEnergySources = await csvToJson().fromFile(pathToCsvFileLow);
    end = new Date().getTime();
    time = end - start;
    console.log(
      "Execution time (in ms) for reading low energy cosmic sources csv file: " +
        time +
        " miliseconds\n"
    );

    start = new Date().getTime();
    mapIsroElements(isroElements);
    end = new Date().getTime();
    time = end - start;
    console.log(
      "Execution time (in ms) for mapping data: " + time + " miliseconds\n"
    );

    start = new Date().getTime();
    csvStoreJsonOptimised(highEnergySources, pathToJsonFileHigh);
    end = new Date().getTime();
    time = end - start;
    console.log(
      "Execution time (in ms) for processing high energy csv data (optimised code): " +
        time +
        " miliseconds\n"
    );

    start = new Date().getTime();
    csvStoreJsonOptimised(lowEnergySources, pathToJsonFileLow);
    end = new Date().getTime();
    time = end - start;
    console.log(
      "Execution time (in ms) for processing low energy csv data (optimised code): " +
        time +
        " miliseconds\n"
    );
  };

  driver();
  res.render("admin", { name: req.body.name, success: true });
};

/**
 * Old code
 */

//  const readCsvStoreJson = async (
//   pathToCsvFileA,
//   pathToCsvFileB,
//   pathToJsonFile
// ) => {
//   let data = [];
//   try {
//     const isroElements = await csvToJson().fromFile(pathToCsvFileB);
//     const energySources = await csvToJson().fromFile(pathToCsvFileA);

//     energySources.map((item, id) => {
//       item["id"] = id;
//       item["ISRO details"] = [];
//       item["ISRO details count"] = 0;

//       let delta = 0;
//       let alpha = 0;
//       for (var key in item) {
//         if (item.hasOwnProperty(key)) {
//           let value = item[key];
//           if (key === "RA (h)") delta += parseFloat(value) * 15;
//           else if (key == "RA (min)") delta += parseFloat(value) / 4;
//           else if (key == "RA (sec)") delta += parseFloat(value) / 240;
//           else if (key == "DE (deg)") alpha += parseFloat(value);
//           else if (key == "DE (arcmin)") alpha += parseFloat(value) / 60;
//         }
//       }
//       x = Math.cos(delta) * Math.cos(alpha);
//       y = Math.cos(delta) * Math.sin(alpha);
//       z = Math.sin(delta);
//       item["x"] = x;
//       item["y"] = y;
//       item["z"] = z;

//       isroElements.map((itemO) => {
//         if (
//           itemO["Source_Name"] === item["Observation Name"] &&
//           itemO["Source_Name"] !== ""
//         ) {
//           item["ISRO details"].push(itemO);
//           item["ISRO details count"]++;
//         }
//       });
//       data.push(item);
//     });
//   } catch (err) {
//     console.log("CSVtoJOSN error");
//     console.log(err);
//   }
//   try {
//     await writeFilePromise(pathToJsonFile, JSON.stringify(data));
//     console.log("data saved successfully!");
//   } catch (err) {
//     console.log("Promisify error");
//     console.log(err);
//   }
// };

// const pathToCsvFileHigh = `${dirname.dirpath}/assets/data/highEnergyA.csv`;
// const pathToCsvFileLow = `${dirname.dirpath}/assets/data/lowEnergyA.csv`;

// const pathToCsvFileB = `${dirname.dirpath}/assets/data/isroObvB.csv`;

// const pathToJsonFileHigh = `${dirname.dirpath}/assets/data/highEnergy.json`;
// const pathToJsonFileLow = `${dirname.dirpath}/assets/data/lowEnergy.json`;
// await Promise.all([
//   readCsvStoreJson(pathToCsvFileHigh, pathToCsvFileB, pathToJsonFileHigh),
//   readCsvStoreJson(pathToCsvFileLow, pathToCsvFileB, pathToJsonFileLow),
// ]);
