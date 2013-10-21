package org.quickbundle.config;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.quickbundle.base.web.servlet.RmHolderServlet;
import org.quickbundle.project.cache.RmCacheHandler;
import org.quickbundle.project.init.AbatractLoadClusterConfig;

public class RmClusterConfigVo {
	
	private HostInfo localhostInfo = null;
	private volatile boolean isInit = false;

	public HostInfo getLocalhostInfo() {
		return localhostInfo;
	}
	
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

	private AbatractLoadClusterConfig loadClusterConfig;
	
	public AbatractLoadClusterConfig getLoadClusterConfig() {
		return loadClusterConfig;
	}

	public void setLoadClusterConfig(AbatractLoadClusterConfig loadClusterConfig) {
		this.loadClusterConfig = loadClusterConfig;
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
		if(loadClusterConfig == null) {
			return null;
		}
		return loadClusterConfig.getSelfNode().get("contextPath");
	}

	/**
	 * 获得集群模式下本节点的id
	 * 
	 * @return
	 */
	public String getSelfId() {
		if(loadClusterConfig == null) {
			return null;
		}
		return loadClusterConfig.getSelfNode().get("id");
	}

	/**
	 * 获得集群模式下本节点的webservice地址前缀
	 * 
	 * @return
	 */
	public String getSelfWsUrl() {
		if(loadClusterConfig == null) {
			return null;
		}
		return loadClusterConfig.getSelfNode().get("webServiceUrl");
	}

	public List<String> getOtherNodeId() {
		if(loadClusterConfig == null) {
			return null;
		}
		return loadClusterConfig.getOtherNodeId();
	}

	public Map<? extends String, ? extends String> getAuth(String nodeId) {
		if(loadClusterConfig == null) {
			return null;
		}
		return loadClusterConfig.getAuth(nodeId);
	}

	public String getWsUrl(String clusterNodeId) {
		if(loadClusterConfig == null) {
			return null;
		}
		return loadClusterConfig.getWsUrl(clusterNodeId);
	}

	public Object getUrlPrefix(String selfId) {
		if(loadClusterConfig == null) {
			return null;
		}
		return loadClusterConfig.getUrlPrefix(selfId);
	}

	public Map<String, String> getOtherWsUrl() {
		if(loadClusterConfig == null) {
			return null;
		}
		return loadClusterConfig.getOtherWsUrl();
	}

}
