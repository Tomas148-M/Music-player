	var audio = new Audio();
   	var posuv=0;
	var posuv2=0;
	var time;
	//****************
	var side;//cislovani stranek
	//Side=1->player
	//Side=2->Explorer
	//Side=3->Setting
	var fs = require('fs');
	//var path='Hudba';//Globalni cesta do aktualni slozky
	/*
	var Firstpath=[];//Pocatecni cesta k porovnani pri automatickem vyhledavani podslozkou
					 //slouzi k tomu aby se pri vyhledavani neskakalo do slozek nad vybranou slozkou
	var Findpath=path;//Globalni cesta do aktualni slozky
	var	CT=0;//aktualni cas prehravane skladby	
	var ST=0;//Stop time celkova doba prave prehravane skladby
	var song_name=[]; //Buffer s nazvy songu ve zobrazene slozce
	var folder_name=[];//Buffer s nazvy složek v zobrazene slozce
	var play_song=[]; //Buffer s prehravanymi songy
	var folderAut=[];//buffer pro automaticke nacitani slozek;
	var Songhistory=[];//Buffer s jiz prehranymi songy
	var current_Songnumber;//pozice aktulne prehravane pisnicky v bufferu
	var aktivace=0;//Pomocna promenna ktera zajisti ze se analyzator inicializuje pouze jednou po startu
	var zmena=0;//Detekuje ze probehlo prepnuti ze stranky player na jinou pro vykresleni canvas
	*/
	var canvas, ctx, source, context, analyser, fbc_array, bars, bar_x, bar_width, bar_height;
	// Initialize the MP3 player after the page loads all of its HTML into the window
 	//window.addEventListener("load", initMp3Player, false);
 	
 	//var indicator=0;//Pro ikony pod spektrem
 	const loop=1,random=2,kos=4,volume=8,end=16,user=32;
 	var notification=0;
	var task=0;//Pro funkci SongPlay
	const t_play=1,t_pause=2,t_zobraz=4;

	var MP3={
		 path:'Hudba',//Globalni cesta do aktualni slozky
		 Firstpath:[],//Pocatecni cesta k porovnani pri automatickem vyhledavani podslozkou//slouzi k tomu aby se pri vyhledavani neskakalo do slozek nad vybranou slozkou
		 Findpath:'Hudba',//Globalni cesta do aktualni slozky
		 CT:0,//aktualni cas prehravane skladby	
		 ST:0,//Stop time celkova doba prave prehravane skladby
		 song_name:[], //Buffer s nazvy songu ve zobrazene slozce
		 folder_name:[],//Buffer s nazvy složek v zobrazene slozce
		 play_song:[], //Buffer s prehravanymi songy
		 folderAut:[],//buffer pro automaticke nacitani slozek;
		 Songhistory:[],//Buffer s jiz prehranymi songy
		 current_Songnumber:0,//pozice aktulne prehravane pisnicky v bufferu
		 aktivace:0,//Pomocna promenna ktera zajisti ze se analyzator inicializuje pouze jednou po startu
		 zmena:0,//Detekuje ze probehlo prepnuti ze stranky player na jinou pro vykresleni canvas
		//var canvas, ctx, source, context, analyser, fbc_array, bars, bar_x, bar_width, bar_height;
		// Initialize the MP3 player after the page loads all of its HTML into the window
	 	//window.addEventListener("load", initMp3Player, false);
	 	
	 	 indicator:0,//Pro ikony pod spektrem
	 	 notification:0,
	 	 task:0,//Pro ulohy ktere se maji vykonat SongPlay
		 device:'',
	}
	var vl=0;

