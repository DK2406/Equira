const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const twilio = require('twilio');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Load environment variables from config.env
require('dotenv').config({ path: './config.env' });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('MongoDB Connected');
        console.log('Twilio Config Check:');
        console.log(`- Account SID: ${process.env.TWILIO_ACCOUNT_SID ? process.env.TWILIO_ACCOUNT_SID.slice(0, 6) + '...' : 'MISSING'}`);
        console.log(`- Auth Token: ${process.env.TWILIO_AUTH_TOKEN ? 'Loaded (Length: ' + process.env.TWILIO_AUTH_TOKEN.length + ')' : 'MISSING'}`);
    })
    .catch(err => console.error('MongoDB Connection Error:', err));

// Twilio Client
const twilioClient = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const MESSAGING_SERVICE_SID = process.env.MESSAGING_SERVICE_SID;

// --- Schemas & Models ---

// User Schema (for Login)
const userSchema = new mongoose.Schema({
    phone: { type: String, required: true },
    password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

// Eligibility Check Schema (for saving search data)
const eligibilityCheckSchema = new mongoose.Schema({
    age: Number,
    income: Number,
    category: String,
    gender: String,
    maritalStatus: String,
    religion: String,
    isDisabled: Boolean,
    education: String,
    isGovtEmployee: Boolean,
    isFarmer: Boolean,
    timestamp: { type: Date, default: Date.now }
});
const EligibilityCheck = mongoose.model('EligibilityCheck', eligibilityCheckSchema);

// --- Routes ---

app.post('/api/login', async (req, res) => {
    const { phone, password } = req.body;
    try {
        const user = await User.findOne({ phone, password });
        if (user) {
            res.json({ success: true, message: "Login successful" });
        } else {
            res.status(401).json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/register', async (req, res) => {
    const { phone, password } = req.body;
    try {
        const existingUser = await User.findOne({ phone });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }
        const newUser = new User({ phone, password });
        await newUser.save();
        res.json({ success: true, message: "Registration successful" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/save-check', async (req, res) => {
    try {
        const newCheck = new EligibilityCheck(req.body);
        await newCheck.save();
        res.json({ success: true, message: "Data saved successfully" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/send-sms', async (req, res) => {
    const { phone, message } = req.body;
    try {
        await twilioClient.messages.create({
            body: message,
            messagingServiceSid: MESSAGING_SERVICE_SID,
            to: phone.startsWith('+91') ? phone : `+91${phone}`
        });
        res.json({ success: true, message: "SMS sent successfully" });
    } catch (error) {
        console.error("Twilio Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ success: false, error: "Gemini API Key not configured" });
        }
        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();
        res.json({ success: true, reply: text });
    } catch (error) {
        console.error("Gemini Error:", error);
        res.status(500).json({ success: false, error: "Failed to fetch response" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});