var mysql = require('mysql');

exports.get_user = function(login, pass, callback){
	db(function(mysqlclient){

		var query = "SELECT * FROM user where username = "+ mysqlclient.escape(login) + " AND password = " + mysqlclient.escape(pass);	

		mysqlclient.query(
			query, 
			function select(error, results, fields){
				if(error){
					console.log(error);
					mysqlclient.end();
					return;
				}

				if( results.length > 0 ){
					mysqlclient.end();
					callback(results);
				}
				else
				{
					mysqlclient.end();
					callback(null);
				}
			}
		);
	});
}

exports.add_user = function(login, pass, callback){
	db(function(mysqlclient){

		var query = "INSERT INTO user (username, password) VALUES ("+mysqlclient.escape(login)+","+mysqlclient.escape(pass)+")";
		
		mysqlclient.query(
			query, 
			function Insert(error, results, fields){
				if(error){
					console.log(error);
					mysqlclient.end();
					callback(err, null);
				}
				callback(null, results);
				mysqlclient.end();
			}
		);
	});
}

exports.get_login = function(login, callback){
	db(function(mysqlclient){

		var query = "SELECT * FROM user where username = "+ mysqlclient.escape(login);
		
		mysqlclient.query(
			query, 
			function select(error, results, fields){
				if(error){
					console.log(error);
					mysqlclient.end();
					return;
				}

				if( results.length > 0 ){
					mysqlclient.end();
					callback(results);
				}
				else
				{
					mysqlclient.end();
					callback(null);
				}
				
			}
		);
	});
}

function db(callback){
	var mysqlclient = mysql.createConnection({
		host: "bodmirbot.database.windows.net",
		user: "bodmir",
		password: "Guitariste23",
		database: "Tvbot"
	});

	callback(mysqlclient);
}

