// R E Q U I R E S
const keys = require('./key.js');
const twitter = require('twitter');
const request = require('request');
const weather = require('weather-js');
const SpotifyWebApi = require('spotify-web-api-node');
const fs = require('fs');

// K E Y S 
const twitterKeys = keys.twitterKeys;
const spotifyKeys = keys.spotifyKeys;

// D E F I N E  I N P U T 
var input = "";
if (process.argv.length > 3) {
    for (let i = 3; i < process.argv.length; i++) {
        input += (process.argv[i] + '+');
    }
}

// H E L P  
function help() {
    console.log('Instructions: \n');
}

// D E F I N E   A D D R E S S 
var address = [];
var string = "";

for (let i = 3; i < process.argv.length; i++) {
    address.push(process.argv[i]);
}
string = address.toString();

// W E A T H E R
function weatherHere() {
    weather.find({
        search: string
    }, function (err, data) {
        if (!err) {
            console.log('\n ***Future Forecast***\n',
                string);
            for (let i = 0; i < data[0].forecast.length; i++) {
                var precip = data[0].forecast[i].precip;
                if (!precip) {
                    precip = 0;
                }
                console.log('\n', data[0].forecast[i].day + ':\n',
                    ' -High:', '\n   ', data[0].forecast[i].high,
                    '\n  -Low:', '\n   ', data[0].forecast[i].low,
                    '\n  -Precipitation:', '\n   ', precip + '%',
                    '\n  -Cloud Cover:', '\n   ', data[0].forecast[i].skytextday);
            }
        } else {
            console.log('error: \n', err);
        }
    })
}

//  T W I T T E R 
var clientTwitter = new twitter(twitterKeys);

function printTweets() {
    clientTwitter.get('statuses/user_timeline', function (error, tweets, response) {
        if (!error) {
            for (let i = 0; i < tweets.length; i++) {
                let text = '"' + tweets[i].text + '"';
                console.log(
                    tweets[i].created_at, '\n',
                    tweets[i].user.screen_name, 'said: \n',
                    "  ", text, '\n');
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
                    console.log('\n ***Song Info*** \n\n',
                        ' -Artist:', '\n   ', data.body.tracks.items[0].artists[0].name,
                        '\n  -Title:', '\n   ', data.body.tracks.items[0].name,
                        '\n  -Preview:', '\n   ', data.body.tracks.items[0].preview_url,
                        '\n  -Album:', '\n   ', data.body.tracks.items[0].album.name,
                        '\n  -Listen:', '\n   ', data.body.tracks.items[0].external_urls.spotify
                    )
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

    request(queryUrl, function (err, data) {
        if (err) {
            throw err;
        } else {
            let object = JSON.parse(data.body);
            console.log('\n ***Movie Info*** \n\n',
                '-Title: ', '\n  ', object.Title,
                '\n -Year: ', '\n  ', object.Year,
                '\n -IMDB Rating: ', '\n  ', object.imdbRating,
                '\n -Rotten Tomatoes Rating: ', '\n  ', object.Ratings[1].Value,
                '\n -Country: ', '\n  ', object.Country,
                '\n -Language: ', '\n  ', object.Language,
                '\n -Plot: ', '\n  ', object.Plot,
                '\n -Actors: ', '\n  ', object.Actors)
        }
    })
}

// S W I T C H   F U N C T I O N S
function switchFunctions(argument, input) {
    switch (argument) {
        case "tweets":
        case "-t":
        case "myTwitter":
            printTweets();
            break;
        case "spotify":
        case "spotify-this":
        case "-s":
        case "song":
            spotifyThis(input);
            break;
        case "movie":
        case "-m":
            movieThis(input);
            break;
        case "do-it":
        case "-d":
            listenToThis();
            break;
        case "weather":
        case "-w":
            weatherHere();
            break;
        default:
            help();
    }
}

// D O   I T   F U N C T I O N 
function listenToThis() {
    var doThis = [];
    fs.readFile('random.txt', 'utf8', function (error, data) {
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
    help();
} else {
    switchFunctions(process.argv[2], input);
}