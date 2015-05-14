package com.testmocker.thread;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.codehaus.jackson.map.ObjectMapper;

import com.testmocker.enums.Seperator;
import com.testmocker.enums.SpecialFileName;
import com.testmocker.enums.TimeFormatDefiniation;
import com.testmocker.factory.JsonObjectMapperFactory;
import com.testmocker.httpmodel.InvokeDetail;
import com.testmocker.utils.FileOperationUtils;
import com.testmocker.utils.UniqueCodeGenerator;


public class InvokedRecordThread implements Runnable {

	private String name=""; 
	private String requestenv="";
	private boolean isMock;
	private String requesturl="";
	private String requestbody="";
	private String responsebody="";
	private String duration="";
	
	public synchronized void run() {
		File f=FileOperationUtils.createFolder(SpecialFileName.ROOT.getValue()+"/"+SpecialFileName.INVOKERECORD.getValue());
		String id=UniqueCodeGenerator.generateShortUuid(8);
		String ismock=this.isMock?"y":"n";
		String sep=Seperator.BASESEPERATOR.getValue();
		SimpleDateFormat format = new SimpleDateFormat(TimeFormatDefiniation.format);			
		String time=format.format(new Date());
		String filename=id+sep+this.name+sep+this.requestenv+sep+time+sep+this.duration+sep+ismock;
		try {
			f=new File(f,filename);
			f.createNewFile();
			InvokeDetail obj=new InvokeDetail();
			obj.setRequesturl(this.requesturl);
			obj.setRequestbody(this.requestbody);
			obj.setResponsebody(this.responsebody);
			ObjectMapper mapper=JsonObjectMapperFactory.getObjectMapper();
			mapper.writeValue(f, obj);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	}

	public void setName(String name) {
		this.name = name;
	}

	public void setRequestenv(String requestenv) {
		this.requestenv = requestenv;
	}

	public void setIsmock(boolean isMock) {
		this.isMock = isMock;
	}

	public void setRequesturl(String requesturl) {
		this.requesturl = requesturl;
	}

	public void setRequestbody(String requestbody) {
		this.requestbody = requestbody;
	}

	public void setResponsebody(String responsebody) {
		this.responsebody = responsebody;
	}

	public void setDuration(String duration) {
		this.duration = duration;
	}

}
