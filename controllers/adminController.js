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
  const readCsvStoreJson = async (
    pathToCsvFileA,
    pathToCsvFileB,
    pathToJsonFile
  ) => {
    let data = [];
    try {
      const isroElements = await csvToJson().fromFile(pathToCsvFileB);
      const energySources = await csvToJson().fromFile(pathToCsvFileA);

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
        x = Math.cos(delta) * Math.cos(alpha);
        y = Math.cos(delta) * Math.sin(alpha);
        z = Math.sin(delta);
        item["x"] = x;
        item["y"] = y;
        item["z"] = z;

        isroElements.map((itemO) => {
          if (
            itemO["Source_Name"] === item["Observation Name"] &&
            itemO["Source_Name"] !== ""
          ) {
            item["ISRO details"].push(itemO);
            item["ISRO details count"]++;
          }
        });
        data.push(item);
      });
    } catch (err) {
      console.log("CSVtoJOSN error");
      console.log(err);
    }
    try {
      await writeFilePromise(pathToJsonFile, JSON.stringify(data));
      console.log("data saved successfully!");
    } catch (err) {
      console.log("Promisify error");
      console.log(err);
    }
  };

  const pathToCsvFileHigh = `${dirname.dirpath}/assets/data/highEnergyA.csv`;
  const pathToCsvFileLow = `${dirname.dirpath}/assets/data/lowEnergyA.csv`;

  const pathToCsvFileB = `${dirname.dirpath}/assets/data/isroObvB.csv`;

  const pathToJsonFileHigh = `${dirname.dirpath}/assets/data/highEnergy.json`;
  const pathToJsonFileLow = `${dirname.dirpath}/assets/data/lowEnergy.json`;
  await Promise.all([
    readCsvStoreJson(pathToCsvFileHigh, pathToCsvFileB, pathToJsonFileHigh),
    readCsvStoreJson(pathToCsvFileLow, pathToCsvFileB, pathToJsonFileLow),
  ]);

  res.render("admin", { name: req.body.name, success: true });
};
