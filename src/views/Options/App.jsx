import React, { useState, useEffect } from "react";
import "./App.css";
import QuestionInputForm from "../components/QuestionInputForm";

// TODO - Need to create react componenets for various parts of this page
// place component files into src/components and import them. reference the resultsCard component for component setup
// store user settings to chrome.storage
// fetch stored data and set react state
// user settings for theme, default prompt questions - other
// create a way to apply css styling for multiple user input themes
// the example now with toggle theme shows how to dynamically set css classes
// may move the input section into its own component file -> pass in props for different question sets
function App() {
  // state variable declaration [variableName, set function]
  const [theme, setTheme] = useState("dark");
  const [showSaved, setShowSaved] = useState(false);
  const [formToShow, setFormToShow] = useState("");

  const defaultQuestions = {
    contentCreatorQuestions: {
      questionOne: "How long have they been a content creator?",
      questionTwo: "Do they have any other channels?",
      questionThree: "Do they stream?",
      questionFour: "Do they have social media handles?",
      questionFive: "What topics do they typcially make videos on?",
    },
    movieQuestions: {
      questionOne: "When did this movie come out?",
      questionTwo: "Who directed and produced this movie?",
      questionThree: "Was this a box office success?",
      questionFour: "What did the audience think of this movie?",
      questionFive:
        "Is the movie part of a series? If yes, what are the other movies?",
    },
    videoGameQuestions: {
      questionOne: "When did this video game release?",
      questionTwo: "Who developed this game?",
      questionThree: "How much does this game cost?",
      questionFour:
        "Does the game have microtransactions? If yes, are they lootboxes?",
      questionFive: "Is this game suitable for children?",
    },
    techQuestions: {
      questionOne: "What is the best way to learn this technology?",
      questionTwo: "What is this technology most often used for?",
      questionThree: "Where can I learn more about this technology?",
      questionFour:
        "What are good YouTube channels with videos related to this technology?",
      questionFive: "Is this a difficult technology to learn?",
    },
    showQuestions: {
      questionOne: "When did this episode air?",
      questionTwo: "How many seasons and episodes are there?",
      questionThree: "What studio created the show?",
      questionFour: "Where can this show be watched?",
      questionFive: "How did the audience respond to this show?",
    },
  };

  const [preferredQuestions, setPreferredQuestions] =
    useState(defaultQuestions);

  useEffect(() => {
    // // Fetch data from storage and set preferredQuestions state
    chrome.storage.local.get(["preferredQuestions"], (result) => {
      const storedQuestions = result.preferredQuestions || null;
      console.log(result);
      if (storedQuestions) {
        setPreferredQuestions(defaultQuestions);
      } else {
        setPreferredQuestions(defaultQuestions);
      }
    });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch theme preference from storage
        const result = await new Promise((resolve) => {
          chrome.storage.local.get(["theme"], resolve);
        });

        const storedTheme = result.theme || "dark"; // Default to "dark" if theme is not stored

        setTheme(storedTheme);
      } catch (error) {
        console.error("Error fetching theme preference:", error);
        // Handle the error as needed (e.g., use a default theme)
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (section, fieldName, event) => {
    // Update the state with the new value
    setPreferredQuestions((prevState) => ({
      ...prevState,
      [section]: {
        ...prevState[section],
        [fieldName]: event.target.value,
      },
    }));
  };

  // gets called when input element is changed, and updates state. this dynamically sets the css class
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);

    // Save the theme preference to chrome.storage.local
    chrome.storage.local.set({ theme: newTheme }, () => {
      console.log("Theme preference saved:", newTheme);
    });
  };

  //new saveQuestions, checks if null then populates with default questions if null
  const saveQuestions = () => {
    // Check if any questions are null or empty
    const isAnyQuestionEmpty = Object.values(preferredQuestions).some(
      (questions) =>
        Object.values(questions).some((question) => !question.trim())
    );

    if (isAnyQuestionEmpty) {
      // If any question is empty, replace with default questions
      const questionsWithDefaults = Object.keys(preferredQuestions).reduce(
        (acc, section) => {
          acc[section] = Object.fromEntries(
            Object.keys(preferredQuestions[section]).map((key) => [
              key,
              preferredQuestions[section][key] ||
                defaultQuestions[section][key],
            ])
          );
          return acc;
        },
        {}
      );

      setPreferredQuestions(questionsWithDefaults);
      console.log(
        "Some questions were empty. Replaced with default questions:",
        questionsWithDefaults
      );

      // Save preferred questions with defaults to chrome.storage.local
      chrome.storage.local.set(
        { preferredQuestions: questionsWithDefaults },
        () => {
          console.log("Preferred questions set:", questionsWithDefaults);
        }
      );
    } else {
      // Save preferred questions to chrome.storage.local
      chrome.storage.local.set(
        { preferredQuestions: preferredQuestions },
        () => {
          console.log("Preferred questions set:", preferredQuestions);
        }
      );
    }

    setShowSaved(true);
    setTimeout(() => {
      // Set showSaved back to false after 3 seconds
      setShowSaved(false);
    }, 3000);
  };

  //clearQuestions clears entries
  const clearQuestions = (section) => {
    setPreferredQuestions((prevState) => ({
      ...prevState,
      [section]: Object.fromEntries(
        Object.keys(prevState[section]).map((key) => [key, ""])
      ),
    }));
    console.log(preferredQuestions);
  };

  const showForm = (formName) => {
    setFormToShow(formName);
  };

  return (
    <div className={`options ${theme}`}>
      <header className="options-header">
        <h1>Configure Your Extension</h1>
      </header>
      <section className="theme-form">
        <h1 className={`section-title ${theme}`}>Theme</h1>
        <br />
        <span className="filter-item" onClick={toggleTheme}>
          {theme === "light" ? "dark" : "light"}
        </span>
      </section>
      <section className="options-prompts">
        <h2>Configure Prompts</h2>
        <section className="prompts-pre-set">
          <div className="category-select-wrapper">
            <h3 className="category-select-h3">Select a Category:</h3>
            <br />
            <span
              onClick={() => showForm("contentCreator")}
              className={`filter-item ${
                formToShow === "contentCreator" ? "active" : ""
              }`}
            >
              Content Creator
            </span>
            <span
              onClick={() => showForm("videoGames")}
              className={`filter-item ${
                formToShow === "videoGames" ? "active" : ""
              }`}
            >
              Video Games
            </span>
            <span
              onClick={() => showForm("movies")}
              className={`filter-item ${
                formToShow === "movies" ? "active" : ""
              }`}
            >
              Movies
            </span>
            <span
              onClick={() => showForm("tech")}
              className={`filter-item ${formToShow === "tech" ? "active" : ""}`}
            >
              Technology
            </span>
            <span
              onClick={() => showForm("shows")}
              className={`filter-item ${
                formToShow === "shows" ? "active" : ""
              }`}
            >
              TV Shows/Anime
            </span>
          </div>
        </section>
        {formToShow === "contentCreator" && (
          <QuestionInputForm
            preferredQuestions={preferredQuestions.contentCreatorQuestions}
            handleInputChange={handleInputChange}
            saveQuestions={saveQuestions}
            clearQuestions={clearQuestions}
            sectionName={"contentCreatorQuestions"}
            title={"Content Creator"}
          />
        )}
        {formToShow === "tech" && (
          <QuestionInputForm
            preferredQuestions={preferredQuestions.techQuestions}
            handleInputChange={handleInputChange}
            saveQuestions={saveQuestions}
            clearQuestions={clearQuestions}
            sectionName={"techQuestions"}
            title={"Technology"}
          />
        )}
        {formToShow === "movies" && (
          <QuestionInputForm
            preferredQuestions={preferredQuestions.movieQuestions}
            handleInputChange={handleInputChange}
            saveQuestions={saveQuestions}
            clearQuestions={clearQuestions}
            sectionName={"movieQuestions"}
            title={"Movies"}
          />
        )}
        {formToShow === "videoGames" && (
          <QuestionInputForm
            preferredQuestions={preferredQuestions.videoGameQuestions}
            handleInputChange={handleInputChange}
            saveQuestions={saveQuestions}
            clearQuestions={clearQuestions}
            sectionName={"videoGameQuestions"}
            title={"Video Games"}
          />
        )}
        {formToShow === "shows" && (
          <QuestionInputForm
            preferredQuestions={preferredQuestions.showQuestions}
            handleInputChange={handleInputChange}
            saveQuestions={saveQuestions}
            clearQuestions={clearQuestions}
            sectionName={"showQuestions"}
            title={"TV Shows/Anime"}
          />
        )}
        {showSaved ? <span>Saved successfully</span> : ""}
      </section>
    </div>
  );
}

export default App;