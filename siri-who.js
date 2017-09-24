// R E Q U I R E S
const keys = require('./key.js');
const twitter = require('twitter');
const request = require('request');
const curl = require('curlrequest');

// const spotify = require('node-spotify-api');


// K E Y S 
const twitterKeys = keys.twitterKeys;

// const spotifyKeys = keys.spotifyKeys;

//  T W I T T E R 
var clientTwitter = new twitter(twitterKeys);
// var params = {screen_name: 'nodejs'};
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
// let track = process.argv[3];
// var clientSpotify = new spotify (spotifyKeys);
// //One word only for test cases
// function spotifyThis(){
//     clientSpotify.search({ type: 'track', query: track}, function(error, data){
//         if (!error) {
//             console.log(data);

//             // console.log(
//             //     'Artist(s): ', data +
//             //     'Title: ', data +
//             //     'Listen: ', data +
//             //     'Album: ', data
//             // )
//         } else {
//             console.log('E R R O R: ', error);            
//         }
//     })
// }

// 2nd S P O T I F Y   A P I

// S P O T I F Y   A U T H
var SpotifyWebApi = require('spotify-web-api-node');

// var spotifyApi = new SpotifyWebApi({
//     clientId: 'fac328254777437799105768aead360a',
//     clientSecret: '233cb2cb159c4704878f2ff70d7beecf',
//     redirectUri: 'http://www.example.com/callback'
// });

var spotifyApi = new SpotifyWebApi({
    clientId: 'fac328254777437799105768aead360a',
    clientSecret: '233cb2cb159c4704878f2ff70d7beecf',
});


let track = process.argv[3];

    // function grantAuth() {
    //     spotifyApi.clientCredentialsGrant()
    //         .then(function (data) {
    //             spotifyApi.setAccessToken(data.body['access_token']);
    //             console.log('\n spotifyApi1: \n', spotifyApi); 
    //             let token = data.body['access_token'];
    //             console.log('\n token: \n', token);
    //             let spotifyApi2 = new SpotifyWebApi({
    //                 accessToken : token
    //             });
    //             let searchSpotifyApi = spotifyApi2._credentials.accessToken;
    //             console.log('\n Check Token From API: \n', searchSpotifyApi);
    //             spotifyApi2.searchTracks(track)
    //                 .then(function (data) {
    //                     console.log('\n spotifyApi2: \n', spotifyApi2);
    //                     console.log('\n D A T A: \n', data);
    //                 }, function (err) {
    //                     console.log(err);
    //                 })
    //         }, function (err) {
    //             console.log('Could not get access token', err);
    //         })
    // }

// function grantAuth() {
//     spotifyApi.clientCredentialsGrant()
//         .then(function (data) {
//             spotifyApi.setAccessToken(data.body['access_token']);
//             console.log('\n spotifyApi1: \n', spotifyApi); 
//             let token = data.body['access_token'];
//             console.log('\n token: \n', token);

//             var options = { 
//                 url: 'https://api.spotify.com/v1/tracks/2TpxZ7JUBn3uw46aR7qd6V',                 
//                 headers: {
//                     Authorization: 'bearer ' + token,
//                 },
//             }

//             curl.request(options, function(err, data){
//                 console.log('\n spotifyToken: \n', options.headers.Authorization);  
//                 console.log('\n typeOf Auth Token: \n', typeof(options.headers.Authorization));  
//                 if (!err) {
//                     console.log('\n D A T A: \n', data);
//                 } else {
//                     console.log('\n E R R O R: \n', err);
//                 }
//             })
//         }, function (err) {
//             console.log('Could not get access token', err);
//         })
// }

// S P O T I F Y   F U N C T I O N
// one word tracks for testing only
function spotifyThis() {
    grantAuth();
}


// O M D B  F U N C T I O N 

let movieName = process.argv[3];

function movieThis() {
    if (!process.argv[3]) {
        movieName = 'It';
    } 

    let queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece";

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

// S W I T C H
if (process.argv.length == 2) {
    console.log('Help: \n');
} else {
    switch (process.argv[2]) {
        case "tweets":
            printTweets();
            break;
        case "spotify":
            spotifyThis();
            break;
        case "movie":
            movieThis();
            break;
        case "do-it":
            listenToThis();
            break;
        default:
            console.log('no valid input (input options)');
    }
}