package org.quickbundle.project.init;

import org.dom4j.Document;
import org.dom4j.Element;
import org.quickbundle.config.RmClusterConfig;
import org.quickbundle.config.RmConfig;
import org.quickbundle.config.RmLoadConfig;

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

		Element eleLoadCluster = (Element) rmClusterDoc.selectSingleNode("/rm/org.quickbundle.config.RmClusterConfig/*[1]");
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
}
