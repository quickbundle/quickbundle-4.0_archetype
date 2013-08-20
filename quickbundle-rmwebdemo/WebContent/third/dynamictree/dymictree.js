/*******************************************************************************
 * dymictree.js																   *
 *																			   *
 * 通过动态方法获得树节点									                       *
 *																			   *
 *******************************************************************************/

//----------------------------------------------------------------------------
// 定义 TreeMenuItem 对象.
//----------------------------------------------------------------------------

// 全局 index 变量.
document.write("<SCRIPT LANGUAGE='JavaScript1.2' SRC='CookiePro.js' TYPE='text/javascript'><\/SCRIPT>");

var treeMenuIndex = 0;
var treeMenu;

var treeMenuName	   = "";
var treeMenuDays	   = 7;
var treeMenuAltText	= true;
var treeMenuOnClick 	= false;
var treeMenuShowStartPage = false;

// table tree 初始化变量
var xmlLoaderAction = "";					//动态获得table内容的Action
var doXmlLoader = false;					//动态加载条件
var xmlTableTitle = "";						//定义table的titile部分
var xmlTableTitleAlign = new Array();

var dynamicLoaderAction = "";				// 动态加载树的ACTION
var treeMenuClickUrl = "";
var treeMenuClickTarget = "";
var treeMenuSelectFirst = false;
var teeeMenuSelectRoot = false;
var showItemLink = null;					// 显示节点的链表
var treeMenuFrame	  = "menuFrame";		//框架名称
var treeMenuImgDir	 = "";					//图片路径
var treeMenuBackground = 'menu_spacer.gif';	//背景图片
var treeMenuBgColor	= '#FFFFFF';			//背景色
var treeMenuFgColor	= '#000000';			//文字颜色
var treeMenuHiBg	   = '#333399';			//高亮背景色
var treeMenuHiFg	   = '#FFFFFF';			//高亮文字颜色
var treeMenuFont	   = '宋体';			//字体
var treeMenuFontSize   = '12';				//字号
var treeMenuRoot	   = '';				//根节点名称
var treeMenuRootDisplay = true;
var treeMenuRootSelected = false;
var treeMenuCss		   = null;				//设定include的css文件

var _treeMenuMoveAction = null;

var treeMenuMovable	= true;
var treeMenuShowPlus 	= true;

var previousItem	=   null;
var currentItem		=	null;

var treeMenuCookie = null;

var treeMenuRootItem = null;

var treeMenuTypeIcons = {};		// 定义不同的typename对应的图标

function setTreeMenuMoveAction(v){
	_treeMenuMoveAction = v; 
}

function setTreeMenuRootItem(name, sid, typeName){
	treeMenuRoot = name;
	treeMenuRootItem = new TreeMenuItem(name, sid, null, null, null, null, null, typeName);
}

// 构造子.
function TreeMenuItem(text, sid, level , url, target, icon, haschild, typeName) {
	this.text = text;

	if (sid)
		this.sid = sid;
	else
		this.sid = treeMenuIndex++;
		
	if (level)
		this.level = level;
	else
		this.level = 0;
		
	if (url != null && url != "")
		this.url = url;
	else
		this.url = treeMenuClickUrl;
	if (target != null && target != "")
		this.target = target;
	else
		this.target = treeMenuClickTarget;
		
	if (icon)
		this.icon = icon;
	else
		this.icon = "";
		
	if(haschild != null){
		if(haschild == "true" || haschild == true)
			this.hasChild = true;
		else
			this.hasChild = false;
	}else
		this.hasChild = null;
		
	this.typeName = typeName;
	
	this.submenu = null;
	this.pid =""; 
	this.parentMenu = null;
	this.itemCreated = false;
	this.nodeCreated = false;
	this.childCreated = false;
	this.last = true;
	this.index = sid;   
	this.makeSubmenu = TreeMenuMakeSubmenu;
	this.setPid = NodePid; 
	this.setParentMenu = ItemParentMenu;
}
// 方法.
function TreeMenuMakeSubmenu(menu) {

	this.submenu = menu;
	menu.setParentItem(this);
}

function NodePid(pid) {

	this.pid = pid;
}

function ItemParentMenu(menu){
	this.parentMenu = menu;
}

TreeMenuItem.prototype.testChild = function(){
	if(this.submenu != null)
		return true;
	return (this.hasChild==true);
}

TreeMenuItem.prototype.getLevel = function(){
	var p = this;
	var i = 0;
	while(p != null){
		i++;
		p = p.parentMenu.parentItem;
	}
	return i;
}
TreeMenuItem.prototype.isLeaf = function(){
	return isLeafItem(this);	
}

//----------------------------------------------------------------------------
// 定义 the TreeMenu 对象.
//----------------------------------------------------------------------------

// 构造子.

function TreeMenu() {

	this.pid = "";
	this.items = new Array();
	this.parentItem = null;
	this.addItem = treeMenuAddItem;
	this.setPid  = treemenupid; 
	this.setParentItem = MenuParentItem;
}

// 方法.

function treeMenuAddItem(item) {

	this.items[this.items.length] = item;
	item.setParentMenu(this);
	if(this.items.length > 1)
		this.items[this.items.length-2].last = false;
	
	// 增加expand状态
	treeMenuExpand.addExpand(item.sid, item);
}
function treemenupid(pid) {
	this.pid = pid;
}
function MenuParentItem(item){
	this.parentItem = item;
}

TreeMenu.prototype.insertItem = function(citem, item){
	var cind = 0;
	item.last = true;
	if(citem != null){
		for(var i=0; i<this.items.length; i++)
			if(this.items[i].sid == citem.sid){
				cind = i;
				break;
			}
		cind ++;
		if(cind == this.items.length){
			this.items[this.items.length-1].last = false;
			this.lastChanged = true;
		}else
			item.last = false;
	}else{
		if(this.items.length != 0)
			item.last = false;
		else
			this.leafChanged = true;
	}
	item.setParentMenu(this);
	this.items.splice(cind, 0, item);
	treeMenuExpand.addExpand(item.sid, item);	
}

TreeMenu.prototype.deleteItem = function(item){
	var cind;
	if(item.last == true){
		cind = this.items.length - 1;
		if(cind > 0){
			this.items[cind-1].last = true;
			this.newLastItem = this.items[cind-1];
		}
	}else
		for(var i=0; i<this.items.length; i++){
			if(item.sid == this.items[i].sid){
				cind = i;
				break;
			}
		}
	this.items.splice(cind,1);
	if(this.items.length == 0){
		if(this.parentItem != null){
			this.parentItem.submenu = null;
			this.parentItem.hasChild = false;
			this.parentItem.menuDeleted = true;
		}
	}
}

//----------------------------------------------------------------------------
// 全局变量 
//----------------------------------------------------------------------------

