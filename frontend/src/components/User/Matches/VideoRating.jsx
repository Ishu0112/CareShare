import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import { useAlert } from '../../utils/AlertProvider'

Axios.defaults.withCredentials = true

export default function VideoRating({ skill, videoOwnerUsername, currentUserRating, onRatingUpdate }) {
    const [rating, setRating] = useState(currentUserRating || 0)
    const [hoveredRating, setHoveredRating] = useState(0)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { setAlert } = useAlert()

    useEffect(() => {
        setRating(currentUserRating || 0)
    }, [currentUserRating])

    const handleRatingClick = async (selectedRating) => {
        setIsSubmitting(true)
        try {
            const response = await Axios.post(
                `${import.meta.env.VITE_BACKEND_URL}user/rate-video`,
                {
                    videoOwnerUsername,
                    skill,
                    rating: selectedRating
                }
            )

            if (response.status === 200) {
                setRating(selectedRating)
                setAlert({
                    message: `Rating submitted: ${selectedRating} stars`,
                    type: 'success'
                })
                
                // Call parent callback to update average rating
                if (onRatingUpdate) {
                    onRatingUpdate(response.data.averageRating, response.data.totalRatings, selectedRating)
                }
            }
        } catch (error) {
            console.error('Error submitting rating:', error)
            console.error('Error details:', error.response?.data)
            setAlert({
                message: error.response?.data?.message || 'Failed to submit rating',
                type: 'warning'
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex flex-col items-center gap-2 mt-3">
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        onClick={() => handleRatingClick(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        disabled={isSubmitting}
                        className="focus:outline-none transition-transform hover:scale-110 disabled:opacity-50"
                    >
                        <svg
                            className={`w-8 h-8 ${
                                star <= (hoveredRating || rating)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'fill-gray-300 dark:fill-gray-600 text-gray-300 dark:text-gray-600'
                            }`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="1"
                        >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                    </button>
                ))}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
                {rating > 0 ? `Your rating: ${rating} stars` : 'Click to rate this video'}
            </p>
        </div>
    )
}
