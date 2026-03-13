# 🌿 Equira — Bridging the Gap to Government Welfare & Healthcare

![Status](https://img.shields.io/badge/Status-MVP-brightgreen)
![Frontend](https://img.shields.io/badge/Frontend-HTML%20%2F%20CSS%20%2F%20JS-F7DF1E?logo=javascript&logoColor=black)
![Backend](https://img.shields.io/badge/Backend-Python-3776AB?logo=python&logoColor=white)
![Database](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue)

> Empowering rural and marginalized communities with simple, accessible tools to discover and access government welfare schemes and healthcare services.

---

## 🔍 Overview

Millions of eligible citizens in rural India remain unaware of or unable to access the government welfare schemes and healthcare programs meant for them — due to language barriers, digital illiteracy, bureaucratic complexity, and lack of local information.

**Equira** is a civic-tech platform that bridges this gap. It provides a simple, low-friction interface to:

- Discover welfare schemes relevant to a user's profile
- Find nearby healthcare services and government facilities
- Understand eligibility criteria in plain language
- Connect communities to the resources they deserve

---

## ✨ Features (MVP)

- 🔎 **Scheme Discovery** — Search and filter government welfare schemes by category, state, and eligibility
- 🏥 **Healthcare Locator** — Find nearby PHCs, government hospitals, and health camps
- 👤 **Profile-Based Matching** — Input basic demographics to get relevant scheme recommendations
- 📋 **Plain Language Summaries** — Scheme details simplified for low-literacy users
- 📱 **Mobile-First Design** — Optimized for low-end smartphones and slow networks
- 🌐 **Multilingual Ready** — Architecture supports regional language integration

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Backend | Python (Flask) |
| Database | MongoDB |
| Hosting | TBD |

---

## 📁 Repository Structure
```
equira/
├── frontend/
│   ├── index.html              # Landing page
│   ├── schemes.html            # Scheme discovery page
│   ├── healthcare.html         # Healthcare locator
│   ├── profile.html            # User profile & matching
│   ├── css/
│   │   └── styles.css
│   └── js/
│       └── main.js
├── backend/
│   ├── app.py                  # Flask entry point
│   ├── routes/
│   │   ├── schemes.py          # Scheme API endpoints
│   │   └── healthcare.py       # Healthcare API endpoints
│   ├── models/
│   │   ├── scheme.py           # MongoDB scheme model
│   │   └── user.py             # User profile model
│   └── db.py                   # MongoDB connection
├── data/
│   └── schemes_seed.json       # Initial welfare scheme dataset
├── requirements.txt
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Python 3.8+
- MongoDB (local or Atlas)
- A modern browser

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/equira.git
cd equira

# Install Python dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your MongoDB URI

# Seed the database
python data/seed.py

# Run the backend
python backend/app.py
```

Then open `frontend/index.html` in your browser or serve it via Live Server.

---

## 🌍 Problem Statement

In India alone:

- **~40% of welfare scheme benefits** go unclaimed due to awareness gaps
- Rural communities face significant barriers — language, distance, documentation complexity
- Healthcare access in Tier 3+ towns and villages remains critically underdeveloped

Equira directly targets this last-mile delivery problem by putting scheme and service information into the hands of those who need it most.

---

## 🗺️ Roadmap

- [x] MVP — Scheme discovery + healthcare locator
- [ ] Regional language support (Tamil, Hindi, Telugu)
- [ ] SMS-based access for feature phone users
- [ ] NGO / field worker dashboard for assisted onboarding
- [ ] Integration with DigiLocker for document verification
- [ ] AI-powered eligibility checker (conversational interface)
- [ ] Offline-first PWA for low-connectivity areas

---

## 🤝 Contributing

Contributions are welcome — especially from those with domain knowledge in public policy, rural healthcare, or regional languages.

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add: your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 💡 Inspiration

Equira was built out of a frustration with how inaccessible public services are for the people they're designed to serve. The name *Equira* is rooted in **equity** — equal access to resources regardless of geography, literacy, or socioeconomic background.

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

## 🏷️ Tags

`civic-tech` `govtech` `welfare` `healthcare` `rural-india` `python` `mongodb` `flask` `accessibility` `social-impact`
