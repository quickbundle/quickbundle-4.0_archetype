// ***********************************************************************************************************************************

var Event_ToggledOnFlags = 0;
var Event_MouseMoveFunctions = '';
var Event_MouseUpFunctions = '';
var Event_MouseDownFunctions = '';

var mousex = 0, mousey = 0, mouseb = 0;
function Event_GenericMouseMove(eventdata) {
	var scrolldata;
	if (InIE) {
		scrolldata = MeMSOGetScrollPosition();
		mousex = event.clientX + scrolldata.x;
		mousey = event.clientY + scrolldata.y;

		mouseb = event.button;

	} else {
		mousex = parseInt(eventdata.pageX);
		mousey = parseInt(eventdata.pageY);

		if (eventdata.which == 2)
			mouseb = 1;
		else if (eventdata.which == 3)
			mouseb = 2;

	}

	eval(Event_MouseMoveFunctions);
}



function Event_GenericMouseDown(eventdata) {
	var scrolldata;
	if (InIE) {
		scrolldata = MeMSOGetScrollPosition();
		mousex = event.clientX + scrolldata.x;
		mousey = event.clientY + scrolldata.y;

		mouseb = event.button;

	} else {
		mousex = parseInt(eventdata.pageX);
		mousey = parseInt(eventdata.pageY);

		if (eventdata.which == 2)
			mouseb = 1;
		else if (eventdata.which == 3)
			mouseb = 2;

	}

	eval(Event_MouseDownFunctions);
}



function Event_GenericMouseUp(eventdata) {
	var scrolldata;
	if (InIE) {
		scrolldata = MeMSOGetScrollPosition();
		mousex = event.clientX + scrolldata.x;
		mousey = event.clientY + scrolldata.y;

		mouseb = event.button;

	} else {
		mousex = parseInt(eventdata.pageX);
		mousey = parseInt(eventdata.pageY);

		if (eventdata.which == 2)
			mouseb = 1;
		else if (eventdata.which == 3)
			mouseb = 2;

	}

	var eventlist = Event_MouseUpFunctions.split(";");
	//alert('Number of events: ' + eventlist.length);
	for (var q = 0; q < eventlist.length; q++) {
		if (eventlist[q] != '') {
			//alert(eval(eventlist[q] + ';'));
			if (!eval(eventlist[q] + ';'))
				return false;
		}
	}
}



function Event_AddHandler(EventType, HandlerToAppend) {
	switch (EventType) {
	case 'mousemove':
		Event_MouseMoveFunctions += HandlerToAppend;
		if (!(Event_ToggledOnFlags & 0x01)) {
			MeMSOAddEvent('mousemove', Event_GenericMouseMove);
			Event_ToggledOnFlags |= 0x01;
		}
		break;

	case 'mousedown':
		Event_MouseDownFunctions += HandlerToAppend;
		if (!(Event_ToggledOnFlags & 0x02)) {
			MeMSOAddEvent('mousedown', Event_GenericMouseDown);
			Event_ToggledOnFlags |= 0x02;
		}
		break;

	case 'mouseup':
		Event_MouseUpFunctions += HandlerToAppend;
		if (!(Event_ToggledOnFlags & 0x04)) {
			MeMSOAddEvent('mouseup', Event_GenericMouseUp);
			if (InIE)
				document.oncontextmenu = Event_GenericMouseUp;
			Event_ToggledOnFlags |= 0x04;
		}
		break;

	}
}

var pageloaded = 0, onloadlist = "";
var InNetscape, InNS4 = 0, InNS6 = 0;
var InIE, InOldIE = 0;
var InOpera;
var DOMCompatible;
var BrowserVersion;
var BrowserVerMajor = parseInt(navigator.appVersion), BrowserVerMinor = parseFloat(navigator.appVersion);
var useragent = navigator.userAgent.toLowerCase();

InNetscape = ((useragent.indexOf('mozilla') != -1) && (useragent.indexOf('spoofer') == -1) && (useragent.indexOf('compatible') == -1) &&
	(useragent.indexOf('opera') == -1) && (useragent.indexOf('webtv') == -1)) ? 1 : 0;
InOpera = (useragent.indexOf('opera') != -1) ? 1 : 0;
InIE = document.all ? 1 : 0;
DOMCompatible = document.getElementById ? 1 : 0;

