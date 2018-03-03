'use strict';

// Snipcart.subscribe('cart.ready', function() {
//         $('#currency').val(Snipcart.api.getCurrentCurrency());
//       });
//
//       Snipcart.subscribe('currency.changed', function (currency) {
//         $('#currency').val(currency);
//       });
//
//       $(function() {
//         $('#currency').change(function () {
//           Snipcart.api.setCurrency($(this).val());
//         });
//       });

function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function eraseCookie(name) {
    document.cookie = name+'=; Max-Age=-99999999;';
}

var visited = getCookie('visited');
if (!visited) {
    setCookie('visited','true',30);
    UIkit.notification({
        message: 'This website uses cookies to ensure you get the best experience on our website. <br> <a class="uk-button uk-button-small uk-button-default uk-margin-top" href="/imprint">Read more</a>',
        status: 'primary',
        pos: 'bottom-left'
    });
}



$(function() {
  if (location.pathname !== '/') {
    $('.uk-navbar-item > a[href^="/' + location.pathname.split("/")[1] + '"]').addClass('underline');
  }
});

// Static comments
(function ($) {
  var $comments = $('.js-comments');

  $('#comment-form').submit(function () {
    var form = this;

    $(form).addClass('disabled');
    $('#comment-form-submit').html('<div uk-spinner></div> Submitting...');

    $.ajax({
      type: $(this).attr('method'),
      url: $(this).attr('action'),
      data: $(this).serialize(),
      contentType: 'application/x-www-form-urlencoded',
      success: function (data) {
        $('#comment-form-submit').html('Submitted');
        $('.js-notice').removeClass('uk-alert-danger').addClass('uk-alert-success');
      showAlert('<strong>Thanks for your comment!</strong> It will show on the site once it has been approved.');
        $('#comment-form').addClass('hidden');
      },
      error: function (err) {
        console.log(err);
        $('#comment-form-submit').html('Submit Comment');
        $('.js-notice').removeClass('uk-alert-success').addClass('uk-alert-danger');
        showAlert('<strong>Sorry, there was an error with your submission.</strong> Please make sure all required fields have been completed and try again.');
        $(form).removeClass('disabled');
      }
    });

    return false;
  });

  function showAlert(alert) {
    $('.js-notice').removeClass('hidden');
    $('.js-notice p').html(alert);
  }
})(jQuery);

// Staticman comment replies
// modified from Wordpress https://core.svn.wordpress.org/trunk/wp-includes/js/comment-reply.js
var addComment = {
  moveForm: function( commId, parentId, respondId, postId ) {
    var div, element, style, cssHidden,
      t           = this,
      comm        = t.I( commId ),
      respond     = t.I( respondId ),
      cancel      = t.I( 'cancel-comment-reply-link' ),
      parent      = t.I( 'comment-parent' ),
      post        = t.I( 'comment-post-id' ),
      commentForm = respond.getElementsByTagName( 'form' )[0];

    if ( ! comm || ! respond || ! cancel || ! parent || ! commentForm ) {
      return;
    }

    t.respondId = respondId;
    postId = postId || false;

    if ( ! t.I( 'sm-temp-form-div' ) ) {
      div = document.createElement( 'div' );
      div.id = 'sm-temp-form-div';
      div.style.display = 'none';
      respond.parentNode.insertBefore( div, respond );
    }

    comm.parentNode.insertBefore( respond, comm.nextSibling );
    if ( post && postId ) {
      post.value = postId;
    }
    parent.value = parentId;
    cancel.style.display = '';

    cancel.onclick = function() {
      var t       = addComment,
        temp    = t.I( 'sm-temp-form-div' ),
        respond = t.I( t.respondId );

      if ( ! temp || ! respond ) {
        return;
      }

      t.I( 'comment-parent' ).value = '0';
      temp.parentNode.insertBefore( respond, temp );
      temp.parentNode.removeChild( temp );
      this.style.display = 'none';
      this.onclick = null;
      return false;
    };

    /*
     * Set initial focus to the first form focusable element.
     * Try/catch used just to avoid errors in IE 7- which return visibility
     * 'inherit' when the visibility value is inherited from an ancestor.
     */
    try {
      for ( var i = 0; i < commentForm.elements.length; i++ ) {
        element = commentForm.elements[i];
        cssHidden = false;

        // Modern browsers.
        if ( 'getComputedStyle' in window ) {
          style = window.getComputedStyle( element );
        // IE 8.
        } else if ( document.documentElement.currentStyle ) {
          style = element.currentStyle;
        }

        /*
         * For display none, do the same thing jQuery does. For visibility,
         * check the element computed style since browsers are already doing
         * the job for us. In fact, the visibility computed style is the actual
         * computed value and already takes into account the element ancestors.
         */
        if ( ( element.offsetWidth <= 0 && element.offsetHeight <= 0 ) || style.visibility === 'hidden' ) {
          cssHidden = true;
        }

        // Skip form elements that are hidden or disabled.
        if ( 'hidden' === element.type || element.disabled || cssHidden ) {
          continue;
        }

        element.focus();
        // Stop after the first focusable element.
        break;
      }

    } catch( er ) {}

    return false;
  },

  I: function( id ) {
    return document.getElementById( id );
  }
};



