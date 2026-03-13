const { useState, useEffect, useRef, createContext, useContext, useMemo, useCallback, memo } = React;

// --- CONTEXT FOR GLOBAL STATE ---
const AppContext = createContext();

const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

// --- CUSTOM HOOKS ---
const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
};

const usePageTransition = () => {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const transitionTo = useCallback((callback) => {
    setIsTransitioning(true);
    setTimeout(() => {
      callback();
      setTimeout(() => setIsTransitioning(false), 50);
    }, 300);
  }, []);

  return { isTransitioning, transitionTo };
};

// --- DATA & CONFIG ---
const translations = {
  en: {
    title: "Login to Equira",
    subtitle: "A Unified Digital Ecosystem for Inclusive Growth",
    phonePH: "Enter Mobile Number (+91)",
    passwordPH: "Enter Password",
    loginBtn: "Login Securely",
    enterDetails: "Enter Your Details",
    age: "Age",
    income: "Annual Family Income (₹)",
    category: "Community",
    gender: "Gender",
    maritalStatus: "Marital Status",
    religion: "Religion",
    isDisabled: "Differently Abled?",
    education: "Education Level",
    state: "State",
    checkBtn: "Check Eligibility",
    resultsTitle: "Your Scheme Results",
    back: "← Go Back",
    eligible: "Eligible",
    notEligible: "Not Eligible",
    link: "Apply Now",
    registerTitle: "Register New User",
    registerBtn: "Register",
    noAccount: "New User? Register Here",
    haveAccount: "Already have an account? Login",
    smsBtn: "Send SMS",
    smsSent: "SMS Sent!",
    schemesTab: "Schemes",
    coursesTab: "Courses",
    male: "Male",
    female: "Female",
    other: "Other",
    single: "Single",
    married: "Married",
    widowed: "Widowed",
    divorced: "Divorced",
    yes: "Yes",
    no: "No",
    eduOptions: {
      below10: "Below 10th",
      pass10: "10th Pass",
      pass12: "12th Pass",
      ug: "Undergraduate",
      pg: "Masters Degree",
      phd: "Doctoral",
    },
    isGovt: "Government Employee?",
    isFarmer: "Are you a Farmer?",
    dashboardTitle: "Our Services",
    logout: "Logout",
    backToDash: "Back to Dashboard",
    myGovDesc:
      "Find government schemes you are eligible for based on your profile. Includes poverty alleviation, education, and agriculture support.",
    healthDesc:
      "Locate nearby hospitals, clinics, and emergency services. Find help for accidents, pregnancy, and general health issues.",
    filterAll: "All",
    filterHealth: "Health",
    filterEmp: "Employment",
    filterFin: "Financial",
  },
  hi: {
    title: "सरकारी सेवा में लॉग इन करें",
    subtitle: "सरकारी योजनाओं के लिए अपनी पात्रता जाँचें",
    phonePH: "मोबाइल नंबर दर्ज करें (+91)",
    passwordPH: "पासवर्ड दर्ज करें",
    loginBtn: "लॉग इन करें",
    enterDetails: "अपना विवरण दर्ज करें",
    age: "आयु",
    income: "वार्षिक पारिवारिक आय (₹)",
    category: "समुदाय",
    gender: "लिंग",
    maritalStatus: "वैवाहिक स्थिति",
    religion: "धर्म",
    isDisabled: "दिव्यांग?",
    education: "शिक्षा स्तर",
    state: "राज्य",
    checkBtn: "पात्रता जाँचें",
    resultsTitle: "आपकी योजना परिणाम",
    back: "← वापस",
    eligible: "पात्र हैं",
    notEligible: "पात्र नहीं",
    link: "आवेदन करें",
    registerTitle: "नया उपयोगकर्ता पंजीकरण",
    registerBtn: "पंजीकरण करें",
    noAccount: "नया उपयोगकर्ता? यहाँ रजिस्टर करें",
    haveAccount: "क्या आपके पास पहले से एक खाता मौजूद है? लॉग इन करें",
    smsBtn: "एसएमएस भेजें",
    smsSent: "एसएमएस भेजा गया!",
    schemesTab: "योजनाएं",
    coursesTab: "पाठ्यक्रम",
    male: "पुरुष",
    female: "महिला",
    other: "अन्य",
    single: "अविवाहित",
    married: "विवाहित",
    widowed: "विधवा",
    divorced: "तलाकशुदा",
    yes: "हाँ",
    no: "नहीं",
    eduOptions: {
      below10: "10वीं से नीचे",
      pass10: "10वीं पास",
      pass12: "12वीं पास",
      ug: "स्नातक",
      pg: "स्नातकोत्तर",
      phd: "डॉक्टरेट",
    },
    isGovt: "क्या आप सरकारी कर्मचारी हैं?",
    isFarmer: "क्या आप किसान हैं?",
    dashboardTitle: "हमारी सेवाएँ",
    logout: "लॉग आउट",
    backToDash: "डैशबोर्ड पर वापस",
    myGovDesc:
      "अपनी प्रोफ़ाइल के आधार पर सरकारी योजनाएं खोजें। इसमें गरीबी उन्मूलन, शिक्षा और कृषि सहायता शामिल है।",
    healthDesc:
      "आसपास के अस्पताल, क्लीनिक और आपातकालीन सेवाएं खोजें। दुर्घटनाओं, गर्भावस्था और सामान्य स्वास्थ्य समस्याओं के लिए मदद पाएं।",
    filterAll: "सभी",
    filterHealth: "स्वास्थ्य",
    filterEmp: "रोजगार",
    filterFin: "वित्तीय",
  },
  ta: {
    title: "Equira உள்நுழைய",
    subtitle: "ஒருங்கிணைந்த டிஜிட்டல் சூழல் மூலம் உள்ளடக்க வளர்ச்சிக்கான",
    phonePH: "மொபைல் எண் (+91)",
    passwordPH: "கடவுச்சொல்லை உள்ளிடவும்",
    loginBtn: "உள்நுழைய",
    enterDetails: "உங்கள் விவரங்களை உள்ளிடவும்",
    age: "வயது",
    income: "ஆண்டு வருமானம் (₹)",
    category: "சமூகம்",
    gender: "பாலினம்",
    maritalStatus: "திருமண நிலை",
    religion: "மதம்",
    isDisabled: "மாற்றுத்திறனாளியா?",
    education: "கல்வி தகுதி",
    state: "மாநிலம்",
    checkBtn: "தகுதியை சரிபார்க்கவும்",
    resultsTitle: "உங்கள் முடிவுகள்",
    back: "← பின் செல்ல",
    eligible: "தகுதியுடையவர்",
    notEligible: "தகுதியற்றவர்",
    link: "விண்ணப்பிக்க",
    registerTitle: "புதிய பயனர் பதிவு",
    registerBtn: "பதிவு",
    noAccount: "புதிய பயனரா? இங்கே பதிவு செய்யுங்கள்",
    haveAccount: "ஏற்கனவே கணக்கு உள்ளதா? உள்நுழைய",
    smsBtn: "SMS அனுப்பு",
    smsSent: "SMS அனுப்பப்பட்டது!",
    schemesTab: "திட்டங்கள்",
    coursesTab: "பாடநெறிகள்",
    male: "ஆண்",
    female: "பெண்",
    other: "மற்றவை",
    single: "திருமணமாகாதவர்",
    married: "திருமணமானவர்",
    widowed: "விதவை",
    divorced: "விவாகரத்து",
    yes: "ஆம்",
    no: "இல்லை",
    eduOptions: {
      below10: "10 ஆம் வகுப்புக்கு கீழே",
      pass10: "10 ஆம் வகுப்பு தேர்ச்சி",
      pass12: "12 ஆம் வகுப்பு தேர்ச்சி",
      ug: "இளங்கலை",
      pg: "முதுகலை",
      phd: "டாக்டர் பட்டம்",
    },
    isGovt: "அரசு ஊழியரா?",
    isFarmer: "விவசாயியா?",
    dashboardTitle: "எங்கள் சேவைகள்",
    logout: "வெளியேறு",
    backToDash: "முகப்பு பலகைக்கு திரும்பு",
    myGovDesc:
      "உங்கள் சுயவிவரத்தின் அடிப்படையில் தகுதியான அரசு திட்டங்களைக் கண்டறியவும். வறுமை ஒழிப்பு, கல்வி மற்றும் விவசாய ஆதரவு ஆகியவை அடங்கும்.",
    healthDesc:
      "அருகிலுள்ள மருத்துவமனைகள், கிளினிக்குகள் மற்றும் அவசர சேவைகளைக் கண்டறியவும். விபத்துக்கள், கர்ப்பம் மற்றும் பொதுவான சுகாதார பிரச்சினைகளுக்கு உதவி பெறவும்.",
    filterAll: "அனைத்தும்",
    filterHealth: "சுகாதாரம்",
    filterEmp: "வேலைவாய்ப்பு",
    filterFin: "நிதி",
  },
};

