package com.testmocker.controller;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.testmocker.enums.Seperator;
import com.testmocker.enums.SpecialFileName;
import com.testmocker.factory.JsonObjectMapperFactory;
import com.testmocker.httpmodel.Json;
import com.testmocker.httpmodel.ParameterItem;
import com.testmocker.httpmodel.TopicConfigItem;
import com.testmocker.service.TopicConfigService;
import com.testmocker.utils.FileOperationUtils;
import com.testmocker.utils.UniqueCodeGenerator;


@Controller
public class TopicConfigController {
	private static final Logger logger = Logger.getLogger(TopicConfigController.class);
	@Autowired
	TopicConfigService topicConfigService;
	
	@RequestMapping(value="/getAllSubSystems", method=RequestMethod.POST )
	@ResponseBody
	public Json getAllSubSystems(){
		return topicConfigService.returnJson("SELECT SubSystemID,SubSystemName FROM SubSystem", new String[]{"SubSystemID","SubSystemName"});
	}
	
	@RequestMapping(value="/getWebServicesBySubSystemID", method=RequestMethod.POST )
	@ResponseBody
	public Json getWebServicesBySubSystemID(@RequestParam String subSystemID){
		String sql = String.format("select WebServiceID,WebServiceName from WebService where SubSystemID = '%1$s'",subSystemID);
		return topicConfigService.returnJson(sql, new String[]{"WebServiceID","WebServiceName"});
	}
	
	@RequestMapping(value="/getRequestTypesByWebServiceID", method=RequestMethod.POST )
	@ResponseBody
	public Json getRequestTypesByWebServiceID(@RequestParam String webServiceID){
		String sql = String.format("select RequestType from RequestType where WebServiceID = '%1$s'",webServiceID);
		return topicConfigService.returnJson(sql, new String[]{"RequestType"});
	}
	
	@RequestMapping(value="/getRequestTemplateByRequestType", method=RequestMethod.POST )
	@ResponseBody
	public Json getRequestTemplateByRequestType(@RequestParam String requestType){
		Json j=new Json();
		String sql = String.format("select RequestTemp from RequestType where RequestType = '%1$s'",requestType);
		String text=topicConfigService.queryRowsByColumnNameNRowIndex(sql,"RequestTemp",1);
		j.setObj(text);
		j.setSuccess(true);
		return j;
	}
	
	@RequestMapping(value="/getResponse", method=RequestMethod.POST )
	@ResponseBody
	public Json getResponse(@RequestParam String url,@RequestParam String requesttemplate,@RequestParam String head){
		Json j=new Json();
		String responsebody=topicConfigService.getResponse(url, requesttemplate, head,null);
		j.setObj(responsebody);
		j.setSuccess(true);
		return j;
	}
	
