package com.testmocker.httpmodel;

import java.util.ArrayList;
import java.util.List;

public class RequestParameterConfigItem {
	private String userid;
	private String requestparameter;
	private String responsetemplate;
	private List<ParameterItem> parameters=new ArrayList<ParameterItem>();
	public String getRequestparameter() {
		return requestparameter;
	}
	public void setRequestparameter(String requestparameter) {
		this.requestparameter = requestparameter;
	}
	public String getResponsetemplate() {
		return responsetemplate;
	}
	public void setResponsetemplate(String responsetemplate) {
		this.responsetemplate = responsetemplate;
	}
	public List<ParameterItem> getParameters() {
		return parameters;
	}
	public void setParameters(List<ParameterItem> parameters) {
		this.parameters = parameters;
	}
	public String getUserid() {
		return userid;
	}
	public void setUserid(String userid) {
		this.userid = userid;
	}
}
