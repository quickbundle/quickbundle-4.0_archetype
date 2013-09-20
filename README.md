qb-archetype
============

archetype project list for quickbundle


------------quickbundle-rmwebdemo------------
java archetype project

如何打包插件？
cd qb-archetype/build/build-rmwebdemo; mvn clean package; 插件包是qb-archetype/build/build-rmwebdemo/target/eclipse，放到eclipse目录的links/org.quickbundle下




------------quickbundle-phonegapdemo------------
a group of mobile appliation archetype, corporate with java-archetype backend server

如何一键编译phonegap：
1，打开~/.m2/settings.xml，加入配置：
	<servers>
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
2，免费build.phonegap.com帐号只能上传一个private app，因此执行mvn phonegap-build:scorch清理掉已存在的private app（谨慎操作）
3，cd /quickbundle-phonegapdemo> mvn clean install -Dmaven.test.skip=true
4，apk、xap等文件，在$M2_REPO/org/quickbundle/quickbundle-phonegapdemo/4.0.0