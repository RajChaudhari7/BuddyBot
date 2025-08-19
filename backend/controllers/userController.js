import { geminiResponse } from "../gemini.js";
import User from "../models/User.js";
import { v2 as cloudinary } from "cloudinary";
import moment from 'moment'

// Get current user
export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Backend: Update Assistant
export const updateAssistant = async (req, res) => {
  try {
    const { assistantName, imageUrl } = req.body;
    let assistantImage;

    if (req.file) {
      // Upload image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "assistants",
      });
      assistantImage = result.secure_url; // Use the Cloudinary URL
    } else {
      assistantImage = imageUrl; // Fallback to the provided URL if no new file
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { assistantName, assistantImage },
      { new: true }
    ).select("-password");

    res.json({ success: true, user });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// controller for assistant
export const askToAssistant = async (req, res) => {
  try {

    const { command } = req.body;
    const user = await User.findById(req.userId);
    user.history.push(command)
    user.save()
    const userName = user.name
    const assistantName = user.assistantName
    const result = await geminiResponse(command, assistantName, userName)

    const jsonMatch = result.match(/{[\s\S]*}/)
    if (!jsonMatch) {
      return res.json({ success: false, message: "Sorry I Can't Understand" })
    }

    const gemResult = JSON.parse(jsonMatch[0])
    const type = gemResult.type

    switch (type) {
      case 'get_date':
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `Current date is ${moment().format("YYYY-MM-DD")}`
        });

      case 'get_time':
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `Current time is ${moment().format("hh:mm A")}`
        });

      case 'get_day':
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `Today is ${moment().format("dddd")}`
        });

      case 'get_month':
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `This month is ${moment().format("MMMM")}`
        });

      case 'google_search':
      case 'youtube_search':
      case 'youtube_play':
      case 'general':
      case 'calculator_open':
      case 'instagram_open':
      case 'facebook_open':
      case 'weather_show':
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: gemResult.response,
        })

      default:
        return res.json({ success: false, message: "I didn't understand the command." })
    }
  } catch (error) {
    return res.json({ success: false, response: "ask assistant error" })
  }
}
