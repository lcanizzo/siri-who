// R E Q U I R E S
const keys = require('./key.js');
const twitter = require('twitter');
const request = require('request');
var SpotifyWebApi = require('spotify-web-api-node');
const fs = require('fs');

// K E Y S 
const twitterKeys = keys.twitterKeys;
const spotifyKeys = keys.spotifyKeys;

// D E F I N E  I N P U T 
var input = process.argv[3];

//  T W I T T E R 
var clientTwitter = new twitter(twitterKeys);

function printTweets() {
    clientTwitter.get('statuses/user_timeline', function (error, tweets, response) {
        if (!error) {
            for (let i = 0; i < tweets.length; i++) {
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
var spotifyApi = new SpotifyWebApi(spotifyKeys);

function spotifyThis(input) {
    spotifyApi.clientCredentialsGrant()
    .then(function (data) {
        spotifyApi.setAccessToken(data.body['access_token']);
        spotifyApi.searchTracks(input)
            .then(function (data) {
                console.log('\n D A T A: \n', data.body.tracks.items[0]);
            }, function (err) {
                console.log(err);
            })
    }, function (err) {
        console.log('Could not get access token', err);
    })
}

// O M D B  
function movieThis(input) {
    if (process.argv[2] !== "do-it" && !process.argv[3]) {
        input = 'It';
    } 

    let queryUrl = "http://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=40e9cece";

    request(queryUrl, function(err, data){
        if (err){
          throw err;
        } else {
          let object = JSON.parse(data.body);
          console.log('\n',
          'Title: ', '\n  ', object.Title, 
          '\n Year: ', '\n  ', object.Year, 
          '\n IMDB Rating: ', '\n  ', object.imdbRating,
          '\n Rotten Tomatoes Rating: ', '\n  ', object.Ratings[1].Value,
          '\n Country: ', '\n  ', object.Country,
          '\n Language: ', '\n  ', object.Language,
          '\n Plot: ', '\n  ', object.Plot,
          '\n Actors: ', '\n  ', object.Actors)
        }
      })
}

// S W I T C H   F U N C T I O N S
function switchFunctions(argument, input) {
    switch (argument) {
        case "tweets":
            printTweets();
            break;
        case "spotify":
            spotifyThis(input);
            break;
        case "movie":
            movieThis(input);
            break;
        case "do-it":
            listenToThis();
            break;
        default:
            console.log('no valid input (input options)');
    }
}


// D O   I T   F U N C T I O N 

function listenToThis(){
    var doThis = [];
    fs.readFile('random.txt', 'utf8', function(error, data) {
        if (error) {
            return console.log(error);
        } else {
            doThis = (data.split(","));
            let input = doThis[1];          
            let prompt = doThis[0];
            switchFunctions(prompt, input);
        }       
    })
}


// S W I T C H
if (process.argv.length == 2) {
    console.log('Help: \n');
} else {
    switchFunctions(process.argv[2], input);
}