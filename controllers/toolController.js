exports.toolController = (req, res) => {
  const toolNo = req.params.visualizerName;
  const vizNo = {
    1: "One",
    2: "Two",
    3: "Three",
  };
  res.render(`visualizer${vizNo[toolNo]}`);
};
