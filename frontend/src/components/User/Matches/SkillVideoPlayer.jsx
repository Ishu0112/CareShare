import React, { useState, useRef, useEffect } from 'react';
import Axios from 'axios';
import { useAlert } from '../../utils/AlertProvider';
import { useUser } from '../../utils/UserProvider';
import VideoRating from './VideoRating';

const SkillVideoPlayer = ({ skill, videoUrl, videoOwnerUsername }) => {
    const [hasWatched, setHasWatched] = useState(false);
    const [isLocked, setIsLocked] = useState(false);
    const [showVideo, setShowVideo] = useState(false);
    const [averageRating, setAverageRating] = useState(0);
    const [totalRatings, setTotalRatings] = useState(0);
    const [userRating, setUserRating] = useState(0);
    const videoRef = useRef(null);
    const { setAlert } = useAlert();
    const { userData } = useUser();

    // Fetch existing ratings when component mounts
    useEffect(() => {
        if (videoOwnerUsername) {
            fetchRatings();
        }
    }, [videoOwnerUsername, skill]);

    const fetchRatings = async () => {
        try {
            const response = await Axios.get(
                `${import.meta.env.VITE_BACKEND_URL}user/video-ratings/${videoOwnerUsername}/${skill}`
            );
            
            if (response.status === 200) {
                setAverageRating(response.data.averageRating);
                setTotalRatings(response.data.totalRatings);
                
                // Find current user's rating if exists
                const currentUsername = userData?.username;
                if (currentUsername) {
                    const myRating = response.data.ratings.find(r => r.username === currentUsername);
                    if (myRating) {
                        setUserRating(myRating.rating);
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching ratings:', error);
        }
    };

    const handleRatingUpdate = (newAverage, newTotal, newUserRating) => {
        setAverageRating(newAverage);
        setTotalRatings(newTotal);
        setUserRating(newUserRating);
    };

    // Function to extract YouTube video ID
    const getYouTubeId = (url) => {
        const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = url.match(regex);
        return match ? match[1] : null;
    };

    // Function to check if URL is a YouTube link
    const isYouTube = (url) => {
        return url.includes('youtube.com') || url.includes('youtu.be');
    };

    // Function to check if URL is a Vimeo link
    const isVimeo = (url) => {
        return url.includes('vimeo.com');
    };

    // Function to extract Vimeo video ID
    const getVimeoId = (url) => {
        const regex = /vimeo\.com\/(\d+)/;
        const match = url.match(regex);
        return match ? match[1] : null;
    };

    // Handle video watch - deduct/credit tokens
    const handleVideoWatch = async () => {
        if (hasWatched || !videoOwnerUsername) return;

        try {
            const response = await Axios.post(
                `${import.meta.env.VITE_BACKEND_URL}user/watch-video`,
                {
                    videoOwnerUsername: videoOwnerUsername,
                    skillName: skill
                }
            );

            if (response.status === 200) {
                setHasWatched(true);
                setShowVideo(true);
                setAlert({
                    message: `${response.data.message}. You have ${response.data.newTokenBalance} tokens remaining.`,
                    type: 'success'
                });
                // Reload token balance in navbar by triggering a custom event
                window.dispatchEvent(new CustomEvent('tokenUpdate'));
            }
        } catch (error) {
            console.error('Error recording video view:', error);
            if (error.response?.status === 403) {
                setAlert({
                    message: error.response.data.message || 'Insufficient tokens to watch this video',
                    type: 'warning'
                });
                setIsLocked(true);
            } else if (error.response?.status === 400) {
                setAlert({
                    message: error.response.data.message,
                    type: 'warning'
                });
            } else {
                setAlert({
                    message: 'Failed to record video view',
                    type: 'error'
                });
            }
        }
    };

    const handleUnlockClick = () => {
        handleVideoWatch();
    };

    const renderVideo = () => {
        // If no videoOwnerUsername, it's user's own video - show directly
        if (!videoOwnerUsername) {
            if (isYouTube(videoUrl)) {
                const videoId = getYouTubeId(videoUrl);
                if (videoId) {
                    return (
                        <iframe
                            className="w-full aspect-video rounded-lg"
                            src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1`}
                            title={`${skill} video`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    );
                }
            } else if (isVimeo(videoUrl)) {
                const videoId = getVimeoId(videoUrl);
                if (videoId) {
                    return (
                        <iframe
                            className="w-full aspect-video rounded-lg"
                            src={`https://player.vimeo.com/video/${videoId}`}
                            title={`${skill} video`}
                            frameBorder="0"
                            allow="autoplay; fullscreen; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    );
                }
            }
            return (
                <video
                    ref={videoRef}
                    className="w-full rounded-lg"
                    controls
                    src={videoUrl}
                >
                    Your browser does not support the video tag.
                </video>
            );
        }

        // For other user's videos - require token payment
        if (isLocked) {
            return (
                <div className="w-full aspect-video rounded-lg bg-gray-800 flex items-center justify-center">
                    <div className="text-center text-white">
                        <span className="text-6xl mb-4 block">🔒</span>
                        <p className="text-xl font-bold">Insufficient Tokens</p>
                        <p className="text-sm mt-2">You need 5 tokens to watch this video</p>
                    </div>
                </div>
            );
        }

        // Show unlock button before video is paid for
        if (!showVideo && !hasWatched) {
            return (
                <div className="w-full aspect-video rounded-lg bg-gradient-to-br from-purple-900 to-blue-900 flex items-center justify-center cursor-pointer hover:from-purple-800 hover:to-blue-800 transition-all"
                     onClick={handleUnlockClick}>
                    <div className="text-center text-white">
                        <span className="text-6xl mb-4 block">▶️</span>
                        <p className="text-xl font-bold mb-2">Click to Watch</p>
                        <div className="flex items-center justify-center bg-yellow-500 text-black px-4 py-2 rounded-full font-bold">
                            <span className="text-2xl mr-2">🪙</span>
                            <span>5 Tokens</span>
                        </div>
                        <p className="text-xs mt-3 opacity-75">You'll be charged when you click</p>
                    </div>
                </div>
            );
        }

        // Show video after payment
        if (isYouTube(videoUrl)) {
            const videoId = getYouTubeId(videoUrl);
            if (videoId) {
                return (
                    <iframe
                        className="w-full aspect-video rounded-lg"
                        src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1`}
                        title={`${skill} video`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                );
            }
        } else if (isVimeo(videoUrl)) {
            const videoId = getVimeoId(videoUrl);
            if (videoId) {
                return (
                    <iframe
                        className="w-full aspect-video rounded-lg"
                        src={`https://player.vimeo.com/video/${videoId}`}
                        title={`${skill} video`}
                        frameBorder="0"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                );
            }
        }

        // Default video player for direct video files
        return (
            <video
                ref={videoRef}
                className="w-full rounded-lg"
                controls
                src={videoUrl}
            >
                Your browser does not support the video tag.
            </video>
        );
    };

    return (
        <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
                <span className="inline-block px-3 py-1 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                    {skill}
                </span>
                <div className="flex items-center gap-3">
                    {/* Average Rating Display */}
                    {videoOwnerUsername && totalRatings > 0 && (
                        <div className="flex items-center gap-1">
                            <svg className="w-5 h-5 fill-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                {averageRating} ({totalRatings})
                            </span>
                        </div>
                    )}
                    {hasWatched && (
                        <span className="text-xs text-green-600 dark:text-green-400 font-semibold">
                            ✓ Watched
                        </span>
                    )}
                </div>
            </div>
            {renderVideo()}
            
            {!isLocked && !hasWatched && videoOwnerUsername && !showVideo && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    💡 Click the video to watch. {videoOwnerUsername} will earn 5 tokens.
                </p>
            )}
            
            {/* Rating Component - Show for matched users (regardless of watch status) */}
            {videoOwnerUsername && (
                <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-600">
                    <VideoRating
                        skill={skill}
                        videoOwnerUsername={videoOwnerUsername}
                        currentUserRating={userRating}
                        onRatingUpdate={handleRatingUpdate}
                    />
                </div>
            )}
        </div>
    );
};

export default SkillVideoPlayer;
