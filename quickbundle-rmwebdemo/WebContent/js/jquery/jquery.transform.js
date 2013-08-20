/*
 * jquery.transform.js
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
 * NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
 * USE OR OTHER DEALINGS IN THE SOFTWARE.
 * 
 */
(function($) {
	$.transform = function(o) {
		var createXmlObj = function(data) {
			if($.browser.msie) {
				var x = $("<xml>")[0];
				x.loadXML(data);
				return x;
			} else {
				var parser = new DOMParser();
				return parser.parseFromString(data,"text/xml");
			};
		};
		
		var call = function(f,o,tel,other) {
			if($.isFunction(f)) {
				var arg1 = tel.html();
				if(o.c.dataType.toUpperCase() == "JSON") {
					arg1 = eval("(" + tel.html() + ")");
				}
				if(o.c.dataType.toUpperCase() == "XML") {
					arg1 = createXmlObj(tel.html());
				}
				f(arg1,o.c.xslstr,o.c.xmlstr,o.c,other);
			};
		};
				
		var t = this;
		t.c = {
			el:o.el,
			cache:o.cache == null?false:o.cache,
			async:o.async == null?true:o.async,
			xsl:o.xsl == null?false:o.xsl,
			xml:o.xml == null?false:o.xml,
			xslstr:o.xslstr == null?false:o.xslstr,
			xmlstr:o.xmlstr == null?false:o.xmlstr,
			xslobj:o.xslobj == null?false:o.xslobj,
			xmlobj:o.xmlobj == null?false:o.xmlobj,
			xslParams:o.xslParams == null?false:o.xslParams,
			error:o.error == null? false : o.error,
			success:o.success == null?false:o.success,
			complete:o.complete == null?false:o.complete,
			island:o.island == null?false:o.island,
			pass:o.pass == null?false:o.pass,
			msg:o.msg == null?false:o.msg,
			dataType:o.dataType == null?"html":o.dataType
		};
		
		if(o.msg) {
			$(o.el).html((typeof(o.msg) == "string")? o.msg : $(o.msg).html());
		};
		
		var id = function(pre) {
			var name = pre + "_" + (Math.round(Math.random() * 999));
			return $("#" + name).length == 0 ? name : id(pre);
		};
		
		var replaceref = function(val, o) {
			o.c.xsl = o.c.xsl?o.c.xsl:"";
			var c = location.protocol == "file:" && $.browser.msie ? "\\" : "/";
			var path1 = location.protocol + c + c + location.host;
			var path2 = location.pathname.substring(0,location.pathname.lastIndexOf(c) + 1) + o.c.xsl.substring(0,o.c.xsl.lastIndexOf("/") + 1);
			
			if(val.substring(0,1) == c) {
				return path1 + val;
			}
			else if(val.substring(0,2) == "..") {
				var count = 0;
				while(val.indexOf("..") != -1) {
					val = val.substring(val.indexOf("..") + 3);
					count += 1;
				}
				
				var p = path1 + path2.substring(0,path2.length - 1);
				
				for(var x=0;x<count;x++) {
					p = p.substring(0,p.lastIndexOf(c));
				}
				return p + c + val;
			}
			else {
				return path1 + path2 + val;
			};
		};
		
		var checkReady = function(o) {
			if((o.c.xslstr || o.c.xslobj) && (o.c.xmlstr || o.c.xmlobj)) {
				var fail = false;
				var tel = $("<div></div>");
				if(o.c.throwerror) {
					call(o.c.error,o,tel,{message:"Bad XML or XSL call"}); 
					return;
				};
				
				if(o.c.island) {
					if(o.c.island == true) {o.c.island = "body";};
					o.c.xslid = id("xsl");
					$(o.c.island).append("<div id='" + o.c.xslid + "' name='" + o.c.xslid + "' style='display:none;'>" + o.c.xslstr + "</div>");
					o.c.xmlid = id("xml");
					$(o.c.island).append("<div id='" + o.c.xmlid + "' name='" + o.c.xmlid + "' style='display:none;'>" + o.c.xmlstr + "</div>");
				};
				
				o.c.xslobj = o.c.xslobj ? o.c.xslobj : createXmlObj(o.c.xslstr);
				o.c.xmlobj = o.c.xmlobj ? o.c.xmlobj : createXmlObj(o.c.xmlstr);
				
				if($.browser.msie) {
				    try {					
						
						var fixref = function(ref,xObj) {
							var vals = xObj.selectNodes(ref);
							for(var x = 0; x<vals.length; x++) {
								vals[x].setAttribute("href",replaceref(vals[x].getAttribute("href"),o));
							};
						};
						
						fixref("//xsl:include",o.c.xslobj);
						fixref("//xsl:import",o.c.xslobj);
						
						var addparams = function(op, xObj) {
							for(var p in op) 
			                {
			                    var strParam = "//xsl:param[@name='" + p + "']";
			                    
			                    try {			                        
									var v = op[p];
									if(isNaN(parseInt(op[p])) && op[p].indexOf("'") < 0) {
										v = "'" + op[p] + "'";
									}
				    				var xslParam = xObj.selectSingleNode(strParam);	    				
					    			xslParam.setAttribute("select",v);
					    		    
					            } catch(ex) {
					                //param failed
					            };
			                };
						};
						
						addparams(o.c.xslParams,o.c.xslobj);
						tel.empty().html(o.c.xmlobj.transformNode(o.c.xslobj)); 
					} catch(ex) {
						fail = true;
						call(o.c.error,o,tel,ex); 
					}
				} else {
					try {
						var proc = new XSLTProcessor();
						
						var fixref = function(ref,xObj) {
							ref = $.browser.mozilla && $.browser.version.substring(0,3) == "1.9" ? "xsl:" + ref : ref;
								var vals = xObj.getElementsByTagName(ref);
								for(var x=0; x<vals.length;x++) {
									vals[x].setAttribute("href",replaceref(vals[x].getAttribute("href"),o));
								};
						};
						
						fixref("import",o.c.xslobj);
						fixref("include",o.c.xslobj);
						
						var addparams = function(op) {
							for(var p in op) {
								proc.setParameter(null, p, op[p]);
							};
						};
						addparams(o.c.xslParams);
						
						var doc = document.implementation.createDocument("","",null);
						proc.importStylesheet(o.c.xslobj);
						tel.empty().append(proc.transformToFragment(o.c.xmlobj,doc));
					} catch(ex) {
						fail = true;
						call(o.c.error,o,tel,ex);
					}
				};
				
				if(o.c.el) {
					$(o.c.el).html(tel.html());
				};
				if(!fail) {
					call(o.c.success,o,tel);
				};
				call(o.c.complete,o,tel);
				
				return tel.html();
			};
		};
		
		var makeCall = function(t,options,type) {
			if(typeof(options) == "string") {
				options = {
					cache:false,//type == "XSL" ? true : false,
					url:options,
					dataType:"xml",
					async:t.c.async,
					pass:t.c.pass
				};
			};
			
			options.complete = function(r) {
				if(type == "XSL") { if(r.status == 200) { t.c.xslstr = r.responseText; } else { t.c.xslstr = "error"; t.c.throwerror=true; } }
				else { if(r.status == 200) { t.c.xmlstr = r.responseText;} else { t.c.xmlstr = "error"; t.c.throwerror=true; } };
				if(t.c.async) { checkReady(t); };
			};
			
			$.ajax(options);
		};
		
		if(t.c.xsl) {
			makeCall(t,o.xsl,"XSL");
		};
		
		if(t.c.xml) {
			makeCall(t,o.xml,"XML");
		};
		
		if(!t.c.async || (t.c.xmlstr || t.c.xmlobj) || (t.c.xslstr || t.c.xslobj)) {
			return checkReady(t);
		};
	};
	
	$.fn.transform = function(o) {
		return this.each(function() {
			o = o ? o : {};
			o.el = this;
			new $.transform(o);
		});
	};
})(jQuery);

$().ready(function(){
	$("[transform]").each(function(num,el) {
		$(el).transform(eval("(" + $(el).attr("transform") + ")"));
	});
});
