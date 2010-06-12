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
				if ($("text2_" + this.entryIndex).style.display == "none"){
					$("text2_" + this.entryIndex).style.display = "block";
				}else{
					$("text2_" + this.entryIndex).style.display = "none";
				}
			}

			var elmText2 = document.createElement("div");
			elmText2.className = "entry_text2";
			elmText2.id = "text2_" + i;
			elmText2.innerHTML = m_entries[i].split("\t")[1];
			elmText2.style.display = "none";
			elmText2.entryIndex = i;

			elmText2.onclick = function ()
			{
				$("entry_" + this.entryIndex).style.display = "none";
				m_remaining_entries_cnt--;
				updateCount();
			}

			elm.appendChild(elmIndex);
			elm.appendChild(elmText1);
			elm.appendChild(elmText2);
			
			$("section_cards").appendChild(elm);
		}
		
		updateCount();
	}

	this.handleKeyDown = function(e)
	{
		if (e.keyCode == 8){
			m_exitFunction();
			return;
		}else if (e.keyCode == 38 || e.keyCode ==40){	// up / down
			var updatedIndex = m_intCurrentIndex;
			if (updatedIndex == -1){
				m_intCurrentIndex = 0;
				updatedIndex = 0;
			}else{
				if (e.keyCode == 38){	// up
					updatedIndex--;
					if (updatedIndex < 0){
						updatedIndex = 0;
					}
				}else if (e.keyCode == 40){	// down
					updatedIndex++;
					if (updatedIndex >= $("section_cards").childNodes.length){
						updatedIndex = $("section_cards").childNodes.length - 1;
					}
				}
			}
			
			// update cursor
			if (m_intCurrentIndex != updatedIndex){
				$("section_cards").childNodes.item(m_intCurrentIndex).style.backgroundColor = "#BBBBBB";
			}
			$("section_cards").childNodes.item(updatedIndex).style.backgroundColor = "#FF6666";
			
			// scroll
			var offset = $("section_cards").childNodes.item(updatedIndex).offsetTop;
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
		}else if(e.charCode == 63557 || e.keyCode == 13){		// center/enter key
		
		}
	}
}
