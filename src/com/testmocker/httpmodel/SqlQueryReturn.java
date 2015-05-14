package com.testmocker.httpmodel;

import java.util.ArrayList;
import java.util.HashMap;


public class SqlQueryReturn {
	private ArrayList<String> columnNames=new ArrayList<String>();
	private HashMap<Integer,ArrayList<String>> rows=new HashMap<Integer,ArrayList<String>>();
	private String displayResultText;
	
	public ArrayList<String> getColumnNames() {
		return columnNames;
	}
	public void setColumnNames(ArrayList<String> columnNames) {
		this.columnNames = columnNames;
	}
	public HashMap<Integer,ArrayList<String>> getRows() {
		return rows;
	}
	public void setRows(HashMap<Integer,ArrayList<String>> rows) {
		this.rows = rows;
	}
	public String getDisplayResultText() {
		return displayResultText;
	}
	public void setDisplayResultText(String displayResultText) {
		this.displayResultText = displayResultText;
	}
}