if (InNetscape) {
	BrowserVersion = BrowserVerMajor;
	InNS4 = document.layers ? 1 : 0;
	if (BrowserVerMajor >= 5) {
		InNS6 = 1;
		if (useragent.indexOf('netscape6') != -1) {
			BrowserVersion = 6;
		} else {
			q = useragent.indexOf('netscape');
			if (q != -1)
				BrowserVersion = parseInt(useragent.substring(q + 9, q + 10));
		}

	} else {
		InNS6 = 0;

	}

} else if (InIE) {
	if (BrowserVerMajor < 4) {
		BrowserVersion = BrowserVerMajor;
		InIE = 0;
		InOldIE = 1;

	} else if (BrowserVerMajor >= 4) {
		q = useragent.indexOf('msie');
		if (q != -1) {
			BrowserVersion = parseInt(useragent.substring(q + 5, q + 6));
		} else {
			BrowserVersion = BrowserVerMajor;
		}

	}

} else {
	BrowserVersion = BrowserVerMajor;

}

if (InOpera) {
	q = useragent.indexOf('opera');
	if (q != -1) {
		BrowserVersion = parseInt(useragent.substring(q + 6, q + 7));
	}
}

var InMacOS, InUnix, InWindows;
var useros = navigator.platform.toLowerCase();
InMacOS = (useros.indexOf("mac") != -1) ? 1 : 0;
InWindows = (useros.indexOf("win") != -1) ? 1 : 0;
InUnix = ((useros.indexOf("unix") != -1) || (useros.indexOf("solaris") != -1) || (useros.indexOf("linux") != -1) || (useros.indexOf("sun") != -1) ||
	(useros.indexOf("hp") != -1) || (useros.indexOf("bsd") != -1)) ? 1 : 0;


Randomize();



var C_NUM = 0;
var C_DBL = 1;
var C_STRING = 2;
function nullwrap(somevar, newtype) {
	var curval;
	switch (newtype) {
	case 0:
		if (typeof(somevar) == 'number')
			return Math.floor(somevar);
		if (typeof(somevar) == 'string') {
			curval = isNaN(somevar) ? 0 : parseInt(somevar);
			if (isNaN(curval))
				curval = 0;
			return curval;
		}
		return 0;

	case 1:
		if (typeof(somevar) == 'number')
			return somevar;
		if (typeof(somevar) == 'string') {
			curval = isNaN(somevar) ? 0.0 : parseFloat(somevar);
			if (isNaN(curval))
				curval = 0.0;
			return curval;
		}
		return 0;

	case 2:
		if (typeof(somevar) == 'number')
			return somevar.toString;
		if (typeof(somevar) == 'string')
			return somevar;
		return '';
	}
}



var MeMSO_RandSeed = 0;
function Randomize() {
  var now = new Date();
  MeMSO_RandSeed = now.getTime() % 0xffffffff;
}



function Random(n) {
  MeMSO_RandSeed = (0x015a4e35 * MeMSO_RandSeed + 1) % 0x7fffffff;
  return (MeMSO_RandSeed >> 16) % n;
}



function OnLoadMainFunction() {
	if (onloadlist!="")
		eval(onloadlist);
	pageloaded = 1;
}



function AreYouSure(popuptext, someurl) {
	if (confirm(popuptext))
		window.location = someurl;
}



function DisplayMiniWindow(windowpage, popupwidth, popupheight) {
	window.open(windowpage, '', 'width=' + popupwidth + ',height=' + popupheight +
		',location=no,toolbar=no,menubar=no,scrollbars=yes,resizable=yes');
}



function DisplayMiniWindow2(windowpage, popupwidth, popupheight) {
	window.open(windowpage, '', 'width=' + popupwidth + ',height=' + popupheight +
		',location=no,toolbar=no,menubar=no,scrollbars=no,resizable=no');
}



function DisplayMiniWindow3(windowpage, targetwindow, popupwidth, popupheight) {
	window.open(windowpage, targetwindow, 'width=' + popupwidth + ',height=' + popupheight +
		',location=no,toolbar=no,menubar=no,scrollbars=yes,resizable=yes');
}



function DisplayMiniWindow4(windowpage, targetwindow, popupwidth, popupheight) {
	window.open(windowpage, targetwindow, 'width=' + popupwidth + ',height=' + popupheight +
		',location=no,toolbar=no,menubar=no,scrollbars=no,resizable=no');
}



