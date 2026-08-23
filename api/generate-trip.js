export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not set in Vercel settings.' });
  }

  const { destination, days, budget, travelType, activity } = req.body;

  try {
    const prompt = `Create a detailed ${days}-day travel itinerary for ${destination}. 
    Budget: ${budget}. Travel style: ${travelType}. Activity preference: ${activity}.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'Gemini error' });
    }

    const planText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No plan generated.';
    
    // Format newlines into HTML breaks for easy rendering
    const formattedPlan = planText.replace(/\n/g, '<br>');

    return res.status(200).json({ plan: formattedPlan });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}