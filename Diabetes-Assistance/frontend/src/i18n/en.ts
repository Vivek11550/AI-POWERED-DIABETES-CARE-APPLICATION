export default {
  patientDashboard1: "Patient Dashboard",

  
  // dashboard patient
  dashboard: {
    title: "Patient Dashboard",
    langEn: "English",
    langMr: "मराठी",
    assessmentTitle: "Health Assessment",
    assessmentSub: "Enter sugar levels & analyze risk",
    dietTitle: "Diet Plan",
    dietSub: "View personalized diet suggestions",
    exerciseTitle: "Exercise Plan",
    exerciseSub: "View exercises with animations",
    chatTitle: "Chat with Doctor",
    chatSub: "View doctor’s advice & reply",
  },
  
  auth: {
    // Login Page
    emailLabel: "Email",
    emailPlaceholder: "Enter your email",
    passwordLabel: "Password",
    passwordPlaceholder: "Enter your password",
    loginButton: "Login",
    goToRegister: "Go to Register",
    welcomeBack:"welcomeBack",

    // Register
    registerTitle: "Create Account",
    roleText: "Patient Registration Portal",
    confirmPasswordLabel: "Confirm Password",
    confirmPasswordPlaceholder: "Repeat password",
    signUp: "Sign Up",
    alreadyAccount: "Already have an account?",
    login: "Login",

    // Alerts / Messages
    emptyFields: "Please enter email and password",
    fillAll: "Please fill in all fields",
    passwordMismatch: "Passwords do not match",
    passwordLength: "Password must be at least 6 characters",
    loginFailed: "Login failed",
    registerSuccess: "Registered successfully",
    registerFailed: "Registration failed",
  },

  //dashboard doctor
  doctor: {
    dashboardTitle: "Doctor Dashboard",
    level1: "Level 1",
    level2: "Level 2",
    level3: "Level 3",
    highRiskTitle: "High Risk Patients",
    noHighRisk: "No high-risk patients currently.",
    patientLabel: "Patient: %{email}",
    riskLevelLabel: "Risk Level: %{level}",
    footUlcerWarning: "Foot Ulcer Detected",
    chatWithPatient: "Chat with Patient",
    unknown: "Unknown"
  },

 admin: {
    dashboardTitle: "Admin Dashboard",
    badge: "ADMIN PANEL",
    createDoctorTitle: "Register New Nurse",
    subtitle: "Create official credentials for nursing college experts",
    infoText: "This account will be assigned the 'Nurse' role by default.",
    emailLabel: "Nurse's Email",
    emailPlaceholder: "nurse@nursingcollege.edu",
    passwordLabel: "Set Password",
    passwordPlaceholder: "Set initial password",
    createDoctorBtn: "Create Nurse Account",
    viewDoctors: "View All Nurse",
    viewPatients: "View All Patients",
    footerNote: "The Nurse can complete their profile (Name, Specialization, etc.) once they log in for the first time.",

    // Alerts
    emptyFields: "Please enter both email and password",
    success: "Nurse account created successfully",
    failed: "Registration failed"
  },
  
  adminList: {
    totalDoctors: "Total Doctors",
    name: "Name",
    specialization: "Specialization",
    qualification: "Qualification",
    hospital: "Hospital",
    experience: "Experience",
    years: "years",
    email: "Email",
    fetchError: "Failed to fetch doctors"
  },

  adminPatientList: {
    header: "Patient List",
    totalPatients: "Total Patients",
    name: "Name",
    age: "Age",
    gender: "Gender",
    height: "Height",
    weight: "Weight",
    diabetesType: "Diabetes Type",
    phone: "Phone",
    email: "Email",
    cm: "cm",
    kg: "kg",
    fetchError: "Failed to fetch patients"
  },

  assessment: {
    header: "Health Assessment",
    title: "Risk Analysis",
    subtitle: "Fill in your current medical readings",

    bloodWeight: "Blood & Weight",
    weight: "Weight",
    fasting: "Fasting",
    ppSugar: "PP Sugar",
    hba1c: "HbA1c",

    urineTests: "Urine Tests",
    urineGlucose: "Urine Glucose",
    urineKetone: "Urine Ketone",

    symptoms: "Symptoms & History",
    preDiabetes: "Pre-Diabetes",
    diabetes: "Diabetes",
    footUlcer: "Foot Ulcer",
    neuropathy: "Neuropathy",

    analyzeBtn: "Analyze Health Risk",

    // Alerts
    errorTitle: "Error",
    fillAll: "Please fill all required medical values",
    submitFail: "Submission Failed",
    networkError: "Check your internet or API logs"
  },

  result: {
    header: "Assessment Result",
    yourRisk: "Your Risk Level",
    medicalCaution: "Medical Caution",
    steps: "Recommended Steps",
    home: "Return to Dashboard",

    highRisk: "High Risk",
    moderateRisk: "Moderate Risk",
    lowRisk: "Low Risk",

    level1: "Level 1",
    level2: "Level 2",
    level3: "Level 3",

    highCaution: "URGENT: Please consult your doctor immediately. High glucose and HbA1c levels detected. Monitor for symptoms of ketoacidosis.",
    moderateCaution: "CAUTION: Your levels are above target. Review your recent diet and exercise. Schedule a follow-up checkup soon.",
    lowCaution: "GOOD NEWS: Your diabetic markers are currently stable. Continue your healthy lifestyle and routine checkups.",

    highSteps: [
      "Contact your primary physician",
      "Check ketone levels if possible",
      "Strictly follow prescribed insulin/medication"
    ],
    moderateSteps: [
      "Reduce carbohydrate intake",
      "Increase daily physical activity",
      "Monitor blood sugar twice daily"
    ],
    lowSteps: [
      "Maintain current diet",
      "Stay hydrated",
      "Next routine checkup in 3 months"
    ]
  },

  doctorProfile: {
    header: "Doctor Profile",
    title: "Complete Profile",
    subtitle: "Complete your profile to start managing patients",

    fullName: "Full Name",
    qualification: "Qualification",
    specialization: "Specialization",
    experience: "Experience",

    regNo: "Registration No",
    contact: "Contact Number",

    placeholderName: "Dr. John Doe",
    placeholderQualification: "MBBS, MD",
    placeholderExperience: "Years",
    placeholderSpecialization: "e.g. Diabetologist",
    placeholderReg: "e.g. MC-12345",
    placeholderPhone: "+91 00000 00000",

    completeBtn: "Complete Profile",

    // Alerts
    fillRequired: "Please fill Name, Qualification, and Specialization",
    success: "Profile saved successfully",
    error: "Error saving profile"
  },

  patientProfile: {
    title: "Complete Profile",
    subtitle: "Help us personalize your diabetic care plan",

    personal: "Personal Information",
    physical: "Physical Metrics",
    lifestyle: "Lifestyle & Background",

    fullName: "Full Name",
    phone: "Phone Number",
    age: "Age",
    height: "Height",
    weight: "Weight",
    gender: "Gender",
    diet: "Dietary Preference",
    education: "Education",
    occupation: "Occupation",

    saveBtn: "Save & Continue",

    // Options
    male: "Male",
    female: "Female",
    other: "Other",

    veg: "Vegetarian",
    nonveg: "Non-Veg",

    illiterate: "Illiterate",
    primary: "Primary",
    secondary: "Secondary",
    higher: "Higher Sec",
    graduation: "Graduation+",

    private: "Private",
    government: "Government",
    farmer: "Farmer",
    housewife: "Housewife",
    student: "Student",

    // Alerts
    invalidPhone: "Please enter valid phone number",
    success: "Profile saved successfully",
    error: "Error saving profile"
  },

  doctorDashboard: {
    expertPanel: "Expert Panel",
    clinicalOverview: "Clinical Overview",
    allAssessments: "All Assessments",
    exportData: "Export Data",
    level1: "Level 1",
    level2: "Level 2",
    level3: "Level 3",
    highPriority: "🔥 High Priority",
    moderateRisk: "⚠️ Moderate Risk",
    stablePatients: "✅ Stable Patients",
    noPatients: "No patients in this category",
    noEmail: "No Email",
    patientId: "Patient ID",
    chat: "Chat"
  },

  patientDashboard: {
    loading: "Loading health data...",
    greeting: "Hello, Patient",
    dashboardTitle: "Your Dashboard",
    noAssessment: "No health assessment found",
    startAssessment: "Start Assessment Now",
    riskAnalysis: "Risk Analysis",
    healthMetrics: "Your Health Metrics",
    retest: "Retest",
    quickActions: "Quick Actions",
    healthTips: "Health Tips",
    consultDoctor: "Consult Doctor",
    myProfile: "My Profile",
    healthQuiz: "Health Quiz"
  },

  diet: {
    header: "My Diet Plan",
    title: "Nutrition Plan",
    subtitle: "Target: 1500–1600 kcal | Low Glycemic Index",

    earlyMorning: "Early Morning",
    breakfast: "Breakfast",
    midSnack: "Mid-Morning Snack",
    lunch: "Lunch",
    eveningSnack: "Evening Snack",
    dinner: "Dinner",
    bedtime: "Bedtime",

    item1: "Warm water with methi seeds (soaked overnight)",
    item2: "1 cup unsweetened green tea / black coffee",
    item3: "2 multigrain chapatis OR oats",
    item4: "1 boiled egg OR toned milk",
    item5: "½ apple or papaya",
    item6: "Sprouts salad",
    item7: "Almonds or walnuts",
    item8: "Chapatis",
    item9: "Dal",
    item10: "Vegetables",
    item11: "Curd",
    item12: "Roasted chana",
    item13: "Green tea",
    item14: "Chapatis or brown rice",
    item15: "Dal or chicken",
    item16: "Vegetables",
    item17: "Salad",
    item18: "Warm milk",

    tipTitle: "Expert Recommendation",
    tipText: "Use olive or mustard oil in small amounts. Stay hydrated."
  },

  patientAssess: {
    header: "Medical Archives",
    loading: "Syncing medical records...",
    search: "Find patient by name...",
    noRecords: "No matching patient records found.",
    noPhone: "No Phone",
    entry: "Entry",
    type: "TYPE",
    gender: "GENDER",
    history: "Recent History",
    sugar: "Sugar"
  },

  exercise: {
    header: "My Exercise Plan",
    title: "Physical Activity",
    subtitle: "Increasing METs helps muscles use glucose effectively",

    active: "Active",

    walkSlow: "Slow Walking",
    walkSlowSub: "3 km/hour pace",

    walkBrisk: "Brisk Walking",
    walkBriskSub: "6 km/hour pace",

    breath: "Deep Breathing",
    breathSub: "Slow rhythmic breathing",

    yoga: "Yoga",
    yogaSub: "Daily 30 mins",

    cycling: "Bicycling",
    cyclingSub: "20 km/hour pace",

    noteTitle: "Clinician's Note",
    noteText: "Regular movement prevents insulin resistance. Use stairs whenever possible."
  },

  export: {
    header: "Data Reports",
    title: "Clinical Data Export",
    subtitle: "Download CSV reports for offline analysis",
    available: "Available Reports",

    patientRegistry: "Patient Registry",
    patientSub: "List of all registered patients",

    assessmentLogs: "Assessment Logs",
    assessmentSub: "History of all assessments",

    footer: "Exports are in CSV format and follow privacy standards",

    saved: "File saved",
    failed: "Export failed",
    failedMsg: "Could not generate report",

    quizProgress: "Quiz Progress",
    quizSub: "Compare previous and latest quiz scores"
  },

  foot: {
    header: "Foot Care Guide",
    title: "Healthy Feet",
    subtitle: "Prevent complications with daily care",

    videoLabel: "Educational Video",
    videoTitle: "Foot care in Diabetes",
    videoSub: "Professional guidance",

    section: "Daily Management",

    item1: "Check feet daily",
    item2: "Wash and dry properly",
    item3: "Moisturize skin",
    item4: "Trim nails carefully",
    item5: "Wear clean socks",
    item6: "Use proper footwear",
    item7: "Avoid walking barefoot",
    item8: "Protect from temperature",

    warningTitle: "When to see a Doctor?",
    warningText: "Report wounds or swelling immediately.",
    contact: "Contact Clinic"
  },

  doctorProfile1: {
    header: "Professional Profile",
    defaultName: "Doctor",
    defaultSpecialization: "Medical Specialist",

    credentials: "Credentials",
    contactSection: "Contact",

    fullName: "Full Name",
    qualification: "Qualification",
    specialization: "Specialization",
    experience: "Experience",
    years: "Years",
    regNo: "Registration No",

    email: "Official Email",
    contact: "Contact Phone",

    notProvided: "Not Provided",

    save: "Save Changes",
    edit: "Edit Profile",
    logout: "Logout",

    enter: "Enter",

    success: "Profile updated successfully",
    error: "Error saving profile"
  },

  patientProfile1: {
    header: "My Profile",
    defaultName: "Patient",
    subtitle: "Diabetic Care Member",

    personal: "Personal Details",
    health: "Health Metrics",
    background: "Background",

    fullName: "Full Name",
    age: "Age",
    phone: "Phone",
    gender: "Gender",
    height: "Height",
    weight: "Weight",
    diet: "Diet",
    education: "Education",
    occupation: "Occupation",

    veg: "Vegetarian",
    nonveg: "Non-Vegetarian",

    years: "years",

    save: "Save Changes",
    edit: "Edit Profile",
    logout: "Sign Out",

    enter: "Enter",

    success: "Profile updated successfully",
    error: "Error saving profile"
  },

  quiz: {
    header: "Knowledge Hub",
    title: "Diabetes Awareness",
    subtitle: "Track your learning progress",

    ready: "Ready to learn?",
    readySub: "Take your first quiz to assess your knowledge",
    start: "Start Initial Quiz",

    proficiency: "Current Proficiency",
    expert: "Expert",
    learning: "Learning",

    initial: "Initial",
    latest: "Latest",
    growth: "Growth",

    tip: "Frequent quizzes improve diabetes management knowledge",

    retake: "Retake Test",

    headerQuiz: "Health Quiz",
    question: "QUESTION",
    of: "OF",

    next: "Next Question",
    submit: "Submit Assessment",

    completed: "Quiz Completed!",
    scoreLabel: "Accuracy Score",
    sync: "Syncing results...",
    error: "Error submitting quiz"

  },

  recommend: {
    header: "Care Recommendations",
    title: "Health Guidance",
    subtitle: "Personalized steps to manage your health",

    section: "Educational Modules",

    foot: "Foot Care",
    footSub: "Daily routines and checks",

    knowledge: "Knowledge",
    knowledgeSub: "Test your awareness"
  },
  riskHeader: {
  title: "Your Diabetes Risk"
},
riskFactors: {
  title: "Factors Influencing Your Risk",
  bmi: "BMI",
  fasting: "Fasting Sugar",
  postprandial: "Postprandial Sugar",
  hba1c: "HbA1c",
  footUlcer: "Foot Ulcer",
  neuropathy: "Neuropathy"
},

common: {
  present: "Present",
  absent: "Absent"
},
riskDesc: {
  high: "You are at high risk. Immediate lifestyle and medical attention is recommended.",
  moderate: "You are at moderate risk. Lifestyle improvements can significantly reduce your risk.",
  low: "You are at low risk. Maintain healthy habits to stay protected."
},
quizData: {
  q1: {
    question: "Where is the pancreas located in the human body?",
    o1: "Thoracic cavity",
    o2: "Behind the stomach",
    o3: "In front of the liver",
    o4: "Near the kidneys"
  },

  q2: {
    question: "Which pancreatic cells secrete insulin?",
    o1: "Alpha cells",
    o2: "Beta cells",
    o3: "Delta cells",
    o4: "Acinar cells"
  },

  q3: {
    question: "What is the function of alpha cells in the pancreas?",
    o1: "Secrete insulin",
    o2: "Secrete glucagon",
    o3: "Secrete somatostatin",
    o4: "Digest proteins"
  },

  q4: {
    question: "Which organ stores glucose in the form of glycogen?",
    o1: "Pancreas",
    o2: "Liver",
    o3: "Kidney",
    o4: "Spleen"
  },

  q5: {
    question: "What is the normal blood glucose level range in mg/dL?",
    o1: "50–80",
    o2: "70–110",
    o3: "120–160",
    o4: "160–200"
  },

  q6: {
    question: "Define hyperglycemia.",
    o1: "Low blood sugar",
    o2: "High blood sugar",
    o3: "Normal blood sugar",
    o4: "Fluctuating blood sugar"
  },

  q7: {
    question: "Name two classic symptoms of diabetes mellitus.",
    o1: "Fever & headache",
    o2: "Polyuria & polydipsia",
    o3: "Diarrhea & vomiting",
    o4: "Chest pain & cough"
  },

  q8: {
    question: "What condition results from breakdown of fat leading to ketone formation?",
    o1: "Hypoglycemia",
    o2: "Ketoacidosis",
    o3: "Hypertension",
    o4: "Anemia"
  },

  q9: {
    question: "Mention two long-term complications of diabetes mellitus.",
    o1: "Retinopathy & nephropathy",
    o2: "Diarrhea & constipation",
    o3: "Tuberculosis & asthma",
    o4: "Fever & infection"
  },

  q10: {
    question: "What is the normal range of pulse rate in adults?",
    o1: "40–60/min",
    o2: "60–100/min",
    o3: "100–120/min",
    o4: "120–140/min"
  },

  q11: {
    question: "Write one abnormal finding in the cardiovascular system of a diabetic patient.",
    o1: "Hypertension",
    o2: "Diarrhea",
    o3: "Ear infection",
    o4: "Jaundice"
  },

  q12: {
    question: "What is PERRLA used to assess?",
    o1: "Vision and pupils",
    o2: "Pulse rate",
    o3: "Lung sounds",
    o4: "Reflexes"
  },

  q13: {
    question: "Mention one abnormal finding in the genitourinary system.",
    o1: "Polyuria",
    o2: "Headache",
    o3: "Joint pain",
    o4: "Earache"
  },

  q14: {
    question: "State one purpose of diabetic foot care.",
    o1: "Improve eyesight",
    o2: "Prevent foot ulcers",
    o3: "Control hypertension",
    o4: "Increase insulin production"
  },

  q15: {
    question: "Name two articles required for diabetic foot care procedure.",
    o1: "Gloves & sterile gauze",
    o2: "Stethoscope & BP machine",
    o3: "Syringe & insulin vial",
    o4: "Nebulizer & mask"
  },

  q16: {
    question: "Why should moisturizer not be applied between the toes in diabetic patients?",
    o1: "Causes dryness",
    o2: "Promotes fungal infection",
    o3: "Increases blood sugar",
    o4: "Causes itching"
  },

  q17: {
    question: "Which type of carbohydrates are preferred in a diabetic diet?",
    o1: "Simple carbohydrates",
    o2: "Complex carbohydrates",
    o3: "Sugary foods",
    o4: "Fried foods"
  },

  q18: {
    question: "How many times per day should a diabetic patient ideally eat meals?",
    o1: "1–2 times",
    o2: "3 large meals",
    o3: "4–5 small meals",
    o4: "Only when hungry"
  },

  q19: {
    question: "Name one food item recommended for evening snacks in a diabetic diet.",
    o1: "Biscuits",
    o2: "Fruits",
    o3: "Ice cream",
    o4: "Sweets"
  },

  q20: {
    question: "Why is urine testing important in diabetic patients?",
    o1: "Detect protein & ketones",
    o2: "Measure body temperature",
    o3: "Check lung capacity",
    o4: "Detect heart problems"
  }
}

};