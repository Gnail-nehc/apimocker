package com.testmocker.service;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.testmocker.enums.Seperator;
import com.testmocker.enums.SpecialFileName;
import com.testmocker.enums.TimeFormatDefiniation;
import com.testmocker.httpmodel.Json;
import com.testmocker.httpmodel.JsonList;
import com.testmocker.httpmodel.Log;
import com.testmocker.utils.FileOperationUtils;
import com.testmocker.utils.UniqueCodeGenerator;


@Service("operationLogService")
public class OperationLogService {
	private static final Logger logger = Logger.getLogger(OperationLogService.class);
	
	public JsonList getAllLogs(){
		JsonList list=new JsonList();
		List<Log> row=new ArrayList<Log>();
		File f=new File(SpecialFileName.ROOT.getValue());
		f= new File(f,SpecialFileName.LOG.getValue());		
		if(f.exists() && f.isDirectory()){
			for(String child : f.list()){
				Log l= new Log();
				String[] ele=child.split(Seperator.BASESEPERATOR.getValue());
				l.setId(ele[0]);
				l.setRequesttype(ele[1]);
				l.setName(ele[2]);
				l.setAction(ele[3]);
				l.setTime(ele[4]);
				l.setOwner(ele[5]);
				row.add(l);
			}
		}
		list.setRows(row);
		//logger.info(row);
		return list;
	}
	
	public Json deleteLog(String id){
		Json j = new Json();
		File f = new File(SpecialFileName.ROOT.getValue()+"/"+SpecialFileName.LOG.getValue());
		Log l = new Log();
		if(f.exists()){
			for(File child : f.listFiles()){
				if(child.getName().startsWith(id+Seperator.BASESEPERATOR.getValue())){
					child.delete();
					j.setSuccess(true);
					break;
				}
			}
		}
		return j;
	}
	
	public Json addLog(String requesttype,String name,String action){
		Json j = new Json();
		try {
			FileOperationUtils.createFolder(SpecialFileName.ROOT.getValue()+"/"+SpecialFileName.LOG.getValue());
			String id = UniqueCodeGenerator.generateShortUuid(8);
			SimpleDateFormat format = new SimpleDateFormat(TimeFormatDefiniation.timeFolderFormat);			
			String time=format.format(new Date());
			String owner=SecurityContextHolder.getContext().getAuthentication().getName();
			String sep=Seperator.BASESEPERATOR.getValue();
			String filename=id+sep+requesttype+sep+name+sep+action+sep+time+sep+owner;
			File f=new File(SpecialFileName.ROOT.getValue()+"/"+SpecialFileName.LOG.getValue()+"/"+filename);
			f.createNewFile();
			j.setSuccess(true);
		} catch (Exception e) {
			j.setMsg(e.getClass()+": "+e.getMessage());
			j.setSuccess(false);
		}
		return j;
	}
}
