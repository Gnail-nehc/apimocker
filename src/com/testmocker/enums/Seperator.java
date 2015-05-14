package com.testmocker.enums;

public enum Seperator {
	BASESEPERATOR("@"),PARASEPERATOR("<<eof>>");
	
	private String value;
	
	private Seperator(String _value){
		this.setValue(_value);
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}
	
}