var input = document.createElement('input');

// A Validity State Polyfill
;(function (window, document, undefined) {

	'use strict';

	// Make sure that ValidityState is supported in full (all features)
	var supported = function () {
		return ('validity' in input && 'badInput' in input.validity && 'patternMismatch' in input.validity && 'rangeOverflow' in input.validity && 'rangeUnderflow' in input.validity && 'stepMismatch' in input.validity && 'tooLong' in input.validity && 'tooShort' in input.validity && 'typeMismatch' in input.validity && 'valid' in input.validity && 'valueMissing' in input.validity);
	};

	/**
	 * Generate the field validity object
	 * @param  {Node]} field The field to validate
	 * @return {Object}      The validity object
	 */
	var getValidityState = function (field) {

		// Variables
		var type = field.getAttribute('type') || input.nodeName.toLowerCase();
		var isNum = type === 'number' || type === 'range';
		var length = field.value.length;
		var valid = true;

		// If radio group, get selected field
		if (field.type === 'radio' && field.name) {
			var group = document.getElementsByName(field.name);
			if (group.length > 0) {
				for (var i = 0; i < group.length; i++) {
					if (group[i].form === field.form && field.checked) {
						field = group[i];
						break;
					}
				}
			}
		}

		// Run validity checks
		var checkValidity = {
			badInput: (isNum && length > 0 && !/[-+]?[0-9]/.test(field.value)), // value of a number field is not a number
			patternMismatch: (field.hasAttribute('pattern') && length > 0 && new RegExp(field.getAttribute('pattern')).test(field.value) === false), // value does not conform to the pattern
			rangeOverflow: (field.hasAttribute('max') && isNum && field.value > 0 && Number(field.value) > Number(field.getAttribute('max'))), // value of a number field is higher than the max attribute
			rangeUnderflow: (field.hasAttribute('min') && isNum && field.value > 0 && Number(field.value) < Number(field.getAttribute('min'))), // value of a number field is lower than the min attribute
			stepMismatch: (isNum && ((field.hasAttribute('step') && field.getAttribute('step') !== 'any' && Number(field.value) % Number(field.getAttribute('step')) !== 0) || (!field.hasAttribute('step') && Number(field.value) % 1 !== 0))), // value of a number field does not conform to the stepattribute
			tooLong: (field.hasAttribute('maxLength') && field.getAttribute('maxLength') > 0 && length > parseInt(field.getAttribute('maxLength'), 10)), // the user has edited a too-long value in a field with maxlength
			tooShort: (field.hasAttribute('minLength') && field.getAttribute('minLength') > 0 && length > 0 && length < parseInt(field.getAttribute('minLength'), 10)), // the user has edited a too-short value in a field with minlength
			typeMismatch: (length > 0 && ((type === 'email' && !/^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/.test(field.value)) || (type === 'url' && !/^(?:(?:https?|HTTPS?|ftp|FTP):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-zA-Z\u00a1-\uffff0-9]-*)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]-*)*[a-zA-Z\u00a1-\uffff0-9]+)*)(?::\d{2,5})?(?:[\/?#]\S*)?$/.test(field.value)))), // value of a email or URL field is not an email address or URL
			valueMissing: (field.hasAttribute('required') && (((type === 'checkbox' || type === 'radio') && !field.checked) || (type === 'select' && field.options[field.selectedIndex].value < 1) || (type !=='checkbox' && type !== 'radio' && type !=='select' && length < 1))) // required field without a value
		};

		// Check if any errors
		for (var key in checkValidity) {
			if (checkValidity.hasOwnProperty(key)) {
				// If there's an error, change valid value
				if (checkValidity[key]) {
					valid = false;
					break;
				}
			}
		}

		// Add valid property to validity object
		checkValidity.valid = valid;

		// Return object
		return checkValidity;

	};

	// If the full set of ValidityState features aren't supported, polyfill
	// if (!supported()) {
		Object.defineProperty(HTMLInputElement.prototype, 'validity', {
			get: function ValidityState() {
				return getValidityState(this);
			},
			configurable: true,
		});
	// }

})(window, document);


