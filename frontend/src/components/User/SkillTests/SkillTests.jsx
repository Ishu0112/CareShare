import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAlert } from '../../utils/AlertProvider';
import { useLoading } from '../../utils/LoadingProvider';
import PageHeading from '../../utils/PageHeading';

Axios.defaults.withCredentials = true;

export default function SkillTests() {
    const [availableTests, setAvailableTests] = useState([]);
    const [testHistory, setTestHistory] = useState([]);
    const [activeTab, setActiveTab] = useState('available'); // 'available' or 'history'
    const navigate = useNavigate();
    const { setAlert } = useAlert();
    const { setIsLoading } = useLoading();

    useEffect(() => {
        fetchAvailableTests();
        fetchTestHistory();
    }, []);

    const fetchAvailableTests = async () => {
        setIsLoading(true);
        try {
            const response = await Axios.get(`${import.meta.env.VITE_BACKEND_URL}tests/available`);
            if (response.status === 200) {
                setAvailableTests(response.data.tests);
            }
        } catch (error) {
            console.error('Error fetching tests:', error);
            setAlert({
                message: 'Failed to load tests',
                type: 'warning'
            });
        }
        setIsLoading(false);
    };

    const fetchTestHistory = async () => {
        try {
            const response = await Axios.get(`${import.meta.env.VITE_BACKEND_URL}tests/history`);
            if (response.status === 200) {
                setTestHistory(response.data.history);
            }
        } catch (error) {
            console.error('Error fetching history:', error);
        }
    };

    const handleStartTest = (skill) => {
        navigate(`/user/skill-tests/challenge/${encodeURIComponent(skill)}`);
    };

    const getScoreColor = (score, passingScore) => {
        if (score >= 90) return 'text-green-600 dark:text-green-400';
        if (score >= passingScore) return 'text-blue-600 dark:text-blue-400';
        return 'text-red-600 dark:text-red-400';
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex items-center justify-center w-full min-h-screen p-5">
            <div className="w-full max-w-6xl">
                <PageHeading>Skill Assessment Tests</PageHeading>

                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => setActiveTab('available')}
                        className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                            activeTab === 'available'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                    >
                        Available Tests
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                            activeTab === 'history'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                    >
                        Test History ({testHistory.length})
                    </button>
                </div>

                {/* Available Tests Tab */}
                {activeTab === 'available' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {availableTests.map((test) => (
                            <div
                                key={test.skill}
                                className="border-2 border-purple-500 dark:border-purple-400 rounded-lg p-6 bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-bold text-purple-600 dark:text-purple-400">
                                        {test.skill}
                                    </h3>
                                    {test.hasPassed && (
                                        <span className="text-2xl">✓</span>
                                    )}
                                </div>

                                <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300 mb-4">
                                    <p>📝 <strong>{test.totalQuestions}</strong> questions</p>
                                    <p>⏱️ <strong>{formatTime(test.timeLimit)}</strong> time limit</p>
                                    <p>🎯 <strong>{test.passingScore}%</strong> to pass</p>
                                    {test.bestScore > 0 && (
                                        <p>
                                            🏆 Best Score: <strong className={getScoreColor(test.bestScore, test.passingScore)}>
                                                {test.bestScore}%
                                            </strong>
                                        </p>
                                    )}
                                    {test.attempts > 0 && (
                                        <p>🔄 <strong>{test.attempts}</strong> attempts</p>
                                    )}
                                </div>

                                <button
                                    onClick={() => handleStartTest(test.skill)}
                                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
                                >
                                    {test.attempts > 0 ? 'Retake Test' : 'Start Test'}
                                </button>

                                {test.hasPassed && (
                                    <div className="mt-3 p-2 bg-green-100 dark:bg-green-900 rounded text-center text-sm text-green-800 dark:text-green-200">
                                        Passed! Certificate Available
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Test History Tab */}
                {activeTab === 'history' && (
                    <div className="space-y-4">
                        {testHistory.length === 0 ? (
                            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                                <p className="text-xl mb-2">📋</p>
                                <p>No test history yet. Take your first test!</p>
                            </div>
                        ) : (
                            testHistory.map((test, index) => (
                                <div
                                    key={index}
                                    className="border border-gray-300 dark:border-gray-600 rounded-lg p-6 bg-white dark:bg-gray-800"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                                {test.skill}
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {new Date(test.completedAt).toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-3xl font-bold ${getScoreColor(test.score, 70)}`}>
                                                {test.score}%
                                            </p>
                                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                                {test.score >= 70 ? 'PASSED' : 'FAILED'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-6 text-sm text-gray-700 dark:text-gray-300">
                                        <p>Questions: {test.totalQuestions}</p>
                                        <p>Time: {formatTime(test.timeTaken)}</p>
                                    </div>

                                    {test.certificateId && (
                                        <button
                                            onClick={() => navigate(`/user/certificate/${test.certificateId}`)}
                                            className="mt-3 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm font-semibold"
                                        >
                                            View Certificate
                                        </button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
