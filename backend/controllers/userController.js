const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const Skill = require("../models/skillModel");
const authCheck = require("../middlewares/authCheck");
const jwt = require("jsonwebtoken");
const tokenize = require("../utils/tokenizer");
const { generateUsername } = require("unique-username-generator"); // https://www.npmjs.com/package/unique-username-generator

async function getUniqueUsername() {
  let username, condition;
  do {
    username = generateUsername("", 0, 15);
    condition = await User.findOne({ username });
  } while (condition);
  return username;
}

const login = async (req, res) => {
  try {
    const allSkills = await Skill.find();

    const userExists = await User.findOne({ email: req.body.email });
    if (!userExists) {
      return res.status(404).send("User does not exist");
    }
    const passwordMatches = await bcrypt.compare(
      req.body.password,
      userExists.password
    );
    if (!passwordMatches) {
      return res.status(401).send("wrong password or email address");
    }
    const matchNames = await Promise.all(
      userExists.matches.map(async (element) => {
        const user = await User.findOne({ _id: element });
        return user.username;
      })
    );
    const expiresInMs = 3600000 * 1; // 1 hr = 3600000 ms
    if (userExists && passwordMatches) {
      const token = tokenize(
        userExists.username,
        userExists.email,
        expiresInMs
      );
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: expiresInMs,
        sameSite: "None",
        secure: true,
      });
      // console.log(`token : ${token}`)
      console.log("\nUser logged in successfully.\n");
      const profile = {
        _id: userExists._id, // Added: Include user ID for chat functionality
        fname: userExists.fname,
        lname: userExists.lname,
        username: userExists.username,
        email: userExists.email,
        skills: userExists.skills.map(
          (element) => allSkills.find((skill) => skill._id.equals(element)).name
        ),
        interests: userExists.interests.map(
          (element) =>
            allSkills.find((interest) => interest._id.equals(element)).name
        ),
        matches: matchNames,
        bio: userExists.bio,
        notifications: userExists.notifications,
        skillVideos: userExists.skillVideos
          ? Object.fromEntries(userExists.skillVideos)
          : {},
        tokens: userExists.tokens || 100,
      };
      return res.status(200).json(profile);
    } else {
      res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      });
      return res.status(400).json("Invalid user  OR  wrong username-password ");
    }
  } catch (e) {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    return res.status(500).json({ message: e.message });
  }
};

const registerUser = async (req, res) => {
  const username = await getUniqueUsername();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  try {
    if (
      req.body.fname &&
      req.body.fname.length < 20 &&
      req.body.lname &&
      req.body.lname.length < 20 &&
      req.body.email &&
      emailRegex.test(req.body.email) &&
      req.body.password &&
      req.body.password.length > 6 &&
      req.body.password.length < 20
    ) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const newUser = await User.create({
        ...req.body,
        password: hashedPassword,
        username: username,
      });
      console.log("User created !!");
      res.status(200).json("User created !");
    } else {
      console.log("\nRejected user creation, input criteria not followed !\n");
      return res.status(401).send({
        message: "Rejected user creation, input criteria not followed !",
      });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// fetch a profile using ID or username (ONLY FOR LOGGEDIN USER)
const viewProfile = async (req, res) => {
  try {
    // Fetching list of skills
    const allSkills = await Skill.find();

    let query = "";

    if (req.body._id) {
      query = { _id: req.body._id };
    } else if (req.body.username) {
      query = { username: req.body.username };
    }

    let thisUser;
    if (query)
      thisUser = await User.findOne(query)
        .populate("skills")
        .populate("interests");

    if (!thisUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const matchNames = await Promise.all(
      thisUser.matches.map(async (element) => {
        const user = await User.findOne({ _id: element });
        return user.username;
      })
    );

    const profile = {
      _id: thisUser._id, // Added: Include user ID for chat functionality
      fname: thisUser.fname,
      lname: thisUser.lname,
      username: thisUser.username,
      email: thisUser.email,
      skills: thisUser.skills,
      interests: thisUser.interests,
      matches: matchNames,
      bio: thisUser.bio,
      notifications: thisUser.notifications,
      skillVideos: thisUser.skillVideos
        ? Object.fromEntries(thisUser.skillVideos)
        : {},
      tokens: thisUser.tokens || 100,
    };
    res.status(200).json(profile);
  } catch (err) {
    console.log("\nFailed to fetch user details !\n");
    res.status(400).json({ error: err.message });
  }
};

// outputs lists of matchs (fullname + id)
const getMatches = async (req, res) => {
  try {
    const thisUser = await User.findOne({ _id: req.body._id });

    const matchList = await Promise.all(
      thisUser.matches.map((id) => User.findOne({ _id: id }))
    );
    const matches = matchList.map((match) => {
      return {
        _id: match._id, // Added: Include user ID for chat functionality
        name: `${match.fname} ${match.lname}`,
        username: match.username,
        skillVideos: match.skillVideos
          ? Object.fromEntries(match.skillVideos)
          : {},
      };
    });
    console.log(matches);

    if (matches.length > 0) {
      res.status(200).json(matches);
    } else {
      res.status(201).json("No matches yet :(");
    }
  } catch (err) {
    console.log("\nError finding matches !\n");
    res.status(400).json({ error: err.message });
  }
};

const editUserProfile = async (req, res) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  try {
    const { fname, lname, email, username, bio, skills, interests } = req.body;
    const userId = req.user._id;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (username.length > 15 || username < 4) {
      return res.status(400).json({
        message: "Username should be between 3 and 15 characters in length",
      });
    }

    const existingUser = await User.findOne({
      username: username,
      _id: { $ne: userId },
    });
    if (existingUser) {
      return res.status(400).json({ message: "Username is already taken" });
    }

    const existingEmail = await User.findOne({
      email: email,
      _id: { $ne: userId },
    });
    if (existingEmail) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { fname, lname, username, bio, email, skills, interests },
      { new: true }
    );

    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    const token = tokenize(username, email);
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 3600000 * 1,
      sameSite: "None",
      secure: true,
    });

    return res.status(200).json({ message: "Profile updated successfully" });
  } catch (e) {
    return res.status(400).json({ message: e });
  }
};

