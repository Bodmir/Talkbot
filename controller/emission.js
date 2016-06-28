var emission = require('../model/emission_table');
var allocine = require('allocine-api');

exports.seen = function(nom, session)
{
	allocine.api('search',{q: nom}, function(err, results){
		if(results.feed.results[0].$ >= 1 && results.feed.results[2].$ >= 1)
		{
			session.dialogData.lastIntent = 'seen';
			session.send('Est-ce une serie ou un film ?');
		}
		else
		{
			if(results.feed.results[0].$ > 0)
			{
				film(nom, results, session);
			}
			else if(results.feed.results[2].$ > 0)
			{
				serie(nom, results, session);
			}
			else
			{
				session.send('Je ne connais pas cette emission');
			}
		}
	});
}

exports.note = function(note, session){
	emission.add(note, session);	
}

function film(nom, results, session){
	if(results.feed.results[0].$ > 1)
	{
		session.send('je connais plusieurs film ayant ce titre, est-ce l\'un d\'eux ?');
		for(var i = 0; i < results.feed.results[0].$; i++)
		{
			if(results.feed.movie[i].title)
			{
				session.send(results.feed.movie[i].title);
			}
			else
				session.send(results.feed.movie[i].originalTitle);
		}
	}
	else
	{
		emission.add_emission(nom, session, function(err, data){
			if(!err){
				session.dialogData.lastemissionid = data.insertId;
				session.send("Sur une échelle de 0 à 5 comment noterais-tu ce film?");
				session.dialogData.lastIntent = "tvseen";
			}
			else
			{
				session.send('Désolé j\'ai des difficultés à me concentrer. Quelle emission as-tu vus?');
			}
		});
	}
}

function serie(nom, results, session){
	if(results.feed.results[2].$ > 1)
	{
		session.send('je connais plusieurs series ayant ce titre, est-ce l\'un d\'eux ?');
		for(var i = 0; i < results.feed.results[2].$; i++)
		{
			if(results.feed.movie[i].title)
			{
				session.send(results.feed.tvseries[i].title);
			}
			else
				session.send(results.feed.tvseries[i].originalTitle);
		}
	}
	else
	{
		emission.add_emission(nom, session, function(err, data){
			if(!err){
				session.dialogData.lastemissionid = data.insertId;
				session.send("Sur une échelle de 0 à 5 comment noterais-tu cette serie?");
				session.dialogData.lastIntent = "tvseen";
			}
			else
			{
				session.send('Désolé j\'ai des difficultés à me concentrer. Quelle emission as-tu vus?');
			}
		});
	}
}