function $(e){return document.getElementById(e);}

var flashCards = new FlashCards();     // the flash card data
var intCurrentMenuIndex = -1;
var DEBUG = false;  // Debug flag

//----------------------------------------------------------------------------------------------------------------------
// printLog
//----------------------------------------------------------------------------------------------------------------------
function _log(str_log)
{
	if (DEBUG == false)
		return;
	
	var strwrk = $('debugOutputArea').innerHTML + str_log + "<br/>";
	$('debugOutputArea').innerHTML = strwrk;
}

//----------------------------------------------------------------------------------------------------------------------
// init
//----------------------------------------------------------------------------------------------------------------------
function init()
{
	// WRT specific settings
	if (navigator.userAgent.indexOf("Series60/5.0") != -1 || navigator.userAgent.indexOf("Series60/3") != -1){
		widget.setNavigationEnabled(false);
		if (navigator.userAgent.indexOf("Series60/5.0") != -1){
			window.menu.hideSoftkeys();
		}
	}
	
	// apply stylesheets
	if (navigator.userAgent.indexOf("Series60/3") != -1){
		document.styleSheets[0].disabled=true;
		document.styleSheets[1].disabled=false;
	}else{
		document.styleSheets[0].disabled=false;
		document.styleSheets[1].disabled=true;
	}

	// initialize the start page
	var elmEntries = document.createElement("div");
	elmEntries.id="collection_entries";

	for (var i = 0; i < FlashCardCollectionNames.length; i++){
		var elm = document.createElement("div");
		elm.className = "collection_entry";
		elm.entryIndex = i;
		elm.onclick = function(){
			startFlashCards(this.entryIndex);
		}
	
		var elmCollectionName = document.createElement("div");
		elmCollectionName.className = "collection_name";
		elmCollectionName.innerHTML = FlashCardCollectionNames[i];

		var elmCollectionItemCount = document.createElement("div");
		elmCollectionItemCount.className = "collection_itemcount";
		elmCollectionItemCount.innerHTML = FlashCardCollection[i].length + " cards";

		elm.appendChild(elmCollectionName);
		elm.appendChild(elmCollectionItemCount);
		
		elmEntries.appendChild(elm);
	}
	
	var elmShuffle = document.createElement("span");
	elmShuffle.id = "shuffle_button";
	elmShuffle.setShuffle = function(flag){
		if (flag){
			this.innerHTML = "Shuffle ON";
			this.style.backgroundColor="#66FF66";
		}else{
			this.innerHTML = "Shuffle OFF";
			this.style.backgroundColor="#CCCCCC";
		}
		this.shuffleOn = flag;
	}
	elmShuffle.onclick = function(){
		this.setShuffle(!this.shuffleOn);
	}
	elmShuffle.setShuffle(true);
	
	$("section_startpage").appendChild(elmShuffle);
	$("section_startpage").appendChild(elmEntries);
	
	if (FlashCardCollectionNames.length > 0){
		intCurrentMenuIndex = 0;
		moveFocus(intCurrentMenuIndex, intCurrentMenuIndex);
	}

	flashCards.initialize($("section_flashcards"), gotoStartPage);
	
	gotoStartPage();
}


//----------------------------------------------------------------------------------------------------------------------
// Start the flashcards
//----------------------------------------------------------------------------------------------------------------------
function startFlashCards(index)
{
	flashCards.startFlashCard(FlashCardCollection[index], $("shuffle_button").shuffleOn);
	
	$("section_startpage").style.display = "none";
	$("section_flashcards").style.display = "block";
}

//----------------------------------------------------------------------------------------------------------------------
// gotoStartPage
//----------------------------------------------------------------------------------------------------------------------
function gotoStartPage()
{
	$("section_startpage").style.display = "block";
	$("section_flashcards").style.display = "none";
}

function moveFocus(oldIndex, newIndex)
{
	if (oldIndex != newIndex && oldIndex != -1){
		$("collection_entries").childNodes.item(oldIndex).style.borderColor = "#BBBBBB";
	}
	$("collection_entries").childNodes.item(newIndex).style.borderColor = "#FF6666";
}

document.onkeydown = function(e)
{
	// TODO: enable only for S60 env
	if ($("section_startpage").style.display == "block"){
		keyDown_startPage(e);
	}else if ($("section_flashcards").style.display == "block"){
		flashCards.handleKeyDown(e);
	}
	e.returnValue = false;
}

document.onkeypress = function(e)
{
	e.returnValue = false;
}

function keyDown_startPage(e)
{
	var updatedIndex = intCurrentMenuIndex;
	if (e.keyCode == 38 || e.keyCode == 40){
		if (updatedIndex == -1){
			intCurrentMenuIndex = 0;
			updatedIndex = 0;
		}else{
			if (e.keyCode == 38){	// up
				updatedIndex--;
				if (updatedIndex < 0){
					updatedIndex = 0;
				}
			}else if (e.keyCode == 40){	// down
				updatedIndex++;
				if (updatedIndex >= $("collection_entries").childNodes.length){
					updatedIndex = $("collection_entries").childNodes.length - 1;
				}
			}
		}
		
		moveFocus(intCurrentMenuIndex, updatedIndex);

		intCurrentMenuIndex = updatedIndex;
	}else if(e.charCode == 63557 || e.keyCode == 13){
		if (intCurrentMenuIndex != -1){
			startFlashCards(intCurrentMenuIndex);
		}
	}
}