const updateUserSkills = async (req, res) => {
  try {
    const userId = req.user._id;
    let { skills } = req.body;

    if (!userId || !skills) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields." });
    }
    if (!Array.isArray(skills)) {
      skills = [skills]; // Convert to array with single element
    }
    const skillObjects = await Promise.all(
      skills.map(async (skillName) => {
        const skill = await Skill.findOne({ name: skillName });
        if (skill) {
          return skill._id; // Return the ObjectId of the existing skill
        }
      })
    );

    // Remove any undefined elements from the array
    const existingSkillIds = skillObjects.filter(Boolean);
    await User.findByIdAndUpdate(userId, {
      $addToSet: { skills: existingSkillIds },
    });

    return res.status(200).send({
      success: true,
      message: "Skills and interests updated successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

const updateUserInterests = async (req, res) => {
  try {
    const userId = req.user._id;
    let { interests } = req.body;

    if (!userId || !interests) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields." });
    }

    if (!Array.isArray(interests)) {
      interests = [interests]; // Convert to array with single element
    }
    console.log(interests);
    const skillObjects = await Promise.all(
      interests.map(async (interestName) => {
        const skill = await Skill.findOne({ name: interestName });
        if (skill) {
          return skill._id; // Return the ObjectId of the existing skill
        }
      })
    );

    // Remove any undefined elements from the array
    const existingInterestIds = skillObjects.filter(Boolean);
    await User.findByIdAndUpdate(userId, {
      $addToSet: { interests: existingInterestIds },
    });

    return res
      .status(200)
      .send({ success: true, message: "Interests updated successfully." });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    res.status(200).json({ message: "Logged out successfully !" });
  } catch (err) {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    res.status(400).json({ message: "Failed to logout !" });
  }
};

const getNotifications = async (req, res) => {
  try {
    const notifications = req.user.notifications;
    res.status(200).json({ notifications: notifications });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Save video URL for a skill
const saveSkillVideoUrl = async (req, res) => {
  try {
    const userId = req.user._id;
    const { skill, videoUrl } = req.body;

    if (!skill || !videoUrl) {
      return res
        .status(400)
        .json({ message: "Skill and video URL are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Initialize skillVideos if it doesn't exist
    if (!user.skillVideos) {
      user.skillVideos = new Map();
    }

    // Add or update the video URL for the skill
    user.skillVideos.set(skill, videoUrl);
    await user.save();

    return res.status(200).json({
      message: "Video URL saved successfully",
      videoUrl: videoUrl,
    });
  } catch (error) {
    console.error("Error saving video URL:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Delete video for a skill
const deleteSkillVideo = async (req, res) => {
  try {
    const userId = req.user._id;
    const { skill } = req.body;

    if (!skill) {
      return res.status(400).json({ message: "Skill is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.skillVideos && user.skillVideos.has(skill)) {
      user.skillVideos.delete(skill);
      await user.save();
    }

    return res.status(200).json({ message: "Video deleted successfully" });
  } catch (error) {
    console.error("Error deleting video:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Upload video file endpoint (for future implementation with multer/cloudinary)
const uploadSkillVideo = async (req, res) => {
  try {
    // This endpoint will be implemented when you add multer and cloudinary
    // For now, return a placeholder response
    return res.status(501).json({
      message:
        "File upload not yet implemented. Please use URL upload instead.",
      tip: "You can upload videos to YouTube, Vimeo, or Google Drive and paste the link!",
    });
  } catch (error) {
    console.error("Error uploading video:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Watch video - deduct tokens from viewer, add tokens to video owner
const watchVideo = async (req, res) => {
  try {
    const viewerId = req.user._id;
    const { videoOwnerUsername, skillName } = req.body;

    if (!videoOwnerUsername || !skillName) {
      return res
        .status(400)
        .json({ message: "Video owner username and skill name are required" });
    }

    // Find the video owner
    const videoOwner = await User.findOne({ username: videoOwnerUsername });
    if (!videoOwner) {
      return res.status(404).json({ message: "Video owner not found" });
    }

    // Check if viewer is trying to watch their own video
    if (viewerId.equals(videoOwner._id)) {
      return res
        .status(400)
        .json({
          message: "You cannot earn tokens by watching your own videos",
        });
    }

    const viewer = await User.findById(viewerId);

    // Token cost per video view
    const TOKEN_COST = 5;
    const TOKEN_REWARD = 5;

    // Check if viewer has enough tokens
    if (viewer.tokens < TOKEN_COST) {
      return res.status(403).json({
        message: "Insufficient tokens to watch this video",
        currentTokens: viewer.tokens,
        required: TOKEN_COST,
      });
    }

    // Deduct tokens from viewer
    viewer.tokens -= TOKEN_COST;

    // Add tokens to video owner
    videoOwner.tokens += TOKEN_REWARD;

    // Add notifications
    viewer.notifications.push(
      `🎬 You spent ${TOKEN_COST} tokens watching ${videoOwner.username}'s ${skillName} video`
    );
    videoOwner.notifications.push(
      `💰 You earned ${TOKEN_REWARD} tokens! ${viewer.username} watched your ${skillName} video`
    );

    await viewer.save();
    await videoOwner.save();

    return res.status(200).json({
      message: "Video view recorded successfully",
      newTokenBalance: viewer.tokens,
      tokensSpent: TOKEN_COST,
    });
  } catch (error) {
    console.error("Error recording video view:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get user's token balance
const getTokenBalance = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      tokens: user.tokens || 100,
      username: user.username,
    });
  } catch (error) {
    console.error("Error fetching token balance:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Rate a video
const rateVideo = async (req, res) => {
  try {
    // req.user is set by authCheck middleware
    const { videoOwnerUsername, skill, rating } = req.body;
    const raterId = req.user._id;
    const raterUsername = req.user.username;

    console.log("Rating request received:", { videoOwnerUsername, skill, rating, raterUsername });

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    // Get the video owner
    const videoOwner = await User.findOne({ username: videoOwnerUsername });

    console.log("Video owner found:", videoOwner ? videoOwner.username : "NOT FOUND");

    if (!videoOwner) {
      return res.status(404).json({ message: "Video owner not found" });
    }

    // Check if users are matched
    const areMatched = req.user.matches.some(matchId => matchId.equals(videoOwner._id));
    console.log("Are users matched?", areMatched);
    
    if (!areMatched) {
      return res.status(403).json({ message: "You can only rate videos of matched users" });
    }

    // Check if video exists for the skill
    if (!videoOwner.skillVideos || !videoOwner.skillVideos.get(skill)) {
      console.log("Video not found for skill:", skill);
      return res.status(404).json({ message: "Video not found for this skill" });
    }

    console.log("Video exists for skill:", skill);

    // Initialize videoRatings if not exists
    if (!videoOwner.videoRatings) {
      videoOwner.videoRatings = new Map();
    }

    // Get existing ratings for this skill
    let skillRatings = videoOwner.videoRatings.get(skill) || [];
    console.log("Existing ratings for this skill:", skillRatings.length);

    // Check if user already rated this video
    const existingRatingIndex = skillRatings.findIndex(
      r => r.userId.equals(raterId)
    );

    if (existingRatingIndex !== -1) {
      // Update existing rating
      console.log("Updating existing rating from", skillRatings[existingRatingIndex].rating, "to", rating);
      skillRatings[existingRatingIndex].rating = rating;
      skillRatings[existingRatingIndex].createdAt = new Date();
    } else {
      // Add new rating
      console.log("Adding new rating:", rating);
      skillRatings.push({
        userId: raterId,
        rating: rating,
        createdAt: new Date()
      });
    }

    // Update the map
    videoOwner.videoRatings.set(skill, skillRatings);
    videoOwner.markModified('videoRatings');
    await videoOwner.save();

    console.log("Rating saved successfully");

    // Calculate average rating for this skill
    const totalRatings = skillRatings.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = (totalRatings / skillRatings.length).toFixed(1);

    console.log("Average rating:", averageRating, "Total ratings:", skillRatings.length);

    // Add notification to video owner
    videoOwner.notifications.push(
      `${raterUsername} rated your ${skill} video: ${rating} stars`
    );
    await videoOwner.save();

    return res.status(200).json({
      message: "Rating submitted successfully",
      averageRating: parseFloat(averageRating),
      totalRatings: skillRatings.length
    });
  } catch (error) {
    console.error("Error rating video:", error);
    return res.status(500).json({ message: "Failed to rate video", error: error.message });
  }
};

// Get video ratings
const getVideoRatings = async (req, res) => {
  try {
    const { username, skill } = req.params;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const skillRatings = user.videoRatings?.get(skill) || [];

    if (skillRatings.length === 0) {
      return res.status(200).json({
        averageRating: 0,
        totalRatings: 0,
        ratings: []
      });
    }

    // Calculate average
    const totalRatings = skillRatings.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = (totalRatings / skillRatings.length).toFixed(1);

    // Populate user info for ratings
    const ratingsWithUsers = await Promise.all(
      skillRatings.map(async (r) => {
        const raterUser = await User.findById(r.userId).select('username fname lname');
        return {
          username: raterUser?.username,
          fname: raterUser?.fname,
          lname: raterUser?.lname,
          rating: r.rating,
          createdAt: r.createdAt
        };
      })
    );

    return res.status(200).json({
      averageRating: parseFloat(averageRating),
      totalRatings: skillRatings.length,
      ratings: ratingsWithUsers
    });
  } catch (error) {
    console.error("Error fetching ratings:", error);
    return res.status(500).json({ message: "Failed to fetch ratings" });
  }
};

// Get all video ratings for a user (for their profile)
const getAllVideoRatings = async (req, res) => {
  try {
    // req.user is set by authCheck middleware
    const user = req.user;

    if (!user || !user.videoRatings) {
      return res.status(200).json({});
    }

    const ratingsData = {};
    
    for (const [skill, ratings] of user.videoRatings.entries()) {
      if (ratings.length > 0) {
        const totalRatings = ratings.reduce((sum, r) => sum + r.rating, 0);
        const averageRating = (totalRatings / ratings.length).toFixed(1);
        
        ratingsData[skill] = {
          averageRating: parseFloat(averageRating),
          totalRatings: ratings.length
        };
      }
    }

    return res.status(200).json(ratingsData);
  } catch (error) {
    console.error("Error fetching all ratings:", error);
    return res.status(500).json({ message: "Failed to fetch ratings" });
  }
};

module.exports = {
  registerUser,
  viewProfile,
  getMatches,
  login,
  editUserProfile,
  updateUserSkills,
  updateUserInterests,
  logout,
  getNotifications,
  saveSkillVideoUrl,
  deleteSkillVideo,
  uploadSkillVideo,
  watchVideo,
  getTokenBalance,
  rateVideo,
  getVideoRatings,
  getAllVideoRatings,
};
