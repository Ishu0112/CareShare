const User = require('../models/userModel');
const { testQuestions, testMetadata } = require('../data/testQuestions');
const crypto = require('crypto');

// Get available tests based on user's interests
const getAvailableTests = async (req, res) => {
    try {
        const user = req.user;
        const allSkills = Object.keys(testQuestions);
        
        // Get tests for user's interests
        const availableTests = allSkills.map(skill => {
            const userTests = user.skillTests.filter(test => test.skill === skill);
            const bestScore = userTests.length > 0 
                ? Math.max(...userTests.map(t => t.score))
                : 0;
            const attempts = userTests.length;
            const lastAttempt = userTests.length > 0 
                ? userTests[userTests.length - 1].completedAt
                : null;

            return {
                skill,
                totalQuestions: testMetadata.questionsPerTest,
                timeLimit: testMetadata.timeLimit,
                passingScore: testMetadata.passingScore,
                bestScore,
                attempts,
                lastAttempt,
                hasPassed: bestScore >= testMetadata.passingScore
            };
        });

        return res.status(200).json({
            tests: availableTests,
            userInterests: user.interests
        });
    } catch (error) {
        console.error("Error fetching available tests:", error);
        return res.status(500).json({ message: "Failed to fetch tests" });
    }
};

// Start a test - get questions
const startTest = async (req, res) => {
    try {
        const { skill } = req.params;
        
        if (!testQuestions[skill]) {
            return res.status(404).json({ message: "Test not found for this skill" });
        }

        // Shuffle questions and select random 10
        const allQuestions = [...testQuestions[skill]];
        const shuffled = allQuestions.sort(() => 0.5 - Math.random());
        const selectedQuestions = shuffled.slice(0, testMetadata.questionsPerTest);

        // Remove correct answers from response (send separately encrypted)
        const questionsForClient = selectedQuestions.map((q, index) => ({
            id: index,
            question: q.question,
            options: q.options,
            difficulty: q.difficulty
        }));

        // Store correct answers in session or return encrypted
        const testSession = {
            skill,
            startTime: new Date(),
            questions: selectedQuestions
        };

        return res.status(200).json({
            skill,
            questions: questionsForClient,
            timeLimit: testMetadata.timeLimit,
            totalQuestions: testMetadata.questionsPerTest,
            passingScore: testMetadata.passingScore,
            testSessionId: Buffer.from(JSON.stringify(testSession)).toString('base64')
        });
    } catch (error) {
        console.error("Error starting test:", error);
        return res.status(500).json({ message: "Failed to start test" });
    }
};

// Submit test answers and calculate score
const submitTest = async (req, res) => {
    try {
        const user = req.user;
        const { skill, answers, timeTaken, testSessionId } = req.body;

        if (!testSessionId) {
            return res.status(400).json({ message: "Invalid test session" });
        }

        // Decode test session
        const testSession = JSON.parse(Buffer.from(testSessionId, 'base64').toString());
        
        if (testSession.skill !== skill) {
            return res.status(400).json({ message: "Test session mismatch" });
        }

        // Calculate score
        const questions = testSession.questions;
        let correctAnswers = 0;
        const results = questions.map((q, index) => {
            const userAnswer = answers[index];
            const isCorrect = userAnswer === q.correctAnswer;
            if (isCorrect) correctAnswers++;

            return {
                question: q.question,
                options: q.options,
                correctAnswer: q.correctAnswer,
                userAnswer,
                isCorrect,
                difficulty: q.difficulty
            };
        });

        const score = Math.round((correctAnswers / questions.length) * 100);
        const passed = score >= testMetadata.passingScore;

        // Generate certificate ID if passed
        const certificateId = passed 
            ? crypto.randomBytes(16).toString('hex')
            : null;

        // Save test result
        const testResult = {
            skill,
            score,
            totalQuestions: questions.length,
            timeTaken,
            passed,
            certificateId,
            completedAt: new Date()
        };

        user.skillTests.push(testResult);
        await user.save();

        // Add notification
        if (passed) {
            user.notifications.push(
                `Congratulations! You passed the ${skill} test with ${score}% score`
            );
        } else {
            user.notifications.push(
                `You scored ${score}% on the ${skill} test. Keep practicing!`
            );
        }
        await user.save();

        return res.status(200).json({
            score,
            passed,
            correctAnswers,
            totalQuestions: questions.length,
            results,
            certificateId,
            message: passed 
                ? `Congratulations! You passed with ${score}%` 
                : `You scored ${score}%. Need ${testMetadata.passingScore}% to pass.`
        });
    } catch (error) {
        console.error("Error submitting test:", error);
        return res.status(500).json({ message: "Failed to submit test", error: error.message });
    }
};

// Get user's test history
const getTestHistory = async (req, res) => {
    try {
        const user = req.user;
        
        const history = user.skillTests.map(test => ({
            skill: test.skill,
            score: test.score,
            totalQuestions: test.totalQuestions,
            passed: test.passed,
            certificateId: test.certificateId,
            completedAt: test.completedAt,
            timeTaken: test.timeTaken
        })).sort((a, b) => b.completedAt - a.completedAt);

        return res.status(200).json({ history });
    } catch (error) {
        console.error("Error fetching test history:", error);
        return res.status(500).json({ message: "Failed to fetch test history" });
    }
};

// Get certificate details
const getCertificate = async (req, res) => {
    try {
        const { certificateId } = req.params;
        const user = req.user;

        const testResult = user.skillTests.find(test => test.certificateId === certificateId);

        if (!testResult) {
            return res.status(404).json({ message: "Certificate not found" });
        }

        return res.status(200).json({
            certificateId,
            userName: `${user.fname} ${user.lname}`,
            username: user.username,
            skill: testResult.skill,
            score: testResult.score,
            completedAt: testResult.completedAt,
            verified: true
        });
    } catch (error) {
        console.error("Error fetching certificate:", error);
        return res.status(500).json({ message: "Failed to fetch certificate" });
    }
};

module.exports = {
    getAvailableTests,
    startTest,
    submitTest,
    getTestHistory,
    getCertificate
};
