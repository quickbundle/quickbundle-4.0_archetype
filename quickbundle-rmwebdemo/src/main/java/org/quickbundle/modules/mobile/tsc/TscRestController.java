package org.quickbundle.modules.mobile.tsc;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.quickbundle.modules.mobile.phonegapdemo.ReceiptInfo;
import org.quickbundle.project.serializer.RmObjectMapper;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.core.JsonProcessingException;

@Controller
@RequestMapping(value = "/api/tsc")
public class TscRestController {

	public final static String base = "http://tsc.bayinyueqi.com";


/**
1.精品推荐 排行榜 限时优惠 搜索
[
	{
	type = "新书推荐",
	all  = "http://",//获取这个分类列表的一个url,分类列表结构是下一个api
	list = [
				{
			id="1",//这本书的唯一id,要用这个id获取详细信息
			icon="http://../a.png",
			title="水浒传",
			type="国学",
			price="6",//0代表免费
			listen="",试听的mp3地址
			down ="",下载地址
			},
			{
			id="1",//这本书的唯一id
			icon="http://../a.png",
			title="水浒传",
			type="国学",
			price="6",//0代表免费
			listen="",试听的mp3地址
			down ="",下载地址
			}
		]	
	},
		{
	type = "国学", //外语，有声读物等
	all  = "http://",//获取这个分类列表的一个url
	list = [
				{
			id="1",//这本书的唯一id
			icon="http://../a.png",
			title="水浒传",
			type="国学",
			price="6",//0代表免费
			listen="",试听的mp3地址
			down ="",下载地址
			},
			{
			id="1",//这本书的唯一id
			icon="http://../a.png",
			title="水浒传",
			type="国学",
			price="6",//0代表免费
			listen="",试听的mp3地址
			down ="",下载地址
			}
		]	
	}
	...
]
 */
	@RequestMapping(value = "/listRank", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public String listRank() throws JsonProcessingException {
		List<Map<String, Object>> result = new ArrayList<Map<String, Object>>();
		{
			Map<String, Object> map = new HashMap<String, Object>();
			List<AudiobookVo> lvo = new ArrayList<AudiobookVo>();
			{
				AudiobookVo vo = new AudiobookVo();
				vo.setId("1");
				vo.setIcon(base + "/upload/a.png");
				vo.setTitle("水浒传");
				vo.setType("国学");
				vo.setPrice("6");
				vo.setListen(base + "/upload/a.mp3");
				vo.setDown(base + "/upload/a.zip");
				lvo.add(vo);
			}
			{
				AudiobookVo vo = new AudiobookVo();
				vo.setId("1");
				vo.setIcon(base + "/upload/b.png");
				vo.setTitle("三国演义");
				vo.setType("国学");
				vo.setPrice("6");
				vo.setListen(base + "/upload/b.mp3");
				vo.setDown(base + "/upload/b.zip");
				lvo.add(vo);
			}
			map.put("type", "新书推荐");
			map.put("all", base + "/api/tsc/listBook");
			map.put("list", lvo);
			result.add(map);
		}
		{
			Map<String, Object> map = new HashMap<String, Object>();
			List<AudiobookVo> lvo = new ArrayList<AudiobookVo>();
			{
				AudiobookVo vo = new AudiobookVo();
				vo.setId("1");
				vo.setIcon(base + "/upload/a.png");
				vo.setTitle("水浒传");
				vo.setType("国学");
				vo.setPrice("6");
				vo.setListen(base + "/upload/a.mp3");
				vo.setDown(base + "/upload/a.zip");
				lvo.add(vo);
			}
			{
				AudiobookVo vo = new AudiobookVo();
				vo.setId("1");
				vo.setIcon(base + "/upload/b.png");
				vo.setTitle("三国演义");
				vo.setType("国学");
				vo.setPrice("6");
				vo.setListen(base + "/upload/b.mp3");
				vo.setDown(base + "/upload/b.zip");
				lvo.add(vo);
			}
			map.put("type", "国学");
			map.put("all", base + "/api/tsc/listBook");
			map.put("list", lvo);
			result.add(map);
		}
		return RmObjectMapper.getInstance().writeValueAsString(result);

	}

	/**
	 * 
2.分类列表
基本上就是上一个api里的all的实现，只是不同的类型罢了。
[
 {
 id = "1",//跟书的id一样
 icon= "http://../a.png",
 type="小说",
 title="水浒传",
 author="xxx",
 reader="",
 size="100M",
 price="",0代表免费
 listen="",试听的mp3地址
 down ="",下载地址 
 },
  {
 
 }
 ....
]
	 */
	@RequestMapping(value = "/listBook/{type}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public String listBook(@PathVariable("id") String type) throws JsonProcessingException {
		List<AudiobookVo> result = new ArrayList<AudiobookVo>();
		{
			AudiobookVo vo = new AudiobookVo();
			vo.setId("1");
			vo.setIcon(base + "/upload/b.png");
			vo.setTitle("水浒传");
			vo.setType("国学");
			vo.setPrice("6");
			vo.setListen(base + "/upload/b.mp3");
			vo.setDown(base + "/upload/b.zip");
			vo.setAuthor("施耐庵");
			vo.setReader("张三");
			result.add(vo);
		}
		return RmObjectMapper.getInstance().writeValueAsString(result);
	}

	/**
3.图书详情
{
 id = "1",
 icon= "http://../a.png",
 type="小说",
 title="水浒传",
 author="xxx",
 reader="",
 size="100M",
 listen="",试听的mp3地址
 down ="",下载地址
 price="",0代表免费
 content="",简介
 imgae = [
 "",
 "",
 "",
 ""
 ],四个图片的url
 review = [
 	{
 		name="冯红兵",
 		start="4",
 		up = "5",//赞
 		text="",评论内容
 	}
 ],
 related= [
 	{
 			id="1",//这本书的唯一id
			icon="http://../a.png",
			title="水浒传",
			type="国学",
			price="6",//0代表免费
 	}
 	...
 ]
}
	 * */
	@RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public String get(@PathVariable("id") String type) throws JsonProcessingException {
		AudiobookVo vo = new AudiobookVo();
		vo.setId("1");
		vo.setIcon(base + "/upload/b.png");
		vo.setTitle("水浒传");
		vo.setType("国学");
		vo.setPrice("6");
		vo.setListen(base + "/upload/b.mp3");
		vo.setDown(base + "/upload/b.zip");
		vo.setAuthor("施耐庵");
		vo.setReader("张三");
		vo.setReview(new HashMap<String, Object>() {
			{
				this.put("name", "冯红兵");
				this.put("start", "4");
				this.put("up", "5");
				this.put("text", "good book");
			}
		});
		vo.setRelated(new HashMap<String, Object>() {
			{
				this.put("id", "1");
				this.put("icon", "4");
				this.put("title", "水浒传");
				this.put("type", "国学");
				this.put("price", "6");
			}
		});
		return RmObjectMapper.getInstance().writeValueAsString(vo);
	}
/**
4.发表书评的url
 */
	@RequestMapping(value = "/comment", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public String comment(@RequestParam String comment) throws JsonProcessingException {
		return "ok";
	}

/**
5.搜索api
根据关键字返回内容
 */
	@RequestMapping(value = "/search", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public String search(@RequestParam String q) throws JsonProcessingException {
		List<AudiobookVo> result = new ArrayList<AudiobookVo>();
		{
			AudiobookVo vo = new AudiobookVo();
			vo.setId("1");
			vo.setIcon(base + "/upload/b.png");
			vo.setTitle("水浒传");
			vo.setType("国学");
			vo.setPrice("6");
			vo.setListen(base + "/upload/b.mp3");
			vo.setDown(base + "/upload/b.zip");
			vo.setAuthor("施耐庵");
			vo.setReader("张三");
			result.add(vo);
		}
		return RmObjectMapper.getInstance().writeValueAsString(result);
	}
	
/**
6.检查更新url //这个url很重要，如果登陆了也会讲求这个url看这本儿书买了没
根据书的id检查一本儿书有没有更新
{
	id="",
	update=ture/false,
	down="",
	isbuy=ture/false
}
 */
	@RequestMapping(value = "/checkUpdate/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public String checkUpdate(@PathVariable("id") String id) throws JsonProcessingException {
		Map<String, Object> result = new HashMap<String, Object>();
		{
			result.put("id", id);
			result.put("update", "false");
			result.put("down", "");
			result.put("isbuy", "true");
		}
		return RmObjectMapper.getInstance().writeValueAsString(result);
	}

/**
7.注册登陆
注册
post name email password
登陆
post email pass
第三方登陆
还要实现新浪微博,人人网,豆瓣,QQ的登陆
 * 
 */
	@RequestMapping(value = "/register/{id}", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public String register(@RequestParam String name, @RequestParam String email, @RequestParam String password) throws JsonProcessingException {
		return RmObjectMapper.getInstance().writeValueAsString("ok");
	}

/**
8.获取个人资料
{
	icon,头像
	name,名字
	sax,性别
	loc,住处
	qianming:爱读书啥的
	mbook,关注的书类
	mauthor,关注的作者
	mreader,关注的播音
}
 */
	@RequestMapping(value = "/profile/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public String profile(@PathVariable("id") String id) throws JsonProcessingException {
		Map<String, Object> result = new HashMap<String, Object>();
		{
			result.put("icon", "icon1");
			result.put("name", "");
			result.put("sex", "");
			result.put("loc", "");
		}
		return RmObjectMapper.getInstance().writeValueAsString(result);
	}

/**
9.我的书评
[
	{
		icon,
		name,
		author,
		reader,
		start,
		review,
	}
	{
	
	}
	...
]
 */
	@RequestMapping(value = "/myComment", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public String myComment() throws JsonProcessingException {
		Map<String, Object> result = new HashMap<String, Object>();
		{
			result.put("icon", "icon1");
			result.put("name", "");
			result.put("sex", "");
			result.put("loc", "");
		}
		return RmObjectMapper.getInstance().writeValueAsString(result);
	}

/**
10.我的购书记录
结构同api2
 */
	
	
/**
11.上传购书记录
post,id
肯定是在登陆的情况下
 */
	
}