/*
 * classList.js: Cross-browser full element.classList implementation.
 * 1.1.20170427
 *
 * By Eli Grey, http://eligrey.com
 * License: Dedicated to the public domain.
 *   See https://github.com/eligrey/classList.js/blob/master/LICENSE.md
 */

/*global self, document, DOMException */

/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js */

if ("document" in self) {

// Full polyfill for browsers with no classList support
// Including IE < Edge missing SVGElement.classList
if (!("classList" in document.createElement("_"))
	|| document.createElementNS && !("classList" in document.createElementNS("http://www.w3.org/2000/svg","g"))) {

(function (view) {

"use strict";

if (!('Element' in view)) return;

var
	  classListProp = "classList"
	, protoProp = "prototype"
	, elemCtrProto = view.Element[protoProp]
	, objCtr = Object
	, strTrim = String[protoProp].trim || function () {
		return this.replace(/^\s+|\s+$/g, "");
	}
	, arrIndexOf = Array[protoProp].indexOf || function (item) {
		var
			  i = 0
			, len = this.length
		;
		for (; i < len; i++) {
			if (i in this && this[i] === item) {
				return i;
			}
		}
		return -1;
	}
	// Vendors: please allow content code to instantiate DOMExceptions
	, DOMEx = function (type, message) {
		this.name = type;
		this.code = DOMException[type];
		this.message = message;
	}
	, checkTokenAndGetIndex = function (classList, token) {
		if (token === "") {
			throw new DOMEx(
				  "SYNTAX_ERR"
				, "An invalid or illegal string was specified"
			);
		}
		if (/\s/.test(token)) {
			throw new DOMEx(
				  "INVALID_CHARACTER_ERR"
				, "String contains an invalid character"
			);
		}
		return arrIndexOf.call(classList, token);
	}
	, ClassList = function (elem) {
		var
			  trimmedClasses = strTrim.call(elem.getAttribute("class") || "")
			, classes = trimmedClasses ? trimmedClasses.split(/\s+/) : []
			, i = 0
			, len = classes.length
		;
		for (; i < len; i++) {
			this.push(classes[i]);
		}
		this._updateClassName = function () {
			elem.setAttribute("class", this.toString());
		};
	}
	, classListProto = ClassList[protoProp] = []
	, classListGetter = function () {
		return new ClassList(this);
	}
;
// Most DOMException implementations don't allow calling DOMException's toString()
// on non-DOMExceptions. Error's toString() is sufficient here.
DOMEx[protoProp] = Error[protoProp];
classListProto.item = function (i) {
	return this[i] || null;
};
classListProto.contains = function (token) {
	token += "";
	return checkTokenAndGetIndex(this, token) !== -1;
};
classListProto.add = function () {
	var
		  tokens = arguments
		, i = 0
		, l = tokens.length
		, token
		, updated = false
	;
	do {
		token = tokens[i] + "";
		if (checkTokenAndGetIndex(this, token) === -1) {
			this.push(token);
			updated = true;
		}
	}
	while (++i < l);

	if (updated) {
		this._updateClassName();
	}
};
classListProto.remove = function () {
	var
		  tokens = arguments
		, i = 0
		, l = tokens.length
		, token
		, updated = false
		, index
	;
	do {
		token = tokens[i] + "";
		index = checkTokenAndGetIndex(this, token);
		while (index !== -1) {
			this.splice(index, 1);
			updated = true;
			index = checkTokenAndGetIndex(this, token);
		}
	}
	while (++i < l);

	if (updated) {
		this._updateClassName();
	}
};
classListProto.toggle = function (token, force) {
	token += "";

	var
		  result = this.contains(token)
		, method = result ?
			force !== true && "remove"
		:
			force !== false && "add"
	;

	if (method) {
		this[method](token);
	}

	if (force === true || force === false) {
		return force;
	} else {
		return !result;
	}
};
classListProto.toString = function () {
	return this.join(" ");
};

if (objCtr.defineProperty) {
	var classListPropDesc = {
		  get: classListGetter
		, enumerable: true
		, configurable: true
	};
	try {
		objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
	} catch (ex) { // IE 8 doesn't support enumerable:true
		// adding undefined to fight this issue https://github.com/eligrey/classList.js/issues/36
		// modernie IE8-MSW7 machine has IE8 8.0.6001.18702 and is affected
		if (ex.number === undefined || ex.number === -0x7FF5EC54) {
			classListPropDesc.enumerable = false;
			objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
		}
	}
} else if (objCtr[protoProp].__defineGetter__) {
	elemCtrProto.__defineGetter__(classListProp, classListGetter);
}

}(self));

}

// There is full or partial native classList support, so just check if we need
// to normalize the add/remove and toggle APIs.

(function () {
	"use strict";

	var testElement = document.createElement("_");

	testElement.classList.add("c1", "c2");

	// Polyfill for IE 10/11 and Firefox <26, where classList.add and
	// classList.remove exist but support only one argument at a time.
	if (!testElement.classList.contains("c2")) {
		var createMethod = function(method) {
			var original = DOMTokenList.prototype[method];

			DOMTokenList.prototype[method] = function(token) {
				var i, len = arguments.length;

				for (i = 0; i < len; i++) {
					token = arguments[i];
					original.call(this, token);
				}
			};
		};
		createMethod('add');
		createMethod('remove');
	}

	testElement.classList.toggle("c3", false);

	// Polyfill for IE 10 and Firefox <24, where classList.toggle does not
	// support the second argument.
	if (testElement.classList.contains("c3")) {
		var _toggle = DOMTokenList.prototype.toggle;

		DOMTokenList.prototype.toggle = function(token, force) {
			if (1 in arguments && !this.contains(token) === !force) {
				return force;
			} else {
				return _toggle.call(this, token);
			}
		};

	}

	testElement = null;
}());

}