const schemes = [
  {
    id: 1,
    category: "Financial",
    name: "PM Kisan Samman Nidhi",
    desc: "Rs 6000/year for farmers.",
    link: "https://pmkisan.gov.in",
    rules: {
      minAge: 18,
      maxIncome: 500000,
      cats: ["General", "OBC", "SC", "ST"],
      mustBeFarmer: true,
      excludeGovt: true,
    },
  },
  {
    id: 2,
    category: "Financial",
    name: "Post Matric Scholarship (SC)",
    desc: "Education aid for SC students.",
    link: "https://socialjustice.gov.in",
    rules: { minAge: 16, maxIncome: 250000, cats: ["SC", "ST"] },
  },
  {
    id: 3,
    category: "Employment",
    name: "UPSC Civil Services",
    desc: "National Competitive Exam.",
    link: "https://upsc.gov.in",
    rules: {
      minAge: 21,
      maxIncome: 100000000,
      cats: ["General", "OBC", "SC", "ST"],
      minEdu: "ug",
    },
  },
  {
    id: 4,
    category: "Financial",
    name: "Kalaignar Magalir Urimai Thogai",
    desc: "₹1000/month for women heads of households.",
    link: "https://kmut.tn.gov.in",
    rules: {
      minAge: 21,
      maxIncome: 250000,
      cats: ["General", "OBC", "SC", "ST"],
      gender: "Female",
      excludeGovt: true,
    },
  },
  {
    id: 5,
    category: "Financial",
    name: "Pudhumai Penn Scheme",
    desc: "₹1000/month for girl students from govt schools.",
    link: "https://www.pudhumaipenn.tn.gov.in",
    rules: {
      minAge: 17,
      maxIncome: 100000000,
      cats: ["General", "OBC", "SC", "ST"],
      gender: "Female",
      excludeGovt: true,
    },
  },
  {
    id: 6,
    category: "Health",
    name: "TN Chief Minister's Health Insurance",
    desc: "Free medical treatment up to ₹5 Lakhs.",
    link: "https://www.cmchistn.com",
    rules: {
      minAge: 0,
      maxIncome: 120000,
      cats: ["General", "OBC", "SC", "ST"],
      excludeGovt: true,
    },
  },
  {
    id: 7,
    category: "Health",
    name: "Dr. Muthulakshmi Reddy Maternity Benefit",
    desc: "Financial assistance of ₹18,000 for pregnant women.",
    link: "https://picme.tn.gov.in",
    rules: {
      minAge: 19,
      maxIncome: 100000,
      cats: ["General", "OBC", "SC", "ST"],
      gender: "Female",
    },
  },
  {
    id: 8,
    category: "Financial",
    name: "TN Old Age Pension Scheme",
    desc: "Monthly pension of ₹1000 for senior citizens.",
    link: "https://tnega.tn.gov.in",
    rules: {
      minAge: 60,
      maxIncome: 50000,
      cats: ["General", "OBC", "SC", "ST"],
      excludeGovt: true,
    },
  },
  {
    id: 9,
    category: "Financial",
    name: "Differently Abled Pension Scheme",
    desc: "Monthly assistance for differently abled persons.",
    link: "https://scd.tn.gov.in",
    rules: {
      minAge: 0,
      maxIncome: 100000000,
      cats: ["General", "OBC", "SC", "ST"],
      isDisabled: true,
    },
  },
  {
    id: 10,
    category: "Employment",
    name: "Unemployment Assistance Scheme",
    desc: "Financial aid for unemployed youth waiting for jobs.",
    link: "https://tnvelaivaaippu.gov.in",
    rules: {
      minAge: 18,
      maxIncome: 200000,
      cats: ["General", "OBC", "SC", "ST"],
      excludeGovt: true,
    },
  },
  {
    id: 11,
    category: "Financial",
    name: "Widow Pension Scheme",
    desc: "Financial support for destitute widows.",
    link: "https://tnega.tn.gov.in",
    rules: {
      minAge: 18,
      maxIncome: 100000,
      cats: ["General", "OBC", "SC", "ST"],
      gender: "Female",
      maritalStatus: "Widowed",
      excludeGovt: true,
    },
  },
  {
    id: 12,
    category: "Financial",
    name: "EVR Maniammaiyar Ninaivu Marriage Assistance",
    desc: "Financial aid for daughter's marriage of poor widows.",
    link: "https://tnsocialwelfare.tn.gov.in",
    rules: {
      minAge: 18,
      maxIncome: 72000,
      cats: ["General", "OBC", "SC", "ST"],
      gender: "Female",
      maritalStatus: "Single",
    },
  },
  {
    id: 13,
    category: "Financial",
    name: "Chief Minister's Girl Child Protection",
    desc: "Fixed deposit for girl children to ensure education.",
    link: "https://tnsocialwelfare.tn.gov.in",
    rules: {
      minAge: 0,
      maxIncome: 72000,
      cats: ["General", "OBC", "SC", "ST"],
      gender: "Female",
    },
  },
  {
    id: 14,
    category: "Financial",
    name: "Free Laptop Scheme",
    desc: "Free laptops for students in Govt/Aided schools.",
    link: "https://www.tn.gov.in",
    rules: {
      minAge: 14,
      maxIncome: 100000000,
      cats: ["General", "OBC", "SC", "ST"],
      minEdu: "pass10",
    },
  },
  {
    id: 15,
    category: "Employment",
    name: "Naan Mudhalvan Scheme",
    desc: "Skill development and career guidance for youth.",
    link: "https://www.naanmudhalvan.tn.gov.in",
    rules: {
      minAge: 17,
      maxIncome: 100000000,
      cats: ["General", "OBC", "SC", "ST"],
    },
  },
  {
    id: 16,
    category: "Employment",
    name: "TAHDCO Economic Development",
    desc: "Loans and subsidies for SC/ST entrepreneurs.",
    link: "http://tahdco.tn.gov.in",
    rules: { minAge: 18, maxIncome: 300000, cats: ["SC", "ST"] },
  },
  {
    id: 17,
    category: "Employment",
    name: "UYEGP Loan Scheme",
    desc: "Loan subsidy for unemployed youth to start business.",
    link: "https://msmeonline.tn.gov.in",
    rules: {
      minAge: 18,
      maxIncome: 500000,
      cats: ["General", "OBC", "SC", "ST"],
    },
  },
  {
    id: 18,
    category: "Employment",
    name: "NEEDS Scheme",
    desc: "Entrepreneurship scheme for educated youth.",
    link: "https://msmeonline.tn.gov.in",
    rules: {
      minAge: 21,
      maxIncome: 100000000,
      cats: ["General", "OBC", "SC", "ST"],
      minEdu: "ug",
    },
  },
  {
    id: 19,
    category: "Financial",
    name: "Green House Scheme (Pasumai Veedu)",
    desc: "Construction of solar-powered green houses.",
    link: "https://tnrd.gov.in",
    rules: {
      minAge: 21,
      maxIncome: 300000,
      cats: ["General", "OBC", "SC", "ST"],
    },
  },
  {
    id: 20,
    category: "Financial",
    name: "TN Farmers Social Security Scheme",
    desc: "Pension and accident relief for farmers.",
    link: "https://www.tn.gov.in",
    rules: {
      minAge: 18,
      maxIncome: 100000,
      cats: ["General", "OBC", "SC", "ST"],
      mustBeFarmer: true,
    },
  },
  {
    id: 21,
    category: "Financial",
    name: "Destitute Deserted Wives Pension",
    desc: "Pension for wives deserted by husbands.",
    link: "https://tnega.tn.gov.in",
    rules: {
      minAge: 30,
      maxIncome: 100000,
      cats: ["General", "OBC", "SC", "ST"],
      gender: "Female",
      maritalStatus: "Divorced",
      excludeGovt: true,
    },
  },
  {
    id: 22,
    category: "Financial",
    name: "Inter-caste Marriage Assistance",
    desc: "Incentive for inter-caste marriages.",
    link: "https://tnsocialwelfare.tn.gov.in",
    rules: {
      minAge: 18,
      maxIncome: 100000000,
      cats: ["General", "OBC", "SC", "ST"],
      maritalStatus: "Married",
    },
  },
  {
    id: 23,
    category: "Employment",
    name: "Satyavani Muthu Free Sewing Machine",
    desc: "Free sewing machines for widows and poor women.",
    link: "https://tnsocialwelfare.tn.gov.in",
    rules: {
      minAge: 20,
      maxIncome: 72000,
      cats: ["General", "OBC", "SC", "ST"],
      gender: "Female",
    },
  },
  {
    id: 24,
    category: "Financial",
    name: "Vidiyal Payanam (Free Bus Travel)",
    desc: "Free travel for women in ordinary town buses.",
    link: "https://transport.tn.gov.in",
    rules: {
      minAge: 5,
      maxIncome: 100000000,
      cats: ["General", "OBC", "SC", "ST"],
      gender: "Female",
    },
  },
  {
    id: 25,
    category: "Employment",
    name: "TN Urban Employment Scheme",
    desc: "Employment opportunities for urban poor.",
    link: "https://tn.gov.in",
    rules: {
      minAge: 18,
      maxIncome: 200000,
      cats: ["General", "OBC", "SC", "ST"],
      excludeGovt: true,
    },
  },
  {
    id: 26,
    category: "Health",
    name: "Sanitary Napkin Scheme",
    desc: "Free sanitary napkins for adolescent girls.",
    link: "https://www.tn.gov.in",
    rules: {
      minAge: 10,
      maxIncome: 100000000,
      cats: ["General", "OBC", "SC", "ST"],
      gender: "Female",
    },
  },
  {
    id: 27,
    category: "Health",
    name: "Nutritious Meal Scheme",
    desc: "Free noon meals for school children.",
    link: "https://www.tn.gov.in",
    rules: {
      minAge: 5,
      maxIncome: 100000000,
      cats: ["General", "OBC", "SC", "ST"],
    },
  },
  {
    id: 28,
    category: "Financial",
    name: "Free Bus Pass for Students",
    desc: "Free travel for school and college students.",
    link: "https://www.tn.gov.in",
    rules: {
      minAge: 5,
      maxIncome: 100000000,
      cats: ["General", "OBC", "SC", "ST"],
    },
  },
  {
    id: 29,
    category: "Employment",
    name: "Textile Entrepreneurship Scheme",
    desc: "Support for powerloom and textile entrepreneurs.",
    link: "https://www.tn.gov.in",
    rules: {
      minAge: 21,
      maxIncome: 100000000,
      cats: ["General", "OBC", "SC", "ST"],
    },
  },
  {
    id: 30,
    category: "Employment",
    name: "Uzhavar Sandhai",
    desc: "Direct market access for farmers.",
    link: "https://agritech.tnau.ac.in",
    rules: {
      minAge: 18,
      maxIncome: 100000000,
      cats: ["General", "OBC", "SC", "ST"],
      mustBeFarmer: true,
    },
  },
  {
    id: 31,
    category: "Financial",
    name: "Illam Thedi Kalvi",
    desc: "Education at doorstep for children.",
    link: "https://illamthedikalvi.tnschools.gov.in",
    rules: {
      minAge: 5,
      maxIncome: 100000000,
      cats: ["General", "OBC", "SC", "ST"],
    },
  },
  {
    id: 32,
    category: "Health",
    name: "Makkalai Thedi Maruthuvam",
    desc: "Healthcare services at doorstep.",
    link: "https://tn.gov.in",
    rules: {
      minAge: 45,
      maxIncome: 100000000,
      cats: ["General", "OBC", "SC", "ST"],
    },
  },
];

