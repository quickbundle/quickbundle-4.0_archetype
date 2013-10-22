package org.quickbundle.project.init;

import java.io.File;
import java.io.FileInputStream;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.Properties;

import org.dom4j.Document;
import org.dom4j.Element;
import org.quickbundle.base.exception.RmRuntimeException;
import org.quickbundle.config.RmClusterConfig;
import org.quickbundle.config.RmConfig;
import org.quickbundle.config.RmLoadConfig;
import org.quickbundle.project.IGlobalConstants;
import org.quickbundle.tools.context.RmBeanHelper;

public class LoadProjectConfig {

	/**
	 * 初始化rm.xml
	 */
	public static void initRmConfig() {
		Document rmDoc = RmLoadConfig.getRmDoc();
		PopulateRmConfig pc = new PopulateRmConfig(RmConfig.getSingleton(), rmDoc);
		pc.populate();

		Document rmClusterDoc = RmLoadConfig.getRmClusterDoc();
		PopulateRmConfig pc2 = new PopulateRmConfig(RmConfig.getSingleton(), rmClusterDoc);
		pc2.populate();
	}
	
	public static void initClusterConfig() {
		initDatabaseProductName();
		
		Element eleLoadCluster = (Element) RmLoadConfig.getRmClusterDoc().selectSingleNode("/rm/org.quickbundle.config.RmClusterConfig/*[1]");
		String classNameLoadCluster = eleLoadCluster.getName();
		AbstractClusterConfigLoader loadClusterConfig = null;;
		try {
			loadClusterConfig = (AbstractClusterConfigLoader) LoadProjectConfig.class.getClassLoader().loadClass(classNameLoadCluster).newInstance();
		} catch (InstantiationException e) {
			e.printStackTrace();
			throw new RuntimeException(e);
		} catch (IllegalAccessException e) {
			e.printStackTrace();
			throw new RuntimeException(e);
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
			throw new RuntimeException(e);
		}
		loadClusterConfig.init();
		RmClusterConfig.setSingleton(loadClusterConfig);
		RmConfig.getSingleton().setShardingPrefix(loadClusterConfig.getSelfNode().get(RmClusterConfig.NodeKey.shardingPrefix.name()));
	}
	
	private static void initDatabaseProductName() {
		// 初始化默认数据库类型
		Connection conn = null;
		try {
			conn = RmBeanHelper.getConnection();
			RmConfig.getSingleton().setDatabaseProductName(conn.getMetaData().getDatabaseProductName());
		} catch (Exception e) {
			try { // 尝试从jdbc.properties猜测数据库类型
				File fJdbc = new File(LoadProjectConfig.class.getResource("config/jdbc.properties").getFile());
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
}
