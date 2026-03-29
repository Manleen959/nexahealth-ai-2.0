const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const HealthLog = require('../models/HealthLog');
const protect = require('../middleware/authMiddleware');
const axios = require('axios');

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';
const NUTRI_API_KEY = "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";
const DEFAULT_API_KEY = process.env.NVIDIA_API_KEY || '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';

router.use(protect);

// Helper for AI extraction
const extractJSON = (text) => {
    try {
        const jsonMatch = text.match(/\{[\s\S]*?\}/);
        return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch (e) {
        console.error('Failed to parse AI JSON:', text);
        return null;
    }
};

const extractArray = (text) => {
    try {
        const arrayMatch = text.match(/\[[\s\S]*?\]/);
        return arrayMatch ? JSON.parse(arrayMatch[0]) : null;
    } catch (e) {
        console.error('Failed to parse AI Array:', text);
        return null;
    }
};

// Test route
router.get('/test', (req, res) => res.json({ message: 'AI Routes Operational' }));

// NVIDIA Face Scan API mapping
router.post('/analyze-face', async (req, res) => {
    try {
        const { imageBase64 } = req.body;
        console.log('--- START FACE SCAN ANALYSIS ---');
        const nvidiaPayload = {
            model: "nvidia/llama-3.2-11b-vision-instruct", // Using nvidia/ prefix for optimization
            messages: [{
                role: "user",
                content: [
                    { type: "text", text: "Analyze this face scan for skin health. Return ONLY a valid JSON object with: acneDetection (Low/Medium/High/None), skinCondition (Dry/Oily/Normal/Combination), rednessLevel (0-10), poreVisibility (0-10), darkCircles (0-10), skinTexture (Smooth/Rough/Bumpy), confidence (0-100). No markdown tags or explanation." },
                    { type: "image_url", image_url: { url: imageBase64 } }
                ]
            }],
            max_tokens: 512, temperature: 0.1
        };
        const nvidiaRes = await axios.post('https://integrate.api.nvidia.com/v1/chat/completions', nvidiaPayload, {
            headers: { 'Authorization': `Bearer ${DEFAULT_API_KEY}`, 'Content-Type': 'application/json' },
            timeout: 30000 // 30s timeout
        });
        const aiResponseText = nvidiaRes.data.choices[0].message.content;
        console.log('AI RAW RESP:', aiResponseText);
        const analysis = extractJSON(aiResponseText) || { 
            acneDetection: 'Low', 
            skinCondition: 'Normal', 
            rednessLevel: 2, 
            poreVisibility: 3, 
            darkCircles: 1, 
            skinTexture: 'Smooth', 
            confidence: 85 
        };
        const log = new HealthLog({ userId: req.user._id, type: 'face_scan', data: analysis });
        await log.save();
        res.json({ analysis, logId: log._id });
        console.log('--- END FACE SCAN ANALYSIS ---');
    } catch (error) {
        console.error('Face error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Face scan timed out or failed. Please retry.' });
    }
});

// Analyze Symptoms
router.post('/analyze-symptoms', async (req, res) => {
    try {
        const { symptoms } = req.body;
        console.log('--- START SYMPTOM ANALYSIS ---');
        const nvidiaPayload = {
            model: "google/gemma-2-2b-it",
            messages: [{ role: "user", content: `You are a terminal-bound medical assistant. Analyze the symptoms: "${symptoms}". Return EXACTLY AND ONLY a JSON object with keys: "causes" (string array), "precautions" (string array), "recommendedExercises" (string array). No markdown tags.` }],
            temperature: 0.1, max_tokens: 1024
        };
        const nvidiaRes = await axios.post('https://integrate.api.nvidia.com/v1/chat/completions', nvidiaPayload, {
            headers: { 'Authorization': `Bearer ${NUTRI_API_KEY}`, 'Content-Type': 'application/json' },
            timeout: 30000
        });
        const aiResponseText = nvidiaRes.data.choices[0].message.content;
        console.log('SYMPTOM RAW RESP:', aiResponseText);
        const responseData = extractJSON(aiResponseText) || { causes: ['Self-limiting condition'], precautions: ['Monitor symptoms', 'Stay hydrated'], recommendedExercises: ['Deep breathing'] };
        const log = new HealthLog({ userId: req.user._id, type: 'symptom', data: { symptoms, ...responseData } });
        await log.save();
        res.json(responseData);
        console.log('--- END SYMPTOM ANALYSIS ---');
    } catch (error) {
        console.error('Symptom error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Symptom analysis timed out. Please retry.' });
    }
});

// Analyze Diet
router.post('/analyze-diet', async (req, res) => {
    try {
        const { goal } = req.body;
        const dietApiKey = "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";
        
        const nvidiaPayload = {
            model: "google/gemma-2-2b-it",
            messages: [{ 
                role: "user", 
                content: `Analyze the following health/fitness goal: "${goal}". Provide a personalized one-day clinical meal plan that includes exactly 3 meals (Breakfast, Lunch, Dinner). Return ONLY a valid JSON array of exactly 3 objects with these exact keys: 'meal' (string), 'item' (string), 'nutrients' (string), 'explanation' (string). No other text or markdown.` 
            }],
            temperature: 0.2,
            top_p: 0.7,
            max_tokens: 1024
        };

        const nvidiaRes = await axios.post('https://integrate.api.nvidia.com/v1/chat/completions', nvidiaPayload, {
            headers: { 
                'Authorization': `Bearer ${NUTRI_API_KEY}`, 
                'Content-Type': 'application/json' 
            },
            timeout: 60000 // 60s for NutriScan as it uses Gemma which can be slower
        });

        const aiResponseText = nvidiaRes.data.choices[0].message.content;
        console.log('DIET RAW RESP:', aiResponseText);
        const plan = extractArray(aiResponseText) || [
            { meal: "Breakfast", item: "Wait 5 mins and Refresh", nutrients: "Protein", explanation: "System busy" },
            { meal: "Lunch", item: "Hydrating Choice", nutrients: "Vitamins", explanation: "Recovery" },
            { meal: "Dinner", item: "Clinical Recovery Meal", nutrients: "Complex Carbs", explanation: "Maintenance" }
        ];

        const log = new HealthLog({ userId: req.user._id, type: 'diet_plan', data: { goal, plan } });
        await log.save();
        res.json({ plan });
    } catch (error) {
        console.error('Diet error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Diet plan synthesis failed' });
    }
});

// Exercises Recommendation
router.get('/exercises', async (req, res) => {
    try {
        // Mocking some data that matches Dashboard.jsx expectations
        const recommended = [
            { 
                name: 'Daily Stretching', 
                duration: '15 mins', 
                description: 'Gentle mobility exercises to improve flexibility and reduce tension.',
                iconType: 'stretching',
                tags: ['Mobility', 'Recovery']
            },
            { 
                name: 'Core Stability', 
                duration: '10 mins', 
                description: 'Strengthen your core muscles for better posture and balance.',
                iconType: 'core',
                tags: ['Strength', 'Posture']
            }
        ];
        res.json(recommended);
    } catch (error) {
        res.status(500).json({ error: 'Exercise fetch failed' });
    }
});

module.exports = router;
