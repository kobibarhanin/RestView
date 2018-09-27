
function OpenIconMenu() {
    var x = document.getElementById("id-tabs-menu");
    if (x.className === "tabs-menu") {
        x.className += " responsive";
    } else {
        x.className = "tabs-menu";
    }
}