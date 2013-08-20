<%@ page contentType="text/html; charset=UTF-8" language="java" %>
<%@ page import="org.quickbundle.tools.helper.RmVoHelper" %>
<%@ page import="org.quickbundle.modules.message.vo.RmMessageVo" %>
<%@ page import="org.quickbundle.modules.message.IMessageConstants" %>
<%  //判断是否为修改页面
  	RmMessageVo resultVo = null;  //定义一个临时的vo变量
	boolean isModify = false;  //定义变量,标识本页面是否修改(或者新增)
	if(request.getParameter("isModify") != null || "update".equals(request.getAttribute("action"))) {
		isModify = true;  //赋值isModify为true
  		if(request.getAttribute(IMessageConstants.REQUEST_BEAN) != null) {  //如果request中取出的bean不为空
  			resultVo = (RmMessageVo)request.getAttribute(IMessageConstants.REQUEST_BEAN);  //从request中取出vo, 赋值给resultVo
  		}
	}
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
<%@ include file="/jsp/include/rmGlobal.jsp" %>
<%@ include file="/jsp/include/rmGlobal_insert.jsp" %>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title><bean:message key="qb.web_title"/></title>
<script type="text/javascript">
	var rmActionName = "RmMessageAction";
	function insert_onClick(){  //插入单条数据
    	form.action="<%=request.getContextPath()%>/message/insert";
	    form.submit();
	}
  	function update_onClick(id){  //保存修改后的单条数据
    	if(!getConfirm()) {  //如果用户在确认对话框中点"取消"
  			return false;
		}
	    form.action="<%=request.getContextPath()%>/message/update";
    	form.submit();
	}
</script>
</head>
<body>
<form name="form" method="post">

<div class="button_area">
	<input type="button" class="button_ellipse" id="button_save" value="保存" onclickto="javascript:${action}_onClick()"/>
	<input type="button" class="button_ellipse" id="button_cancel" value="取消" onclick="javascript:history.go(-1)"/>
	<input type="reset" class="button_ellipse" id="button_reset" value="重置"/>
</div>

<table class="mainTable">
	<tr>
		<td align="right" width="20%">&nbsp;</td>
		<td width="35%">&nbsp;</td>
		<td align="right" width="20%">&nbsp;</td>
		<td width="25%">&nbsp;</td>
	</tr>
	<tr>
		<td align="right"><span class="style_required_red">* </span><%=IMessageConstants.TABLE_COLUMN_DISPLAY.get("biz_keyword")%></td>
		<td>
			<input type="text" class="text_field" name="biz_keyword" inputName="<%=IMessageConstants.TABLE_COLUMN_DISPLAY.get("biz_keyword")%>" value="" maxLength="25" validate="notNull;"/>
		</td>
		<td align="right"></td>
		<td></td>
	</tr>
	<tr>
		<td align="right"><span class="style_required_red">* </span><%=IMessageConstants.TABLE_COLUMN_DISPLAY.get("sender_id")%></td>
		<td>
			<input type="text" class="text_field" name="sender_id" inputName="<%=IMessageConstants.TABLE_COLUMN_DISPLAY.get("sender_id")%>" value="0" maxLength="9" validate="notNull;"/>
		</td>
		<td align="right"></td>
		<td></td>
	</tr>
	<tr>
		<td align="right"><%=IMessageConstants.TABLE_COLUMN_DISPLAY.get("parent_message_id")%></td>
		<td>
			<input type="text" class="text_field_reference"  hiddenInputId="parent_message_id" name="parent_message_id_name" inputName="<%=IMessageConstants.TABLE_COLUMN_DISPLAY.get("parent_message_id")%>" value="" /><input type="hidden" name="parent_message_id"><img class="refButtonClass" src="<%=request.getContextPath()%>/images/09.gif" onclick="javascript:getReference(new Array(form.parent_message_id, form.parent_message_id_name), '<%=request.getContextPath()%>/', '<%=request.getContextPath()%>/RmMessageAction.do?cmd=queryReference&referenceInputType=radio');"/>
		</td>
		<td align="right"></td>
		<td></td>
	</tr>
	<tr>
		<td align="right"><%=IMessageConstants.TABLE_COLUMN_DISPLAY.get("owner_org_id")%></td>
		<td>
			<input type="text" class="text_field" name="owner_org_id" inputName="<%=IMessageConstants.TABLE_COLUMN_DISPLAY.get("owner_org_id")%>" value="" maxLength="25" />
		</td>
		<td align="right"></td>
		<td></td>
	</tr>
	<tr>
		<td align="right"><%=IMessageConstants.TABLE_COLUMN_DISPLAY.get("template_id")%></td>
		<td>
			<input type="text" class="text_field" name="template_id" inputName="<%=IMessageConstants.TABLE_COLUMN_DISPLAY.get("template_id")%>" value="" maxLength="9" />
		</td>
		<td align="right"></td>
		<td></td>
	</tr>
	<tr>
		<td align="right"><%=IMessageConstants.TABLE_COLUMN_DISPLAY.get("is_affix")%></td>
		<td>
			<input type="text" class="text_field" name="is_affix" inputName="<%=IMessageConstants.TABLE_COLUMN_DISPLAY.get("is_affix")%>" value="" maxLength="1" />
		</td>
		<td align="right"></td>
		<td></td>
	</tr>
	<tr>
		<td align="right"><%=IMessageConstants.TABLE_COLUMN_DISPLAY.get("record_id")%></td>
		<td>
			<input type="text" class="text_field" name="record_id" inputName="<%=IMessageConstants.TABLE_COLUMN_DISPLAY.get("record_id")%>" value="" maxLength="25" />
		</td>
		<td align="right"></td>
		<td></td>
	</tr>
	<tr>
		<td align="right"><%=IMessageConstants.TABLE_COLUMN_DISPLAY.get("message_xml_context")%></td>
		<td colspan="3">
			<textarea class="textarea_limit_words" cols="60" rows="5" name="message_xml_context" inputName="<%=IMessageConstants.TABLE_COLUMN_DISPLAY.get("message_xml_context")%>" maxLength="32767" ></textarea>
		</td>
	</tr>
	</table>
  
