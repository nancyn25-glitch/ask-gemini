
import express from "express";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("."));

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

app.post("/ask", async (req, res) => {
    try {
        const question = req.body.question;

console.log("Sending question to Gemini...");

const response = await Promise.race([
    ai.models.generateContent({
        model: "gemini-3.5-flash-lite",
        contents: question
    }),
    new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Gemini request timed out after 30 seconds.")), 30000)
    )
]);

console.log("Gemini response received!");

res.json({
    answer: response.text
});

} 
catch (error) {
    console.log(error);

    res.status(503).json({
        error: "Gemini is busy right now. Please try again in a few minutes."
    });
}

});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

