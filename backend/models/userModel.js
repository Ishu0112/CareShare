const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    bio: {
        type: String
    },
    username: {
        type: String,
        require: true,
        minlength: 4
    },
    skills: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skill'
    }],
    interests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skill'
    }],
    matchRequests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    matches: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    rejected: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    notifications: [{
        type: String
    }],
    skillVideos: {
        type: Map,
        of: String,
        default: new Map()
    },
    tokens: {
        type: Number,
        default: 100
    },
    videoRatings: {
        type: Map,
        of: [{
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            rating: {
                type: Number,
                min: 1,
                max: 5
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }],
        default: new Map()
    },
    skillTests: [{
        skill: {
            type: String,
            required: true
        },
        score: {
            type: Number,
            required: true
        },
        totalQuestions: {
            type: Number,
            required: true
        },
        timeTaken: {
            type: Number, // in seconds
            required: true
        },
        passed: {
            type: Boolean,
            required: true
        },
        certificateId: {
            type: String
        },
        completedAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {timestamps: true})

const User = mongoose.model('User', userSchema)
module.exports = User