var treeMenuDocument;							// Handle to the menu frame document.
var showTreeWindow;                     		
var treeMenuWidth;								// Menu width in pixels.
var treeMenuExpand = new TreeExpand();			// 保存树的展开状态
var treeMenuSelected;							// Index of selected menu item from other cookie.
var treeMenuSelectedFound;						// Indicates if we've displayed the selected item.
var tmStartScrollX = 0;                 		
var tmStartScrollY = 18;                		
var treeMenuScrollX;							// Amount to scroll the window right, if needed.
var treeMenuScrollY;							// Amount to scroll the window down, if needed.
var treeMenuDepth;								// Keeps track the current menu level.
var treeMenuBars;								// Keeps track of image placement from row to row.


//----------------------------------------------------------------------------
// This function rewrites the menu document to display the menu.
//----------------------------------------------------------------------------

function treeMenuDisplay(childWin) {

	treeMenuCookie = new Cookie(document, treeMenuName, treeMenuDays*24);
	treeMenuCookie.load();

	//清空所有Cookie
	/*
	if(showItemLink == null)
		deleteAllCookie();
		*/
	if(teeeMenuSelectRoot == true){
		doMenuRootClick();
	}else if(treeMenuSelectFirst == true){
		if(treeMenu != null)
			if(treeMenu.items.length > 0)
				setFindItemTreeCookie(treeMenu.items[0].sid);
	}

	var i, cookie;

	treeMenuDocument = childWin.document;
	showTreeWindow = childWin;
	cookie = treeMenuCookie.getCookie(treeMenuName);
	if (!cookie) {
		treeMenuSelected = -1;
	}else {
		treeMenuExpand.loadCookie(cookie);
		cookie = treeMenuCookie.getCookie(treeMenuName + "-selected");
		if (!cookie)
			treeMenuSelected = -1;
		else{
			treeMenuSelected = cookie;
		}
	}

	treeMenuDepth = 0;
	treeMenuBars = new Array();

	treeMenuSelectedFound = false;
	treeMenuScrollX = 36;
	treeMenuScrollY = 36;

	treeMenuDocument.open();
	
	if(treeMenuCss)
		treeMenuDocument.writeln('<link href="' + treeMenuCss + '" rel="stylesheet" type="text/css">');
	else{
		treeMenuDocument.writeln('<style>');
		treeMenuDocument.writeln('.selected{background-color:' + treeMenuHiBg + ';color:' + treeMenuHiFg + ';border:2px dashed yellow;height:14px;padding-top:2px;}');
		treeMenuDocument.writeln('.over{background-color:orange;}');
		treeMenuDocument.writeln('.unselected{}');
		treeMenuDocument.writeln('.root{white-space:nowrap;cursor:pointer;font:10pt 宋体;font-weight:700;color:black;padding-top:2px;height:12px;}');
				treeMenuDocument.writeln('.selroot{background-color:' + treeMenuHiBg + ';color:' + treeMenuHiFg + ';border:2px dashed yellow;white-space:nowrap;cursor:pointer;font:10pt 宋体;font-weight:700;padding-top:2px;height:12px;}');
		treeMenuDocument.writeln('</style>');
	}
	treeMenuDocument.writeln('<style type="text/css">a {text-decoration:none;color:' + treeMenuFgColor + '}</style>');
	if(doXmlLoader == true)
		treeMenuDocument.writeln('<table id=dymic-tree-table border=1 style="border-collapse:collapse" bordercolor="gray" cellpadding=2 cellspacing=0>');
	else
		treeMenuDocument.writeln('<table id=dymic-tree-table border=0 cellpadding=0 cellspacing=0>');
		
		if(treeMenuRootDisplay == true){
		treeMenuDocument.write('<tr id=tree-root valign=top><td colspan="100">');
		treeMenuDocument.write('<a href="#" title="' + treeMenuRoot + '" onclick="return topWindow.clearTreeMenuClick();">');
		treeMenuDocument.write('<img src="' + treeMenuImgDir + 'menu_root.gif" align=left border=0 vspace=0 hspace=0></a>');
		if(teeeMenuSelectRoot == true){
			treeMenuRootSelected = true;
			treeMenuDocument.write('<span class=selroot id="tree-root-text" onclick="return topWindow.treeMenuClickRoot();">&nbsp;' + treeMenuRoot + '&nbsp;</span>');
		}else
			treeMenuDocument.write('<span class=root id="tree-root-text" onclick="return topWindow.treeMenuClickRoot();">&nbsp;' + treeMenuRoot + '&nbsp;</span>');			
		treeMenuDocument.writeln('</td></tr>');
	  }
	
	if(doXmlLoader==true)
		treeMenuDocument.writeln(xmlTableTitle);

	treeMenuDocument.writeln('</table>');

	treeMenuListItems(treeMenu);

   
	treeMenuDocument.close();
	treeMenuScroll();
	if(treeMenuShowStartPage)
		showStartPage();
	
	// 取得previousItem
	if(treeMenuSelected != -1)
		previousItem = treeMenuExpand.getExpandItem(treeMenuSelected);
	
	if(treeMenuMovable == true){
		showTreeWindow.document.attachEvent("onmousedown", _dt_itemMouseDown);
		showTreeWindow.document.attachEvent("onmousemove", _dt_itemMouseMove);
		showTreeWindow.document.attachEvent("onmouseup", _dt_itemMouseUp);
		showTreeWindow.document.attachEvent("onmouseover", _dt_itemMouseOver);
		showTreeWindow.document.attachEvent("onmouseout", _dt_itemMouseOut);
		showTreeWindow.document.attachEvent("onselectstart", _dt_itemSelectStart);
	//	showTreeWindow.document.oncontextmenu=Function("return false;");
	}
}

//----------------------------------------------------------------------------
// This function displays each item in the given menu or submenu.
//----------------------------------------------------------------------------

function treeMenuListItems(menu) {

	var i;
	if(menu==null || menu.items==null)
		return;
	for (i = 0; i < menu.items.length; i++)
		treeMenuDisplayItem(menu.items[i]);
}

//----------------------------------------------------------------------------
// This displays a single menu or submenu item.
//----------------------------------------------------------------------------

function doFirstSelect(item){
}

function getTypeIcon(item){
	if(item.typeName == null)
		return;
	
	return treeMenuTypeIcons[item.typeName];
}

function getItemImage(item){
	var img = getTypeIcon(item);
	if(img != null)
		return img;
	
	if (item.icon != "")
		img = item.icon;
	else if (item.url.indexOf("http://") == 0)
		img = "menu_link_external.gif";
	else if(item.index == treeMenuSelected)
		img = "menu_link_sleaf.gif";
	else if(item.submenu == null)
		img = "menu_link_leaf.gif";
	else
		img = "menu_link_local.gif";
	return img;
}

