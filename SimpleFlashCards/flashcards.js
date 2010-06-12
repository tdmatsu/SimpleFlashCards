/*
FlashCards class

** add description here

*/
function FlashCards()
{
	// variables
	var m_entries = null;
	var m_entries_cnt = 0;
	var m_remaining_entries_cnt = 0;
	var m_region;
	var m_intCurrentIndex = -1;
	var m_exitFunction;

	// states
	var STATE_CLOSED = 0;
	var STATE_OPEN = 1;
	var STATE_HIDDEN = 2;
	
	// focus colors
	var COLOR_FOCUSED = "#FF6666";
	var COLOR_UNFOCUSED = "#BBBBBB";

	this.initialize = function(region, exitFunction){
		
		
		m_region = region;
		
		var elmInfo = document.createElement("div");
		elmInfo.id = "section_info";
		elmInfo.align = "right";

		var elmReturn = document.createElement("span");
		elmReturn.id = "section_return";
		elmReturn.align = "right";
		elmReturn.innerHTML = "Back to Start Page";
		elmReturn.onclick = exitFunction;

		var elmMain = document.createElement("div");
		elmMain.id = "section_cards";
		
		m_region.appendChild(elmInfo);
		m_region.appendChild(elmReturn);
		m_region.appendChild(elmMain);
		
		m_exitFunction = exitFunction;
	}
	
	this.setEntries = function(entries){
		m_entries = entries;
		m_entries_cnt = entries.length;
		m_remaining_entries_cnt = entries.length;
	}
	
	var updateCount = function()
	{
		$("section_info").innerHTML = m_remaining_entries_cnt + "/" + m_entries_cnt + " card(s) left<br>";
	}
	
	this.startFlashCard = function(entries)
	{
		_log("startFlashCard()");

		m_entries = entries;
		m_entries_cnt = entries.length;
		m_remaining_entries_cnt = entries.length;
		m_intCurrentIndex = -1;
		
		$("section_cards").innerHTML = "";
		
		for (var i = 0; i < m_entries.length; i++){
			var elm = document.createElement("div");
			elm.id = "entry_" + i;
			elm.className = "class_entry";
			elm.entryIndex = i;
			elm.currentState = STATE_CLOSED;
			elm.toggleOpenClose = function()
			{
				if (this.currentState == STATE_CLOSED){
					$("text2_" + this.entryIndex).style.display = "block";
					this.currentState = STATE_OPEN;
				}else if (this.currentState == STATE_OPEN){
					$("text2_" + this.entryIndex).style.display = "none";
					this.currentState = STATE_CLOSED;
				}
				var diff = this.offsetTop + this.offsetHeight - document.body.scrollTop - window.innerHeight;
				if (diff > 0){
					window.scrollBy(0, diff);
				}
			}

			elm.setHidden = function()
			{
				this.style.display = "none";
				this.currentState = STATE_HIDDEN;
				m_remaining_entries_cnt--;
				updateCount();
			}

			var elmIndex = document.createElement("div");
			elmIndex.id = elm.id + "_index";
			elmIndex.innerHTML = i;
			elmIndex.style.display = "none";

			var elmText1 = document.createElement("div");
			elmText1.className = "entry_text1";
			elmText1.id = "text1_" + i;
			elmText1.innerHTML = m_entries[i].split("\t")[0];
			elmText1.style.display = "block";
			elmText1.entryIndex = i;
			
			elmText1.onclick = function ()
			{
				$("entry_" + this.entryIndex).toggleOpenClose();
			}

			var elmText2 = document.createElement("div");
			elmText2.className = "entry_text2";
			elmText2.id = "text2_" + i;
			elmText2.innerHTML = m_entries[i].split("\t")[1];
			elmText2.style.display = "none";
			elmText2.entryIndex = i;

			elmText2.onclick = function ()
			{
				$("entry_" + this.entryIndex).setHidden();
			}

			elm.appendChild(elmIndex);
			elm.appendChild(elmText1);
			elm.appendChild(elmText2);
			
			$("section_cards").appendChild(elm);
		}
		
		updateCount();
	}
	
	var getPreviousIndex = function()
	{
		var startIndex = m_intCurrentIndex;
		while(1){
			startIndex--;
			if (startIndex < 0){
				startIndex = m_intCurrentIndex;
				break;
			}else if ($("entry_" + startIndex).currentState != STATE_HIDDEN){
				break;
			}
		}
		return startIndex;
	}
	
	var getNextIndex = function()
	{
		var startIndex = m_intCurrentIndex;
		while(1){
			startIndex++;
			if (startIndex >= $("section_cards").childNodes.length){
				startIndex = m_intCurrentIndex;
				break;
			}else if ($("entry_" + startIndex).currentState != STATE_HIDDEN){
				break;
			}
		}
		return startIndex;
	}

	this.handleKeyDown = function(e)
	{
		if (e.keyCode == 8){
			m_exitFunction();
			return;
		}else if (e.keyCode == 38 || e.keyCode ==40){	// up / down
			var updatedIndex;
			if (m_intCurrentIndex == -1){
				m_intCurrentIndex = 0;
				updatedIndex = 0;
			}else{
				if (e.keyCode == 38){	// up
					updatedIndex = getPreviousIndex();
				}else if (e.keyCode == 40){	// down
					updatedIndex = getNextIndex();
				}
			}
			
			// update cursor
			if (m_intCurrentIndex != updatedIndex){
				$("entry_" + m_intCurrentIndex).style.backgroundColor = COLOR_UNFOCUSED;
			}
			$("entry_" + updatedIndex).style.backgroundColor = COLOR_FOCUSED;
			
			// scroll
			var offset = $("entry_" + updatedIndex).offsetTop;
			if (e.keyCode == 38) {
				if (m_intCurrentIndex == 0 && updatedIndex == 0){
					window.scroll(0, 0);
				}else if(offset < (window.pageYOffset +(window.innerHeight * 0.2))){
					window.scroll(0, offset - (window.innerHeight * 0.2));
				}
			}else if (e.keyCode == 40 && offset > (window.pageYOffset + (window.innerHeight * 0.7))){
				window.scroll(0, offset - (window.innerHeight * 0.7));
			}
			
			// update index
			m_intCurrentIndex = updatedIndex;
		}else{
			if(m_intCurrentIndex != -1){
				if(e.keyCode == 39){	// right
					if ($("entry_" + m_intCurrentIndex).currentState == STATE_CLOSED){
						$("entry_" + m_intCurrentIndex).toggleOpenClose();
					}
				}else if(e.keyCode == 37){	// left
					if ($("entry_" + m_intCurrentIndex).currentState == STATE_OPEN){
						$("entry_" + m_intCurrentIndex).toggleOpenClose();
					}
				}else if(e.charCode == 63557 || e.keyCode == 13){		// center/enter key
					if ($("entry_" + m_intCurrentIndex).currentState == STATE_CLOSED){
						$("entry_" + m_intCurrentIndex).toggleOpenClose();
					}else if ($("entry_" + m_intCurrentIndex).currentState == STATE_OPEN){
						// find the next index
						var updatedIndex = m_intCurrentIndex;
						updatedIndex = getNextIndex();
						if (updatedIndex == m_intCurrentIndex){
							updatedIndex = getPreviousIndex();
						}
						$("entry_" + m_intCurrentIndex).setHidden();
						if (updatedIndex == m_intCurrentIndex){
							$("entry_" + m_intCurrentIndex).style.backgroundColor = COLOR_UNFOCUSED;
							m_intCurrentIndex = -1;
						}else{
							$("entry_" + m_intCurrentIndex).style.backgroundColor = COLOR_UNFOCUSED;
							$("entry_" + updatedIndex).style.backgroundColor = COLOR_FOCUSED;
							m_intCurrentIndex = updatedIndex;
						}
					}
				}
			}
		}
	}
}
