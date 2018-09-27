let sectors = document.getElementsByClassName('modal');

let btns=[];
let popWindows=[];
let closeWindows=[];


for(let i=0; i<sectors.length; i++){
    let btni = document.getElementById("popBtn"+ i);
    btns.push(btni);
    let popWindow = document.getElementById("popWindow"+ i);
    popWindows.push(popWindow);
    let closeWindow = document.getElementById("closeWindow"+ i);
    closeWindows.push(closeWindow);
    
}


btns.forEach(function(btn, i){ /* event listener to open pop up reviews*/
    btn.onclick = function() {
            popWindows[i].style.display = "block";
    }
});


closeWindows.forEach(function(closeBtn,i){ /* initial hidden pop up*/
    closeBtn.onclick=function(){
        popWindows[i].style.display = "none";
    }
});


