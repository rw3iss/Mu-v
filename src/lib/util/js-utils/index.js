'use strict';

/* This file contains pending functions which should be moved to the above @rw3iss/js-utils library */

var addEvent = function(object, type, callback) {
    if (object == null || typeof(object) == 'undefined') return;
    if (object.addEventListener) {
        object.addEventListener(type, callback, false);
    } else if (object.attachEvent) {
        object.attachEvent("on" + type, callback);
    } else {
        object["on"+type] = callback;
    }
};

var cl = function() {
	console.log.apply(console, arguments);
}

var serializeForm = function(form) {
	var obj = {};
	var elements = form.querySelectorAll( "input, select, textarea" );
	for( var i = 0; i < elements.length; ++i ) {
		var element = elements[i];
		var name = element.name;
		var value = element.value;

		if( name ) {
			obj[ name ] = value;
		}
	}

	return obj;
};

var parseUrl = function(path) {
	var urlSections = path.split('/');
	urlSections = urlSections.filter(function(sectionString) {
		return sectionString.length > 0;
	});

	var urlPath = path;

	return {
		urlSections: urlSections,
		urlPath: urlPath
	}
}

// Determines if the given object contains all of the given properties.
var hasProperties = function(object, properties) {
	for(const p of properties) {
		if(!object.hasOwnProperty(p))
			return false;
	}

	return true;
}

var querySelector = function(selector) {
	var els = document.querySelectorAll(selector);
	
	if(els.length == 1) {
		els = els[0];
	}
	return els;
}

// auto-centers
var popupWindow = function(url, w, h) {
	var left = (screen.width/2)-(w/2);
  var top = (screen.height/2)-(h/2);
  return window.open(url, '_blank', 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left);
}

var loadScript = function(url, callback) {
  var script = document.createElement( "script" )
  script.type = "text/javascript";
  if(script.readyState) {  //IE
    script.onreadystatechange = function() {
      if ( script.readyState === "loaded" || script.readyState === "complete" ) {
        script.onreadystatechange = null;
        callback();
      }
    };
  } else {  //Others
    script.onload = function() {
      callback();
    };
  }

  script.src = url;
  document.getElementsByTagName( "head" )[0].appendChild( script );
}

var loadStyle = function(url, callback) {
  var script = document.createElement( "link" )
  script.rel = "stylesheet";
  if(script.readyState) {  //IE
    script.onreadystatechange = function() {
      if ( script.readyState === "loaded" || script.readyState === "complete" ) {
        script.onreadystatechange = null;
        callback();
      }
    };
  } else {  //Others
    script.onload = function() {
      callback();
    };
  }

  script.href = url;
  document.getElementsByTagName( "head" )[0].appendChild( script );
}

var getOffset = function(el) {
    var _x = 0;
    var _y = 0;
    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
    }
    return { top: _y, left: _x };
}

module.exports = {
	/* general */
	cl: cl,
	parseUrl: parseUrl,

	/* objects */
	hasProperties: hasProperties,

	/* dom stuff */
	$: querySelector,
	on: addEvent,
	serializeForm: serializeForm,
	popupWindow: popupWindow,
	loadScript: loadScript,
	loadStyle: loadStyle,
	getOffset: getOffset
}

// hack to add cl(console.log) as a global so it's available to any file that requires this one:
if (typeof window != 'undefined' && typeof global == 'undefined') {
	window.cl = cl;
} else if (typeof global != 'undefined') {
	global.cl = cl;
} else {
	throw new Error("Could not create global method 'cl' in js-utils");
}