// Add the novalidate attribute when the JS loads
var forms = document.querySelectorAll('.validate');
for (var i = 0; i < forms.length; i++) {
	forms[i].setAttribute('novalidate', true);
}


// Validate the field
var hasError = function (field) {

	// Don't validate submits, buttons, file and reset inputs, and disabled fields
	if (field.disabled || field.type === 'file' || field.type === 'reset' || field.type === 'submit' || field.type === 'button') return;

	// Get validity
	var validity = field.validity;

	// If valid, return null
	if (validity.valid) return;

	// If field is required and empty
	if (validity.valueMissing) return 'Please fill out this field.';

	// If not the right type
	if (validity.typeMismatch) {

		// Email
		if (field.type === 'email') return 'Please enter an email address.';

		// URL
		if (field.type === 'url') return 'Please enter a URL.';

	}

	// If too short
	if (validity.tooShort) return 'Please lengthen this text to ' + field.getAttribute('minLength') + ' characters or more. You are currently using ' + field.value.length + ' characters.';

	// If too long
	if (validity.tooLong) return 'Please shorten this text to no more than ' + field.getAttribute('maxLength') + ' characters. You are currently using ' + field.value.length + ' characters.';

	// If pattern doesn't match
	if (validity.patternMismatch) {

		// If pattern info is included, return custom error
		if (field.hasAttribute('title')) return field.getAttribute('title');

		// Otherwise, generic error
		return 'Please match the requested format.';

	}

	// If number input isn't a number
	if (validity.badInput) return 'Please enter a number.';

	// If a number value doesn't match the step interval
	if (validity.stepMismatch) return 'Please select a valid value.';

	// If a number field is over the max
	if (validity.rangeOverflow) return 'Please select a value that is no more than ' + field.getAttribute('max') + '.';

	// If a number field is below the min
	if (validity.rangeUnderflow) return 'Please select a value that is no less than ' + field.getAttribute('min') + '.';

	// If all else fails, return a generic catchall error
	return 'The value you entered for this field is invalid.';

};


