package org.quickbundle.project.init;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.dom4j.Element;
import org.quickbundle.config.RmBaseConfig;
import org.quickbundle.config.RmClusterConfig;
import org.quickbundle.config.RmConfig;
import org.quickbundle.config.RmLoadConfig;
import org.quickbundle.project.common.vo.RmCommonVo;
import org.quickbundle.tools.context.RmBeanHelper;
import org.quickbundle.tools.helper.RmSqlHelper;
import org.quickbundle.tools.helper.RmUUIDHelper;

public class LoadClusterConfigDbNext extends AbatractLoadClusterConfig {

	public void init() {
		//集群模式的判断
		long activeNodes = RmBeanHelper.getCommonServiceInstance().doQueryForInt("select count(*) from RM_NODE_HEARTBEAT where " + RmSqlHelper.getFunction(RmSqlHelper.Function.SYSDATE, RmConfig.getSingleton().getDatabaseProductName())  + "-LAST_HEARTBEAT < 1000*60");
		RmConfig.getSingleton().setClusterMode(activeNodes > 1);
		
	}

	public Map<String, String> getSelfNode() {
		Map<String, String> result = new HashMap<String, String>();
		result.put(Key.id.name(), RmUUIDHelper.generateUUID());
		if(RmClusterConfig.getSingleton().getLocalhostInfo() != null) {
			result.put(Key.urlPrefix.name(), "");
			result.put(Key.webServiceUrl.name(), "");
			result.put(Key.user.name(), "");
			result.put(Key.password.name(), "");
		} else {
			
		}
		result.put(Key.serverId.name(), "1");
		return result;
	}
	
	public Map<String, Map<String, String>> getNodes() {
		Map<String, Map<String, String>> result = new HashMap<String, Map<String, String>>();
		
		List<RmCommonVo> nodes = RmBeanHelper.getCommonServiceInstance().doQuery("select * from RM_NODE_HEARTBEAT where " + RmSqlHelper.getFunction(RmSqlHelper.Function.SYSDATE, RmConfig.getSingleton().getDatabaseProductName())  + "-LAST_HEARTBEAT < 1000*60");
		for(RmCommonVo node : nodes) {
			Map<String, String> nodeMap = new HashMap<String, String>();
			nodeMap.put(Key.urlPrefix.name(), "");
			nodeMap.put(Key.webServiceUrl.name(), "");
			nodeMap.put(Key.user.name(), "");
			nodeMap.put(Key.password.name(), "");
			result.put(nodeMap.get("id"), nodeMap);
		}
		return result;
	}
//	
//	void parse() {
//		if (RmBaseConfig.getSingleton().isCloudNodeInfoAuto() && localhostInfo != null) {
//			String localhost = localhostInfo.getScheme() + "://" + localhostInfo.getServerName() + ":" + localhostInfo.getServerPort();
//			return localhost + getContextPath() + "/services/";
//		}
//	}
}
