Ext.define('testmocker.view.MyTopicGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.MyTopicGrid',
    id: 'MyTopicGrid',
    flex:6,
	region: 'west',
    title: '接口mock列表',
    autoFill : true,
    store: 'Topic',
    stripeRows : true,
    margins:'20,10,20,30',
    viewConfig: {
        getRowClass: function(record, index, rowParams, store) {
        	var status=record.raw.status;
            if (status=='n')
            	return 'x-grid-row-black';
            else if (status=='y' || status=='r')
            	return 'x-grid-row-green';
            else if (status=='c')
            	return 'x-grid-row-blue';
        }
    },
    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
        	dockedItems: [
		    {
		        xtype: 'toolbar',
		        dock: 'top',
		        items: [
		        {
		            xtype: 'button',
		            handler: function(button, event) {
		            	Ext.getCmp('Main').TopicAction='n';
		            	Ext.getCmp('Main').ExistingCode='';
		            	Ext.widget('TopicConfigWindow').show();
		            },
		            icon: 'image/add.png',
		            tooltip: '新增Mock专题'
		        },
		        {
		            xtype: 'tbseparator'
		        },
		        {
		            xtype: 'button',
		            handler: function(button, event) {
		            	Ext.getStore('Topic').proxy.extraParams.isPublic=false;
		                Ext.getStore('Topic').load();
		            },
		            icon: 'image/refresh.png',
		            tooltip: '刷新'
		        }
		        ]
		    }],
		    columns: [
			    {	
					xtype:'gridcolumn',
					dataIndex: 'code',
					hidden:true
				},
				{
				    xtype: 'gridcolumn',
					flex:15,
				    dataIndex: 'name',
				    text: 'mock主题'
				},
				{
				    xtype: 'gridcolumn',
				    dataIndex: 'requesttype',
				    text: '请求类型',
				    flex: 55
				},
				{
				    xtype: 'gridcolumn',
				    dataIndex: 'status',
				    text: '状态',
				    flex: 12,
				    renderer: function(value, metaData, record, rowIndex, colIndex, store, view) {
                        if(value=='n'){
                            return '未mock';
                        }else if(value=='y'){
                            return '已mock';
                        }
                        else if(value=='c'){
                            return '已撤销';
                        }
                        else if(value=='r'){
                            return '重新mock';
                        }
                    }
				},
			    {
				    xtype: 'gridcolumn',
				    dataIndex: 'time',
				    text: '激活/撤销时间',
				    flex: 20,
				    renderer: function(value, metaData, record, rowIndex, colIndex, store, view) {
				    	if(value!=""){
				    		var time=value.split(" ")[1];
				    		value=value.split(" ")[0]+' '+time.substring(0,2)+':'+time.substring(2,4)+':'+time.substring(4,6);
				    	}
				    	return value;
				    }
				},
				{
				    xtype: 'gridcolumn',
				    dataIndex: 'owner',
				    text: '作者',
				    flex: 12
				},
			    {
			        xtype: 'actioncolumn',
			        text: '删除',
			        flex:1,
			        items: [
			        {
			            handler: function(view, rowIndex, colIndex, item, e, record, row) {
			            	if(record.raw.status=='y' || record.raw.status=='r'){
			            		Ext.Msg.alert("提示","不能删除正在mock的主题，请先撤销后删除");
			            	}else{
			            		Ext.MessageBox.confirm(
					                "confirm",
					                "确认删除？",
					                function(e){
					                    if(e=='yes'){
					                        Ext.getStore('Topic').removeAt(rowIndex);
					                        Ext.getStore('Topic').sync({});
					                    }
					                }
					            ); 
			            	}
			            },
			            icon: 'image/delete.png',
			            tooltip: 'delete'
			        }]
			    }
			],
			bbar : new Ext.PagingToolbar({
				store : 'Topic',
				displayInfo : true,
				beforePageText:"第",
				afterPageText:"/ {0}页",
				firstText:"首页",
				prevText:"上一页",
				nextText:"下一页",
				lastText:"尾页",
				refreshText:"刷新",
				displayMsg : "当前显示记录从 {0} - {1} 总 {2} 条记录",
				emptyMsg : "没有相关记录!",
				listeners : {
					change : function(that,pageData,eOpts){
						if(pageData!=null){
							var data=Ext.Array.slice( this.store.data.items, pageData.fromRecord-1, pageData.toRecord);
							this.store.loadData(data);
						}
					}
				}
			}),
		    listeners: {
		        itemmousedown : {
		            fn: me.griditemmousedown,
		            scope: me
		        },
		        itemdblclick : {
		        	fn: me.itemdblclick,
		            scope: me
		        },
		        itemmouseenter: {
                    fn: me.itemmouseenter,
                    scope: me
                }
		    }
        });
        me.callParent(arguments);
    },
    griditemmousedown : function( that, record, item, index, e, eOpts ){
    	Ext.getCmp('Main').ExistingCode=record.raw.code;
    	Ext.getCmp('Main').SelectedRequestType=record.raw.requesttype;
		Ext.getCmp('Main').SelectedTopicName=record.raw.name;
    	var lm = new Ext.LoadMask(Ext.getCmp('MyDetailPanel'), { 
			msg : '读取中。。。', 
			removeMask : true
		}); 
		lm.show();
 		Ext.Ajax.request( {
			url : 'task/getTopicDetail',
			method: "POST",
			params : {
				code : record.raw.code
			},
		    success : function(response, options) {
		    	lm.hide();
		    	var object=JSON.parse(response.responseText);
		    	if(object.success){
		    		var o=object.obj;
		    		Ext.getCmp('MockServiceUrlField').setValue(o.code);
		    		Ext.getCmp('ServerTypeField').setValue(o.servertype);
		    		Ext.getCmp('WebServiceUrlField').setValue(o.webserviceurl);
		    		Ext.getCmp('ResponseTemplateField').setValue(Ext.widget('TopicConfigWindow').formatResponseBody(o.template,true));
		    		Ext.getCmp('ParameterField').store.loadData(o.parameters);
		    		var display='';
		    		if(record.raw.time!=""){
		    			var t=record.raw.time;
		    			var y= t.substring(0,4);
		    			var m= t.substring(4,6);
		    			var d= t.substring(6,8);
		    			var h= t.substring(9,11);
		    			var mm= t.substring(11,13);
		    			var s= t.substring(13,15);
		    			var format;
		    			if(navigator.userAgent.toLowerCase().indexOf(".net")>0){//judge if IE 
		    				format= y+'-'+m+'-'+d+'T'+h+':'+mm+':'+s;
		    			}else{
		    				format= m+' '+d+','+y+' '+h+':'+mm+':'+s;
		    			}
		    			var duration=parseInt((new Date().getTime()-new Date(format).getTime())/1000);
		    			if(180>=duration)
		    				display='剩余生效时间： '+ (180-duration).toString() +'秒';
		    			else
		    				display='时间已生效！';
		    		}else
		    			display='';
		    		Ext.getCmp('RemainingTimeRemind').setText(display);
		    		Ext.getCmp('Main').TopicStatus=record.raw.status;
		    		if(record.raw.requesttype!=""){
		    			Ext.getCmp('BindMockButton').disabled=false;
			        	Ext.getCmp('CancelMockButton').disabled=false;
		    		}
		    	}else
		    		Ext.Msg.alert("错误",object.msg);
		    },
		    failure: function(response, opts) {
		    	lm.hide();
             	Ext.Msg.alert("错误","getTopicDetail请求失败");
            }
		});
	},
	itemdblclick : function( that, record, item, index, e, eOpts ){
		Ext.getCmp('Main').TopicAction='u';
		Ext.getCmp('Main').ExistingCode=record.raw.code;
		var lm = new Ext.LoadMask(Ext.getCmp('MyTopicGrid'), { 
			msg : '读取中。。。', 
			removeMask : true
		}); 
		lm.show();
 		Ext.Ajax.request( {
			url : 'task/getTopicDetail',
			method: "POST",
			params : {
				code : record.raw.code
			},
		    success : function(response, options) {
		    	lm.hide();
		    	var object=JSON.parse(response.responseText);
		    	if(object.success){
		    		var o=object.obj;
		    		var topicwin=Ext.widget('TopicConfigWindow');
		    		topicwin.show();
		    		
		    		Ext.getCmp('TopicNameField').setValue(o.name);
		    		Ext.getCmp('UserIDField').setValue(o.userid);
		    		if(record.raw.status=='y'){
		    			Ext.getCmp('ConfigedServerTypeField').disabled=true;
		    		}
		    		if(record.raw.status!='n'){
		    			Ext.getCmp('SubSystemCombo').disabled=true;
		    			Ext.getCmp('WebServiceNameCombo').disabled=true;
		    		}
		    		Ext.getCmp('ConfigedServerTypeField').setValue(o.servertype);
		    		Ext.getCmp('RequestTypeCombo').setValue(o.requesttype);
		    		Ext.getCmp('RequestTemplateTextArea').setValue(topicwin.formatRequestBody(o.requestbody,true));
		    		var restemp=o.template;
		    		restemp=topicwin.formatResponseBody(o.template,true);
		    		Ext.getCmp('ResponseTemplateTextArea').setValue(restemp);
		    		Ext.getCmp('ifsaveinvrecord').setValue(o.ifsaveinvoke);
		    		Ext.getCmp('ifnotsaveinvrecord').setValue(!o.ifsaveinvoke);
		    		Ext.getCmp('ParametersDataGrid').store.loadData(o.parameters);
		    		Ext.getStore('RequestParameterConfig').proxy.extraParams.code=Ext.getCmp('Main').ExistingCode;
		    		Ext.getStore('RequestParameterConfig').load();
		    	}else
		    		Ext.Msg.alert("错误",object.msg);
		    },
		    failure: function(response, opts) {
		    	lm.hide();
             	Ext.Msg.alert("错误","getTopicDetail请求失败");
            }
		});
	},
	itemmouseenter: function( that, record, item, index, e, eOpts ){
    	Ext.create('Ext.tip.ToolTip', {
            width: 90,
            height:30,
    		target:item,
    		html: '双击行编辑'
            //dismissDelay: 15000         //15秒后自动隐藏
        });
    }
	
});