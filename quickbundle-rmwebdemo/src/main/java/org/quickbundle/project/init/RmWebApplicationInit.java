package org.quickbundle.project.init;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.Properties;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.dom4j.Document;
import org.quickbundle.base.beans.factory.RmBeanFactory;
import org.quickbundle.base.beans.factory.RmIdFactory;
import org.quickbundle.base.exception.RmRuntimeException;
import org.quickbundle.itf.ILoadOnStartup;
import org.quickbundle.itf.code.IRmCodeService;
import org.quickbundle.project.IGlobalConstants;
import org.quickbundle.project.RmGlobalReference;
import org.quickbundle.project.RmProjectHelper;
import org.quickbundle.tools.context.RmBeanHelper;
import org.quickbundle.tools.helper.xml.RmXmlHelper;
import org.quickbundle.tools.support.log.RmLogHelper;
import org.quickbundle.tools.support.path.RmPathHelper;

/**
 * 初始化组件和服务
 * 
 * @author qb
 * 
 */
public class RmWebApplicationInit implements ILoadOnStartup {

	public void destroy(HttpServlet servlet) {

	}

	public void init(HttpServlet servlet) {
		File warHome = new File(RmConfig.getSingleton().getWarHome());
		if (!warHome.exists()) {
			RmLogHelper.getLogger(this.getClass()).warn("warHome: " + warHome.getAbsolutePath() + " not exist");
		} else if (!warHome.canRead()) {
			RmLogHelper.getLogger(this.getClass()).warn("warHome: " + warHome.getAbsolutePath() + " can not read");
		} else if (!warHome.canWrite()) {
			RmLogHelper.getLogger(this.getClass()).warn("warHome: " + warHome.getAbsolutePath() + " can not write");
		}

		if (RmConfig.getSingleton().isSystemDebugMode()) {
			RmLogHelper.getLogger(this.getClass()).info("System in debug mode......");
		}

		if (RmConfig.isGenerateIdFromDb()) {
			RmLogHelper.getLogger(this.getClass()).info("System generate primary key from database(not cache)...");
		}

		// 初始化Spring Bean Factory
		RmBeanFactory.getBeanFactory();

		// 初始化数据库类型
		initDatabaseProductName();

		try {
			if (RmConfig.getSingleton().isSystemDebugMode()) {
				IRmCodeService codeService = (IRmCodeService) RmBeanFactory.getBean(IRmCodeService.class.getName());
				if (needExecuteInitTable()) {
					// 初始化数据库的内置表，只会执行一次。如果要再执行，需手动删除/WEB-INF/config/sql/lockInitTable文件
					codeService.executeInitTable();
				}
				// 从xml中初始化编码数据
				codeService.executeInitCodeTypeDataByXml();
			} else {
				// 初始化ID
				RmIdFactory.getIdFactory();
				// 初始化编码表数据
				RmGlobalReference.getSingleton().initDataTotal();
			}
		} catch (Exception e) {
			RmLogHelper.error(this.getClass(), "init rm error: " + e.toString());
		}

		// quartz begin
		try {
			if (RmConfig.isSchedulerStart()) {
				long schedulerStartLazySecond = 0L;
				try {
					String schedulerStartLazy = RmProjectHelper.getRmClusterDoc().valueOf("/rm/org.quickbundle.project.init.RmConfig/schedulerStartLazy");
					if (schedulerStartLazy.trim().length() > 0) {
						schedulerStartLazySecond = Long.parseLong(schedulerStartLazy.trim());
					}
				} catch (Exception e) {
					e.printStackTrace();
				}
				if (schedulerStartLazySecond <= 0) {
					org.quartz.Scheduler scheduler = (org.quartz.Scheduler) RmBeanFactory.getBean(org.quickbundle.third.quartz.util.ISchedulerConstants.QUARTZ_SHEDULER);
					scheduler.start();

				} else {
					final long finalSchedulerStartLazy = schedulerStartLazySecond;
					Thread t = new Thread(new Runnable() {
						public void run() {
							try {
								System.out.println("sleep for ejb ok begin, " + finalSchedulerStartLazy + " second");
								Thread.sleep(1000 * finalSchedulerStartLazy);
								System.out.println("sleep for ejb ok end");
								org.quartz.Scheduler scheduler = (org.quartz.Scheduler) RmBeanFactory.getBean(org.quickbundle.third.quartz.util.ISchedulerConstants.QUARTZ_SHEDULER);
								scheduler.start();
							} catch (Exception e) {
								e.printStackTrace();
							}
						}
					});
					t.start();
				}
			}
		} catch (Exception e) {
			RmLogHelper.getLogger(this.getClass()).error("调度器启动失败", e);
		}
		// quartz end
	}