function DisplayMiniWindowX(windowpage, targetwindow, popupwidth, popupheight, options) {
	window.open(windowpage,
		targetwindow,
		'width=' + popupwidth +
		',height=' + popupheight +
		',location=' + (options & 0x01 ? 'yes' : 'no') +
		',toolbar=' + (options & 0x02 ? 'yes' : 'no') +
		',menubar=' + (options & 0x04 ? 'yes' : 'no') +
		',scrollbars=' + (options & 0x08 ? 'yes' : 'no') +
		',resizable=' + (options & 0x10 ? 'yes' : 'no'));
}



function DisplayMessageAndGo(displaymessage, newlocation) {
	DisplayMiniWindow2('/popup-message.asp?message=' + escape(displaymessage), 400, 250);
	window.location = newlocation;
}



function Preloadimage(imagelist) {
	var imagearray = imagelist.split(",");
	var imagearraydata = new Array(imagearray.length);

	for (var q = 0; q < imagearray.length; q++) {
		imagearraydata[q] = new Image;
		imagearraydata[q].src = imagearray[q];
	}
}



function DisplayBrowserAndOSData() {
	alert('useragent = ' + useragent + '\n' +
		'InNetscape = ' + InNetscape + '\n' +
		'InNS4 = ' + InNS4 + '\n' +
		'InNS6 = ' + InNS6 + '\n' +
		'InIE = ' + InIE + '\n' +
		'InOldIE = ' + InOldIE + '\n' +
		'InOpera = ' + InOpera + '\n' +
		'DOMCompatible = ' + DOMCompatible + '\n' +
		'BrowserVersion = ' + BrowserVersion + '\n' +
		'BrowserVerMajor = ' + BrowserVerMajor + '\n' +
		'BrowserVerMinor = ' + BrowserVerMinor + '\n' +
		'\nuseros = ' + useros + '\n' +
		'InMacOS = ' + InMacOS + '\n' +
		'InWindows = ' + InWindows + '\n' +
		'InUnix = ' + InUnix + '\n');
}



function CheckForFlash2() {
	navigator.plugins.refresh();
	if (navigator.plugins["Shockwave Flash"]){ 
		parent.location.reload();

	} else {
		setTimeout("CheckForFlash2();", 1000);

	}
}



function CheckForFlash() {
	var ShockMode = 0;

	if (navigator.mimeTypes && navigator.mimeTypes["application/x-shockwave-flash"] &&
		navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin) {
		if (navigator.plugins && navigator.plugins["Shockwave Flash"])
			ShockMode = 1;
	}

	if (!ShockMode && navigator.appName && navigator.appName.indexOf("Netscape") != - 1 && navigator.appVersion.indexOf("4.") != - 1 &&
		navigator.javaEnabled() && netscape.softupdate.Trigger.UpdateEnabled() && document.cookie.indexOf("StartedShockwaveInstall") == -1) {
		var jarPath = new String("");
		if (navigator.platform.indexOf("Win32") >= 0)
			jarPath = "http://download.macromedia.com/pub/shockwave/jars/english/silentflash32.jar"
		else if (navigator.platform.indexOf("Win16") >= 0)
			jarPath = "http://download.macromedia.com/pub/shockwave/jars/english/silentflash16.jar"
		else if (navigator.platform.indexOf("MacPPC") >= 0)
			jarPath = "http://download.macromedia.com/pub/shockwave/jars/english/silentflashppc.jar"

		if (jarPath.length) {
			netscape.softupdate.Trigger.StartSoftwareUpdate (jarPath, netscape.softupdate.Trigger.FORCE_MODE);
			document.cookie = 'StartedShockwaveInstall;path=/;'
			setTimeout("CheckForFlash2();", 1000);
		}
	}
}



function CloseCurrentWindow() {
	if (InIE)
		self.close();
	else
		window.close();
}



// Event Functions -----------------------------------------------------------
// The following are currently Netscape 4.x, Netscape 6.x, and IE4+ compatible



function MeMSOAddEvent(eventname, eventfunction) {
	if (!InIE && !DOMCompatible && !InNS6 && !InNS4)
		return 0;
	if (InNS6)
		document.addEventListener(eventname, eventfunction, false);

	switch (eventname) {
	case 'mousemove':
		if (InNS4)
			document.captureEvents(Event.MOUSEMOVE);
		document.onmousemove = eventfunction;
		break;

	case 'mousedown':
		if (InNS4)
			document.captureEvents(Event.MOUSEDOWN);
		document.onmousedown = eventfunction;
		break;

	case 'mouseup':
		if (InNS4)
			document.captureEvents(Event.MOUSEUP);
		document.onmouseup = eventfunction;

	}
	return 1;
}