const courses = [
  {
    id: 101,
    name: "PMKVY Skill Training",
    desc: "Free industry skill training & certification.",
    link: "https://www.pmkvyofficial.org",
    rules: {
      minAge: 15,
      maxIncome: 100000000,
      cats: ["General", "OBC", "SC", "ST"],
      excludeGovt: true,
    },
  },
  {
    id: 102,
    name: "NPTEL Online Courses",
    desc: "Free IIT/IISc certification courses.",
    link: "https://nptel.ac.in",
    rules: {
      minAge: 13,
      maxIncome: 100000000,
      cats: ["General", "OBC", "SC", "ST"],
      minEdu: "pass12",
    },
  },
  {
    id: 103,
    name: "Swayam Learning",
    desc: "Free online courses by Govt of India.",
    link: "https://swayam.gov.in",
    rules: {
      minAge: 10,
      maxIncome: 100000000,
      cats: ["General", "OBC", "SC", "ST"],
      excludeGovt: true,
    },
  },
  {
    id: 104,
    name: "TNSDC Skill Training",
    desc: "Free skill training by TN Govt.",
    link: "https://www.tnskill.tn.gov.in",
    rules: {
      minAge: 18,
      maxIncome: 100000000,
      cats: ["General", "OBC", "SC", "ST"],
    },
  },
  {
    id: 105,
    name: "IBM SkillsBuild",
    desc: "Free digital learning platform by IBM.",
    link: "https://skillsbuild.org",
    rules: {
      minAge: 13,
      maxIncome: 100000000,
      cats: ["General", "OBC", "SC", "ST"],
    },
  },
  {
    id: 106,
    name: "Google Digital Unlocked",
    desc: "Free digital marketing courses by Google.",
    link: "https://learndigital.withgoogle.com",
    rules: {
      minAge: 15,
      maxIncome: 100000000,
      cats: ["General", "OBC", "SC", "ST"],
    },
  },
  {
    id: 107,
    name: "Microsoft Learn",
    desc: "Free technical documentation and training.",
    link: "https://learn.microsoft.com",
    rules: {
      minAge: 13,
      maxIncome: 100000000,
      cats: ["General", "OBC", "SC", "ST"],
    },
  },
  {
    id: 108,
    name: "Infosys Springboard",
    desc: "Corporate grade learning for students.",
    link: "https://infyspringboard.onwingspan.com",
    rules: {
      minAge: 10,
      maxIncome: 100000000,
      cats: ["General", "OBC", "SC", "ST"],
    },
  },
  {
    id: 109,
    name: "TCS iON Career Edge",
    desc: "Free career preparedness course.",
    link: "https://learning.tcsion.com",
    rules: {
      minAge: 18,
      maxIncome: 100000000,
      cats: ["General", "OBC", "SC", "ST"],
    },
  },
  {
    id: 110,
    name: "Udemy Free Courses",
    desc: "Various free courses on programming & business.",
    link: "https://www.udemy.com/courses/free/",
    rules: {
      minAge: 13,
      maxIncome: 100000000,
      cats: ["General", "OBC", "SC", "ST"],
    },
  },
  {
    id: 111,
    name: "Great Learning Academy",
    desc: "Free certificate courses in Data Science & AI.",
    link: "https://www.mygreatlearning.com/academy",
    rules: {
      minAge: 16,
      maxIncome: 100000000,
      cats: ["General", "OBC", "SC", "ST"],
    },
  },
  {
    id: 112,
    name: "Simplilearn SkillUp",
    desc: "Free online courses to boost your career.",
    link: "https://www.simplilearn.com/skillup-free-online-courses",
    rules: {
      minAge: 18,
      maxIncome: 100000000,
      cats: ["General", "OBC", "SC", "ST"],
    },
  },
  {
    id: 113,
    name: "FreeCodeCamp",
    desc: "Learn to code for free.",
    link: "https://www.freecodecamp.org",
    rules: {
      minAge: 12,
      maxIncome: 100000000,
      cats: ["General", "OBC", "SC", "ST"],
    },
  },
];

