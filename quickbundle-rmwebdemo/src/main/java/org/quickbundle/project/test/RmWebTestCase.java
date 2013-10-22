/*
 * 系统名称: QuickBundle --> rmdemo
 * 
 * 文件名称: org.quickbundle.test --> RmTestCase.java
 * 
 * 功能描述:
 * 
 * 版本历史:
 * 2006-6-5 20:44:44 创建1.0.0版 (baixiaoyong)
 * 
 */
package org.quickbundle.project.test;

import java.io.FileNotFoundException;

import junit.framework.TestCase;

import org.quickbundle.base.beans.factory.RmBeanFactory;
import org.quickbundle.tools.support.path.RmPathHelper;
import org.springframework.util.Log4jConfigurer;

/**
 * 功能、用途、现存BUG:
 * 
 * @author 白小勇
 * @version 1.0.0
 * @see 需要参见的其它类
 * @since 1.0.0
 */
public class RmWebTestCase extends TestCase {
	protected void setUp() throws Exception {
	    init();
	}
    
    /**
     * 初始化log4j和Spring配置
     */
    public final synchronized static void init() {
    	try {
			Log4jConfigurer.initLogging(RmPathHelper.getWarName() + "/WEB-INF/config/log4j/log4j.properties");
		} catch (FileNotFoundException e) {
			throw new RuntimeException(e);
		}
        RmBeanFactory.getBeanFactory();
    }
}