import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PageHeading from '../../utils/PageHeading';

export default function TestResults() {
    const location = useLocation();
    const navigate = useNavigate();
    const { result, skill } = location.state || {};

    if (!result) {
        navigate('/user/skill-tests');
        return null;
    }

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getScoreColor = () => {
        if (result.score >= 90) return 'text-green-600 dark:text-green-400';
        if (result.passed) return 'text-blue-600 dark:text-blue-400';
        return 'text-red-600 dark:text-red-400';
    };

    const getScoreEmoji = () => {
        if (result.score >= 90) return '🏆';
        if (result.passed) return '🎉';
        return '💪';
    };

    return (
        <div className="flex items-center justify-center w-full min-h-screen p-5">
            <div className="w-full max-w-4xl">
                <PageHeading>Test Results</PageHeading>

                {/* Score Card */}
                <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg shadow-2xl p-8 mb-6 text-white text-center">
                    <div className="text-6xl mb-4">{getScoreEmoji()}</div>
                    <h2 className="text-3xl font-bold mb-2">{skill}</h2>
                    <div className="text-7xl font-bold mb-3">{result.score}%</div>
                    <p className="text-xl mb-4">
                        {result.passed ? 'Congratulations! You Passed!' : 'Keep Practicing!'}
                    </p>
                    <div className="flex justify-center gap-8 text-lg">
                        <div>
                            <p className="opacity-80">Correct Answers</p>
                            <p className="font-bold">{result.correctAnswers} / {result.totalQuestions}</p>
                        </div>
                        <div>
                            <p className="opacity-80">Time Taken</p>
                            <p className="font-bold">{formatTime(result.timeTaken || 0)}</p>
                        </div>
                    </div>
                </div>

                {/* Certificate Button */}
                {result.passed && result.certificateId && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-500 rounded-lg p-6 mb-6 text-center">
                        <p className="text-lg font-semibold text-yellow-800 dark:text-yellow-300 mb-3">
                            You've earned a certificate!
                        </p>
                        <button
                            onClick={() => navigate(`/user/certificate/${result.certificateId}`)}
                            className="px-6 py-3 bg-yellow-500 text-white rounded-lg font-bold hover:bg-yellow-600 transition-colors"
                        >
                            View Certificate
                        </button>
                    </div>
                )}

                {/* Answer Review */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Answer Review
                    </h3>
                    
                    <div className="space-y-4">
                        {result.results.map((item, index) => (
                            <div
                                key={index}
                                className={`p-4 rounded-lg border-2 ${
                                    item.isCorrect
                                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                        : 'border-red-500 bg-red-50 dark:bg-red-900/20'
                                }`}
                            >
                                <div className="flex items-start gap-3 mb-2">
                                    <span className="text-2xl">
                                        {item.isCorrect ? '✓' : '✗'}
                                    </span>
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-900 dark:text-white mb-2">
                                            {index + 1}. {item.question}
                                        </p>
                                        
                                        <div className="space-y-1 text-sm">
                                            {item.options.map((option, optIndex) => {
                                                const isCorrectOption = optIndex === item.correctAnswer;
                                                const isUserAnswer = optIndex === item.userAnswer;
                                                
                                                return (
                                                    <div
                                                        key={optIndex}
                                                        className={`p-2 rounded ${
                                                            isCorrectOption
                                                                ? 'bg-green-200 dark:bg-green-800 font-semibold'
                                                                : isUserAnswer && !item.isCorrect
                                                                ? 'bg-red-200 dark:bg-red-800'
                                                                : 'bg-gray-100 dark:bg-gray-700'
                                                        }`}
                                                    >
                                                        {option}
                                                        {isCorrectOption && ' ✓ (Correct)'}
                                                        {isUserAnswer && !isCorrectOption && ' ✗ (Your answer)'}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={() => navigate('/user/skill-tests')}
                        className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                    >
                        Back to Tests
                    </button>
                    {!result.passed && (
                        <button
                            onClick={() => navigate(`/user/skill-tests/challenge/${encodeURIComponent(skill)}`)}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                        >
                            Retry Test
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
