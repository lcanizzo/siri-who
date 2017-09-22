// K E Y S
const keys = require('./key.js');
const twitterKeys = keys.twitterKeys;
const spotifyKeys = keys.spotifyKeys;
        
//  T W I T T E R 
const twitter = require('twitter');
var client = new twitter(twitterKeys);
// var params = {screen_name: 'nodejs'};
function printTweets() {
    client.get('statuses/user_timeline', function(error, tweets, response) {
        if (!error) {
          for(let i=0; i < tweets.length; i++){
               console.log(
                   tweets[i].created_at, '\n', 
                   tweets[i].user.screen_name, 'said: \n', 
                   "  ", tweets[i].text, '\n');    
          }
        }
    });
}

// S W I T C H
if (process.argv.length !==3){
    console.log('Help: \n');
} else {
    switch (process.argv[2]){
        case "my-tweets":
            printTweets();
            break;
        case "spotify-this-song":
            printTweets();
            break;
        case "movie-this":
            printTweets();
            break;
        case "do-what-it-says":
            printTweets();
            break;
        default:
            console.log('no valid input (input options)');
    }
}
