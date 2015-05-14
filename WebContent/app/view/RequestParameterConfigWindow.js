Ext.define('testmocker.view.RequestParameterConfigWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.RequestParameterConfigWindow',
    id: 'RequestParameterConfigWindow',
    width: 1300,
    height: 800,
    modal:true,
    layout: 'fit',
    title: '配置请求参数',
    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
        	items:[
        		{
        			xtype:'form',
        			id:"RequestParameterConfigForm",
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
									id:'UserIDText',
									padding:'10,0,0,0',
									fieldLabel: 'UserID(AppID)',
									labelWidth:70,
									anchor: '100% 7%',
									name:'userid',
									allowBlank:true,
								},
		        				{
		        					xtype:'textarea',
		        					id:'RequestTemplateText',
		        					anchor: '100% 48%',
		        					padding:'10,4,4,0',
		        					fieldLabel: '请求报文',
		        					name:'requestbody',
		        					//readOnly:true,
		        					labelWidth:70
		        				},
		        				{
		        					xtype:'textarea',
		        					id:'RequestHeadText',
		        					anchor: '100% 15%',
		        					padding:'10,0,0,0',
		        					fieldLabel: '请求头',
		        					name:'requesthead',
		        					readOnly:true,
		        					labelWidth:70
		        				},
		        				{
		        					xtype:'textarea',
		        					id:'RequestParameterText',
		        					anchor: '100% 30%',
		        					padding:'10,0,0,0',
		        					fieldLabel: '请求参数预期值列表(key=value 每行一组)',
		        					name:'requestparameter',
		        					labelWidth:70,
		        					allowBlank:false
		        				}
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
		                    	var lm = new Ext.LoadMask(Ext.getCmp('RequestParameterConfigWindow'), { 
									msg : '执行中。。。', 
									removeMask : true
								}); 
								lm.show();
								Ext.Ajax.request( {
									url : 'task/getResponseByRequestParameter',
									method: "POST",
									params : {
										url : Ext.getCmp('RequestUrl').getValue(),
										requesttemplate : Ext.getCmp('TopicConfigWindow').formatRequestBody(Ext.getCmp('RequestTemplateTextArea').getValue(),false),
										head : Ext.getCmp('RequestHeadTextArea').getValue(),
										requestparameter: me.formatRequestParameter(Ext.getCmp('RequestParameterText').getValue())
									},
								    success : function(response, options) {
								    	lm.hide();
								    	var object=JSON.parse(response.responseText);
								    	if(object.success){
								    		var resbody=Ext.getCmp('TopicConfigWindow').formatResponseBody(object.obj,true);
								    		Ext.getCmp('ResponseTemplateText').setValue(resbody);
								    	}else
								    		Ext.Msg.alert("错误",object.msg);
								    },
								    failure: function(response, opts) {
								    	lm.hide();
						             	Ext.Msg.alert("错误","getResponseByRequestParametere请求失败");
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
		        					id:'ResponseTemplateText',
		        					padding:'10,4,4,0',
		        					anchor: '100% 60%',
		        					fieldLabel: '响应报文',
		        					name:'responsebody',
		        					labelWidth:70,
		        					allowBlank:false,
		        				},
		        				{
		        					xtype:"gridpanel",
		        					id: 'ResponseParameterGrid',
		        					anchor: '99% 35%',
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
		        	                            var rowEdit = Ext.getCmp('ResponseParameterGrid').getPlugin("ResParameterEditPlugin");
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
		        	                        pluginId: 'ResParameterEditPlugin',
		        	                        autoCancel:true,
//		        	                        listeners: {
//		        	                        	edit: {
//		        				                    fn: function(editor, context, eOpts) {
//		        				                    },
//		        				                    scope: me
//		        	                        	}
//		        	                        }
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
		        						    	id:'ParameterValueText',
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
		        					xtype: 'button',
		        					style:{
		        						marginLeft: '350px',
								        //marginRight: '207px'
									},
									padding:'1,4,2,0',
		                            handler: function(button, event) {
		                            	var form=Ext.getCmp('RequestParameterConfigForm').getForm();
		                            	if(form.isValid()){
		                            		var paras=[];
			                            	Ext.getStore('Parameter').data.items.forEach(function(item){
		                            			if(item.data.type!="undefined" && item.data.type!=""){
		                            				paras.push(item.data.type+'\n'+item.data.name+'\n'+item.data.value+'\n'+item.data.comment);	
		                            			}
		                            		});
		                            		form.submit({
		                            			url:'task/saveRequestParameterConfig',
		                            			params:{
		                            				existingcode : Ext.getCmp('Main').ExistingCode,
		                            				id : Ext.getCmp('Main').ExistingId,
		                            				requestparameter: me.formatRequestParameter(Ext.getCmp('RequestParameterText').getValue()),
		                            				responsetemplate: Ext.getCmp('TopicConfigWindow').formatResponseBody(Ext.getCmp('ResponseTemplateText').getValue(),false),
		                            				parameters: paras.join("<<eof>>")
		                            			},
		                            			waitMsg : "保存中...",
		                            			method: 'POST',
			                            		success:function(form,action){
			                            			Ext.getStore('RequestParameterConfig').proxy.extraParams.code=Ext.getCmp('Main').ExistingCode;
			                            			Ext.getStore('RequestParameterConfig').load();
			                            			if(action.result.success){
			                            				Ext.Ajax.request( {
				    				    					url : 'task/addLog',
				    				    					method: "POST",
				    				    					params : {
				    				    						requesttype : Ext.getCmp('RequestTypeCombo').getValue(),
				    				    						name: Ext.getCmp('TopicNameField').getValue(),
				    				    						action : 'u'
				    				    					},
				    				    				    success : function(response, options) {
				    				    				    	me.close();
				    				    				    },
				    				    				    failure: function(response, opts) {
				    				    		             	Ext.Msg.alert("错误","打log失败");
				    				    		            }
				    				    				});
			                            			}else
			                            				Ext.Msg.alert("保存失败",action.result.msg);
			                            		},
			                            		failure:function(form,action){
			                            			Ext.Msg.alert('提示','请求失败');
			                            			me.close();		
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
		Ext.getCmp('RequestTemplateText').setValue(Ext.getCmp('RequestTemplateTextArea').getValue());
		Ext.getCmp('RequestHeadText').setValue(Ext.getCmp('RequestHeadTextArea').getValue());
	},
    formatRequestParameter : function(text){
    	if(text=="")
    		return "";
    	var formattedtext="";
    	var arr = text.replace("\r", "").split("\n");
    	for(var i = 0; i<arr.length;i++){
    		var pair=arr[i].split("=");
    		if(pair.length==2){
    			formattedtext+=pair[0].replace(/(^\s*)|(\s*$)/g,"")+"=" + pair[1].replace(/(^\s*)|(\s*$)/g,"")+"\n";
			}if(pair.length>2){
				formattedtext+=pair[0].replace(/(^\s*)|(\s*$)/g,"")+"=" + arr[i].substring((pair[0]+"=").length).replace(/(^\s*)|(\s*$)/g,"")+"\n";
			}
		}
		return formattedtext.substring(0, formattedtext.length-1);
    },
	selectparameter : function( combo, records, eOpts ){
		if(records[0].raw[0]=='delay'){
			Ext.getCmp('ParameterValueText').emptyText='单位：秒';
			Ext.getCmp('ParameterValueText').regex=new RegExp("[1-9]{1,}");
			Ext.getCmp('ParameterValueText').regexText='须为>0的数';
		}
	}
//    formatResponseBody: function(body, forView){
//    	var start=body.indexOf("<RequestResult>")+"<RequestResult>".length;
//		var end=body.indexOf("</RequestResult>",start);
//		var xml=body.substring(start,end);
//		var formattedxml = "";
//		if(forView)
//			formattedxml=xml.replace(new RegExp("&amp;","gm"), "&").replace(new RegExp("&lt;","gm"), "<").replace(new RegExp("&gt;","gm"), ">").replace(new RegExp("&apos;","gm"), "'").replace(new RegExp("&quot;","gm"), "\"");
//		else
//			formattedxml=xml.replace(new RegExp("&","gm"), "&amp;").replace(new RegExp("<","gm"), "&lt;").replace(new RegExp(">","gm"), "&gt;").replace(new RegExp("'","gm"), "&apos;").replace(new RegExp("\"","gm"), "&quot;");
//		return body.replace(xml,formattedxml);
//    },
//    formatRequestBody: function(body, forView){
//    	var start=body.indexOf("<requestXML>")+"<requestXML>".length;
//		var end=body.indexOf("</requestXML>",start);
//		var xml=body.substring(start,end);
//		var formattedxml = "";
//		if(forView)
//			formattedxml=xml.replace(new RegExp("&amp;","gm"), "&").replace(new RegExp("&lt;","gm"), "<").replace(new RegExp("&gt;","gm"), ">").replace(new RegExp("&apos;","gm"), "'").replace(new RegExp("&quot;","gm"), "\"");
//		else
//			formattedxml=xml.replace(new RegExp("&","gm"), "&amp;").replace(new RegExp("<","gm"), "&lt;").replace(new RegExp(">","gm"), "&gt;").replace(new RegExp("'","gm"), "&apos;").replace(new RegExp("\"","gm"), "&quot;");
//		return body.replace(xml,formattedxml);
//    }
});