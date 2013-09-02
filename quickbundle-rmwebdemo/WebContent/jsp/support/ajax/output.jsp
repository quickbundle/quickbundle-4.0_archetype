<%@ page contentType="text/xml;charset=UTF-8" language="java" %><%@page import="org.quickbundle.base.vo.RmValueObject"%><%@page import="org.dom4j.Document"%><%@page import="org.quickbundle.tools.helper.xml.RmXmlConverter"%><%@page import="net.sf.json.JSONObject"%><%@page import="org.quickbundle.base.web.page.RmPageVo"%><%@page import="org.quickbundle.tools.helper.RmPopulateHelper"%><%@page import="java.sql.Date"%><%@page import="org.quickbundle.tools.helper.RmStringHelper"%><%@page import="net.sf.json.processors.JsonValueProcessor"%><%@page import="net.sf.json.processors.PropertyNameProcessor"%><%@page import="net.sf.json.processors.PropertyNameProcessorMatcher"%><%@page import="java.sql.Timestamp"%><%@page import="net.sf.json.JsonConfig"%><%@page import="net.sf.json.JSONArray"%><%@page import="java.util.List"%><%@page import="org.quickbundle.project.IGlobalConstants"%><%@page import="org.quickbundle.project.serializer.RmJsonConfig"%><%
try {
	Object obj = request.getAttribute(IGlobalConstants.REQUEST_OUTPUT_OBJECT);
	if(obj == null) {
		obj = request.getAttribute(IGlobalConstants.REQUEST_BEANS);
	} 
	if(obj == null) {
		obj = request.getAttribute(IGlobalConstants.REQUEST_BEAN);
	} 
	if(obj == null) {
		obj = request.getAttribute(IGlobalConstants.EXECUTE_ROW_COUNT);
	}
	String output_type = request.getParameter("output_type"); //json or xml
	if("xml".equals(output_type)) {
		Document doc = RmXmlConverter.getDocByObj(obj);
		out.print(RmXmlConverter.getDocByObj(obj).asXML());
	} if("excel".equals(output_type)) {
		Document doc = RmXmlConverter.getDocByObj(obj);
		out.print(RmXmlConverter.getDocByObj(obj).asXML());
	} else {
		if(obj != null) {
			if(obj instanceof List) {
				JSONObject jo = new JSONObject();
				if(request.getAttribute(IGlobalConstants.RM_PAGE_VO) != null) {
					RmPageVo pageVo = (RmPageVo)request.getAttribute(IGlobalConstants.RM_PAGE_VO);
					jo.put("totalCount", pageVo.getRecordCount());
				}
				jo.put(IGlobalConstants.REQUEST_BEANS, JSONArray.fromObject(obj, RmJsonConfig.getDefaultInstance()));
				out.print(jo);
			} else if(obj instanceof int[]) {
				JSONObject jo = new JSONObject();
				jo.put(IGlobalConstants.EXECUTE_ROW_COUNT, JSONArray.fromObject(obj));
				out.print(jo);
			} else if(obj instanceof JSONObject) {
				out.print(obj);
			}  else if(obj instanceof RmValueObject) {
				out.print(JSONObject.fromObject(obj));
			} 
		}
	}
} catch(Exception e) {
	e.printStackTrace();
}
%>