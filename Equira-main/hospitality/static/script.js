// Back Button Handler - Check for returnUrl parameter
function goBack() {
    const urlParams = new URLSearchParams(window.location.search);
    const returnUrl = urlParams.get('returnUrl');
    
    if (returnUrl) {
        window.location.href = returnUrl;
    } else {
        // Redirect to Our Services page (Main Dashboard)
        window.location.href = 'http://127.0.0.1:5500/index.html';
    }
}

let map;
let markers = [];
let userMarker = null;
let userLat = null;
let userLon = null;

// Initialize Map on Load
document.addEventListener('DOMContentLoaded', () => {
    // Default center: India
    map = L.map('map').setView([20.5937, 78.9629], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
});

// 1. Get GPS Location
function useGPS() {
    const input = document.getElementById('location-input');
    input.placeholder = "Detecting location...";
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                userLat = position.coords.latitude;
                userLon = position.coords.longitude;
                input.value = "GPS Location Detected";
                // Visual feedback
                input.style.borderColor = "#2ecc71";
                alert("Location detected successfully!");
            },
            (error) => {
                console.error(error);
                alert("Unable to retrieve location. Please ensure GPS is enabled.");
                input.placeholder = "Enter Village / Pincode";
            }
        );
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

// 2. Main Search Function
async function findHospitals(queryOverride = null, typeOverride = null) {
    const query = queryOverride || document.getElementById('location-input').value;
    const type = typeOverride || document.getElementById('emergency-type').value;
    const spinner = document.getElementById('loading-spinner');
    const resultsContainer = document.getElementById('results-container');

    // Validation
    if (!query && !userLat) {
        alert("Please enter a location or use the GPS button.");
        return;
    }

    // UI State: Loading
    spinner.classList.remove('hidden');
    resultsContainer.innerHTML = "";

    // Build URL
    let url = `/api/search?type=${type}`;
    if (query === "GPS Location Detected" || (!query && userLat)) {
        url += `&lat=${userLat}&lon=${userLon}`;
    } else {
        url += `&query=${encodeURIComponent(query)}`;
    }

    try {
        const response = await fetch(url);
        const data = await response.json();

        spinner.classList.add('hidden');

        if (!response.ok) {
            throw new Error(data.error || "Server Error");
        }

        renderResults(data);

    } catch (error) {
        spinner.classList.add('hidden');
        resultsContainer.innerHTML = `<div style="text-align:center; color:red; padding:20px;">${error.message}</div>`;
    }
}

// 3. Render Results
function renderResults(data) {
    const container = document.getElementById('results-container');
    
    // Clear old markers
    markers.forEach(m => map.removeLayer(m));
    markers = [];

    // Update Map Center
    const uLat = data.user_location.lat;
    const uLon = data.user_location.lon;
    map.setView([uLat, uLon], 11);
    
    // Add User Marker (Blue)
    if (userMarker) map.removeLayer(userMarker);
    userMarker = L.circleMarker([uLat, uLon], {
        color: 'blue', fillColor: '#30f', fillOpacity: 0.5, radius: 8
    }).addTo(map).bindPopup("Your Location");

    if (data.hospitals.length === 0) {
        container.innerHTML = "<p style='text-align:center; padding:20px;'>No matching hospitals found within 50km.</p>";
        return;
    }

    data.hospitals.forEach(h => {
        // Add Map Marker (Red)
        const marker = L.marker([h.latitude, h.longitude]).addTo(map);
        marker.bindPopup(`<b>${h.name}</b><br>${h.type}`);
        markers.push(marker);

        // Create Card HTML
        const card = document.createElement('div');
        card.className = `hospital-card ${h.emergency_services ? 'emergency' : ''}`;
        
        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${h.latitude},${h.longitude}`;
        
        // Generate Specialties Tags
        const tags = h.specialties ? h.specialties.map(s => `<span style="background:#eee; padding:2px 6px; border-radius:4px; font-size:0.8rem; margin-right:4px;">${s}</span>`).join('') : '';

        card.innerHTML = `
            <div class="card-header">
                <span class="h-name">${h.name}</span>
                <span class="h-dist">${h.distance} km</span>
            </div>
            <div class="h-details">
                <div style="margin-bottom:5px;">${tags}</div>
                <strong>Type:</strong> ${h.type}<br>
                <strong>Address:</strong> ${h.address}<br>
                ${h.emergency_services ? '<strong style="color:#c0392b;">🚑 Emergency Services Available</strong>' : '<span style="color:#7f8c8d;">OPD Only</span>'}
            </div>
            <div class="action-btns">
                <a href="tel:${h.phone}" class="btn-action btn-call"><i class="fas fa-phone"></i> Call</a>
                <a href="${googleMapsUrl}" target="_blank" class="btn-action btn-nav"><i class="fas fa-directions"></i> Navigate</a>
            </div>
        `;
        container.appendChild(card);
    });
}

// 4. Chatbot Logic
function toggleChat() {
    const win = document.getElementById("chatWindow");
    win.style.display = win.style.display === "flex" ? "none" : "flex";
}

function handleChatKey(e) {
    if (e.key === 'Enter') sendChatMessage();
}

function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const msg = input.value.trim().toLowerCase();
    if (!msg) return;

    const chatBox = document.getElementById('chatBody');
    
    // User Message
    chatBox.innerHTML += `<div class="msg user">${input.value}</div>`;
    input.value = "";
    chatBox.scrollTop = chatBox.scrollHeight;

    // Simple Intent Recognition
    let reply = "I can help you find hospitals. Please tell me your location and issue.";
    let type = "all";
    let triggerSearch = false;

    if (msg.includes("pregnant") || msg.includes("delivery") || msg.includes("baby")) {
        type = "pregnancy";
        reply = "Searching for maternity centers near you...";
        triggerSearch = true;
    } else if (msg.includes("snake") || msg.includes("bite")) {
        type = "snake bite";
        reply = "⚠️ Searching for hospitals with anti-venom...";
        triggerSearch = true;
    } else if (msg.includes("accident") || msg.includes("blood") || msg.includes("trauma")) {
        type = "accident";
        reply = "🚨 Finding trauma centers immediately...";
        triggerSearch = true;
    } else if (msg.includes("fever") || msg.includes("cold")) {
        type = "fever";
        reply = "Finding general clinics...";
        triggerSearch = true;
    }

    // Bot Reply Simulation
    setTimeout(() => {
        chatBox.innerHTML += `<div class="msg bot">${reply}</div>`;
        chatBox.scrollTop = chatBox.scrollHeight;
        
        if (triggerSearch) {
            if (userLat) {
                findHospitals(null, type);
            } else {
                chatBox.innerHTML += `<div class="msg bot">I need your location first. Please click 'Use My Location' or enter your village name above.</div>`;
                chatBox.scrollTop = chatBox.scrollHeight;
            }
        }
    }, 600);
}