// --- BACKEND CONFIGURATION ---
const API_URL = "http://localhost:5000/api";

// --- HELPER FUNCTIONS ---
function checkLogic(scheme, userDetails) {
  // Education Level Hierarchy
  const eduMap = {
    below10: 0,
    pass10: 1,
    pass12: 2,
    ug: 3,
    pg: 4,
    phd: 5,
  };

  const ageOk = userDetails.age >= scheme.rules.minAge;
  const incomeOk = userDetails.income <= scheme.rules.maxIncome;
  const catOk = scheme.rules.cats.includes(userDetails.category);

  // New Logic Checks
  const genderOk =
    !scheme.rules.gender || scheme.rules.gender === userDetails.gender;
  const maritalOk =
    !scheme.rules.maritalStatus ||
    scheme.rules.maritalStatus === userDetails.maritalStatus;
  const disabledOk =
    scheme.rules.isDisabled === undefined ||
    scheme.rules.isDisabled === userDetails.isDisabled;

  // Education Check
  const userEduLevel = eduMap[userDetails.education] || 0;
  const schemeEduLevel = eduMap[scheme.rules.minEdu] || 0; // Default to 0 (below10) if not specified
  const eduOk = userEduLevel >= schemeEduLevel;

  const farmerOk = !scheme.rules.mustBeFarmer || userDetails.isFarmer;
  const govtOk = !scheme.rules.excludeGovt || !userDetails.isGovtEmployee;

  return Boolean(
    ageOk &&
    incomeOk &&
    catOk &&
    genderOk &&
    maritalOk &&
    disabledOk &&
    eduOk &&
    farmerOk &&
    govtOk
  ); 
}

