Ext.define('testmocker.store.RequestParameterConfig', {
    extend: 'Ext.data.Store',

    requires: [
        'testmocker.model.RequestParameterConfig'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: 'testmocker.model.RequestParameterConfig',
            storeId: 'RequestParameterConfig',
            pageSize: 9999,
            proxy: {
                type: 'ajax',
                afterRequest: function(request, success) {
                    if(!success){
                        Ext.Msg.alert('错误','RequestParameterConfigStore请求失败');
                        return;
                    }else{
                    	if(request.action=='destroy'){
                    		var obj=request.proxy.reader.rawData;
                        	if(obj.success){
                        		Ext.Ajax.request( {
			    					url : 'task/addLog',
			    					method: "POST",
			    					params : {
			    						requesttype : obj.obj.requesttype,
			    						name: obj.obj.name,
			    						action : 'd'
			    					},
			    				    success : function(response, options) {
			    				    },
			    				    failure: function(response, opts) {
			    				    	lm.hide();
			    		             	Ext.Msg.alert("错误","打log失败");
			    		            }
			    				});
                        	}else{
                        		Ext.Msg.alert('错误',"RequestParameterConfigStore请求失败");
                        		Ext.getStore("RequestParameterConfig").reload();
                        	}
                    	}	
                    }
                },
                api: {
                    read: 'task/getAllRequestParameterConfigs',
                    destroy: 'task/deleteRequestParameterConfig'
                },
                extraParams: {
                    code: ''
                },
                reader: {
                    type: 'json',
                    messageProperty: 'msg',
                    root: 'rows'
                },
                writer: {
                    type: 'json',
                    allowSingle: false
                }
            }
        }, cfg)]);
    }
});