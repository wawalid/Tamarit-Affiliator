import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { createAccessToken } from "../libs/jwt.js";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

export const register = async (req, res) => {
  const { email, password, username } = req.body;

  try {
    const userFound = await User.findOne({ email });
    if (userFound) return res.status(400).json(["email is already in use"]);

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: passwordHash,
    });

    const userSaved = await newUser.save();
    const token = await createAccessToken({ id: userSaved._id });

    res.cookie("token", token);
    res.cookie(
      "user",
      JSON.stringify({
        username: newUser.username,
        email: newUser.email,
      })
    );
    res.json({
      id: userSaved._id,
      createdAt: userSaved.createdAt,
      updatedAt: userSaved.updatedAt,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userFound = await User.findOne({ email });
    if (!userFound) return res.status(400).json(["User not found"]);

    const isMatch = await bcrypt.compare(password, userFound.password);

    if (!isMatch) return res.status(400).json(["Invalid password"]);

    const token = await createAccessToken({ id: userFound._id });

    res.cookie("token", token);
    res.cookie(
      "user",
      JSON.stringify({
        username: userFound.username,
        email: userFound.email,
        completado: userFound.completado,
        dni: userFound.dni,
        cuenta_bancaria: userFound.cuenta_bancaria,
        identidad: userFound.identidad,
      })
    );

    res.json({
      id: userFound._id,
      createdAt: userFound.createdAt,
      updatedAt: userFound.updatedAt,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const logout = async (req, res) => {
  res.cookie("token", "", { expires: new Date(0) });
  res.cookie("user", "", { expires: new Date(0) });
  return res.sendStatus(200);
};

export const profile = async (req, res) => {
  const userFound = await User.findById(req.user.id);

  if (!userFound) return res.status(400).json({ message: "User not found" });

  return res.json({
    id: userFound._id,
    username: userFound.username,
    email: userFound.email,
    createdAt: userFound.createdAt,
    updatedAt: userFound.updatedAt,
  });
};

export const updateUser = async (req, res) => {
  const { username, email, password, dni, cuenta_bancaria, identidad } =
    req.body;
  const userFound = await User.findById(req.user.id);

  if (!userFound) return res.status(400).json({ message: "User not found" });

  if (username) userFound.username = username;
  if (email) userFound.email = email;
  if (password) userFound.password = await bcrypt.hash(password, 10);
  if (dni !== undefined) userFound.dni = dni;
  if (cuenta_bancaria !== undefined)
    userFound.cuenta_bancaria = cuenta_bancaria;
  if (identidad !== undefined) userFound.identidad = identidad;

  const completado = Boolean(
    userFound.dni && userFound.cuenta_bancaria && userFound.identidad
  );
  userFound.completado = completado;

  const updatedUser = await userFound.save();

  res.cookie(
    "user",
    JSON.stringify({
      username: updatedUser.username,
      email: updatedUser.email,
      completado: updatedUser.completado,
      dni: updatedUser.dni,
      cuenta_bancaria: updatedUser.cuenta_bancaria,
      identidad: updatedUser.identidad,
    })
  );

  return res.json({
    id: updatedUser._id,
    username: updatedUser.username,
    email: updatedUser.email,
    dni: updatedUser.dni,
    cuenta_bancaria: updatedUser.cuenta_bancaria,
    identidad: updatedUser.identidad,
    completado: updatedUser.completado,
    createdAt: updatedUser.createdAt,
    updatedAt: updatedUser.updatedAt,
  });
};

export const verifyToken = async (req, res) => {
  const { token } = req.cookies;

  if (!token) return res.sendStatus(401).json({ message: "Unauthorized" });

  jwt.verify(token, TOKEN_SECRET, async (err, user) => {
    if (err) return res.sendStatus(401).json({ message: "Unauthorized" });

    const userFound = await User.findById(user.id);
    if (!userFound) return res.status(401).json({ message: "User not found" });
    return res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
    });
  });
};
