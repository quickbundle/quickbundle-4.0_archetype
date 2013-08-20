// JavaScript Document
function changepage(){
  window.location.href = "login.html";	
}
$('#load_index').live("pagecreate", function(){
  var id = setInterval("changepage()", 3000);											
})
$(document).ready(function(){
			$.mobile.ajaxLinksEnabled = false;
});
function success_jsoncallback(data){
  alert(data);
};
$(document).bind('pagecreate',function(){

			$("#btnSub").bind( "tap", function(event, ui) {
				var userName = document.getElementById("userName").value;
				var userPass = document.getElementById("userPass").value;
				console.info(userName + "," + userPass + "<br/>");
				$.jsonp({
					url: qbHtml5mobi.website + 'loginUser',
					callback:"callback",
					callbackParameter: "jsoncallback",
					data: { "userName":userName,"userPass":userPass },		
					success: function (data, textStatus, xOptions) {
					  $("#result").html(data.name+"µÇÂ¼³É¹¦<br/>").css("color", "red");
						//
						qbHtml5mobi.utils.setParam('user_name',data.name);
						alert(data.name);
						window.location.href = "index.html";
					},
					error: function (xOptions, textStatus) {
					  console.log(xOptions.data);
					}
				});

			});
		});