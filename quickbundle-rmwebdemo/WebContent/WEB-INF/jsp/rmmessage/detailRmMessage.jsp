<%@ page contentType="text/html; charset=UTF-8" language="java" %>
<%@ page import="org.quickbundle.tools.helper.RmVoHelper" %>
<%@ page import="org.quickbundle.tools.helper.RmStringHelper" %>
<%@ page import="org.quickbundle.modules.rmmessage.vo.RmMessageVo" %>
<%@ page import="org.quickbundle.modules.rmmessage.IRmMessageConstants" %>
<%  //判断是否只读
	boolean isReadOnly = false;
	if("1".equals(request.getAttribute(IRmMessageConstants.REQUEST_IS_READ_ONLY))) {
		isReadOnly = true;
	} 
%>
<%  //取出本条记录
	RmMessageVo resultVo = null;  //定义一个临时的vo变量
	resultVo = (RmMessageVo)request.getAttribute(IRmMessageConstants.REQUEST_BEAN);  //从request中取出vo, 赋值给resultVo
	RmVoHelper.replaceToHtml(resultVo);  //把vo中的每个值过滤
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
<%@ include file="/jsp/include/rmGlobal.jsp" %>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title><bean:message key="qb.web_title"/></title>
<script type="text/javascript">
	var rmActionName = "RmMessageAction";
	function find_onClick(){  //直接点到修改页面
		window.location.href="<%=request.getContextPath()%>/rmmessage/update/" + form.id.value;
	}
	function delete_onClick(){  //直接点删除单条记录
		if(!getConfirm()) {  //如果用户在确认对话框中点"取消"
			return false;
		}
		form.action="<%=request.getContextPath()%>/rmmessage/delete";
		form.submit();
	}  
</script>
</head>
<body>
<form name="form" method="post">
<br/>
<table class="mainTable">
	<tr>
		<td align="right" width="20%">&nbsp;</td>
		<td width="35%">&nbsp;</td>
		<td align="right" width="20%">&nbsp;</td>
		<td width="25%">&nbsp;</td>
	</tr>
	<tr>
		<td align="right"><%=IRmMessageConstants.TABLE_COLUMN_DISPLAY.get("biz_keyword")%>：</td>
		<td><%=RmStringHelper.prt(resultVo.getBiz_keyword())%>&nbsp;</td>
		<td align="right">&nbsp;</td>
		<td>&nbsp;</td>
	</tr>
	<tr>
		<td align="right"><%=IRmMessageConstants.TABLE_COLUMN_DISPLAY.get("sender_id")%>：</td>
		<td><%=RmStringHelper.prt(resultVo.getSender_id())%>&nbsp;</td>
		<td align="right">&nbsp;</td>
		<td>&nbsp;</td>
	</tr>
	<tr>
		<td align="right"><%=IRmMessageConstants.TABLE_COLUMN_DISPLAY.get("parent_message_id")%>：</td>
		<td><%=RmStringHelper.prt(resultVo.getParent_message_id())%>&nbsp;</td>
		<td align="right">&nbsp;</td>
		<td>&nbsp;</td>
	</tr>
	<tr>
		<td align="right"><%=IRmMessageConstants.TABLE_COLUMN_DISPLAY.get("owner_org_id")%>：</td>
		<td><%=RmStringHelper.prt(resultVo.getOwner_org_id())%>&nbsp;</td>
		<td align="right">&nbsp;</td>
		<td>&nbsp;</td>
	</tr>
	<tr>
		<td align="right"><%=IRmMessageConstants.TABLE_COLUMN_DISPLAY.get("template_id")%>：</td>
		<td><%=RmStringHelper.prt(resultVo.getTemplate_id())%>&nbsp;</td>
		<td align="right">&nbsp;</td>
		<td>&nbsp;</td>
	</tr>
	<tr>
		<td align="right"><%=IRmMessageConstants.TABLE_COLUMN_DISPLAY.get("is_affix")%>：</td>
		<td><%=RmStringHelper.prt(resultVo.getIs_affix())%>&nbsp;</td>
		<td align="right">&nbsp;</td>
		<td>&nbsp;</td>
	</tr>
	<tr>
		<td align="right"><%=IRmMessageConstants.TABLE_COLUMN_DISPLAY.get("record_id")%>：</td>
		<td><%=RmStringHelper.prt(resultVo.getRecord_id())%>&nbsp;</td>
		<td align="right">&nbsp;</td>
		<td>&nbsp;</td>
	</tr>
	<tr>
		<td align="right"><%=IRmMessageConstants.TABLE_COLUMN_DISPLAY.get("message_xml_context")%>：</td>
		<td colspan="3"><%=RmStringHelper.prt(resultVo.getMessage_xml_context())%>&nbsp;</td>
	</tr>
	</table>

<input type="hidden" name="id" value="<%=RmStringHelper.prt(resultVo.getId())%>">

<table align="center">
	<tr>
		<td><br>
			<input type="button" class="button_ellipse" id="button_update" value="修改" onclick="javascript:find_onClick();">
			<input type="button" class="button_ellipse" id="button_delete" value="删除" onclickto="javascript:delete_onClick();">
			<input type="button" class="button_ellipse" id="button_back" value="返回"  onclick="javascript:history.go(-1);" >
		</td>
	</tr>
</table>

<%-- 开始子表信息，带页签集成多个子表
<script type="text/javascript">
var childTableTabs  =  new Array(

	new Array ('子表RmMessageReveiver','<%=request.getContextPath()%>/RmMessageReveiverConditionAction.do?cmd=queryAll&message_id=<%=resultVo.getId()%>&message_id_name=<%=resultVo.getId()%><%=isReadOnly ? "&" + org.quickbundle.project.IGlobalConstants.REQUEST_IS_READ_ONLY + "=1" : ""%>'),
						
	null
);
</script>
<table class="table_div_content">
	<tr>
		<td>
			<div id="childTableTabsDiv"></div>
		</td>
	</tr>
</table> --%>
<%-- 结束子表信息 --%>

</form>
</body>
</html>
<script type="text/javascript">
<%if(isReadOnly) {%>
	rmActionName = "RmMessageReadOnlyAction";
	rmJspPath = "/readonly";
	rmHiddenFormElement(document.all["button_update"]);
	rmHiddenFormElement(document.all["button_delete"]);
<%}%>
</script>