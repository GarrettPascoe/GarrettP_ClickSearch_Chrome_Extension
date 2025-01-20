import axios from 'axios';

const openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;
const apiUrl = 'https://api.openai.com/v1/chat/completions';

const generateChatCompletion = async (prompt) => {
  try {
    const response = await axios.post(
      apiUrl,
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {role: 'system', content: 'You are a helpful assistant that answers questions a user has regarding the key topics from the youtube video they are currently watching. Given the video title, key topics from the video, and the questions, answer to the best of your abilities and be sure to include insightful information about the topics. provide your response only in JSON format, with the following Schema, {"one": "<answer>", "two": "<answer>", "three": "<answer>", "four": "<answer>", "five": "<answer>"}'},
          { role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 1000,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiApiKey}`,
        },
      }
    );

    return JSON.parse(response.data.choices[0].message.content);
  } catch (error) {
    console.error('Error making API request:', error);
    throw error;
  }
};

export default generateChatCompletion;
