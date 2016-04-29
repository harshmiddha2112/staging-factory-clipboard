// background.js
var chromePort;
function getStaingSshUrl(stagingName) {
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
					sendSignal('success');
				}else{
					// chromePort.postMessage(msg);
					sendSignal('error');	
				}
			} else {
				console.error(request.statusText);
				// chromePort.postMessage(msg);
				sendSignal('error');
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
        getStaingSshUrl(data.stagingName);
  });
});

function sendSignal(response) {
	var port = chrome.extension.connect({
		name: "Background signalling", 
	});
	port.postMessage({ response: response });
}