//*************************************************************************** 
function MP3_Init(){

	var contents = '';
	//Pokud existuje backup soubor vycte z nej data
	if (fs.existsSync("backup.ini")){
		if(contents = fs.readFileSync("backup.ini")){
			if(contents.length>0)
				try {
					MP3 = JSON.parse(contents);
				}
				catch{
					contents=0;
				}
		}
	}	
	if(fs.existsSync("backup2.ini") && !contents)
		if((contents = fs.readFileSync("backup2.ini"))){
			if(contents.length>0)
				try {
					MP3 = JSON.parse(contents);
				}
				catch{
					contents=0;
				}
	}
	if(!contents)
	{
		MP3.path='Hudba';
		MP3.Findpath=MP3.path;
	}
	MP3.task=0;
	
	Systimer = setInterval(MP3_system,1000);
	MP3.aktivace=0;
	if(MP3.CT>0 && MP3.song_name.length>=0){
		audio.src=MP3.path+'/'+MP3.song_name[MP3.current_Songnumber];
		audio.currentTime=MP3.CT;
		console.log(audio.src);
	}
	if(audio.src)MP3.task|=t_zobraz;//zajisti zobrazeni nazvu pisnicky pri restartu
	
}
//*************************************************************************** 
function MP3_system(){
	if (!audio.paused)MP3_Backup();
	/*
	if(MediaDetect()!=false)
	{
		MP3.path=MediaDetect();
		Mp3.Findpath=Mp3.path;
	}
	else{
		MP3.task|=t_pause;
		MP3.path='Hudba';
		MP3.Findpath='Hudba';
	}
*/
}
//****************************************************************************************
//Funkce slouzi k detekovani FLASH disku 
function MediaDetect(){
 	if(process.platform == "linux"){
 		fs.exists('/media/pi', (exists) => {
		    fs.watch('/media/pi', (eventType, fsname) => {
		    //console.log('eventType '+eventType);
		    // could be either 'rename' or 'change'. new fs event and delete
		    // also generally emit 'rename'
		    //console.log('fsname '+fsname);
		    //var mediapath='/media/pi/';
		    //cesta je "'/media/pi/'+fsname"

		    if (fs.existsSync('/media/pi/'+fsname)) {   
		      	MP3.device=fsname;   
		      }
		      else{   
		        MP3.device='';  
		      }
		    });
		});
	if(MP3.device!=''){
		return true;
	}
	else{
		//MP3.device='';
		return false;
	} 	
}
if(process.platform == "win32"){
 
}
}
//*************************************************************************** 
//Funkce uklada data do souboru backup.ini
function MP3_Backup(){
	fs.writeFile("backup.ini",JSON.stringify(MP3), function(err) {
	    if(err) {
	        return console.log(err);
	    }
	});
	fs.writeFile("backup2.ini",JSON.stringify(MP3), function(err) {
	    if(err) {
	        return console.log(err);
	    }
	});
}	
//*******************************************************************************
function MP3_Folderlist(param,hide){
 var fs = require('fs');
if (process.argv.length <= 2) {
    console.log("Usage: " + __fsname + " path/to/directory");
    process.exit(-1);
}
if(hide==false){ //plati pro automatiku
	MP3.song_name=[];
	MP3.folder_name=[];
	document.getElementById("player_file_explorer").innerHTML ='<p class=\"player_f_directory\" onclick=\"MP3_List(\'/\')\"><img src=\"Icons/folder.png\" width=\"50px;\" height=\"50px;\"><span>../</span></p>';

}
else
{
	MP3.folderAut=[];
	MP3.play_song=[];
}
	
var items = fs.readdirSync(param);
for (var i=0; i<items.length; i++) {
    var file = param + '/' + items[i];
    var file2 = items[i];
    if(hide==false){
		if(fs.statSync(file).isFile()){
			document.getElementById("player_file_explorer").innerHTML += "<p class='f_fs' id='"+ i +"'onclick='MP3_SelectSong("+i+")'><img src='Icons/song.png' width='40px;' height='40px;'><span>"+ items[i]+"</span></p>"; 
			MP3.song_name.push(items[i]);
		}
   		else{
   			document.getElementById("player_file_explorer").innerHTML += "<p class='f_directory' id='"+ i +"'onclick='MP3_List("+i+")'><img src='Icons/folder.png' width='50px;' height='50px;'><span>"+ items[i]+"</span></p>"; 
   			MP3.folder_name.push(items[i]);
   		}
   	}
   	else
   	{
   		if(fs.statSync(file).isFile())MP3.play_song.push(items[i]);
   		else MP3.folderAut.push(items[i]);
		}
 }
}
//***********************************************************************************************
function End_load(){
//*****************************Pro stranku explorer*******************************
	if(side==2){
		if(MP3.Findpath!=''){
			MP3_Folderlist(MP3.Findpath,false);
		}
		else{
			var content="<div id='Scontainer'><center><div id='source_container' onclick='MP3_Folderlist(MP3.Findpath=\"Hudba\",false);'><img src='Icons/card.png' id='source_img'></div>";
			if(MediaDetect())
				content+="<div id='source_container' onclick='MP3_Folderlist(MP3.Findpath=\"/media/pi/\",false);'><img src='Icons/usb.png' id='source_img'></div>";
			content+="</center></div>";
			document.getElementById("player_file_explorer").innerHTML =content;
		}
		vl=audio.volume;
	}
//*****************************Pro stranku player*********************************
	if(side==1){
			if(!time)time= setInterval(MP3_Play_time,100);
			MP3.task=MP3_SongPlay(MP3.task);
			MP3_Play_time();
			if(audio.src)MP3.task|=t_zobraz;//zajisti zobrazeni nazvu pisnicky pri restartu
			if(!MP3.aktivace){
				MP3.aktivace=1;
				initMp3Player();//Inicicialize analyzeru pro spektrum
			}
			frameLooper();//Vykreseleni spekta
			if(MP3.indicator & kos)MP3_Mode_playing("kos");
			if(MP3.indicator & random)MP3_Mode_playing("random");
			if(MP3.indicator & loop)MP3_Mode_playing("loop");
			//console.log(vl*100);
			//document.getElementById("player_controls").innerHTML ="<input type='range' value='" +vl*100+ "' step='1' min='0' max='100' class='slider' id='myRange'>";
		}
	else{ 
		time=clearInterval(time);
		zmena=1;
	}
	///active_obr=x;
    //if(process.platform=="linux")update('all');   
//*******************************************************************************	
}	
function Change(x){
	side=x;//cislovani stranek
}
//*******************************************************************************************/
//*****************************PLAYER FUNCTIONS**********************************************/
//*******************************************************************************************/
//window.addEventListener("load", initMp3Player, false);
function MP3_List(x){
	var pos=NaN;
	if(x!='/'){
		pos=MP3.folder_name.indexOf(document.getElementById(x).innerText);
		if(pos>=0){
			MP3.Findpath+='/'+MP3.folder_name[pos];
			loadWholePage('file_explorer.html','screen',End_load);
		}
	}
  	if(x=='/'){	
  		pos=MP3.Findpath.lastIndexOf('/');
		if(MP3.Findpath!='MP3')MP3.Findpath=MP3.Findpath.substring(0, pos);
		loadWholePage('file_explorer.html','screen',End_load);
		

	}
}
//*************************************************************************/
/* Poznamky
indicator=0;//Pro ikony pod spektrem
loop=1,random=2,kos=4,volume=8,end=16,user=32;
notification=0;
task=0;//Pro funkci SongPlay
t_play=1,t_pause=2,t_zobraz=4;
*/
function MP3_SongPlay(operace){
	if(((audio.paused ) && (operace & t_play) && !(MP3.indicator & end) || (MP3.indicator & user) || (MP3.indicator & loop) ) && !(operace & t_pause)){
		setvolume();
		audio.play();
		operace&=~t_play;
		MP3.indicator&=~user;
		MP3.indicator&=~end;

	}
	if((audio.paused==false && operace & t_pause) ){
		audio.pause();
		operace&=~t_pause;
		MP3.indicator&=~user;
	}

	if(audio.paused==true && side==1 ){
		document.getElementById("player_play_pause").innerHTML= "<img src='Icons/Icons3/play1.png' width='40px;' height='40px;'' style='position: relative;top:10px;'>";	
	}
	if((audio.paused && MP3.indicator & end) || (operace & t_zobraz) || audio.paused == false  && side==1 ){ 
		var orez=MP3.play_song[MP3.current_Songnumber].search(".mp3");//nalezeni pozice .mp3
		document.getElementById("player_song_name").innerHTML = MP3.play_song[MP3.current_Songnumber].substring(0,orez);//odstraneni .mp3 z nazvu
		operace&=~t_zobraz;
	}	
	//Zobrazeni nazvu pisne po zapnuti playeru z backup 					
	/*if(side==1 && operace & t_zobraz){
		//var orez=MP3.play_song[MP3.current_Songnumber].search(".mp3");//nalezeni pozice .mp3
		//document.getElementById("player_song_name").innerHTML = MP3.play_song[MP3.current_Songnumber].substring(0,orez);//odstraneni .mp3 z nazvu
		//operace&=~t_zobraz;
	}			
	*/				 
	if((audio.paused == false && side==1)){
		document.getElementById("player_play_pause").innerHTML= "<img src='Icons/Icons3/pause.png' width='40px;' height='40px;'' style='position: relative;top:10px;'>";
		//var orez=MP3.play_song[MP3.current_Songnumber].search(".mp3");//nalezeni pozice .mp3
		//document.getElementById("player_song_name").innerHTML = MP3.play_song[MP3.current_Songnumber].substring(0,orez);//odstraneni .mp3 z nazvu
		
	}
	return operace;
}
//***************************************************************************
function MP3_SelectSong(x){
	var zmena1=1;
	MP3.play_song=MP3.song_name;//priradi nazev vybraneho songu do playeru 
	MP3.path=MP3.Findpath;//priradi vylistovanou cestu do aktualni cesty pro hrani
	MP3.folderAut=MP3.folder_name;//folderAut pro automaticke vylistovani
	MP3.Firstpath=MP3.path;//nastaveni referencni cesty pro podlozky
	MP3.Songhistory=[];//smazani historie prehravani
	if(x>=0){
		MP3.current_Songnumber=MP3.play_song.indexOf(document.getElementById(x).innerText);//najde index vybraneho songu
		if(MP3.current_Songnumber>=0){//pokud se dany song nachazi ve slozce priradi ho do cesty pro play
			audio.src=MP3.path+'/'+MP3.play_song[MP3.current_Songnumber];
			zmena1=0;
		}
	}
	else
	{
		audio.src=MP3.play_song[0];
	}	
	//audio.play();
	Change(1);//zmena cisla stranky
	MP3.task|=t_play;
	loadWholePage('player.html','screen',End_load);
}
//*******************************************************************************
//*****************************************************************************/
function MP3_NextSong(button){
	var rand=NaN;
	if(MP3.indicator & kos){
		fs.unlinkSync(MP3.path+"/"+MP3.play_song[MP3.current_Songnumber]);//Smazani aktualniho songu pokus je kos aktivni
		if(side==1)MP3_Mode_playing("kos");//vypnuti indikace kose na strance player
		else MP3.indicator&=~kos;//vypnuti indikace kose mimo stranku player
		MP3.play_song.splice(MP3.play_song.indexOf(MP3.play_song[MP3.current_Songnumber]),1);//odstraneni songu z bufferu
	}
	/*********************************random a loop****************************/
	//loop=1,random=2,kos=4; Poznamky
	if(MP3.indicator & random){
		if(Songhistory.length<=MP3.play_song.length){
			var i=0;
			Songhistory.push(MP3.play_song[MP3.current_Songnumber]);//Vložení songu do historie
			while(true){
				rand=GetRandom(0,MP3.play_song.length-1);
				if(Songhistory.indexOf(MP3.play_song[rand])<0){//Pokud neni v history
					//Songhistory.push(play_song[rand]);//Vloz vybrany song do history
					MP3.current_Songnumber=rand;
					break;
				}
				if(i>=play_song.length+20){//bylo prehrany cely seznam pisnicek v aktualni slozce
					//if(indicator & loop)
						MP3.path=MP3_subfolder(MP3.path);
					break;
				}
				i++;
			}
		}
		else
		{
			//Songhistory.push(play_song[current_Songnumber]);
			MP3.path=MP3_subfolder(MP3.path);
		}
		if((MP3.indicator & loop) && (MP3.indicator & end)){//Pokud mame mod smyčka shodime vlajku konce prehravani
			MP3.Songhistory=[];
			MP3.indicator&=~end;
		}
	}
	/*********************************loop*************************************/
	//button=0->Previsous
	//button=1->Next
	if(isNaN(rand)){
		do{
			if(button!=2)break;
			if(button==2){//Pro posun na dalsi pisen
				//Songhistory.push(play_song[current_Songnumber]);
				if((MP3.current_Songnumber+1)>=(MP3.play_song.length)){//Osetreni pro posledni song
					MP3.current_Songnumber=0;
					//path=subfolder(path);
				}
				else
				{
				MP3.current_Songnumber++;
				}	
			}
			if(MP3.Songhistory.length >= MP3.play_song.length){
				MP3.Songhistory=[];
				MP3.current_Songnumber=0;
				MP3.path=MP3_subfolder(MP3.path);
				break;
			}
		}
		while(MP3.Songhistory.indexOf(MP3.play_song[MP3.current_Songnumber])>=0);
	//***********************************************************************/
		if(button==1){//Pro posun na dalsi pisen
			if((MP3.current_Songnumber+1)>=(MP3.play_song.length)){//Osetreni pro posledni song
				MP3.current_Songnumber=0;
				//path=subfolder(path);
			}
			else
			{
				MP3.current_Songnumber++;
			}	
		}

		if(button==0  && MP3.current_Songnumber>0)
			MP3.current_Songnumber-=1;//Pro posun zpet
		if(button==0  && MP3.current_Songnumber==0)
			MP3.current_Songnumber=MP3.play_song.length-1;//Pro posun zpet
			
		//************************************************************

	}
	/**********************************************************************/
	MP3.Songhistory.push(MP3.play_song[MP3.current_Songnumber]);
	if(MP3.Songhistory.length >= MP3.play_song.length){
		MP3.Songhistory=[];
		MP3.current_Songnumber=0;
		MP3.path=MP3_subfolder(MP3.path);
				
	}

	if(MP3.current_Songnumber>=0 && MP3.play_song.length>0){
		audio.src=MP3.path+'/'+MP3.play_song[MP3.current_Songnumber];
		MP3.task|=t_play;
		MP3.task=MP3_SongPlay(MP3.task);
	}
}
//*****************************************************************************/	
function MP3_PlaPau_ch_img(x){
	if(x.innerHTML.search("play1.png")>=0){	
		MP3.indicator|=user;
		MP3.task|=t_play;
		MP3.task=MP3_SongPlay(MP3.task);
	}
	else{	
		
		MP3.task|=t_pause;
		MP3.task=MP3_SongPlay(MP3.task);
	}
}
//******************************************************************************
function MP3_Mode_playing(x){
	if(x=='loop'){
			if(document.getElementById("player_loop").src.search("loop2.png")>=0 ){
				document.getElementById("player_loop").src = "Icons/Icons3/loop3.png";
				MP3.indicator|=loop;
			}
			else{
				document.getElementById("player_loop").src = "Icons/Icons3/loop2.png";
				MP3.indicator&=~loop;
			}
	}
	if(x=='random'){
			if(document.getElementById("player_random").src.search("random2.png")>=0){
				document.getElementById("player_random").src = "Icons/Icons3/random3.png";
				MP3.indicator|=random;
			}
			else{
				document.getElementById("player_random").src = "Icons/Icons3/random2.png";
				MP3.indicator&=~random;
			}	
	}
	if(x=='kos'){
			if(document.getElementById("player_kos").src.search("kos2.png")>=0){
				document.getElementById("player_kos").src = "Icons/Icons3/kos3.png";
				MP3.indicator|=kos;
			}
			else{
				document.getElementById("player_kos").src = "Icons/Icons3/kos2.png";
				MP3.indicator&=~kos;
			}
	}
	if(x=='volume'){
			if(document.getElementById("player_volume").src.search("volume_up2.png")>=0){
				document.getElementById("player_volume").src = "Icons/Icons3/mute.png";
				MP3.indicator|=volume;
			}
			else{
				document.getElementById("player_volume").src = "Icons/Icons3/volume_up2.png";
				MP3.indicator&=~volume;
			}
	}
}
//******************************************************************************
function MP3_Play_time(){
	if(side==1){
		setvolume();
		if(MP3.indicator & volume)
			audio.muted = true;
		else 
			audio.muted = false;
		MP3.ST=audio.duration; //celkova doba trvani
		MP3.CT=audio.currentTime;
		//***********************************
		var Dur_min,Dur_sec;
		Dur_min=MP3.ST/60;
		Dur_min=Math.floor(Dur_min);
		Dur_sec=MP3.ST-Dur_min*60;
		Dur_sec=Math.floor(Dur_sec);
		//***********************************
		var Curr_min,Curr_sec;
		Curr_min=MP3.CT/60;
		Curr_min=Math.floor(Curr_min);
		Curr_sec=MP3.CT-Curr_min*60;
		Curr_sec=Math.floor(Curr_sec);
		//***********************************
		MP3.CT=MP3.CT.toFixed(0);
		MP3.ST=MP3.ST.toFixed(0);

		bar((MP3.CT/MP3.ST)*100,(((MP3.CT/MP3.ST)*100))-3);
		if(Dur_sec<10)document.getElementById("player_max").innerHTML ="0"+Dur_min+":0"+Dur_sec;
		else document.getElementById("player_max").innerHTML ="0"+Dur_min+":"+Dur_sec;

		if(MP3.CT>=60 && Curr_sec <10) {document.getElementById("player_min").innerHTML ="0"+ Curr_min+":0"+Curr_sec;}
		else  {document.getElementById("player_min").innerHTML ="0"+ Curr_min+":"+Curr_sec;}
		if(MP3.CT<60) {document.getElementById("player_min").innerHTML ="00:"+ MP3.CT;}
		if(MP3.CT<10){document.getElementById("player_min").innerHTML ="00:0"+MP3.CT;}
	}
	if(audio.currentTime==audio.duration)//Automaticky posun na dalsi song
   	{MP3_NextSong(2);MP3_Backup();}
}	
//*****************************************************************************/
function MP3_subfolder(Gpath){
	if(Gpath.length==0)return -1;//osetreni v pripade ze neni dodana cesta
	var pom=0,pom2=[];
	var pom1=0;
	MP3.Songhistory=[];
	if(MP3.folderAut.length){//Aktualni slozka jiz nema zadne podslozky
		Gpath=Gpath+'/'+MP3.folderAut[0];		
		MP3_Folderlist(Gpath,true);//listenning nadslozky
		return Gpath;
	}
	else{
		while(1){
			if(MP3.Firstpath==Gpath){
				MP3.indicator|=end;
				return Gpath;
			}
			pom=Gpath.lastIndexOf('/');//pozice posledniho lomitka
			pom2=Gpath.substring(pom+1,Gpath.length);//nazev minule vylistovane podslozky
			Gpath=Gpath.substring(0,pom);//sestaveni nove cesty do nadslozky;
			MP3_Folderlist(Gpath,true);//listenning nadslozky
			if(MP3.folderAut.indexOf(pom2)+1<MP3.folderAut.length){//kontrola existence dalsi podslozky
				Gpath=Gpath+'/'+MP3.folderAut[MP3.folderAut.indexOf(pom2)+1]//sestaveni nove cesty do podslozky;
				MP3_Folderlist(Gpath,true);//listenning podslozky
				console.log("Faze1");
				return Gpath;
			}
			if(MP3.Firstpath==Gpath || Gpath==""){
				//console.log("Konec");
				MP3.indicator|=end;
				return Gpath;
			}
		}
	}	
}
//*************************************************************************
function MP3_Rolling_text(event){
 	var pom=document.getElementById("player_container_song_name").innerHTML;
 	var pom2;
 	pom2="<MARQUEE loop='1' behavior='alternate' direction='left' onfinish='NextSong(1)'>";
 	pom2+=pom;
	document.getElementById("player_container_song_name").innerHTML=pom2+"</MARQUEE>";
 }  
//*****************************************************************************/	
