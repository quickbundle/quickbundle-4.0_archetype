// JavaScript Document
//首页创建事件
  var $strSubStr = "";
  var myReceipt = null;
  var result = null;

$(document).ready(function(){
			$.mobile.ajaxLinksEnabled = false;
});

$(document).bind('pagecreate',function(){

			$("#searchreceipt").bind( "tap", function(event, ui) {
                var userName = qbHtml5mobi.utils.getParam('user_name');
				console.info(userName);
				var receiptNum = "";
				var receiptFrom = "";
				var receiptTo = "";
				console.info(userName);
				$.jsonp({
					callback:"callback",
					callbackParameter: "jsoncallback",
					url : qbHtml5mobi.website + 'getReceiptInfo',
					data : {"receiptApplicant":userName,
							"receiptNum":receiptNum,
							"receiptFrom":receiptFrom,
							"receiptTo":receiptTo
							},
					error : function(msg) {
						alert(msg.statusText);
					},
					success : function(data) {
						myReceipt = data;
						console.info(myReceipt);
						formatReceiptList(myReceipt);
						//记录登录信息
						//.append(data[0].userName+"<br/>").css("color", "red");
					}
				});	
			});
			$("#newreceipt").bind( "tap", function(event, ui) {
			    qbHtml5mobi.utils.setParam('receipt_id',"");	
				window.location.href = "newreceipt.html";
			});
});

function formatReceiptList(data){
	//clear ul
	$('ul').html('');
  	for(var i=0; i < data.length;i++){
		var li = "<li class='lst' data-role='list-dovider' data-icon='true'>" + 
		"<a href='#' data-role='button' data-icon='delete' onclick='changeToReceiptEdit(" +data[i].receiptNum+ ")'>" +
		"<font size=1>" + 
		//申请人
		//qbHtml5mobi.constants.receiptApplicant + qbHtml5mobi.constants.colon + data[i].receiptApplicant + qbHtml5mobi.constants.space +
		" 申请人：" + data[i].receiptApplicant + "<br/>" +
		//单据
		//qbHtml5mobi.constants.receiptName + qbHtml5mobi.constants.colon + data[i].receiptTitle + qbHtml5mobi.constants.space +
		" 单据：" +  data[i].receiptTitle + "<br/>" +
		//单据日期
		//qbHtml5mobi.constants.receiptDate + qbHtml5mobi.constants.colon + data[i].receiptDate + 
		"单据日期：" + data[i].receiptDate + "<br/>" +
		"</font></a>" +
		"<a href='#' data-icon='delete' onclick='deleteReceipt(" + data[i].receiptNum + ")'><img src='images/delete.png' /></a>" +
		"</li>";
		$(li).appendTo("ul");
	}
	$('ul').listview('refresh');
}
function changeToReceiptEdit(id){
  	qbHtml5mobi.utils.setParam('receipt_id',id);
	window.location.href = "newreceipt.html";
}
function deleteReceipt(id){
				$.jsonp({
					callback:"callback",
					callbackParameter: "jsoncallback",
					url : qbHtml5mobi.website + 'deleteReceiptInfo',
					data : {"receiptNum":id},
					error : function(msg) {
						alert(msg.statusText);
					},
					success : function(data) {
						alert(data);
					    window.location.href = "index.html";
					}
				});	
}