Ext.define('testmocker.store.InvokeRecord', {
    extend: 'Ext.data.Store',

    requires: [
        'testmocker.model.InvokeRecord'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: 'testmocker.model.InvokeRecord',
            storeId: 'InvokeRecord',
            pageSize : 30,
            proxy: {
                type: 'ajax',
                afterRequest: function(request, success) {
                    if(!success){
                        Ext.Msg.alert('错误','InvokeRecord请求失败');
                        return;
                    }else{
                    	if(request.action!='read'){
                    		var obj=request.proxy.reader.rawData;
                        	if(obj.success){
                        		switch (request.action)
        	    				{
        		    				case "destroy":
        		    					Ext.getStore("InvokeRecord").reload();
        		    					break;
        		    				default:
        		    					break;
        	    				}
                        	}else{
                        		Ext.Msg.alert('错误',obj.msg);
                        		Ext.getStore("InvokeRecord").reload();
                        	}
                    	}	
                    }
                },
                api: {
                    read: 'task/getTodaysInvokeRecords',
                    destroy: 'task/deleteInvokeRecord'
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