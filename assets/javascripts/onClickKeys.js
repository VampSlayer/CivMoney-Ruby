
function EnterClickTextBox(tagTextBox, tagButton){
	$(tagTextBox).keyup(function(event){
	    if(event.keyCode == 13){
		$(tagButton).click();
	    }
	});
}

function EnterClickDocument(tagButton){
	$(document).keypress(function (e) {
	    if (e.which == 13) {
		$(tagButton).click();
	    }
	});
}

