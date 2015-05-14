package com.testmocker.enums;

public enum SpecialFileName {
	ROOT("testmocker"),LOG("operationlog"),BASICCONFIG("basic"),NOTESCAPERTLIST("__notescaperqlist__"),INVOKERECORD("invokerecord");
	
	private String value;
	
	private SpecialFileName(String _value){
		this.setValue(_value);
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}
}
