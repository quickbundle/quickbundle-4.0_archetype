package org.quickbundle.modules.message.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.quickbundle.modules.message.IMessageConstants;
import org.quickbundle.modules.message.dao.RmMessageDao;
import org.quickbundle.modules.message.dao.RmMessageReceiverDao;
import org.quickbundle.modules.message.vo.RmMessageReceiverVo;
import org.quickbundle.modules.message.vo.RmMessageVo;
import org.quickbundle.project.RmProjectHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
//默认将类中的所有public函数纳入事务管理
@Transactional(readOnly = true)
public class MessageService implements IMessageConstants {

	@Autowired
	private RmMessageDao rmMessageDao;
	
	@Autowired
	private RmMessageReceiverDao rmMessageReceiverDao;
	
    /**
     * 插入单条记录
     * 
     * @param vo 用于添加的VO对象
     * @return 若添加成功，返回新生成的Oid
     */
    public Long insert(RmMessageVo vo) {
        Long id = rmMessageDao.insert(vo);
        if(vo.getBody() != null) {
        	for(RmMessageReceiverVo bodyVo: vo.getBody()) {
        		bodyVo.setMessage_id(vo.getId());
        	}
        	rmMessageReceiverDao.insert(vo.getBody().toArray(new RmMessageReceiverVo[0]));
        }
        RmProjectHelper.log(LOG_TYPE_NAME, "插入了1条记录,id={},子记录{}条", id, vo.getBody() == null ? 0 : vo.getBody().size());
		return id;
    }
    
    /**
     * 插入多条记录
     *
     * @param vos 用于添加的VO对象数组
     * @return 返回新生成的id数组
     */
    public Long[] insert(RmMessageVo[] vos) {
        Long[] ids = rmMessageDao.insert(vos);
        List<RmMessageReceiverVo> bodyVoToInsert = new ArrayList<RmMessageReceiverVo>();
        for(RmMessageVo vo : vos) {
        	if(vo.getBody() != null) {
        		for(RmMessageReceiverVo bodyVo: vo.getBody()) {
        			bodyVo.setMessage_id(vo.getId());
        			bodyVoToInsert.add(bodyVo);
        		}
        	}
        }
        rmMessageReceiverDao.insert(bodyVoToInsert.toArray(new RmMessageReceiverVo[0]));
        RmProjectHelper.log(LOG_TYPE_NAME, "插入了{}条记录,id={},子记录共{}条", vos.length, Arrays.toString(ids), bodyVoToInsert.size());
        return ids;
    }

    /**
     * 删除单条记录
     * 
     * @param id 用于删除的记录的id
     * @return 成功删除的记录数
     */
    public int delete(Long id) {
    	List<Long> bodyIdToDelete = new ArrayList<Long>();
    	RmMessageVo vo = get(id);
    	if(vo.getBody() != null) {
    		for(RmMessageReceiverVo bodyVo : vo.getBody()) {
    			bodyIdToDelete.add(bodyVo.getId());
    		}
    	}
    	if(bodyIdToDelete.size() > 0) {
    		rmMessageReceiverDao.delete(bodyIdToDelete.toArray(new Long[0]));
    	}
		int sum = rmMessageDao.delete(id);
		RmProjectHelper.log(LOG_TYPE_NAME, "删除了{}条记录,id={},子记录{}条", sum, id, bodyIdToDelete.size());
		return sum;
    }

    /**
     * 删除多条记录
     * 
     * @param ids 用于删除的记录的ids
     * @return 成功删除的记录数
     */
    public int delete(Long ids[]) {
    	List<Long> bodyIdToDelete = new ArrayList<Long>();
    	for(Long id : ids) {
    		RmMessageVo vo = get(id);
    		if(vo.getBody() != null) {
    			for(RmMessageReceiverVo bodyVo : vo.getBody()) {
    				bodyIdToDelete.add(bodyVo.getId());
    			}
    		}
    	}
    	if(bodyIdToDelete.size() > 0) {
    		rmMessageReceiverDao.delete(bodyIdToDelete.toArray(new Long[0]));
    	}
		int sum = rmMessageDao.delete(ids);
        RmProjectHelper.log(LOG_TYPE_NAME, "删除了{}条记录,ids={},子记录共{}条", sum, Arrays.toString(ids), bodyIdToDelete.size());
		return sum;
    }

