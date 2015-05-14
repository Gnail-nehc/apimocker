Ext.define('testmocker.view.PublicTopicGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.PublicTopicGrid',
    id: 'PublicTopicGrid',
    flex:6,
	region: 'west',
    title: '接口mock列表',
    autoFill : true,
    store: 'Topic',
    stripeRows : true,
    margins:'20,10,20,30',
    bodyStyle: 'color: #837E7C;',
    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
		    columns: [
			    {	
					xtype:'gridcolumn',
					dataIndex: 'code',
					hidden:true
				},
				{
				    xtype: 'gridcolumn',
					flex:15,
				    dataIndex: 'name',
				    text: 'mock主题'
				},
				{
				    xtype: 'gridcolumn',
				    dataIndex: 'requesttype',
				    text: '请求类型',
				    flex: 56
				},
				{
				    xtype: 'gridcolumn',
				    dataIndex: 'status',
				    text: '状态',
				    flex: 12,
				    renderer: function(value, metaData, record, rowIndex, colIndex, store, view) {
                        if(value=='n'){
                            return '未mock';
                        }else if(value=='y'){
                            return '已mock';
                        }
                        else if(value=='c'){
                            return '已撤销';
                        }
                        else if(value=='r'){
                            return '重新mock';
                        }
                    }
				},
			    {
				    xtype: 'gridcolumn',
				    dataIndex: 'time',
				    text: '激活/撤销时间',
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
				}
			],
			bbar : new Ext.PagingToolbar({
				store : 'Topic',
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
		    }
        });
        me.callParent(arguments);
    },
    griditemmousedown : function( that, record, item, index, e, eOpts ){
    	Ext.getCmp('Main').ExistingCode=record.raw.code;
    	var lm = new Ext.LoadMask(Ext.getCmp('PublicDetailPanel'), { 
			msg : '读取中。。。', 
			removeMask : true
		}); 
		lm.show();
 		Ext.Ajax.request( {
			url : 'task/getTopicDetail',
			method: "POST",
			params : {
				code : record.raw.code
			},
		    success : function(response, options) {
		    	lm.hide();
		    	var object=JSON.parse(response.responseText);
		    	if(object.success){
		    		var o=object.obj;
		    		Ext.getCmp('MockServiceUrlField_p').setValue(o.code);
		    		Ext.getCmp('ServerTypeField_p').setValue(o.servertype);
		    		Ext.getCmp('WebServiceUrlField_p').setValue(o.webserviceurl);
		    		Ext.getCmp('ResponseTemplateField_p').setValue(Ext.widget('TopicConfigWindow').formatResponseBody(o.template,true));
		    		Ext.getCmp('ParameterField_p').store.loadData(o.parameters);
		    	}else
		    		Ext.Msg.alert("错误",object.msg);
		    },
		    failure: function(response, opts) {
		    	lm.hide();
             	Ext.Msg.alert("错误","getTopicDetail请求失败");
            }
		});	
	}
    
});