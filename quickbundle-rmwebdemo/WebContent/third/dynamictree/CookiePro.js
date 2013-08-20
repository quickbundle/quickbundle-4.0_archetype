function Cookie(document, name, hours, path, domain, secure)
{
    this.$document = document;
    this.$name = name;
    if (hours)
        this.$expiration = new Date((new Date()).getTime() + hours*3600000);
    else this.$expiration = null;
    if (path) this.$path = path; else this.$path = null;
    if (domain) this.$domain = domain; else this.$domain = null;
    if (secure) this.$secure = true; else this.$secure = false;
}

Cookie.prototype.store = function () {
    var cookieval = "";
    for(var prop in this) {
        if ((prop.charAt(0) == '$') || ((typeof this[prop]) == 'function')) 
            continue;
        if (cookieval != "") cookieval += '&';
        cookieval += prop + ':' + escape(this[prop]);
    }

    var cookie = this.$name + '=' + cookieval;
    if (this.$expiration)
        cookie += '; expires=' + this.$expiration.toGMTString();
    if (this.$path) cookie += '; path=' + this.$path;
    if (this.$domain) cookie += '; domain=' + this.$domain;
    if (this.$secure) cookie += '; secure';

    this.$document.cookie = cookie;
}

Cookie.prototype.load = function() { 
    var allcookies = this.$document.cookie;
    if (allcookies == "") return false;

    var re = eval("/\\b" + this.$name + "\\b=([^;]*)/");
    var result = allcookies.match(re);
    if(result)
    	cookieval = result[1]; 
    else
    	cookieval = "";
		
    var a = cookieval.split('&');    // Break it into array of name/value pairs.
    for(var i=0; i < a.length; i++)  // Break each pair into an array.
        a[i] = a[i].split(':');

    for(var i = 0; i < a.length; i++) {
        this[a[i][0]] = unescape(a[i][1]);
    }

    return true;
}

Cookie.prototype.remove = function() {
    var cookie;
    cookie = this.$name + '=';
    if (this.$path) cookie += '; path=' + this.$path;
    if (this.$domain) cookie += '; domain=' + this.$domain;
    cookie += '; expires=Fri, 02-Jan-1970 00:00:00 GMT';

    this.$document.cookie = cookie;
}
/**************************************************************
*                                                             *
*    cookie扩展函数                                            *
*                                                             *
***************************************************************/
Cookie.prototype.getCookie = function(name){
	return this[name];
}

Cookie.prototype.setCookie = function(name, value){
	this[name] = value;
}

Cookie.prototype.deleteCookie = function(name){
	delete this[name];
}