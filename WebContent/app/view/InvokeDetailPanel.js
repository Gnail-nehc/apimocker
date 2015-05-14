Ext.define('testmocker.view.InvokeDetailPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.InvokeDetailPanel',
    id:'InvokeDetailPanel',
	layout:'anchor',
	flex:1,
	activeTab:0,
    title:'报文详情',  
    region:'center',
    margins:'20,30,20,0',
    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
        	items:[
				{	
					xtype:'textfield',
					fieldLabel: '请求地址',
					id:'RequestUrlField',
					padding:'3,4,4,4',
					labelWidth:60,
					anchor: '100% 7%',
					readOnly:true
				},
				{	
					xtype:'textarea',
					fieldLabel: '请求体',
					id:'RequstBodyField',
					padding:'3,4,4,4',
					labelWidth:60,
					anchor: '100% 40%',
					readOnly:true
				},
				{	
					xtype:'textarea',
					fieldLabel: '响应',
					id:'ResponseBodyField',
					padding:'3,4,4,4',
					labelWidth:60,
					anchor: '100% 53%',
					readOnly:true
				}
        	]
        });
        me.callParent(arguments);
    }
});