// --- BACKEND INTEGRATION ---
async function validateCredentials(phone, password) {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone, password }),
    });

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error("Backend connection failed:", error);
    throw error; // Let the caller handle the fallback
  }
}

async function saveSearchData(details) {
  try {
    await fetch(`${API_URL}/save-check`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(details),
    });
  } catch (err) {
    console.error("Failed to save data to Atlas", err);
  }
}

async function sendSMS(phone, message) {
  try {
    await fetch(`${API_URL}/send-sms`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, message }),
    });
    console.log("SMS Request Sent");
  } catch (err) {
    console.error("Failed to send SMS", err);
  }
}

// --- COMPONENTS ---

const Header = memo(({ currentPage, setPage, currentLang, setLang, t }) => {
  const logoText = useMemo(() => 
    (currentPage === "input" || currentPage === "results") ? "MyGovGuide" : "Equira",
    [currentPage]
  );
  
  return (
    <header>
      <a href="#" className="logo" onClick={(e) => { e.preventDefault(); if(currentPage !== 'login') setPage('dashboard'); }}>
        <i className="fas fa-landmark"></i> {logoText}
      </a>
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        {currentPage === 'login' || currentPage === 'register' ? (
           <button
           className="btn"
           style={{ width: "auto", padding: "0.5rem 1.25rem", fontSize: "0.9rem" }}
           onClick={() => setPage('login')}
         >
           Login / Register
         </button>
        ) : null}
       
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.9rem" }}>
          <i className="fas fa-globe text-secondary"></i>
          <select value={currentLang} onChange={(e) => setLang(e.target.value)}>
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
            <option value="ta">தமிழ்</option>
          </select>
        </div>
      </div>
    </header>
  );
});

const Footer = memo(() => (
  <footer>
    <p>&copy; 2026 Equira - A Unified Digital Ecosystem for Inclusive Growth. All rights reserved.</p>
  </footer>
));

