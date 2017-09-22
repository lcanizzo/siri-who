// R E Q U I R E S
const keys = require('./key.js');
const twitter = require('twitter');
const spotify = require('spotify');
const request = require('request');

// K E Y S 
const twitterKeys = keys.twitterKeys;
const spotifyKeys = keys.spotifyKeys;
        
//  T W I T T E R 
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
        } else {
            console.log('E R R O R: ', error);
        }
    });
}

// S P O T I F Y 
let track = process.argv[3];
//One word only, need to get string of words for titles
function spotifyThis(){
    request('https://api.spotify.com/v1/search?q=' + track + '&type=track', function(err, data){
        if (!err) {
            console.log(data);
            console.log(
                'Artist(s): ', data +
                'Title: ', data +
                'Listen: ', data +
                'Album: ', data
            )
        } else {
            console.log('E R R O R: ', err);            
        }
    })
}

// S W I T C H
if (process.argv.length == 2){
    console.log('Help: \n');
} else {
    switch (process.argv[2]){
        case "my-tweets":
            printTweets();
            break;
        case "spotify-this-song":
            spotifyThis();
            break;
        case "movie-this":
            movieThis();
            break;
        case "do-what-it-says":
            listenToThis();
            break;
        default:
            console.log('no valid input (input options)');
    }
}