function getMenuItemTr(item){
	var bars, cmd, cmd2, expanded, i, img, alt, link, more, submenu, haschild;
	var trHead = "";
	var trTail = "";
	var trHtml = "";

	if (item.index == treeMenuSelected)
		treeMenuSelectedFound = true;
	if (!treeMenuSelectedFound)
		treeMenuScrollY += 18;

	var pitem = item.parentMenu.parentItem;

	if (treeMenuExpand.getExpandSelect(item.index) == 1)
		expanded = true;
	else
		expanded = false;

	if (item.testChild())
		submenu = true;
	else
		submenu = false;
		
	if (item.url != "")
		link = true;
	else
		link = false;
	cmd = "return topWindow.treeMenuClick(" + item.index + ", " + link + ", " + submenu + ", '" + item.sid + "',this);";
	if(treeMenuOnClick)
		cmd2= cmd;
	else
		cmd2 = "return topWindow.treeMenuTextClick(" + item.index + ", " + link + ", " + submenu + ", '" + item.sid + "',this);";
	var dblcmd = "return topWindow.treeMenuTextDblClick(" + item.index + ", " + link + ", " + submenu + ", '" + item.sid + "',this);";

	trHead = '<tr valign=top id='+ item.index + '><td nowrap>';

	bars = new Array(); 
	var pItem = item.parentMenu.parentItem;
	var barStr = "";
	for(i=0;i<parseInt(getItemLevel(item))-1;i++){
		if(pItem.last == true)
			barStr = '<img src="' + treeMenuImgDir + 'menu_spacer.gif" align=left border=0 vspace=0 hspace=0>' + barStr;
		else
			barStr = '<img src="' + treeMenuImgDir + 'menu_bar.gif" align=left border=0 vspace=0 hspace=0>' + barStr;
		pItem = pItem.parentMenu.parentItem;
	}
	trHtml += barStr;

	more = false;
	if (item.submenu)
		for (i = 0; i < item.submenu.items.length; i++)
			if (item.submenu.items[i].submenu != null)
				more = true;

	/*
	if (!more) {
		if(item.last == true)
			img = "menu_corner.gif";
		else
			img = "menu_tee.gif";
		trHtml += '<img src="' + treeMenuImgDir + img + '" align=left border=0 vspace=0 hspace=0>';
	}


	if (more) {
		if (expanded) {
			if(item.last == true){
				img = "menu_corner_minus.gif";
				bars[bars.length] = false;
			}
			else {
				img = "menu_tee_minus.gif";
				bars[bars.length] = true;
			}
		}
		else {
			if (item.last == true) {
				img = "menu_corner_plus.gif";
				bars[bars.length] = false;
			}
			else {
				img = "menu_tee_plus.gif";
				bars[bars.length] = true;
			}
		}
		trHtml += '<img src="' + treeMenuImgDir + img + '" align=left border=0 vspace=0 hspace=0>';
	}
	*/


	if (item.testChild() == false || treeMenuShowPlus == false) {
		if(item.last == true)
			img = "menu_corner.gif";
		else
			img = "menu_tee.gif";
		trHtml += '<img src="' + treeMenuImgDir + img + '" align=left border=0 vspace=0 hspace=0>';
	} else {
		if (expanded) {
			if(item.last == true){
				img = "menu_corner_minus.gif";
				bars[bars.length] = false;
			}
			else {
				img = "menu_tee_minus.gif";
				bars[bars.length] = true;
			}
		}
		else {
			if (item.last == true) {
				img = "menu_corner_plus.gif";
				bars[bars.length] = false;
			}
			else {
				img = "menu_tee_plus.gif";
				bars[bars.length] = true;
			}
		}
		trHtml += '<a href="javascript:" onclick="' + cmd + '">';
		trHtml += '<img id="plus-icon-' + item.index + '" src="' + treeMenuImgDir + img + '" align=left border=0 vspace=0 hspace=0>';
		trHtml += '</a>';
	}

	trHtml += '<a id=tree-menu-'+ item.index + ' href="javascript:" onclick="' + cmd + '">';
	img = getTypeIcon(item);
	if(img == null){
		if(item.testChild() == true){
			if (expanded)
				img = "menu_folder_open.gif";
			else
				img = "menu_folder_closed.gif";		
		}else
			img = getItemImage(item);
	}

	if (treeMenuAltText)
		alt = ' alt="' + item.text + '"';
	else
		alt = '';
	trHtml += '<img id=icon'+ item.index + ' src="' + treeMenuImgDir + img + '"' + alt + ' align=left border=0 vspace=0 hspace=0></a>';

	if (item.url != "")
		trHtml += '<a unselectable="on" id=tree-text-'+ item.index + ' href="' + item.url + '" title="' + item.text + '" target="' + item.target + '" onclick="' + cmd2 + '">';
	else
		trHtml += '<a unselectable="on" id=tree-text-'+ item.index + ' href="#" title="' + item.text + '" onclick="' + cmd2 + '">';

	if (item.index == treeMenuSelected){
		trHtml += '<span style="FONT-SIZE:' 
			+ treeMenuFontSize +'; FONT-FAMILY:' 
			+ treeMenuFont + '">&nbsp;<span ondblclick="' 
			+ dblcmd + '" id=name'
			+ item.index + ' class="selected">' 
			+ item.text + '</span></span>';
		/* 		被选中时调用点击相同的行为	*/
	}else
		trHtml += '<span style="FONT-SIZE:' 
			+ treeMenuFontSize +'; FONT-FAMILY:' 
			+ treeMenuFont + '">&nbsp;<span ondblclick="' 
			+ dblcmd + '" id=name'
			+ item.index + ' class="unselected">' 
			+ item.text + '</span></span>';
	trHtml += '</a></td>';
	
	if(doXmlLoader == true && xmlLoaderAction!=""){
		var a = xp_getXmlArray(xmlLoaderAction + "?sid=" + item.sid);
		for(var i = 0; i<a.length; i++){
			trHtml += '<td nowrap align="' + (xmlTableTitleAlign[i]!=null?xmlTableTitleAlign[i]:"left") + '">' + a[i][0] + '</td>'; 
		}
	}
	trTail = '</tr>';
	
	treeMenuBars = bars;
	
	return trHead + trHtml + trTail;
}

function _dt_getElementById(eid){
	return showTreeWindow.document.getElementById(eid);
}

function _dt_getTbody(){
	return _dt_getElementById("dymic-tree-table").tBodies[0];
}

function treeMenuDisplayItem(item) {
	
	var obj;
	
	if(treeMenuDisplayItem.table == null){
		treeMenuDisplayItem.table = _dt_getElementById("dymic-tree-table");
		treeMenuDisplayItem.tbody = treeMenuDisplayItem.table.tBodies[0];
	}
	
	if (item.index == treeMenuSelected)
		treeMenuSelectedFound = true;
	if (!treeMenuSelectedFound)
		treeMenuScrollY += 18;

	if (item.index == treeMenuSelected){
		currentItem = item;
		treeMenuCookie.setCookie(treeMenuName + "-selected", treeMenuSelected);
		treeMenuCookie.setCookie(treeMenuName + "-sid", item.sid);
		treeMenuCookie.setCookie(treeMenuName + "-sub", item.submenu);
		treeMenuCookie.store();
		// 被选中时调用点击相同的行为
		doFirstSelect(item);
	}
	if(item.nodeCreated == false){
		obj = _dt_createItemTR(item);
		treeMenuDisplayItem.tbody.appendChild(obj);
	//	treeMenuDocument.writeln(getMenuItemTr(item));
		item.nodeCreated = true;
	}
	
	if (treeMenuExpand.getExpandSelect(item.index) == 1){
		// 加载子节点，如果节点没有加载的话！
		var trObj = showTreeWindow.document.getElementById(item.index);
		if(item.hasChild == true && item.itemCreated == false){
			createChildItem(item);
			item.itemCreated = true;
		}
		if(item.childCreated == false)
			if(item.submenu != null){
				item.childCreated = true;
				appendChild(item,trObj);
			}
		expanded = true;
	}else
		expanded = false;

	if (item.submenu && expanded) {
		item.childCreated = true;
		treeMenuDepth++;
		treeMenuListItems(item.submenu);
		treeMenuDepth--;
	}
}

