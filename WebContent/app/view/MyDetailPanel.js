Ext.define('testmocker.view.MyDetailPanel', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.MyDetailPanel',
    id:'MyDetailPanel',
	layout:'anchor',
	flex:5,
	activeTab:0,
    title:'配置详情',  
    region:'center',
    margins:'20,30,20,0',
    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
        	items:[
				{
					title:"默认配置",
					layout: 'anchor',
					items:[
					{	
						xtype:'textfield',
						fieldLabel: 'Mock服务地址',
						id:'MockServiceUrlField',
						padding:'3,4,4,4',
						labelWidth:100,
						anchor: '100% 7%',
						readOnly:true,
						fieldStyle: 'font-weight:bold;'
					},
					{	
						xtype:'textfield',
						fieldLabel: '请求环境',
						id:'ServerTypeField',
						padding:'3,4,4,4',
						labelWidth:100,
						anchor: '100% 7%',
						readOnly:true
					},
					{	
						xtype:'textfield',
						fieldLabel: '原服务地址',
						id:'WebServiceUrlField',
						padding:'3,4,4,4',
						labelWidth:100,
						anchor: '100% 7%',
						readOnly:true
					},
					{	
						xtype:'textarea',
						fieldLabel: '响应报文模板',
						id:'ResponseTemplateField',
						padding:'3,4,4,4',
						labelWidth:100,
						anchor: '100% 52%',
						readOnly:true
					},
					{	
						xtype:'gridpanel',
						title: '响应报文参数',
						id:'ParameterField',
						anchor: '100% 22%',
						style:{ marginLeft: '105px'},
						padding:'3,4,4,4',
						mode:'local',
					    autoFill : true,
						store: 'Parameter',
						columns:[
							{
								header:"参数类型",
								dataIndex:"type",
								flex:3,
							},
							{
								header:"参数名",
								dataIndex:"name",
								flex:4,
							},
							{
								header:"参数值",
								flex:4,
								dataIndex:"value",
							},
							{
								header:"备注",
								flex:6,
								dataIndex:"comment",
							}
						]
					},
					{
		    			layout: {    type: 'hbox',    align: 'middle ',    pack: 'center'},
		    			anchor: '100% 5%',
		    			border:0,
		    			items:[
						{
							xtype: 'button',
							id:'BindMockButton',
						    handler: function(button, event) {
						    	var status=Ext.getCmp('Main').TopicStatus;
						    	if(status=='y' || status=='r'){
						    		Ext.Msg.alert("提示","已经在mock了");
									return;
						    	}else if(status=='c'){
						    		if(!Ext.String.startsWith(Ext.getCmp('RemainingTimeRemind').text,'时')){
						    			Ext.Msg.alert("提示","时间未生效，无法mock");
						    			return;
						    		}
						    	}else
						    		Ext.getCmp('BindMockButton').disabled=false;
						    	Ext.MessageBox.confirm(
						            "confirm",
						            "确认mock？",
						            function(e){
						                if(e=='yes'){
						                	var arr=Ext.getCmp('MockServiceUrlField').getValue().split('/');
						    		    	var lm = new Ext.LoadMask(Ext.getCmp('Main'), { 
						    					msg : 'mocking...', 
						    					removeMask : true
						    				}); 
						    				lm.show();
						    				Ext.Ajax.request( {
						    					url : 'task/mockingTopic',
						    					method: "POST",
						    					params : {
						    						code : arr[arr.length-1] !="" ? arr[arr.length-1] : arr[arr.length-2]
						    					},
						    				    success : function(response, options) {
						    				    	lm.hide();
						    				    	var object=JSON.parse(response.responseText);
						    				    	
						    				    	if(object.success){
						    				    		
						    				    		Ext.getStore('Topic').proxy.extraParams.isPublic=false;
						    							Ext.getStore('Topic').load();
						    							Ext.Ajax.request({
									    				    	    url : 'task/subscribeMail',
									    				    	    method: "POST",
									    				    	    params : {
									    						       requesttype : Ext.getCmp('Main').SelectedRequestType,
									    						       name: Ext.getCmp('Main').SelectedTopicName,
									    						       action : 'y',
									    						       mockServiceUrl:Ext.getCmp('MockServiceUrlField').getValue(),
									    						       serverType:Ext.getCmp('ServerTypeField').getValue(),
									    						       webServiceUrl:Ext.getCmp('WebServiceUrlField').getValue()
									    					         },
									    					          success : function(response, options) {
									    					          }
									    				    	});
						    							Ext.Ajax.request( {
									    					url : 'task/addLog',
									    					method: "POST",
									    					params : {
									    						requesttype : Ext.getCmp('Main').SelectedRequestType,
									    						name: Ext.getCmp('Main').SelectedTopicName,
									    						action : 'y'
									    					},
									    				    success : function(response, options) {
									    				    	
									    				    	
									    				    },
									    				    failure: function(response, opts) {
									    				    	lm.hide();
									    		             	Ext.Msg.alert("错误","打log失败");
									    		            }
									    				});
						    				    	}else
						    				    		Ext.Msg.alert("错误",object.msg);
						    				    },
						    				    failure: function(response, opts) {
						    				    	lm.hide();
						    		             	Ext.Msg.alert("错误","mockingTopic请求失败");
						    		            }
						    				});
						                }
						            }
						        );
						    },
						    //style: {marginLeft: '360px'},
						    icon: 'image/bind.png',
						    tooltip: '激活 mock'
						},
						{
				            xtype: 'tbseparator',
				            width:'40px',
				        },
						{
							xtype: 'button',
							id:'CancelMockButton',
						    handler: function(button, event) {
						    	var status=Ext.getCmp('Main').TopicStatus;
						    	if(status=='n' || status=='c'){
						    		Ext.Msg.alert("提示","不能撤销");
									return;
						    	}else if(status=='y' || status=='r'){
						    		if(!Ext.String.startsWith(Ext.getCmp('RemainingTimeRemind').text,'时')){
						    			Ext.Msg.alert("提示","时间未生效，无法撤销");
						    			return;
						    		}
						    	}else
						    		Ext.getCmp('CancelMockButton').disabled=false;
						    	Ext.MessageBox.confirm(
						            "confirm",
						            "确认撤销？",
						            function(e){
						                if(e=='yes'){
						                	var arr=Ext.getCmp('MockServiceUrlField').getValue().split('/');
						    		    	var lm = new Ext.LoadMask(Ext.getCmp('Main'), { 
						    					msg : 'cancelling...', 
						    					removeMask : true
						    				}); 
						    				lm.show();
						    		 		Ext.Ajax.request( {
						    					url : 'task/cancelMockTopic',
						    					method: "POST",
						    					params : {
						    						code : arr[arr.length-1] !="" ? arr[arr.length-1] : arr[arr.length-2]
						    					},
						    				    success : function(response, options) {
						    				    	lm.hide();
						    				    	var object=JSON.parse(response.responseText);
						    				    	if(object.success){
						    				    
						    				    		Ext.getStore('Topic').proxy.extraParams.isPublic=false;
						    							Ext.getStore('Topic').load();
						    									Ext.Ajax.request({
									    				    	    url : 'task/subscribeMail',
									    				    	    method: "POST",
									    				    	    params : {
									    						       requesttype : Ext.getCmp('Main').SelectedRequestType,
									    						       name: Ext.getCmp('Main').SelectedTopicName,
									    						       action : 'n',
									    						       mockServiceUrl:Ext.getCmp('MockServiceUrlField').getValue(),
									    						       serverType:Ext.getCmp('ServerTypeField').getValue(),
									    						       webServiceUrl:Ext.getCmp('WebServiceUrlField').getValue()
									    					         },
									    					          success : function(response, options) {
									    					          }
									    				    	});
						    							Ext.Ajax.request( {
									    					url : 'task/addLog',
									    					method: "POST",
									    					params : {
									    						requesttype : Ext.getCmp('Main').SelectedRequestType,
									    						name: Ext.getCmp('Main').SelectedTopicName,
									    						action : 'c'
									    					},
									    				    success : function(response, options) {
									    				    	
									    				    },
									    				    failure: function(response, opts) {
									    				    	lm.hide();
									    		             	Ext.Msg.alert("错误","打log失败");
									    		            }
									    				});
						    				    	}else
						    				    		Ext.Msg.alert("错误",object.msg);
						    				    },
						    				    failure: function(response, opts) {
						    				    	lm.hide();
						    		             	Ext.Msg.alert("错误","cancelMockTopic请求失败");
						    		            }
						    				});
						                }
						            }
						        ); 
						    },
						    //style: {marginLeft: '40px'},
						    icon: 'image/unbind.png',
						    tooltip: '撤销mock'
						},
						{
							xtype: 'label',
							id:'RemainingTimeRemind',
							style:{ marginLeft: '0px', color: 'red'},
							padding:'10,0,0,10',
						    //text: '剩余生效时间:280ms',
						}
		    			]
		    		}]
				},
				{
					title:"请求参数配置",
					layout: 'anchor',
					items:[
					{
						xtype:'gridpanel',
						title: '请求参数预期值列表',
						id:'RequestParameterViewGrid',
						anchor: '100% 24%',
						padding:'3,4,4,4',
						readOnly:true,
						labelWidth:100,
						style:{
							marginLeft: '105px',
						},
						mode:'local',
					    autoFill : true,
						store: 'RequestParameterConfig',
						columns:[
							{
								dataIndex:"id",
								hidden:true,
							},
							{
								header:"请求参数预期值",
								dataIndex:"kv",
								flex:16
							}
						],
						listeners: {
							itemmousedown : {
					        	fn: me.requestparaconfigitemmousedown,
					            scope: me
					        }
					    }
					},
					{	
						xtype:'textarea',
						fieldLabel: '响应报文模板',
						id:'ResTemplateField',
						padding:'3,4,4,4',
						labelWidth:100,
						anchor: '100% 52%',
						readOnly:true
					},
					{	
						xtype:'gridpanel',
						title: '响应报文参数',
						id:'ParaField',
						anchor: '100% 22%',
						style:{ marginLeft: '105px'},
						padding:'3,4,4,4',
						mode:'local',
					    autoFill : true,
						store: 'Parameter',
						columns:[
							{
								header:"参数类型",
								dataIndex:"type",
								flex:3,
							},
							{
								header:"参数名",
								dataIndex:"name",
								flex:4,
							},
							{
								header:"参数值",
								flex:4,
								dataIndex:"value",
							},
							{
								header:"备注",
								flex:6,
								dataIndex:"comment",
							}
						]
					}]
				}
        	],
        	listeners: {
        		afterrender : {
	        		fn: me.afterrender,
	        		scope: me
	        	},
	        	tabchange : {
		            fn: me.tabchange,
		            scope: me
		        }
        	}
        });
        me.callParent(arguments);
    },
    afterrender : function(){
    	Ext.getCmp('BindMockButton').disabled=true;
    	Ext.getCmp('CancelMockButton').disabled=true;
    },
    tabchange : function(tabPanel, newCard, oldCard, eOpts){
    	var tabName = newCard.title;
		switch(tabName)
		{
    		case "默认配置":
    			break;
    		case "请求参数配置":
    			if(Ext.getCmp('Main').ExistingCode==null || Ext.getCmp('Main').ExistingCode==''){
    				Ext.Msg.alert("提示","请先选择一个mock主题");
    				break;
    			}
    			var lm = new Ext.LoadMask(Ext.getCmp('MyDetailPanel'), { 
    				msg : '读取中。。。', 
    				removeMask : true
    			}); 
    			lm.show();
    	 		Ext.Ajax.request( {
    				url : 'task/getAllRequestParameterConfigs',
    				method: "POST",
    				params : {
    					code : Ext.getCmp('Main').ExistingCode
    				},
    			    success : function(response, options) {
    			    	lm.hide();
    			    	var object=JSON.parse(response.responseText);
			    		Ext.getCmp('RequestParameterViewGrid').getStore().loadData(object.rows);
			    		Ext.getCmp('ParaField').getStore().removeAll();
    			    },
    			    failure: function(response, opts) {
    			    	lm.hide();
    	             	Ext.Msg.alert("错误","getAllRequestParameterConfigs请求失败");
    	            }
    			});
    			break;
		}
    },
    requestparaconfigitemmousedown : function(that, record, item, index, e, eOpts){
    	var lm = new Ext.LoadMask(Ext.getCmp('MyDetailPanel'), { 
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
		    		var o=object.obj;
		    		var res=o.responsetemplate;
		    		res=Ext.getCmp('TopicConfigWindow').formatResponseBody(o.responsetemplate,true)
		    		Ext.getCmp('ResTemplateField').setValue(res);
		    		Ext.getCmp('ParaField').store.loadData(o.parameters);
		    	}else
		    		Ext.Msg.alert("错误",object.msg);
		    },
		    failure: function(response, opts) {
		    	lm.hide();
             	Ext.Msg.alert("错误","getRequestParameterConfigDetail请求失败");
            }
		});
    }
});