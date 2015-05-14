Ext.define('testmocker.view.OperationLogGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.OperationLogGrid',
    id: 'OperationLogGrid',
    flex:6,
    title: '接口mock列表',
    autoFill : true,
    store: 'Log',
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
		    columns: [
				{
				    xtype: 'gridcolumn',
				    dataIndex: 'requesttype',
				    text: '请求类型',
				    flex: 55
				},
				{
				    xtype: 'gridcolumn',
					flex:15,
				    dataIndex: 'name',
				    text: '主题'
				},
				{
				    xtype: 'gridcolumn',
				    dataIndex: 'action',
				    text: '动作',
				    flex: 12,
				    renderer: function(value, metaData, record, rowIndex, colIndex, store, view) {
                        if(value=='n'){
                            return '创建';
                        }else if(value=='y'){
                            return 'mock';
                        }
                        else if(value=='c'){
                            return '撤销';
                        }
                        else if(value=='r'){
                            return '重新mock';
                        }
                        else if(value=='d'){
                            return '删除';
                        }
                        else if(value=='u'){
                            return '修改';
                        }
                    }
				},
			    {
				    xtype: 'gridcolumn',
				    dataIndex: 'time',
				    text: '操作时间',
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
			            	Ext.MessageBox.confirm(
				                "confirm",
				                "确认删除？",
				                function(e){
				                    if(e=='yes'){
				                        Ext.getStore('Log').removeAt(rowIndex);
				                        Ext.getStore('Log').sync({});
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
				store : 'Log',
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
        		afterrender : {
	        		fn: me.afterrender,
	        		scope: me
	        	}
        	}
        });
        me.callParent(arguments);
    },
    afterrender : function(){
		Ext.getStore('Log').load();
	}
});