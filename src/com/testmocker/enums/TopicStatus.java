package com.testmocker.enums;

public enum TopicStatus {
	NOTACTIVE("n"),ACTIVE("y"),CANCEL("c"),REACTIVE("r");
	
	private String value;
	
	private TopicStatus(String _value){
		this.setValue(_value);
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}
}
