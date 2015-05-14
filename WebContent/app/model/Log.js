Ext.define('testmocker.model.Log', {
    extend: 'Ext.data.Model',
    requires: ['Ext.data.UuidGenerator'],
	idgen: 'uuid',
    fields: [
		{
		    name: 'id',
		    type: 'string'
		},
		{
		    name: 'requesttype',
		    type: 'string'
		},
        {
            name: 'name',
            type: 'string'
        },
        {
            name: 'action',
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