// DHTML Object Functions ----------------------------------------------------
// The following are currently Netscape 4.x, Netscape 6.x, and IE4+ compatible



function MeMSOObjectCreate(objectname) {
	var newhtml, newobject;
	if (!InNS4) {
		newhtml = '<div id="' + objectname + '" style="position: absolute;">&nbsp;</div>';
		if (typeof(document.createElement) != 'undefined') {
			newobject = document.createElement("DIV");
			if (newobject) {
				newobject.id = objectname;
				newobject.style.position = "absolute";
				document.body.appendChild(newobject);
			}

		} else if (typeof(document.body.insertAdjacentHTML) != 'undefined') {
			document.body.insertAdjacentHTML("BeforeEnd", newhtml);

		}

	} else {
		document.layers[objectname] = new Layer(0);
		eval('document.' + objectname + ' = document.layers[objectname];');

	}
}



function MeMSOObjectStyleChange(objectname, styletochange, newvalue) {
	var stylename = '', q, flag, curval;
	if (DOMCompatible || InNS4) {
		switch (styletochange) {
		case 'opacity':
			if (InNS6)
				document.getElementById(objectname).style.MozOpacity = (newvalue / 100);
			else if (InIE && !InMacOS)
				document.getElementById(objectname).filters.alpha.opacity = newvalue;
			break;

		default:
			if (styletochange=='background-image')
				newvalue = "url(" + newvalue + ")";
			for (q=0; q<styletochange.length; q++) {
				curval = styletochange.substring(q, q+1);
				if (curval=='-') {
					flag = 1;

				} else {
					if (flag) {
						stylename += curval.toUpperCase();
						flag = 0;
					} else {
						stylename += curval;
					}
				}
			}

			if (!InNS4) {
				eval('document.getElementById(objectname).style.' + stylename + ' = newvalue;');
			} else {
				eval('GetElementPointer(objectname, 0).' + stylename + ' = newvalue;');
			}
			break;
		}

	} else if (InIE) {
		switch (styletochange) {
		case 'background-color':
			stylename = 'bgColor';
			break;

		case 'background-image':
			stylename = 'bgImage';
			break;

		default:
			stylename = styletochange;

		}
		eval('document.all.' + objectname + '.' + stylename + ' = newvalue;');
	}
}



function MeMSOObjectMove(objectname, newx, newy) {
	var ourpointer = MeMSOObjectGetPointer(objectname, 0);

	if (InIE || DOMCompatible) {
		if (!InOpera) {
			ourpointer.style.left = newx.toString() + 'px';
			ourpointer.style.top = newy.toString() + 'px';
		} else {
			ourpointer.style.pixelLeft = newx;
			ourpointer.style.pixelTop = newy;
		}

	} else if (InNS4) {
		ourpointer.left = newx;
		ourpointer.top = newy;

	}
}



function MeMSOObjectUpdate(objectname, newcontent) {
	var ourpointer = MeMSOObjectGetPointer(objectname, 0);
	if (InIE || DOMCompatible) {
		if (typeof(ourpointer.innerHTML) != 'undefined') {
			ourpointer.innerHTML = newcontent;

		} else {
			ourpointer.firstChild.nodeValue = newcontent;

		}

	} else if (InNS4) {
		ourpointer.document.open();
		ourpointer.document.write(newcontent);
		ourpointer.document.close();

	}
}



function MeMSOObjectSetVisible(objectname, turniton) {
	var ourpointer = MeMSOObjectGetPointer(objectname, 0);
  if (InIE || DOMCompatible) {
    ourpointer.style.visibility = turniton ? 'visible' : 'hidden';

  } else if (InNS4) {
    ourpointer.visibility = turniton ? 'show' : 'hide';

  }
}



function MeMSOObjectGetVisible(objectname) {
	var ourpointer = MeMSOObjectGetPointer(objectname, 0);
  if (InIE || DOMCompatible) {
    return ourpointer.style.visibility == 'hidden' ? 0 : 1;

  } else if (InNS4) {
		return ourpointer.visibility == 'hide' ? 0 : 1;

  }
}



