import User from "../models/user.model.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving users" });
  }
};


export const updateActiveUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.is_verified = !user.is_verified;
    const updatedUser = await user.save();

    res.json(updatedUser);
  } catch (error) {
    return res.status(500).json({ message: "Error updating user" });
  }
};
