require('dotenv-extended').load();

var builder = require('botbuilder');
var restify = require('restify');
var Store = require('./store');
var spellService = require('./spell-service');
var http = require('http');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});
  
// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: "bc2d3d15-102e-4a4c-b5b7-96edcd55e3d1",
    appPassword: "ufpbjWKGD855^=;|tkRDY29",
    stateEndpoint: process.env.BotStateEndpoint,
    openIdMetadata: process.env.BotOpenIdMetadata 
});

server.post('/api/messages', connector.listen());

var bot = new builder.UniversalBot(connector, function (session) {
    switch(session.message.text){
        case 'help':
            session.endDialog('Plese use the given given command to get the real time stock price. (!BTCTOINR, !USDTOINR, !INFY, !MSFT)');
            break;
        case '!BTCTOINR':
            session.endDialog('1 BTC in INR is :'+this.exchange('BTC','INR'));
            break;
        case '!USDTOINR':
            console.log("Entered");
            session.endDialog('1 USD is: '+setTimeout(this.exchange('USD','INR'),1000));
            break;
        case '!INFY':
            session.endDialog('Infosys Current Stock Price is: ');
            break;
        case '!MSFT':
            session.endDialog('Microsoft current Stock price Is: ');
            break;
        default:
            if((session.message.text).indexOf("Bitcoin")>-1){
                session.endDialog('1 Bitcoin is: ');
                break;
            }
            else if(['hi'.toUpperCase(),'howdy'.toUpperCase(),'hey'.toUpperCase(),'hello'.toUpperCase(),'Hello'.toUpperCase()].indexOf(session.message.text.toUpperCase())>-1)
            {session.endDialog('Hello. How are you? ');
                break;}
            else if(['how'.toUpperCase(),'bitcoin'.toUpperCase()].indexOf(session.message.text.toUpperCase())>-1)
            {session.endDialog('For getting Bitcoin Balance type: !BTCTOINR . Currently we only supports INR values. ');
             break;}
             else if(['I'.toUpperCase(),'am'.toUpperCase(),'fine'.toUpperCase(),'good'.toUpperCase(),'great'.toUpperCase()].indexOf(session.message.text.toUpperCase())>-1)
            {session.endDialog('I am also fine. Please let me know if you need any kind of help. i am here. ');
             break;}
             else if(['sure'.toUpperCase()].indexOf(session.message.text.toUpperCase())>-1)
            {session.endDialog('Thank you for visiting. ');
             break;}
             else if(['bye'.toUpperCase()].indexOf(session.message.text.toUpperCase())>-1)
            {session.endDialog('Have a great day. Bye ');
             break;}
            else{
            session.send('Sorry, I did not understand \'%s\'. Type \'help\' if you need assistance.', session.message.text);
            break;}
    }
});



// Spell Check
if (true) {
    bot.use({
        botbuilder: function (session, next) {
            spellService
                .getCorrectedText(session.message.text)
                .then(function (text) {
                    session.message.text = text;
                    next();
                })
                .catch(function (error) {
                    console.error(error);
                    next();
                });
        }
    });
}

exports.exchange=function(exCode1,exCode2){
var url="http://v3.exchangerate-api.com/pair/a37ebafa82ffaf397714b120/"+exCode1+"/"+exCode2;
http.get(url, function(res){
var body = '';

res.on('data', function(chunk){
body += chunk;
});

res.on('end', function(){
var Response = JSON.parse(body);
return Response;
console.log("Got a response: ", Response.rate);  

});

});
};

