package org.quickbundle.project.init;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.dom4j.Element;
import org.dom4j.Node;
import org.quickbundle.config.RmClusterConfig;
import org.quickbundle.config.RmConfig;
import org.quickbundle.config.RmLoadConfig;
import org.quickbundle.util.RmSequenceMap;

public class DefaultLoadRmClusterConfig {

	public void init() {
		//集群模式的判断
		RmConfig.getSingleton().setClusterMode(RmLoadConfig.getRmClusterDoc().selectNodes("/rm/org.quickbundle.base.cloud.RmClusterConfig/node").size() > 1);
	}

	public Element getSelfNode() {
		return (Element) RmLoadConfig.getRmClusterDoc().selectSingleNode(
				"/rm/org.quickbundle.base.cloud.RmClusterConfig/org.quickbundle.project.init.DefaultLoadRmClusterConfig/node[@id=../@thisId]");
	}

	public String getWsUrl(String serverId) {
		if (serverId == null) {
			return null;
		}
		Element node = (Element) RmLoadConfig.getRmClusterDoc().selectSingleNode(
				"/rm/org.quickbundle.base.cloud.RmClusterConfig/org.quickbundle.project.init.DefaultLoadRmClusterConfig/node[@id='" + serverId + "']");
		if (node == null) {
			return null;
		}
		return node.valueOf("webServiceUrl");
	}

	public String getUrlPrefix(String serverId) {
		if (serverId == null) {
			return null;
		}
		Element node = (Element) RmLoadConfig.getRmClusterDoc().selectSingleNode(
				"/rm/org.quickbundle.base.cloud.RmClusterConfig/org.quickbundle.project.init.DefaultLoadRmClusterConfig/node[@id='" + serverId + "']");
		if (node == null) {
			return null;
		}
		return node.valueOf("urlPrefix");
	}

	/**
	 * 获得集群模式下其他节点的webservice地址前缀
	 * 
	 * @return
	 */
	public Map<String, String> getOtherWsUrl() {
		String thisId = getSelfId();
		List<Element> lOther = RmLoadConfig.getRmClusterDoc().selectNodes(
				"/rm/org.quickbundle.base.cloud.RmClusterConfig/org.quickbundle.project.init.DefaultLoadRmClusterConfig/node[not(@id='" + thisId + "')]");
		Map<String, String> mUrl = new RmSequenceMap<String, String>();
		for (Element ele : lOther) {
			mUrl.put(ele.valueOf("@id"), ele.valueOf("webServiceUrl"));
		}
		return mUrl;
	}

	public List<String> getOtherNodeId() {
		String thisId = getSelfId();
		List<Element> lOther = RmLoadConfig.getRmClusterDoc().selectNodes(
				"/rm/org.quickbundle.base.cloud.RmClusterConfig/org.quickbundle.project.init.DefaultLoadRmClusterConfig/node[not(@id='" + thisId + "')]");
		List<String> lNodeId = new ArrayList<String>();
		for (Element ele : lOther) {
			lNodeId.add(ele.valueOf("@id"));
		}
		return lNodeId;
	}

	public Map<String, String> getAuth(String serverId) {
		final Node node = RmLoadConfig.getRmClusterDoc().selectSingleNode(
				"/rm/org.quickbundle.base.cloud.RmClusterConfig/org.quickbundle.project.init.DefaultLoadRmClusterConfig/node[@id='" + serverId + "']");
		return new HashMap<String, String>() {
			{
				this.put(node.valueOf("user"), node.valueOf("password"));
			}
		};
	}

	private String getSelfId() {
		return RmClusterConfig.getSingleton().getSelfId();
	}
}
