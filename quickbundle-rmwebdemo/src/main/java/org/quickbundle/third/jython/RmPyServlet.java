package org.quickbundle.third.jython;

import java.io.File;
import java.util.Enumeration;
import java.util.Properties;

import javax.servlet.ServletContext;

import org.python.core.Py;
import org.python.core.PyString;
import org.python.core.PySystemState;
import org.python.util.PyServlet;
import org.python.util.PythonInterpreter;
import org.quickbundle.project.init.RmConfig;
import org.quickbundle.tools.helper.io.RmZipHelper;
import org.quickbundle.tools.helper.xml.RmXmlHelper;
import org.quickbundle.tools.support.log.RmLogHelper;
import org.quickbundle.tools.support.path.RmPathHelper;

/**
 * This servlet is used to re-serve Jython servlets. It stores bytecode for Jython servlets and
 * re-uses it if the underlying .py file has not changed.
 * <p>
 * e.g. http://localhost:8080/test/hello.py
 * <pre>
 *
 * from javax.servlet.http import HttpServlet
 * class hello(HttpServlet):
 *     def doGet(self, req, res):
 *         res.setContentType("text/html");
 *         out = res.getOutputStream()
 *         print >>out, "<html>"
 *         print >>out, "<head><title>Hello World, How are we?</title></head>"
 *         print >>out, "<body>Hello World, how are we?"
 *         print >>out, "</body>"
 *         print >>out, "</html>"
 *         out.close()
 * </pre>
 *
 * in web.xml for the PyServlet context:
 * <pre>
 * &lt;web-app>
 *     &lt;servlet>
 *         &lt;servlet-name>PyServlet&lt;/servlet-name>
 *         &lt;servlet-class>org.python.util.PyServlet&lt;/servlet-class>
 *         &lt;init-param>
 *             &lt;param-name>python.home&lt;/param-name>
 *             &lt;param-value>/usr/home/jython-2.5&lt;/param-value>
 *         &lt;/init-param>
 *     &lt;/servlet>
 *     &lt;servlet-mapping>
 *         &lt;servlet-name>PyServlet&lt;/servlet-name>
 *         &lt;url-pattern>*.py&lt;/url-pattern>
 *     &lt;/servlet-mapping>
 * &lt;/web-app>
 *
 * </pre>
 */
public class RmPyServlet extends PyServlet {

    /**
     * PyServlet's initialization can be performed as a ServletContextListener or as a regular
     * servlet, and this is the shared init code. If both initializations are used in a single
     * context, the system state initialization code only runs once.
     */
    protected static void init(Properties props, ServletContext context) {
        String rootPath = getRootPath(context);
        context.setAttribute(INIT_ATTR, true);
        Properties baseProps = PySystemState.getBaseProperties();
        // Context parameters
        Enumeration<?> e = context.getInitParameterNames();
        while (e.hasMoreElements()) {
            String name = (String)e.nextElement();
            props.put(name, context.getInitParameter(name));
        }
        if (props.getProperty("python.home") == null
                && baseProps.getProperty("python.home") == null) {
            props.put("python.home", rootPath + "WEB-INF" + File.separator + "lib");
        }
        //qb-rm auto create jython lib dir if not exist
        if(RmConfig.getSingleton().isCreatePythonLibIfNotExist()) {
        	File pythonLib = new File(props.getProperty("python.home"));
        	if(!pythonLib.exists()) {
        		RmLogHelper.getLogger(PyServlet.class).info("begin init jython lib");
        		String zipFile = RmPathHelper.getWebInfDir() + "/archive/python/jython.zip";
        		RmZipHelper.unZip(RmXmlHelper.formatToFile(zipFile), pythonLib.getAbsolutePath());
        		RmLogHelper.getLogger(PyServlet.class).info("create jython lib: unzip " + zipFile + " to " + pythonLib.getAbsolutePath());
        	}
        }
        PySystemState.initialize(baseProps, props, new String[0], Thread.currentThread().getContextClassLoader());
        PySystemState.add_package("javax.servlet");
        PySystemState.add_package("javax.servlet.http");
        PySystemState.add_package("javax.servlet.jsp");
        PySystemState.add_package("javax.servlet.jsp.tagext");
        PySystemState.add_classdir(rootPath + "WEB-INF" + File.separator + "classes");
        PySystemState.add_extdir(rootPath + "WEB-INF" + File.separator + "lib", true);
    }

    protected static PythonInterpreter createInterpreter(ServletContext servletContext) {
        String rootPath = getRootPath(servletContext);
        PySystemState sys = new PySystemState();
        //qb-rm
        sys.setdefaultencoding(RmConfig.defaultEncode());
        PythonInterpreter interp = new PythonInterpreter(Py.newStringMap(), sys);
        sys.path.append(new PyString(rootPath));

        String modulesDir = rootPath + "WEB-INF" + File.separator + "jython";
        sys.path.append(new PyString(modulesDir));
        return interp;
    }
}