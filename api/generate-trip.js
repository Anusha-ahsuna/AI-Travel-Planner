export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is missing in Vercel settings.' });
  }

  const { destination, days, budget, travelType, activity } = req.body;

  try {
    const prompt = `Create a structured travel itinerary for ${destination}. 
    Duration: ${days} days. Budget: ${budget}. Travel type: ${travelType}. Activity style: ${activity}.
    Use Markdown headings like "## Day 1" and "### Morning", bold text for key places, and bullet points.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
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

    const rawMarkdown = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No plan generated.';

     let htmlPlan = rawMarkdown
      .replace(/^### (.*$)/gim, '<h4>$1</h4>')
      .replace(/^## (.*$)/gim, '<h3>$1</h3>')
      .replace(/^# (.*$)/gim, '<h3>$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/^\* (.*$)/gim, '<li>$1</li>')
      .replace(/^- (.*$)/gim, '<li>$1</li>')
      .replace(/\n/g, '<br>');

    return res.status(200).json({ plan: htmlPlan });

  } catch (err) {
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}