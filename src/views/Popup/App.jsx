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

  const [videos, setVideos] = useState([]);
  const [videoId, setVideoId] = useState();
  const [videoData, setVideoData] = useState();
  const [videoTitle, setVideoTitle] = useState();
  const [videoCategory, setVideoCategory] = useState();
  const [keywords, setKeywords] = useState(['', '', '']);

  const [openAIResponse, setOpenAIResponse] = useState({ questionOne: null, questionTwo: null, questionThree: null, questionFour: null, questionFive: null,});
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

  const [message, setMessage] = useState('');

  chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {

  })

  // Store API KEY in chrome storage on mount to be accessed by the etension service worker
  useEffect(() => {
    const keydata = import.meta.env.VITE_YOUTUBE_API_KEY;


    chrome.storage.local.set({ "key": keydata });
  }, []);

  useEffect(() => {
    setInterval(() => {
      (async () => {
        // Retrieve videoId from chrome.storage.local
        chrome.storage.local.get(["videoId"], (result) => {
          const videoIdTemp = result.videoId;
          console.log("Retrieved video ID:", videoIdTemp);
    
          // Set videoId state
          setVideoID(videoIdTemp, () => {
            console.log("Updated videoId state:", videoId);
          });
        });

        // Retrieve videoCategory from chrome.storage.local
        chrome.storage.local.get(["videoCategory"], (result) => {
            const category = result.videoCategory;
            console.log("Retrieved category:", category);

            // Set videoCategory state
            setVideoCategory(category, () => {
              console.log("Updated videoCategory state:", videoCategory);
            });
          });

              // Listen for messages from the background script
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.data) {
          // Set videoData state when a message is received

            // Set videoData state
            setVideoData(message.data, () => {
              console.log("Updated videoData state:", videoData);
            }),

            // Set videoTitle state
            setVideoTitle(message.data.items[0].snippet.title, () => {
              console.log("Updated videoTitle state:", videoTitle);
            })
        } else if(message.keyTag) {
          // Set keywords state
          setVideoTitle(message.keyTag, () => {
            console.log("Updated keywords state:", keywords);
          })
        }
      });
  
      // Retrieve videoData from chrome.storage.local
      const youtubeResult = await chrome.storage.local.get(["apiResponse"]);
      const youtubeData = youtubeResult.apiResponse;
      setVideoData(youtubeData);
      setVideoTitle(youtubeData[0].snippet.title);
      const keyTagsResult = await chrome.storage.local.get(["keywords"]);
      const tags = keyTagsResult.keywords;
      setKeywords(tags, () => {
        console.log("Updated keywords state:", keywords);
      });


      // Implement type of questions and update Options
      if (videoCategory == 'movie') {
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
      else if (videoCategory == 'videoGame')
      {
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
  })();
  }, 5000);
});
  



  const handleOptionsPageClick = () => {
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open(chrome.runtime.getURL("options.html"));
    }
  };




  const handleSubmit = async () => {
    const {
      questionOne,
      questionTwo,
      questionThree,
      questionFour,
      questionFive,
    } = userQuestions;
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

  return (
    <>
    <div className="popup">
      <header className="popup-header">
        <h2 className="popup-title">Click Search - Key Topics:</h2>
        <span className="tag-item">
          {keywords[0]}
        </span>
        <span className="tag-item">
          {keywords[1]}
        </span>
        <span className="tag-item">
          {keywords[2]}
        </span>
        <button
          onClick={handleOptionsPageClick}
          className="options-page-button"
        >
          <img src="../logo193.png" alt="logo" class="logo"></img>
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
                title={userQuestions.questionOne}
                text={openAIResponse.questionOne}
              /></SwiperSlide>
            <SwiperSlide>
              <ResultsCard
                title={userQuestions.questionTwo}
                text={openAIResponse.questionTwo}
              /></SwiperSlide>
            <SwiperSlide>
              <ResultsCard
                title={userQuestions.questionThree}
                text={openAIResponse.questionThree}
              /></SwiperSlide>
            <SwiperSlide>
              <ResultsCard
                title={userQuestions.questionFour}
                text={openAIResponse.questionFour}
              /></SwiperSlide>
            <SwiperSlide>
              <ResultsCard
                title={userQuestions.questionFive}
                text={openAIResponse.questionFive}
              /></SwiperSlide>
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
