import User from "../models/user.model.js";

export const getUsers = async (req,res) =>{
    try {
      const users = await User.find({});
      res.json(users);
    } catch (error) {
      return res.status(500).json({ message: "Error retrieving users" });
    }
  }
  