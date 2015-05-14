package com.testmocker.service;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.testmocker.enums.Seperator;
import com.testmocker.enums.SpecialFileName;
import com.testmocker.httpmodel.Json;
import com.testmocker.httpmodel.JsonList;
import com.testmocker.httpmodel.Topic;



@Service("topicService")
public class TopicService {
	private static final Logger logger = Logger.getLogger(TopicService.class);
	
	public JsonList getAllTopics(boolean isPublic){
		JsonList list=new JsonList();
		List<Topic> row=new ArrayList<Topic>();
		File root=new File(SpecialFileName.ROOT.getValue());
		if(root.exists()){
			String[] paths=root.list();
			if(paths.length>0){
				for(String path : paths){
					if(path.equals(SpecialFileName.LOG.getValue()) || path.equals(SpecialFileName.NOTESCAPERTLIST.getValue()) || path.equals(SpecialFileName.INVOKERECORD.getValue())){
						continue;
					}
					String seperator=Seperator.BASESEPERATOR.getValue();
					String[] fields=path.split(seperator);
					String owner=fields[5];
					if(!isPublic){
						String user=SecurityContextHolder.getContext().getAuthentication().getName();
						if(!owner.equalsIgnoreCase(user)){
							continue;
						}
					}
					Topic t=new Topic();
					t.setCode(fields[0]);
					t.setName(fields[1]);
					t.setRequesttype(fields[2]);
					t.setStatus(fields[3]);
					t.setTime(fields[4]);
					t.setOwner(owner);
					row.add(t);
				}
			}
		}
		list.setRows(row);
		//logger.info(row);
		return list;
	}
	
	public Json deleteTopic(String code){
		Json j =new Json();
		boolean res=false;
		File f = new File(SpecialFileName.ROOT.getValue());
		for(File child : f.listFiles()){
			if(child.getName().startsWith(code)){
				Topic t=new Topic();
				String[] fields=child.getName().split(Seperator.BASESEPERATOR.getValue());
				t.setName(fields[1]);
				t.setRequesttype(fields[2]);
				j.setObj(t);
				for(File subfile : child.listFiles()){
					subfile.delete();
				}
				child.delete();
				res=true;
				break;
			}
		}
		j.setSuccess(res);
		return j;
	}
	
}