//----------------------------------------------------------------------------
// This function handles a click on a menu item.
//----------------------------------------------------------------------------

/*  changeStyle: 判断item当前是开启还是关闭,返回状态值:0:hide; 1:show;	*/
/* istext: 点击的是文字部分 */
function changeStyle(item, istext){
	var ret = -1;
	
	/* 更改选择行CSS style	*/
	var iname= showTreeWindow.document.getElementById("name" + item.index);
	iname.className = "selected";
	if(showTreeWindow.document.getElementById("tree-root-text")!=null)
		showTreeWindow.document.getElementById("tree-root-text").className = "root";	// 清除root的选择状态
	if(previousItem != null){
		if(previousItem != item)
			showTreeWindow.document.getElementById("name" + previousItem.index).className = "unselected";
		if(previousItem.testChild() == false)
			showTreeWindow.document.getElementById("icon" + previousItem.index).src = treeMenuImgDir + getItemImage(previousItem);
	}
	previousItem = item;	
	
	/*  更改 当前行图标	*/
	var img = showTreeWindow.document.getElementById("icon" + item.index);
	if(item.testChild() == false){
		img.src = treeMenuImgDir + getItemImage(item);
		return -1;		/*  如果是叶子节点则返回		*/
	}
	if(istext!=null && istext==true)	return;	
	var re = /menu_folder_open\.gif/;
	if(re.test(img.src)){
		img.src = treeMenuImgDir + "menu_folder_closed.gif";
		ret = 0;
	}else{
		re = /menu_folder_closed\.gif/;
		if(re.test(img.src)){
			img.src = treeMenuImgDir + "menu_folder_open.gif";
			ret = 1;
		}
	}
	if(treeMenuShowPlus == true)
		changeItemPlusImg(item, ret);
	return isItemMenuOpen(item);
}

function changeItemPlusImg(item, flag){
	var img = showTreeWindow.document.getElementById("plus-icon-" + item.index);
	var re = /menu_([^_]*)_plus\.gif/;
	var re2 = /menu_([^_]*)_minus\.gif/;
	var ret = img.src.match(re);
	if(ret != null){
		img.src = treeMenuImgDir + "menu_" + ret[1] + "_minus.gif";
		return;
	}
	ret = img.src.match(re2);
	if(ret != null){
		img.src = treeMenuImgDir + "menu_" + ret[1] + "_plus.gif";
		return;
	}
}

function isItemMenuOpen(item){
	
	return(treeMenuExpand.getExpandSelect(item.sid));
	
	var ret = _dt_getItemTRObjs(item);
	if(ret[1][1].style.display == null || ret[1][1].style.display == "")
		return 0;
	else
		return 1;
}

function getTrObject(obj){
	var pobj = obj;
	while(pobj != null){
		if(pobj.tagName == "TR")
			return pobj;
		pobj = pobj.parentNode;
	}
	return null;
}

function _dt_createItemTR(item){
	var obj = treeMenuDocument.createElement("div");
	obj.innerHTML = "<table>" + getMenuItemTr(item) + "</table>";
	
	var ret = obj.childNodes[0].childNodes[0].childNodes[0];
	return ret;
}

function appendChild(item,obj){
	var sms = item.submenu.items;
	var trObj = getTrObject(obj);
	
	for(var i=0;i<sms.length;i++){
		var node = _dt_createItemTR(sms[i]);
		sms[i].nodeCreated = true;
		trObj.parentNode.insertBefore(node,trObj.nextSibling);
		trObj = node;
	}	
}

function checkParentShow(item){
	var p=item;
	if(p==null || p.parentMenu == null)
		return true;
	p = p.parentMenu.parentItem;
	var re = /menu_folder_closed\.gif/;

	if(p != null && treeMenuExpand.getExpandSelect(p.index) == 0){
		return false;
	}
	
	while(p != null){
		var n = showTreeWindow.document.getElementById(p.index);
		if(re.test(n.innerHTML) == true)
			return false;
		p = p.parentMenu.parentItem;
	}
	return true;	
}
	
function showHideMenu(item,flag){
	/* 0:hide; 1:show; */
	if(item.submenu){
		if(checkParentShow(item) && treeMenuExpand.getExpandSelect(item.index)==1 && item.childCreated == false){
			var obj = showTreeWindow.document.getElementById(item.index);
			item.childCreated = true;
			appendChild(item,obj);
		}
		var sm = item.submenu.items;
		for(var i=0;i<sm.length;i++){
			if(sm[i].submenu)
				showHideMenu(sm[i],flag);
			var obj = showTreeWindow.document.getElementById(sm[i].index);
			if(obj == null)
				continue;
			if(flag==0){
				obj.style.display = 'none';
			}
			if(flag==1 && checkParentShow(sm[i])){
				obj.style.display = '';
			}
		}
	}
}

function getChildItems(url){
	var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
	xmlDoc.async = "false";
	xmlDoc.load(url);
	if(xmlDoc == null)
		return null;
	var xmlObj = xmlDoc.documentElement;
	if(xmlObj == null)
		return null;
		
	if(!xmlObj.hasChildNodes())
		return;
		
	var result = new Array();	
	for(var i=0; i<xmlObj.childNodes.length; i++){
		var obj = new Object();
		var childs = xmlObj.childNodes(i).childNodes;
		if(childs == null)
			next;
		for(var j=0; j<childs.length; j++){
		//	alert(childs[j].tagName + ":" + childs[j].text);
			obj[childs[j].tagName] = childs[j].text;
		}
		result[result.length] = obj;
	}
	return result;
}

function createTreeMenuByAction(sid,typename){
	if(dynamicLoaderAction == "")
		return;
	var url = dynamicLoaderAction + "?sid=" + sid + "&typeName=" + typename;
	var tm = new TreeMenu();
	var its = new Array();
	var nodes = getChildItems(url); 
	if(nodes != null && nodes.length > 0)
		for(var i=0; i<nodes.length; i++)
			its[its.length] = new TreeMenuItem(nodes[i].name, nodes[i].sid,1,"","",null,nodes[i].hasChild,nodes[i].typeName);
	for(i=0;i<its.length;i++){
		tm.addItem(its[i]);
	}
	return tm;	
}

