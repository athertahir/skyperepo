var restify = require('restify');
var builder = require('botbuilder');
var selectedbutton='';
var login='login';

var userStore = [];
// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 81 || 80, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: '79781275-5671-49b1-9772-075d011d0bef',
    appPassword: 'wfkkzbGCHJD210=@-iLP20#'
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());


// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector, function (session) {
	console.log(session.message.address);
	//session.send(session.message.address.bot.name);
	//session.send(JSON.stringify(userStore));

    var newAddresses = userStore;
    newAddresses.forEach(function (address) {
    console.log('Sending Message to Address: ', address);
    // new conversation address, copy without conversationId
	if(session.message.address.channelId=="webchat" && session.message.text)
	{

		///////////////////
    var newConversationAddress = Object.assign({}, address);
        
		bot.send(new builder.Message()
                    .text(session.message.text)
                    .address(address));  
	}

    });
	if(session.message.address.channelId=="webchat" && session.message.text)
	{
	bot.send(new builder.Message()
                    .text(JSON.stringify('Message sent to all Skype Groups'))
                    .address(session.message.address));
	}


});
bot.on('conversationUpdate', function (message) {
	console.log('Address : ');
	console.log(message.address);
	console.log('Member Added : ');
	console.log(message.membersAdded);
	/*bot.send(new builder.Message()
                    .text(JSON.stringify(message))
                    .address(message.address));*/
	var address = message.address;
	address.conversation;
	if(message.address.channelId=="skype")
	{
	var exist=false;
	userStore.forEach(function(value){
		if(value.conversation.id==message.address.conversation.id)
		exist=true;
	});
	if(!exist)
	userStore.push(address);
/*
	bot.send(new builder.Message()
                    .text(JSON.stringify(message))
                    .address(message.address));
	bot.send(new builder.Message()
                    .text(JSON.stringify(userStore))
                    .address(message.address));
*/
	}
	else if(message.address.channelId=="webchat" && !message.text && !session.privateConversationData['done'])
	{
	session.privateConversationData['done']=true;
	/*
	bot.send(new builder.Message()
                    .text(JSON.stringify(message))
                    .address(message.address));
	*/
	bot.send(new builder.Message()
                    .text(JSON.stringify('Type Message to sent to all Skype Groups'))
                    .address(message.address));
	}

/*
    if (message.membersAdded) {
        message.membersAdded.forEach(function (identity) {
			console.log(identity);
            if (identity.id === message.address.bot.id) {
                bot.beginDialog(message.address, '/');
            }
        });
*/
});
