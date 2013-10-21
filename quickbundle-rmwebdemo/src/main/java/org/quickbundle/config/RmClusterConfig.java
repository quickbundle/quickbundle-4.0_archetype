package org.quickbundle.config;

import org.dom4j.Document;
import org.dom4j.Element;
import org.quickbundle.project.init.AbatractLoadClusterConfig;
import org.quickbundle.project.init.LoadProjectConfig;


public class RmClusterConfig {

	/**
	 * 集群配置类的全局唯一单例
	 */
	private static RmClusterConfigVo singleton = new RmClusterConfigVo();
	
	/**
	 * 得到集群配置类的全局唯一单例
	 * @return the singleton
	 */
	public static RmClusterConfigVo getSingleton() {
		return singleton;
	}

	public static void main(String[] args) {
		Document rmClusterDoc = RmLoadConfig.getRmClusterDoc();
		Element eleLoadCluster = (Element) rmClusterDoc.selectSingleNode("/rm/org.quickbundle.config.RmClusterConfig/*[1]");
		String classNameLoadCluster = eleLoadCluster.getName();
		try {
			AbatractLoadClusterConfig alcc = (AbatractLoadClusterConfig) LoadProjectConfig.class.getClassLoader().loadClass(classNameLoadCluster).newInstance();
			alcc.init();
			RmClusterConfig.getSingleton().setLoadClusterConfig(alcc);
		} catch (Exception e) {
			e.printStackTrace();
		}
		System.out.println(singleton.getLocalhostInfo());
		System.out.println(singleton.getContextPath());
		System.out.println(singleton.getSelfId());
		System.out.println(singleton.getSelfWsUrl());
		System.out.println(singleton.getOtherWsUrl());
		System.out.println(singleton.getAuth("server1"));
	}
}