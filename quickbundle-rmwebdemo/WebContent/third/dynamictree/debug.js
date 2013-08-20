/*弹出一个窗口显示JavaScript错误.*/
var error_count = 0;

function report_error(msg, url, line){
	var winw = 500;
	var winh = 350;
	var w = window.open("",                    // URL (none specified)
	               "error"+error_count++, // Name (force it to be unique)
	               "resizable,status,width=" + winw + ",height=" + winh); // Features
	
	w.moveTo((screen.availWidth-winw)/2,(screen.availHeight-winh)/2);
	var d = w.document;    
	d.write('<div align="center">');
	d.write('<font size="7" face="helvetica"><b>');
	d.write('OOPS.... A JavaScript Error Has Occurred!');
	d.write('</b></font><br><hr size="4" width="80%">');
	d.write('<font size="3">');
	d.write('<input type="button" value="Close" onclick="window.close();">');
	d.write('</div><div align="left">');
	d.write('<br>Message: &nbsp;&nbsp;');
	d.write('<input size="60" name="message" value="' + msg + '">');
	d.write('<br>Document: <input size="60" name="url" value="' + url + '">');
	d.write('<br>Line:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <input size="60" name="line" value="'+line +'">');
	d.write('</div></font>');
	d.close();
	
	return true;
}

window.onerror = report_error;

function showClientInfo(){
	alert("窗口宽度：" + window.document.body.clientWidth + "，窗口高度：" + window.document.body.clientHeight);
}