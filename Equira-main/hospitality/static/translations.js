const translations = {
    en: {
        title: "Rural Health Connect",
        gps: "Use My Location",
        emergency: "Emergency Type:",
        find: "Find Hospitals",
        ai_help: "AI Assistant",
        subtitle: "Connect with rural hospitals instantly",
        or: "OR",
        placeholder: "Enter Village / Pincode",
        footer: "© 2026 Rural Health Connect. Empowering Citizens with Healthcare.",
        options: ["All Services", "Accident / Trauma", "Pregnancy / Delivery", "Snake Bite", "Fever / Infection", "Heart / Cardiac"]
    },
    ta: {
        title: "கிராமப்புற சுகாதார இணைப்பு",
        gps: "என் இருப்பிடம்",
        emergency: "அவசர வகை:",
        find: "மருத்துவமனைகளைத் தேடுங்கள்",
        ai_help: "AI உதவியாளர்",
        subtitle: "கிராமப்புற மருத்துவமனைகளுடன் உடனடியாக இணையுங்கள்",
        or: "அல்லது",
        placeholder: "கிராமம் / அஞ்சல் குறியீட்டை உள்ளிடவும்",
        footer: "© 2026 கிராமப்புற சுகாதார இணைப்பு. சுகாதாரத்துடன் குடிமக்களை மேம்படுத்துதல்.",
        options: ["அனைத்து சேவைகள்", "விபத்து / காயம்", "கர்ப்பம் / பிரசவம்", "பாம்பு கடி", "காய்ச்சல் / தொற்று", "இதயம் / இருதயம்"]
    },
    hi: {
        title: "ग्रामीण स्वास्थ्य सेवा",
        gps: "मेरा स्थान उपयोग करें",
        emergency: "आपातकालीन प्रकार:",
        find: "अस्पताल खोजें",
        ai_help: "AI स्वास्थ्य सहायक",
        subtitle: "ग्रामीण अस्पतालों से तुरंत जुड़ें",
        or: "या",
        placeholder: "गाँव / पिनकोड दर्ज करें",
        footer: "© 2026 ग्रामीण स्वास्थ्य सेवा। नागरिकों को स्वास्थ्य सेवा के साथ सशक्त बनाना।",
        options: ["सभी सेवाएं", "दुर्घटना / आघात", "गर्भावस्था / प्रसव", "सांप का काटना", "बुखार / संक्रमण", "हृदय / कार्डियक"]
    }
};

function changeLanguage() {
    const lang = document.getElementById('language-selector').value;
    const t = translations[lang];

    // Text Content Updates
    document.getElementById('t-title').innerText = t.title;
    document.getElementById('t-gps').innerText = t.gps;
    document.getElementById('t-emergency').innerText = t.emergency;
    document.getElementById('t-find').innerText = t.find;
    document.getElementById('t-ai-help').innerText = t.ai_help;
    document.getElementById('t-subtitle').innerText = t.subtitle;
    document.getElementById('t-or').innerText = t.or;
    document.getElementById('t-footer').innerText = t.footer;

    // Input Placeholder Update
    document.getElementById('location-input').placeholder = t.placeholder;

    // Dropdown Options Update
    const select = document.getElementById('emergency-type');
    if (select && select.options.length === t.options.length) {
        for (let i = 0; i < select.options.length; i++) {
            select.options[i].text = t.options[i];
        }
    }
}
