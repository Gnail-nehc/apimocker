package com.testmocker.enums;

public enum DataSourceType {
	SQLSERVER("sql server"),MYSQL("mysql");
	
	private String value;
	
	private DataSourceType(String _value){
		this.setValue(_value);
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}
	
}
