// //Extract YouTube tags from API result snippet (We can also get the Video Title here):

// //Determine which Youtube tag is most relevant (Possibly by matching with Video Title)

// //Load Queries from Saved Search Preferences (or use defaults)
// //By filling place holder characters with the string of the most relevant tag

// //Send Queries to Chatgpt through their API

// //Update Pop Up fields with the results of the query (possibly offer a search bar if 
// //the app determines that an error occured)

/*

function storageOnChanged() {
  console.log("first listener changes: " + changes); // {key : { newValue: 'value' }}
}
chrome.storage.session.onChanged.addListener(storageOnChanged);

chrome.storage.onChanged.addListener(function(changes, namespace) {
  if (["key"] in changes) {
      console.log("Old value: " + changes.key.oldValue);
      console.log("New value: " + changes.key.newValue);
  }
});

*/

// Listener that triggers on history change in Chrome
chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
  console.log("History has changed");

  chrome.storage.local.get(["key"], (result) => {  // Get the api KEY for YoutubeData api
    const KEY = result.key;
  if (KEY) {  // if KEY isn't null
  console.log("KEY: " + KEY);
  if (details.url) {  // if details.url exists
    const url = new URL(details.url);  // set url datatype variable to match details
    const videoId = url.searchParams.get("v");  // get videoId from url
    if (videoId) {
      console.log("Video ID has changed to: " + videoId);
      chrome.storage.local.set({ videoId: videoId }).then(() => {
        console.log("Video ID has been stored.");
      });  // Copy new videoId to the storage variable



      fetch(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet&key=${KEY}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          chrome.storage.local.set({ apiResponse: data.items })
        })

        .then(keyTag => { 
          chrome.storage.local.get(["apiResponse"]).then((result) => {
            keyTag = tagAlgorithm(result.apiResponse[0].snippet.tags, result.apiResponse[0].snippet.title, result.apiResponse[0].snippet.channelTitle, result.apiResponse[0].snippet.categoryId);         
            console.log("Response from tagAlgorithm", keyTag);
            chrome.storage.local.set({ "keywords": keyTag});
          })
        })

        .catch(error => {
          console.error("Error fetching data:", error);
        });
    }
  }
}});})

