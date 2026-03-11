const Groq = require("groq-sdk");
require("dotenv").config();

let groq;
try {
  groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
} catch (e) {
  groq = null;
}

exports.generateCoverLetter = async (req, res, next) => {
  try {
    if (!groq) {
      if (process.env.GROQ_API_KEY) {
        groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
      } else {
         return res.status(500).json({ message: "Groq API Key is not configured in the server." });
      }
    }

    const { jobTitle, companyName, jobDescription, userName } = req.body;

    if (!jobTitle || !companyName) {
      return res.status(400).json({ message: "Job title and company name are required" });
    }

    const prompt = `You are an expert career coach and cover letter writer. 
    Write a professional, compelling, and concise cover letter for ${userName || "a candidate"} applying for the role of ${jobTitle} at ${companyName}.
    Here is the job description:
    ${jobDescription || "Not provided."}
    
    Keep the cover letter under 250 words. Do not include placeholder addresses at the top. 
    Just give me the raw content of the cover letter that I can easily paste. Do not include the words "Cover Letter" as a title. Start directly with the greeting.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a professional assistant that generates high quality cover letters. Return only the cover letter text without markdown wrappers.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.1-8b-instant", 
      temperature: 0.7,
      max_tokens: 1024,
    });

    const coverLetterText = chatCompletion.choices[0]?.message?.content || "";

    res.json({ coverLetter: coverLetterText.trim() });
  } catch (err) {
    console.error("Groq API Error:", err);
    res.status(500).json({ message: "Failed to generate cover letter. Ensure your GROQ_API_KEY is correct." });
  }
};
