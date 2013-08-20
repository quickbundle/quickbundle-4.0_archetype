<%@page import="org.quickbundle.tools.support.path.RmPathHelper"%>
<%@page import="java.io.FileInputStream"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@page import="java.util.StringTokenizer"%>
<%@page import="java.io.ByteArrayOutputStream"%>
<%@page import="java.io.IOException"%>
<%@page import="java.io.OutputStream"%>
<%@page import="java.io.InputStream"%>
<%@page import="java.io.FileOutputStream"%>
<%@page import="java.util.Locale"%>
<%@page import="java.io.File"%>
<%!
void pump(InputStream is, OutputStream os, boolean closeIn, boolean closeOut)
        throws IOException {
    try {
        pump(is, os);
    } finally {
        try {
            if (closeIn) {
                is.close();
            }
        } finally {
            if (closeOut) {
                os.close();
            }
        }
    }
}
%>
<%!
void pump(InputStream input, OutputStream output) throws IOException {
    final byte[] bytes = new byte[4 * 1024];
    int length = input.read(bytes);
    while (length != -1) {
        output.write(bytes, 0, length);
        length = input.read(bytes);
    }
}
%>
<%!
String getPIDFromOS(String cmdLine) {
    String pid = null;
    try{
	    // following is not always reliable as is (for example, see issue 3 on solaris 10
	    // or http://blog.igorminar.com/2007/03/how-java-application-can-discover-its.html)
	    // Author: Santhosh Kumar T, http://code.google.com/p/jlibs/, licence LGPL
	    // Author getpids.exe: Daniel Scheibli, http://www.scheibli.com/projects/getpids/index.html, licence GPL
	    final String[] cmd;
	    File tempFile = null;
	    Process process = null;
	    try {
	        try {
	            if (!System.getProperty("os.name").toLowerCase(Locale.getDefault())
	                    .contains("windows")) {
	                cmd = new String[] { "/bin/sh", "-c", cmdLine };
	            } else {
	                // getpids.exe is taken from http://www.scheibli.com/projects/getpids/index.html (GPL)
	                tempFile = File.createTempFile("getpids", ".exe");
	
	                // extract the embedded getpids.exe file from the jar and save it to above file
	                pump(new FileInputStream(RmPathHelper.getWarDir() + "/admin/os/getpids.exe"),
	                        new FileOutputStream(tempFile), true, true);
	                cmd = new String[] { tempFile.getAbsolutePath() };
	            }
	            process = Runtime.getRuntime().exec(cmd);
	            final ByteArrayOutputStream bout = new ByteArrayOutputStream();
	            pump(process.getInputStream(), bout, false, true);
	
	            final StringTokenizer stok = new StringTokenizer(bout.toString());
	            String firstValue = stok.nextToken(); // this is pid of the process we spanned
	            pid = firstValue;
	            //pid = stok.nextToken();
	
	            // waitFor nécessaire sous windows server 2003
	            // (sinon le fichier temporaire getpidsxxx.exe n'est pas effacé)
	            process.waitFor();
	        } finally {
	            if (process != null) {
	                // évitons http://bugs.sun.com/bugdatabase/view_bug.do?bug_id=6462165
	                process.getInputStream().close();
	                process.getOutputStream().close();
	                process.getErrorStream().close();
	                process.destroy();
	            }
	            if (tempFile != null && !tempFile.delete()) {
	                tempFile.deleteOnExit();
	            }
	        }
	    } catch (final InterruptedException e) {
	        pid = e.toString();
	    } catch (final IOException e) {
	        pid = e.toString();
	    }
    } catch(Throwable e2){e2.printStackTrace();};
    return pid;
}
%>
<%
String result = null;
if("killTomcat".equals(request.getParameter("cmd"))) {
	String pidTomcat = getPIDFromOS("ps -ef|grep java|grep apache-tomcat-7.0.26-lab | awk '{print $2}'");
	result = getPIDFromOS("kill -9 " + pidTomcat);
}
if("startTomcat".equals(request.getParameter("cmd"))) {
	result = getPIDFromOS("/usr/local/apache-tomcat-7.0.26-lab/bin/startup.sh");
}
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Insert title here</title>
<script type="text/javascript">
function killTomcat() {
    if(confirm("Are you sure kill tomcat?")) {
        form.cmd.value="killTomcat";
        form.submit();
    }
}
function startTomcat() {
    if(confirm("Are you sure start tomcat?")) {
        form.cmd.value="startTomcat";
        form.submit();
    }
}
</script>
</head>
<body>
<form name="form" method="post">
<b>tomcat status:</b>
<%
String pid = getPIDFromOS("ps -ef|grep apache-tomcat-7.0.26-lab|grep java|awk '{print $2}'");
out.print(pid);
%>
&nbsp;&nbsp;&nbsp;&nbsp;<input type=button value="refresh" onclick="form.cmd.value='';form.submit();" />
&nbsp;&nbsp;&nbsp;&nbsp;<input type=button value="kill this tomcat" onclick="javascript:killTomcat()" />
&nbsp;&nbsp;&nbsp;&nbsp;<input type=button value="start tomcat" onclick="javascript:startTomcat()" />
<%
if(result != null) {
%>
<b>action result:</b><%=result%>
<%
}
%>
<input type="hidden" name="cmd" value="" />
</form>
</body>
</html>