Ext.define('testmocker.model.Topic', {
    extend: 'Ext.data.Model',
    fields: [
		{
		    name: 'code',
		    type: 'string'
		},
        {
            name: 'name',
            type: 'string'
        },
        {
            name: 'requesttype',
            type: 'string'
        },
        {
            name: 'status',
            type: 'string'
        },
        {
            name: 'time',
            type: 'string'
        },
        {
            name: 'owner',
            type: 'string'
        }
    ]
});