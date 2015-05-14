package com.testmocker.thread;

import java.io.File;
import java.io.IOException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang.StringUtils;

import com.testmocker.utils.Auto;
import com.testmocker.utils.HttpRequester;
import com.testmocker.utils.HttpResponse;

import shelper.iffixture.HTTPFacade;



public class AlipayNotifyThread implements Runnable {
	private String _input_charset="";
	private String notify_url="";
	private String sign_type="";
	private String notify_time="";
	private String notify_type="";
	private String notify_id="";
	private String batch_no="";
	private String pay_user_id="";
	private String pay_user_name="";
	private String pay_account_no="";
	private String fail_details="";
	private String success_details="";
	
	public synchronized void run() {
		try {
			String notify_time_en = URLEncoder.encode(getNotify_time(), get_input_charset());
			String batch_no_de=URLDecoder.decode(getBatch_no(), get_input_charset());
			String pay_user_id_de=URLDecoder.decode(getPay_user_id(), get_input_charset());
			String pay_user_name_de=URLDecoder.decode(getPay_user_name(), get_input_charset());
			String pay_account_no_de=URLDecoder.decode(getPay_account_no(), get_input_charset());
			String success_details_en=URLEncoder.encode(getSuccess_details(), get_input_charset());
			
			String []str = {
					"notify_time="+getNotify_time(),
					"notify_type="+getNotify_type(),
					"notify_id="+getNotify_id(),
					"batch_no="+batch_no_de,
					"pay_user_id="+pay_user_id_de,
					"pay_user_name="+pay_user_name_de,
					"pay_account_no="+pay_account_no_de,
					"fail_details="+getFail_details(),
					"success_details="+getSuccess_details()
			};
			Arrays.sort(str);
			String md5encodedstring="";//"_input_charset=GBK";
			for(int i=0;i<str.length;i++){
				if(!str[i].endsWith("="))
					md5encodedstring+=str[i]+"&";
			}
			if("2088011750878094".equals(pay_user_id_de)){
				pay_user_id_de="sodt0yy68hxeex45yv4vb803zhqt8st3";
			}else if("2088811210243840".equals(pay_user_id_de)){
				pay_user_id_de="xa33l3lxfowgfkdcw6z7031a1db4zfr4";
			}else if("2088101568355903".equals(pay_user_id_de)){
				pay_user_id_de="vcszq64ertknw0tq9iwg8p46vo0vb0ia";
			}
			md5encodedstring=md5encodedstring.substring(0, md5encodedstring.length()-1)+pay_user_id_de;
			
			String sign=new Auto().getMd5HexString("\""+md5encodedstring+"\"");
			Map<String,String> params=new HashMap<String,String>();
			params.put("notify_time", notify_time_en);
			params.put("notify_type", getNotify_type());
			params.put("notify_id", getNotify_id());
			params.put("sign_type", getSign_type());
			params.put("sign", sign);
			params.put("batch_no", getBatch_no());
			params.put("pay_user_id", getPay_user_id());
			params.put("pay_user_name", getPay_user_name());
			params.put("pay_account_no", getPay_account_no());
			params.put("fail_details", getFail_details());
			params.put("success_details", success_details_en);

//			try{
//				HTTPFacade hf=new HTTPFacade(false);
//				hf.setRequesttimeout(600*1000);
//				hf.setUrl(URLDecoder.decode(getNotify_url(), "GBK"));
//				for(Entry<String,String> e : params.entrySet()){
//					hf.addParamValue(e.getKey(),URLDecoder.decode(e.getValue(), "GBK"));
//				}
//				hf.addHeaderValue("Content-Type", "application/json; charset=UTF-8");
//				hf.addRequestBody("");
//				hf.postWithQueryStrInUrl();
//			}catch(Exception e){
//			}
			
			HttpRequester requester=new HttpRequester();
			requester.setDefaultContentEncoding(get_input_charset());
			HttpResponse response = requester.sendPost(getNotify_url(), params, get_input_charset());
//			new Thread("{"+url+"} {"+md5encodedstring+"} {"+sign+"} {"+response.getContent()+"}"){ 
//				public void run(){
//					try {
//						String oldtext="";
//						String str=this.getName();
//						File f=new File("AlipayAsyncNotify.log");
//						if(!f.exists()){
//							f.createNewFile();
//						}else{
//							oldtext=FileUtils.readFileToString(f, "GBK");
//						}
//						List<String> lines=new ArrayList<String>();
//						lines.add("time: "+new Date().toString());
//						lines.add("content: "+str);
//						if(!oldtext.isEmpty())
//							lines.add(oldtext);
//						FileUtils.writeLines(f, "GBK", lines);
//					} catch (IOException e) {
//						// TODO Auto-generated catch block
//						e.printStackTrace();
//					}
//				}
//			}.start();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	}

	public String get_input_charset() {
		return _input_charset;
	}

	public void set_input_charset(String _input_charset) {
		this._input_charset = _input_charset;
	}

	public String getNotify_url() {
		return notify_url;
	}

	public void setNotify_url(String notify_url) {
		this.notify_url = notify_url;
	}

	public String getSign_type() {
		return sign_type;
	}

	public void setSign_type(String sign_type) {
		this.sign_type = sign_type;
	}

	public String getNotify_time() {
		return notify_time;
	}

	public void setNotify_time(String notify_time) {
		this.notify_time = notify_time;
	}

	public String getNotify_type() {
		return notify_type;
	}

	public void setNotify_type(String notify_type) {
		this.notify_type = notify_type;
	}

	public String getNotify_id() {
		return notify_id;
	}

	public void setNotify_id(String notify_id) {
		this.notify_id = notify_id;
	}

	public String getBatch_no() {
		return batch_no;
	}

	public void setBatch_no(String batch_no) {
		this.batch_no = batch_no;
	}

	public String getPay_user_id() {
		return pay_user_id;
	}

	public void setPay_user_id(String pay_user_id) {
		this.pay_user_id = pay_user_id;
	}

	public String getPay_user_name() {
		return pay_user_name;
	}

	public void setPay_user_name(String pay_user_name) {
		this.pay_user_name = pay_user_name;
	}

	public String getPay_account_no() {
		return pay_account_no;
	}

	public void setPay_account_no(String pay_account_no) {
		this.pay_account_no = pay_account_no;
	}

	public String getFail_details() {
		return fail_details;
	}

	public void setFail_details(String fail_details) {
		this.fail_details = fail_details;
	}

	public String getSuccess_details() {
		return success_details;
	}

	public void setSuccess_details(String success_details) {
		this.success_details = success_details;
	}
}
