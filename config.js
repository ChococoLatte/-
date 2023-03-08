module.exports = {
    server_port: 3000,
    db_url :'mongodb://localhost:27017/R10_10',
    db_schemas: [
        {file:'./user_schema', collection:'users', schemaName:'UserSchema',
        modelName:'UserModel'},
        {file:'./user_order_schema', collection:'user_order',schemaName:'UOSchema',modelName:'UOModel'},
        {file:'./order_schema', collection:'order',schemaName:'Orderschema',modelName:'OrderModel'},
        {file : './eatery_schema', collection : 'eatery', schemaName : 'EaterySchema', 
           modelName : 'EateryModel'}

    ],
    
    route_info: [
    {file : './user', path : '/process/login', method : 'login', type : 'post'},
    {file: './user', path: '/process/addUser', method: 'adduser', type:'post'},
    {file : './user', path : '/process/logout', method : 'logout', type : 'get'},    
    {file : './user', path : '/process/modifyUser', method : 'modifyUser', type : 'get'},
    {file : './user', path : '/process/modifyuser', method : 'modifyuser', type : 'post'},
    {file : './order', path : '/process/order', method : 'order', type : 'get'},    
    {file : './order', path : '/process/addmenu', method : 'addmenu', type : 'post'},
    {file : './user_order', path : '/process/regorder', method : 'regorder', type : 'post'},
    {file : './user_order', path : '/process/myorder', method : 'myorder', type : 'get'},
    {file : './user_order', path : '/process/cancle', method : 'cancle', type : 'post'},
    {file : './eatery', path : '/process/addeatery', method : 'add', type : 'post'},	 
    {file : './eatery', path : '/process/neareatery', method : 'findNear', type : 'post'},
    ]
};