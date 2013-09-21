quickbundle骨架工程(包含JavaEE版、phonegap移动版)
================================================

quickbundle-rmwebdemo(JavaEE archetype project)
================================================

一键编译qb-core的方式二？（eclipse/plugins目录格式，安装到Eclipse时复制到$ECLIPSE_HOME/links/org.quickbundle_4.0.0目录即可）
------------------------------------------------
		cd qb-archetype/build/build-rmwebdemo; 
		mvn clean package; 
		插件包是qb-archetype/build/build-rmwebdemo/target/eclipse，复制到$ECLIPSE_HOME/links/org.quickbundle_4.0.0目录即可完成安装



		
quickbundle-phonegapdemo(mobile appliation archetype, corporate with java-archetype backend server)
================================================

如何一键编译phonegap：
------------------------------------------------
1，打开~/.m2/settings.xml，加入配置：
```	<servers>
		<server>
			<id>phonegap-build</id>
			<username>yourmail@gmail.com</username>
			<password>yourpassword******</password> 
		</server>
	</servers>
............
	<profiles>
		<profile>
			<id>dev</id>
			<properties>
				<phonegap-build.server>phonegap-build</phonegap-build.server>
			</properties>
......
```
		2，免费build.phonegap.com帐号只能上传一个private app，因此执行mvn phonegap-build:scorch清理掉已存在的private app（谨慎操作）
		3，cd /quickbundle-phonegapdemo> mvn clean install -Dmaven.test.skip=true
		4，apk、xap等文件，在$M2_REPO/org/quickbundle/quickbundle-phonegapdemo/4.0.0