import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useAlert } from '../../utils/AlertProvider';
import { useLoading } from '../../utils/LoadingProvider';
import PageHeading from '../../utils/PageHeading';

Axios.defaults.withCredentials = true;

export default function TestChallenge() {
    const { skill } = useParams();
    const navigate = useNavigate();
    const { setAlert } = useAlert();
    const { setIsLoading } = useLoading();

    const [testData, setTestData] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(0);
    const [testStartTime, setTestStartTime] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        startTest();
    }, [skill]);

    useEffect(() => {
        if (timeLeft === 0 && testData) {
            handleSubmitTest();
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, testData]);

    const startTest = async () => {
        setIsLoading(true);
        try {
            const response = await Axios.get(
                `${import.meta.env.VITE_BACKEND_URL}tests/start/${encodeURIComponent(skill)}`
            );
            
            if (response.status === 200) {
                setTestData(response.data);
                setTimeLeft(response.data.timeLimit);
                setTestStartTime(Date.now());
                setAlert({
                    message: `Test started! You have ${Math.floor(response.data.timeLimit / 60)} minutes.`,
                    type: 'success'
                });
            }
        } catch (error) {
            console.error('Error starting test:', error);
            setAlert({
                message: 'Failed to start test',
                type: 'warning'
            });
            navigate('/user/skill-tests');
        }
        setIsLoading(false);
    };

    const handleAnswerSelect = (questionIndex, optionIndex) => {
        setAnswers({
            ...answers,
            [questionIndex]: optionIndex
        });
    };

    const handleSubmitTest = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        const timeTaken = Math.floor((Date.now() - testStartTime) / 1000);
        
        // Convert answers object to array matching question order
        const answersArray = testData.questions.map((_, index) => 
            answers[index] !== undefined ? answers[index] : -1
        );

        try {
            const response = await Axios.post(
                `${import.meta.env.VITE_BACKEND_URL}tests/submit`,
                {
                    skill,
                    answers: answersArray,
                    timeTaken,
                    testSessionId: testData.testSessionId
                }
            );

            if (response.status === 200) {
                navigate('/user/skill-tests/results', {
                    state: {
                        result: response.data,
                        skill
                    }
                });
            }
        } catch (error) {
            console.error('Error submitting test:', error);
            setAlert({
                message: 'Failed to submit test',
                type: 'warning'
            });
        }
        setIsSubmitting(false);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getTimeColor = () => {
        if (timeLeft > 120) return 'text-green-600 dark:text-green-400';
        if (timeLeft > 60) return 'text-yellow-600 dark:text-yellow-400';
        return 'text-red-600 dark:text-red-400';
    };

    if (!testData) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    const progress = ((currentQuestion + 1) / testData.totalQuestions) * 100;
    const answeredCount = Object.keys(answers).length;

    return (
        <div className="flex items-center justify-center w-full min-h-screen p-5">
            <div className="w-full max-w-4xl">
                <PageHeading>{skill} Assessment</PageHeading>

                {/* Timer and Progress */}
                <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border-2 border-purple-500 dark:border-purple-400">
                    <div className="flex justify-between items-center mb-3">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Time Remaining</p>
                            <p className={`text-3xl font-bold ${getTimeColor()}`}>
                                {formatTime(timeLeft)}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Progress</p>
                            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                {currentQuestion + 1} / {testData.totalQuestions}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {answeredCount} answered
                            </p>
                        </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                            className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>

                {/* Question Card */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-300 dark:border-gray-600 mb-6">
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-sm font-semibold">
                                Question {currentQuestion + 1}
                            </span>
                            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-xs">
                                {testData.questions[currentQuestion].difficulty}
                            </span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {testData.questions[currentQuestion].question}
                        </h2>
                    </div>

                    {/* Options */}
                    <div className="space-y-3">
                        {testData.questions[currentQuestion].options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleAnswerSelect(currentQuestion, index)}
                                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                                    answers[currentQuestion] === index
                                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30 dark:border-purple-400'
                                        : 'border-gray-300 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-500'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                        answers[currentQuestion] === index
                                            ? 'border-purple-500 bg-purple-500'
                                            : 'border-gray-400 dark:border-gray-500'
                                    }`}>
                                        {answers[currentQuestion] === index && (
                                            <span className="text-white text-sm">✓</span>
                                        )}
                                    </div>
                                    <span className="text-gray-900 dark:text-white font-medium">
                                        {option}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center">
                    <button
                        onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                        disabled={currentQuestion === 0}
                        className="px-6 py-3 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
                    >
                        ← Previous
                    </button>

                    {currentQuestion === testData.totalQuestions - 1 ? (
                        <button
                            onClick={handleSubmitTest}
                            disabled={isSubmitting}
                            className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg font-bold hover:from-green-700 hover:to-blue-700 transition-all disabled:opacity-50"
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Test'}
                        </button>
                    ) : (
                        <button
                            onClick={() => setCurrentQuestion(currentQuestion + 1)}
                            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all"
                        >
                            Next →
                        </button>
                    )}
                </div>

                {/* Question Grid Navigation */}
                <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Quick Navigation</p>
                    <div className="grid grid-cols-10 gap-2">
                        {testData.questions.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentQuestion(index)}
                                className={`w-10 h-10 rounded-lg font-semibold text-sm transition-all ${
                                    index === currentQuestion
                                        ? 'bg-purple-600 text-white'
                                        : answers[index] !== undefined
                                        ? 'bg-green-500 text-white'
                                        : 'bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                }`}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
