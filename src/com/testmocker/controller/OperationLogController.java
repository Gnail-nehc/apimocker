package com.testmocker.controller;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.testmocker.httpmodel.Json;
import com.testmocker.httpmodel.JsonList;
import com.testmocker.httpmodel.Log;
import com.testmocker.service.OperationLogService;


@Controller
public class OperationLogController {
	private static final Logger logger = Logger.getLogger(OperationLogController.class);
	@Autowired
	OperationLogService operationLogService;
	
	@RequestMapping(value="/getAllLogs")
	@ResponseBody
	public JsonList getAllLogs() {
		return operationLogService.getAllLogs();
	}
	
	@RequestMapping(value="/deleteLog", method=RequestMethod.POST)
	@ResponseBody
	public Json deleteLog(@RequestBody Log[] log){
		return operationLogService.deleteLog(log[0].getId());
	}
	
	@RequestMapping(value="/addLog", method=RequestMethod.POST)
	@ResponseBody
	public Json addLog(@RequestParam String requesttype,
			@RequestParam String name,
			@RequestParam String action){
		return operationLogService.addLog(requesttype,name,action);
	}
}
