const dirname = require("../dirname");
const multer = require("multer");
const path = require("path");

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let dir = dirname.dirpath + "/assets/data/";
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    if (file.fieldname === "fileOne") {
      cb(null, "lowEnergySources" + path.extname(file.originalname));
    } else {
      cb(null, "highEnergySources" + path.extname(file.originalname));
    }
  },
});

exports.upload = multer({ storage: storage }).fields([
  { name: "fileOne", maxCount: 1 },
  { name: "fileTwo", maxCount: 1 },
]);

exports.csvUploadController = (req, res) => {
  res.render("admin", { name: req.body.name, success: true });
};
