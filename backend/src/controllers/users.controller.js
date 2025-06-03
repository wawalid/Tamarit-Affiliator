import User from "../models/user.model.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({is_admin: false});
    res.json(users);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving users" });
  }
};

export const getUserbyID = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id, {is_admin: false, password: false});
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving user" });
  }
}



export const updateActiveUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (user.is_admin) {
      return res.status(400).json({ message: "Cannot update admin user" });
    }

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
