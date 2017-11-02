var Promise = require('bluebird');
var http=require('http');

module.exports = {
	
	searchBTCReviews: function (BTC) {
		console.log("entered");
        return new Promise(function (resolve) {
			
			
			var url="http://api.coindesk.com/v1/bpi/currentprice/btc.json";
			http.get(url, function(res){
			var body = '';

			res.on('data', function(chunk){
						body += chunk;
											});

			res.on('end', function(){
			var Response = JSON.parse(body);
			console.log("Got a response: ", Response.bpi.USD.rate_float*BTC);
									
										
		

            // Filling the review results manually just for demo purposes
            var price = [];
        
                price.push({
                    
                    text: BTC+ ' BTC is '+(Response.bpi.USD.rate_float*BTC)+' USD '
					
               
});
            // complete promise with a timer to simulate async response
            setTimeout(function () { resolve(price); }, 1000);
         
            });
			}).on('error', function(e){
										console.log("Got an error: ", e);
										});
		
		
		});
}}