const fs = require("fs");
const util = require("util");
const path = require("path");
const dirname = require("../dirname");

const readPromise = util.promisify(fs.readFile);

exports.toolController = (req, res) => {
  res.render("index");
};

exports.jsonSendingController = async (req, res) => {
  const fileName = req.params.energyName;

  if (fileName === "lowEnergy" || fileName === "highEnergy") {
    try {
      data = await readPromise(path.resolve(`./assets/data/${fileName}.json`));
      return res.status(200).json(JSON.parse(data));
    } catch (err) {
      console.log(err);
    }
  }
  return res.status(404).json({ message: "Check your request" });
};