// add video title to parameters
function tagAlgorithm(tagArray, title, channel, categoryId)
{
  //initialize the return array

  let returnArray = [4];

  //Test if the video has tags

  if (tagArray === undefined)
  {
    returnArray[0] = "empty";
    returnArray[1] = "empty";
    returnArray[2] = channel;
    returnArray[3] = "n/a";

    return returnArray;
  }

  //Create an array to store points for each tag

  let pointArray = [tagArray.length];

  for (var i = 0; i < tagArray.length; i++)
  {
    pointArray[i] = 0;
  }

  //Create variables to store points for each category

  var moviePoints = 0;
  var tvPoints = 0;
  var videogamePoints = 0;
  var techPoints = 0;

  //Split each tag string into an array of word strings

  let wordArray = [tagArray.length];

  for (var i = 0; i < tagArray.length; i++)
  {
    wordArray[i] = tagArray[i].split(" ");

    for (var j = 0; j < wordArray[i].length; j++)
    {
      wordArray[i][j] = wordArray[i][j].toLowerCase();
    }
  }

  //Split title into an array of word strings

  let titleArray = title.split(" ");

  for (var i = 0; i < titleArray.length; i++)
  {
    titleArray[i] = titleArray[i].toLowerCase();
  }

  //Section for determining the video category

  //Check the categoryId of the video

  if (categoryId == 1)
  {
    moviePoints = moviePoints + 20;
  }
  else if (categoryId == 20)
  {
    videogamePoints = videogamePoints + 100;
  }
  else if (categoryId == 2 || categoryId == 28)
  {
    techPoints = techPoints + 100;
  }
  else if (categoryId == 23 || categoryId == 27 || categoryId == 26 ||
  categoryId == 25 || categoryId == 10 || categoryId == 29 || categoryId == 22
  || categoryId == 15 || categoryId == 17 || categoryId == 19)
  {
    //Return only the name of the channel if the video is a category unrelated to our chosen categories and exit the algorithm early
    returnArray[0] = "empty";
    returnArray[1] = "empty";
    returnArray[2] = channel;
    returnArray[3] = "n/a";

    return returnArray;
  }

  //Compare the video title with category keywords

  for (var k = 0; k < titleArray.length; k++)
  {
    var titleWord = titleArray[k].toLowerCase();

    if (titleWord == "tv" || titleWord == "anime" || titleWord == "animes" || titleWord == "season" || titleWord == "netflix" || titleWord == "crunchyroll" || titleWord == "funimation"
    || titleWord == "show" || titleWord == "shows")
    {
      tvPoints = tvPoints + 5;
    }
    else if (titleWord == "movie" || titleWord == "movies" || titleWord == "blockbuster" || titleWord == "box" || titleWord == "office" || titleWord == "ticket" || titleWord == "weekend")
    {
      moviePoints = moviePoints + 5;
    }
    else if (titleWord == "xbox" || titleWord == "nintendo" || titleWord == "playstation" || titleWord == "game" || titleWord == "games" || titleWord == "play" || titleWord == "playing"
    || titleWord == "gameplay"|| titleWord == "letsplay"  || titleWord == "let'splay" || titleWord == "playthrough" || titleWord == "rpg" || titleWord == "tutorial" || titleWord == "tutorial"
    || titleWord == "multiplayer" || titleWord == "fps" || titleWord == "guide" || titleWord == "secrets")
    {
      videogamePoints = videogamePoints + 5;
    }
    else if (titleWord == "apple" || titleWord == "microsoft" || titleWord == "linux" || titleWord == "asus" || titleWord == "intel" || titleWord == "cisco" || titleWord == "dell"
    || titleWord == "adobe" || titleWord == "samsung" || titleWord == "iphone" || titleWord == "ram" || titleWord == "gigabytes" || titleWord == "terabytes" || titleWord == "processor"
    || titleWord == "programming" || titleWord == "tech" || titleWord == "technology" || titleWord == "tutorial")
    {
      techPoints = techPoints + 5;
    }
  }

  //Compare video tags with category keywords

  for (var i = 0; i < tagArray.length; i++)
  {
    for (var j = 0; j < wordArray[i].length; j++)
    {
      var tagWord = wordArray[i][j].toLowerCase();

      if (tagWord == "tv" || tagWord == "anime" || tagWord == "animes" || tagWord == "season" || tagWord == "netflix" || tagWord == "crunchyroll" || tagWord == "funimation"
      || tagWord == "show" || tagWord == "shows")
      {
        tvPoints = tvPoints + 3;
      }
      else if (tagWord == "movie" || tagWord == "movies" || tagWord == "blockbuster" || tagWord == "box" || tagWord == "office" || tagWord == "ticket" || tagWord == "weekend")
      {
        moviePoints = moviePoints + 3;
      }
      else if (tagWord == "xbox" || tagWord == "nintendo" || tagWord == "playstation" || tagWord == "game" || tagWord == "games" || tagWord == "play" || tagWord == "playing"
      || tagWord == "gameplay"|| tagWord == "letsplay"  || tagWord == "let'splay" || tagWord == "playthrough" || tagWord == "rpg" || tagWord == "tutorial" || tagWord == "tutorial"
      || tagWord == "multiplayer" || tagWord == "fps" || tagWord == "guide" || tagWord == "secrets")
      {
        videogamePoints = videogamePoints + 3;
      }
      else if (tagWord == "apple" || tagWord == "microsoft" || tagWord == "linux" || tagWord == "asus" || tagWord == "intel" || tagWord == "cisco" || tagWord == "dell"
      || tagWord == "adobe" || tagWord == "samsung" || tagWord == "iphone" || tagWord == "ram" || tagWord == "gigabytes" || tagWord == "terabytes" || tagWord == "processor"
      || tagWord == "programming" || tagWord == "tech" || tagWord == "technology" || tagWord == "tutorial")
      {
        techPoints = techPoints + 3;
      }
    }
  }

  var highestCategory = 0;
  returnArray[3] = "movie";     //Entertainment is defaulted to movie if no points were added

  if (moviePoints > highestCategory)
  {
    highestCategory = moviePoints;
    returnArray[3] = "movie";
  }

  if (tvPoints > highestCategory)
  {
    highestCategory = tvPoints;
    returnArray[3] = "tv series";
  }

  if (videogamePoints > highestCategory)
  {
    highestCategory = videogamePoints;
    returnArray[3] = "video game";
  }

  if (techPoints > highestCategory)
  {
    highestCategory = techPoints;
    returnArray[3] = "tech";
  }

  //End of section for determining the video category

  //Start of section for determining the most important tags

  //Compare strings to videotitle to find matching words

  for (var i = 0; i < tagArray.length; i++)
  {
    for (var j = 0; j < wordArray[i].length; j++)
    {
      for (var k = 0; k < titleArray.length; k++)
      {
        if (wordArray[i][j] === titleArray[k])
        {
          pointArray[i] = pointArray[i] + 3;
        }
      }
    }
  }

  //Compare strings with eachother to find repeating words

  for (var i = 0; i < tagArray.length; i++)
  {
    for (var j = tagArray.length - i - 1; j > 0; j--)
    {
      var flag = 0;
      for (var k = 0; k < wordArray[i].length; k++)
      {
        for (var l = 0; l < wordArray[j].length; l++)
        {
          if (i != j)
          {
            if (wordArray[i][k] === wordArray[j][l] && flag < 2)
            {
              if (wordArray[i].length < wordArray[j].length)
              {
                pointArray[i] = pointArray[i] + 1;
              }
              else
              {
                pointArray[j] = pointArray[j] + 1;
              }
            flag = flag + 1;
            }
          }
        }
        flag = 0;
      }
    }
  }

  //Give points to the first few tags and last few strings.

  if (tagArray.length > 5)
  {
    pointArray[0] = pointArray[0] + 5;
    pointArray[1] = pointArray[1] + 3;
    pointArray[2] = pointArray[2] + 1;
    pointArray[tagArray.length - 1] = pointArray[tagArray.length - 1] + 1;
    pointArray[tagArray.length - 2] = pointArray[tagArray.length - 2] + 1;
    pointArray[tagArray.length - 3] = pointArray[tagArray.length - 3] + 1;
  }

  //End of section for determining the most important tags

  let channelArray = channel.split(" ");

  for (var i = 0; i < channelArray.length; i++)
  {
    channelArray[i] = channelArray[i].toLowerCase();
  }

  for (var i = 0; i < tagArray.length; i++)
  {
    for (var j = 0; j < wordArray[i].length; j++)
    {
      for (var k = 0; k < channelArray.length; k++)
      {
        if (wordArray[i][j] === channelArray[k])
        {
          pointArray[i] = pointArray[i] - 3;
        }
      }
    }
  }

  //Evaluate the results and create a return list

  //Initialize variables to store the 3 highest point values and their positions in the tag array

  var firstPlace = 0;
  var firstPosition = 0;
  var secondPlace = 0;
  var secondPosition = 0;
  var thirdPlace = 0;
  var thirdPosition = 0;


  //Normal case with many tags
  if (tagArray.length > 2)
  {
    for (var i = 0; i < tagArray.length; i++)
    {
      if (pointArray[i] > firstPlace)
      {
        thirdPlace = secondPlace;
        thirdPosition = secondPosition;
        secondPlace = firstPlace;
        secondPosition = firstPosition;
        firstPlace = pointArray[i];
        firstPosition = i;
      }
      else if (pointArray[i] <= firstPlace && pointArray[i] > secondPlace)
      {
        thirdPlace = secondPlace;
        thirdPosition = secondPosition;
        secondPlace = pointArray[i];
        secondPosition = i;
      }
      else if (pointArray[i] <= secondPlace && pointArray[i] > thirdPlace)
      {
        thirdPlace = pointArray[i];
        thirdPosition = i;
      }
    }


    //Shift the channel title to 3rd position of the array
    if (firstPlace == channel)
    {
      firstPosition = thirdPosition

      returnArray[0] = tagArray[firstPosition];
      returnArray[1] = tagArray[secondPosition];
      returnArray[2] = channel;
    }
    else if (secondPlace == channel)
    {
      secondPosition = thirdPosition

      returnArray[0] = tagArray[firstPosition];
      returnArray[1] = tagArray[secondPosition];
      returnArray[2] = channel;
    }
    else
    {
      returnArray[0] = tagArray[firstPosition];
      returnArray[1] = tagArray[secondPosition];
      returnArray[2] = channel;
    }
  }

  //Case with only two tags
  if (tagArray.length == 2)
  {
    if (pointArray[0] > pointArray[1])
    {
      firstPlace = 0;
      secondPlace = 1;
    }
    else
    {
      firstPlace = 1;
      secondPlace = 0;
    }
    returnArray[0] = tagArray[firstPlace];
    returnArray[1] = tagArray[secondPlace];
    returnArray[2] = channel;
  }
  else if (tagArray.length == 1)   //Case for a single tag
  {
    returnArray[0] = "empty";
    returnArray[1] = tagArray[0];
    returnArray[2] = channel;
  }

  console.log(pointArray);

  //return value
  return returnArray;
}

export { }