<input type="hidden" name="id" value="" />

<!-- child table begin -->
<div id="rowTabs">
    <ul>
        <li><a href="#rowTabs-<%=IMessageConstants.TABLE_NAME_RM_MESSAGE_RECEIVER%>"><%=IMessageConstants.TABLE_NAME_DISPLAY_RM_MESSAGE_RECEIVER %>列表</a></li>
        <li style="position:relative;float:right;padding-right:10px">
            <input type="button" class="button_ellipse" id="button_addRow" value="增行" onclick="javascript:addRow_onClick()" title="增加一行"/>
            <input type="button" class="button_ellipse" id="button_removeRow" value="删行" onclick="javascript:removeRow_onClick();" title="删除所选的行"/>
            <input type="button" class="button_ellipse" id="button_copyRow" value="复制" onclick="javascript:copyRow_onClick();" title="复制所选的行"/>
        </li>
    </ul>
    <div id="rowTabs-<%=IMessageConstants.TABLE_NAME_RM_MESSAGE_RECEIVER%>">
        <div class="rowContainer">
            <table class="rowTable" namespace="<%=IMessageConstants.TABLE_NAME_RM_MESSAGE_RECEIVER%>" id="rowTable">
                <tr class="trheader">
                    <td align="left" style="width:3%;"><input type="checkbox" class="rowCheckboxControl" style="display:none;"/>选择</td>
                    <td align="left" style="width:8%;"><%=IMessageConstants.TABLE_COLUMN_DISPLAY_RM_MESSAGE_RECEIVER.get("message_id")%></td>
                    <td align="left" style="width:8%;"><%=IMessageConstants.TABLE_COLUMN_DISPLAY_RM_MESSAGE_RECEIVER.get("receiver_id")%></td>
                    <td align="left" style="width:8%;"><%=IMessageConstants.TABLE_COLUMN_DISPLAY_RM_MESSAGE_RECEIVER.get("is_handle")%></td>
                    <td align="left" style="width:8%;"><%=IMessageConstants.TABLE_COLUMN_DISPLAY_RM_MESSAGE_RECEIVER.get("handle_date")%></td>
                    <td align="left" style="width:8%;"><%=IMessageConstants.TABLE_COLUMN_DISPLAY_RM_MESSAGE_RECEIVER.get("handle_result")%></td>
                </tr>
                <!-- 新增行原型 -->
                <tr class="rowPrototype">
                    <td align="center"> 
                        <input type="checkbox" name="rmRowSelecter"/>
                        <input type="hidden" name="id"/>
                    </td>
                    <td>
                        <input type="text" name="message_id" inputName="<%=IMessageConstants.TABLE_COLUMN_DISPLAY_RM_MESSAGE_RECEIVER.get("message_id")%>" value="" />
                    </td>
                    <td>
                        <input type="text" name="receiver_id" inputName="<%=IMessageConstants.TABLE_COLUMN_DISPLAY_RM_MESSAGE_RECEIVER.get("receiver_id")%>" value="" />
                    </td>
                    <td>
                        <input type="text" name="is_handle" inputName="<%=IMessageConstants.TABLE_COLUMN_DISPLAY_RM_MESSAGE_RECEIVER.get("is_handle")%>" value="" />
                    </td>
                    <td>
                        <input type="text" name="handle_date" inputName="<%=IMessageConstants.TABLE_COLUMN_DISPLAY_RM_MESSAGE_RECEIVER.get("handle_date")%>" value="" />
                    </td>
                    <td>
                        <input type="text" name="handle_result" inputName="<%=IMessageConstants.TABLE_COLUMN_DISPLAY_RM_MESSAGE_RECEIVER.get("handle_result")%>" value="" />
                    </td>
                </tr>
            </table>
        </div>
    </div>
</div>
<!-- child table end -->

</form>
</body>
</html>
<script type="text/javascript">
<%  //取出要修改的那条记录，并且回写表单
	if(isModify) {  //如果本页面是修改页面
		out.print(RmVoHelper.writeBackMapToForm(RmVoHelper.getMapFromVo(resultVo)));  //输出表单回写方法的脚本
		out.print(RmVoHelper.writeBackListToRowTable(IMessageConstants.TABLE_NAME_RM_MESSAGE_RECEIVER, resultVo.getBody()));  //输出表单回写方法的脚本
  	}
%>
</script>