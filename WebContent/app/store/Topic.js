Ext.define('testmocker.store.Topic', {
    extend: 'Ext.data.Store',

    requires: [
        'testmocker.model.Topic'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: 'testmocker.model.Topic',
            storeId: 'Topic',
            pageSize : 30,
            proxy: {
                type: 'ajax',
                afterRequest: function(request, success) {
                    if(!success){
                        Ext.Msg.alert('错误','TopicStore请求失败');
                        return;
                    }else{
                    	if(request.action=='destroy'){
                    		var obj=request.proxy.reader.rawData;
                        	if(obj.success){
                        		Ext.getCmp('MockServiceUrlField').setValue('');
                        		Ext.getCmp('ServerTypeField').setValue('');
                        		Ext.getCmp('WebServiceUrlField').setValue('');
                        		Ext.getCmp('ResponseTemplateField').setValue('');
                        		Ext.getStore('Parameter').removeAll();
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
                        		Ext.Msg.alert('错误',"TopicStore请求失败");
                        		Ext.getStore("Topic").reload();
                        	}
                    	}	
                    }
                },
                api: {
                    read: 'task/getAllTopics',
                    destroy: 'task/deleteTopic'
                },
                extraParams: {
                    isPublic: false
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
            },
            sorters: {
                direction: 'DESC',
                property: 'time'
            }
        }, cfg)]);
    }
});