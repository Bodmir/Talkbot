var user = require('../model/user_table'); 

exports.connexion = function(login, pass, session)
{
	results = user.get_user(login, pass, function(data){
		if(!data)
		{
			session.send("Je ne te connais pas mais si tu veux que l'on fasse connaissance, dis moi : \"faisons connaissance\" sinon reessaie avec d'autres identifiants.");
		}
		else
		{
			session.dialogData.user_id = data[0]['iduser'];
			session.dialogData.username = data[0]['username'];
			session.send("Que puis-je faire pour toi "+session.dialogData.username +" ?");
		}
	});
}

exports.login = function(login, mode, session){
	if (mode === 'inscription'){
		user.get_login(login, function(data)
		{
			if(!data){
				session.dialogData.lastIntent = 'login';
				session.dialogData.username = login;
				session.send("Ok "+login+". Donne moi un mot de passe maintenant.");
			}
			else
			{
				session.send("Je connais déjà quelqu'un de ce nom. Donne m'en un autre s'il te plaît.");
			}
		});	
	}
}

exports.new_user = function(login, pass, session){
	user.add_user(login, pass, function(err, data){
		if(err)
		{
			session.send("Je suis désolé j'ai du mal à me concentrer. Quel est ton nom?");
		}
		else
		{
			session.send("Enchanté "+session.dialogData.username+". Que puis-je faire pour toi?");
			session.dialogData.user_id = data.insertId;
			session.dialogData.register = 0;
		}
	});
}