window.addEventListener('DOMContentLoaded', function(){

	var stagingName = document.getElementById('staging-name');
	var copyBtn = document.getElementById('btn-copy');
	var form = document.getElementById('staging-form');
	var message = document.getElementById('message');
	
	var success = function() {
		message.innerHTML = 'Copied !';
		message.classList.add('message--success');
		message.classList.remove('message--error');
		copyBtn.disabled = false;
	};
	var error = function() {
		message.innerHTML = 'Error !';
		message.classList.add('message--error');
		message.classList.remove('message--success');
		copyBtn.disabled = false;
	};

	form.onsubmit = function(){
		copyBtn.disabled = true;
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



	/* Input effects */
	(function() {
		// trim polyfill : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim
		if (!String.prototype.trim) {
			(function() {
				// Make sure we trim BOM and NBSP
				var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
				String.prototype.trim = function() {
					return this.replace(rtrim, '');
				};
			})();
		}
		[].slice.call( document.querySelectorAll( 'input.input__field' ) ).forEach( function( inputEl ) {
			// in case the input is already filled..
			if( inputEl.value.trim() !== '' ) {
				classie.add( inputEl.parentNode, 'input--filled' );
			}
			// events:
			inputEl.addEventListener( 'focus', onInputFocus );
			inputEl.addEventListener( 'blur', onInputBlur );
		} );
		function onInputFocus( ev ) {
			classie.add( ev.target.parentNode, 'input--filled' );
		}
		function onInputBlur( ev ) {
			if( ev.target.value.trim() === '' ) {
				classie.remove( ev.target.parentNode, 'input--filled' );
			}
		}
	})();
});