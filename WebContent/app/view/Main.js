Ext.define('testmocker.view.Main', {
    extend: 'Ext.container.Viewport',
    id: 'Main',
    layout: 'border',
    
    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
        	items:[
        	{
        		xtype: 'panel',
        		bodyStyle:"background-image:url('image/head.jpg')",
        		region: 'north',
        		flex:2
        	},
        	{
        		xtype: 'tabpanel',
        		id:'MainTab',
        		region: 'center',
				flex:32,
			    activeTab:0,
			    listeners: {
			        tabchange : {
			            fn: me.tabchange,
			            scope: me
			        }
			    },
			    items:[
				{
					title:"我的工作区",
					bodyStyle:"background-image:url('image/background.jpg')",
					id:"MyWorkspaceTab",
					layout: 'border',
					items:[
				    	Ext.widget('MyTopicGrid'),
				    	Ext.widget('MyDetailPanel')
					]
				},
				{
					title:"公共区",
					bodyStyle:"background-image:url('image/background.jpg')",
					id:"PublicWorkspaceTab",
					layout: 'border',
					items:[
					    Ext.widget('PublicTopicGrid'),
					    Ext.widget('PublicDetailPanel')
					]
				},
				{
					title:"调用记录",
					bodyStyle:"background-image:url('image/background.jpg')",
					id:"InvokeLogTab",
					layout: 'border',
					items:[
					    Ext.widget('InvokeLogGrid'),
					    Ext.widget('InvokeDetailPanel')
					]
				}
				]
        	},
        	{
        		xtype: 'panel',
        		region: 'south',
				html : '<a color="white" href="mailto:gnail_nehc@aliyun.com">Contact Author</a><font color="white"> |  Copyright ©2014 liang chen | powered by ExtJS 4.2</font>',
				bodyStyle:"background-image:url('image/foot.jpg')",
				flex:1
        	}],
        	listeners: {
        		afterrender : {
	        		fn: me.afterrender,
	        		scope: me
	        	}
        	}
        });
        me.callParent(arguments);
    },
    afterrender : function(){
		Ext.getCmp('Main').IsPublicTab = false;
		Ext.getStore('Topic').load();
		Ext.Ajax.request( {
			url : 'task/checkAuthorities',
			method: "POST",
		    success : function(response, options) {
		    	var object=JSON.parse(response.responseText);
		    	if(object.success){
		    		var isadminrole=object.obj;
		    		if(isadminrole){
		    			var obj={
		    					title:"日志记录",
		    					id:'OperationLogTab',
		    					layout:'fit',
		    				    items:[
		    				        Ext.widget('OperationLogGrid')
		    				    ]
		    				};
		    			Ext.getCmp('MainTab').add(obj);
		    		}
		    	}else
		    		Ext.Msg.alert("错误","检查权限请求失败");
		    },
		    failure: function(response, opts) {
		    	lm.hide();
             	Ext.Msg.alert("错误","mockingTopic请求失败");
            }
		});
	},
	tabchange: function( tabPanel, newCard, oldCard, eOpts ){
		var tabName = newCard.title;
		switch(tabName)
		{
    		case "我的工作区":
    			Ext.getCmp('MockServiceUrlField').setValue('');
        		Ext.getCmp('ServerTypeField').setValue('');
        		Ext.getCmp('WebServiceUrlField').setValue('');
        		Ext.getCmp('ResponseTemplateField').setValue('');
        		Ext.getStore('Parameter').removeAll();
        		
    			Ext.getCmp('Main').IsPublicTab = false;
				Ext.getStore('Topic').proxy.extraParams.isPublic=false;
				Ext.getStore('Topic').load();
    			break;
    		case "公共区":
    			Ext.getCmp('MockServiceUrlField_p').setValue('');
        		Ext.getCmp('ServerTypeField_p').setValue('');
        		Ext.getCmp('WebServiceUrlField_p').setValue('');
        		Ext.getCmp('ResponseTemplateField_p').setValue('');
        		Ext.getStore('Parameter').removeAll();
        		
    			Ext.getCmp('Main').IsPublicTab = true;
				Ext.getStore('Topic').proxy.extraParams.isPublic=true;
				Ext.getStore('Topic').load();
    			break;
    		case "调用记录":
    			Ext.getCmp('RequestUrlField').setValue('');
        		Ext.getCmp('RequstBodyField').setValue('');
        		Ext.getCmp('ResponseBodyField').setValue('');
        		
        		Ext.getStore('InvokeRecord').load();
    			break;
		}
	}
});
