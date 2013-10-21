package org.quickbundle.project.init;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.dom4j.Element;
import org.dom4j.Node;
import org.quickbundle.config.RmConfig;
import org.quickbundle.config.RmLoadConfig;

public class LoadClusterConfigXml extends AbatractLoadClusterConfig {

	public void init() {
		//集群模式的判断
		RmConfig.getSingleton().setClusterMode(RmLoadConfig.getRmClusterDoc().selectNodes("/rm/org.quickbundle.config.RmClusterConfig/node").size() > 1);
	}

	@SuppressWarnings("unchecked")
	public Map<String, String> getSelfNode() {
		Map<String, String> result = new HashMap<String, String>();
		Element node = (Element) RmLoadConfig.getRmClusterDoc().selectSingleNode(
				"/rm/org.quickbundle.config.RmClusterConfig/org.quickbundle.project.init.LoadClusterConfigXml/node[@id=../@thisId]");
		List<Node> keyValues = node.selectNodes("*|@*");
		for(Node keyValue : keyValues) {
			result.put(keyValue.getName(), keyValue.getText());
		}
		return result;
	}
	
	@SuppressWarnings("unchecked")
	public Map<String, Map<String, String>> getNodes() {
		Map<String, Map<String, String>> result = new HashMap<String, Map<String, String>>();
		
		List<Element> nodes = RmLoadConfig.getRmClusterDoc().selectNodes(
				"/rm/org.quickbundle.config.RmClusterConfig/org.quickbundle.project.init.LoadClusterConfigXml/node");
		for(Element node : nodes) {
			Map<String, String> nodeMap = new HashMap<String, String>();
			List<Node> keyValues = node.selectNodes("*|@*");
			for(Node keyValue : keyValues) {
				nodeMap.put(keyValue.getName(), keyValue.getText());
			}
			result.put(nodeMap.get(Key.id.name()), nodeMap);
		}
		return result;
	}
}
