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

import org.quickbundle.base.beans.factory.RmBeanFactory;
import org.quickbundle.base.beans.factory.RmIdFactory;
import org.quickbundle.base.exception.RmRuntimeException;
import org.quickbundle.config.RmConfig;
import org.quickbundle.itf.ILoadOnStartup;
import org.quickbundle.itf.code.IRmCodeService;
import org.quickbundle.project.IGlobalConstants;
import org.quickbundle.project.RmGlobalReference;
import org.quickbundle.tools.context.RmBeanHelper;
import org.quickbundle.tools.helper.xml.RmXmlHelper;
import org.quickbundle.tools.support.log.RmLogHelper;
import org.quickbundle.tools.support.path.RmPathHelper;

/**
 * 初始化组件和服务
 * 
 * @author 白小勇
 * 
 */
public class RmWebApplicationInit implements ILoadOnStartup {
	
	public void destroy(HttpServlet servlet) {

	}

	public void init(HttpServlet servlet) {

		check();
		
		// 初始化Spring Bean Factory
		RmBeanFactory.getBeanFactory();

		// 初始化数据库类型
		initDatabaseProductName();

		//初始化库表数据
		initData();

		// quartz begin
		initQuartz();
		// quartz end
	}

	void check() {
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
				File fJdbc = new File(this.getClass().getResource("config/jdbc.properties").getFile());
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
	
	private void initData() {
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
				RmIdFactory.getIdGenerator();
				// 初始化编码表数据
				RmGlobalReference.getSingleton().initDataTotal();
			}
		} catch (Exception e) {
			RmLogHelper.error(this.getClass(), "init rm error: " + e.toString());
		}
	}
	
	// quartz begin
	private void initQuartz() {
		try {
			if (RmConfig.getSingleton().isSchedulerStart()) {
				long schedulerStartLazySecond = RmConfig.getSingleton().getSchedulerStartLazy();
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
	}
	// quartz end

	public void service(HttpServlet servlet, HttpServletRequest request, HttpServletResponse response) throws ServletException {
		// nothing
	}
}