	/**
	 * 判断是否应当执行建表初始化SQL
	 * 
	 * @return
	 */
	boolean needExecuteInitTable() {
		File fLock = new File(RmXmlHelper.formatToFile(RmConfig.getSingleton().getWarHome() + "/.lockInitTable"));
		try {
			return fLock.createNewFile();
		} catch (IOException e) {
			return false;
		}
	}

	private void initDatabaseProductName() {
		// 初始化默认数据库类型
		Connection conn = null;
		try {
			conn = RmBeanHelper.getConnection();
			RmConfig.getSingleton().setDatabaseProductName(conn.getMetaData().getDatabaseProductName());
		} catch (Exception e) {
			try { // 尝试从jdbc.properties猜测数据库类型
				File fJdbc = new File(RmPathHelper.getWebInfDir() + "/config/jdbc/jdbc.properties");
				if (fJdbc.exists()) {
					Properties pJdbc = new Properties();
					pJdbc.load(new FileInputStream(fJdbc));
					String dbName = pJdbc.getProperty("jdbc.driverClassName");
					if (dbName != null) {
						RmConfig.getSingleton().setDatabaseProductName(IGlobalConstants.DATABASE_PRODUCT_MAP.get(dbName));
					}
				}
			} catch (Exception e2) {
				e2.printStackTrace();
			}
			if (RmConfig.getSingleton().getDatabaseProductName() == null) {
				throw new RmRuntimeException("初始化默认数据库出错", e);
			}
		} finally {
			try {
				if (conn != null) {
					conn.close();
				}
			} catch (SQLException e) {
				throw new RmRuntimeException("关闭连接出错", e);
			}
		}
	}

