package com.testmocker.service;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.testmocker.enums.Seperator;
import com.testmocker.enums.SpecialFileName;
import com.testmocker.factory.JsonObjectMapperFactory;
import com.testmocker.httpmodel.Json;
import com.testmocker.httpmodel.JsonList;
import com.testmocker.httpmodel.RequestParameterConfig;
import com.testmocker.httpmodel.RequestParameterConfigItem;
import com.testmocker.utils.JdbcUtils;

import shelper.iffixture.HTTPFacade;


@Service("topicConfigService")
public class TopicConfigService {
	private static final Logger logger = Logger.getLogger(TopicConfigService.class);
	
	@Autowired
	JdbcUtils jdbcUtils;
	
	public ArrayList<String> queryRowsByColumnName(String sql,String column){
		return jdbcUtils.getColumnValuesBySql(sql, column);
	}
	
	public String queryRowsByColumnNameNRowIndex(String sql,String column, int rowIndex){
		return jdbcUtils.getValueByColumnAndRowIndex(sql, column, String.valueOf(rowIndex));
	}
	
	public ArrayList<String> queryRowsByMultiColumnName(String sql,String[] columns){
		return jdbcUtils.getMultiColumnValuesBySql(sql, columns);
	}
	
	public Json returnJson(String sql,String[] returnColumns){
		Json j=new Json();
		ArrayList arr=new ArrayList<HashMap>();
		ArrayList<String> infos=queryRowsByMultiColumnName(sql,returnColumns);
		for(String info : infos){
			Map map = new HashMap();
			String[] item=info.split("\n");
			map.put("id", item[0]);
			if(item.length>1){
				map.put("text", item[1]);
			}else{
				map.put("text", item[0]);
			}
			arr.add(map);
		}
		j.setObj(arr);
		j.setSuccess(true);
		return j;
	}

	public String getResponse(String url,String requesttemplate,String head,Map request){
		HTTPFacade hf=new HTTPFacade();
		hf.setRequesttimeout(600*1000);
		hf.setUrl(url);
		String[] headarr1=head.split("\n");
		for(String headstr : headarr1){
			if(!headstr.isEmpty()){
				String[] headarr2=headstr.split(";");
				for(String keyvalue : headarr2){
					if(!keyvalue.isEmpty()){
						String key=keyvalue.split("=")[0].trim();
						String val=keyvalue.split("=")[1].trim();
						hf.addHeaderValue(key, val);
					}
				}
			}
		}
		if(requesttemplate==null || requesttemplate.isEmpty()){
			hf.get();
		}else{
			if(request!=null){
				for(Object e : request.entrySet()){
					Object v=((Entry<String,String>)e).getValue();
					if(v instanceof String){
						String k=((Entry<String,String>)e).getKey();
						hf.addParamValue(k, v.toString());
					}
				}
			}
			hf.addRequestBody(requesttemplate);
			hf.postWithQueryStrInUrl();
		}
		String res= hf.getResponseBody();
		logger.info(res);
//		if(res.contains("<RequestResult>")){
//			res=StringUtils.substringAfter(res, "<RequestResult>");
//			res=StringUtils.substringBeforeLast(res, "</RequestResult>");
//		}
		return res;
	}

	public JsonList getAllRequestParameterConfigs(String code){
		JsonList list = new JsonList();
		if(!code.isEmpty()){
			List<RequestParameterConfig> row=new ArrayList<RequestParameterConfig>();
			File root=new File(SpecialFileName.ROOT.getValue());
			for(String foldername : root.list()){
				if(foldername.startsWith(code)){
					for(String filename : new File(root,foldername).list()){
						if(!filename.equals(SpecialFileName.BASICCONFIG.getValue())){
							RequestParameterConfig rpc = new RequestParameterConfig();
							String[] fields = filename.split(Seperator.BASESEPERATOR.getValue());
							rpc.setId(fields[0]);
							rpc.setKv(fields[1]);
							row.add(rpc);
						}
					}
					break;
				}
			}
			list.setRows(row);
		}
		return list;
	}
	
	public Json deleteRequestParameterConfig(String code,String id){
		Json j= new Json();
		j.setSuccess(false);
		File root=new File(SpecialFileName.ROOT.getValue());
		for(String foldername : root.list()){
			if(foldername.startsWith(code)){
				for(File f : new File(root,foldername).listFiles()){
					if(f.getName().startsWith(id)){
						f.delete();
						j.setSuccess(true);
						break;
					}
				}
				break;
			}
		}
		return j;
	}
	
	public Json getRequestParameterConfigDetail(String code,String id){
		Json j= new Json();
		j.setSuccess(false);
		try{
			File root=new File(SpecialFileName.ROOT.getValue());
			for(String foldername : root.list()){
				if(foldername.startsWith(code)){
					for(File f : new File(root,foldername).listFiles()){
						if(f.getName().startsWith(id)){
							ObjectMapper mapper = JsonObjectMapperFactory.getObjectMapper();
							RequestParameterConfigItem item = mapper.readValue(f, RequestParameterConfigItem.class);
							j.setObj(item);
							j.setSuccess(true);
							break;
						}
					}
					break;
				}
			}
		}catch(Exception e){
			j.setSuccess(false);
		}
		return j;
	}
}
