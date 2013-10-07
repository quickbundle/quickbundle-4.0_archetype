package org.quickbundle.project.init;

import org.dom4j.Document;
import org.quickbundle.config.RmConfig;
import org.quickbundle.config.RmLoadConfig;

public class LoadRmConfig {

	/**
	 * 初始化rm.xml
	 */
	public static void initRmConfig() {
		Document rmDoc = RmLoadConfig.getRmDoc();
		PopulateConfig pc = new PopulateConfig(RmConfig.getSingleton(), rmDoc);
		pc.populate();
		
		Document rmClusterDoc = RmLoadConfig.getRmClusterDoc();
		PopulateConfig pc2 = new PopulateConfig(RmConfig.getSingleton(), rmClusterDoc);
		pc2.populate();
		
		{ // 集群模式的判断
			RmConfig.getSingleton().setClusterMode(rmClusterDoc.selectNodes("/rm/org.quickbundle.base.cloud.RmClusterConfig/node").size() > 1);
		}
	}
}