	/**
	 * 初始化rm.xml
	 */
	public static void initRmConfig() {
		Document rmDoc = RmProjectHelper.getRmDoc();

		try {
			// war应用的主目录
			RmConfig.getSingleton().setWarHome(rmDoc.valueOf("/rm/org.quickbundle.project.init.RmConfig/warHome/text()"));
		} catch (Exception e) {
			RmLogHelper.error(RmWebApplicationInit.class, "setWarHome(): " + e.toString());
		}

		try {
			// 是集群模式？或单机
			RmConfig.getSingleton().setClusterMode(Boolean.parseBoolean(rmDoc.valueOf("/rm/org.quickbundle.project.init.RmConfig/clusterMode/text()")));
		} catch (Exception e) {
			RmLogHelper.error(RmWebApplicationInit.class, "setClusterMode(): " + e.toString());
		}
		try {
			// 集群节点是否自动收集？还是从rm.xml中读取
			RmConfig.getSingleton().setCloudNodeInfoAuto(Boolean.parseBoolean(rmDoc.valueOf("/rm/org.quickbundle.project.init.RmConfig/cloudNodeInfoAuto/text()")));
		} catch (Exception e) {
			RmLogHelper.error(RmWebApplicationInit.class, "setCloudNodeInfoAuto(): " + e.toString());
		}

		try {
			// 是每次连接数据库产生最新主键？还是从缓存产生？
			RmConfig.getSingleton().setGenerateIdFromDb(Boolean.parseBoolean(rmDoc.valueOf("/rm/org.quickbundle.project.init.RmConfig/generateIdFromDb/text()")));
		} catch (Exception e) {
			RmLogHelper.error(RmWebApplicationInit.class, "setGenerateIdFromDb(): " + e.toString());
		}
		
		try {
			// RmIdFactory init id batch, union all?
			RmConfig.getSingleton().setInitIdBatch(Boolean.parseBoolean(rmDoc.valueOf("/rm/org.quickbundle.project.init.RmConfig/initIdBatch/text()")));
		} catch (Exception e) {
			RmLogHelper.error(RmWebApplicationInit.class, "setGenerateIdFromDb(): " + e.toString());
		}

		try {
			// 列表页默认分页数
			RmConfig.getSingleton().setDefaultPageSize(Integer.parseInt(rmDoc.valueOf("/rm/org.quickbundle.project.init.RmConfig/defaultPageSize/text()")));
		} catch (Exception e) {
			RmLogHelper.error(RmWebApplicationInit.class, "setDefaultPageSize(): " + e.toString());
		}
		try {
			// 是否多数据库
			RmConfig.getSingleton().setMultiDb(Boolean.parseBoolean(rmDoc.valueOf("/rm/org.quickbundle.project.init.RmConfig/multiDb/text()")));
		} catch (Exception e) {
			RmLogHelper.error(RmWebApplicationInit.class, "setMultiDb(): " + e.toString());
		}
		try {
			// 系统是否开发调试状态
			RmConfig.getSingleton().setSystemDebugMode(Boolean.parseBoolean(rmDoc.valueOf("/rm/org.quickbundle.project.init.RmConfig/systemDebugMode/text()")));
		} catch (Exception e) {
			RmLogHelper.error(RmWebApplicationInit.class, "setSystemDebugMode(): " + e.toString());
		}

		try {
			// 系统用户是否唯一登录，同时登录会强制踢出第一个用户
			RmConfig.getSingleton().setUserUniqueLogin(Boolean.parseBoolean(rmDoc.valueOf("/rm/org.quickbundle.project.init.RmConfig/userUniqueLogin/text()")));
		} catch (Exception e) {
			RmLogHelper.error(RmWebApplicationInit.class, "setUserUniqueLogin(): " + e.toString());
		}

		try {
			// 初始化默认系统名称
			RmConfig.getSingleton().setAppDescription(rmDoc.valueOf("/rm/org.quickbundle.project.init.RmConfig/appDescription/text()"));
		} catch (Exception e) {
			RmLogHelper.error(RmWebApplicationInit.class, "setAppDescription(): " + e.toString());
		}

		try {
			// 是否记录request日志，用于分析执行时间和SQL数量
			RmConfig.getSingleton().setLogRequest(Boolean.parseBoolean(rmDoc.valueOf("/rm/org.quickbundle.project.init.RmConfig/logRequest/text()")));
		} catch (Exception e) {
			RmLogHelper.error(RmWebApplicationInit.class, "setLogRequest(): " + e.toString());
		}

		try {
			// 是否逻辑删除文件
			RmConfig.getSingleton().setLogicDeleteFile(Boolean.parseBoolean(rmDoc.valueOf("/rm/org.quickbundle.project.init.RmConfig/logicDeleteFile/text()")));
			// 逻辑删除的回收站文件夹
			RmConfig.getSingleton().setRecycleBinFolder(rmDoc.valueOf("/rm/org.quickbundle.project.init.RmConfig/recycleBinFolder/text()"));
		} catch (Exception e) {
			RmLogHelper.error(RmWebApplicationInit.class, "setLogicDeleteFile(): " + e.toString());
		}

		Document rmClusterDoc = RmProjectHelper.getRmClusterDoc();

		try {
			// 本集群节点RmIdFactory产生的主键前缀
			RmConfig.getSingleton().setClusterIdPrefix(rmClusterDoc.valueOf("/rm/org.quickbundle.project.init.RmConfig/clusterIdPrefix/text()"));
		} catch (Exception e) {
			RmLogHelper.error(RmWebApplicationInit.class, "setClusterIdPrefix(): " + e.toString());
		}
		try {
			// 系统是否启动任务调度
			RmConfig.getSingleton().setSchedulerStart(Boolean.parseBoolean(rmClusterDoc.valueOf("/rm/org.quickbundle.project.init.RmConfig/schedulerStart/text()")));
		} catch (Exception e) {
			RmLogHelper.error(RmWebApplicationInit.class, "setSchedulerStart(): " + e.toString());
		}

		{ // 集群模式的判断
			RmConfig.getSingleton().setClusterMode(rmClusterDoc.selectNodes("/rm/org.quickbundle.base.cloud.RmClusterConfig/node").size() > 1);
		}

		try {
			// 字体判断
			RmConfig.getSingleton().setDefaultFont(rmClusterDoc.valueOf("/rm/org.quickbundle.project.init.RmConfig/defaultFont/text()"));
		} catch (Exception e) {
			RmLogHelper.error(RmWebApplicationInit.class, "setSchedulerStart(): " + e.toString());
		}
	}

	public void service(HttpServlet servlet, HttpServletRequest request, HttpServletResponse response) throws ServletException {
		// nothing
	}
}