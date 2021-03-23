exports.landingPage = (req, res) => {
  res.render("landingPage");
};

exports.adminLogin = (req, res) => {
  res.render("adminLogin");
};

exports.adminLoginTask = (req, res) => {
  const { userName, password } = req;
  res.render("admin", { name: userName });
};
