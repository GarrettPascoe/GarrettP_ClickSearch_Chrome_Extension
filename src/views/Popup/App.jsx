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

  const [openAIResponse, setOpenAIResponse] = useState({ questionOne: null, questionTwo: null, questionThree: null, questionFour: null, questionFive: null});
  const [selectedQuestions, setSelectedQuestions] = useState({ questionOne: '', questionTwo: '', questionThree: '', questionFour: '', questionFive: ''});
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

  const [prompt, setPrompt] = useState();
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
    }, 5000);
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
    console.log("Updated video title state:", videoTitle);

    getKeywords()
    }
  }, [videoTitle]);


  // Used to log videoCategory when the state is changed
  useEffect(() => {
    console.log("Updated videoCategory state:", videoCategory);
  }, [videoCategory]);


  // Use effect that triggers when keywords state is changed and calls the implementQuestions method
  useEffect(() => {
    if(videoId != ' ')
    {
    console.log("Updated keywords state:", keywords);

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
    console.log("Selected Questions:", selectedQuestions);

    //handleSubmit()
      }
  }, [selectedQuestions]);


  const getVideoId = () => {

    // Retrieve videoId from chrome.storage.local
    chrome.storage.local.get(["videoId"], (result) => {
      const videoIdTemp = result.videoId;
      console.log("Retrieved video ID:", videoIdTemp);

      // Set videoId state
      setVideoId(videoIdTemp);
    });
  };


  const getVideoTitle = () => {

    // Retrieve videoTitle from chrome.storage.local
    chrome.storage.local.get(["videoTitle"], (result) => {
      const title = result.videoTitle;
      console.log("Retrieved title:", title);

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
      console.log("Retrieved Preferred Questions:", Questions);

      // Set videoTitle state
      setUserQuestions(Questions);
    });
  };

/*
  const implementQuestions = async () => {

    if (videoCategory == 'movie')
    {
      console.log("Retrieved questions for movies");
      const preferredQuestionsResult = await chrome.storage.local.get(["preferredQuestions"]);
      const questions = preferredQuestionsResult.preferredQuestions.movieQuestions;
      console.log("Retrieved questions:", questions);
      setUserQuestions(questions, () => {
        console.log("Updated questions state:", userQuestions);
        if (storedOpenaiResponse.videoId !== videoId){
          handleSubmit();
        }
        else {
          setOpenAIResponse(storedOpenaiResponse)
          isLoading(false);
        }
      });
    }
    else if (videoCategory == 'tv series')
    {
      console.log("Retrieved questions for tv series");
      const preferredQuestionsResult = await chrome.storage.local.get(["preferredQuestions"]);
      const questions = preferredQuestionsResult.preferredQuestions.showQuestions;
      console.log("Retrieved questions:", questions);
      setUserQuestions(questions, () => {
        console.log("Updated questions state:", userQuestions);
        if (storedOpenaiResponse.videoId !== videoId){
          handleSubmit();
        }
        else {
          setOpenAIResponse(storedOpenaiResponse)
          isLoading(false);
        }
      });
    }
    else if (videoCategory == 'video game')
    {
      console.log("Retrieved questions for video games");
      const preferredQuestionsResult = await chrome.storage.local.get(["preferredQuestions"]);
      const questions = preferredQuestionsResult.preferredQuestions.videoGameQuestions;
      console.log("Retrieved questions:", questions);
      setUserQuestions(questions, () => {
        console.log("Updated questions state:", userQuestions);
        if (storedOpenaiResponse.videoId !== videoId){
          handleSubmit();
        }
        else {
          setOpenAIResponse(storedOpenaiResponse)
          isLoading(false);
        }
      });
    }
    else if (videoCategory == 'tech')
    {
      console.log("Retrieved questions for tech");
      const preferredQuestionsResult = await chrome.storage.local.get(["preferredQuestions"]);
      const questions = preferredQuestionsResult.preferredQuestions.techQuestions;
      console.log("Retrieved questions:", questions);
      setUserQuestions(questions, () => {
        console.log("Updated questions state:", userQuestions);
        if (storedOpenaiResponse.videoId !== videoId){
          handleSubmit();
        }
        else {
          setOpenAIResponse(storedOpenaiResponse)
          isLoading(false);
        }
      });
    }
    else
    {
      console.log("Retrieved questions for content creator");
      const preferredQuestionsResult = await chrome.storage.local.get(["preferredQuestions"]);
      const questions = preferredQuestionsResult.preferredQuestions.contentCreatorQuestions;
      console.log("Retrieved questions:", questions);
      setUserQuestions(questions, () => {
        console.log("Updated questions state:", userQuestions);
        if (storedOpenaiResponse.videoId !== videoId){
          handleSubmit();
        }
        else {
          setOpenAIResponse(storedOpenaiResponse)
          isLoading(false);
        }
      });
    }
  }
*/


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


  const handleSubmit = async () => {

    const {
      questionOne,
      questionTwo,
      questionThree,
      questionFour,
      questionFive,
    } = selectedQuestions;

    console.log("Question #1: ", questionOne);

    const prompt = `Video title: ${videoTitle}, key topics: ${keywords[0]},  ${keywords[1]},  ${keywords[2]}, Questions: (1) ${questionOne} (2) ${questionTwo} (3) ${questionThree} (4) ${questionFour} (5) ${questionFive}`;
    let completion
    try {
      completion = await generateChatCompletion(prompt);
      setOpenAIResponse({completion})
    } catch (error) {
      console.error('Error:', error);
    }
    completion.videoId = videoId;
    chrome.storage.local.set({ openaiResponse: completion }, () => {
      console.log('openai answers set:', completion);
    });
    
    console.log(userQuestions)
    console.log(prompt);
    console.log(completion)
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
    <div className="popup">
        <header className="popup-header">
          <h2 className="popup-title">Click Search - Key Topics:</h2>
          <span className="tag-item">{keywords[0]}</span>
          <span className="tag-item">{keywords[1]}</span>
          <span className="tag-item">{keywords[2]}</span>
          <button
            onClick={handleOptionsPageClick}
            className="options-page-button"
          >
            <img src="../../../logo193.png" alt="logo" class="logo"></img>
          </button>
        </header>
        {!loading ? (
          <div className="results">
            <Swiper
              modules={[Autoplay, Navigation, Pagination]}
              spaceBetween={50}
              slidesPerView={1}
              loop={true}
              navigation
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              pagination={{ clickable: true }}
            >
              <SwiperSlide>
                <ResultsCard
                  title={userQuestions.techQuestions.questionOne}
                  text={openAIResponse.one}
                />
              </SwiperSlide>
              <SwiperSlide>
                <ResultsCard
                  title={userQuestions.techQuestions.questionTwo}
                  text={openAIResponse.two}
                />
              </SwiperSlide>
              <SwiperSlide>
                <ResultsCard
                  title={userQuestions.techQuestions.questionThree}
                  text={openAIResponse.three}
                />
              </SwiperSlide>
              <SwiperSlide>
                <ResultsCard
                  title={userQuestions.techQuestions.questionFour}
                  text={openAIResponse.four}
                />
              </SwiperSlide>
              <SwiperSlide>
                <ResultsCard
                  title={userQuestions.techQuestions.questionFive}
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