function MeMSOObjectSetZIndex(objectname, newindex) {
	var ourpointer = MeMSOObjectGetPointer(objectname, 0);
  if (InIE || DOMCompatible) {
    ourpointer.style.zIndex == newindex;

  } else if (InNS4) {
		ourpointer.zIndex == newindex;

  }
}



function MeMSOObjectGetZIndex(objectname) {
	var ourpointer = MeMSOObjectGetPointer(objectname, 0);
  if (InIE || DOMCompatible) {
    return ourpointer.style.zIndex;

  } else if (InNS4) {
		return ourpointer.zIndex;

  }
}



function MeMSOObjectGetPosition(objectname) {
	var ourpointer = MeMSOObjectGetPointer(objectname, 0);
	var coordinates = new Object();
	var x = 0, y = 0;

	// Logic to find position
	if (InIE || InNS6) {
		x = MeMSO_IEGetPageOffsetLeft(ourpointer);
		y = MeMSO_IEGetPageOffsetTop(ourpointer);

	} else if (InOpera) {
		x = ourpointer.style.pixelLeft;
		y = ourpointer.style.pixelTop;

	} else if (DOMCompatible) {
		x = parseInt(ourpointer.style.left);
		y = parseInt(ourpointer.style.top);

	} else if (InNetscape) {
		x = ourpointer.left;
		y = ourpointer.top;

	}

	coordinates.x = x;
	coordinates.y = y;
	return coordinates;
}



function MeMSOObjectGetScreenPosition(objectname) {
	var coordinates = MeMSOObjectGetPosition(anchorname);
	var x = 0;
	var y = 0;
	if (InIE) {
		x = coordinates.x - document.body.scrollLeft + window.screenLeft;
		y = coordinates.y - document.body.scrollTop + window.screenTop;

	} else if (DOMCompatible) {
		if (isNaN(window.screenX)) {
			x = coordinates.x - document.body.scrollLeft + window.screenLeft;
			y = coordinates.y - document.body.scrollTop + window.screenTop;

		} else {
			x = coordinates.x + window.screenX + (window.outerWidth - window.innerWidth) - window.pageXOffset;
			y = coordinates.y + window.screenY + (window.outerHeight - 24 - window.innerHeight) - window.pageYOffset;

		}

	}	else if (InNetscape) {
		x = coordinates.x + window.screenX + (window.outerWidth - window.innerWidth) - window.pageXOffset;
		y = coordinates.y + window.screenY + (window.outerHeight - 24 - window.innerHeight) - window.pageYOffset;

	}
	coordinates.x = x;
	coordinates.y = y;
	return coordinates;
}



function MeMSOObjectGetSize(objectname) {
	var coordinates = new Object();
	var curwidth = 0, curheight = 0;
	var ourpointer = MeMSOObjectGetPointer(objectname, 0);
	if (InIE || InOpera) {
		if (ourpointer.style.pixelWidth) {
			curwidth = ourpointer.style.pixelWidth;
			curheight = ourpointer.style.pixelHeight;

		} else {
			curwidth = ourpointer.clientWidth;
			curheight = ourpointer.clientHeight;

		}

	} else if (DOMCompatible) {
		if (ourpointer.style.width) {
			curwidth = parseInt(ourpointer.style.width);
			curheight = parseInt(ourpointer.style.height);

		} else if (document.defaultView) {
			curwidth = parseInt(document.defaultView.getComputedStyle(document.getElementById(objectname), "").getPropertyValue("width"));
			curheight = parseInt(document.defaultView.getComputedStyle(document.getElementById(objectname), "").getPropertyValue("height"));

		} else {
			curwidth = object.offsetWidth;
			curheight = object.offsetHeight;

		}

	} else if (InNS4) {
		if (ourpointer.height) {
			curwidth = ourpointer.width;
			curheight = ourpointer.height;

		} else {
			curwidth = ourpointer.clip.right - ourpointer.clip.left + 1;
			curheight = ourpointer.clip.bottom - ourpointer.clip.top + 1;

		}

	}
	coordinates.width = curwidth;
	coordinates.height = curheight;
	return coordinates;
}



function MeMSOObjectSetSize(objectname, newwidth, newheight) {
	var ourpointer = MeMSOObjectGetPointer(objectname, 0);
	if (InOpera) {
		ourpointer.style.pixelWidth = newwidth;
		ourpointer.style.pixelHeight = newheight;		

	} else if (InIE || DOMCompatible) {
		ourpointer.style.width = newwidth;
		ourpointer.style.height = newheight;

	} else if (InNS4) {
		ourpointer.offsetWidth = newwidth;
		ourpointer.offsetHeight = newheight;

	}
}



