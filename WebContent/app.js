Ext.application({
	views: [
    	'Main',
    	'TopicConfigWindow',
    	'MyTopicGrid',
    	'PublicTopicGrid',
    	'MyDetailPanel',
    	'PublicDetailPanel',
    	'OperationLogGrid',
    	'RequestParameterConfigWindow',
    	'InvokeDetailPanel',
    	'InvokeLogGrid'
    ],
    models: [
    	'Topic',
    	'Parameter',
    	'Log',
    	'RequestParameterConfig',
    	'InvokeRecord'
    ],
    stores: [
    	'Topic',
    	'Parameter',
    	'Log',
    	'RequestParameterConfig',
    	'InvokeRecord'
    ],
    autoCreateViewport: true,
    name: 'testmocker'
});
Ext.Loader.setConfig({
    enabled: true
});