const Chatbot = memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ text: "Hi There! How may I help you?", sender: "bot" }]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatBodyRef = useRef(null);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, isTyping, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { text: userMsg, sender: "user" }]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });

      if (!response.ok) throw new Error("Server error");
      const data = await response.json();
      
      if (data.success) {
        setMessages(prev => [...prev, { text: data.reply, sender: "bot" }]);
      } else {
        setMessages(prev => [...prev, { text: "Error: " + (data.error || "Unknown"), sender: "bot" }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { text: "Sorry, I couldn't connect to the server.", sender: "bot" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <button className="chat-btn" onClick={() => setIsOpen(!isOpen)}>
        <i className="fas fa-comment-dots"></i>
      </button>
      <div className="chat-window" id="chatWindow" style={{ display: isOpen ? 'flex' : 'none' }}>
        <div className="chat-header">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <i className="fas fa-robot"></i>
            <span>AI Assistant</span>
          </div>
          <button onClick={() => setIsOpen(false)} style={{ background: "none", border: "none", color: "white", cursor: "pointer", fontSize: "1.1rem" }}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="chat-body" ref={chatBodyRef}>
          {messages.map((msg, idx) => (
            <div key={idx} className={`msg ${msg.sender}`}>{msg.text}</div>
          ))}
          {isTyping && <div className="msg bot">Typing...</div>}
        </div>
        <div className="chat-input">
          <input 
            type="text" 
            placeholder="Type here..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button onClick={handleSend}><i className="fas fa-paper-plane"></i></button>
        </div>
      </div>
    </>
  );
});

const Login = memo(({ setPage, setUserPhone, t }) => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const isValid = await validateCredentials(phone, password);
      if (isValid) {
        setUserPhone(phone);
        setPage("dashboard");
      } else {
        setError("Invalid Credentials. Please try again.");
      }
    } catch (err) {
      setError("Connection error. Please check your internet.");
    } finally {
      setLoading(false);
    }
  }, [phone, password, setUserPhone, setPage]);

  return (
    <div className="card" style={{ maxWidth: "500px" }}>
      <div style={{ fontSize: "2.5rem", marginBottom: "0rem", display: "flex", justifyContent: "center" }}>🦁</div>
      <h2 style={{ marginBottom: "0.5rem" }}>{t.title}</h2>
      <p style={{ color: "var(--text-secondary)", marginBottom: "2rem", fontSize: "0.95rem" }}>{t.subtitle}</p>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500, color: "var(--text-primary)" }}>Phone Number</label>
          <input type="text" value={phone} onChange={e => setPhone(e.target.value)} placeholder={t.phonePH} required minLength="10" maxLength="10" pattern="[0-9]+" style={{ width: "100%", padding: "0.875rem 1rem", border: "2px solid var(--border-color)", borderRadius: "8px", fontSize: "1rem" }} />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500, color: "var(--text-primary)" }}>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder={t.passwordPH} required style={{ width: "100%", padding: "0.875rem 1rem", border: "2px solid var(--border-color)", borderRadius: "8px", fontSize: "1rem" }} />
        </div>
        {error && <div style={{ color: "#ef4444", fontSize: "0.875rem", marginTop: "0.5rem", padding: "0.75rem", backgroundColor: "#fee2e2", borderRadius: "8px", border: "1px solid #fecaca" }}>{error}</div>}
        <button type="submit" className="btn" disabled={loading} style={{ width: "100%", marginTop: "1rem" }}>{loading ? "Validating..." : t.loginBtn}</button>
      </form>
      <p style={{ marginTop: "1.5rem", textAlign: "center", color: "var(--text-secondary)" }}>
        {t.noAccount} <a href="#" onClick={(e) => { e.preventDefault(); setPage("register"); }} style={{ color: "var(--primary-color)", textDecoration: "none", fontWeight: 600 }}>here</a>
      </p>
    </div>
  );
});

const Register = memo(({ setPage, setUserPhone, t }) => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password }),
      });
      const data = await response.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => setPage("login"), 2000);
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [phone, password, setPage]);

  return (
    <div className="card" style={{ maxWidth: "500px" }}>
      <div style={{ fontSize: "3.5rem", marginBottom: "1.5rem", display: "flex", justifyContent: "center" }}>📝</div>
      <h2 style={{ marginBottom: "0.5rem" }}>{t.registerTitle}</h2>
      <p style={{ color: "var(--text-secondary)", marginBottom: "2rem", fontSize: "0.95rem" }}>Create your account to get started</p>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500, color: "var(--text-primary)" }}>Phone Number</label>
          <input type="text" value={phone} onChange={e => setPhone(e.target.value)} placeholder={t.phonePH} required minLength="10" maxLength="10" pattern="[0-9]+" style={{ width: "100%", padding: "0.875rem 1rem", border: "2px solid var(--border-color)", borderRadius: "8px", fontSize: "1rem" }} />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500, color: "var(--text-primary)" }}>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder={t.passwordPH} required style={{ width: "100%", padding: "0.875rem 1rem", border: "2px solid var(--border-color)", borderRadius: "8px", fontSize: "1rem" }} />
        </div>
        {error && <div style={{ color: "#ef4444", fontSize: "0.875rem", marginTop: "0.5rem", padding: "0.75rem", backgroundColor: "#fee2e2", borderRadius: "8px", border: "1px solid #fecaca" }}>{error}</div>}
        {success && <div style={{ color: "#22c55e", fontSize: "0.875rem", marginTop: "0.5rem", padding: "0.75rem", backgroundColor: "#dcfce7", borderRadius: "8px", border: "1px solid #bbf7d0" }}>✓ Registration Successful! Redirecting...</div>}
        <button type="submit" className="btn" disabled={loading || success} style={{ width: "100%", marginTop: "1rem" }}>{loading ? "Registering..." : t.registerBtn}</button>
      </form>
      <p style={{ marginTop: "1.5rem", textAlign: "center", color: "var(--text-secondary)" }}>
        {t.haveAccount} <a href="#" onClick={(e) => { e.preventDefault(); setPage("login"); }} style={{ color: "var(--primary-color)", textDecoration: "none", fontWeight: 600 }}>here</a>
      </p>
    </div>
  );
});

