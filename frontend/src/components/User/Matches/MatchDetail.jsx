import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Axios from 'axios';
import { useAlert } from '../../utils/AlertProvider';
import { useLoading } from '../../utils/LoadingProvider';
import PageHeading from '../../utils/PageHeading';
import SkillVideoPlayer from './SkillVideoPlayer';
import maleAvatar from '../../../assets/avatar/male-default-avatar.png';

const MatchDetail = () => {
    const { username } = useParams();
    const navigate = useNavigate();
    const [matchData, setMatchData] = useState(null);
    const { setAlert } = useAlert();
    const { setIsLoading } = useLoading();

    useEffect(() => {
        const fetchMatchDetail = async () => {
            setIsLoading(true);
            try {
                const response = await Axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}${username}`
                );
                if (response.status === 200) {
                    setMatchData(response.data);
                }
            } catch (error) {
                console.error('Error fetching match details:', error);
                setAlert({
                    message: 'Failed to load match details',
                    type: 'error'
                });
            }
            setIsLoading(false);
        };

        fetchMatchDetail();
    }, [username]);

    if (!matchData) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-gray-500 dark:text-gray-400">Loading...</p>
            </div>
        );
    }

    const hasVideos = matchData.skillVideos && Object.keys(matchData.skillVideos).length > 0;

    return (
        <div className="flex items-center justify-center w-full min-h-screen">
            <div className="flex flex-col my-5 max-w-4xl w-full px-4">
                <PageHeading>Match Profile</PageHeading>

                {/* User Info Card */}
                <div className="w-full border-2 border-blue-600 dark:border-blue-500 rounded-lg shadow bg-slate-200 dark:bg-gray-900 mb-5">
                    <div className="flex flex-col items-center p-10">
                        <img
                            className="w-24 h-24 mb-3 rounded-full shadow-lg"
                            src={maleAvatar}
                            alt="Profile avatar"
                        />
                        <h1 className="mb-1 text-2xl font-bold text-blue-600 dark:text-blue-500">
                            @ {matchData.username.toLowerCase()}
                        </h1>
                        <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
                            {matchData.fname} {matchData.lname}
                        </p>

                        {matchData.email && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                Email: {matchData.email}
                            </p>
                        )}

                        {matchData.bio && (
                            <div className="w-full mt-4">
                                <h3 className="text-sm font-semibold text-gray-500 mb-2">About</h3>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    {matchData.bio}
                                </p>
                            </div>
                        )}

                        {matchData.skills && matchData.skills.length > 0 && (
                            <div className="w-full mt-4">
                                <h3 className="text-sm font-semibold text-gray-500 mb-2">Skills</h3>
                                <div className="flex flex-wrap">
                                    {matchData.skills.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="rounded-full text-black bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 font-medium text-sm px-4 py-2 me-2 mb-2"
                                        >
                                            {typeof skill === 'object' ? skill.name : skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {matchData.interests && matchData.interests.length > 0 && (
                            <div className="w-full mt-4">
                                <h3 className="text-sm font-semibold text-gray-500 mb-2">Interests</h3>
                                <div className="flex flex-wrap">
                                    {matchData.interests.map((interest, index) => (
                                        <span
                                            key={index}
                                            className="rounded-full text-black bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 font-medium text-sm px-4 py-2 me-2 mb-2"
                                        >
                                            {typeof interest === 'object' ? interest.name : interest}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Skill Videos Section */}
                {hasVideos && (
                    <div className="w-full border-2 border-purple-500 dark:border-purple-400 rounded-lg shadow bg-slate-200 dark:bg-gray-900 mb-5">
                        <div className="p-10">
                            <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-6">
                                Skill Showcase Videos
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                                Watch videos showcasing the skills {matchData.fname} is offering!
                            </p>
                            <div className="space-y-6">
                                {Object.entries(matchData.skillVideos).map(([skill, videoUrl]) => (
                                    <SkillVideoPlayer
                                        key={skill}
                                        skill={skill}
                                        videoUrl={videoUrl}
                                        videoOwnerUsername={matchData.username}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {!hasVideos && (
                    <div className="w-full border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow bg-slate-200 dark:bg-gray-900 mb-5 p-10">
                        <p className="text-center text-gray-500 dark:text-gray-400">
                            {matchData.fname} hasn't uploaded any skill videos yet.
                        </p>
                    </div>
                )}

                <button
                    onClick={() => navigate('/user/matches')}
                    className="px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium"
                >
                    ← Back to Matches
                </button>
            </div>
        </div>
    );
};

export default MatchDetail;