function createChildItem(item){
	var ntm = createTreeMenuByAction(item.sid, item.typeName);
	item.makeSubmenu(ntm);
}

function treeMenuClick(n, link, submenu, sid, obj) {

	var date, cookie;
	var ret = link; 
	
	if (!treeMenuExpand)
		treeMenuDisplay();

	if (submenu){
		treeMenuExpand.changeExpandSelect(n);
	}

	treeMenuSelected = n;
	cookie = treeMenuExpand.toString();
	treeMenuCookie.setCookie(treeMenuName, cookie);
	treeMenuCookie.setCookie(treeMenuName + "-selected", treeMenuSelected);
	treeMenuCookie.setCookie(treeMenuName + "-sid", sid);
	treeMenuCookie.setCookie(treeMenuName + "-sub", submenu);
	treeMenuCookie.store();
	
	/* 显示或者关闭子菜单 */
	var item = findItemByIndex(treeMenu, n);
//	alert(item.hasChild + "," + (item.itemCreated==false));
	if(item){
		if(item.hasChild == true && item.itemCreated == false){
			createChildItem(item);
			item.itemCreated = true;
		}
		if(item.childCreated == false)
			if(item.submenu != null){
				item.childCreated = true;
				appendChild(item,obj);
			}
		showHideMenu(item,changeStyle(item));
		currentItem = item;
	}
	
	/*	需要重载，定义点击item之后的行为：参数为treeItem对象	*/
	/*
	if(item != null){
		var r = doMenuTextClick(item);
		if(r != null)
			ret = r;
	} 
	*/ 
	return ret;
}

//----------------------------------------------------------------------------
// 菜单某项文字被点击时，仅仅更改相应的cookie
//----------------------------------------------------------------------------
function doMenuTextClick(item){
	return true;
}

function doMenuTextDblClick(item){
	return true;
}

function treeMenuTextClick(n, link, submenu, sid, obj) {
	var date, cookie;
	var ret = link;

	treeMenuSelected = n;
	cookie = treeMenuExpand.toString();
	treeMenuCookie.setCookie(treeMenuName, cookie);
	treeMenuCookie.setCookie(treeMenuName + "-selected", treeMenuSelected);
	treeMenuCookie.setCookie(treeMenuName + "-sid", sid);
	treeMenuCookie.setCookie(treeMenuName + "-sub", submenu);
	treeMenuCookie.store();

	/* 显示或者关闭子菜单 */
	var item = findItemByIndex(treeMenu, n);
	if(item){
		currentItem = item;
		changeStyle(item,true);
	}
		
	/*	需要重载，定义点击item之后的行为：参数为treeItem对象	*/
	if(item != null){
		var r = doMenuTextClick(item);
		if(r != null)
			ret = r;
	}
	
	if(link == "")
		return false;

	return ret;
}

function treeMenuTextDblClick(n, link, submenu, sid, obj) {
	var item = getItemByIndex(n);
	return doMenuTextDblClick(item);
}

//----------------------------------------------------------------------------
// This function handles a click on the menu root.
//----------------------------------------------------------------------------

function doMenuRootClick(){
}

function deleteAllCookie(){
	treeMenuCookie.deleteCookie(treeMenuName);
	treeMenuCookie.deleteCookie(treeMenuName + "-selected");
	treeMenuCookie.deleteCookie(treeMenuName + "-sid");
	treeMenuCookie.deleteCookie(treeMenuName + "-sub");	
	treeMenuCookie.store();
}

function doMenuRootClearClick(){
}

function clearTreeMenuClick(){
	// Clear the menu state.
	treeMenuExpand.clean();
	treeMenuSelected = null;
	currentItem = null;

	// Delete cookies.
	deleteAllCookie();
	doMenuRootClearClick();
	// Set up redraw the menu frame.
   // setTimeout("showTreeWindow.location=showTreeWindow.location.pathname", 10);
	setTimeout("window.location=window.location.pathname", 10);
	return false;
}

function treeMenuClickRoot() {
	treeMenuSelected = null;
	if(previousItem != null){
		showTreeWindow.document.getElementById("name" + previousItem.index).className = "unselected";
		var img = showTreeWindow.document.getElementById("icon" + previousItem.index);
		if(/menu_link_sleaf/.test(img.src) == true)
			img.src = treeMenuImgDir + "menu_link_leaf.gif";
		previousItem = null;
		currentItem = null;
		treeMenuCookie.deleteCookie(treeMenuName + "-selected");
		treeMenuCookie.deleteCookie(treeMenuName + "-sid");
		treeMenuCookie.deleteCookie(treeMenuName + "-sub");	
		treeMenuCookie.store();		
	}
	showTreeWindow.document.getElementById("tree-root-text").className = "selroot";	//  设置root的选择状态
	//设置ROOT选中标志
	treeMenuRootSelected = true;
	doMenuRootClick();
}

//----------------------------------------------------------------------------
// This function scrolls the window to ensure the selected item is in view.
// It should only be called after the page has loaded.
//
// Note: This code is browser-dependent. Scrolling may be ignored for older
// browsers.
//----------------------------------------------------------------------------

function treeMenuScroll() {
	if(currentItem == null)
		return;
	var trObj = showTreeWindow.document.getElementById(currentItem.index);	
	if(trObj == null)
		return;
	trObj.scrollIntoView(false);
}

//----------------------------------------------------------------------------
// keliro add function
//----------------------------------------------------------------------------
var findItem = null;

// 根据提供的sid设定展开树所需要的cookie
function setItemCookie(keepOld){
	var date, cookie;
	if(keepOld == false){
		treeMenuExpand.clean();
	}else{
		cookie = treeMenuCookie.getCookie(treeMenuName);
		if(cookie)
			treeMenuExpand.loadCookie(cookie);
	}
	if(findItem){
		var pitem = findItem.parentMenu.parentItem;
		while(pitem){
			treeMenuExpand.setExpandSelect(pitem.index);
			pitem = pitem.parentMenu.parentItem;
		}
	}
	cookie = treeMenuExpand.toString();
	if(keepOld != true)
		deleteAllCookie();
	treeMenuCookie.setCookie(treeMenuName, cookie);
	if(findItem){
		treeMenuCookie.setCookie(treeMenuName + "-selected", findItem.index);
		treeMenuCookie.setCookie(treeMenuName + "-sid", findItem.sid);
		treeMenuCookie.setCookie(treeMenuName + "-sub", findItem.submenu);
	}
	treeMenuCookie.store();
}

function setFindItemTreeCookie(sid, keepOld){
	
	if(keepOld == null)
		keepOld = false;
	
	findItem = null;
	findItemBySid(treeMenu, sid);
	setItemCookie(keepOld);
}

function getNameOfIndex(ind){
	findItem = null;
	findItemByIndex(treeMenu,ind);
	if(findItem){
		var name=findItem.text;
		var pitem = findItem.parentMenu.parentItem;
		while(pitem){
			name = pitem.text + "->" + name;
			pitem = pitem.parentMenu.parentItem;
		}
		return name;
	}else
		return "";
}

