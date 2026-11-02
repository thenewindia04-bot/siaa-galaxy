export default async function handler(req, res) {
    // सिर्फ POST रिक्वेस्ट स्वीकार करें
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { prompt } = req.body;
    
    // यह की Vercel के अंदर सुरक्षित एनवायरनमेंट वेरिएबल से आएगी
    const apiKey = process.env.GROQ_API_KEY; 

    if (!apiKey) {
        return res.status(500).json({ error: 'Groq API Key is missing on Vercel server settings.' });
    }

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile', // तेरा वही मॉडल जो लोकल होस्ट पर चला था
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.7
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            return res.status(response.status).json({ error: data.error?.message || 'Groq API connection error' });
        }

        // एआई का जवाब सफलतापूर्व वापस भेजें
        return res.status(200).json({ result: data.choices[0].message.content });
        
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
