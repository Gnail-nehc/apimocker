Ext.define('testmocker.model.InvokeRecord', {
    extend: 'Ext.data.Model',
    fields: [
		{
		    name: 'id',
		    type: 'string'
		},
		{
		    name: 'name',
		    type: 'string'
		},
        {
            name: 'requestenv',
            type: 'string'
        },
        {
            name: 'time',
            type: 'string'
        },
        {
            name: 'duration',
            type: 'string'
        },
        {
            name: 'ismock',
            type: 'string'
        }
    ]
});