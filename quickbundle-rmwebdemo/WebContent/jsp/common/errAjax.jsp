<%@page contentType="text/html; charset=UTF-8" language="java"%><%@page import="net.sf.json.JSONObject"%><%
try {
	String str = "";
	if (request.getAttribute("org.apache.struts.action.EXCEPTION") != null) {
	    Exception e = (Exception) request.getAttribute("org.apache.struts.action.EXCEPTION");
	    str = e.toString();
	}

	out.print(JSONObject.fromObject("{error:\"" + str + "\"}"));
} catch(Exception e) {
	e.printStackTrace();
}
%>