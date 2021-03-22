exports.toolController = (req, res) => {
  const toolNo = req.params.type;
  if(toolNo)
    res.render(`visualizer${toolNo}`);
  res.render('visualizerall')
};
