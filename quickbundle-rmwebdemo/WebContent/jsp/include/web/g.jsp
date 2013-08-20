<%@page import="org.quickbundle.project.IGlobalConstants"%><%@ page contentType="text/html; charset=UTF-8" language="java" %><%@page import="org.quickbundle.base.web.page.RmPageVo"%><% 
	//前台分页
	int page_size = 20;
	if(request.getParameter("rm_page_size") != null) {
		page_size = Integer.parseInt(request.getParameter("rm_page_size"));
	}
	int current_page = 1;
	if(request.getParameter("rm_current_page") != null) {
		current_page = Integer.parseInt(request.getParameter("rm_current_page"));
	}
	request.setAttribute(IGlobalConstants.RM_CURRENT_PAGE, new int[]{page_size, current_page});
%>