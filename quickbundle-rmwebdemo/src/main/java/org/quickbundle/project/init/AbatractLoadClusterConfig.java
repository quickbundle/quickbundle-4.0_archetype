package org.quickbundle.project.init;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.quickbundle.config.RmClusterConfig;
import org.quickbundle.util.RmSequenceMap;

public abstract class AbatractLoadClusterConfig {

	public enum Key {
		id,
		serverId,
		urlPrefix,
		webServiceUrl,
		user,
		password
	}
	
	protected String getSelfId() {
		return RmClusterConfig.getSingleton().getSelfId();
	}

	public abstract void init();

	public abstract Map<String, String> getSelfNode();
	
	public abstract Map<String, Map<String, String>> getNodes();
	
	public Map<String, String> getNode(String serverId) {
		return getNodes().get(serverId);
	}
	
	/**
	 * 获得集群模式下其他节点的webservice地址前缀
	 * 
	 * @return
	 */
	public Map<String, String> getOtherWsUrl() {
		Map<String, String> result = new RmSequenceMap<String, String>();
		String thisId = getSelfId();
		Map<String, Map<String, String>> nodes = getNodes();
		nodes.remove(thisId);
		for (Map.Entry<String, Map<String, String>> en : nodes.entrySet()) {
			result.put(en.getKey(), en.getValue().get(Key.webServiceUrl.name()));
		}
		return result;
	}

	public List<String> getOtherNodeId() {
		String thisId = getSelfId();
		Map<String, Map<String, String>> nodes = getNodes();
		nodes.remove(thisId);
		return new ArrayList<String>(nodes.keySet());
	}
	
	public Map<String, String> getAuth(String serverId) {
		Map<String, String> nodeInfo = getNode(serverId);
		Map<String, String> result = new HashMap<String, String>();
		result.put(nodeInfo.get(Key.user.name()), nodeInfo.get(Key.password.name()));
		return result;
	}
	
	public String getWsUrl(String serverId) {
		Map<String, String> node = getNode(serverId);
		if(node == null) {
			return null;
		}
		return node.get(Key.webServiceUrl.name());
	}

	public String getUrlPrefix(String serverId) {
		Map<String, String> node = getNode(serverId);
		if(node == null) {
			return null;
		}
		return node.get(Key.urlPrefix.name());
	}
}
