var elem = document.getElementById("explore");

elem.onclick = function () {
  const append = "/visualization";
  window.history.pushState({}, "", append);
  window.location.reload();
};
