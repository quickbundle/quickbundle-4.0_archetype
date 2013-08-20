// JavaScript Document
var qbHtml5mobi = {
  author: 'wuji1626',
  version: '0.5.0',
  //website: 'http://quickbundle.org/'
  //根据实际的web容器端口确定
  //website: 'http://10.0.2.2:9090/JAX/services/userService/'
  //浏览器调试地址
  //website: 'http://127.0.0.1:9090/rmdemo/api/phonegapdemo/'
  website: 'http://127.0.0.1/rmdemo/api/phonegapdemo/'
}
qbHtml5mobi.utils = {
  setParam: function(name, value){
	localStorage.setItem(name, value)  
  },
  getParam: function(name){
	return localStorage.getItem(name)  
  }
}
