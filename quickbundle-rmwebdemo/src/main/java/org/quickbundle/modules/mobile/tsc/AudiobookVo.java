package org.quickbundle.modules.mobile.tsc;

import java.util.Map;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class AudiobookVo {
	private String id;
	private String icon;
	private String title;
	private String type;
	private String price;
	private String listen;
	private String down;
	private String author;
	private String reader;
	private Map<String, Object> review;
	private Map<String, Object> related;
	
	public Map<String, Object> getReview() {
		return review;
	}
	public void setReview(Map<String, Object> review) {
		this.review = review;
	}
	public Map<String, Object> getRelated() {
		return related;
	}
	public void setRelated(Map<String, Object> related) {
		this.related = related;
	}
	public String getId() {
		return id;
	}
	public String getAuthor() {
		return author;
	}
	public void setAuthor(String author) {
		this.author = author;
	}
	public String getReader() {
		return reader;
	}
	public void setReader(String reader) {
		this.reader = reader;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getIcon() {
		return icon;
	}
	public void setIcon(String icon) {
		this.icon = icon;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getPrice() {
		return price;
	}
	public void setPrice(String price) {
		this.price = price;
	}
	public String getListen() {
		return listen;
	}
	public void setListen(String listen) {
		this.listen = listen;
	}
	public String getDown() {
		return down;
	}
	public void setDown(String down) {
		this.down = down;
	}
	
	
}
