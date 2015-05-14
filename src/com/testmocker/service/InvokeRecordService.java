package com.testmocker.service;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.text.SimpleDateFormat;

import org.apache.log4j.Logger;
import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.stereotype.Service;

import com.testmocker.enums.Seperator;
import com.testmocker.enums.SpecialFileName;
import com.testmocker.factory.JsonObjectMapperFactory;
import com.testmocker.httpmodel.InvokeDetail;
import com.testmocker.httpmodel.InvokeRecord;
import com.testmocker.httpmodel.Json;
import com.testmocker.httpmodel.JsonList;
import com.testmocker.httpmodel.TopicConfigItem;


@Service("invokeRecordService")
public class InvokeRecordService {

	private static final Logger logger = Logger.getLogger(InvokeRecordService.class);
	
	public JsonList getAllInvokeRecords(){
		JsonList list=new JsonList();
		List<InvokeRecord> row=new ArrayList<InvokeRecord>();
		File f=new File(SpecialFileName.ROOT.getValue());
		f= new File(f,SpecialFileName.INVOKERECORD.getValue());		
		if(f.exists() && f.isDirectory()){
			for(String child : f.list()){
				InvokeRecord ir= new InvokeRecord();
				String[] ele=child.split(Seperator.BASESEPERATOR.getValue());
				ir.setId(ele[0]);
				ir.setName(ele[1]);
				ir.setRequestenv(ele[2]);
				ir.setTime(ele[3]);
				ir.setDuration(ele[4]);
				ir.setIsmock(ele[5]);
				row.add(ir);
			}
		}
		list.setRows(row);
		return list;
	}
	
	public JsonList getAllInvokeRecords(int limit){
		JsonList list=new JsonList();
		List<InvokeRecord> row=new ArrayList<InvokeRecord>();
		File f=new File(SpecialFileName.ROOT.getValue());
		f= new File(f,SpecialFileName.INVOKERECORD.getValue());		
		if(f.exists() && f.isDirectory()){
			int i=0;
			for(String child : f.list()){
				if(i>limit)
					break;
				InvokeRecord ir= new InvokeRecord();
				String[] ele=child.split(Seperator.BASESEPERATOR.getValue());
				ir.setId(ele[0]);
				ir.setName(ele[1]);
				ir.setRequestenv(ele[2]);
				ir.setTime(ele[3]);
				ir.setDuration(ele[4]);
				ir.setIsmock(ele[5]);
				row.add(ir);
				i++;
			}
		}
		list.setRows(row);
		return list;
	}
	
	public JsonList getTodaysInvokeRecords(){
		JsonList list=new JsonList();
		List<InvokeRecord> row=new ArrayList<InvokeRecord>();
		File f=new File(SpecialFileName.ROOT.getValue());
		String date=new SimpleDateFormat("yyyyMMdd").format(new Date());
		f= new File(f,SpecialFileName.INVOKERECORD.getValue());		
		if(f.exists() && f.isDirectory()){
			for(String child : f.list()){
				String[] ele=child.split(Seperator.BASESEPERATOR.getValue());
				if(ele[3].startsWith(date)){
					InvokeRecord ir= new InvokeRecord();
					ir.setId(ele[0]);
					ir.setName(ele[1]);
					ir.setRequestenv(ele[2]);
					ir.setTime(ele[3]);
					ir.setDuration(ele[4]);
					ir.setIsmock(ele[5]);
					row.add(ir);
				}
			}
		}
		list.setRows(row);
		return list;
	}
	
	public Json deleteInvokeRecord(String id){
		Json j = new Json();
		File f = new File(SpecialFileName.ROOT.getValue()+"/"+SpecialFileName.INVOKERECORD.getValue());
		InvokeRecord ir= new InvokeRecord();
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
	
	public InvokeDetail getInvokeDetail(String id){
		InvokeDetail obj=new InvokeDetail();
		try{
			File f=new File(SpecialFileName.ROOT.getValue());
			f= new File(f,SpecialFileName.INVOKERECORD.getValue());
			for(String filename : f.list()){
				if(!filename.isEmpty() && filename.contains(id+Seperator.BASESEPERATOR.getValue())){
					f=new File(f,filename);
					ObjectMapper mapper = JsonObjectMapperFactory.getObjectMapper();
					obj=mapper.readValue(f, InvokeDetail.class);
					break;
				}
			}
		}catch(Exception e){
			logger.error(e.getMessage()+" "+e.getStackTrace());
		}
		return obj;
	}
}
