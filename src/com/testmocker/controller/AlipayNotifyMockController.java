package com.testmocker.controller;

import java.net.URLDecoder;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.testmocker.enums.TimeFormatDefiniation;
import com.testmocker.thread.AlipayNotifyThread;
import com.testmocker.utils.Auto;
import com.testmocker.utils.HttpServletRequestUtils;


@Controller
public class AlipayNotifyMockController {

	private static final Logger logger = Logger.getLogger(AlipayNotifyMockController.class);

	@RequestMapping(value="/alipaynotify" , method=RequestMethod.POST)
	@ResponseBody
	public void alipaynotify(HttpServletRequest request, HttpServletResponse response) throws Exception {
		request.setCharacterEncoding("GBK");
		response.setContentType("text/xml");
		String reqbody=HttpServletRequestUtils.getHttpServletRequestBody(request);
		String _input_charset=request.getParameter("_input_charset")!=null?request.getParameter("_input_charset"):HttpServletRequestUtils.getValueFromRequestInput(reqbody,"_input_charset");
		String notify_url_needde=request.getParameter("notify_url")!=null?request.getParameter("notify_url"):HttpServletRequestUtils.getValueFromRequestInput(reqbody,"notify_url");
		String sign_type=request.getParameter("sign_type")!=null?request.getParameter("sign_type"):HttpServletRequestUtils.getValueFromRequestInput(reqbody,"sign_type");
		String notify_time=new SimpleDateFormat(TimeFormatDefiniation.standardformat).format(new Date());
		String notify_type="batch_trans_notify";
		String notify_id="alipayasyncnotifybymock";
		String batch_no_needde=request.getParameter("batch_no")!=null?request.getParameter("batch_no"):HttpServletRequestUtils.getValueFromRequestInput(reqbody,"batch_no");
		String pay_user_id_needde=request.getParameter("partner")!=null?request.getParameter("partner"):HttpServletRequestUtils.getValueFromRequestInput(reqbody,"partner");
		String pay_user_name_needde=request.getParameter("account_name")!=null?request.getParameter("account_name"):HttpServletRequestUtils.getValueFromRequestInput(reqbody,"account_name");
		String pay_account_no_needde=request.getParameter("email")!=null?request.getParameter("email"):HttpServletRequestUtils.getValueFromRequestInput(reqbody,"email");
		String fail_details="";
		String success_details_needde=request.getParameter("detail_data")!=null?request.getParameter("detail_data"):HttpServletRequestUtils.getValueFromRequestInput(reqbody,"detail_data");
		String success_details=URLDecoder.decode(success_details_needde, _input_charset);
		success_details=StringUtils.substringBeforeLast(success_details, "^");
		success_details+="^S^null^"+new Auto().getRandomNumber(15)+"^"+new SimpleDateFormat(TimeFormatDefiniation.timestring).format(new Date());//+"|";
		
		AlipayNotifyThread subThread=new AlipayNotifyThread();
		subThread.set_input_charset(_input_charset);
		subThread.setNotify_url(notify_url_needde);
		subThread.setSign_type(sign_type);
		subThread.setBatch_no(batch_no_needde);
		subThread.setFail_details(fail_details);
		subThread.setNotify_id(notify_id);
		subThread.setNotify_time(notify_time);
		subThread.setNotify_type(notify_type);
		subThread.setPay_account_no(pay_account_no_needde);
		subThread.setPay_user_id(pay_user_id_needde);
		subThread.setPay_user_name(pay_user_name_needde);
		subThread.setSuccess_details(success_details);
		new Thread(subThread).start();
		
//		new Thread(_input_charset+"} {"+notify_url+"} {"+notify_url_needde+"} {"+sign_type+"} {"+notify_time+"} {"+notify_type+"} {"+notify_id+"} {"+batch_no_needde+"} {"+pay_user_id_needde+"} {"+pay_user_name_needde+"} {"
//				+pay_account_no_needde+"} {"+success_details_needde+"} {"+success_details){ 
//			public void run(){
//				try {
//					String str=this.getName();
//					File f=new File("AlipayAsyncNotify.log");
//					if(!f.exists())
//						f.createNewFile();
//					List<String> lines=new ArrayList<String>();
//					for(String para : str.split("} {")){
//						lines.add("para: "+para);
//					}
//					FileUtils.writeLines(f, "GBK", lines);
//				} catch (IOException e) {
//					// TODO Auto-generated catch block
//					e.printStackTrace();
//				}
//			}
//		}.start();
		response.getWriter().println("<?xml version=\"1.0\" encoding=\"utf-8\"?><alipay><is_success>T</is_success><error>SUCCESS</error></alipay>");
	}
}
