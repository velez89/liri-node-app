dotenv = require("dotenv").config();
var fs = require("fs");
var request = require("request");

// Import Keys
var keys = require('./keys.js');

// Spotify 
var Spotify= require("node-spotify-api");
var spotifyClient = new Spotify(keys.spotify);

// Twitter
var Twitter = require("twitter");
var twitterClient = new Twitter(keys.twitter);

// Command & Inquiry inputs
var command = process.argv[2];
var input ="";
  for(var i = 3; i<process.argv.length; i++){
    input += process.argv[i] + ""; 
  };



switch (command){
  
  case 'my-tweets':
    getTweets();
    break;

  case "spotify-this-song":
    songSearch();
    break;

  case "movie-this":
    movieSearch();
    break;

  case "do-what-it-says":
    randomSearch();

  default:
    console.log("Sorry, Liri does not recognize " + command + " as a valid request. The following are valid requests: "
                +"\nTo search latest 20 tweets from app developer: 'my-tweets' "
                +"\nTo search a song via Spotify: 'spotify-this song' "
                +"\nTo search a movie title via OMDB: 'movie-this' " );
};


// Twitter Logic

function getTweets(){
    var params = {
      screen_name: "diverRed89",
      count: 20
    }

    twitterClient.get("statuses/user_timeline", params, function(error, tweets){
      if (error){
        console.log("An error occurred:" + error);
      }
      if (tweets){
        for (var i = 0; i<tweets.length;i++){
          console.log("----------------------"
                      + "\nDeveloper's recent tweets: " + tweets[i].created_at + "\n\n"
                      + tweets[i].text);
        };
      }
    });
};


// Spotify Logic

function songSearch(input){
  if (input === null){
    input = "The Sign"
  }

  spotifyClient.search({ 
    type: 'track', 
    query: input, 
    limit: 1
  }, 
    
    function(error, data){
    if(error) {
       console.log("An error occurred: " + error)
    } else {
      var songTitle = data.tracks.items[0].name;
      var songArtist = data.tracks.items[0].artists[0].name;
      var songAlbum = data.tracks.items[0].album.name;
      var previweURL = data.tracks.items[0].preview_url;

      console.log(
        "---------Spotify Results---------"
        + "\nSong Title: " + songTitle
        + "\nArtist: " + JSON.stringify(songArtist) 
        + "\nAlbum: " + songAlbum
        + "\nSong Preview: " + previweURL
        + "\n--------------------------------- "
      )
    }
  }
)};


// OMDB Logic

function movieSearch(input){

  if ( input === ""){
       input = "Mr Nobody"
  }
  var omdbURL = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
  request (omdbURL, function(error, response, body) {
    if (error) {
      console.log("An error occurred: " + error)
    }
    else{
      console.log("The movie's rating is: " + JSON.parse(body).imdbRating
      + "\nThe title of the movie is: " +JSON.parse(body).Title
      + "\nThe IMDB Rating of the movie is: " +JSON.parse(body).imdbRating
      + "\nThe Rotten Tomatoes Rating of the movie is: " +JSON.parse(body).Ratings[1].Value
      + "\nThe country where the movie was produced is: " +JSON.parse(body).Country
      + "\nThe language of the movie is " +JSON.parse(body).Language
      + "\nThis is the plot of the movie: " +JSON.parse(body).Plot
      + "\nThe actors in the movie are: " +JSON.parse(body).Actors);
    }
  }

  )};