function getNameOfSid(sid){
	findItem = null;
	findItemBySid(treeMenu,sid);
	if(findItem){
		var name=findItem.text;
		var pitem = findItem.parentMenu.parentItem;
		while(pitem){
			name = pitem.text + "->" + name;
			pitem = pitem.parentMenu.parentItem;
		}
		return name;
	}else
		return "";
}

function findItemBySid(menu, sid) {
	var i;
	
	if(menu == null || menu.items == null)
		return null;	
	
	for (i = 0; i < menu.items.length; i++) {
		var item = menu.items[i];
		if(item.sid == sid){
			findItem = item;
			return item;
		}
		if(item.submenu){
			findItem = findItemBySid(item.submenu, sid);
			if(findItem != null)
				return findItem;
		}
	}
	return null;
}

function getItemBySid(sid){
	return treeMenuExpand.getExpandItem(sid);
//	return findItemBySid(treeMenu, sid);
}

function findItemByIndex(menu, ind) {
	var i;
	if(menu == null || menu.items == null)
		return null;
	for (i = 0; i < menu.items.length; i++) {
		var item = menu.items[i];
		if(item.index == ind){
			findItem = item;
			return item;
		}
		if(item.submenu){
			findItem = findItemByIndex(item.submenu, ind);
			if(findItem != null)
				return findItem;
		}
	}
	return null;
}

function getItemByIndex(ind){
	return treeMenuExpand.getExpandItem(ind);
//	return findItemByIndex(treeMenu, ind);
}

function setDeleteItemTreeCooke(){
	var selected = parseInt(treeMenuCookie.getCookie(treeMenuName+"-selected"));
	var item;
	selected --;

	if(selected < 0)
		selected = 0;
	findItem = null;
	findItemByIndex(treeMenu, selected);
	if(findItem){
		setItemCookie(true);
	}else
		deleteAllCookie();		
}

function selectedItemIsLeaf(){
	if(treeMenuSelected == -1)
		return false;
	var item = findItemByIndex(treeMenu, treeMenuSelected);
	if(item.submenu == null)
		return true;
	
	return false;
}

function isLeafItem(item){
	return !item.testChild();
	if(item.hasChild == false)
		return true;
	
	return false;	
}

function isLeafItemBySid(sid){
	var item = findItemBySid(treeMenu, sid);
	if(item == null)
		return false;
	return isLeafItem(item);
}

function isLeafItemByIndex(index){
	var item = findItemByIndex(treeMenu, index);
	if(item == null)
		return false;
	return isLeafItem(item);
}

function getCurrentItem(){
	if(currentItem != null)
		return currentItem;
	if(treeMenuSelected != null && treeMenuSelected != -1)
		return findItemByIndex(treeMenu, findItemByIndex);
	return null;
}

function getSelectedItem(){
	var item = getCurrentItem();
	if(item != null)
		return item;
	if(treeMenuRootSelected == true)
		return treeMenuRootItem;
}

function getItemLevel(item){
	var p = item;
	var i = 0;
	while(p != null){
		i++;
		p = p.parentMenu.parentItem;
	}
	return i;
}

function isRootSelected(){
	var item = getCurrentItem();
	if(item != null)
		return false;
	return treeMenuRootSelected;
}

//----------------------------------------------------------------------------
// 显示首页
//----------------------------------------------------------------------------
function findFrame(name){
	for(i=0; i<parent.frames.length; i++)
		if(parent.frames[i].name == name)
			return parent.frames[i];
}
function showStartPage(){
	var sid = treeMenuCookie.getCookie(treeMenuName+"-sid");
	if(sid != ""){
		findItemBySid(treeMenu,sid);
		if(findItem){
			var fw = findFrame(findItem.target);
			if(fw){
				if(fw.location.pathname == "/beef/blank/blank.jsp")
					fw.location = findItem.url;
			}
		}
	}
}

function loadItemBySelectedId(url, sid, keepold){
	treeMenuSelectFirst = false;
	var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
	xmlDoc.async = "false";
	xmlDoc.load(url + "?sid=" + sid);
	if(xmlDoc == null)
		return null;
	var xmlObj = xmlDoc.documentElement;
	if(xmlObj == null)
		return null;
		
	if(!xmlObj.hasChildNodes())
		return;
		
	var sids = xmlObj.childNodes(0).getAttribute("value");
	
	if(sids == null || sids == "")
		return;
	showItemLink = sids.split(",");
	
	for(var i=0; i<showItemLink.length-1; i++){
		var item = getItemBySid(showItemLink[i]);
		if(item == null)
			return;
		if(item.itemCreated == false){
			createChildItem(item);
			item.itemCreated = true;
		}
	}
	setFindItemTreeCookie(sid, keepold);	
}

/****************************************************************
*                                                               *
*    TreeExpand:定义Tree保存状态数据                            *
*                                                               *
*****************************************************************/
//构造函数
function TreeExpand(){
	this.data = new Object();
}

TreeExpand.prototype.addExpand = function(sid, item, selected){
	var obj = this.data[sid];
	if(obj == null){
		obj = new Object();
		this.data[sid] = obj;
	}
	if(selected == 0 || selected == 1)
		obj.selected = selected;
	else
		selected = 0;
	
	if(obj.selected == null)
		obj.selected = 0;

	obj.item = item;		
	return obj;
}
TreeExpand.prototype.getExpand = function(sid){
	return this.data[sid];
}
TreeExpand.prototype.getExpandItem = function(sid){
	return this.data[sid].item;
}
TreeExpand.prototype.getAllExpand = function(){
	var a = new Array();
	for (var name in this.data){
		a[a.length] = name;
	}
	return a;
}
TreeExpand.prototype.deleteExpand = function(sid){
	delete this.data[sid];
}
TreeExpand.prototype.setExpandSelect = function(sid, selected){
	var expand = this.data[sid];
	setExpandSelect(expand, selected);
}
TreeExpand.prototype.getExpandSelect = function(sid){
	return this.data[sid].selected;
}
TreeExpand.prototype.changeExpandSelect = function(sid){
	this.data[sid].selected = 1 - this.data[sid].selected;
}
TreeExpand.prototype.toString = function(){
	var str = "";
	for(var sid in this.data){
		if(str != "")
			str += ",";
		str += sid + ":" + this.data[sid].selected;
	}
	return str;
}
TreeExpand.prototype.clean = function(){
	for (var sid in this.data){
		this.data[sid].selected = 0;
	}	
}
TreeExpand.prototype.loadCookie = function(cookie){
	var es = cookie.split(",");
	if(es != null)
		for(var i=0; i<es.length; i++){
			var kv = es[i].split(":");
			if(this.data[parseInt(kv[0])] != null)
				this.data[parseInt(kv[0])].selected = parseInt(kv[1]);
			else
				this.addExpand(parseInt(kv[0]), null, parseInt(kv[1]));
		}
}
//非方法的其它相关函数
function setExpandSelect(expand, selected){
	expand.selected = selected;
}
function getExpandSelected(expand){
	return expand.selected;
}

