var mysql = require('mysql'); 

exports.add_emission = function(nom, session, callback){
	var mysqlclient = mysql.createConnection({
		host: "localhost",
		user: "root",
		password: "",
		database: "tvbot"
	});

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
}



exports.is_present = function(nom){
	
}