    /**
     * 更新单条记录
     * 
     * @param vo 用于更新的VO对象
     * @return 成功更新的记录数
     */
    @SuppressWarnings({ "rawtypes", "unchecked" })
	public int update(RmMessageVo vo) {
    	if(vo.getBody() != null) {
    		List[] result = mergeVos(vo, rmMessageReceiverDao.list("message_id=" + vo.getId(), null, 1, Integer.MAX_VALUE, true), vo.getBody());
    		rmMessageReceiverDao.insert((RmMessageReceiverVo[])result[0].toArray(new RmMessageReceiverVo[0]));
    		rmMessageReceiverDao.delete((Long[])result[1].toArray(new Long[0]));
    		rmMessageReceiverDao.update((RmMessageReceiverVo[])result[2].toArray(new RmMessageReceiverVo[0]));
    	}
		int sum = rmMessageDao.update(vo);
        RmProjectHelper.log(LOG_TYPE_NAME, "更新了{}条记录,id={}", sum, vo.getId());
		return sum;
    }

    /**
     * 批量更新修改多条记录
     * 
     * @param vos 更新的VO对象数组
     * @return 成功更新的记录最终数量
     */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public int update(RmMessageVo[] vos) {
    	List<RmMessageReceiverVo> toInsert = new ArrayList<RmMessageReceiverVo>();
    	List<Long> toDelete = new ArrayList<Long>();
    	List<RmMessageReceiverVo> toUpdate = new ArrayList<RmMessageReceiverVo>();
    	for(RmMessageVo vo : vos) {
    		if(vo.getBody() != null) {
        		List[] result = mergeVos(vo, rmMessageReceiverDao.list("message_id=" + vo.getId(), null, 1, Integer.MAX_VALUE, true), vo.getBody());
        		toInsert.addAll(result[0]);
        		toDelete.addAll(result[1]);
        		toUpdate.addAll(result[2]);
    		}
    	}
		rmMessageReceiverDao.insert(toInsert.toArray(new RmMessageReceiverVo[0]));
		rmMessageReceiverDao.delete(toDelete.toArray(new Long[0]));
		rmMessageReceiverDao.update(toUpdate.toArray(new RmMessageReceiverVo[0]));
		int[] sum = rmMessageDao.update(vos);
		int finalSum = 0;
		for (int i = 0; i < sum.length; i++) {
			finalSum += sum[i];
		}
		RmProjectHelper.log(LOG_TYPE_NAME, "批量更新了{}条记录", finalSum);
		return finalSum;
	}
    
	/**
	 * 比较老数据集与新数据集，得出insert/delete/update的最优序列
	 * @param vo
	 * @param oldVos
	 * @param newVos
	 * @return
	 */
	@SuppressWarnings("rawtypes")
	protected List[] mergeVos(RmMessageVo headVo, List<RmMessageReceiverVo> oldVos, List<RmMessageReceiverVo> newVos) {
    	List<RmMessageReceiverVo> toInsert = new ArrayList<RmMessageReceiverVo>();
    	List<Long> toDelete = new ArrayList<Long>();
    	List<RmMessageReceiverVo> toUpdate = new ArrayList<RmMessageReceiverVo>();
		List[] result = new List[]{toInsert, toDelete, toUpdate};
    	Map<Long, RmMessageReceiverVo> oldVoMap = new HashMap<Long, RmMessageReceiverVo>();
    	for(RmMessageReceiverVo oldVo : oldVos) {
    		oldVoMap.put(oldVo.getId(), oldVo);
    	}
    	for(RmMessageReceiverVo newVo : newVos) {
    		if(newVo.getId() != null && oldVoMap.containsKey(newVo.getId())){
    			toUpdate.add(newVo);
    			oldVoMap.remove(newVo.getId());
    		} else {
    			newVo.setMessage_id(headVo.getId());
    			toInsert.add(newVo);
    		}
    	}
    	for(Map.Entry<Long, RmMessageReceiverVo> en : oldVoMap.entrySet()) {
    		toDelete.add(en.getKey());
    	}
    	return result;
    }
	
