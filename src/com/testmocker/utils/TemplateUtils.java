package com.testmocker.utils;

import java.io.StringWriter;
import java.util.Map;

import com.testmocker.template.StringTemplateLoader;

import freemarker.template.Configuration;
import freemarker.template.Template;



public class TemplateUtils {
	private static Configuration cfg = new Configuration();
	
	public static synchronized String getString(String templatestr,Map map) throws Exception{
		if( templatestr==null || templatestr.equals("") ){
			return "";
		}
		cfg.setTemplateLoader(new StringTemplateLoader(templatestr));
//		cfg.setDefaultEncoding("UTF-8");
		Template template = cfg.getTemplate("");
		StringWriter writer = new StringWriter();
		template.process(map, writer);
		return writer.toString(); 
	}
}
