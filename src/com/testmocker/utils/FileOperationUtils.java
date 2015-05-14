package com.testmocker.utils;

import java.io.File;

public class FileOperationUtils {
	public static File createFolder(String path){
		File file=new File(path);
		if(!file.exists()){
			file.mkdirs();
		}
		return file;
	}
}
