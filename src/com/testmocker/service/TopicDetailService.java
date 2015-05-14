package com.testmocker.service;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.testmocker.enums.Seperator;
import com.testmocker.enums.SpecialFileName;
import com.testmocker.enums.TimeFormatDefiniation;
import com.testmocker.enums.TopicStatus;
import com.testmocker.factory.JsonObjectMapperFactory;
import com.testmocker.httpmodel.Json;
import com.testmocker.httpmodel.TopicConfigItem;
import com.testmocker.utils.JdbcUtils;


@Service("topicDetailService")
public class TopicDetailService {
	private static final Logger logger = Logger.getLogger(TopicDetailService.class);
	@Autowired
	JdbcUtils jdbcUtils;
	
	
	public TopicConfigItem getTopicConfigByCode(String code){
		TopicConfigItem tci = new TopicConfigItem();
		File f = new File(SpecialFileName.ROOT.getValue());
		for(File child : f.listFiles()){
			if(child.getName().startsWith(code)){
        		try {
        			ObjectMapper mapper = JsonObjectMapperFactory.getObjectMapper();
        			child=new File(child,SpecialFileName.BASICCONFIG.getValue());
					tci = mapper.readValue(child, TopicConfigItem.class);
					break;
				} catch (Exception e) {
					// TODO Auto-generated catch block
					logger.error(e.getClass()+e.getMessage());
				}
			}
		}
		return tci;
	}
	
	private void changeTopicStatus(String code,TopicStatus status){
		File f = new File(SpecialFileName.ROOT.getValue());
		for(File child : f.listFiles()){
			if(child.getName().startsWith(code)){
				String[] parts=child.getName().split(Seperator.BASESEPERATOR.getValue());
				parts[3]=status.getValue();
				SimpleDateFormat format = new SimpleDateFormat(TimeFormatDefiniation.timeFolderFormat);			
				parts[4]=format.format(new Date());
				String newname=StringUtils.join(parts, Seperator.BASESEPERATOR.getValue());
				child.renameTo(new File(f,newname));
				break;
			}
		}
	}
	
	public Json replaceWebServiceURL(String code,boolean isMock){
		Json j= new Json();
		try{
			if(code!=null && !code.isEmpty()){
				File f = new File(SpecialFileName.ROOT.getValue());
				for(File child : f.listFiles()){
					if(child.isDirectory() && child.getName().startsWith(code)){
						ObjectMapper mapper = JsonObjectMapperFactory.getObjectMapper();
						child=new File(child,SpecialFileName.BASICCONFIG.getValue());
	        			TopicConfigItem tci = mapper.readValue(child, TopicConfigItem.class);
	        			String replacingurl=isMock?tci.getCode():tci.getWebserviceurl();
	        			String replacedurl=isMock?tci.getWebserviceurl():tci.getCode();
	        			TopicStatus status=isMock?TopicStatus.ACTIVE:TopicStatus.CANCEL;
	        			String sql = String.format("update WSServer set WebServiceURL = '%1$s' where ServerType = '%2$s' AND WebServiceURL = '%3$s'",
	        					replacingurl,tci.getServertype(),replacedurl);
	        			jdbcUtils.executeSqlAction(sql);
	    				changeTopicStatus(code, status);
	    				j.setSuccess(true);
						break;
					}
				}
			}else{
				j.setMsg("not given topic code.");
				j.setSuccess(false);
			}
		}catch(Exception e){
			e.getStackTrace();
			System.out.println(e.getMessage());
			j.setSuccess(false);
			j.setMsg(e.getClass()+e.getMessage());
		}
		return j;
	}
}