function MeMSOObjectGetClipping(objectname) {
	var ourpointer = MeMSOObjectGetPointer(objectname, 0);
	var coordinates = new Object();
	var t = 0, b = 0, l = 0, r = 0;
	var curpos = 0, q, curval, curchar, curstring;
	if (!InNS4) {
		curstring = ourpointer.style.clip;
		for (q = 0; q < 3; q++) {
			curchar = curstring.charCodeAt(curpos);
			while (curchar < 48 || curchar > 57) {
				curchar = curstring.charCodeAt(++curpos);
			}
			curval = 0;
			while (curchar >= 48 && curchar <= 57 && curpos<curstring.length) {
				curval = (curval * 10) + (curchar - 48);
				curchar = curstring.charCodeAt(++curpos);
			}

			switch (q) {
			case 0:
				t = curval;
				break;
			case 1:
				r = curval;
				break;
			case 2:
				b = curval;
				break;
			case 3:
				l = curval;
				break;
			}
		}

	} else {
		t = ourpointer.clip.top;
		b = ourpointer.clip.bottom;
		l = ourpointer.clip.left
		r = ourpointer.clip.right;

	}
	coordinates.top = t;
	coordinates.bottom = b;
	coordinates.right = r;
	coordinates.left = l;
	return coordinates;
}



function MeMSOObjectSetClipping(objectname, newleft, newtop, newright, newbottom) {
	var ourpointer = MeMSOObjectGetPointer(objectname, 0);
	if (!InNS4) {
		ourpointer.style.clip = 'rect(' + newtop + ' ' + newright + ' ' + newbottom + ' ' + newleft + ')';

	} else {
		ourpointer.clip.top = newtop;
		ourpointer.clip.bottom = newbottom;
		ourpointer.clip.left = newleft;
		ourpointer.clip.right = newright;
	}
}


function MeMSOGetWindowSize() {
  var coordinates = new Object();
	var curwidth = 0, curheight = 0;

  if (typeof(window.innerWidth) == 'number') {
    curwidth = window.innerWidth;
    curheight = window.innerHeight;

  } else {
    if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
      // IE 6+ in 'standards compliant mode'
      curwidth = document.documentElement.clientWidth;
      curheight = document.documentElement.clientHeight;

    } else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
      // IE 4 compatible
      curwidth = document.body.clientWidth;
      curheight = document.body.clientHeight;

    }

  }

  coordinates.width = curwidth;
  coordinates.height = curheight;
	return coordinates;
}


function MeMSOGetScrollPosition() {
  var coordinates = new Object();
	var curposx = 0, curposy = 0;

  if (typeof(window.pageXOffset) == 'number') {
    // Netscape compliant
    curposx = window.pageXOffset;
    curposy = window.pageYOffset;

  } else {
    if (document.body && (document.body.scrollLeft || document.body.scrollTop)) {
      // DOM compliant
      curposx = document.body.scrollLeft;
      curposy = document.body.scrollTop;

    } else if (document.documentElement && (document.documentElement.scrollLeft || document.documentElement.scrollTop)) {
      // IE6 standards compliant mode
      curposx = document.documentElement.scrollLeft;
      curposy = document.documentElement.scrollTop;

    }

  }

  coordinates.x = curposx;
  coordinates.y = curposy;
	return coordinates;
}


// ---------------------------------------------------------------------------
// Internal Use Functions



function MeMSOObjectGetPointer(objectname, parentlayer) {
	var layerarray;
	if (DOMCompatible)
		return document.getElementById(objectname);
	if (InIE)
		return document.all[objectname];
	if (InNS4) {
		layerarray = (parentlayer ? parentlayer : self).document.layers;
		if (layerarray[objectname])
			return layerarray[objectname];
		for (i = 0; i < layerarray.length; i++)
			return MeMSOObjectGetPointer(objectname, layerarray[i]);
	}
	return 0;
}



function MeMSO_IEGetPageOffsetLeft(curobject) {
	var curpos = curobject.offsetLeft;
	while ((curobject = curobject.offsetParent)!=null) {
		curpos += curobject.offsetLeft;
	}
	return curpos;
}



