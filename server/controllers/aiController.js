const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const aiReview = async (req, res) => {
  const { code, language } = req.body;

  if (!code) return res.status(400).json({ error: "Code is required." });

  try {
    const prompt = `
You are a competitive programming assistant. Analyze the following ${language} code and return any syntax or logical errors, if any.Debug the code properly.
If no issues are found, return 'No issues detected.'\n\nCode:\n${code}
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const feedback = response.text();

    res.json({ success: true, feedback });
  } catch (err) {
    console.error('Gemini API Error:', err.message || err);
    res.status(500).json({ success: false, error: "AI Review failed." });
  }
};

module.exports = { aiReview };
