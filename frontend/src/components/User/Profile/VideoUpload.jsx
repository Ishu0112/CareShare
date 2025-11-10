import React, { useState } from 'react';
import Axios from 'axios';
import { useAlert } from '../../utils/AlertProvider';
import { useLoading } from '../../utils/LoadingProvider';

const VideoUpload = ({ userSkills, existingVideos, onVideoUpdate }) => {
    const [selectedSkill, setSelectedSkill] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const { setAlert } = useAlert();
    const { setIsLoading } = useLoading();

    const handleUpload = async () => {
        if (!selectedSkill) {
            setAlert({
                message: 'Please select a skill',
                type: 'warning'
            });
            return;
        }

        if (!videoUrl) {
            setAlert({
                message: 'Please enter a video URL',
                type: 'warning'
            });
            return;
        }

        setIsLoading(true);

        try {
            // Save URL directly
            const response = await Axios.post(
                `${import.meta.env.VITE_BACKEND_URL}user/save-skill-video-url`,
                {
                    skill: selectedSkill,
                    videoUrl: videoUrl
                }
            );

            if (response.status !== 200) {
                throw new Error('Failed to save video URL');
            }

            setAlert({
                message: `Video for ${selectedSkill} uploaded successfully!`,
                type: 'success'
            });

            // Notify parent component
            onVideoUpdate(selectedSkill, videoUrl);

            // Reset form
            setSelectedSkill('');
            setVideoUrl('');
        } catch (error) {
            console.error('Error uploading video:', error);
            setAlert({
                message: 'Failed to upload video. Please try again.',
                type: 'error'
            });
        }

        setIsLoading(false);
    };

    const handleDeleteVideo = async (skill) => {
        try {
            setIsLoading(true);
            const response = await Axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}user/delete-skill-video`,
                { data: { skill } }
            );

            if (response.status === 200) {
                setAlert({
                    message: `Video for ${skill} deleted successfully!`,
                    type: 'success'
                });
                onVideoUpdate(skill, null);
            }
        } catch (error) {
            console.error('Error deleting video:', error);
            setAlert({
                message: 'Failed to delete video',
                type: 'error'
            });
        }
        setIsLoading(false);
    };

    return (
        <div className="w-full max-w-2xl p-6 border-2 border-purple-500 dark:border-purple-400 rounded-lg bg-white dark:bg-gray-800 my-4">
            <h3 className="text-xl font-bold text-purple-600 dark:text-purple-400 mb-4">
                Upload Skill Videos
            </h3>
            
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Add video URLs (YouTube, Vimeo, etc.) showcasing your skills. Matched users will be able to see these videos!
            </p>

            {/* Existing Videos */}
            {existingVideos && Object.keys(existingVideos).length > 0 && (
                <div className="mb-6">
                    <h4 className="text-md font-semibold text-gray-700 dark:text-gray-200 mb-2">
                        Your Skill Videos:
                    </h4>
                    <div className="space-y-2">
                        {Object.entries(existingVideos).map(([skill, url]) => (
                            <div
                                key={skill}
                                className="flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-700 rounded-lg"
                            >
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                    {skill}
                                </span>
                                <button
                                    onClick={() => handleDeleteVideo(skill)}
                                    className="px-3 py-1 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg"
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Skill Selection */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Select Skill:
                </label>
                <select
                    value={selectedSkill}
                    onChange={(e) => setSelectedSkill(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500"
                >
                    <option value="">-- Select a skill --</option>
                    {userSkills.map((skill, index) => (
                        <option key={index} value={skill}>
                            {skill}
                        </option>
                    ))}
                </select>
            </div>

            {/* URL Input */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Video URL (YouTube, Vimeo, Google Drive, etc.):
                </label>
                <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Tip: Upload your video to YouTube (can be unlisted) and paste the link here
                </p>
            </div>

            {/* Upload Button */}
            <button
                onClick={handleUpload}
                className="w-full px-6 py-3 text-white bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm dark:bg-purple-500 dark:hover:bg-purple-600"
            >
                Add Video
            </button>
        </div>
    );
};

export default VideoUpload;
