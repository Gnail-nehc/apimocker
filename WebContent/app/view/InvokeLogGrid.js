Ext.define('testmocker.view.InvokeLogGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.InvokeLogGrid',
    id: 'InvokeLogGrid',
    flex:1,
	region: 'west',
    title: 'mock调用记录',
    autoFill : true,
    store: 'InvokeRecord',
    stripeRows : true,
    margins:'20,10,20,30',
//    viewConfig: {
//        getRowClass: function(record, index, rowParams, store) {
//        	var status=record.raw.status;
//            if (status=='n')
//            	return 'x-grid-row-black';
//            else if (status=='y' || status=='r')
//            	return 'x-grid-row-green';
//            else if (status=='c')
//            	return 'x-grid-row-blue';
//        }
//    },
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
		            	Ext.getStore('InvokeRecord').proxy.extraParams.isPublic=false;
		                Ext.getStore('InvokeRecord').load();
		            },
		            icon: 'image/refresh.png',
		            tooltip: '刷新'
		        }
		        ]
		    }],
		    columns: [
			    {	
					xtype:'gridcolumn',
					dataIndex: 'id',
					hidden:true
				},
				{
				    xtype: 'gridcolumn',
					flex:12,
				    dataIndex: 'name',
				    text: 'mock主题'
				},
				{
				    xtype: 'gridcolumn',
				    dataIndex: 'requestenv',
				    text: '请求环境',
				    flex: 3
				},
			    {
				    xtype: 'gridcolumn',
				    dataIndex: 'time',
				    text: '调用时间',
				    flex: 8,
				    renderer: function(value, metaData, record, rowIndex, colIndex, store, view) {
				    	if(value!=""){
				    		var date=value.split(" ")[0];
				    		var time=value.split(" ")[1];
				    		value=date.substring(0,4)+'-'+date.substring(4,6)+'-'+date.substring(6,8)+' '+time.substring(0,2)+':'+time.substring(2,4)+':'+time.substring(4,6)+" "+value.split(" ")[2];
				    	}
				    	return value;
				    }
				},
				{
					xtype: 'gridcolumn',
				    dataIndex: 'duration',
				    text: '处理时间毫秒',
				    flex: 4
				},
				{
				    xtype: 'gridcolumn',
				    dataIndex: 'ismock',
				    text: '匹配',
				    flex: 1,
				    renderer: function(value, metaData, record, rowIndex, colIndex, store, view) {
                        if(value=='n'){
                            return '否';
                        }else if(value=='y'){
                            return '是';
                        }
                    }
				},
			    {
			        xtype: 'actioncolumn',
			        text: '删除',
			        flex:1,
			        items: [
			        {
			            handler: function(view, rowIndex, colIndex, item, e, record, row) {
			            	Ext.MessageBox.confirm(
				                "confirm",
				                "确认删除？",
				                function(e){
				                    if(e=='yes'){
				                        Ext.getStore('InvokeRecord').removeAt(rowIndex);
				                        Ext.getStore('InvokeRecord').sync({});
				                    }
				                }
				            ); 
			            },
			            icon: 'image/delete.png',
			            tooltip: 'delete'
			        }]
			    }
			],
			bbar : new Ext.PagingToolbar({
				store : 'InvokeRecord',
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
		        }
//		        itemdblclick : {
//		        	fn: me.itemdblclick,
//		            scope: me
//		        },
//		        itemmouseenter: {
//                    fn: me.itemmouseenter,
//                    scope: me
//                }
		    }
        });
        me.callParent(arguments);
    },
    griditemmousedown : function( that, record, item, index, e, eOpts ){
    	Ext.getCmp('Main').ExistingCode=record.raw.code;
    	Ext.getCmp('Main').SelectedRequestType=record.raw.requesttype;
		Ext.getCmp('Main').SelectedTopicName=record.raw.name;
    	var lm = new Ext.LoadMask(Ext.getCmp('InvokeDetailPanel'), { 
			msg : '读取中。。。', 
			removeMask : true
		}); 
		lm.show();
 		Ext.Ajax.request( {
			url : 'task/getInvokeDetail',
			method: "POST",
			params : {
				id : record.raw.id
			},
		    success : function(response, options) {
		    	lm.hide();
		    	var object=JSON.parse(response.responseText);
		    	if(object.success){
		    		var o=object.obj;
		    		Ext.getCmp('RequestUrlField').setValue(o.requesturl);
		    		Ext.getCmp('RequstBodyField').setValue(o.requestbody);
		    		Ext.getCmp('ResponseBodyField').setValue(o.responsebody);
		    	}else
		    		Ext.Msg.alert("错误",object.msg);
		    },
		    failure: function(response, opts) {
		    	lm.hide();
             	Ext.Msg.alert("错误","getInvokeDetail请求失败");
            }
		});
	}
});