// src/components/PromptsUserSet.js
import React from "react";
import './QuestionInputForm.css'

const QuestionInputForm = ({ preferredQuestions, handleInputChange, saveQuestions, clearQuestions, sectionName, title }) => {
    return (
        <section className="prompts-user-set">
            <h2 className="prompt-header">Set Custom Prompts For: {title}</h2>
            <div>
                <div className="input-wrapper">
                    <label htmlFor={'questionOne'} className="prompt-input-label">Preferred Question 1:</label>
                    <input
                        type="text"
                        id={'questionOne'}
                        value={preferredQuestions.questionOne}
                        placeholder={preferredQuestions.questionOne ? '' : 'Question 1'}
                        onChange={(event) => handleInputChange(sectionName, 'questionOne', event)}
                        className="prompt-input"
                    />
                </div>
                <div className="input-wrapper">
                    <label htmlFor={'questionTwo'} className="prompt-input-label">Preferred Question 2:</label>
                    <input
                        type="text"
                        id={'questionTwo'}
                        value={preferredQuestions.questionTwo}
                        placeholder={preferredQuestions.questionTwo ? '' : 'Question 2'}
                        onChange={(event) => handleInputChange(sectionName, 'questionTwo', event)}
                        className="prompt-input"
                    />
                </div>
                <div className="input-wrapper">
                    <label htmlFor={'questionThree'} className="prompt-input-label">Preferred Question 3:</label>
                    <input
                        type="text"
                        id={'questionThree'}
                        value={preferredQuestions.questionThree}
                        placeholder={preferredQuestions.questionThree ? '' : 'Question 3'}
                        onChange={(event) => handleInputChange(sectionName, 'questionThree', event)}
                        className="prompt-input"
                    />
                </div>
                <div className="input-wrapper">
                    <label htmlFor={'questionFour'} className="prompt-input-label">Preferred Question 4:</label>
                    <input
                        type="text"
                        id={'questionFour'}
                        value={preferredQuestions.questionFour}
                        placeholder={preferredQuestions.questionFour ? '' : 'Question 4'}
                        onChange={(event) => handleInputChange(sectionName, 'questionFour', event)}
                        className="prompt-input"
                    />
                </div>
                <div className="input-wrapper">
                    <label htmlFor={'questionFive'} className="prompt-input-label">Preferred Question 5:</label>
                    <input
                        type="text"
                        id={'questionFive'}
                        value={preferredQuestions.questionFive}
                        placeholder={preferredQuestions.questionFive ? '' : 'Question 5'}
                        onChange={(event) => handleInputChange(sectionName, 'questionFive', event)}
                        className="prompt-input"
                    />
                </div>
                <div className="button-container">
                    <button className="button-main submit" onClick={saveQuestions}>Submit</button>
                    <button className="button-main clear" onClick={() => clearQuestions(sectionName)}>Clear</button>
                </div>
            </div>
        </section>
    );
};

export default QuestionInputForm;
