window.addEventListener('DOMContentLoaded', function(){

	var stagingName = $('#staging-name');
	var copyBtn = $('#btn-copy');
	var form = $('#staging-form');
	var message = $('#message');
	var loader = $('#loader');
	var stagingStatusCheckbox = $('#staging-status');
	var guideArrow = $('#guide-arrow');
	loader.hide();

	sendSignal(null, true);

	//all action here
	form.submit(function(){
		if(stagingName.val()){
			message.hide();
			loader.show();
			copyBtn.attr('disabled', true);
			copyToClipboard(stagingName.val());
		}
		return false;
	});

	function copyToClipboard(value){
		sendSignal(value);
	};


	function sendSignal(stagingName, checkStorage) {
		var port = chrome.extension.connect({
			name: "Popup signalling", 
		});
		port.postMessage({ stagingName: stagingName, checkStorage: checkStorage });
	}

	chrome.extension.onConnect.addListener(function(port) {
	  	var chromePort = port;
	  	port.onMessage.addListener(function(data) {
				if(data.response === 'success'){
					success();
				}else if(data.response === 'stagingNotStarted') {
					warning();
				}else if(data.response === 'error') {
					error();
				}else {
					//staging name for the first signal
					stagingName.val(data.storedStagingName);
	    	}
	  	});
	});

	// all good, show off now
	var success = function() {
		loader.hide();
		message
			.show()
			.html('Copied !')
			.addClass('message--success')
			.removeClass('message--error');

		copyBtn.attr('disabled', false);
	};

	// give staging off signal
	var warning = function() {
		loader.hide();
		message
			.show()
			.html('Staging not running !')
			.addClass('message--error')
			.removeClass('message--success');
		copyBtn.attr('disabled', false);
		stagingStatusCheckbox.attr('checked', false);
		guideArrow.show();
	};

	//unexpected error comes up T_T
	var error = function() {
		loader.hide();
		message
			.show()
			.html('Error !')
			.addClass('message--error')
			.removeClass('message--success');

		copyBtn.attr('disabled', false);
	};

	// open staging url in new tab when toggled
	stagingStatusCheckbox.change(function(){
		var url = "https://sfctrl.practodev.com/start_staging?instance_name=" + stagingName.val();
		var checked = $(this).is(':checked');
		guideArrow.hide();
		if(checked && stagingName.val()){
			chrome.tabs.create({url: url});
		}
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

