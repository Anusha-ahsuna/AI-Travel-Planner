const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

app.post("/generate-trip", async (req, res) => {

    try {

        const {
            destination,
            days,
            budget,
            travelType,
            activity
        } = req.body;

        if (!destination || !days || !budget) {
            return res.status(400).json({
                error: "Please enter destination, days and budget."
            });
        }

const prompt = `
You are a professional travel planner.

Create a concise and attractive travel itinerary.

Destination: ${destination}
Number of Days: ${days}
Budget: ₹${budget}
Travel Type: ${travelType}
Preferred Activity: ${activity}

Include:

1. Day-wise itinerary
2. Estimated budget
3. Famous places to visit
4. Local foods to try
5. Travel tips

Return HTML structure only.

Use only:
<h3>
<h4>
<p>
<ul>
<li>
<strong>

Do NOT use:
<style>
style=""
color
background
font
CSS
Markdown
code fences
`;
        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: prompt
        });

        console.log("Gemini response received");

        res.json({
            plan: response.text
        });

    } catch (error) {

        console.error("Gemini Error:", error);

        res.status(500).json({
            error: "Failed to generate travel itinerary.",
            details: error.message
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});