package com.testmocker.enums;

public enum LogActionType {
	CREATE("n"),ACTIVE("y"),CANCEL("c"),REACTIVE("r"),UPDATE("u"),DELETE("d");
	
	private String value;
	
	private LogActionType(String _value){
		this.setValue(_value);
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}
}
