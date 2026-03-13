from flask import Flask, render_template, request, jsonify, session
import json
import math
import requests
import os
import re

app = Flask(__name__)
app.secret_key = "equira_secret_key_random_string"

# Configuration
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
HOSPITALS_FILE = os.path.join(BASE_DIR, 'data', 'hospitals.json')
SCHEMES_FILE = os.path.join(BASE_DIR, 'data', 'schemes.json')
NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"

# --- DATA LOADING ---
def load_json(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading {filepath}: {e}")
        return []

hospitals_data = load_json(HOSPITALS_FILE)
schemes_data = load_json(SCHEMES_FILE)

# --- UTILS ---
def haversine_distance(lat1, lon1, lat2, lon2):
    R = 6371.0 # Earth radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

# --- NLP ENGINE ---
class IntentClassifier:
    def get_intent(self, text):
        text = text.lower()
        if any(w in text for w in ['hospital', 'doctor', 'emergency', 'ambulance', 'pain', 'fever', 'clinic', 'hurt', 'medical']):
            return 'healthcare'
        if any(w in text for w in ['scheme', 'yojana', 'loan', 'money', 'fund', 'eligible', 'scholarship', 'pension', 'subsidy']):
            return 'scheme'
        if any(w in text for w in ['hi', 'hello', 'hey', 'start']):
            return 'greeting'
        return 'unknown'

class EligibilityEngine:
    def __init__(self, schemes):
        self.schemes = schemes

    def check_eligibility(self, user_profile):
        eligible = []
        for scheme in self.schemes:
            rules = scheme['rules']
            passed = True
            if 'income_limit' in rules:
                if user_profile.get('income', float('inf')) > rules['income_limit']:
                    passed = False
            if 'occupation' in rules:
                if user_profile.get('occupation', '').lower() not in rules['occupation']:
                    passed = False
            if 'gender' in rules:
                val = user_profile.get('gender', '').lower()
                if val and val not in rules['gender']:
                    passed = False
            if passed:
                eligible.append(scheme)
        return eligible

# --- ROUTES ---

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    user_msg = data.get('message', '')
    
    if 'context' not in session:
        session['context'] = 'general'
        session['user_data'] = {}

    if user_msg.startswith("MY_LOCATION:"):
        parts = user_msg.replace("MY_LOCATION:", "").split(",")
        if len(parts) >= 2:
            lat, lon = float(parts[0]), float(parts[1])
            session['location'] = {'lat': lat, 'lon': lon}
            return jsonify({"response": "I see you are located at coordinates. Finding nearby hospitals...", "action": "search_hospitals"})
    
    classifier = IntentClassifier()
    intent = classifier.get_intent(user_msg)

    if session['context'] == 'collecting_scheme_data':
        user_data = session['user_data']
        if 'age' not in user_data:
            try:
                user_data['age'] = int(re.search(r'\d+', user_msg).group())
                session['user_data'] = user_data
                return jsonify({"response": "Got it. What is your annual family income?"})
            except:
                return jsonify({"response": "Please enter a valid number for your age."})
        elif 'income' not in user_data:
            try:
                nums = re.findall(r'\d+', user_msg.replace(',', ''))
                if nums:
                    user_data['income'] = int(nums[0])
                    session['user_data'] = user_data
                    return jsonify({"response": "Thanks. What is your occupation? (e.g., Farmer, Student, Worker)"})
            except:
                return jsonify({"response": "Please enter your income in numbers (e.g., 50000)."})
        elif 'occupation' not in user_data:
            user_data['occupation'] = user_msg.lower()
            session['user_data'] = user_data
            engine = EligibilityEngine(schemes_data)
            eligible_schemes = engine.check_eligibility(user_data)
            session['context'] = 'general'
            if eligible_schemes:
                resp = "<b>Good news! You are eligible for:</b><br>"
                for s in eligible_schemes:
                    resp += f"✅ <b>{s['name']}</b>: {s['description']}<br>"
            else:
                resp = "Based on your details, I couldn't find a matching scheme right now."
            return jsonify({"response": resp})

    if intent == 'greeting':
        response_text = "Namaste! I am your assistant. Ask me about <b>Government Schemes</b> or <b>Nearby Hospitals</b>."
    elif intent == 'scheme':
        session['context'] = 'collecting_scheme_data'
        session['user_data'] = {}
        response_text = "I can help you check eligibility. First, what is your <b>Age</b>?"
    elif intent == 'healthcare':
        return jsonify({"response": "Finding medical help. Checking your location...", "action": "request_location"})
    else:
        response_text = "I didn't quite catch that. Could you ask about 'Schemes' or 'Hospitals'?"

    # Check for implicit location/healthcare context
    if (session.get('location') and intent == 'healthcare'):
        loc = session.get('location')
        nearby = []
        for h in hospitals_data:
            d = haversine_distance(loc['lat'], loc['lon'], h['latitude'], h['longitude'])
            if d < 50:
                h['distance'] = round(d, 1)
                nearby.append(h)
        nearby.sort(key=lambda x: x['distance'])
        if nearby:
            resp = f"Found {len(nearby)} facilities near you:<br>"
            for h in nearby[:3]:
                resp += f"🏥 <b>{h['name']}</b> ({h['type']})<br>📍 {h['distance']} km away<br>📞 <a href='tel:{h['phone']}'>{h['phone']}</a><br><br>"
        else:
            resp = "No registered hospitals found within 50km."
        return jsonify({"response": resp})

    return jsonify({"response": response_text})

@app.route('/api/search', methods=['GET'])
def search_hospitals():
    try:
        lat = request.args.get('lat', type=float)
        lon = request.args.get('lon', type=float)
        query = request.args.get('query')
        emergency_type = request.args.get('type', 'all')

        user_lat, user_lon = lat, lon

        if not user_lat and query:
            try:
                headers = {'User-Agent': 'RuralHealthConnect/1.0'}
                r = requests.get(NOMINATIM_URL, params={'q': query, 'format': 'json', 'limit': 1}, headers=headers)
                data = r.json()
                if data:
                    user_lat = float(data[0]['lat'])
                    user_lon = float(data[0]['lon'])
            except Exception as e:
                print("Geocoding error:", e)

        if not user_lat:
            return jsonify({"error": "Location not found"}), 400

        results = []
        for h in hospitals_data:
            try:
                if emergency_type != 'all' and emergency_type.lower() != 'all':
                   # Simplified check
                   if emergency_type.lower() not in [s.lower() for s in h.get('specialties', [])]:
                       continue
                
                dist = haversine_distance(user_lat, user_lon, h['latitude'], h['longitude'])
                if dist <= 50:
                    h_copy = h.copy()
                    h_copy['distance'] = round(dist, 1)
                    results.append(h_copy)
            except Exception as e:
                continue
                
        results.sort(key=lambda x: x['distance'])
        return jsonify({
            "user_location": {"lat": user_lat, "lon": user_lon},
            "hospitals": results
        })
    except Exception as e:
        print("Search error:", e)
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)
