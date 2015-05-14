package com.testmocker.controller;

import java.util.HashMap;
import java.util.Map;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.freemarker.FreeMarkerTemplateUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.view.freemarker.FreeMarkerConfigurer;


import com.testmocker.httpmodel.Json;
import com.testmocker.httpmodel.MailItem;
import com.testmocker.httpmodel.TopicConfigItem;
import com.testmocker.service.MailWebService;
import com.testmocker.service.TopicDetailService;
import freemarker.template.Template;

@Controller
public class TopicDetailController {
	private static final Logger logger = Logger.getLogger(TopicDetailController.class);
	@Autowired
	TopicDetailService topicDetailService;
	@Autowired
	MailWebService mailWebServiceClient;
	@Autowired
	MailItem mailItem;
	@Autowired
	FreeMarkerConfigurer freeMarkerConfigurer;

	@RequestMapping(value = "/getTopicDetail", method = RequestMethod.POST)
	@ResponseBody
	public Json getTopicDetail(@RequestParam String code) {
		Json j = new Json();
		TopicConfigItem tci = topicDetailService.getTopicConfigByCode(code);
		j.setObj(tci);
		j.setSuccess(true);
		return j;
	}

	@RequestMapping(value = "/mockingTopic", method = RequestMethod.POST)
	@ResponseBody
	public Json mockingTopic(@RequestParam String code) {

		return topicDetailService.replaceWebServiceURL(code, true);
	}

	@RequestMapping(value = "/cancelMockTopic", method = RequestMethod.POST)
	@ResponseBody
	public Json cancelMockTopic(@RequestParam String code) {
		return topicDetailService.replaceWebServiceURL(code, false);
	}

	@RequestMapping(value = "/subscribeMail", method = RequestMethod.POST)
	@ResponseBody
	public Json subscribeMail(@RequestParam String requesttype, @RequestParam String name, @RequestParam String action, @RequestParam String mockServiceUrl,
			@RequestParam String serverType, @RequestParam String webServiceUrl) {
		Map mailDataMap = new HashMap();
		if (null!=action && !action.isEmpty()) {
			if (action.equals("n")) {
				mailDataMap.put("action", "撤销");
			} else if (action.equals("y")) {
				mailDataMap.put("action", "激活");
			}
		}
		mailDataMap.put("requesttype", requesttype);
		mailDataMap.put("serverType", serverType);
		mailDataMap.put("mockServiceUrl", mockServiceUrl);
		mailDataMap.put("webServiceUrl", webServiceUrl);
		mailDataMap.put("name", name);

		freeMarkerConfigurer.setDefaultEncoding("gbk");
		Template tpl;
		try {
			tpl = freeMarkerConfigurer.getConfiguration().getTemplate("mail.ftl");
			String emailContent = FreeMarkerTemplateUtils.processTemplateIntoString(tpl, mailDataMap);
			mailItem.setMailContent(emailContent);
			mailItem.setMailSubject("Mock启动关闭通知");
			mailWebServiceClient.sendMail(mailItem);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return null;
	}
}
