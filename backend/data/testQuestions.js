// Skill test questions - each test has 10 questions with 5 minute time limit

const testQuestions = {
  "Web Development": [
    {
      question: "What does HTML stand for?",
      options: ["Hyper Text Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language"],
      correctAnswer: 0,
      difficulty: "easy"
    },
    {
      question: "Which CSS property is used to change text color?",
      options: ["text-color", "font-color", "color", "text-style"],
      correctAnswer: 2,
      difficulty: "easy"
    },
    {
      question: "What is the correct syntax for referring to an external JavaScript file?",
      options: ["<script src='file.js'>", "<script href='file.js'>", "<script name='file.js'>", "<js src='file.js'>"],
      correctAnswer: 0,
      difficulty: "medium"
    },
    {
      question: "Which method is used to add an element at the end of an array in JavaScript?",
      options: ["add()", "push()", "append()", "insert()"],
      correctAnswer: 1,
      difficulty: "medium"
    },
    {
      question: "What does CSS stand for?",
      options: ["Creative Style Sheets", "Cascading Style Sheets", "Computer Style Sheets", "Colorful Style Sheets"],
      correctAnswer: 1,
      difficulty: "easy"
    },
    {
      question: "Which HTML tag is used to define an internal style sheet?",
      options: ["<style>", "<css>", "<script>", "<link>"],
      correctAnswer: 0,
      difficulty: "easy"
    },
    {
      question: "What is the purpose of the 'viewport' meta tag?",
      options: ["To set the page title", "To make the website responsive", "To add keywords", "To link CSS files"],
      correctAnswer: 1,
      difficulty: "medium"
    },
    {
      question: "Which JavaScript method converts JSON data to a JavaScript object?",
      options: ["JSON.parse()", "JSON.stringify()", "JSON.convert()", "JSON.object()"],
      correctAnswer: 0,
      difficulty: "medium"
    },
    {
      question: "What does the 'box-sizing: border-box' CSS property do?",
      options: ["Adds a border", "Includes padding and border in element's total width", "Creates a box shadow", "Sets the background color"],
      correctAnswer: 1,
      difficulty: "hard"
    },
    {
      question: "Which HTTP status code indicates a successful request?",
      options: ["404", "500", "200", "301"],
      correctAnswer: 2,
      difficulty: "medium"
    }
  ],
  "Cooking": [
    {
      question: "What temperature is considered 'medium heat' on most stovetops?",
      options: ["Low (1-3)", "Medium (4-6)", "High (7-9)", "Maximum (10)"],
      correctAnswer: 1,
      difficulty: "easy"
    },
    {
      question: "What is the purpose of 'mise en place' in cooking?",
      options: ["A French cooking technique", "Preparing and organizing ingredients before cooking", "A type of sauce", "A cooking utensil"],
      correctAnswer: 1,
      difficulty: "easy"
    },
    {
      question: "At what internal temperature is chicken considered safely cooked?",
      options: ["145°F (63°C)", "155°F (68°C)", "165°F (74°C)", "175°F (79°C)"],
      correctAnswer: 2,
      difficulty: "medium"
    },
    {
      question: "What does 'al dente' mean when cooking pasta?",
      options: ["Fully soft", "Firm to the bite", "Overcooked", "Raw"],
      correctAnswer: 1,
      difficulty: "easy"
    },
    {
      question: "Which knife is best for slicing bread?",
      options: ["Chef's knife", "Paring knife", "Serrated knife", "Cleaver"],
      correctAnswer: 2,
      difficulty: "easy"
    },
    {
      question: "What is the difference between baking and roasting?",
      options: ["Temperature difference", "Baking is for desserts, roasting is for meats/vegetables", "No difference", "Roasting uses water"],
      correctAnswer: 1,
      difficulty: "medium"
    },
    {
      question: "What does 'blanching' vegetables mean?",
      options: ["Grilling them", "Briefly boiling then plunging in ice water", "Cutting them finely", "Steaming them"],
      correctAnswer: 1,
      difficulty: "medium"
    },
    {
      question: "Which ingredient helps baked goods rise?",
      options: ["Salt", "Baking powder/baking soda", "Sugar", "Butter"],
      correctAnswer: 1,
      difficulty: "easy"
    },
    {
      question: "What is a 'roux' used for?",
      options: ["Seasoning", "Thickening sauces", "Marinating meat", "Garnishing"],
      correctAnswer: 1,
      difficulty: "medium"
    },
    {
      question: "What does 'deglazing' a pan mean?",
      options: ["Cleaning it", "Adding liquid to dissolve browned bits", "Heating it empty", "Oiling it"],
      correctAnswer: 1,
      difficulty: "hard"
    }
  ],
  "Mobile App Development": [
    {
      question: "Which language is primarily used for Android app development?",
      options: ["Swift", "Kotlin/Java", "Python", "Ruby"],
      correctAnswer: 1,
      difficulty: "easy"
    },
    {
      question: "What framework is used for cross-platform mobile development with JavaScript?",
      options: ["Django", "Flask", "React Native", "Laravel"],
      correctAnswer: 2,
      difficulty: "easy"
    },
    {
      question: "What does APK stand for in Android development?",
      options: ["Android Package Kit", "Application Package Kit", "Android Program Key", "App Package Kernel"],
      correctAnswer: 0,
      difficulty: "easy"
    },
    {
      question: "Which iOS UI framework was introduced to replace UIKit?",
      options: ["SwiftUI", "CocoaTouch", "AppKit", "UINext"],
      correctAnswer: 0,
      difficulty: "medium"
    },
    {
      question: "What is the purpose of 'AsyncStorage' in React Native?",
      options: ["State management", "Local data storage", "API calls", "Image caching"],
      correctAnswer: 1,
      difficulty: "medium"
    },
    {
      question: "Which tool is used to test iOS apps without a physical device?",
      options: ["AVD", "Simulator", "Emulator", "TestFlight"],
      correctAnswer: 1,
      difficulty: "easy"
    },
    {
      question: "What is Flutter's programming language?",
      options: ["JavaScript", "Dart", "TypeScript", "Kotlin"],
      correctAnswer: 1,
      difficulty: "easy"
    },
    {
      question: "What does 'Gradle' do in Android development?",
      options: ["Designs UI", "Build automation tool", "Debugs code", "Tests apps"],
      correctAnswer: 1,
      difficulty: "medium"
    },
    {
      question: "Which pattern is commonly used for state management in mobile apps?",
      options: ["MVC", "MVVM", "Both of the above", "None"],
      correctAnswer: 2,
      difficulty: "medium"
    },
    {
      question: "What is the purpose of 'Push Notifications'?",
      options: ["Update UI", "Send messages to users when app is closed", "Store data", "Handle navigation"],
      correctAnswer: 1,
      difficulty: "easy"
    }
  ],
  "Photography": [
    {
      question: "What does 'ISO' control in photography?",
      options: ["Light sensitivity", "Shutter speed", "Aperture size", "Focus"],
      correctAnswer: 0,
      difficulty: "easy"
    },
    {
      question: "What is the 'Rule of Thirds' in composition?",
      options: ["Using 3 colors", "Dividing frame into 9 equal parts", "Taking 3 photos", "3 second exposure"],
      correctAnswer: 1,
      difficulty: "easy"
    },
    {
      question: "What does a lower f-stop number mean?",
      options: ["Slower shutter", "Wider aperture (more light)", "Higher ISO", "Longer lens"],
      correctAnswer: 1,
      difficulty: "medium"
    },
    {
      question: "What is 'bokeh' in photography?",
      options: ["Camera shake", "Blurred background effect", "Light flare", "Image noise"],
      correctAnswer: 1,
      difficulty: "medium"
    },
    {
      question: "What shutter speed would freeze motion?",
      options: ["1/10 second", "1 second", "1/1000 second", "10 seconds"],
      correctAnswer: 2,
      difficulty: "medium"
    },
    {
      question: "What is 'Golden Hour' in photography?",
      options: ["Noon", "Hour after sunrise/before sunset", "Midnight", "Any bright day"],
      correctAnswer: 1,
      difficulty: "easy"
    },
    {
      question: "What does 'RAW' format preserve that JPEG doesn't?",
      options: ["Colors only", "Maximum image data for editing", "File size", "Nothing"],
      correctAnswer: 1,
      difficulty: "medium"
    },
    {
      question: "What is 'white balance' used for?",
      options: ["Exposure", "Color temperature correction", "Focus", "Zoom"],
      correctAnswer: 1,
      difficulty: "medium"
    },
    {
      question: "What does a 'prime lens' mean?",
      options: ["Expensive lens", "Fixed focal length", "Zoom lens", "Wide angle"],
      correctAnswer: 1,
      difficulty: "medium"
    },
    {
      question: "What is the purpose of using a 'tripod'?",
      options: ["Zoom", "Camera stability for sharp images", "Lighting", "Storage"],
      correctAnswer: 1,
      difficulty: "easy"
    }
  ],
  "Machine Learning": [
    {
      question: "What does 'supervised learning' mean?",
      options: ["Learning without data", "Learning with labeled data", "Unsupervised", "Random learning"],
      correctAnswer: 1,
      difficulty: "easy"
    },
    {
      question: "Which Python library is most commonly used for machine learning?",
      options: ["NumPy", "Pandas", "Scikit-learn", "Matplotlib"],
      correctAnswer: 2,
      difficulty: "easy"
    },
    {
      question: "What is 'overfitting' in machine learning?",
      options: ["Too much data", "Model performs well on training but poor on new data", "Underfitting", "Perfect model"],
      correctAnswer: 1,
      difficulty: "medium"
    },
    {
      question: "What algorithm is used for classification tasks?",
      options: ["Linear Regression", "Logistic Regression", "K-means", "PCA"],
      correctAnswer: 1,
      difficulty: "medium"
    },
    {
      question: "What is a 'neural network'?",
      options: ["A network of computers", "Computing system inspired by biological neural networks", "Internet connection", "Cloud storage"],
      correctAnswer: 1,
      difficulty: "easy"
    },
    {
      question: "What does 'training data' refer to?",
      options: ["Data used to test model", "Data used to teach the model", "Random data", "User data"],
      correctAnswer: 1,
      difficulty: "easy"
    },
    {
      question: "What is 'cross-validation' used for?",
      options: ["Data cleaning", "Assessing model performance", "Feature selection", "Data collection"],
      correctAnswer: 1,
      difficulty: "medium"
    },
    {
      question: "What is the purpose of 'feature engineering'?",
      options: ["Building hardware", "Creating/selecting relevant features for models", "Testing", "Deployment"],
      correctAnswer: 1,
      difficulty: "medium"
    },
    {
      question: "What does 'gradient descent' optimize?",
      options: ["Memory usage", "Model parameters to minimize loss", "Data size", "Processing speed"],
      correctAnswer: 1,
      difficulty: "hard"
    },
    {
      question: "What is 'deep learning'?",
      options: ["Learning deeply", "ML with neural networks having multiple layers", "Surface learning", "Quick learning"],
      correctAnswer: 1,
      difficulty: "medium"
    }
  ]
};

// Test metadata
const testMetadata = {
  timeLimit: 300, // 5 minutes in seconds
  passingScore: 70, // 70% to pass
  questionsPerTest: 10
};

module.exports = { testQuestions, testMetadata };