const Dashboard = memo(({ setPage, t }) => (
  <div className="card">
    <div style={{ textAlign: "left", marginBottom: "10px" }}>
      <button className="btn btn-text" onClick={() => setPage("login")} style={{ width: "auto", padding: 0 }}>← {t.logout}</button>
    </div>
    <h2>{t.dashboardTitle}</h2>
    <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
      <div style={{ flex: 1 }}>
        <button className="btn" style={{ backgroundColor: "#6a7880" }} onClick={() => setPage("input")}>MyGovGuide</button>
        <p style={{ fontSize: "0.9rem", color: "#555", marginTop: "10px" }}>{t.myGovDesc}</p>
      </div>
      <div style={{ flex: 1 }}>
        <button className="btn" style={{ backgroundColor: "#6a7880" }} onClick={() => window.location.href='http://localhost:5001?returnUrl=' + encodeURIComponent(window.location.href)}>Rural Health Connect</button>
        <p style={{ fontSize: "0.9rem", color: "#555", marginTop: "10px" }}>{t.healthDesc}</p>
      </div>
    </div>
  </div>
));

const InputForm = memo(({ setPage, setUserDetails, userPhone, t }) => {
  const [formData, setFormData] = useState({
    dob: "", gender: "Male", maritalStatus: "Single", income: "", religion: "Hindu",
    category: "General", education: "below10", isDisabled: "false", isGovt: "false", isFarmer: "false"
  });
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleChange = useCallback((e) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  }, []);

  useEffect(() => {
    const fields = Object.values(formData).filter(v => v !== "");
    setProgress((fields.length / 10) * 100);
  }, [formData]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const dobDate = new Date(formData.dob);
    const today = new Date();
    let age = today.getFullYear() - dobDate.getFullYear();
    const m = today.getMonth() - dobDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) age--;

    const details = {
      age,
      income: parseInt(formData.income),
      category: formData.category,
      gender: formData.gender,
      maritalStatus: formData.maritalStatus,
      religion: formData.religion,
      isDisabled: formData.isDisabled === "true",
      education: formData.education,
      isGovtEmployee: formData.isGovt === "true",
      isFarmer: formData.isFarmer === "true"
    };

    setUserDetails(details);
    await saveSearchData(details);

    const eligibleSchemes = schemes.filter(s => checkLogic(s, details));
    if (eligibleSchemes.length > 0) {
      const smsBody = "MyGovGuide: You are eligible for:\n" + eligibleSchemes.map(s => `- ${s.name}: ${s.link}`).join("\n");
      sendSMS(userPhone, smsBody);
    }

    setPage("results");
    setLoading(false);
  }, [formData, setUserDetails, userPhone, setPage]);

  return (
    <div className="card">
      <div style={{ textAlign: "left", marginBottom: "10px" }}>
        <button className="btn btn-text" onClick={() => setPage("dashboard")} style={{ width: "auto", padding: 0 }}>← {t.backToDash}</button>
      </div>
      {progress > 0 && (
        <div style={{ marginBottom: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
            <span>Form Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div style={{ height: "6px", backgroundColor: "var(--border-color)", borderRadius: "3px", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progress}%`, backgroundColor: "var(--primary-color)", transition: "width 0.3s ease" }} />
          </div>
        </div>
      )}
      <h2>{t.enterDetails}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div><label>{t.age} (DD-MM-YYYY)</label><input type="date" id="dob" required value={formData.dob} onChange={handleChange} /></div>
          <div><label>{t.gender}</label><select id="gender" className="form-control" value={formData.gender} onChange={handleChange}><option value="Male">{t.male}</option><option value="Female">{t.female}</option><option value="Other">{t.other}</option></select></div>
          <div><label>{t.maritalStatus}</label><select id="maritalStatus" className="form-control" value={formData.maritalStatus} onChange={handleChange}><option value="Single">{t.single}</option><option value="Married">{t.married}</option><option value="Widowed">{t.widowed}</option><option value="Divorced">{t.divorced}</option></select></div>
          <div><label>{t.income}</label><input type="number" id="income" required placeholder="Ex: 50000" value={formData.income} onChange={handleChange} /></div>
          <div><label>{t.religion}</label><select id="religion" className="form-control" value={formData.religion} onChange={handleChange}><option value="Hindu">Hindu</option><option value="Muslim">Muslim</option><option value="Christian">Christian</option><option value="Sikh">Sikh</option><option value="Other">Other</option></select></div>
          <div><label>{t.category}</label><select id="category" className="form-control" value={formData.category} onChange={handleChange}><option value="General">General</option><option value="OBC">OBC</option><option value="SC">SC</option><option value="ST">ST</option></select></div>
          <div><label>{t.education}</label><select id="education" className="form-control" value={formData.education} onChange={handleChange}><option value="below10">{t.eduOptions.below10}</option><option value="pass10">{t.eduOptions.pass10}</option><option value="pass12">{t.eduOptions.pass12}</option><option value="ug">{t.eduOptions.ug}</option><option value="pg">{t.eduOptions.pg}</option><option value="phd">{t.eduOptions.phd}</option></select></div>
          <div><label>{t.isDisabled}</label><select id="isDisabled" className="form-control" value={formData.isDisabled} onChange={handleChange}><option value="false">{t.no}</option><option value="true">{t.yes}</option></select></div>
          <div><label>{t.isGovt}</label><select id="isGovt" className="form-control" value={formData.isGovt} onChange={handleChange}><option value="false">{t.no}</option><option value="true">{t.yes}</option></select></div>
          <div><label>{t.isFarmer}</label><select id="isFarmer" className="form-control" value={formData.isFarmer} onChange={handleChange}><option value="false">{t.no}</option><option value="true">{t.yes}</option></select></div>
        </div>
        <button type="submit" className="btn" disabled={loading}>{loading ? "Checking..." : t.checkBtn}</button>
      </form>
    </div>
  );
});

const Results = memo(({ setPage, userDetails, userPhone, t }) => {
  const [currentTab, setCurrentTab] = useState("schemes");
  const [currentFilter, setCurrentFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef(null);

  // Swipe logic
  const touchStart = useRef(0);
  const handleTouchStart = (e) => touchStart.current = e.changedTouches[0].screenX;
  const handleTouchEnd = (e) => {
    const touchEnd = e.changedTouches[0].screenX;
    if (touchEnd < touchStart.current - 50 && currentTab === "schemes") setCurrentTab("courses");
    if (touchEnd > touchStart.current + 50 && currentTab === "courses") setCurrentTab("schemes");
  };

  const handleManualSMS = async () => {
    const dataList = currentTab === "schemes" ? schemes : courses;
    const eligibleItems = dataList.filter(s => checkLogic(s, userDetails));
    if (eligibleItems.length === 0) { alert("No eligible schemes to send."); return; }
    const smsBody = "MyGovGuide Results:\n" + eligibleItems.map(s => `- ${s.name}`).join("\n");
    await sendSMS(userPhone, smsBody);
    alert(t.smsSent);
  };

  const dataList = useMemo(() => currentTab === "schemes" ? schemes : courses, [currentTab]);
  
  const filteredData = useMemo(() => {
    let data = dataList.filter(s => currentTab !== "schemes" || currentFilter === "All" || s.category === currentFilter);
    if (searchQuery) {
      data = data.filter(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.desc.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return data;
  }, [dataList, currentTab, currentFilter, searchQuery]);

  return (
    <div className="results-container" ref={containerRef} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", marginBottom: "15px", flexWrap: "nowrap", gap: "10px" }}>
        <button className="btn btn-text" onClick={() => setPage("input")} style={{ width: "auto", margin: 0, padding: "0.4rem 0.8rem", fontSize: "0.85rem" }}>{t.back}</button>
        <input 
          type="text" 
          placeholder="🔍 Search schemes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ padding: "0.4rem 0.9rem", borderRadius: "20px", border: "2px solid var(--border-color)", flex: "1", minWidth: "150px", fontSize: "0.85rem" }}
        />
        <button className="btn" onClick={handleManualSMS} style={{ width: "auto", backgroundColor: "var(--success-color)", margin: 0, padding: "0.4rem 0.8rem", fontSize: "0.85rem", whiteSpace: "nowrap" }}>📩 {t.smsBtn}</button>
      </div>
      <div className="tab-container">
        <button className={`tab-btn ${currentTab === "schemes" ? "active" : ""}`} onClick={() => setCurrentTab("schemes")}>{t.schemesTab}</button>
        <button className={`tab-btn ${currentTab === "courses" ? "active" : ""}`} onClick={() => setCurrentTab("courses")}>{t.coursesTab}</button>
      </div>
      {currentTab === "schemes" && (
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "15px", flexWrap: "wrap" }}>
          {["All", "Health", "Employment", "Financial"].map(f => (
            <button key={f} className="btn" style={{ width: "auto", padding: "0.4rem 0.8rem", fontSize: "0.75rem", backgroundColor: currentFilter === f ? "var(--gov-blue)" : "#999" }} onClick={() => setCurrentFilter(f)}>
              {t[`filter${f === 'All' ? 'All' : f === 'Health' ? 'Health' : f === 'Employment' ? 'Emp' : 'Fin'}`]}
            </button>
          ))}
        </div>
      )}
      <h2 style={{ textAlign: "center", fontSize: "1rem", marginBottom: "10px" }}>{t.resultsTitle}</h2>
      <div className="results-grid">
        {filteredData.map(s => {
          const isEligible = checkLogic(s, userDetails);
          return (
            <div key={s.id} className={`scheme-card ${isEligible ? "eligible" : "not-eligible"}`}>
              <div><h3>{s.name}</h3><p>{s.desc}</p></div>
              <div className="card-footer">
                <span className="status-badge">{isEligible ? "✅" : "❌"} {isEligible ? t.eligible : t.notEligible}</span>
                {isEligible && <a href={s.link} target="_blank" className="official-link">{t.link} &rarr;</a>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

const App = () => {
  const [currentLang, setLang] = useLocalStorage("appLang", "en");
  const [currentPage, setPage] = useState("login");
  const [userDetails, setUserDetails] = useState({});
  const [userPhone, setUserPhone] = useLocalStorage("userPhone", "");
  const { isTransitioning, transitionTo } = usePageTransition();

  const t = useMemo(() => translations[currentLang], [currentLang]);

  const contextValue = useMemo(() => ({
    currentLang, setLang,
    currentPage, setPage,
    userDetails, setUserDetails,
    userPhone, setUserPhone,
    t, isTransitioning, transitionTo
  }), [currentLang, currentPage, userDetails, userPhone, t, isTransitioning, transitionTo]);

  const handlePageChange = useCallback((newPage) => {
    transitionTo(() => setPage(newPage));
  }, [transitionTo]);

  return (
    <AppContext.Provider value={contextValue}>
      <Header currentPage={currentPage} setPage={handlePageChange} currentLang={currentLang} setLang={setLang} t={t} />
      <div id="app" style={{ opacity: isTransitioning ? 0 : 1, transition: "opacity 0.3s ease" }}>
        {currentPage === "login" && <Login setPage={handlePageChange} setUserPhone={setUserPhone} t={t} />}
        {currentPage === "register" && <Register setPage={handlePageChange} setUserPhone={setUserPhone} t={t} />}
        {currentPage === "dashboard" && <Dashboard setPage={handlePageChange} t={t} />}
        {currentPage === "input" && <InputForm setPage={handlePageChange} setUserDetails={setUserDetails} userPhone={userPhone} t={t} />}
        {currentPage === "results" && <Results setPage={handlePageChange} userDetails={userDetails} userPhone={userPhone} t={t} />}
      </div>
      <Chatbot />
      <Footer />
    </AppContext.Provider>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
