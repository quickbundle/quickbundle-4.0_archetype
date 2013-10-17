package org.quickbundle.config;

import java.net.InetAddress;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.dom4j.Element;
import org.quickbundle.base.web.servlet.RmHolderServlet;
import org.quickbundle.project.cache.RmCacheHandler;
import org.quickbundle.project.init.DefaultLoadRmClusterConfig;

public class RmClusterConfigVo {
	
	private HostInfo localhostInfo = null;
	private volatile boolean isInit = false;

	public void initLocalhostInfo(HttpServletRequest request) {
		if (!isInit) {
			synchronized (RmClusterConfig.class) {
				if (!isInit) {
					localhostInfo = new HostInfo();
					localhostInfo.setScheme(request.getScheme());
					localhostInfo.setServerName(request.getServerName());
					localhostInfo.setServerPort(request.getServerPort());
					localhostInfo.setContextPath(request.getContextPath());
					isInit = true;
				}
			}
		}
	}

	public HostInfo getLocalhostInfo() {
		return localhostInfo;
	}

	private DefaultLoadRmClusterConfig loadRmClusterConfig;
	
	public DefaultLoadRmClusterConfig getLoadRmClusterConfig() {
		return loadRmClusterConfig;
	}

	public void setLoadRmClusterConfig(DefaultLoadRmClusterConfig loadRmClusterConfig) {
		this.loadRmClusterConfig = loadRmClusterConfig;
	}

	public Element getSelfNode() {
		return loadRmClusterConfig.getSelfNode();
	}

	/**
	 * 获得contextPath
	 * 
	 * @return
	 */
	public String getContextPath() {
		if (getLocalhostInfo() != null) {
			return getLocalhostInfo().getContextPath();
		} else if (RmHolderServlet.getDefaultServletContext() != null) {
			try {
				return RmHolderServlet.getDefaultServletContext().getContextPath();
			} catch (Throwable e) {
				e.printStackTrace();
				RmCacheHandler.logCache.error("JavaEE version to low: " + e.toString());
			}
		}
		return getSelfNode().valueOf("contextPath");
	}

	/**
	 * 获得集群模式下本节点的id
	 * 
	 * @return
	 */
	public String getSelfId() {
		if (RmBaseConfig.getSingleton().isCloudNodeInfoAuto()) {
			try {
				return InetAddress.getLocalHost().toString();
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		return getSelfNode().valueOf("@id");
	}

	/**
	 * 获得集群模式下本节点的webservice地址前缀
	 * 
	 * @return
	 */
	public String getSelfWsUrl() {
		if (RmBaseConfig.getSingleton().isCloudNodeInfoAuto() && localhostInfo != null) {
			String localhost = localhostInfo.getScheme() + "://" + localhostInfo.getServerName() + ":" + localhostInfo.getServerPort();
			return localhost + getContextPath() + "/services/";
		}
		return getSelfNode().valueOf("webServiceUrl");
	}

	public List<String> getOtherNodeId() {
		return loadRmClusterConfig.getOtherNodeId();
	}

	public Map<? extends String, ? extends String> getAuth(String nodeId) {
		return loadRmClusterConfig.getAuth(nodeId);
	}

	public String getWsUrl(String clusterNodeId) {
		return loadRmClusterConfig.getWsUrl(clusterNodeId);
	}

	public Object getUrlPrefix(String selfId) {
		return loadRmClusterConfig.getUrlPrefix(selfId);
	}

	public Map<String, String> getOtherWsUrl() {
		return loadRmClusterConfig.getOtherWsUrl();
	}

}