function MeMSO_IEGetPageOffsetTop(curobject) {
	var curpos = curobject.offsetTop;
	while ((curobject = curobject.offsetParent)!=null) {
		curpos += curobject.offsetTop;
	}
	return curpos;
}




// Zoom In Region when mousing over a preview image
// Requires: general.js, events.js
// Version 1.0.1

var zoom_zoomboxwid, zoom_zoomboxhei, zoom_zoomboxsubx, zoom_zoomboxsuby, zoom_zoomboxmaxx, zoom_zoomboxmaxy;
var zoom_zoomimagemult, zoom_zoomonspotmaxx, zoom_zoomonspotmaxy;
var zoom_onspotx = -1, zoom_onspoty = -1;

// BITS
// 0 - Zoom Region is ready
// 1 - Zoom Image is loaded
// 2 - We're using a Table behind the zoom image
// 4 - Zoom Region is currently showing
var zoom_statusflags = 0;



function Zoom_StartupZoomRegion() {
	zoom_onspotx = -1;
	zoom_onspoty = -1;

	if (!zoom_zoomimagewid || !zoom_zoomimagehei || !zoom_mainimagewid || !zoom_mainimagehei) {
		alert('Image size parameters not properly set! Aborting setup of the zoom region.');
	}

	// No support for non-IE, non-DOM compatible browsers (such as NS 4.x)
	if ((!InIE || BrowserVerMajor <= 4) && !DOMCompatible && !InNS6)
		return;

	zoom_zoomimagemult = zoom_zoomimagewid / zoom_mainimagewid;

	zoom_zoomboxwid = Math.floor(zoom_mainimagewid / (zoom_zoomimagewid / zoom_viewportwid));
	zoom_zoomboxhei = Math.floor(zoom_mainimagehei / (zoom_zoomimagehei / zoom_viewporthei));
	zoom_zoomboxsubx = zoom_zoomboxwid >> 1;
	zoom_zoomboxsuby = zoom_zoomboxhei >> 1;
	zoom_zoomonspotmaxx = Math.floor((zoom_zoomimagewid - zoom_viewportwid) / zoom_zoomimagemult);
	zoom_zoomonspotmaxy = Math.floor((zoom_zoomimagehei - zoom_viewporthei) / zoom_zoomimagemult);
	zoom_zoomboxmaxx = zoom_mainimagewid - zoom_zoomboxwid + 1;
	zoom_zoomboxmaxy = zoom_mainimagehei - zoom_zoomboxhei + 1;

	MeMSOObjectSetSize(zoom_bigimageouterdiv, zoom_viewportwid, zoom_viewporthei);

	if (!(zoom_statusflags & 0x02)) {
		ZoomSetupZoomImage();
		zoom_statusflags |= 0x02;
	}
	zoom_statusflags |= 0x01;

	if (zoom_bigimagetablediv != '') {
		MeMSOObjectMove(zoom_bigimagetablediv,
			zoom_displayxposition,
			zoom_displayyposition);
		zoom_statusflags |= 0x04;
	}

	Event_AddHandler('mousemove', 'Zoom_MouseTester();');
}



function Zoom_EndZoomRegion() {
	if (zoom_statusflags & 0x10) {
		MeMSOObjectSetVisible(zoom_highlightdiv, 0);
		MeMSOObjectSetVisible(zoom_bigimagediv, 0);
		if (zoom_statusflags & 0x04)
			MeMSOObjectSetVisible(zoom_bigimagetablediv, 0);
	}

	zoom_statusflags = 0;
}



function Zoom_MouseTester() {
	if (zoom_statusflags & 0x01) {
		if (mousex >= zoom_miniimagex && mousex <= (zoom_miniimagex + zoom_mainimagewid - 1) &&
			mousey >= zoom_miniimagey && mousey <= (zoom_miniimagey + zoom_mainimagehei - 1)) {

			Zoom_ChangeToSpot(mousex - zoom_miniimagex, mousey - zoom_miniimagey, 0);

			if (!(zoom_statusflags & 0x10)) {
				MeMSOObjectSetVisible(zoom_highlightdiv, 1);
				MeMSOObjectSetVisible(zoom_bigimagediv, 1);
				if (zoom_statusflags & 0x04)
					MeMSOObjectSetVisible(zoom_bigimagetablediv, 1);
				zoom_statusflags |= 0x10;
			}

		} else if (zoom_statusflags & 0x10) {
			MeMSOObjectSetVisible(zoom_highlightdiv, 0);
			MeMSOObjectSetVisible(zoom_bigimagediv, 0);
			if (zoom_statusflags & 0x04)
				MeMSOObjectSetVisible(zoom_bigimagetablediv, 0);
			zoom_statusflags &= 0xFFEF;

		}
	}
}



