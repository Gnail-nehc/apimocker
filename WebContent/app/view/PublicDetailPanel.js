Ext.define('testmocker.view.PublicDetailPanel', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.PublicDetailPanel',
    id:'PublicDetailPanel',
	layout:'anchor',
	flex:5,
    title:'配置详情',  
    region:'center',
    margins:'20,30,20,0' ,
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
					id:'MockServiceUrlField_p',
					padding:'3,4,4,4',
					labelWidth:100,
					anchor: '100% 7%',
					readOnly:true,
					fieldStyle: 'color: #837E7C;font-weight:bold;'
				},
				{	
					xtype:'textfield',
					fieldLabel: '请求环境',
					id:'ServerTypeField_p',
					padding:'3,4,4,4',
					labelWidth:100,
					anchor: '100% 7%',
					readOnly:true,
					fieldStyle: 'color: #837E7C;'
				},
				{	
					xtype:'textfield',
					fieldLabel: '原服务地址',
					id:'WebServiceUrlField_p',
					padding:'3,4,4,4',
					labelWidth:100,
					anchor: '100% 7%',
					readOnly:true,
					fieldStyle: 'color: #837E7C;'
				},
				{	
					xtype:'textarea',
					fieldLabel: '响应报文模板',
					id:'ResponseTemplateField_p',
					padding:'3,4,4,4',
					labelWidth:100,
					anchor: '100% 55%',
					readOnly:true,
					fieldStyle: 'color: #837E7C;'
				},
				{	
					xtype:'gridpanel',
					title: '参数列表',
					id:'ParameterField_p',
					anchor: '100% 25%',
					style:{ marginLeft: '105px'},
					padding:'3,4,4,4',
					mode:'local',
	                autoFill : true,
					store: 'Parameter',
					bodyStyle: 'color: #837E7C;',
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
			},
			{
				title:"请求参数配置",
				layout: 'anchor',
				items:[
				{
					xtype:'gridpanel',
					title: '请求参数预期值列表',
					id:'RequestParameterViewGrid_p',
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
				        	fn: me.reqparaconfigitemmousedown,
				            scope: me
				        }
				    }
				},
				{	
					xtype:'textarea',
					fieldLabel: '响应报文模板',
					id:'ResTemplateField_p',
					padding:'3,4,4,4',
					labelWidth:100,
					anchor: '100% 52%',
					readOnly:true
				},
				{	
					xtype:'gridpanel',
					title: '响应报文参数',
					id:'ParaField_p',
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
			}],
        	listeners: {
	        	tabchange : {
		            fn: me.tabchange,
		            scope: me
		        }
        	}
        });
        me.callParent(arguments);
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
    			var lm = new Ext.LoadMask(Ext.getCmp('PublicDetailPanel'), { 
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
			    		Ext.getCmp('RequestParameterViewGrid_p').getStore().loadData(object.rows);
			    		Ext.getCmp('ParaField_p').getStore().removeAll();
    			    },
    			    failure: function(response, opts) {
    			    	lm.hide();
    	             	Ext.Msg.alert("错误","getAllRequestParameterConfigs请求失败");
    	            }
    			});
    			break;
		}
    },
    reqparaconfigitemmousedown : function(that, record, item, index, e, eOpts){
    	var lm = new Ext.LoadMask(Ext.getCmp('PublicDetailPanel'), { 
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
		    		Ext.getCmp('ResTemplateField_p').setValue(Ext.getCmp('TopicConfigWindow').formatResponseBody(o.responsetemplate,true));
		    		Ext.getCmp('ParaField_p').store.loadData(o.parameters);
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