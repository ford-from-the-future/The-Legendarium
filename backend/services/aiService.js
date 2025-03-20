require("dotenv").config();
const axios = require("axios");

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

exports.getGPTResponse = async (userQuery, worldAnvilData) => {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are an AI assistant that answers worldbuilding questions using World Anvil data." },
          { role: "user", content: `User Question: ${userQuery}` },
          { role: "assistant", content: "Let me check the World Anvil database..." },
          { role: "user", content: `API Data: ${worldAnvilData}` },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("❌ OpenAI API error:", error.message);
    return "I couldn't retrieve that information right now.";
  }
};