    /**
     * 根据Id进行查询
     * 
     * @param id 用于查找的id
     * @return 查询到的VO对象
     */
    public RmMessageVo get(Long id) {
		RmMessageVo vo = rmMessageDao.get(id);
		List<RmMessageReceiverVo> body = rmMessageReceiverDao.list("message_id=" + String.valueOf(id), null, 1, Integer.MAX_VALUE, true);
		vo.setBody(body);
		return vo;
    }
    
    /**
     * 查询总记录数，带查询条件
     * 
     * @param queryCondition 查询条件
     * @return 总记录数
     */
    public int getCount(String queryCondition) {
		int sum = rmMessageDao.getCount(queryCondition);
		return sum;
    }

    /**
     * 功能: 通过查询条件获得所有的VO对象列表，不带翻页查全部，只查询必要的字段
     *
     * @param queryCondition 查询条件, queryCondition等于null或""时查询全部
     * @param orderStr 排序字段
     * @return 查询到的VO列表
     */
    public List<RmMessageVo> list(String queryCondition, String orderStr) {
        return list(queryCondition, orderStr, 1, Integer.MAX_VALUE);
    }

    /**
     * 功能: 通过查询条件获得所有的VO对象列表，带翻页，带排序字符，只查询必要的字段
     *
     * @param queryCondition 查询条件, queryCondition等于null或""时查询全部
     * @param orderStr 排序字符
     * @param startIndex 开始位置(第一条是1，第二条是2...)
     * @param size 查询多少条记录
     * @return 查询到的VO列表
     */
    public List<RmMessageVo> list(String queryCondition, String orderStr, int startIndex, int size) {
        return list(queryCondition, orderStr, startIndex, size, false);
    }
    
    /**
     * 功能: 通过查询条件获得所有的VO对象列表，带翻页，带排序字符，根据selectAllClumn判断是否查询所有字段
     *
     * @param queryCondition 查询条件, queryCondition等于null或""时查询全部
     * @param orderStr 排序字符
     * @param startIndex 开始位置(第一条是1，第二条是2...)
     * @param size 查询多少条记录
     * @param allColumn 是否查询所有列，即 SELECT * FROM ...(适用于导出)
     * @return 查询到的VO列表
     */
    public List<RmMessageVo> list(String queryCondition, String orderStr, int startIndex, int size, boolean allColumn) {
        List<RmMessageVo> lResult = rmMessageDao.list(queryCondition, orderStr, startIndex, size, allColumn);
        if(allColumn) {
        	for(RmMessageVo vo : lResult) {
        		List<RmMessageReceiverVo> body = rmMessageReceiverDao.list("message_id=" + String.valueOf(vo.getId()), null, 1, Integer.MAX_VALUE, true);
        		vo.setBody(body);
        	}
        }
        return lResult;
    }
    
    /**
     * @param searchPara 搜索参数的Map
     * @param orderStr 排序字符
     * @param startIndex 开始位置(第一条是1，第二条是2...)
     * @param size 查询多少条记录
     * @return 查询到的VO列表
     */
    public List<RmMessageVo> search(Map<String, Object> searchPara, String orderStr, int startIndex, int size) {
    	List<RmMessageVo> lResult = rmMessageDao.search(searchPara, orderStr, startIndex, size);
    	return lResult;
    }
}
