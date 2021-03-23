function changeLabelName(str) {
  const idName = "file" + str;
  let fileName = document.getElementById(idName).value;
  fileName = fileName.replace(/.*[\/\\]/, "");
  const className = "#file" + str + " + label";
  document.querySelector(className).textContent = fileName;
}
