package com.testmocker.controller;

import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.Map.Entry;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.testmocker.enums.Seperator;
import com.testmocker.enums.SpecialFileName;
import com.testmocker.factory.JsonObjectMapperFactory;
import com.testmocker.httpmodel.ParameterItem;
import com.testmocker.httpmodel.RequestParameterConfigItem;
import com.testmocker.httpmodel.TopicConfigItem;
import com.testmocker.service.TopicConfigService;
import com.testmocker.thread.InvokedRecordThread;
import com.testmocker.utils.Auto;
import com.testmocker.utils.HttpServletRequestUtils;
import com.testmocker.utils.TemplateUtils;


@Controller
public class MockController {
	private static final Logger logger = Logger.getLogger(MockController.class);
	@Autowired
	TopicConfigService topicConfigService;
	
	@RequestMapping(value="/mock/*" )
	@ResponseBody
	public void executeMock(HttpServletRequest request, HttpServletResponse response) throws Exception {
		long start = System.currentTimeMillis();
		response.setCharacterEncoding("utf-8");
		String code=StringUtils.substringAfter(request.getPathInfo(), "/mock").replace("/", "");
		File root = new File(SpecialFileName.ROOT.getValue());
		try {
			for(File folder : root.listFiles()){
				if(folder.getName().startsWith(code)){
					ObjectMapper mapper = JsonObjectMapperFactory.getObjectMapper();
	    			TopicConfigItem tci = mapper.readValue(new File(folder,SpecialFileName.BASICCONFIG.getValue()), TopicConfigItem.class);
	    			String responsetemplate=tci.getTemplate();
	    			String contenttype="text/xml";
	    			if(tci.getRequesttype().isEmpty()){
	    				contenttype="application/json";
	    			}else{
	    				if(responsetemplate.contains("{") && responsetemplate.contains("}")){
	    					contenttype="application/json";
		    			}
	    			}
	    			response.setContentType(contenttype);
	    			String filename=SpecialFileName.BASICCONFIG.getValue();
	    			String reqbody=HttpServletRequestUtils.getHttpServletRequestBody(request);
	    			String rt="";
	    			if(null!=tci.getRequesttype() && !tci.getRequesttype().isEmpty()){
		    			//check requesttype
		    			filename=getConfigFilenameMatchedRequesttype(folder,request,reqbody,tci.getRequesttype());
	    			}
	    			if(!filename.isEmpty()){
	    				//check userid
	    				String userid="";
	    				RequestParameterConfigItem rpci = new RequestParameterConfigItem();
	    				if(filename.equals(SpecialFileName.BASICCONFIG.getValue())){
	    					userid=tci.getUserid();
	    				}else{
	    					rpci = mapper.readValue(new File(folder,filename), RequestParameterConfigItem.class);
	    					userid=rpci.getUserid();
	    				}
	    				boolean ismatched=isMatchedUserid(reqbody,userid);
	    				if(ismatched){
	    					String restemplate=filename.equals(SpecialFileName.BASICCONFIG.getValue())?responsetemplate:rpci.getResponsetemplate();
	    					List<ParameterItem> paras=filename.equals(SpecialFileName.BASICCONFIG.getValue())?tci.getParameters():rpci.getParameters();
	    					String res=returnByResponseAndParameterItem(restemplate,paras);
	    					response.getWriter().println(res);
	    					long end = System.currentTimeMillis();
	    					long duration = end - start;
	    					if(tci.isIfsaveinvoke())
	    						runSubThreadToRecordMockInvoked(tci.getName(),tci.getServertype(),true,"192.168.81.33"+request.getRequestURI(),reqbody,res,duration);
							return;
	    				}
	    			}
	    			String content=FileUtils.readFileToString(new File(root,SpecialFileName.NOTESCAPERTLIST.getValue()));
	    			boolean isescape=true;
	    			if(null!=rt && !rt.isEmpty() && !content.isEmpty() && content.toLowerCase().contains(rt.toLowerCase()))
	    				isescape=false;
	    			String res=responseOriginaly(tci,reqbody,request.getParameterMap(),isescape);
					response.getWriter().println(res);
					long end = System.currentTimeMillis();
					long duration = end - start;
					if(tci.isIfsaveinvoke())
						runSubThreadToRecordMockInvoked(tci.getName(),tci.getServertype(),false,"192.168.81.33"+request.getRequestURI(),reqbody,res,duration);
					return;
				}
			}
		}
		catch(Exception e){
			logger.error(e.getClass()+e.getMessage());
		}
		response.getWriter().println(code+" was removed.Pls check tool first。");
		return;
	}
	
	private String getConfigFilenameMatchedRequesttype(File topic,HttpServletRequest request,String reqbody,String requesttype){
		for(String parameterconfig : topic.list()){
			String fname=parameterconfig;
			if(parameterconfig.contains(Seperator.BASESEPERATOR.getValue()) && !parameterconfig.toLowerCase().contains("requesttype")){
				fname+=";requesttype="+requesttype;
			}
			if(fname.contains(Seperator.BASESEPERATOR.getValue())){
				boolean ismatched=true;
				String kvs=fname.split(Seperator.BASESEPERATOR.getValue())[1];
				if(kvs.contains(";")){
					for(String kv : kvs.split(";")){
						String k=kv.split("=")[0].trim();
						String v=kv.split("=")[1].trim();
						String actual=HttpServletRequestUtils.getValueFromRequest(request,reqbody, k);
						if(!v.equalsIgnoreCase(actual)){
							ismatched=false;
							break;
						}
					}
				}
				if(ismatched)
					return parameterconfig;
			}
		}
		String actualrt=HttpServletRequestUtils.getValueFromRequest(request,reqbody, "RequestType");
		return requesttype.equalsIgnoreCase(actualrt) ? SpecialFileName.BASICCONFIG.getValue():"";
	}
	
