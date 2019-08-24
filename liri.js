require("dotenv").config();

var fs = require("fs");
var keys = require("./keys.js");
var command = process.argv[2];
var input = process.argv.slice(3).join(" ");
var axios = require("axios");
var moment = require("moment");
var divider =
  "\n-----------------------------------------------------------------";

if (command === "spotify-this-song" && input === "") {
  input = "The Sign";
} else if (command === "movie-this" && input === "") {
  input = "Mr. Nobody";
}

// Band Request Function
function findBandInfo(input) {
  var queryUrl =
    "https://rest.bandsintown.com/artists/" +
    input +
    "/events?app_id=codingbootcamp";
  axios.get(queryUrl).then(function(response) {
    var data =
      divider +
      "\nConcert Information: " +
      "\nVenue Name: " +
      response.data[0].venue.name +
      "\nVenue Location: " +
      response.data[0].venue.city +
      "\nDate of Event: " +
      moment(response.data[0].datetime).format("MM/DD/YYYY") +
      divider;
    console.log(data);
    fs.appendFile("log.txt", data, function(err) {
      if (err) {
        return console.log(err);
      }
      console.log("Concert log has been added!!");
    });
  });
}

function findSongInfo(input) {
  var Spotify = require("node-spotify-api");

  var spotify = new Spotify(keys.spotify);

  spotify.search({ type: "track", query: input }, function(err, data) {
    if (err) {
      return console.log("Error occurred: " + err);
    }
    var data =
      divider +
      "\nSong Information:" +
      "\nArtist(s): " +
      data.tracks.items[0].artists[0].name +
      "\nSong Name: " +
      data.tracks.items[0].name +
      "\nPreview Link: " +
      data.tracks.items[0].href +
      "\nAlbum: " +
      data.tracks.items[0].album.name +
      divider;
    console.log(data);
    fs.appendFile("log.txt", data, function(err) {
      if (err) {
        return console.log(err);
      }
      console.log("Songs log has been added!!");
    });
  });
}

function findMovieInfo(input) {
  var queryUrl =
    "http://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=trilogy";

  axios.get(queryUrl).then(function(response) {
    var data =
      divider +
      "\nMovie Information" +
      "\nTitle: " +
      response.data.Title +
      "\nRelease Year: " +
      response.data.Year +
      "\nIMDB Rating: " +
      response.data.imdbRating +
      "\nRotten Tomatoes Rating: " +
      response.data.Ratings[1].Value +
      "\nCountry where movie was produced: " +
      response.data.Country +
      "\nLanguage of the Movie: " +
      response.data.Language +
      "\nMove Plot: " +
      response.data.Plot +
      "\nActors: " +
      response.data.Actors +
      divider;
    console.log(data);
    fs.appendFile("log.txt", data, function(err) {
      if (err) {
        return console.log(err);
      }
      console.log("Movie log has been added!!");
    });
  });
}

function doThis() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    if (error) {
      return console.log(error);
    }
    var dataArr = data.split(",");
    if (dataArr[0] === "spotify-this-song") {
      var check = dataArr[1].slice(1, -1);
      findSongInfo(check);
    }
  });
}

switch (command) {
  case "concert-this":
    findBandInfo(input);
    break;

  case "spotify-this-song":
    findSongInfo(input);
    break;

  case "movie-this":
    findMovieInfo(input);
    break;

  case "do-what-it-says":
    doThis();
    break;
}
