const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const WA_API_TOKEN = process.env.WA_API_TOKEN;
const WA_APPLICATION_KEY = process.env.WA_APPLICATION_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const USER_AGENT = process.env.USER_AGENT;

let articles = [];

// Middleware to parse JSON requests
app.use(express.json());

// Endpoint to fetch the latest articles from World Anvil
app.get('/update-articles', async (req, res) => {
  try {
    const response = await axios.get('https://www.worldanvil.com/api/external/boromir/articles', {
      headers: {
        'x-application-key': WA_APPLICATION_KEY,
        'x-auth-token': WA_API_TOKEN,
        'Content-Type': 'application/json',
        'User-Agent': USER_AGENT
      }
    });

    articles = response.data; // Assuming the API response has the articles in a JSON array
    res.status(200).send('Articles updated successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching articles');
  }
});

// Endpoint to handle ChatGPT questions
app.post('/ask', async (req, res) => {
  const question = req.body.question;

  try {
    // Structuring the prompt to include context from the setting
    const openAIResponse = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
      prompt: `In the world of ${process.env.WORLD_NAME}, ${question}`,
      max_tokens: 100
    }, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const openAIAnswer = openAIResponse.data.choices[0].text.trim();

    // Search for the most relevant article based on the answer
    const relevantArticle = findRelevantArticle(openAIAnswer, articles);

    res.json({ answer: openAIAnswer, article: relevantArticle });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error processing the request');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

function findRelevantArticle(answer, articles) {
  // Implement logic to find the most relevant article based on the answer
  // This is a simple example matching based on article title
  return articles.find(article => answer.includes(article.title)) || null;
}
