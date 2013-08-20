package org.quickbundle.third.quartz.util;

import java.util.Iterator;

import javax.servlet.http.HttpServletRequest;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.quartz.JobDataMap;
import org.quickbundle.third.quartz.jobdetail.vo.JobDetailVo;

public class SchedulerHelper implements ISchedulerConstants {
	/**
	 * 解析json格式的params参数
	 * @param vo 注入params的Vo
	 * @param request 获取json数据的request
	 */
	public static JobDataMap parseDataMap(HttpServletRequest request) {		
		String params=request.getParameter(REQ_DATA_MAP);
		if(params == null)
			return null;
		JobDataMap dataMap=new JobDataMap();
		//转换json为map
		JSONArray paramsJo=(JSONArray)JSONObject.fromObject(params).get("params");
		Iterator itParams = paramsJo.iterator();
		while(itParams.hasNext()){
			JSONObject jo = (JSONObject)itParams.next();
			if(!"".equals(jo.get("name"))) {
				dataMap.put(String.valueOf(jo.get("name")), String.valueOf(jo.get("des")));
			}
		}
		return dataMap;
	}
}
