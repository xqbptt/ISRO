exports.landingPage = (req, res) => {
  res.render("index");
};

exports.adminLogin = (req, res) => {
  res.render("adminLogin");
};

exports.adminLoginTask = (req, res) => {
  const { userName, password } = req;
  res.render("admin", { name: userName });
};
