Ext.define('testmocker.store.Log', {
    extend: 'Ext.data.Store',

    requires: [
        'testmocker.model.Log'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: 'testmocker.model.Log',
            storeId: 'Log',
            pageSize : 30,
            proxy: {
                type: 'ajax',
                afterRequest: function(request, success) {
                    if(!success){
                        Ext.Msg.alert('错误','LogStore请求失败');
                        return;
                    }else{
                    	if(request.action!='read'){
                    		var obj=request.proxy.reader.rawData;
                        	if(obj.success){
                        		switch (request.action)
        	    				{
        		    				case "destroy":
        		    					Ext.getStore("Log").reload();
        		    					break;
        		    				default:
        		    					break;
        	    				}
                        	}else{
                        		Ext.Msg.alert('错误',obj.msg);
                        		Ext.getStore("Log").reload();
                        	}
                    	}	
                    }
                },
                api: {
                    read: 'task/getAllLogs',
                    destroy: 'task/deleteLog'
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