package com.testmocker.controller;

import java.util.Collection;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.testmocker.httpmodel.Json;
import com.testmocker.httpmodel.JsonList;
import com.testmocker.httpmodel.Topic;
import com.testmocker.service.TopicService;


@Controller
public class TopicController {
	private static final Logger logger = Logger.getLogger(TopicController.class);
		
	@Autowired
	TopicService topicService;
	
	@RequestMapping(value="/getAllTopics")
	@ResponseBody
	public JsonList getAllTopics(@RequestParam boolean isPublic) {
		if(!isPublic){
			Collection<SimpleGrantedAuthority> authorities = (Collection<SimpleGrantedAuthority>)SecurityContextHolder.getContext().getAuthentication().getAuthorities();
			String role=authorities.toArray()[0].toString();
			if(role.toUpperCase().equals("ROLE_ADMIN")){
				isPublic=true;
			}
		}
		return topicService.getAllTopics(isPublic);
	}

	@RequestMapping(value="/deleteTopic", method=RequestMethod.POST)
	@ResponseBody
	public Json deleteTopic(@RequestBody Topic[] topic){
		return topicService.deleteTopic(topic[0].getCode());
	}
	
	@RequestMapping(value="/checkAuthorities", method=RequestMethod.POST)
	@ResponseBody
	public Json checkAuthorities(){
		Json j = new Json();
		Collection<SimpleGrantedAuthority> authorities = (Collection<SimpleGrantedAuthority>)SecurityContextHolder.getContext().getAuthentication().getAuthorities();
		String role=authorities.toArray()[0].toString();
		if(role.toUpperCase().equals("ROLE_ADMIN")){
			j.setObj(true);
		}else
			j.setObj(false);
		j.setSuccess(true);
		return j;
	}
	
}