// Show an error message
var showError = function (field, error) {

	// Add error class to field
	field.classList.add('uk-form-danger');;

	// If the field is a radio button and part of a group, error all and get the last item in the group
	if (field.type === 'radio' && field.name) {
		var group = field.form.querySelectorAll('[name="' + field.name + '"]');
		if (group.length > 0) {
			for (var i = 0; i < group.length; i++) {
				group[i].classList.add('uk-form-danger');;
			}
			field = group[group.length - 1];
		}
	}

	// Get field id or name
	var id = field.id || field.name;
	if (!id) return;

	// Check if error message field already exists
	// If not, create one
	var message = field.form.querySelector('.error-message#error-for-' + id );
	if (!message) {
		message = document.createElement('div');
		message.className = 'error-message';
		message.id = 'error-for-' + id;

		// If the field is a radio button or checkbox, insert error after the label
		var label;
		if (field.type === 'radio' || field.type ==='checkbox') {
			label = field.form.querySelector('label[for="' + id + '"]') || field.parentNode;
			if (label) {
				label.parentNode.insertBefore( message, label.nextSibling );
			}
		}

		// Otherwise, insert it after the field
		if (!label) {
			field.parentNode.insertBefore( message, field.nextSibling );
		}

	}

	// Add ARIA role to the field
	field.setAttribute('aria-describedby', 'error-for-' + id);

	// Update error message
	message.innerHTML = error;

	// Show error message
	message.style.display = 'block';
	message.style.visibility = 'visible';

};


// Remove the error message
var removeError = function (field) {

	// Remove error class to field
	field.classList.remove('error');

	// Remove ARIA role from the field
	field.removeAttribute('aria-describedby');

	// If the field is a radio button and part of a group, remove error from all and get the last item in the group
	if (field.type === 'radio' && field.name) {
		var group = field.form.querySelectorAll('[name="' + field.name + '"]');
		if (group.length > 0) {
			for (var i = 0; i < group.length; i++) {
				group[i].classList.remove('error');
			}
			field = group[group.length - 1];
		}
	}

	// Get field id or name
	var id = field.id || field.name;
	if (!id) return;


	// Check if an error message is in the DOM
	var message = field.form.querySelector('.error-message#error-for-' + id + '');
	if (!message) return;

	// If so, hide it
	message.innerHTML = '';
	message.style.display = 'none';
	message.style.visibility = 'hidden';

};

// Serialize the form data into a query string
// Forked and modified from https://stackoverflow.com/a/30153391/1293256
var serialize = function (form) {

	// Setup our serialized data
	var serialized = '';

	// Loop through each field in the form
	for (i = 0; i < form.elements.length; i++) {

		var field = form.elements[i];

		// Don't serialize fields without a name, submits, buttons, file and reset inputs, and disabled fields
		if (!field.name || field.disabled || field.type === 'file' || field.type === 'reset' || field.type === 'submit' || field.type === 'button') continue;

		// Convert field data to a query string
		if ((field.type !== 'checkbox' && field.type !== 'radio') || field.checked) {
			serialized += '&' + encodeURIComponent(field.name) + "=" + encodeURIComponent(field.value);
		}
	}

	return serialized;

};

// Display the form status
window.displayMailChimpStatus = function (data) {

	// Make sure the data is in the right format and that there's a status container
	if (!data.result || !data.msg || !mcStatus ) return;

	// Update our status message
	mcStatus.innerHTML = data.msg;

	// If error, add error class
	if (data.result === 'error') {
		mcStatus.classList.remove('success-message');
		mcStatus.classList.add('error-message');
		return;
	}

	// Otherwise, add success class
	mcStatus.classList.remove('error-message');
	mcStatus.classList.add('success-message');

  subsribeButton.classList.add('visuallyhidden');
  nameContainer.classList.add('visuallyhidden');
  emailContainer.classList.add('visuallyhidden');
  emailPitch.classList.add('visuallyhidden');
  firstProgress.classList.add('visuallyhidden');
  privacy.classList.add('visuallyhidden');
  complete.classList.remove('visuallyhidden');
  document.getElementById("progress-text").innerHTML = '100% Complete';
};

// Submit the form
var submitMailChimpForm = function (form) {

	// Get the Submit URL
	var url = form.getAttribute('action');
	url = url.replace('/post?u=', '/post-json?u=');
	url += serialize(form) + '&c=displayMailChimpStatus';

	// Create script with url and callback (if specified)
	var ref = window.document.getElementsByTagName( 'script' )[ 0 ];
	var script = window.document.createElement( 'script' );
	script.src = url;

	// Create a global variable for the status container
	window.mcStatus = form.querySelector('.mc-status');

  //Add form elemtents to hide
  window.subsribeButton = form.querySelector('#mc-embedded-subscribe');
  window.nameContainer = form.querySelector('.name-wrap');
  window.emailContainer = form.querySelector('.email-wrap');
  window.emailPitch = form.querySelector('.email-pitch');
  window.firstProgress = form.querySelector('.first-progress');
  window.complete = form.querySelector('.complete');
  window.privacy = form.querySelector('.privacy-policy');
  window.privacy = form.querySelector('.privacy-policy');

  $('#mc-embedded-subscribe').html('<div uk-spinner></div> Submitting...');

	// Insert script tag into the DOM (append to <head>)
	ref.parentNode.insertBefore( script, ref );

	// After the script is loaded (and executed), remove it
	script.onload = function () {
		this.remove();
	};

};