/***********************************************
*                                              *
*            动态生成节点                       *
*                                              *
************************************************/

function getTRObjBySid(sid){
	return showTreeWindow.document.getElementById(sid);
}

function getRootTRObj(){
	return showTreeWindow.document.getElementById("tree-root");
}

function getTRObjByItem(item){
	return getTRObjBySid(item.sid);
}

function getMenuObjByItem(item){
	return showTreeWindow.document.getElementById("tree-menu-" + item.sid);
}

function getTextObjByItem(item){
	return showTreeWindow.document.getElementById("tree-text-" + item.sid);
}

function changeTRObj(item){
		var obj = getTRObjByItem(item);
		var nobj = _dt_createItemTR(item);
	//	obj.parentNode.replaceChild(nobj, obj);
		obj.childNodes[0].innerHTML = nobj.childNodes[0].innerHTML;
		return obj;
}

function clickItemMenuBySid(sid){
	clickItemMenu(getItemByIndex(sid));
}

function clickItemMenu(item){
	var obj = getMenuObjByItem(item);
	obj.click();
}

function clickItemTextBySid(sid){
	clickItemText(getItemByIndex(sid));
}

function clickItemText(item){
	var obj = getTextObjByItem(item);
	obj.click();
}

function addCongenerItem(citem, text, sid, level , url, target, icon, haschild, typename){
	var m, mi;
	var item = new TreeMenuItem(text, sid, level , url, target, icon, haschild, typename);
	var pmenu = citem.parentMenu;
	pmenu.insertItem(citem, item);
	var obj = _dt_createItemTR(item);
	var cobj = getTRObjByItem(citem);
	for(m=cobj; m!=null; m=m.nextSibling){
		mi = getItemBySid(m.id);
		if(m.id != cobj.id && mi.getLevel() <= citem.getLevel())
			break;
		if(pmenu.lastChanged == true)
			changeTRObj(mi);
	}
	cobj.parentNode.insertBefore(obj, m);
	
	clickItemMenu(item);
		
	pmenu.lastChanged = false;
}

function addSubItem(citem, text, sid, level , url, target, icon, haschild, typename){
	var menu;
	var cobj;
	var item = new TreeMenuItem(text, sid, level , url, target, icon, haschild, typename);
	if(citem == null){
		cobj = getRootTRObj();
		menu = treeMenu;
	}else{
		cobj = getTRObjByItem(citem);
		menu = citem.submenu;
		if(menu == null){
			menu = new TreeMenu();
			citem.makeSubmenu(menu);
		}else{
			if(treeMenuExpand.getExpandSelect(citem.index) == 0){
				clickItemMenu(citem);
			}
		}
	}	
	
	menu.insertItem(null, item);

	var obj = _dt_createItemTR(item);
	
	if(cobj.nextSibling != null)
		cobj.parentNode.insertBefore(obj, cobj.nextSibling);
	else
		cobj.parentNode.appendChild(obj);
	
	if(citem!=null && menu.leafChanged){
		treeMenuExpand.setExpandSelect(citem.index,1);
		menu.parentItem.childCreated = true;
		changeTRObj(citem);
	}
	menu.leafChanged = false;
	
	clickItemMenu(item);
}

function addItemToMenuLast(dstitem, text, sid, level , url, target, icon, haschild, typename){
	if(dstitem != null){
		if(dstitem.testChild() == false)
			addSubItem(dstitem, text, sid, level , url, target, icon, haschild, typename);
		else{
			var notExpand = dstitem.submenu;
			if(treeMenuExpand.getExpandSelect(dstitem.index) == 0)
				clickItemMenu(dstitem);
			if(notExpand != null)
				addCongenerItem(dstitem.submenu.items[dstitem.submenu.items.length-1], text, sid, level , url, target, icon, haschild, typename);
			else
				clickItemTextBySid(sid);
		}
		
	}else{
		if(treeMenu.items.length <= 0)
			addSubItem(null, text, sid, level , url, target, icon, haschild, typename);
		else
			addCongenerItem(treeMenu.items[treeMenu.items.length-1], text, sid, level , url, target, icon, haschild, typename);
	}
}

function changeItemText(item, text){
	item.text = text;
	changeTRObj(item);
} 

function deleteItem(item){
	if (item == null)
	    item = getCurrentItem();

	var m, m2, mi;
	var pmenu = item.parentMenu;
	var pitem = pmenu.parentItem;
	var obj = getTRObjByItem(item); 
	for(m=obj; m!=null;){
		mi = getItemBySid(m.id);
		if(m.id != obj.id && mi.getLevel() <= item.getLevel())
			break;
		treeMenuExpand.deleteExpand(m.id);
		m2 = m;
		m = m.nextSibling;
		m2.parentNode.removeChild(m2);
	}
	pmenu.deleteItem(item);
	previousItem = null;
	currentItem = null;
	if(pitem != null)
		if(pitem.menuDeleted == true){
			changeTRObj(pitem);
			pitem.menuDeleted = false;
		}

	if(pmenu.newLastItem != null){
		obj = getTRObjByItem(pmenu.newLastItem);
		for(m=obj; m!=null; m=m.nextSibling){
			mi = getItemBySid(m.id);
			if(m.id != obj.id && mi.getLevel() <= item.getLevel())
				break;
			changeTRObj(mi);
		}
		pmenu.newLastItem = null;
	}
		
	if(pmenu.items.length != 0 && item.last == true){
		mi = pmenu.items[pmenu.items.length-1];
		changeTRObj(mi);
	}
}

/**************************************
*                                     *
*   item move action                  *
*                                     *
***************************************/
function _dt_getItemTRObjs(item){
	var m, mi;
	var ret = new Array();
	var obj = getTRObjByItem(item);
	for(m=obj; m!=null; m=m.nextSibling){
		mi = getItemBySid(m.id);
		if(m.id != obj.id && mi.getLevel() <= item.getLevel())
			break;
		ret[ret.length] = [mi, m];
	}
	return ret;
}

function _dt_isChildItem(citem, pitem){
	var item = citem;
	while(item != null){
		if(pitem == item)
			return true;
		item = item.parentMenu.parentItem;
	}
	return false;
}

function _tmMoveItemAction(srcitem, desitem){
	return true;
	/*
	var actionUri = _treeMenuMoveAction 
		+ "?srcId=" + srcitem.sid 
		+ "&srcClassType=" + srcitem.typeName
		+ "&desId=" + desitem.sid
		+ "&desClassType=" + desitem.typeName;
//	debugMsg(actionUri);
	var ret = xp_loadAction(actionUri);
	if(ret.isSuccess() == false){
		alert(ret.getMessage());
		return false;
	}
	return true;
	*/
}