function ZoomSetupZoomImage() {
	var newcontent;
	newcontent = '<img src="' + zoom_zoomimageurl + '" width="' + zoom_zoomimagewid + '" height="' + zoom_zoomimagehei + '" border="0" alt="" />';
	MeMSOObjectUpdate(zoom_bigimagediv, newcontent);

	ZoomSetupHighlightRegion();
}



function ZoomSetupHighlightRegion () {
	var position, newcontent;

	newcontent = '<table border="0" cellspacing="0" cellpadding="0" width="' + zoom_zoomboxwid + '">' +
		'<tr style="background-color: #' + zoom_highlightbgcolor + ';">' +
		'<td width="1"><img src="images/dot.gif" width="1" height="1" alt="" /></td>' +
		'<td width="' + (zoom_zoomboxwid - 2) + '"><img src="images/dot.gif" width="' + (zoom_zoomboxwid - 2) + '" height="1" alt="" /></td>' +
		'<td width="1"><img src="images/dot.gif" width="1" height="1" alt="" /></td>' +
		'</tr>' +
		'<tr>' +
		'<td style="background-color: #' + zoom_highlightbgcolor + ';"><img src="images/dot.gif" width="1" height="1" alt="" /></td>' +
		'<td style="background-image: url(\'' + zoom_highlightimage + '\');">' +
			'<img src="images/dot.gif" width="' + (zoom_zoomboxwid - 2) + '" height="' + (zoom_zoomboxhei - 2) + '" alt="" /></td>' +
		'<td style="background-color: #' + zoom_highlightbgcolor + ';"><img src="images/dot.gif" width="1" height="1" alt="" /></td>' +
		'</tr>' +
		'<tr style="background-color: #' + zoom_highlightbgcolor + ';">' +
		'<td colspan="3"><img src="images/dot.gif" width="1" height="1" alt="" /></td>' +
		'</tr>' +
		'</table>';
	MeMSOObjectUpdate(zoom_highlightdiv, newcontent);
}



function Zoom_ChangeToSpot(zoom_newspotx, zoom_newspoty) {
	var viewposition;

	if (pageloaded) {
		MeMSOObjectMove(zoom_bigimageouterdiv,
			zoom_displayxposition + zoom_bigimagetablexoffset,
			zoom_displayyposition + zoom_bigimagetableyoffset);
		zoom_newspotx -= zoom_zoomboxsubx;
		zoom_newspoty -= zoom_zoomboxsuby;

		if (zoom_newspotx > zoom_zoomboxmaxx)
			zoom_newspotx = zoom_zoomboxmaxx;
		else if (zoom_newspotx < 0)
			zoom_newspotx = 0;

		if (zoom_newspoty > zoom_zoomboxmaxy)
			zoom_newspoty = zoom_zoomboxmaxy;
		else if (zoom_newspoty < 0)
			zoom_newspoty = 0;

		if (zoom_onspotx != zoom_newspotx || zoom_onspoty != zoom_newspoty) {
			zoom_onspotx = zoom_newspotx;
			if (zoom_onspotx > zoom_zoomonspotmaxx)
				zoom_onspotx = zoom_zoomonspotmaxx;
			zoom_onspoty = zoom_newspoty;
			if (zoom_onspoty > zoom_zoomonspotmaxy)
				zoom_onspoty = zoom_zoomonspotmaxy;

			MeMSOObjectMove(zoom_highlightdiv, zoom_miniimagex + zoom_newspotx, zoom_miniimagey + zoom_newspoty);
			MeMSOObjectMove(zoom_bigimagediv, -Math.floor(zoom_zoomimagemult * zoom_onspotx), -Math.floor(zoom_zoomimagemult * zoom_onspoty));
			MeMSOObjectSetClipping(zoom_bigimagediv, Math.floor(zoom_zoomimagemult * zoom_onspotx), Math.floor(zoom_zoomimagemult * zoom_onspoty),
				Math.floor(zoom_zoomimagemult * zoom_onspotx) + zoom_viewportwid, Math.floor(zoom_zoomimagemult * zoom_onspoty) + zoom_viewporthei);
		}
	}
}
