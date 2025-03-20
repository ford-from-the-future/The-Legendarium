require("dotenv").config();
const axios = require("axios");
const { getGPTResponse } = require("../services/aiService");

const WA_API_KEY = process.env.WA_API_KEY;
const WA_BASE_URL = "https://www.worldanvil.com/api/external/boromir";

exports.getWorldAnvilData = async (req, res) => {
  try {
    const { query } = req.body;

    // 🕵️ Extract key entity (e.g., "Billy the Hero") from the user query
    const entityName = query; // Placeholder, later AI can refine this

    // 🔍 Fetch data from World Anvil (assuming we have a block ID)
    const response = await axios.get(`${WA_BASE_URL}/block/12345`, {
      headers: { Authorization: `Bearer ${WA_API_KEY}` },
    });

    const waData = response.data;

    // 🤖 Process data using GPT-3.5
    const aiResponse = await getGPTResponse(query, waData.content);

    res.json({ answer: aiResponse });
  } catch (error) {
    console.error("❌ Error fetching data:", error.message);
    res.status(500).json({ error: "Failed to fetch data" });
  }
};
