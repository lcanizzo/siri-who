// R E Q U I R E S
const keys = require('./key.js');
const twitter = require('twitter');
const request = require('request');
const weather = require('weather-js');
const SpotifyWebApi = require('spotify-web-api-node');
const chalk = require('chalk');
const fs = require('fs');

// K E Y S 
const twitterKeys = keys.twitterKeys;
const spotifyKeys = keys.spotifyKeys;

// C O N S T A N T S
const argv = process.argv;
const log = console.log;

// C H A L K   T H E M E S
const error = chalk.bold.red;
const title = chalk.yellow;
const h1 = chalk.magentaBright;
const h2 = chalk.blueBright;
const content = chalk.white;

// H E L P  
function help() {
    log(
        title('\nInstructions:\n'),
        
    )
}

// D E F I N E  I N P U T 
var input = "";
if (argv.length > 3) {
    for (let i = 3; i < argv.length; i++) {
        input += (argv[i] + '+');
    }
}

// D E F I N E   A D D R E S S 
var address = [];
var string = "";

for (let i = 3; i < argv.length; i++) {
    address.push(argv[i]);
}
string = address.toString();

// W E A T H E R
function weatherHere() {
    weather.find({
        search: string
    }, function (err, data) {
        if (!err) {
            log(title('\n Future Forecast\n',
                string));
            for (let i = 0; i < data[0].forecast.length; i++) {
                var precip = data[0].forecast[i].precip;
                if (!precip) {
                    precip = 0;
                }
                log(h1('\n', data[0].forecast[i].day + ':\n'),
                h2(' -High:\n   '), 
                content(data[0].forecast[i].high),
                h2('\n  -Low:\n   '), 
                content(data[0].forecast[i].low),
                h2('\n  -Precipitation:\n   '), 
                content(precip + '%'),
                h2('\n  -Cloud Cover:\n   '), 
                content(data[0].forecast[i].skytextday));
            }
        } else {
            log('error: \n', err);
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
                log(
                    title(tweets[i].created_at, '\n'),
                    h1(tweets[i].user.screen_name, 'said: \n'),
                    content("  ", text, '\n'));
            }
        } else {
            log('E R R O R: ', error);
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
                    log(title('\n Song Info \n\n'),
                        h1(' -Artist:\n   '), 
                        content(data.body.tracks.items[0].artists[0].name),
                        h1('\n  -Title:\n   '), 
                        content(data.body.tracks.items[0].name),
                        h1('\n  -Preview:\n   '), 
                        content(data.body.tracks.items[0].preview_url),
                        h1('\n  -Album:\n   '), 
                        content(data.body.tracks.items[0].album.name),
                        h1('\n  -Listen:\n   '), 
                        content(data.body.tracks.items[0].external_urls.spotify)
                    )
                }, function (err) {
                    log(err);
                })
        }, function (err) {
            log('Could not get access token', err);
        })
}

// O M D B  
function movieThis(input) {
    if (argv[2] !== "do-it" && !argv[3]) {
        input = 'It';
    }
    let queryUrl = "http://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=40e9cece";

    request(queryUrl, function (err, data) {
        if (err) {
            throw err;
        } else {
            let object = JSON.parse(data.body);
            log(title('\n Movie Info \n\n'),
                h1('-Title:\n  '), 
                content(object.Title),
                h1('\n -Year:\n  '), 
                content(object.Year),
                h1('\n -IMDB Rating:\n  '), 
                content(object.imdbRating),
                h1('\n -Rotten Tomatoes Rating:\n  '), 
                content(object.Ratings[1].Value),
                h1('\n -Country:\n  '), 
                content(object.Country),
                h1('\n -Language:\n  '), 
                content(object.Language),
                h1('\n -Plot:\n  '), 
                content(object.Plot),
                h1('\n -Actors:\n  '), 
                content(object.Actors))
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
            return log(error);
        } else {
            doThis = (data.split(","));
            let input = doThis[1];
            let prompt = doThis[0];
            switchFunctions(prompt, input);
        }
    })
}

// S W I T C H
if (argv.length == 2) {
    help();
} else {
    switchFunctions(argv[2], input);
}