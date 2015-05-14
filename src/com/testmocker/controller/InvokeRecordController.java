package com.testmocker.controller;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.testmocker.httpmodel.InvokeDetail;
import com.testmocker.httpmodel.InvokeRecord;
import com.testmocker.httpmodel.Json;
import com.testmocker.httpmodel.JsonList;
import com.testmocker.service.InvokeRecordService;


@Controller
public class InvokeRecordController {

	private static final Logger logger = Logger.getLogger(InvokeRecordController.class);
	
	@Autowired
	InvokeRecordService invokeRecordService;
	
	@RequestMapping(value="/getAllInvokeRecords")
	@ResponseBody
	public JsonList getAllInvokeRecords() {
		return invokeRecordService.getAllInvokeRecords(1000);
	}
	
	@RequestMapping(value="/getTodaysInvokeRecords")
	@ResponseBody
	public JsonList getTodaysInvokeRecords() {
		return invokeRecordService.getTodaysInvokeRecords();
	}
	
	@RequestMapping(value="/deleteInvokeRecord", method=RequestMethod.POST)
	@ResponseBody
	public Json deleteInvokeRecord(@RequestBody InvokeRecord[] record){
		return invokeRecordService.deleteInvokeRecord(record[0].getId());
	}
	
	@RequestMapping(value="/getInvokeDetail", method=RequestMethod.POST)
	@ResponseBody
	public Json getInvokeDetail(@RequestParam String id){
		Json j = new Json();
		InvokeDetail obj=invokeRecordService.getInvokeDetail(id);
		j.setObj(obj);
		j.setSuccess(true);
		return j;
	}
	
}
