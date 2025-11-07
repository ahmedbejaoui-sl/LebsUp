// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/chat", async (req, res) => {
  try {
    const { message, wardrobeItems } = req.body;
    const wardrobeDesc = wardrobeItems.map(i=>`${i.type} (${i.color})`).join(", ") || "empty wardrobe";

    const prompt = `You are LebsUp.AI, a fashion assistant. The user has: ${wardrobeDesc}. Respond to: "${message}" with a short stylish suggestion.`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7
    });

    const reply = response.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Sorry, something went wrong with AI." });
  }
});

app.listen(3000, ()=>console.log("Server running on port 3000"));
