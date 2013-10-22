package org.quickbundle.project.init;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ThreadFactory;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

import org.quickbundle.config.RmConfig;
import org.quickbundle.tools.context.RmBeanHelper;
import org.quickbundle.tools.helper.RmSqlHelper;

public class NodeHeartbeatDaemon {
	private NodeHeartbeatDaemon() {
	}
	private static NodeHeartbeatDaemon singleton = new NodeHeartbeatDaemon();
	public static NodeHeartbeatDaemon getSingleton() {
		return singleton;
	}
	
	/**
	 * 刷新节点心跳
	 */
	private ScheduledExecutorService executor = Executors.newSingleThreadScheduledExecutor(new ThreadFactory() {
        final ThreadGroup group;
        final AtomicInteger threadNumber = new AtomicInteger(1);
        final String namePrefix;

        {
            SecurityManager s = System.getSecurityManager();
            group = (s != null)? s.getThreadGroup() : Thread.currentThread().getThreadGroup();
            namePrefix = "NodeHeartbeat";
        }

        public Thread newThread(Runnable r) {
            Thread t = new Thread(group, r, namePrefix + threadNumber.getAndIncrement(), 0);
            if (t.isDaemon()) {
            	t.setDaemon(false);
            }
            if (t.getPriority() != Thread.NORM_PRIORITY) {
            	t.setPriority(Thread.NORM_PRIORITY);
            }
            return t;
        }
	});
	
	public void start() {
		executor.scheduleWithFixedDelay(new Runnable() {
			public void run() {
				String sql = "update RM_NODE_HEARTBEAT set version=version+1, LAST_HEARTBEAT=" + RmSqlHelper.getFunction(RmSqlHelper.Function.SYSDATE, RmConfig.getSingleton().getDatabaseProductName());
				RmBeanHelper.getCommonServiceInstance().doUpdate(sql);
			}
		}, 0, 30, TimeUnit.SECONDS);
	}
	
	public void shutdown() {
		executor.shutdown();
	}
}
