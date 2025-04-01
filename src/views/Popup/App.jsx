import './App.css'
import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import ResultsCard from "../components/ResultsCard.jsx";
import generateChatCompletion from '../../api/openaiApi.js';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

function App() {

  const [videoId, setVideoId] = useState(' ');
  const [videoTitle, setVideoTitle] = useState(' ');
  const [videoCategory, setVideoCategory] = useState(' ');
  const [keywords, setKeywords] = useState(['tag1', 'tag2', 'tag3']);

  const [openAIResponse, setOpenAIResponse] = useState({ one: null, two: null, three: null, four: null, five: null, videoId: null});
  const [selectedQuestions, setSelectedQuestions] = useState({ questionOne: '', questionTwo: '', questionThree: '', questionFour: '', questionFive: ''});
  const [selectedKeyword, setSelectedKeyword] = useState(' ');
  const [userQuestions, setUserQuestions] = useState({
      movieQuestions: {
        questionOne: '',
        questionTwo: '',
        questionThree: '',
        questionFour: '',
        questionFive: '',
      },
      showQuestions: {
        questionOne: '',
        questionTwo: '',
        questionThree: '',
        questionFour: '',
        questionFive: '',
      },
      videoGameQuestions: {
        questionOne: '',
        questionTwo: '',
        questionThree: '',
        questionFour: '',
        questionFive: '',
      },
      techQuestions: {
        questionOne: '',
        questionTwo: '',
        questionThree: '',
        questionFour: '',
        questionFive: '',
      },
      contentCreatorQuestions: {
        questionOne: '',
        questionTwo: '',
        questionThree: '',
        questionFour: '',
        questionFive: '',
      },
  });

  //const [prompt, setPrompt] = useState();
  const [storedOpenaiResponse, setStoredOpenAIResponse] = useState();

  const [loading, isLoading] = useState(true);

  const [update, needsUpdate] = useState(false);

  // Store API KEY in chrome storage on mount to be accessed by the etension service worker
  useEffect(() => {
    const keydata = import.meta.env.VITE_YOUTUBE_API_KEY;

    chrome.storage.local.set({ "key": keydata });
  }, []);

  // useEffect to check if the video Id needs to be updated
  useEffect(() => {
    setInterval(() => {
        // Check if an update is needed
        checkUpdate();
    }, 500);
  });
  


  // Use effect that triggers when the update state is changed and attempts to retrieve the videoId of the current webpage
  useEffect(() => {
        if (update == true)
        {
          // Retrieve videoId from chrome.storage.local
          getVideoId()
        } // end if
    }, [update]);

  

  // Use effect that triggers when videoId state is changed and calls the getVideoTitle method
  useEffect(() => {
    if(videoId != ' ')
    {
    console.log("Updated videoId state:", videoId);
    needsUpdate(false)
    chrome.storage.local.set({ "needUpdate": false })

    // Retrieve videoCategory from chrome.storage.local
    //getVideoCategory();

    // Retrieve videoTitle from chrome.storage.local
    getVideoTitle()
    }
  }, [videoId]);


  // Use effect that triggers when videoTitle state is changed and calls the getKeywords method
  useEffect(() => {
    if(videoId != ' ')
    {
    //console.log("Updated video title state:", videoTitle);

    getKeywords()
    }
  }, [videoTitle]);


  // Used to log videoCategory when the state is changed
  useEffect(() => {
    //console.log("Updated videoCategory state:", videoCategory);
  }, [videoCategory]);


  // Use effect that triggers when keywords state is changed and calls the implementQuestions method
  useEffect(() => {
    if(videoId != ' ')
    {
    //console.log("Updated keywords state:", keywords);

    // Implement type of questions and update Options
    getPrefferedQuestions()
    }
  }, [keywords]);



  // Use effect that triggers when userQuestions state is changed
  useEffect(() => {
    if(videoId != ' ')
      {
    console.log("Implementing Questions");
  
    if (videoCategory == 'movie')
      {
        const questions = userQuestions.movieQuestions
        setSelectedQuestions(questions);
      }
    else if (videoCategory == 'tv series')
      {
        const questions = userQuestions.showQuestions
        setSelectedQuestions(questions);
      }
    else if (videoCategory == 'video game')
      {
        const questions = userQuestions.videoGameQuestions
        setSelectedQuestions(questions);
      }
    else if (videoCategory == 'tech')
      {
        const questions = userQuestions.techQuestions
        setSelectedQuestions(questions);
      }
    else
      {
        const questions = userQuestions.contentCreatorQuestions
        setSelectedQuestions(questions);
      }

    }

  }, [userQuestions]);


  useEffect(() => {
    if(videoId != ' ')
      {
    //console.log("Selected Questions:", selectedQuestions);

    //handleSubmit()
      }
  }, [selectedQuestions]);


  useEffect(() => {
    if(videoId != ' ' && keywords[0] != 'tag1')
      {
      //console.log("Selected keyword has changed");

      handleSubmit()
      }
  }, [selectedKeyword]);


  const getVideoId = () => {

    // Retrieve videoId from chrome.storage.local
    chrome.storage.local.get(["videoId"], (result) => {
      const videoIdTemp = result.videoId;
      //console.log("Retrieved video ID:", videoIdTemp);

      // Set videoId state
      setVideoId(videoIdTemp);
    });
  };


  const getVideoTitle = () => {

    // Retrieve videoTitle from chrome.storage.local
    chrome.storage.local.get(["videoTitle"], (result) => {
      const title = result.videoTitle;
      //console.log("Retrieved title:", title);

      // Set videoTitle state
      setVideoTitle(title);
    });
  };


  const getKeywords = () => {

    // The keywords array retrieved from the service worker contains three keywords and the video category.
    // The keywords make up the first three variables in the array and the video category is the fourth.

    // Retrieve Keywords from chrome.storage.local
    chrome.storage.local.get(["keywords"], (result) => {
      const tags = result.keywords;

      const selectedTags = [tags[0], tags[1], tags[2]]

      console.log("Retrieved keywords:", selectedTags);

      // Set keyword state
      setKeywords(selectedTags);

      const category = tags[3]

      console.log("Retrieved category:", category);

      // Set videoCategory state
      setVideoCategory(category);
    });
  };


  const getPrefferedQuestions = () => {

    // Retrieve prefferedQuestions from chrome.storage.local
    chrome.storage.local.get(["preferredQuestions"], (result) => {
      const Questions = result.preferredQuestions;
      //console.log("Retrieved Preferred Questions:", Questions);

      // Set videoTitle state
      setUserQuestions(Questions);
    });
  };


  const handleOptionsPageClick = () => {
    console.log("Options pressed");
    if (chrome.runtime.openOptionsPage) {
      console.log("Options if statement start");
      chrome.runtime.openOptionsPage();
      console.log("Options if statement passed");
    } else {
      console.log("Options else statement start");
      window.open(chrome.runtime.getURL("options.html"));
      console.log("Options else statement passed");
    }
  };


  const handleButton1 = () => {
    const keyword = keywords[0];
    console.log("Button #1 pressed:", keyword);

    // Set selected keyword to keyword[0]
    setSelectedKeyword(keyword);
  };

  const handleButton2 = () => {
    const keyword = keywords[1];
    console.log("Button #2 pressed:", keyword);

    // Set selected keyword to keyword[0]
    setSelectedKeyword(keyword);
  };

  const handleButton3 = () => {
    const keyword = keywords[2];
    console.log("Button #3 pressed:", keyword);

    // Set selected keyword to keyword[0]
    setSelectedKeyword(keyword);
  };


  const handleSubmit = async () => {

    const {
      questionOne,
      questionTwo,
      questionThree,
      questionFour,
      questionFive,
    } = selectedQuestions;

    const prompt = `Video title: ${videoTitle}, key topic: ${selectedKeyword}, Questions: (1) ${questionOne} (2) ${questionTwo} (3) ${questionThree} (4) ${questionFour} (5) ${questionFive}`;
    console.log("Prompt: ", prompt);
    let completion
    try {
      completion = await generateChatCompletion(prompt);
      console.log("Completion Value: ", completion)
      setOpenAIResponse(completion)
    } catch (error) {
      console.error('Error:', error);
    }
    completion.videoId = videoId;
    chrome.storage.local.set({ openaiResponse: completion }, () => {
      //console.log('openai answers set:', completion);
    });
    
    //console.log(userQuestions)
    //console.log(prompt);
    console.log("Openai Response: ", openAIResponse)
    isLoading(false);
  };


  const checkUpdate = () => {
    // Retrieve update status from chrome.storage.local
    chrome.storage.local.get(["needUpdate"], (result) => {
      const update = result.needUpdate;
      if (update == true)
      {
        console.log("time to update:", update);
        // Set update to true to allow the hook to progress
        needsUpdate(false);
        needsUpdate(update);
      }
    });
  }


  return (
    <>
    <div className="popup"
    style={{
      backgroundColor: "#cccccc",
      backgroundImage:
        "linear-gradient(rgb(63, 67, 87), rgb(82, 128, 199), rgb(63, 67, 87))",
    }}>
        <header className="popup-header">
          <div className="row">
          <h2 className="popup-title">Click Search:</h2>
          </div>
          <div className="row" style={{height: "10px"}}></div>
          <div className="row">
          <button onClick={handleButton1} className="tag-item" style={{width: "150px"}}>
            {keywords[0]}</button>
          </div>
          <div className="row" style={{height: "10px"}}></div>
          <div className="row">
          <button onClick={handleButton2} className="tag-item" style={{width: "150px"}}>
            {keywords[1]}</button>
          </div>
          <div className="row" style={{height: "10px"}}></div>
          <div className="row">
          <button onClick={handleButton3} className="tag-item" style={{width: "150px"}}>
            {keywords[2]}</button>
          </div>
          <div className="row" style={{height: "10px"}}></div>
          <div className="row">
          <button
            onClick={handleOptionsPageClick}
            className="options-page-button"
          >
            <img src="../../../logo193.png" alt="logo" class="logo"></img>
          </button>
          </div>
        </header>
        {!loading ? (
          <div className="results">
            <Swiper
              modules={[Autoplay, Navigation, Pagination]}
              spaceBetween={50}
              slidesPerView={1}
              centeredSlides={true}
              loop={true}
              navigation
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              pagination={{ clickable: true }}
            >
              <SwiperSlide>
                <ResultsCard
                  title={selectedQuestions.questionOne}
                  text={openAIResponse.one}
                />
              </SwiperSlide>
              <SwiperSlide>
                <ResultsCard
                  title={selectedQuestions.questionTwo}
                  text={openAIResponse.two}
                />
              </SwiperSlide>
              <SwiperSlide>
                <ResultsCard
                  title={selectedQuestions.questionThree}
                  text={openAIResponse.three}
                />
              </SwiperSlide>
              <SwiperSlide>
                <ResultsCard
                  title={selectedQuestions.questionFour}
                  text={openAIResponse.four}
                />
              </SwiperSlide>
              <SwiperSlide>
                <ResultsCard
                  title={selectedQuestions.questionFive}
                  text={openAIResponse.five}
                />
              </SwiperSlide>
            </Swiper>
          </div>
        ) : (
          <div class="loading">
            <div class="loading-dot"></div>
            <div class="loading-dot"></div>
            <div class="loading-dot"></div>
            <div class="loading-dot"></div>
          </div>
        )}
      </div>
    </>
  );
}

export default App
