

module.exports = {
	server_port: 3000,
	db_url: 'mongodb://localhost:27017/local',
	db_schemas: [
	    {file:'./user_schema', collection:'users', schemaName:'UserSchema', modelName:'UserModel'},
			{file:'./showroom_schema', collection:'showroom', schemaName:'ShowRoomSchema', modelName:'ShowRoomModel'}

	],
	route_info: [
			{file:'./showroom', path:'/process/addshowroom', method:'add', type:'post'},
			{file:'./showroom', path:'/process/nearshowroom', method:'findNear', type:'post'}


	]
}
