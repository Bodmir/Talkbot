var mysql = require('mysql'); 

exports.add_emission = function(nom, session, callback){
	db(function(mysqlclient){
		var query = "INSERT INTO emission (nom) VALUES ("+mysqlclient.escape(nom)+")";

		mysqlclient.query(
			query, 
			function select(error, results, fields){
				if(error){
					console.log(error);
					callback(error, null);
					mysqlclient.end();
					return;
				}
				session.dialogData.lastemissionid = results.insertId;
				query = "INSERT INTO user_has_emission (user_iduser, emission_idemission) VALUES ("+session.dialogData.user_id+","+session.dialogData.lastemissionid+")";
				mysqlclient.query(
					query,
					function IEmission(error, results, fields){
						if(error){
							console.log(error);
							return;
						}				
					}
				);

				callback(null, results);
				mysqlclient.end();
			}
		);
	});
}



exports.is_present = function(nom){
	
}

function db(callback){
	var mysqlclient = mysql.createConnection({
		host: "tcp:bodmirbot.database.windows.net,1433",
		user: "bodmir",
		password: "Guitariste23",
		database: "Tvbot"
	});

	callback(mysqlclient);
}