function dtMoveItem(srcitem, desitem){
	var m,obj,objs,objs2;
	
	
	if(_dt_isChildItem(desitem,srcitem) == true)
		return;

	var ret = _tmMoveItemAction(srcitem, desitem);
	if(ret == false){
		_dt_itemMouseDown.moveObject = null;
		return;
	}

	objs = _dt_getItemTRObjs(srcitem);
	objs2 = _dt_getItemTRObjs(desitem);

	var tbody = _dt_getTbody();	
	for(var i=objs.length-1; i>=0; i--)
		tbody.insertBefore(objs[i][1], objs2[objs2.length-1][1].nextSibling);
		
	var pmenu = srcitem.parentMenu;
	var pitem = pmenu.parentItem;
	pmenu.deleteItem(srcitem);
	desitem.parentMenu.insertItem(desitem, srcitem);
	
	for(var i=0; i<objs.length; i++)
		changeTRObj(objs[i][0]);
	if(desitem.parentMenu.lastChanged == true){
		objs = _dt_getItemTRObjs(desitem);
		for(var i=0; i<objs.length; i++)
			changeTRObj(objs[i][0]);
		desitem.parentMenu.lastChanged = false;
	}
	if(pitem != null)
		if(pitem.menuDeleted == true){
			changeTRObj(pitem);
			pitem.menuDeleted = false;
		}
	if(pmenu.newLastItem != null){
		objs = _dt_getItemTRObjs(pmenu.newLastItem);
		for(var i=0; i<objs.length; i++)
			changeTRObj(objs[i][0]);
		pmenu.newLastItem = null;
	}
}

function dtMoveItemToSub(sitem, ditem){
	var m,obj,obj2,objs,menu,created;

	if(ditem == null){
		menu = treeMenu;
	}else{
		if(_dt_isChildItem(ditem,sitem) == true)
			return;		
		menu = ditem.submenu;
		if(menu == null){
			menu = new TreeMenu();
			ditem.makeSubmenu(menu);
			created = true;
		}else{
			if(treeMenuExpand.getExpandSelect(ditem.index) == 0){
				clickItemMenu(ditem);
			}
		}
	}
	
	objs = _dt_getItemTRObjs(sitem);
	if(ditem != null)
		obj2 = _dt_getElementById(ditem.sid);
	else
		obj2 = _dt_getElementById("tree-root");

	var tbody = _dt_getTbody();	
	for(var i=objs.length-1; i>=0; i--)
		tbody.insertBefore(objs[i][1], obj2.nextSibling);
		
	var pmenu = sitem.parentMenu;
	var pitem = pmenu.parentItem;
	pmenu.deleteItem(sitem);
	menu.insertItem(null, sitem);

	if(created == true){
		treeMenuExpand.setExpandSelect(ditem.index,1);
		ditem.childCreated = true;
		changeTRObj(ditem);
	}

	for(var i=0; i<objs.length; i++)
		changeTRObj(objs[i][0]);
	if(pitem != null)
		if(pitem.menuDeleted == true){
			changeTRObj(pitem);
			pitem.menuDeleted = false;
		}
		
	if(pmenu.newLastItem != null){
		objs = _dt_getItemTRObjs(pmenu.newLastItem);
		for(var i=0; i<objs.length; i++)
			changeTRObj(objs[i][0]);
		pmenu.newLastItem = null;
	}
}
function _dt_createMoveDIV(obj){
	var d = showTreeWindow.document.createElement("DIV");
	d.innerHTML = '<div style="white-space:nowrap;background:blue;color:white;border:2px solid gray;white-font-size:9pt;position:absolute;top:0px;0px;display:none;cursor:pointer;">'
		+obj.innerText
		+ '</div>';
	d = d.childNodes[0];
	showTreeWindow.document.body.appendChild(d);
	return d;
}
function _dt_itemMouseDown(){
	var e = showTreeWindow.event;
	if(e.button != 1)
		return;
	var re = /^name/;
	var obj = showTreeWindow.event.srcElement;
	if(obj.tagName != "SPAN")
		return;
	if(re.test(obj.id) == false)
		return;
	var sid = parseInt(obj.id.replace(re, ''));
	var item = getItemBySid(sid);
	if(obj.moveObject == null){
		obj.moveObject = _dt_createMoveDIV(obj);
		obj.item = item;
	}
	_dt_itemMouseDown.button = e.button;
	_dt_itemMouseDown.downObject = obj;
	_dt_itemMouseDown.moveObject = obj.moveObject;
}

function _dt_moveObjectWithMouse(obj, e){
	var top = e.clientY;
	var left = e.clientX;
	top -= 24;
	left -= obj.clientWidth/2;
	obj.style.posTop = top;
	obj.style.posLeft = left;
}

function _dt_itemMouseMove(){
	if(_dt_itemMouseDown.moveObject != null){
		_dt_itemMouseDown.moveObject.style.display = "";
		_dt_moveObjectWithMouse(_dt_itemMouseDown.moveObject, showTreeWindow.event);
	}
}
function _dt_itemMouseUp(){
	if(_dt_itemMouseDown.moveObject != null){
		_dt_itemMouseDown.moveObject.style.display = "none";
		if(_dt_itemMouseOver.overObject != null){
			if(_dt_itemMouseDown.downObject.item != _dt_itemMouseOver.overObject.item){
				if(_dt_itemMouseDown.button == 1){
					dtMoveItem(_dt_itemMouseDown.downObject.item, _dt_itemMouseOver.overObject.item);
				}else{
					dtMoveItemToSub(_dt_itemMouseDown.downObject.item, _dt_itemMouseOver.overObject.item);
				}
			}
			_dt_restoreBackground(_dt_itemMouseOver.overObject);
			_dt_itemMouseOver.overObject = null;
		}
		_dt_itemMouseDown.moveObject = null;
	}
}
function _dt_changeBackground(obj){
	obj.className = "over";
}
function _dt_restoreBackground(obj){
	if(obj == null)
		return;
	if(obj.id == "tree-root-text")
		obj.className = "root";
	else if(obj.item == currentItem)
		obj.className = "selected";
	else
		obj.className = "unselected";
}
function _dt_itemMouseOver(){
	var re = /^name/;
	var obj = showTreeWindow.event.srcElement;

	if(_dt_itemMouseDown.moveObject == null)
		return;

	if(obj.tagName != "SPAN")
		return;
	

	if(re.test(obj.id) == false){
		if(_dt_itemMouseDown.button == 1)
			return;
		else if(obj.id != "tree-root-text")
			return;
	}
	if(obj.id != "tree-root-text"){
		var sid = parseInt(obj.id.replace(re, ''));
		if(obj.item == null)
			obj.item = getItemBySid(sid);
	}
	_dt_itemMouseOver.overObject = obj;
	_dt_changeBackground(obj);
}
function _dt_itemMouseOut(){
	if(_dt_itemMouseOver.overObject != null){
		_dt_restoreBackground(_dt_itemMouseOver.overObject);
		_dt_itemMouseOver.overObject = null;
	}
}
function _dt_itemSelectStart(){
	return false;
}
