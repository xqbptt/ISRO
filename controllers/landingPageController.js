const { loginData } = require("../secrets/admin");

exports.landingPage = (req, res) => {
  res.render("index");
};

exports.adminLogin = (req, res) => {
  res.render("adminLogin");
};

exports.adminLoginTask = (req, res) => {
  const { userName, password } = req.body;
  let isValid = false;
  console.log(userName, password);
  loginData.every(({ dbUserName, dbPassword }) => {
    if (dbUserName === userName && dbPassword === password) {
      isValid = true;
      return false;
    } else {
      return true;
    }
  });
  if (isValid) {
    return res.render("admin", { name: userName });
  }
  res.render("unAuthorized");
};
