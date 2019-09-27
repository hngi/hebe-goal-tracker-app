/*Script of Add Goal*/

var popup = document.getElementById('popup');
var show_popup = document.getElementById("li-1");
var close_popup = document.getElementById("close_popup");
show_popup.onclick = function(){
    popup.style.display = "block";
}
close_popup.onclick = function(){
    popup.style.display = "none";
}
window.onclick = function(event){
    if(event.target == popup){
        popup.style.display = "none";
    }
}
