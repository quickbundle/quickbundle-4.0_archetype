package org.quickbundle.config;

import java.util.List;

import org.dom4j.Document;
import org.dom4j.Element;
import org.dom4j.Node;
import org.quickbundle.tools.support.log.RmLogHelper;
import org.springframework.beans.BeanWrapper;
import org.springframework.beans.BeanWrapperImpl;

public class PopulateConfig {
	private RmConfigVo config;
	private Document doc;
	
	public PopulateConfig(RmConfigVo config, Document doc) {
		this.config = config;
		this.doc = doc;
	}
	
	@SuppressWarnings("unchecked")
	public void populate() {
        BeanWrapper bw = new BeanWrapperImpl(config);
		List<Node> nodes = doc.selectNodes("/rm/org.quickbundle.config.RmConfig/node()");
		for(Node node : nodes) {
			if(!(node instanceof Element)) {
				continue;
			}
			Element ele = (Element) node;
			String key = ele.getName();
			String value = ele.getText().trim();
			try {
				bw.setPropertyValue(key, value);
			} catch (Throwable e) {
				RmLogHelper.error(this.getClass(), key + "=>" + value + ", " + e.toString());
			}
		}
	}
}
