package org.quickbundle.modules.rmmessage.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.quickbundle.modules.rmmessage.IRmMessageConstants;
import org.quickbundle.modules.rmmessage.dao.RmMessageDao;
import org.quickbundle.modules.rmmessage.vo.RmMessageVo;
import org.quickbundle.project.RmProjectHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
//默认将类中的所有public函数纳入事务管理
@Transactional(readOnly = true)
public class RmMessageService implements IRmMessageConstants {

	@Autowired
	private RmMessageDao rmMessageDao;
	
    /**
     * 插入单条记录
     * 
     * @param vo 用于添加的VO对象
     * @return 若添加成功，返回新生成的Oid
     */
    public Long insert(RmMessageVo vo) {
        Long id = rmMessageDao.insert(vo);
        RmProjectHelper.log(LOG_TYPE_NAME, "插入了1条记录,id={}", id);
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
        RmProjectHelper.log(LOG_TYPE_NAME, "插入了{}条记录,id={}", vos.length, Arrays.toString(ids));
        return ids;
    }

    /**
     * 删除单条记录
     * 
     * @param id 用于删除的记录的id
     * @return 成功删除的记录数
     */
    public int delete(Long id) {
		int sum = rmMessageDao.delete(id);
		RmProjectHelper.log(LOG_TYPE_NAME, "删除了{}条记录,id={}", sum, id);
		return sum;
    }

    /**
     * 删除多条记录
     * 
     * @param ids 用于删除的记录的ids
     * @return 成功删除的记录数
     */
    public int delete(Long ids[]) {
		int sum = rmMessageDao.delete(ids);
        RmProjectHelper.log(LOG_TYPE_NAME, "删除了{}条记录,id={}", sum, Arrays.toString(ids));
		return sum;
    }

    /**
     * 更新单条记录
     * 
     * @param vo 用于更新的VO对象
     * @return 成功更新的记录数
     */
    public int update(RmMessageVo vo) {
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
	public int update(RmMessageVo[] vos) {
		int[] sum = rmMessageDao.update(vos);
		int finalSum = 0;
		for (int i = 0; i < sum.length; i++) {
			finalSum += sum[i];
		}
		RmProjectHelper.log(LOG_TYPE_NAME, "批量更新了{}条记录", finalSum);
		return finalSum;
	}
	
	/**
	 * 批量保存，没有主键的insert，有主键的update
	 * 
	 * @param vos 更新的VO对象数组
	 * @return new int[2]{insert的记录数, update的记录数}	
	 */
	public int[] insertUpdateBatch(RmMessageVo[] vos) {
		int[] sum_insert_update = new int[2];
		List<RmMessageVo> lInsert = new ArrayList<RmMessageVo>();
		List<RmMessageVo> lUpdate = new ArrayList<RmMessageVo>();
		for (int i = 0; i < vos.length; i++) {
			if(vos[i].getId() != null) {
				lUpdate.add(vos[i]);
			} else {
				lInsert.add(vos[i]);
			}
		}
		if(lInsert.size() > 0) {
			sum_insert_update[0] = insert(lInsert.toArray(new RmMessageVo[0])).length;
		}
		if(lUpdate.size() > 0) {
			sum_insert_update[1] = update(lUpdate.toArray(new RmMessageVo[0]));
		}
		return sum_insert_update;
	}

    /**
     * 根据Id进行查询
     * 
     * @param id 用于查找的id
     * @return 查询到的VO对象
     */
    public RmMessageVo get(Long id) {
		RmMessageVo vo = rmMessageDao.get(id);
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
     * @param allClumn 是否查询所有列，即 SELECT * FROM ...(适用于导出)
     * @return 查询到的VO列表
     */
    public List<RmMessageVo> list(String queryCondition, String orderStr, int startIndex, int size, boolean allClumn) {
        List<RmMessageVo> lResult = rmMessageDao.list(queryCondition, orderStr, startIndex, size, allClumn);
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
