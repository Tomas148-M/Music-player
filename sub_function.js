//**********Player_subfunkce**********************/

function initMp3Player(){
	context = new AudioContext(); // AudioContext object instances
	analyser = context.createAnalyser(); // AnalyserNode method
	canvas = document.getElementById('player_analyser_render');
	ctx = canvas.getContext('2d');
	// Re-route audio playback into the processing graph of the AudioContext
	source = context.createMediaElementSource(audio); 
	source.connect(analyser);
	analyser.connect(context.destination);
}
//*****************************************************************************/	
// frameLooper() animates any style of graphics you wish to the audio frequency
// Looping at the default frame rate that the browser provides(approx. 60 FPS)
function frameLooper(){
	if(side==1){
		if(MP3.zmena){
			canvas = document.getElementById('player_analyser_render');
			ctx = canvas.getContext('2d');
			MP3.zmena=0;
		}	
		window.webkitRequestAnimationFrame(frameLooper);
		fbc_array = new Uint8Array(analyser.frequencyBinCount);
		analyser.getByteFrequencyData(fbc_array);
		ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
		ctx.fillStyle = '#00CCFF'; // Color of the bars
		bars = 80;
		for (var i = 0; i < bars; i++) {
			bar_x = i * 4;
			bar_width = 2;
			bar_height = -(fbc_array[i] / 2);
	  	//fillRect( x, y, width, height ) // Explanation of the parameters below
			ctx.fillRect(bar_x, canvas.height, bar_width, bar_height);
	}
  }
}
//*******************************************************************************************/
//*****************************Seting FUNCTIONS**********************************************/
//*******************************************************************************************/
function myFunction() {
  // Get the checkbox
  var checkBox = document.getElementById("player_myCheck");
  // Get the output text
  var text = document.getElementById("player_text");

  // If the checkbox is checked, display the output text
  if (checkBox.checked == true){
    text.style.display = "block";
  } else {
    text.style.display = "none";
  }
}
//******************************************************************************
var simulateClick = function (elem) {
	// Create our event (with options)
	var evt = new MouseEvent('click', {
		bubbles: true,
		cancelable: true,
		view: window
	});
	// If cancelled, don't dispatch our event
	var canceled = !elem.dispatchEvent(evt);
};
//*****************************************************************************/
//Generuje nahodne cislo z urciteho rozsahu
function GetRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
/*******************************************************************************/

//**********************Pozice_mysi*********************************************	
	var isMouseDown = false;
   			document.onmousedown = function() { isMouseDown = true };
			document.onmouseup   = function() { isMouseDown = false };
   		//}

function getPosition(e) {
	    	e = e || window.event;
		    var cursor = {x:0, y:0};

		    if (e.pageX || e.pageY) {
		        cursor.x = e.pageX;
		        cursor.y = e.pageY;
		    } 
		    else {
		        cursor.x = e.clientX + 
		            (document.documentElement.scrollLeft || 
		            document.body.scrollLeft) - 
		            document.documentElement.clientLeft;
		        cursor.y = e.clientY + 
		            (document.documentElement.scrollTop || 
		            document.body.scrollTop) - 
		            document.documentElement.clientTop;
		    }
		    return cursor;
		}
//**********************************************************************		
function funkce(e) {
  		var souradnice = getPosition(e);
  		posuv = ((souradnice.x-156)/504)*100;
  		posuv2 = (((souradnice.x)-165)/510)*100;
  		audio.currentTime=((posuv/100)*MP3.ST);
  		bar(posuv,posuv2);
		}
		
		function yourFunction(e) {
		    if(isMouseDown) {
		        var souradnice = getPosition(e);
		  		posuv = ((souradnice.x-156)/504)*100;
		  		posuv2 = ((((souradnice.x))-165)/510)*100;
		  		(MP3.CT/MP3.ST)*100
		  		audio.currentTime=((posuv/100)*MP3.ST);
		  		bar(posuv,posuv2);
		    }
		}

//****************************************************************************************
function bar(bar,point){
	var zmena;
	if(bar>100 )bar=100;
		if(point>95) point=95;
		if(bar<0)bar=0;
		if(point<0)point=0;
		//console.log(bar.toFixed(0),"--",posuv2.toFixed(0));
		if(bar){
		  	zmena=(posuv2/100)*audio.duration.toFixed(0);
		}
		  	
		var element = document.getElementById("player_myProgress");
		element.style.width = bar+"%";

		//**********************************************
		var element1 = document.getElementById("player_dot");
		element1.style.left = point+"%";
}		

//****************************************************************************************
//Funkce ktera se vyuziva u adresaru vraci jestli se jedna o soubor nebo slozku
function isFolder(item){
	var fs = require('fs');
 	var stat = fs.lstatSync(item);
  	return stat.isDirectory();
}		