	@RequestMapping(value="/saveTopicConfig", method=RequestMethod.POST )
	@ResponseBody
	public Json saveTopicConfig(HttpServletRequest request, HttpServletResponse response){
		Json j=new Json();
		try {
			FileOperationUtils.createFolder(SpecialFileName.ROOT.getValue());
			
			TopicConfigItem item=new TopicConfigItem();
			File parent=new File(SpecialFileName.ROOT.getValue());
			String code=request.getParameter("existingcode");
			String sep=Seperator.BASESEPERATOR.getValue();
			String status="n";
			String servertype=request.getParameter("servertype");
			String requesttype=request.getParameter("requesttype");
			String name=request.getParameter("name");
			String parastr=request.getParameter("parameters");
			String[] paras=parastr.split(Seperator.PARASEPERATOR.getValue());
			List<ParameterItem> parameter = new ArrayList<ParameterItem>();
			String requestbody=request.getParameter("reqtemp");
			String responsebody=request.getParameter("restemp");
			String requesthead=request.getParameter("requesthead");
			String userid=(null==request.getParameter("userid"))?"":request.getParameter("userid");
			boolean ifsaveinvokedrecord=request.getParameter("ifsaveinvokedrecord").equalsIgnoreCase("true")?true:false;
			String url=request.getParameter("url").replace("/app.html", "");
			url=url.endsWith("/")?url.substring(0, url.length()-1):url;
			
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
			//update
			if(code!=null && !code.isEmpty()){
				for(File child : parent.listFiles()){
					String self=child.getName();
					if(self.startsWith(code)){
						boolean rtchanged=false;
						if(null!=requesttype && !requesttype.isEmpty()){
							String oldrequesttype = self.split(sep)[2];
							if(!oldrequesttype.equalsIgnoreCase(requesttype)){
								rtchanged=true;
								for(String filename : parent.list()){
									if(!filename.isEmpty() && filename.split(sep).length>2){
										String rt=filename.split(sep)[2];
										int pos=requesttype.lastIndexOf(".");
										String requestservice=requesttype.substring(0, pos+1);
										if(!rt.isEmpty() && rt.startsWith(requestservice)){
											j.setMsg("服务"+requestservice+"已配置！由于同一服务下的所有接口共用url，因此无法再更改.建议在已有配置中增加‘请求参数预期值’配置。");
											j.setSuccess(false);
											j.setObj("");
											return j;
										}
									}
								}
								self=self.replace(oldrequesttype, requesttype);
							}
						}
						if(!self.split(sep)[1].equalsIgnoreCase(name))
							self=self.replace(self.split(sep)[1], name);
						child.renameTo(new File(parent,self));
						File f=new File(parent,self);
						f=new File(f,SpecialFileName.BASICCONFIG.getValue());
						if(f.exists()){
							ObjectMapper mapper = JsonObjectMapperFactory.getObjectMapper();
							item=mapper.readValue(f, TopicConfigItem.class);
							if(rtchanged){
								String sql = String.format("select WebServiceURL from WSServer,RequestType where WSServer.WebServiceID=RequestType.WebServiceID AND ServerType='%1$s' AND RequestType='%2$s'",servertype,requesttype);
								String webserviceurl=topicConfigService.queryRowsByColumnNameNRowIndex(sql, "WebServiceURL", 1);
								item.setWebserviceurl(webserviceurl);
								item.setRequesttype(requesttype);
								item.setRequestbody(requestbody);
							}
							if(servertype!=null && !servertype.equalsIgnoreCase(item.getServertype())){
								item.setServertype(servertype);
							}
							if(requesthead!=null && !requesthead.equalsIgnoreCase(item.getRequesthead())){
								item.setRequesthead(requesthead);
							}
							item.setCode(url+"/task/mock/"+code);
							item.setName(name);
							item.setParameters(parameter);
							item.setTemplate(responsebody);
							item.setUserid(userid);
							item.setIfsaveinvoke(ifsaveinvokedrecord);
							mapper.writeValue(f, item);
							j.setObj(code);
							j.setSuccess(true);
						}else{
							j.setObj("");
							j.setMsg("找不到基本配置文件");
							j.setSuccess(false);
						}
						return j;
					}
				}
			}else{	
				code=UniqueCodeGenerator.generateShortUuid(6);
			}
			//new
			if(null!=requesttype && !requesttype.isEmpty()){
				for(String child : parent.list()){
					if(!child.isEmpty() && child.split(sep).length>2){
						int pos=requesttype.lastIndexOf(".");
						String requestservice=requesttype.substring(0, pos+1);
						String rt=child.split(sep)[2];
						if(!rt.isEmpty() && rt.startsWith(requestservice)){
							j.setMsg("服务"+requestservice+"已配置！由于同一服务下的所有接口共用url，因此无法再更改.建议在已有配置中增加‘请求参数预期值’配置。");
							j.setSuccess(false);
							j.setObj("");
							return j;
						}
					}
				}
				String sql = String.format("select WebServiceURL from WSServer,RequestType where WSServer.WebServiceID=RequestType.WebServiceID AND ServerType='%1$s' AND RequestType='%2$s'",servertype,requesttype);
				String webserviceurl=topicConfigService.queryRowsByColumnNameNRowIndex(sql, "WebServiceURL", 1);
				item.setWebserviceurl(webserviceurl);
				item.setRequesttype(requesttype);
			}
			item.setServertype(servertype);
			item.setParameters(parameter);
			item.setName(name);
			item.setRequestbody(requestbody);
			item.setRequesthead(requesthead);
			item.setTemplate(responsebody);
			item.setUserid(userid);
			item.setCode(url+"/task/mock/"+code);
			item.setIfsaveinvoke(ifsaveinvokedrecord);
			String owner=SecurityContextHolder.getContext().getAuthentication().getName();
			String filename=code+sep+name+sep+requesttype+sep+status+sep+""+sep+owner;
			parent=FileOperationUtils.createFolder(SpecialFileName.ROOT.getValue()+"/"+filename);
			
			ObjectMapper mapper = JsonObjectMapperFactory.getObjectMapper();
			mapper.writeValue(new File(parent,SpecialFileName.BASICCONFIG.getValue()), item);
			j.setObj(code);
			j.setSuccess(true);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			j.setMsg(e.getMessage());
			j.setSuccess(false);
			j.setObj("");
		}
		return j;
	}
}
