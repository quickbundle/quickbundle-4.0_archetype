package org.quickbundle.project.init;

import java.io.File;
import java.net.MalformedURLException;
import java.util.HashMap;
import java.util.Map;

import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.quickbundle.base.exception.RmRuntimeException;
import org.quickbundle.project.RmProjectHelper;
import org.quickbundle.tools.helper.xml.RmXmlHelper;
import org.quickbundle.tools.support.path.RmPathHelper;

public class RmLoadXml {
    
	public enum RmConfigEnum {
		RM_XML("/WEB-INF/config/rm/rm.xml"),
		RM_CLUSTER_XML("/WEB-INF/config/rm/rmCluster.xml");
		private String path;
		RmConfigEnum(String path) {
			this.path = path;
		}
		public String getPath() {
			return path;
		}
	}
    
	private static RmLoadXml singleton = new RmLoadXml();
	
    /**
	 * @return the singleton
	 */
	public static RmLoadXml getSingleton() {
		return singleton;
	}
	
	private Map<String, RmLoadXmlVo> mLoadXmlVo = new HashMap<String, RmLoadXmlVo>();
	public RmLoadXml() {
		RmConfigEnum[] ces = RmConfigEnum.values();
		for(RmConfigEnum ce : ces) {
			mLoadXmlVo.put(ce.name(), new RmLoadXmlVo());
		}
	}
    
    public Document getInnerDoc(String key, String path) {
    	return getInnerDoc(key, path, RmPathHelper.getWarDir().toString());
    }
    
    /**
     * 功能: 获得rm.xml
	 * 
     * @param warDir war目录的真实路径
     * @param filePath doc文件相对路径
     * @return
     */
    public Document getInnerDoc(String key, String path, String warDir) {
    	RmLoadXmlVo loadXmlVo = mLoadXmlVo.get(key);
    	if(loadXmlVo == null) {
    		loadXmlVo = new RmLoadXmlVo();
    		mLoadXmlVo.put(key, loadXmlVo);
    	}
        String xmlFullPath = warDir + path;
        xmlFullPath = RmXmlHelper.formatToFile(xmlFullPath);
        if(!loadXmlVo.isInit) {
        	doLoad(loadXmlVo, xmlFullPath);
        } else {
        	if(RmConfig.getSingleton().isSystemDebugMode()) {
                File docFile = new File(xmlFullPath);
                if(docFile.lastModified() != loadXmlVo.lastModifiedTime) {
                	loadXmlVo.isInit = false;
                	doLoad(loadXmlVo, xmlFullPath);
                }
        	}

        }
        return loadXmlVo.doc;
    }
    
    private void doLoad(RmLoadXmlVo loadXmlVo, String xmlFullPath) {
        if(!loadXmlVo.isInit) {
            synchronized (RmProjectHelper.class) {
            	if(!loadXmlVo.isInit) {
            		try {
            			loadXmlVo.doc = RmXmlHelper.parse(xmlFullPath);
            			loadXmlVo.isInit = true;
            		} catch (MalformedURLException e) {
            			throw new RmRuntimeException("load " + xmlFullPath +" error", e);
            		} catch (DocumentException e) {
            			throw new RmRuntimeException("load " + xmlFullPath +" error", e);
            		}
            	}
            }
        }
    }
}

class RmLoadXmlVo {
    Document doc = null;
    long lastModifiedTime = 0;
    volatile boolean isInit = false;

}