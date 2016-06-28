var restify = require('restify');
var builder = require('botbuilder');
var feedparser = require('feed-read');
var crypto = require('crypto');
var user = require('./controller/users');
var tv = require('./controller/emission');

// Create bot and add dialogs
var dialog = new builder.LuisDialog('https://api.projectoxford.ai/luis/v1/application?id=1c14f62d-3c95-4424-8fcb-e573b0a94bf4&subscription-key=c0aa44adec4f4809aee0eaf13db08e21');
var bot = new builder.BotConnectorBot();

bot.add('/', dialog
    .onDefault(builder.DialogAction.send("Je n'ai pas compris."))
);

//connection au données utilisateur
dialog.onBegin(function(session, args, next){
	session.dialogData.lastIntent = "begin";
	session.send("Bonjour, nous connaissons nous ? ");
});

dialog.on('reponse+', function(session, args){
	if(session.dialogData.lastIntent === 'begin')
		session.send('Donne moi ton login et ton mot de passe s\'il te plaît');
});

dialog.on("reponse-", function(session, args, next){
	if(session.dialogData.lastIntent === 'begin')
		session.send('');
});

dialog.on('connection', function(session, args, next){
	var login = builder.EntityRecognizer.findEntity(args.entities, 'login');
	var pass = builder.EntityRecognizer.findEntity(args.entities, 'pass');

	pass.entity = crypto.createHash('md5').update(pass.entity).digest("hex");

	user.connexion(login.entity, pass.entity, session);
});

dialog.on('new_user', function(session, args, next){
	session.dialogData.register = 1;
	session.dialogData.lastIntent = "inscription";
	session.send("Quel est ton nom ?");
});

dialog.on('login', function(session, args, next){
	if(session.dialogData.lastIntent === "inscription")
	{
		var login = builder.EntityRecognizer.findEntity(args.entities, 'login');
		user.login(login.entity, 'inscription', session);
	}
});

dialog.on('pass', function(session, args, next){
	if(session.dialogData.lastIntent === 'login' && session.dialogData.register === 1)
	{
		var pass = builder.EntityRecognizer.findEntity(args.entities, 'pass');
		pass.entity = crypto.createHash('md5').update(pass.entity).digest("hex");

		user.new_user(session.dialogData.username, pass.entity, session);
	}
});

dialog.on('TvSeen', function(session, args){
	var emission = builder.EntityRecognizer.findEntity(args.entities, 'emission');
	tv.seen(emission.entity, session);
});

dialog.on('Avis', function(session,args, next){
	var note = builder.EntityRecognizer.findEntity(args.entities, 'note');
	tv.note(note.entity, session);
});

dialog.on('programTV', function(session, args){
	last_Intent = 'programTV';
	feedparser('http://webnext.fr/epg_cache/programme-tv-rss_2016-06-20.xml', function(err, articles){
		var i=0;
		var seek = builder.EntityRecognizer.findEntity(args.entities, 'chaine');
		while(articles[i])
		{
			var titre = articles[i].title.split(' | ');
			if(titre[0].toString().toLowerCase() === seek.entity)
				session.send(titre[2]);
			i++;
		}
	});
});

// Setup Restify Server
var server = restify.createServer();
server.post('/api/messages', bot.verifyBotFramework(), bot.listen());
server.listen(process.env.port || 3978, function () {
    console.log('%s listening to %s', server.name, server.url); 
});