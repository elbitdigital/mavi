/*!
 * Elbit Mavi Cosméticos Project v0.0.0 (http://elbit.com.br/)
 * Copyright 2013-2016 Elbit Developers
 * Licensed under MIT (https://github.com/elbitdigital/base/blob/master/LICENSE)
*/

	/* Contact */

	/* Contact email manipulation */

	var formSentCount = 0;
	var formSentCountLimit = 2;

	var requestURL = 'http://service.elbit.com.br/venus/api/';
	var formLocked = false;

	var form = {
		viewport: document.getElementById('cForm')
	};

	form.fields = {};
	form.sendButton = {};

	form.fields.cName = document.getElementById('cName');
	// form.fields.cCity = document.getElementById('cCity');
	form.fields.cPhone = document.getElementById('cPhone');
	form.fields.cEmail = document.getElementById('cEmail');
	form.fields.cMessage = document.getElementById('cMessage');
	form.sendButton.viewport = document.getElementById('cSubmit');
	// form.fields.cAddress = document.getElementById('cAddress');

	form.states = [
		'is-error',
		'is-fail',
		'is-incomplete',
		'is-sending',
		'is-success'
	];

	form.changeState = function (state, message) {

		if (form.viewport) {

			for (var i = form.states.length; i--;)
				form.viewport.classList.remove(form.states[i])

			form.viewport.classList.add(state);

			if (message) {

				document.querySelector("span.ContactFormStatus-text--incomplete").innerText = message;

			}

		}

	};

	// send the ajax request
	form.sendRequest = function(requestData) {

		if (requestData) {

			// vanilla js
			var xhr = new XMLHttpRequest();

			// "beforeSend"
			formLocked = true;
			form.changeState('is-sending', false);

			xhr.ontimeout = function (e) {
				console.log(e);
				form.changeState('is-fail', false);
			};

			xhr.onerror = function() {
				form.changeState('is-error', false);
				//form.send(requestData, 5000);
			};

			xhr.onreadystatechange = function(e) {

				if (xhr.readyState == 4) {

					if (xhr.status == 200) {
						console.log(xhr.responseText);
						form.changeState('is-success', false);
					} else {
						form.changeState('is-error', false);
					}

				}

				formLocked = false;

			};

			xhr.withCredentials = true;
			xhr.open('GET', requestURL + "?" + form.requestParams(requestData), true);
			xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			xhr.timeout = 12000;

			xhr.send(null);

		}

	};

	// transform object into uri string
	form.requestParams = function (requestData) {

		var y = '', e = encodeURIComponent;

		for (var x in requestData) {
			y += '&' + e(x) + '=' + e(requestData[x]);
		}

		//&_t= ==> equals to cache: false;
		return y.slice(1) + '&_t=' + new Date().getTime();

	};

	// control the time delay to init the ajax request
	form.send = function(requestData, delay) {

		if (requestData) {

			if (delay) {
				setTimeout(function() {
					form.sendRequest(requestData);
				}, delay)
			} else {
				form.sendRequest(requestData);
			}

		}

	};

	// form submit button listener
	form.sendButton.viewport.addEventListener('click', function (ev) {

		ev.preventDefault();

		if (!formLocked) {

			if (formSentCount < formSentCountLimit) {

				var allow = !!(form.fields.cName.value && (form.fields.cEmail.value || form.fields.cPhone.value) && form.fields.cMessage.value);

				if (allow) {

					// lock the form
					formLocked = true;

					// count the request
					formSentCount++;

					// get object data
					var requestData = {
						cName: form.fields.cName.value,
						cPhone: form.fields.cPhone.value,
						cEmail: form.fields.cEmail.value,
						cAddress: "",
						cCity: "",
						cMessage: form.fields.cMessage.value
					};

					// send
					form.send(requestData, false);

				} else {

					form.changeState('error', false);

					// console.log(requiredFields[0].requiredField.label.viewport.innerText);

					for (var i = 0; i < requiredFields.length; i++)
						if (requiredFields[i].requiredField.isRequiredOne && requiredFields[i].requiredField.input.viewport.value == "")
							form.changeState('is-incomplete', "Informe pelo menos um email ou um telefone");

				}

			}

		}

	});

/* Required fields */

var RequiredField = (function () {

	/**
	 * Required Field constructor
	 * @constructor
	 */
	function RequiredField(viewport, fieldClass) {

		var self = this;

		this.viewport = viewport;

		this.input = {};
		this.fieldClass = fieldClass;

		this.onClick = function () {

			try {

				self.input.viewport.focus();

			} catch ( e ) { }

		};

		this.onFocus = function () {

			self.viewport.classList.add('has-focus');

			if (self.input.viewport.value)
				self.viewport.classList.remove('is-empty');

		};

		this.onBlur = function () {

			self.viewport.classList.remove('has-focus');

			if (!self.input.viewport.value)
				self.viewport.classList.add('is-empty');
			else
				self.viewport.classList.remove('is-empty');

		};

		this.onInput = function () {

			if (self.input.viewport.value) {
				self.viewport.classList.remove('is-empty');
				self.viewport.classList.add('has-label');
				self.viewport.classList.add('is-valid');
			} else {
				self.viewport.classList.remove('has-label');
				self.viewport.classList.remove('is-valid');
			}

		};

		if (this.viewport)
			this.init();

	}

	/**
	 * Normalize
	 */
	RequiredField.prototype.normalize = function () {

		if (this.input.viewport.value)
			this.viewport.classList.add('has-label');

	};

	/**
	 * Add the listeners
	 * It support IE8
	 */
	RequiredField.prototype.addListeners = function () {

		try {

			this.viewport.addEventListener('click', this.onClick, false);

			this.input.viewport.addEventListener('focus', this.onFocus, false);
			this.input.viewport.addEventListener('blur', this.onBlur, false);
			this.input.viewport.addEventListener('input', this.onInput, false);

		} catch ( e ) {	}

	};

	/**
	 * Get the input element
	 * @return {boolean}
	 */
	RequiredField.prototype.getInputElement = function () {

		this.input.viewport = this.viewport.querySelector(this.fieldClass);

		return !!this.input.viewport;

	};

	/**
	 * Init the instance
	 */
	RequiredField.prototype.init = function () {

		if (this.getInputElement())
			this.addListeners();

		this.normalize();

	};

	return RequiredField;

})();