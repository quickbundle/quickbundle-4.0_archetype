package org.quickbundle.project.init;

import org.quickbundle.config.RmBaseConfig;
import org.quickbundle.config.RmBaseConfigVo;

public final class RmConfig extends RmBaseConfig {
	
	/**
	 * 配置类的全局唯一单例
	 */
	private static RmConfigVo singleton = new RmConfigVo(RmBaseConfig.getSingleton());
	
	/**
	 * 得到配置类的全局唯一单例
	 * @return the singleton
	 */
	public static RmConfigVo getSingleton() {
		return singleton;
	}
}