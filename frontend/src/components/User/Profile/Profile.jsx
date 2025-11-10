import { React, useEffect, useState } from 'react'
import Axios from 'axios'
import { useNavigate } from 'react-router-dom'
import DataRow from './DataRow'
import { useUser } from '../../utils/UserProvider'
import { defaultUser } from '../../utils/defaultUser'
import { useAlert } from '../../utils/AlertProvider'
import SkillRow from './SkillRow'
import PageHeading from '../../utils/PageHeading'
import { useLoading } from '../../utils/LoadingProvider'
import SkillVideoPlayer from '../Matches/SkillVideoPlayer'

Axios.defaults.withCredentials = true


export default function Profile() {
    const { userData, setUserData } = useUser()
    const navigate = useNavigate()
    const fieldsNotToDisplay = ['notifications', 'matches', 'skillVideos']
    const { alert, setAlert } = useAlert()
    const { isLoading, setIsLoading} = useLoading()
    const [videoRatings, setVideoRatings] = useState({})

    useEffect(() => {
        const handleFetch = async () => {
            setIsLoading(true)
            try {
                const response = await Axios.get(`${import.meta.env.VITE_BACKEND_URL}user/profile`)

                if (response.status === 200) {
                    console.log('Profile fetched successfully:', response.data)
                    setUserData({
                        ...userData,
                        ...response.data
                    })
                    
                    // Fetch video ratings
                    fetchVideoRatings()
                } else if (response.status === 300) {
                    console.log('Token is invalid or expired.')
                    setAlert({
                        message: "Invalid token."
                    })
                } else {
                    console.log('Fetch not working')
                    setAlert({
                        message: "Couldn't fetch profile."
                    })
                }
                setIsLoading(false)
            } catch (error) {
                console.error('Fetching profile failed:', error)
                setAlert({
                    message: "Fetching profile failed",
                    type: "warning"
                })
                setUserData({ ...defaultUser })
                console.log('Redirecting to login page.')
                navigate('/user/login')
                setIsLoading(false)
            }
            setIsLoading(false)
        }

        handleFetch()
    }, [])

    const fetchVideoRatings = async () => {
        try {
            const response = await Axios.get(`${import.meta.env.VITE_BACKEND_URL}user/all-video-ratings`)
            if (response.status === 200) {
                setVideoRatings(response.data)
            }
        } catch (error) {
            console.error('Error fetching video ratings:', error)
        }
    }


    useEffect(() => {
        console.log('Updated userData:', userData);
    }, [userData])


    function handleClick() {
        navigate('/user/profile-update')
    }

    const hasVideos = userData.skillVideos && Object.keys(userData.skillVideos).length > 0;

    return (
        <div className="flex items-center justify-center w-full">
            
            <div className='flex flex-col my-5'>

                <PageHeading>Profile</PageHeading>

                <div className="w-full max-w-lg border-2 border-blue-600 dark:border-blue-500 rounded-lg shadow bg-slate-200 dark:bg-gray-900 mb-5">
                    <div className="flex flex-col items-center p-10">

                        <h1 className="text-right mb-1 text-xl font-bold text-blue-600 dark:text-blue-500 w-full">{`@ ${userData.username.toLowerCase()}`}</h1>


                        <div className="flex flex-col justify-between items-center py-5 w-full">
                            {Object.keys(userData).map((myKey, itr) => {
                                if (!fieldsNotToDisplay.includes(myKey)) {
                                    if (myKey === 'skills' || myKey === 'interests') {
                                        return <SkillRow key={itr} dataType={myKey} dataVal={userData[myKey]} />
                                    } else {
                                        return <DataRow key={itr} dataType={myKey} dataVal={userData[myKey]} />
                                    }
                                }
                            })}
                        </div>

                        <button onClick={handleClick} className='text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-lg px-7 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'>EDIT</button>

                    </div>
                </div>

                {/* User's Own Skill Videos */}
                {hasVideos && (
                    <div className="w-full max-w-lg border-2 border-purple-500 dark:border-purple-400 rounded-lg shadow bg-slate-200 dark:bg-gray-900 mb-5">
                        <div className="p-10">
                            <h2 className="text-xl font-bold text-purple-600 dark:text-purple-400 mb-4">
                                Your Skill Videos
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                                These videos are visible to your matched users!
                            </p>
                            <div className="space-y-4">
                                {Object.entries(userData.skillVideos).map(([skill, videoUrl]) => (
                                    <div key={skill}>
                                        <SkillVideoPlayer
                                            skill={skill}
                                            videoUrl={videoUrl}
                                        />
                                        {/* Display rating for this video */}
                                        {videoRatings[skill] && (
                                            <div className="mt-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <svg className="w-6 h-6 fill-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                                        </svg>
                                                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                                                            {videoRatings[skill].averageRating}
                                                        </span>
                                                    </div>
                                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                                        {videoRatings[skill].totalRatings} {videoRatings[skill].totalRatings === 1 ? 'rating' : 'ratings'}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}
