Ext.define('testmocker.store.Parameter', {
    extend: 'Ext.data.Store',

    requires: [
        'testmocker.model.Parameter'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: 'testmocker.model.Parameter',
            storeId: 'Parameter',
            pageSize: 9999,
            proxy:{
        		type:"memory",
        		reader:{
        			type:"json",
        			root:'parameters',
        		}
        	},
        	data:[]
        }, cfg)]);
    }
});