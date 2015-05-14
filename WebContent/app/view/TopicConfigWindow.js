var subSystemStore=new Ext.data.Store({
	autoLoad:false,
	proxy:{
		type:'ajax',
		getMethod: function(){ return 'POST'; },
		url:'task/getAllSubSystems',
        reader: {
            type: 'json',
            messageProperty: 'msg',
            root: 'obj'
        },
        writer: {
            type: 'json',
            allowSingle: false
        },
        afterRequest: function(request, success) {
            if(!success){
                Ext.Msg.alert('错误','SubSystemStore请求失败');
                return;
            }else{
            	Ext.getCmp('SubSystemCombo').dataitems=subSystemStore.data.items;
            }
        }
	},
	fields:['id','text']
});
var webServiceNameStore=new Ext.data.Store({
	autoLoad:false,
	proxy:{
		type:'ajax',
		getMethod: function(){ return 'POST'; },
		url:'task/getWebServicesBySubSystemID',
        extraParams: {
        	subSystemID : ''
        },
        reader: {
            type: 'json',
            messageProperty: 'msg',
            root: 'obj'
        },
        afterRequest: function(request, success) {
            if(!success){
                Ext.Msg.alert('错误','WebServiceStore请求失败');
                return;
            }
        }
	},
	fields:['id','text']
});
var requestTypeStore=new Ext.data.Store({
	autoLoad:false,
	proxy:{
		type:'ajax',
		getMethod: function(){ return 'POST'; },
		url:'task/getRequestTypesByWebServiceID',
        extraParams: {
        	webServiceID : ''
        },
        reader: {
            type: 'json',
            messageProperty: 'msg',
            root: 'obj'
        },
        afterRequest: function(request, success) {
            if(!success){
                Ext.Msg.alert('错误','RequestTypeStore请求失败');
                return;
            }
        }
	},
	fields:['id','text']
});
Ext.define('testmocker.view.TopicConfigWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.TopicConfigWindow',
    id: 'TopicConfigWindow',
    width: 1300,
    height: 800,
    modal:true,
    layout: 'fit',
    title: '配置Mock',
    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
        	items:[
        		{
        			xtype:'form',
        			id:"TopicConfigForm",
        			layout: 'border',
        			bodyStyle:"background-image:url('image/background.jpg')",
        			items:[
        				{
        					xtype:'panel',
		        			region:'west',
		        			flex:17,
		        			layout:'anchor',
		        			items:[
		        			    {
		        			    	xtype:'textfield',
		 							name:'url',
		 							value:location.href,
		 							hidden:true,
	        			        },
	        			        {
	        			        	xtype:'container',
	        					    layout: {
	        							type: 'hbox'
	        						},
	        						items:[
									{	
										xtype:'textfield',
										id:'TopicNameField',
										padding:'10,0,0,0',
										fieldLabel: '主题',
										labelWidth:70,
										anchor: '50% 7%',
										name:'name',
										allowBlank:false,
										regex:/^((?![\/:*?"<>|@']).)*$/,
									 	regexText:"禁止包含字符\/:*?\"<>|@'",
									},
									{	
										xtype:'textfield',
										id:'UserIDField',
										padding:'10,0,0,0',
										fieldLabel: 'UserID(AppID)',
										labelWidth:140,
										anchor: '50% 7%',
										name:'userid',
										allowBlank:true,
									}]
	        			        },
		        				{	
		        					xtype:'combobox',
		        					name:'servertype',
		        					id:'ConfigedServerTypeField',
		        					fieldLabel: '请求环境',
		        					labelWidth:70,
		        					padding:'10,4,4,0',
		        					//allowBlank:false,
		        					//readOnly:true,
		        					anchor: '100% 7%',
		        					//store:['Am','car','corp','cruise','english','FAT1','FAT10','FAT11','FAT12','FAT13','FAT14','FAT15','FAT16','FAT17','FAT18','FAT19','FAT2','FAT20','FAT201','FAT21','FAT22','FAT23','FAT24','FAT25','FAT26','FAT27','FAT28','FAT29','FAT3','FAT30','FAT31','FAT32','FAT33','FAT34','FAT35','FAT36','FAT37','FAT38','FAT39','FAT4','FAT40','FAT41','FAT42','FAT43','FAT44','FAT45','FAT46','FAT47','FAT48','FAT49','FAT5','FAT50','FAT54','FAT55','FAT56','FAT57','FAT58','FAT59','FAT6','FAT60','FAT61','FAT62','FAT63','FAT64','FAT65','FAT66','FAT67','FAT7','FAT71','FAT72','FAT74','FAT75','FAT77','FAT79','FAT8','FAT80','FAT9','FAT95','FAT96','finance','flight','fun','FWS','hhtravel','hotel','taocan','tour','train','ttd','you'],
		        					store:['FWS','FAT18'],
		        					value:'FWS'
		        				},
		        				{	
		        					xtype:'combobox',
		        					fieldLabel: '服务地址',
		        					id:'RequestUrl',
		        					//readOnly:true,
		        					labelWidth:70,
		        					anchor: '100% 7%',
		        					padding:'10,4,4,0',
		        					store:['http://XXX/SOA.ESB.asmx'],
		 							value:'http://XXX/SOA.ESB.asmx'
		        				},
		        				{
		        					xtype:'combobox',
		        					id:'SubSystemCombo',
		        					triggerAction: 'all',
		        					fieldLabel: '子系统',
		        					labelWidth:70,
		        					anchor: '100% 7%',
		        					padding:'10,4,4,0',
		        					store: subSystemStore,
		        					displayField:'text',                                
		        					valueField:'id',
		        					enableKeyEvents:true,
		        					dataitems:[],
		        					listeners: {
						        		change : {
							        		fn: me.getWebServicesBySubSystemID,
							        		scope: me
							        	},
							        	keyup : {
							        		fn: me.getSubSystemsByInput,
							        		scope: me
							        	}
						        	}
		        				},
		        				{
		        					xtype:'combobox',
		        					id:'WebServiceNameCombo',
		        					//name:'webserviceid',	
		        					triggerAction: 'all',
		        		            forceSelection: true,
		        					fieldLabel: '服务选择',
		        					labelWidth:70,
		        					anchor: '100% 7%',
		        					padding:'10,4,4,0',
		        					store: webServiceNameStore,
		        					displayField:'text',                                
		        					valueField:'id',
		        					listeners: {
						        		change : {
							        		fn: me.getRequestTypesByWebServiceID,
							        		scope: me
							        	}	
						        	}
		        				},
		        				{
		        					xtype:'combobox',
		        					id:'RequestTypeCombo',
		        					triggerAction: 'all',
		        					fieldLabel: '请求类型',
		        					labelWidth:70,
		        					anchor: '100% 7%',
		        					padding:'10,4,4,0',
									name:'requesttype',	
									//allowBlank:false,
									editable:false,
		        					store: requestTypeStore,
		        					displayField:'text',                                
		        					valueField:'text',
		        					listeners: {
						        		change : {
							        		fn: me.getRequestTemplateByRequestType,
							        		scope: me
							        	}	
						        	}
		        				},
		        				{
		        					xtype:'textarea',
		        					id:'RequestTemplateTextArea',
		        					anchor: '100% 35%',
		        					padding:'10,4,4,0',
		        					fieldLabel: '请求报文',
		        					name:'requestbody',
		        					//readOnly:true,
		        					labelWidth:70
		        				},
		        				{
		        					xtype:'textarea',
		        					id:'RequestHeadTextArea',
		        					anchor: '100% 8%',
		        					padding:'10,0,0,0',
		        					fieldLabel: '请求头',
		        					name:'requesthead',
		        					//readOnly:true,
		        					labelWidth:70
		        				},
		        				{
		        					xtype:'gridpanel',
		        					id:'RequestParameterGrid',
		        					anchor: '100% 24%',
		        					padding:'10,0,0,0',
		        					readOnly:true,
		        					labelWidth:70,
		        					style:{
		        						marginLeft: '76px',
									},
		        					mode:'local',
		        	                autoFill : true,
		        					store: 'RequestParameterConfig',
		        	                dockedItems: [
		        	                {
		        	                    xtype: 'toolbar',
		        	                    dock: 'top',
		        	                    items: [
		        	                    {
		        	                        xtype: 'button',
		        	                        handler: function(button, event) {
		        	                        	var rt=Ext.getCmp('RequestTypeCombo').getValue();
		        	                        	var rb=Ext.getCmp('RequestTemplateTextArea').getValue();
		        	                        	var rh=Ext.getCmp('RequestHeadTextArea').getValue();
		        	                        	if(rb=='' || rt=='' || rh==''){
		        	                        		Ext.Msg.alert("提示","请求类型，请求报文，请求头不能为空！");
		        	                        		return;
		        	                        	}
		        	                        	if(Ext.getCmp('Main').ExistingCode!=''){
		        	                        		Ext.getCmp('Main').ExistingId = '';
		        	                        		Ext.widget('RequestParameterConfigWindow').show();
		        	                        	}else{
		        	                        		Ext.Msg.alert("提示","请先保存Mock配置再添加。");
		        	                        	}
		        	                        },
		        	                        icon: 'image/add.png',
		        	                        tooltip: '新增设置'
		        	                    },
		        	                    {
		        	    		            xtype: 'tbseparator'
		        	    		        },
		        	    		        {
		        	    		            xtype: 'button',
		        	    		            handler: function(button, event) {
		        	    		            	Ext.getStore('RequestParameterConfig').proxy.extraParams.code=Ext.getCmp('Main').ExistingCode;
		        	    		                Ext.getStore('RequestParameterConfig').load();
		        	    		            },
		        	    		            icon: 'image/refresh.png',
		        	    		            tooltip: '刷新'
		        	    		        }]
		        	                }],
		        					columns:[
										{
											dataIndex:"id",
											hidden:true,
										},
										{
											header:"请求参数预期值",
											dataIndex:"kv",
											flex:16
										},
		        						{
										    xtype: 'actioncolumn',
										    flex:1,
										    items: [
										    {
										        handler: function(view, rowIndex, colIndex, item, e, record, row) {
										            Ext.MessageBox.confirm(
										            "confirm",
										            "确认删除？",
										            function(e){
										                if(e=='yes'){
										                	Ext.getStore('RequestParameterConfig').proxy.extraParams.code=Ext.getCmp('Main').ExistingCode;
										                	Ext.getStore('RequestParameterConfig').removeAt(rowIndex);
										                	Ext.getStore('RequestParameterConfig').sync();
										                }
										            }
										            ); 
										        },
										        icon: 'image/delete.png',
										        tooltip: '删除'
										    }]
										}
		        					],
		        					listeners: {
		        				        itemdblclick : {
		        				        	fn: me.requestconfigitemdblclick,
		        				            scope: me
		        				        },
		        				        itemmouseenter: {
		        		                    fn: me.requestconfigitemmouseenter,
		        		                    scope: me
		        		                }
		        				    }
		        				},
		        			]
        				},
        				{
		        			xtype:'button',
		        			icon: 'image/send.png',
		        			scale: 'large',
					        tooltip: '发送请求',
		        			region:'center',
		        			layout:'anchor',
		        			anchor: '60% 5%',
		        			style:{
		        				marginTop: '360px',
		        				marginBottom: '360px',
							},
		        			flex:1,
		        			handler: function(button, event) {
		        				if(Ext.getCmp('RequestTemplateTextArea').getValue()==""){
		                    		Ext.Msg.alert('提示','请求报文不能为空');
		                    		return;
		                    	}
		                    	if(Ext.getCmp('RequestHeadTextArea').getValue()==""){
		                    		Ext.Msg.alert('提示','请求头不能为空');
		                    		return;
		                    	}
		                    	var lm = new Ext.LoadMask(Ext.getCmp('TopicConfigWindow'), { 
									msg : '执行中。。。', 
									removeMask : true
								}); 
								lm.show();
								Ext.Ajax.request( {
									url : 'task/getResponse',
									method: "POST",
									params : {
										url : Ext.getCmp('RequestUrl').getValue(),
										requesttemplate : me.formatRequestBody(Ext.getCmp('RequestTemplateTextArea').getValue(),false),
										head : Ext.getCmp('RequestHeadTextArea').getValue()
									},
								    success : function(response, options) {
								    	lm.hide();
								    	var object=JSON.parse(response.responseText);
								    	if(object.success){
								    		var res=object.obj;
								    		res = me.formatResponseBody(res,true);
								    		Ext.getCmp('ResponseTemplateTextArea').setValue(res);
								    	}else
								    		Ext.Msg.alert("错误",object.msg);
								    },
								    failure: function(response, opts) {
								    	lm.hide();
						             	Ext.Msg.alert("错误","getTestResponse请求失败");
						            }
								});
		        			}
		        		},
		        		{
		        			xtype:'panel',
		        			region:'east',
		        			flex:17,
		        			layout:'anchor',
		        			items:[
		        				{
		        					xtype:'textarea',
		        					id:'ResponseTemplateTextArea',
		        					padding:'10,4,4,0',
		        					anchor: '100% 58%',
		        					fieldLabel: '响应报文',
		        					name:'template',
		        					labelWidth:70,
		        					allowBlank:false,
		        				},
		        				{
		        					xtype:"gridpanel",
		        					id: 'ParametersDataGrid',
		        					anchor: '99% 31%',
		        					style:{
		        						marginLeft: '83px',
									},
		        					padding:'2,4,4,4',
		        					title: '报文参数',
		        					mode:'local',
		        	                autoFill : true,
		        					store: 'Parameter',
		        	                dockedItems: [
		        	                {
		        	                    xtype: 'toolbar',
		        	                    dock: 'top',
		        	                    items: [
		        	                    {
		        	                        xtype: 'button',
		        	                        handler: function(button, event) {
		        	                        	Ext.getStore('Parameter').insert(0,{});
		        	                            var rowEdit = Ext.getCmp('ParametersDataGrid').getPlugin("ParameterEditPlugin");
		        	                            rowEdit.startEdit(0,1); 
		        	                        },
		        	                        icon: 'image/add.png',
		        	                        tooltip: '新增参数'
		        	                    },
		        	                    {
		        	                        xtype: 'tbseparator'
		        	                    },
		        	                    {
		        	                        xtype: 'button',
		        	                        handler: function(button, event) {
		        	                        	Ext.getStore('Parameter').load();
		        	                        },
		        	                        icon: 'image/clear.png',
		        	                        tooltip: '清空所有参数'
		        	                    }]
		        	                }],
		        	                plugins: [
		        	                    Ext.create('Ext.grid.plugin.RowEditing', {
		        	                        pluginId: 'ParameterEditPlugin',
		        	                        autoCancel:true,
		        	                        listeners: {
		        	                        	edit: {
		        				                    fn: function(editor, context, eOpts) {
		        				                    },
		        				                    scope: me
		        	                        	}
		        	                        }
		        	                    })
		        	                ],
		        					columns:[
										{
											header:"参数类型",
											dataIndex:"type",
											flex:3,
											editor: {
										        xtype: 'combobox',
										        editable:false,
										        allowBlank:false,
										        store: ['variable','delay'],
										        listeners: {
										        	select : {
											    		fn: me.selectparameter,
											    		scope: me
											    	}
			        	                        }
										    }
										},
		        						{
		        							header:"参数名",
		        							dataIndex:"name",
		        							flex:4,
		        							editor: {
		        						    	xtype: 'textfield',
		        						    	emptyText: '参数名必须唯一',
		        		                        allowBlank:false
		        						    }
		        						},
		        						{
		        							header:"参数值",
		        							flex:4,
		        							dataIndex:"value",
		        							editor: {
		        						    	xtype: 'textfield',
		        						    	id:'ParameterValueEdit',
		        		                        allowBlank:false
		        						    },
		        						},
		        						{
		        							header:"备注",
		        							flex:6,
		        							dataIndex:"comment",
		        							editor: {
		        						    	xtype: 'textfield'
		        						    },
		        						},
		        						{
										    xtype: 'actioncolumn',
										    flex:1,
										    items: [
										    {
										        handler: function(view, rowIndex, colIndex, item, e, record, row) {
										            Ext.MessageBox.confirm(
										            "confirm",
										            "确认删除？",
										            function(e){
										                if(e=='yes'){
										                	Ext.getStore('Parameter').removeAt(rowIndex);
										                	Ext.getStore('Parameter').sync();
										                }
										            }
										            ); 
										        },
										        icon: 'image/delete.png',
										        tooltip: '删除'
										    }]
										}
		        					]
		        				},
		        				{
		        					xtype:'radiogroup',
						    		fieldLabel : "是否保存调用记录",
						    		layout: 'hbox',
						    		anchor: '72% 6%',
						    		labelWidth:120,
						    		name:'rgIfSave',
						    		style: {
						    			marginRight: 'auto',
						    	        marginLeft: 'auto'
						    		},
						    		items:[
										new Ext.form.Radio({
										    id:"ifsaveinvrecord",
										    name:"ifsaveinvrec",
										    boxLabel:'是',
										    checked:false
										}),
										new Ext.form.Radio({
										    id:"ifnotsaveinvrecord",
										    name:"ifsaveinvrec",
										    boxLabel:'否',
										    checked:true
										})
									]
		        				},
		        				{
		        					xtype: 'button',
		        					style:{
		        						marginLeft: '300px',
								        //marginRight: '207px'
									},
									padding:'1,4,2,0',
		                            handler: function(button, event) {
		                            	var form=Ext.getCmp('TopicConfigForm').getForm();
		                            	if(form.isValid()){
		                            		var paras=[];
			                            	Ext.getStore('Parameter').data.items.forEach(function(item){
		                            			if(item.data.type!="undefined" && item.data.type!=""){
		                            				paras.push(item.data.type+'\n'+item.data.name+'\n'+item.data.value+'\n'+item.data.comment);	
		                            			}
		                            		});
		                            		form.submit({
		                            			url:'task/saveTopicConfig',
		                            			params:{
		                            				reqtemp: me.formatRequestBody(Ext.getCmp('RequestTemplateTextArea').getValue(),false),
		                            				restemp: me.formatResponseBody(Ext.getCmp('ResponseTemplateTextArea').getValue(),false),
		                            				parameters: paras.join("<<eof>>"),
		                            				existingcode : Ext.getCmp('Main').ExistingCode,
		                            				ifsaveinvokedrecord: Ext.getCmp('ifsaveinvrecord').checked
		                            			},
		                            			waitMsg : "保存中...",
		                            			method: 'POST',
			                            		success:function(form,action){
			                            			Ext.getStore('Topic').load();
			                            			if(action.result.success){
			                            				Ext.getCmp('Main').ExistingCode = action.result.obj;
			                            				Ext.Ajax.request( {
				    				    					url : 'task/addLog',
				    				    					method: "POST",
				    				    					params : {
				    				    						requesttype : Ext.getCmp('RequestTypeCombo').getValue(),
				    				    						name: Ext.getCmp('TopicNameField').getValue(),
				    				    						action : Ext.getCmp('Main').TopicAction
				    				    					},
				    				    				    success : function(response, options) {
				    				    				    	Ext.MessageBox.confirm('确认', '是否结束配置？', function(btn){
				    				    					        if (btn === 'yes') {
				    				    					        	me.close();
				    				    					        } else {
				    				    					        }
				    				    					    });
				    				    				    },
				    				    				    failure: function(response, opts) {
				    				    		             	Ext.Msg.alert("错误","打log失败");
				    				    		            }
				    				    				});
			                            			}else
			                            				Ext.Msg.alert("保存失败",action.result.msg);
			                            		},
			                            		failure:function(form,action){
			                            			if(!action.result.success){
			                            				Ext.Msg.alert('保存失败',action.result.msg);
			                            			}else{
			                            				Ext.Msg.alert('提示','请求失败');
			                            				me.close();
			                            			}
			                            		}
			                            	});
		                            	}
		                            },
		                            icon: 'image/save.png',
		                            scale: 'large',
							        tooltip: '保存'
		        				}
		        			]
		        		}
		        	]
        		}
        	],
        	listeners: {
        		afterrender : {
		    		fn: me.afterrender,
		    		scope: me
		    	}
		    }
        });
        me.callParent(arguments);
    },
	afterrender : function( that, The, eOpts ){
		Ext.getCmp('RequestHeadTextArea').setValue('SOAPAction="http://tempuri.org/Request"\nContent-Type=text/xml;charset=utf-8');
	},
	selectparameter : function( combo, records, eOpts ){
		if(records[0].raw[0]=='delay'){
			Ext.getCmp('ParameterValueEdit').emptyText='单位：秒';
			Ext.getCmp('ParameterValueEdit').regex=new RegExp("[1-9]{1,}");
			Ext.getCmp('ParameterValueEdit').regexText='须为>0的数';
		}
	},
	getWebServicesBySubSystemID : function( that, newValue, oldValue, eOpts ){
		Ext.getCmp('WebServiceNameCombo').clearValue('');
		webServiceNameStore.proxy.extraParams.subSystemID=newValue;
		webServiceNameStore.load();
	},
	getSubSystemsByInput: function(that, e, eOpts){
		var data=[];
		var input=that.rawValue;
		var items=Ext.getCmp('SubSystemCombo').dataitems;
		for(var i=0;i<items.length;i++){
			if(Ext.String.startsWith(items[i].raw.text,input,true)){
				data.push(items[i]);
			}
		}
		subSystemStore.loadData(data);
	},
    getRequestTypesByWebServiceID : function( that, newValue, oldValue, eOpts ){
    	Ext.getCmp('RequestTypeCombo').clearValue('');
    	requestTypeStore.proxy.extraParams.webServiceID=newValue;
    	requestTypeStore.load();
    },
    getRequestTemplateByRequestType : function( that, newValue, oldValue, eOpts ){
    	var condition=newValue;
		Ext.Ajax.request({
         	url:'task/getRequestTemplateByRequestType',
         	method:'POST',
         	params : {  
				requestType : condition
			},
            success: function(response, opts) {
            	var json=JSON.parse(response.responseText);
		    	if(json.success){
		    		var requestxml = json.obj;
		    		var head=Ext.getCmp('RequestHeadTextArea').getValue();
		    		//format soa 1.0 xml if head contains text/xml
		    		if(head.toLowerCase().indexOf("text/xml") > 12){
		    			var start='<?xml version="1.0"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><Request xmlns="http://tempuri.org/"><requestXML>';
            			var end='</requestXML></Request></soap:Body></soap:Envelope>';
            			requestxml=start+requestxml+end;
		    		}
		    		Ext.getCmp('RequestTemplateTextArea').setValue(requestxml);
		    	}else
		    		Ext.Msg.alert("错误","获取请求报文模板失败");
            },
             failure: function(response, opts) {
             	Ext.Msg.alert("错误","getRequestTemplateByRequestType请求失败");
             	console.log(response.responseText);
            }
        });
    },
    requestconfigitemdblclick: function( that, record, item, index, e, eOpts ){
    	Ext.getCmp('Main').TopicAction='u';
    	Ext.getCmp('Main').ExistingId = record.raw.id;
		var lm = new Ext.LoadMask(Ext.getCmp('TopicConfigWindow'), { 
			msg : '读取中。。。', 
			removeMask : true
		}); 
		lm.show();
 		Ext.Ajax.request( {
			url : 'task/getRequestParameterConfigDetail',
			method: "POST",
			params : {
				code : Ext.getCmp('Main').ExistingCode,
				id : record.raw.id
			},
		    success : function(response, options) {
		    	lm.hide();
		    	var object=JSON.parse(response.responseText);
		    	if(object.success){
		    		Ext.widget('RequestParameterConfigWindow').show();
		    		var o=object.obj;
		    		Ext.getCmp('UserIDText').setValue(o.userid);
		    		Ext.getCmp('RequestParameterText').setValue(o.requestparameter);
		    		var restemp=o.responsetemplate;
		    		restemp=Ext.getCmp('TopicConfigWindow').formatResponseBody(o.responsetemplate,true);
		    		Ext.getCmp('ResponseTemplateText').setValue(restemp);
		    		Ext.getCmp('ResponseParameterGrid').store.loadData(o.parameters);
		    	}else
		    		Ext.Msg.alert("错误",object.msg);
		    },
		    failure: function(response, opts) {
		    	lm.hide();
             	Ext.Msg.alert("错误","getRequestParameterConfigDetail请求失败");
            }
		});
    },
    requestconfigitemmouseenter: function( that, record, item, index, e, eOpts ){
    	Ext.create('Ext.tip.ToolTip', {
            width: 90,
            height:30,
    		target:item,
    		html: '双击行编辑'
            //dismissDelay: 15000         //15秒后自动隐藏
        });
    },
    formatResponseBody: function(body, forView){
    	if(body.indexOf("<Response>")==-1 || (Ext.String.startsWith(body,"{") && Ext.String.endsWith(body,"}"))){
    		return body;
    	}
    	var xml=body;
    	if(body.indexOf("<RequestResult>")!=-1 && body.indexOf("</RequestResult>")!=-1){
    		var start=body.indexOf("<RequestResult>")+"<RequestResult>".length;
    		var end=body.indexOf("</RequestResult>",start);
    		xml=body.substring(start,end);
    	}
		var formattedxml = "";
		if(forView)
			formattedxml=xml.replace(new RegExp("&amp;","gm"), "&").replace(new RegExp("&lt;","gm"), "<").replace(new RegExp("&gt;","gm"), ">").replace(new RegExp("&apos;","gm"), "'").replace(new RegExp("&quot;","gm"), "\"");
		else
			formattedxml=xml.replace(new RegExp("&","gm"), "&amp;").replace(new RegExp("<","gm"), "&lt;").replace(new RegExp(">","gm"), "&gt;").replace(new RegExp("'","gm"), "&apos;").replace(new RegExp("\"","gm"), "&quot;");
		return body.replace(xml,formattedxml);
    },
    formatRequestBody: function(body, forView){
    	var start=body.indexOf("<requestXML>")+"<requestXML>".length;
		var end=body.indexOf("</requestXML>",start);
		var xml=body.substring(start,end);
		var formattedxml = "";
		if(forView)
			formattedxml=xml.replace(new RegExp("&amp;","gm"), "&").replace(new RegExp("&lt;","gm"), "<").replace(new RegExp("&gt;","gm"), ">").replace(new RegExp("&apos;","gm"), "'").replace(new RegExp("&quot;","gm"), "\"");
		else
			formattedxml=xml.replace(new RegExp("&","gm"), "&amp;").replace(new RegExp("<","gm"), "&lt;").replace(new RegExp(">","gm"), "&gt;").replace(new RegExp("'","gm"), "&apos;").replace(new RegExp("\"","gm"), "&quot;");
		return body.replace(xml,formattedxml);
    }
});