// background.js
var chromePort;
function getStagingSshUrl(stagingName) {
	var stagingUrl = 'https://sfctrl.practodev.com/instance/staging-' + stagingName;
	var request = new XMLHttpRequest();
	request.open('GET', stagingUrl, true);
	request.timeout = 10000;
	request.send(null);

	request.onreadystatechange = function() {
		if (request.readyState === 4) {
			if (request.status === 200) {
				// console.log(request.responseText);
				var arr = request.responseText.match(/ssh(.*)com/);
				if(arr) {
					console.log(arr[0]);
					copyToClipboard(arr[0]);
					storeStagingName(stagingName);
					sendSignal('success');
				}else{
					// chromePort.postMessage(msg);
					sendSignal('stagingNotStarted');
				}
			} else {
				// chromePort.postMessage(msg);
				sendSignal('error');
				console.error(request.statusText);
			}
		}
	};

}

function copyToClipboard(value) {

  // Create a "hidden" input
  var aux = document.createElement("input");

  // Assign it the value of the specified element
  aux.setAttribute("value", value);

  // Append it to the body
  document.body.appendChild(aux);

  // Highlight its content
  aux.select();

  // Copy the highlighted text
  document.execCommand("copy");

  // Remove it from the body
  document.body.removeChild(aux);

}

chrome.extension.onConnect.addListener(function(port) {
  var chromePort = port;
  port.onMessage.addListener(function(data) {
		if(data.checkStorage){
			//storage check call for initial popup load
			getStagingNameFromStorage();
		}else{
		  getStagingSshUrl(data.stagingName);
		}
  });
});

function sendSignal(response, storedStagingName) {
	var port = chrome.extension.connect({
		name: "Background signalling", 
	});
	port.postMessage({ response: response, storedStagingName: storedStagingName });
}

function storeStagingName(name){
	console.log('going to save the staging name -> ' + name);
	chrome.storage.sync.set({ "staging_name_clipboard": name }, function(){
		//callback.. 
	});
}

function getStagingNameFromStorage(){
	chrome.storage.sync.get(["staging_name_clipboard"], function(item){
	    //  items = [ { "yourBody": "myBody" } ]
	    // send staging_name signal to popup.js
	    console.log('signalling the staging name from background.js');
	    sendSignal(null, item.staging_name_clipboard);
	});
}

