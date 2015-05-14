package com.testmocker.httpmodel;

import java.util.ArrayList;
import java.util.List;

public class TopicConfigItem {
	private String code="";
	private String name="";
	private String servertype="";
	private String requesttype="";
	private String requestbody="";
	private String requesthead="";
	private String template="";
	private String webserviceurl="";
	private List<ParameterItem> parameters=new ArrayList<ParameterItem>();
	private String userid="";
	private boolean ifsaveinvoke=false;
	
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getRequesttype() {
		return requesttype;
	}
	public void setRequesttype(String requesttype) {
		this.requesttype = requesttype;
	}
	public String getTemplate() {
		return template;
	}
	public void setTemplate(String template) {
		this.template = template;
	}
	public String getWebserviceurl() {
		return webserviceurl;
	}
	public void setWebserviceurl(String webserviceurl) {
		this.webserviceurl = webserviceurl;
	}
	public String getServertype() {
		return servertype;
	}
	public void setServertype(String servertype) {
		this.servertype = servertype;
	}
	public List<ParameterItem> getParameters() {
		return parameters;
	}
	public void setParameters(List<ParameterItem> parameters) {
		this.parameters = parameters;
	}
	public String getRequestbody() {
		return requestbody;
	}
	public void setRequestbody(String requestbody) {
		this.requestbody = requestbody;
	}
	public String getRequesthead() {
		return requesthead;
	}
	public void setRequesthead(String requesthead) {
		this.requesthead = requesthead;
	}
	public String getUserid() {
		return userid;
	}
	public void setUserid(String userid) {
		this.userid = userid;
	}
	public boolean isIfsaveinvoke() {
		return ifsaveinvoke;
	}
	public void setIfsaveinvoke(boolean ifsaveinvoke) {
		this.ifsaveinvoke = ifsaveinvoke;
	}
	
	
}