	private boolean isMatchedUserid(String reqbody,String userid){
		if(null!=userid && !userid.isEmpty()){
			String comparedString=StringUtils.substringAfter(reqbody.toLowerCase(), "userid");
			if(!comparedString.isEmpty()){
				comparedString=StringUtils.substringAfter(comparedString, "=");
				if(comparedString.startsWith("\"")){
					comparedString=StringUtils.substringBetween(comparedString, "\"");
				}
				else{
					comparedString=StringUtils.substringBetween(comparedString, "&quot;");
				}
				if(comparedString.toLowerCase().contains(userid.toLowerCase()))
					return true;
			}
			return false;
		}else
			return true;
	}
	
	private String responseOriginaly(TopicConfigItem tci,String reqbody, Map request, boolean isXmlEscape){
		if(null==reqbody || reqbody.isEmpty())
			reqbody=tci.getRequestbody();
		String url=tci.getWebserviceurl();
		String head=tci.getRequesthead();
		String replacingstr=StringUtils.substringBetween(reqbody, "<requestXML>", "</requestXML>");
		if(null!=replacingstr){
			if(replacingstr.indexOf("<")!=-1 && replacingstr.indexOf("<")<replacingstr.indexOf(">")){
				String replacedstr=replacingstr.replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll("'","&apos;").replaceAll("\"","&quot;").replaceAll("&","&amp;");
				reqbody=reqbody.replaceFirst(replacingstr, replacedstr);
			}
		}
		head=null!=head?head:"SOAPAction=\"http://tempuri.org/Request\"\nContent-Type=text/xml;charset=utf-8";
		String res= topicConfigService.getResponse(url, reqbody, head, request);
		String responsebody=res;
		String replacedbody="";
		if(res.toLowerCase().contains("<RequestResult>".toLowerCase())){
			res=StringUtils.substringAfter(res, "<RequestResult>");
			res=StringUtils.substringBeforeLast(res, "</RequestResult>");
			replacedbody=res;
		}
		if(isXmlEscape){
			if(res.indexOf("<")!=-1 && res.indexOf("<")<res.indexOf(">")){
				res=res.replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll("'","&apos;").replaceAll("\"","&quot;").replaceAll("&","&amp;");
			}
		}else{
			if(res.indexOf("&lt;")!=-1 || res.indexOf("&gt;")!=-1 || res.indexOf("&apos;")!=-1 || res.indexOf("&quot;")!=-1 || res.indexOf("&amp;")!=-1){
				res=res.replaceAll("&lt;","<").replaceAll("&gt;",">").replaceAll("&apos;","'").replaceAll("&quot;","\"").replaceAll("&amp;","&");
			}
		}
		if(responsebody.toLowerCase().contains("<RequestResult>".toLowerCase())){
			res=responsebody.replace(replacedbody, res);
		}
		return res;
	}
	
	private String returnByResponseAndParameterItem(String responsebody,List<ParameterItem> parameters){
		try {
			Map<String,String> m=new HashMap<String,String>();
			for(ParameterItem p : parameters){
				if(p.getType().equals("delay")){
					String v=p.getValue();
					if(v.startsWith("${")){
						//if value is method of Auto class.
						Map map =new HashMap();
						map.put("auto", new Auto());
			        	v = TemplateUtils.getString(v, map);
					}
					double waitmillsec=Double.parseDouble(v)*1000;
					Thread.sleep((new Double(waitmillsec)).longValue());
				}else
					m.put(p.getName(), p.getValue());
			}
			return TemplateUtils.getString(responsebody, m);
		} catch (Exception e) {
			// TODO Auto-generated catch block
//			logger.error(e.getClass()+e.getMessage());
			e.printStackTrace();
			return "";
		}
		
	}
	
	@RequestMapping(value="/sleep/*")
	@ResponseBody
	public void sleepService(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String url=request.getPathInfo();
		if(url.endsWith("/")){
			url=url.substring(0, url.length()-1);
		}
		String second=StringUtils.substringAfter(url, "/delaysecond=");
		if(url.contains("/delaysecond=") && StringUtils.isNumeric(second)){
			Thread.sleep(Integer.parseInt(second)*1000);
			response.getWriter().println("done.");
		}else{
			response.getWriter().println("parameter error.");
		}
	}

	private void runSubThreadToRecordMockInvoked(String name,String reqenv,boolean isMock,String url,String reqbody,String res,long duration){
		InvokedRecordThread subThread=new InvokedRecordThread();
		subThread.setName(name);
		subThread.setRequestenv(reqenv);
		subThread.setIsmock(isMock);
		subThread.setRequesturl(url);
		subThread.setRequestbody(reqbody);
		subThread.setResponsebody(res);
		subThread.setDuration(Long.toString(duration));
		new Thread(subThread).start();
	}
}
