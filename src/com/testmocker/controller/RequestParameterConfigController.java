package com.testmocker.controller;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.testmocker.enums.Seperator;
import com.testmocker.enums.SpecialFileName;
import com.testmocker.factory.JsonObjectMapperFactory;
import com.testmocker.httpmodel.Json;
import com.testmocker.httpmodel.JsonList;
import com.testmocker.httpmodel.ParameterItem;
import com.testmocker.httpmodel.RequestParameterConfig;
import com.testmocker.httpmodel.RequestParameterConfigItem;
import com.testmocker.service.TopicConfigService;
import com.testmocker.utils.UniqueCodeGenerator;


@Controller
public class RequestParameterConfigController {
	private static final Logger logger = Logger.getLogger(RequestParameterConfigController.class);
	@Autowired
	TopicConfigService service;
	
	@RequestMapping(value="/getResponseByRequestParameter", method=RequestMethod.POST )
	@ResponseBody
	public Json getResponseByRequestParameter(@RequestParam String url,@RequestParam String requesttemplate,@RequestParam String head,@RequestParam String requestparameter){
		Json j=new Json();
		Map<String,String> request = new HashMap<String,String>();
		if(!requestparameter.isEmpty()){
			String[] arr = requestparameter.split("\n");
			for(String pair:arr){
				String[] kv=pair.split("=");
				if(kv.length==2){
					request.put(kv[0], kv[1]);
				}if(kv.length>2){
					String value=StringUtils.substringAfter(pair, kv[0]+"=");
					request.put(kv[0], value);
				}
			}
		}else
			request=null;
		String responsebody=service.getResponse(url, requesttemplate, head,request);
		j.setObj(responsebody);
		j.setSuccess(true);
		return j;
	}
	
	@RequestMapping(value="/saveRequestParameterConfig", method=RequestMethod.POST )
	@ResponseBody
	public Json saveRequestParameterConfig(HttpServletRequest request, HttpServletResponse response){
		Json j=new Json();
		j.setSuccess(false);
		try {
			String code=request.getParameter("existingcode");
			for(File f : new File(SpecialFileName.ROOT.getValue()).listFiles()){
				if(f.getName().startsWith(code)){
					RequestParameterConfigItem item=new RequestParameterConfigItem();					
					String id = request.getParameter("id");
					String userid=request.getParameter("userid");
					String requestparameter=request.getParameter("requestparameter");
					String kv=requestparameter.replaceAll("\n", ";");
					ObjectMapper mapper = JsonObjectMapperFactory.getObjectMapper();
					if(id.isEmpty()){
						id=UniqueCodeGenerator.generateShortUuid(2);
					}else{
						for(File child : f.listFiles()){
							if(!child.getName().equals(SpecialFileName.BASICCONFIG.getValue()) && child.getName().startsWith(id)){
								child.delete();
							}
						}
					}
					for(String inputkv : requestparameter.split("\n")){
						for(String fname : f.list()){
							if(fname.contains(inputkv)){
								j.setSuccess(false);
								j.setMsg("不能重复配置！重复项："+inputkv);
								return j;
							}
						}
					}
					String responsetemplate=request.getParameter("responsetemplate");
					String parastr=request.getParameter("parameters");
					String[] paras=parastr.split(Seperator.PARASEPERATOR.getValue());
					List<ParameterItem> parameter = new ArrayList<ParameterItem>();
					for(String p : paras){
						if(!p.isEmpty()){
							String[] el = p.split("\n");
							ParameterItem pi=new ParameterItem();
							pi.setType(el[0]);
							pi.setName(el[1]);
							pi.setValue(el[2]);
							if(el.length>3)
								pi.setComment(el[3]);
							else
								pi.setComment("");
							parameter.add(pi);
						}
					}
					item.setUserid(userid);
					item.setParameters(parameter);
					item.setRequestparameter(requestparameter);
					item.setResponsetemplate(responsetemplate);
					
					String filename=id+Seperator.BASESEPERATOR.getValue()+kv;
					f=new File(f,filename);
					f.createNewFile();
					mapper.writeValue(f, item);
					j.setSuccess(true);
					break;
				}
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			j.setMsg(e.getMessage());
			j.setSuccess(false);
		}
		return j;
	}

	@RequestMapping(value="/getAllRequestParameterConfigs")
	@ResponseBody
	public JsonList getAllRequestParameterConfigs(@RequestParam String code) {
		return service.getAllRequestParameterConfigs(code);
	}

	@RequestMapping(value="/deleteRequestParameterConfig", method=RequestMethod.POST)
	@ResponseBody
	public Json deleteRequestParameterConfig(@RequestParam String code, @RequestBody RequestParameterConfig[] rpc){
		return service.deleteRequestParameterConfig(code,rpc[0].getId());
	}

	@RequestMapping(value="/getRequestParameterConfigDetail", method=RequestMethod.POST )
	@ResponseBody
	public Json getRequestParameterConfigDetail(@RequestParam String code,@RequestParam String id){
		return service.getRequestParameterConfigDetail(code,id);
	}
	
	
}
