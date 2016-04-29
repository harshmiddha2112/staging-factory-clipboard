window.addEventListener('DOMContentLoaded', function(){

	var stagingName = document.getElementById('staging-name');
	var copyBtn = document.getElementById('btn-copy');
	var form = document.getElementById('staging-form');
	
	var success = function() {
			copyBtn.innerHTML = 'Copied !';
			copyBtn.disabled = true;
	};
	var error = function() {
			copyBtn.innerHTML = 'Error';
	};

	form.onsubmit = function(){
		copyToClipboard();
		return false;
	};

	function copyToClipboard(){
		if(stagingName.value){
			sendSignal(stagingName.value);
		}
	};


	function sendSignal(stagingName) {
		var port = chrome.extension.connect({
			name: "Popup signalling", 
		});
		port.postMessage({ stagingName: stagingName });
	}

	chrome.extension.onConnect.addListener(function(port) {
	  	var chromePort = port;
	  	port.onMessage.addListener(function(data) {
	    	if(data.response === 'success'){
	    		success();
	    	}else {
	    		error();
	    	}
	  	});
	});
});