// function changeLabelName(str) {
//   const idName = "file" + str;
//   let fileName = document.getElementById(idName).value;
//   fileName = fileName.replace(/.*[\/\\]/, "");
//   const className = "#file" + str + " + label";
//   document.querySelector(className).textContent = fileName;
// }
function checkFile(filename) {
  if (filename.includes(".csv")) return true;
  return false;
}
function changeLabelName(str) {
  const idName = "file" + str;
  let fileElement = document.getElementById(idName);
  let fileName = fileElement.value;
  fileName = fileName.replace(/.*[\/\\]/, "");
  const className = "#file" + str + " + label";
  if (!checkFile(fileName)) {
    window.alert("Please upload csv file only");
    //document.querySelector(`#${idName} + label span`);
    //document.querySelector(`#${idName} + label span`).innerText = "text";
  } else {
    document.querySelector(className).textContent = fileName;
  }
}

document.getElementById("submitBtn").addEventListener("click", () => {
  if (
    document.querySelector("#fileOne + label span").innerText ===
      "Choose low energy cosmic sources" ||
    document.querySelector("#fileTwo + label span").innerText ===
      "Choose high energy cosmic source" ||
    document.querySelector("#fileThree + label span").innerText ===
      "Choose astrosat file"
  ) {
    window.alert("Please upload all three csv files");
  }
});
