var c = document.getElementById("myCanvas");
document.addEventListener("keypress", onKeyDown);


var ctx = c.getContext("2d");
ctx.fillStyle = "#00FF00";
ctx.fillRect(0, 0, c.clientWidth, c.clientHeight)


function onKeyDown() {
    alert("onkeydown");
}