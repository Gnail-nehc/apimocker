package com.testmocker.httpmodel;

public class InvokeRecord {
	private String id;
	private String requestenv;
	private String name;
	private String time;
	private String duration;
	private String ismock;
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getRequestenv() {
		return requestenv;
	}
	public void setRequestenv(String requestenv) {
		this.requestenv = requestenv;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getTime() {
		return time;
	}
	public void setTime(String time) {
		this.time = time;
	}
	public String getIsmock() {
		return ismock;
	}
	public void setIsmock(String ismock) {
		this.ismock = ismock;
	}
	public String getDuration() {
		return duration;
	}
	public void setDuration(String duration) {
		this.duration = duration;
	}

}