// Listen to all blur events
document.addEventListener('blur', function (event) {

	// Only run if the field is in a form to be validated
	if (!event.target.form.classList.contains('validate')) return;

	// Validate the field
	var error = hasError(event.target);

	// If there's an error, show it
	if (error) {
		showError(event.target, error);
		return;
	}

	// Otherwise, remove any existing error message
	removeError(event.target);

}, true);


// Check all fields on submit
document.addEventListener('submit', function (event) {

	// Only run on forms flagged for validation
	if (!event.target.classList.contains('validate')) return;

	// Prevent form from submitting
	event.preventDefault();

	// Get all of the form elements
	var fields = event.target.elements;

	// Validate each field
	// Store the first field with an error to a variable so we can bring it into focus later
	var error, hasErrors;
	for (var i = 0; i < fields.length; i++) {
		error = hasError(fields[i]);
		if (error) {
			showError(fields[i], error);
			if (!hasErrors) {
				hasErrors = fields[i];
			}
		}
	}

	// If there are errrors, don't submit form and focus on first element with error
	if (hasErrors) {
		hasErrors.focus();
	}

	// Otherwise, let the form submit normally
	// You could also bolt in an Ajax form submit process here
	submitMailChimpForm(event.target);

}, false);




function validEmail(email) { // see:
  var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
  return re.test(email);
}

function validateHuman(honeypot) {
  if (honeypot) {  //if hidden form filled up
    console.log("Robot Detected!");
    return true;
  } else {
    console.log("Welcome Human!");
  }
}

// get all data in form and return object
function getFormData() {
  var elements = document.getElementById("gform").elements; // all form elements
  var fields = Object.keys(elements).map(function(k) {
    if(elements[k].name !== undefined) {
      return elements[k].name;
    // special case for Edge's html collection
    }else if(elements[k].length > 0){
      return elements[k].item(0).name;
    }
  }).filter(function(item, pos, self) {
    return self.indexOf(item) == pos && item;
  });
  var data = {};
  fields.forEach(function(k){
    data[k] = elements[k].value;
    var str = ""; // declare empty string outside of loop to allow
                  // it to be appended to for each item in the loop
    if(elements[k].type === "checkbox"){ // special case for Edge's html collection
      str = str + elements[k].checked + ", "; // take the string and append
                                              // the current checked value to
                                              // the end of it, along with
                                              // a comma and a space
      data[k] = str.slice(0, -2); // remove the last comma and space
                                  // from the  string to make the output
                                  // prettier in the spreadsheet
    }else if(elements[k].length){
      for(var i = 0; i < elements[k].length; i++){
        if(elements[k].item(i).checked){
          str = str + elements[k].item(i).value + ", "; // same as above
          data[k] = str.slice(0, -2);
        }
      }
    }
  });
  console.log(data);
  return data;
}

function handleFormSubmit(event) {  // handles form submit withtout any jquery
  event.preventDefault();           // we are submitting via xhr below
  var data = getFormData();         // get the values submitted in the form


  if (validateHuman(data.honeypot)) {  //if form is filled, form will not be submitted
    return false;
  }

  if( !validEmail(data.email) ) {   // if email is not valid show error
    document.getElementById('email-invalid').style.display = 'block';
    return false;
  } else {
    var url = event.target.action;  //
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    // xhr.withCredentials = true;
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {
        console.log( xhr.status, xhr.statusText )
        console.log(xhr.responseText);
        window.location.href = 'thank-you/';
        // document.getElementById('gform').style.display = 'none'; // hide form
        // document.getElementById('thankyou_message').style.display = 'block';
        return;
    };
    // url encode form data for sending as post data
    var encoded = Object.keys(data).map(function(k) {
        return encodeURIComponent(k) + '=' + encodeURIComponent(data[k])
    }).join('&')
    xhr.send(encoded);
  }
}
function loaded() {
  console.log('contact form submission handler loaded successfully');
  // bind to the submit event of our form
  var form = document.getElementById('gform');
  form.addEventListener("submit", handleFormSubmit, false);
};
document.addEventListener('DOMContentLoaded', loaded, false);
