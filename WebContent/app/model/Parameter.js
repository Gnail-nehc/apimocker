Ext.define('testmocker.model.Parameter', {
    extend: 'Ext.data.Model',
    fields: [
		{
		    name: 'type',
		    type: 'string'
		},
        {
            name: 'name',
            type: 'string'
        },
        {
            name: 'value',
            type: 'string'
        },
        {
            name: 'comment',
            type: 'string'
        }
    ]
});